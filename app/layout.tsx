import './globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { AuthProvider } from '@/contexts/AuthContext';
import CookieConsent from '@/components/cookies/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Global Digital Nomad Safety Hub',
  description: 'Your comprehensive resource for safety information while traveling as a digital nomad around the world.',
  keywords: 'digital nomad, travel safety, global safety, remote work, travel alerts',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://globalnomadsafety.com',
    title: 'Global Digital Nomad Safety Hub',
    description: 'Your comprehensive resource for safety information while traveling as a digital nomad around the world.',
    siteName: 'Global Digital Nomad Safety Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Digital Nomad Safety Hub',
    description: 'Your comprehensive resource for safety information while traveling as a digital nomad around the world.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CookieConsent />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}