import { NextResponse } from 'next/server';
import { askAI } from '@/lib/askAi';
import { DataAPIClient } from '@datastax/astra-db-ts';

interface PlanetaryData {
  year: number;
  month: string;
  date: string;
  hours: string;
  minutes: string;
  seconds: string;
  latitude: number;
  longitude: number;
  timezone: number;
  name: string;
}

export async function POST(request: Request) {
  try {
    const body: PlanetaryData = await request.json();
    console.log(body.date);

    // Map month names to month numbers
    const monthMap: { [key: string]: number } = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
      Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
    };

    // Normalize the body to convert string values to numbers
    const normalizedBody = {
      year: Number(body.year),
      month: monthMap[body.month] || 1,
      date: Number(body.date),
      hours: Number(body.hours),
      minutes: Number(body.minutes),
      seconds: Number(body.seconds),
      latitude: body.latitude,
      longitude: body.longitude,
      timezone: 5.5,
      name: body.name
    };

    // Create a date string for matching
    const dateString = `${normalizedBody.year}-${normalizedBody.month.toString().padStart(2, '0')}-${normalizedBody.date.toString().padStart(2, '0')}`;

    // Shared configuration for API calls
    const baseHeaders = {
      'Content-Type': 'application/json',
      'x-api-key': process.env.FREE_ASTROLOGY_API_KEY || '',
    };

    // Fetch chart URL
    const chartResponse = await fetch('https://json.freeastrologyapi.com/horoscope-chart-url', {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify({
        ...normalizedBody,
        config: {
          observation_point: 'topocentric',
          ayanamsha: 'lahiri',
        },
      }),
    });
    const chartData = await chartResponse.json();

    // Fetch planetary data
    const planetaryResponse = await fetch('https://json.freeastrologyapi.com/planets', {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify({
        ...normalizedBody,
        settings: {
          observation_point: 'topocentric',
          ayanamsha: 'lahiri',
        },
      }),
    });
    const planetaryData = await planetaryResponse.json();

    // Log the planetary data for debugging

    // Initialize Astra DB client
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    const database = client.db(process.env.ASTRA_DB_API_ENDPOINT as string);
    const collection = database.collection('astrodata');

    // Extract and process planetary data
    const planetaryOutput = planetaryData.output && planetaryData.output[1]
      ? Object.keys(planetaryData.output[1]).reduce((acc, key) => {
        acc[key] = planetaryData.output[1][key];
        return acc;
      }, {} as Record<string, any>)
      : null;


    if (planetaryOutput && chartData.statusCode === 200) {
      // Store planetary data in Astra DB
      const dbResponse = await collection.findOneAndUpdate(
        {
          name: normalizedBody.name,
          day: body.date
        },
        {
          $set: {
            ...planetaryOutput,
            chartUrl: chartData.output,
            date: dateString,
            name: normalizedBody.name,
            timestamp: new Date(),
            queryDetails: {
              ...normalizedBody,
              originalMonth: body.month
            }
          }
        },
        {
          upsert: true,
          returnDocument: 'after'
        }
      );

      // Instead of returning planetaryData, send it to the LangflowClient function

      const fetchAIResponse = async () => {

        const aiResponse = await askAI(JSON.stringify(planetaryData));
        return aiResponse;
      };

      const response = await fetchAIResponse();
      console.log(response)
      return NextResponse.json({
        chartUrl: chartData.output,
        success: true,
        dbResponse: dbResponse,
        generatedContent: response// Assuming `response.content` is the desired output
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to generate the chart or retrieve planetary data' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
