# Otaku Mirror

An AI-powered journaling and self-reflection platform with anime/manga character integration.

## Features

- AI-Enhanced Journaling with emotional and cognitive analysis
- Character interaction through chat interfaces
- Character scheduling for automated messages
- Integration with LINE messaging platform
- Social media analysis and insights
- User authentication and profile management

## Getting Started

### Prerequisites

- Node.js 16+
- Supabase account
- LINE Developer account (for messaging integration)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/otaku-mirror.git
   cd otaku-mirror
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file with the following variables:
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # LINE Messaging
   LINE_CHANNEL_ACCESS_TOKEN=your-line-channel-access-token
   LINE_CHANNEL_SECRET=your-line-channel-secret
   
   # Cron Jobs
   CRON_SECRET_TOKEN=your-secret-token-for-cron-jobs
   ```

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. Run the Supabase migrations
   ```
   npx supabase migration up
   ```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up the environment variables in Vercel
4. Deploy

### Cron Job Setup

The application uses Vercel Cron Jobs to process scheduled messages. This is configured in the `vercel.json` file.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 