import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const SEED_FILES_DIR = './src/endpoints/seed/files'

interface SeedFileInfo {
  name: string
  path: string
  size: number
  createdAt: string
  description?: string
}

export async function GET(req: NextRequest) {
  try {
    // Ensure the seed files directory exists
    const fullPath = path.resolve(SEED_FILES_DIR)
    try {
      await fs.access(fullPath)
    } catch {
      // Directory doesn't exist, create it
      await fs.mkdir(fullPath, { recursive: true })
    }

    // Read all files in the directory
    const files = await fs.readdir(fullPath)
    const seedFiles: SeedFileInfo[] = []

    for (const fileName of files) {
      if (fileName.endsWith('.json')) {
        const filePath = path.join(fullPath, fileName)
        const stats = await fs.stat(filePath)

        // Try to read the file to get description
        let description: string | undefined
        try {
          const fileContent = await fs.readFile(filePath, 'utf-8')
          const data = JSON.parse(fileContent)
          description = data.description
        } catch {
          // If we can't read the file or parse it, continue without description
        }

        seedFiles.push({
          name: fileName,
          path: filePath,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
          description,
        })
      }
    }

    // Sort by creation date (newest first)
    seedFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      success: true,
      files: seedFiles,
    })
  } catch (error) {
    console.error('Error listing seed files:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}
