# Text-to-Image Generator

This project is a simple text-to-image generator built with Next.js. It allows users to input text descriptions and generate corresponding images using AI.

## Features

- Text input for image description
- Style selection
- Mood adjustment
- Color palette selection
- Aspect ratio options
- Image generation using AI (powered by Replicate API)
- Display of generated images
- User authentication

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Replicate API token:
   ```
   REPLICATE_API_TOKEN=your_token_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Navigate to the home page and click "Try it out"
2. Enter your image description
3. Adjust style, mood, color palette, and aspect ratio as desired
4. Click "Generate" to create your image
5. View and download your generated images

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Replicate API for image generation

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Replicate API Documentation](https://replicate.com/docs)

## Deployment

This app can be easily deployed on Vercel. For more information, see the [Next.js deployment documentation](https://nextjs.org/docs/deployment).
