import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function DELETE(req: NextRequest) {
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

    // Delete the file
    await fs.unlink(requestedPath)

    return NextResponse.json({
      success: true,
      message: 'Seed file deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting seed file:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}
