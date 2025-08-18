import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createSeedFromFile } from '@/endpoints/seed/generate-seed-file'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()

    const { seedFilePath = './src/endpoints/seed/current-data-seed.json', clearExisting = true } =
      body

    // Create a mock request object for Payload
    const mockReq = {
      headers: new Headers(),
      user: null,
    } as any

    await createSeedFromFile({
      payload,
      req: mockReq,
      seedFilePath,
      clearExisting,
    })

    return NextResponse.json({
      success: true,
      message: 'Database seeded from file successfully',
      seedFilePath,
    })
  } catch (error) {
    console.error('Error seeding from file:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}
