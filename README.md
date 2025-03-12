# Next.js Video Analysis Application

This is a Next.js project created using [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), focused on analyzing YouTube videos, generating transcripts, and providing AI-powered insights using OpenAI.

## Getting Started

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

Start by entering a YouTube video URL; the app extracts the video ID and redirects you to an analysis page.

## Project Overview

This Next.js application offers comprehensive video analysis, including:

### Video Analysis

- Extract video ID and redirect users to a dedicated analysis page.
- Check database for existing video analysis to optimize resource use.

### Key Components

- **Video Analysis Page** (`app/video/[videoId]/analysis/page.tsx`): Manages video analysis initialization.
- **Create or Retrieve Video**: Checks existing videos or creates a new entry (`createOrGetVideo.ts`).

### Workflow

1. User submits video URL.
2. System extracts the video ID.
3. Redirects user to analysis page.
4. Backend checks if video analysis exists or initiates a new analysis.

## Transcript Generation

- Fetches transcripts using YouTube's API.
- Caches transcripts in the database to reduce API calls.

### Key Components

- **Transcript Generation** (`components/Transcription.tsx`): Handles transcript requests.
- **YouTube Transcript Fetching** (`actions/getYoutubeTranscript.ts`): Retrieves and caches transcripts.

## AI Agent Integration

Provides a conversational interface leveraging OpenAI to:

- Answer user queries based on video content.
- Generate insights, summaries, and titles.
- Access transcript data and other generated content.

### Key Components

- **Chat API Endpoint** (`app/api/chat/openai/route.ts`): Manages AI conversations using GPT-4.

### AI Capabilities

- Transcript summarization
- Title suggestions
- Content analysis and user query responses

## External Services & Integrations

- **OpenAI:** Powers AI-driven insights and interactions.
- **Clerk Authentication**: User management and secure authentication.
- **YouTube API**: Fetches video metadata and transcripts.
- **Convex Database**: Stores user data, transcripts, and analysis information.
- **Feature Flags**: Manages feature availability and analytics tracking.

## Tech Stack

- **Frontend**: Next.js (React framework)
- **Backend**: Next.js API Routes
- **AI Integration**: OpenAI GPT-4
- **Authentication**: Clerk
- **Data Storage**: Convex
- **Deployment**: Vercel

## Development and Deployment

- Development environment setup and local server testing (`npm run dev`)
- Easy deployment through [Vercel](https://vercel.com/)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Documentation](https://vercel.com/docs)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Clerk Authentication](https://clerk.com/docs)

## Generate Dependency Graph

![graph and relation](./public/dependency-graph.svg)


This README provides an overview of the project's capabilities, tech stack, and workflow, ensuring a smooth onboarding experience for developers.





