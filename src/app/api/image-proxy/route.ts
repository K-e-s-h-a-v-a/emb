import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get('url')
  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // cache for 1 day
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to proxy image', details: error }, { status: 500 })
  }
}
