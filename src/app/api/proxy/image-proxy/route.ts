import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing or invalid image URL' }, { status: 400 });
  }

  try {
    // Fetch the image
    const imageResponse = await fetch(url);

    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }

    const contentType = imageResponse.headers.get('content-type') || 'application/octet-stream';
    const imageBuffer = await imageResponse.arrayBuffer();

    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return NextResponse.json({ error: 'Server error while proxying the image' }, { status: 500 });
  }
}
