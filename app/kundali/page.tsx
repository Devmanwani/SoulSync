//@ts-nocheck
'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KundaliResponse {
  chartUrl: string;
  generatedContent: string;
}

const GenerateKundaliPage = () => {
  const [chartUrl, setChartUrl] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('kundaliFormData');
    const initialFormData = storedData ? JSON.parse(storedData) : null;

    // Redirect if no form data found
    if (!initialFormData) {
      router.push('/generate-kundali');
      return;
    }

    // Prepare data to send to the API
    const { year, month, day, hour, minute, second, latitude, longitude, timezone, name } = initialFormData;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/getImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            year,
            month,
            date: day,
            hours: hour,
            minutes: minute,
            seconds: second,
            latitude,
            longitude,
            timezone,
            name
          }),
        });

        const result: KundaliResponse = await response.json();

        if (response.ok) {
          setChartUrl(result.chartUrl);
          setGeneratedContent(result.generatedContent);
        } else {
          setError(result.error || 'Failed to generate the chart');
        }
      } catch (error) {
        setError('Internal Server Error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-lg">Loading your Kundali analysis...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Your Kundali Chart</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {chartUrl && (
                <img
                  src={chartUrl}
                  alt="Kundali Chart"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              )}
            </CardContent>
          </Card>

          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Astrological Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {/* Split the content by newlines and map to paragraphs */}
                  {generatedContent.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerateKundaliPage;
