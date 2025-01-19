// app/api/fetch-places/route.ts

import { NextResponse } from 'next/server';

type Place = {
  id: string;
  name: string;
  state: string;
  countryName: string;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get('query');

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Invalid query parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.supportchat.astrotalk.com/AstroChat/cities/allcountries/autocomplete?limit=10&key=${query}`

    );

    const data = await response.json();

    if (data.status === 'success') {
      console.log(data.data)
      return NextResponse.json({ places: data.data });
    } else {
      return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching place data:', error);
    return NextResponse.json({ error: 'Server error while fetching places' }, { status: 500 });
  }
}
