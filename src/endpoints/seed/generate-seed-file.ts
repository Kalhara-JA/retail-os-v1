import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest } from 'payload'
import fs from 'fs/promises'
import path from 'path'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
  'email-templates' as CollectionSlug,
]
const globals: GlobalSlug[] = ['header', 'footer', 'whatsapp', 'phone', 'cookie-consent']

interface SeedFileData {
  collections: Record<string, any[]>
  globals: Record<string, any>
  generatedAt: string
  version: string
  description: string
}

/**
 * Generate a seed file from current database data
 * This creates a file that can be used as a replacement for the existing seed data
 */
export const generateSeedFile = async ({
  payload,
  req,
  outputPath = './src/endpoints/seed/current-data-seed.json',
  includeUsers = false,
  description,
}: {
  payload: Payload
  req: PayloadRequest
  outputPath?: string
  includeUsers?: boolean
  description?: string
}): Promise<string> => {
  payload.logger.info('Generating seed file from current database...')

  const seedData: SeedFileData = {
    collections: {},
    globals: {},
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
    description: description || 'Seed file generated from current database data',
  }

  // Collect collections data
  for (const collectionSlug of collections) {
    try {
      payload.logger.info(`— Collecting data from collection: ${collectionSlug}`)

      const results = await payload.find({
        collection: collectionSlug,
        depth: 0,
        limit: 1000,
        pagination: false,
      })

      // Clean the data for seeding (remove internal fields)
      const cleanDocs = (results.docs || []).map((doc) => {
        const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...cleanDoc } = doc as any
        return cleanDoc
      })

      seedData.collections[collectionSlug] = cleanDocs
      payload.logger.info(`— Collected ${cleanDocs.length} documents from ${collectionSlug}`)
    } catch (error) {
      payload.logger.error(`— Error collecting from collection ${collectionSlug}:`, error)
    }
  }

  // Collect users if requested
  if (includeUsers) {
    try {
      payload.logger.info(`— Collecting data from collection: users`)

      const results = await payload.find({
        collection: 'users',
        depth: 0,
        limit: 1000,
        pagination: false,
      })

      const cleanDocs = (results.docs || []).map((doc) => {
        const { id, createdAt, updatedAt, ...cleanDoc } = doc as any
        return cleanDoc
      })

      seedData.collections['users'] = cleanDocs
      payload.logger.info(`— Collected ${cleanDocs.length} users`)
    } catch (error) {
      payload.logger.error(`— Error collecting users:`, error)
    }
  }

  // Collect globals data
  for (const globalSlug of globals) {
    try {
      payload.logger.info(`— Collecting data from global: ${globalSlug}`)

      const global = await payload.findGlobal({
        slug: globalSlug,
        depth: 0,
      })

      seedData.globals[globalSlug] = global
      payload.logger.info(`— Collected global: ${globalSlug}`)
    } catch (error) {
      payload.logger.error(`— Error collecting global ${globalSlug}:`, error)
    }
  }

  // Write to file
  const fullPath = path.resolve(outputPath)
  await fs.writeFile(fullPath, JSON.stringify(seedData, null, 2))

  payload.logger.info(`Seed file generated successfully at: ${fullPath}`)
  return fullPath
}

/**
 * Create a seed function that uses the generated seed file
 */
export const createSeedFromFile = async ({
  payload,
  req,
  seedFilePath = './src/endpoints/seed/current-data-seed.json',
  clearExisting = true,
}: {
  payload: Payload
  req: PayloadRequest
  seedFilePath?: string
  clearExisting?: boolean
}): Promise<void> => {
  payload.logger.info('Seeding database from generated seed file...')

  // Read seed file
  const fullPath = path.resolve(seedFilePath)
  const seedData: SeedFileData = JSON.parse(await fs.readFile(fullPath, 'utf-8'))

  if (clearExisting) {
    payload.logger.info(`— Clearing existing data...`)

    // Clear globals
    await Promise.all(
      globals.map((global) =>
        payload.updateGlobal({
          slug: global,
          data: {},
          depth: 0,
          context: {
            disableRevalidate: true,
          },
        }),
      ),
    )

    // Clear collections
    await Promise.all(
      collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
    )

    await Promise.all(
      collections
        .filter((collection) => Boolean(payload.collections[collection].config.versions))
        .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
    )
  }

  // Import collections from seed file
  for (const [collectionSlug, documents] of Object.entries(seedData.collections)) {
    if (documents.length > 0) {
      payload.logger.info(`— Importing ${documents.length} documents to ${collectionSlug}`)

      for (const doc of documents) {
        try {
          await payload.create({
            collection: collectionSlug as CollectionSlug,
            data: doc,
            context: {
              disableRevalidate: true,
            },
          })
        } catch (error) {
          payload.logger.error(`— Error importing document to ${collectionSlug}:`, error)
        }
      }
    }
  }

  // Import globals from seed file
  for (const [globalSlug, globalData] of Object.entries(seedData.globals)) {
    if (globalData) {
      payload.logger.info(`— Importing global: ${globalSlug}`)

      try {
        await payload.updateGlobal({
          slug: globalSlug as GlobalSlug,
          data: globalData,
          context: {
            disableRevalidate: true,
          },
        })
      } catch (error) {
        payload.logger.error(`— Error importing global ${globalSlug}:`, error)
      }
    }
  }

  payload.logger.info('Database seeded from generated seed file successfully!')
}

/**
 * Generate TypeScript seed files for individual collections
 * This creates separate files that can be imported like the existing seed files
 */
export const generateTypeScriptSeedFiles = async ({
  payload,
  req,
  outputDir = './src/endpoints/seed/generated',
  includeUsers = false,
}: {
  payload: Payload
  req: PayloadRequest
  outputDir?: string
  includeUsers?: boolean
}): Promise<void> => {
  payload.logger.info('Generating TypeScript seed files...')

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true })

  const allCollections = includeUsers ? [...collections, 'users' as CollectionSlug] : collections

  // Generate individual collection files
  for (const collectionSlug of allCollections) {
    try {
      payload.logger.info(`— Generating seed file for: ${collectionSlug}`)

      const results = await payload.find({
        collection: collectionSlug,
        depth: 0,
        limit: 1000,
        pagination: false,
      })

      const cleanDocs = (results.docs || []).map((doc) => {
        const { id, createdAt, updatedAt, ...cleanDoc } = doc as any
        return cleanDoc
      })

      // Create TypeScript file content
      const fileContent = `// Auto-generated seed file for ${collectionSlug}
// Generated at: ${new Date().toISOString()}

export const ${collectionSlug} = ${JSON.stringify(cleanDocs, null, 2)}

export default ${collectionSlug}
`

      const filePath = path.join(outputDir, `${collectionSlug}.ts`)
      await fs.writeFile(filePath, fileContent)

      payload.logger.info(`— Generated: ${filePath}`)
    } catch (error) {
      payload.logger.error(`— Error generating seed file for ${collectionSlug}:`, error)
    }
  }

  // Generate globals file
  const globalsData: Record<string, any> = {}
  for (const globalSlug of globals) {
    try {
      const global = await payload.findGlobal({
        slug: globalSlug,
        depth: 0,
      })
      globalsData[globalSlug] = global
    } catch (error) {
      payload.logger.error(`— Error collecting global ${globalSlug}:`, error)
    }
  }

  const globalsContent = `// Auto-generated globals seed file
// Generated at: ${new Date().toISOString()}

export const globals = ${JSON.stringify(globalsData, null, 2)}

export default globals
`

  const globalsPath = path.join(outputDir, 'globals.ts')
  await fs.writeFile(globalsPath, globalsContent)

  payload.logger.info(`— Generated: ${globalsPath}`)
  payload.logger.info('TypeScript seed files generated successfully!')
}
