import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { filePath } = body

    if (!filePath) {
      return NextResponse.json(
        {
          success: false,
          error: 'File path is required',
        },
        { status: 400 },
      )
    }

    // Validate that the file path is within the seed files directory
    const seedFilesDir = path.resolve('./src/endpoints/seed/files')
    const requestedPath = path.resolve(filePath)

    if (!requestedPath.startsWith(seedFilesDir)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file path',
        },
        { status: 400 },
      )
    }

    // Check if file exists
    try {
      await fs.access(requestedPath)
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'File not found',
        },
        { status: 404 },
      )
    }

    // Read the file
    const fileContent = await fs.readFile(requestedPath)
    const fileName = path.basename(requestedPath)

    // Return the file as a download
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileContent.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error downloading seed file:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}
