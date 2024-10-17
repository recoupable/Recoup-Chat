# Luh Tyler's Mr. Skii 3D Video Game Chatbot

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Description

This project is a chatbot application specifically designed for Luh Tyler's 3D Video game promoting his new album Mr. Skii. It uses advanced AI models to provide insights, answer questions, and assist players with various aspects of the game and Luh Tyler's music.

## Features

- AI-powered chatbot using GPT models
- Real-time streaming responses
- User authentication with Privy
- Integration with Supabase for data storage
- Tailwind CSS for styling
- TypeScript for type safety

## Context

This tool provides a comprehensive overview of data to empower marketing managers in optimizing campaign performance.
It delivers context-driven insights through the aggregation of various metrics related to fan engagement and activity. 

Below are the key functionalities offered:
- **Fans Data**: Retrieves detailed user and artist information associated with the latest campaign, allowing for targeted marketing efforts.
- **Followers**: Provides a thorough account of total followers, enabling a clear understanding of audience growth and engagement.
- **Scores Overview**: Offers insights into user scores, showcasing the total scores achieved, the highest scoring fans, and the most recent score updates to identify top performers.
- **Streams Count**: Counts and displays total streams gathered from the database, helping to assess content performance.
- **Recent Activity**: Analyzes user engagement by displaying active users in the last 7 days and tracking new followers gained in the past 24 hours, which assists in evaluating campaign effectiveness.
- **User Score Tracking**: Maintains an ongoing record of user scores, highlighting top performers to recognize and reward engagement.
- **Data-Driven Insights**: Provides actionable insights based on quantitative data to assist in making informed marketing decisions that enhance campaign outcomes.

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

- `app/`: Contains the main application pages and layout
- `components/`: Reusable React components
- `lib/`: Utility functions and services
- `providers/`: React context providers
- `hooks/`: Custom React hooks
- `types/`: TypeScript type definitions
- `packages/`: Custom packages for shared functionality

## Key Components

- `LandingPage`: The main landing page component
- `Chat`: The core chat interface component
- `Suggestions`: Provides chat suggestions to users

## Configuration

This project uses various configuration files:

- `next.config.mjs`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `.eslintrc.json`: ESLint configuration

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Supabase Documentation](https://supabase.io/docs) - learn about Supabase features and API.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS features.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
