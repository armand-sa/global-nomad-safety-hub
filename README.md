# Global Digital Nomad Safety Hub ⭐🎉⭐🎉

A comprehensive safety platform for digital nomads and global travelers, featuring real-time alerts, safety maps, and travel resources built with Next.js and Supabase.

## Features

- Interactive safety map with global safety scores
- Real-time safety alerts for travelers
- Comprehensive safety blog with expert advice
- User authentication with Supabase Auth
- Admin dashboard for safety alert management
- User profiles with notification preferences
- Mobile-responsive design with dark mode support

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Authentication & Database**: Supabase
- **Styling**: Tailwind CSS with theming

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/global-nomad-safety.git
   cd global-nomad-safety
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable React components
- `/contexts` - React context providers (auth, etc.)
- `/lib` - Utility functions and Supabase client
- `/public` - Static assets
- `/supabase` - Supabase migrations and schema

## Deployment

This project can be deployed to any static hosting service that supports Next.js static exports. Recommended platforms:

- Vercel
- Netlify
- GitHub Pages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)