import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  console.log("API route called");
  const { prompt, aspectRatio } = await request.json();
  console.log("Received prompt:", prompt);
  console.log("Received aspectRatio:", aspectRatio);

  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("Replicate API token not configured");
    return NextResponse.json({ error: 'Replicate API token not configured' }, { status: 500 });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    console.log("Calling Replicate API...");
    const input = {
      prompt: prompt,
      num_outputs: 1,
      aspect_ratio: aspectRatio,
      output_format: "webp",
      output_quality: 80
    };

    const output = await replicate.run("black-forest-labs/flux-schnell", { input });

    console.log("Replicate output:", JSON.stringify(output, null, 2));

    if (!Array.isArray(output)) {
      console.error("Unexpected output format from Replicate API");
      return NextResponse.json({ error: 'Unexpected output format from Replicate API' }, { status: 500 });
    }

    return NextResponse.json({ images: output });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json({ error: 'Failed to generate images', details: (error as Error).message }, { status: 500 });
  }
}