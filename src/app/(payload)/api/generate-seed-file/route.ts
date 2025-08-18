import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateSeedFile, generateTypeScriptSeedFiles } from '@/endpoints/seed/generate-seed-file'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()

    const {
      outputPath = './src/endpoints/seed/current-data-seed.json',
      includeUsers = false,
      generateTypeScript = false,
      outputDir = './src/endpoints/seed/generated',
      description,
    } = body

    // Create a mock request object for Payload
    const mockReq = {
      headers: new Headers(),
      user: null,
    } as any

    let result: any = {}

    if (generateTypeScript) {
      await generateTypeScriptSeedFiles({
        payload,
        req: mockReq,
        outputDir,
        includeUsers,
      })
      result = {
        success: true,
        message: 'TypeScript seed files generated successfully',
        outputDir,
        includeUsers,
      }
    } else {
      const generatedPath = await generateSeedFile({
        payload,
        req: mockReq,
        outputPath,
        includeUsers,
        description,
      })
      result = {
        success: true,
        message: 'Seed file generated successfully',
        outputPath: generatedPath,
        includeUsers,
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating seed file:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}
