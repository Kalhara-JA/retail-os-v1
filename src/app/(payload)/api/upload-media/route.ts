import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Check if this is a multipart form data request
    const contentType = req.headers.get('content-type') || ''

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data' },
        { status: 400 },
      )
    }

    // Parse the form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string
    const caption = formData.get('caption') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (4.5MB limit for Vercel)
    const maxSize = 4.5 * 1024 * 1024 // 4.5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: 'File too large',
          message: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the limit of 4.5MB. Please use a smaller file.`,
        },
        { status: 413 },
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type',
          message: `File type "${file.type}" is not supported.`,
        },
        { status: 400 },
      )
    }

    // Create a mock request for Payload
    const mockReq = {
      headers: new Headers(),
      user: null,
    } as any

    // Convert the File to a Node Buffer for Payload
    const arrayBuffer = await file.arrayBuffer()
    const nodeBuffer = Buffer.from(arrayBuffer)

    // Use Payload's media collection to handle the upload
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: alt || '',
        caption: caption
          ? {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: caption,
                        version: 1,
                      },
                    ],
                    direction: null,
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            }
          : undefined,
      },
      file: {
        data: nodeBuffer,
        name: file.name,
        mimetype: file.type,
        size: file.size,
      } as any,
      req: mockReq,
    })

    return NextResponse.json({
      success: true,
      media: mediaDoc,
      message: 'File uploaded successfully',
    })
  } catch (error) {
    console.error('Error uploading file:', error)

    // Handle specific error types
    if (error instanceof Error) {
      if (
        error.message.includes('payload too large') ||
        error.message.includes('FUNCTION_PAYLOAD_TOO_LARGE')
      ) {
        return NextResponse.json(
          {
            error: 'File too large',
            message:
              "The file size exceeds Vercel's payload limit. Please use a file smaller than 4.5MB.",
          },
          { status: 413 },
        )
      }

      if (error.message.includes('memory')) {
        return NextResponse.json(
          {
            error: 'Memory limit exceeded',
            message: 'The file is too large to process. Please use a smaller file.',
          },
          { status: 413 },
        )
      }
    }

    return NextResponse.json(
      {
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 },
    )
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
