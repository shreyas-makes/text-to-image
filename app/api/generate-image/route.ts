import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  const { prompt, aspectRatio } = await req.json();

  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('REPLICATE_API_TOKEN is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    console.log('Attempting to run Replicate Flux Schnell model...');
    const input = {
      prompt: `${prompt}, ${aspectRatio}`,
    };

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      { input }
    );

    console.log('Replicate Flux Schnell model run successful:', output);
    return NextResponse.json({ images: output });
  } catch (error) {
    console.error('Error generating images:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}