import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'varad_11082005';

  try {
    // 1. Try primary public API
    let res = await fetch(`https://codechef-api.vercel.app/handle/${username}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (res.ok) {
      const data = await res.json();
      if (data && (data.currentRating || data.rating)) return NextResponse.json(data);
    }

    // 2. Backup API Endpoint
    res = await fetch(`https://cp-rating-api.vercel.app/codechef/${username}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Failed to fetch CodeChef profile from APIs' }, { status: 502 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Server fetch failed', details: error.message }, { status: 500 });
  }
}
