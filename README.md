# Talens Interview Application

A Next.js-based interview platform that facilitates structured interviews with audio recording, transcription, and summary generation capabilities.

## Features

- User authentication with access code protection
- Guided interview process
- Audio recording and transcription
- Response storage using Supabase
- Interview summary generation with OpenAI integration
- Modern UI with Tailwind CSS

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI API
- Jest for testing

## Prerequisites

Before running this application, make sure you have:
- Node.js installed
- A Supabase account and project
- An OpenAI API key
- Environment variables properly configured

## Environment Setup

Copy the `.env.example` file to create your own `.env` file:

```bash
cp .env.example .env
```

Then replace the placeholder values in `.env` with your actual credentials:
```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Note: Never commit your actual API keys and secrets to version control. The values above are just placeholders.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Main application routes and pages
- `/components` - Reusable UI components
- `/contexts` - React context providers
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and configurations
- `/public` - Static assets

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
