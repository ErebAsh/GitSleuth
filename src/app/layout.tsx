import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import 'flatpickr/dist/flatpickr.min.css';
import './globals.css';
import TubesBackground from '@/components/canvas/TubesBackground';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://erebash.github.io/GitSleuth'),
  title: {
    default: 'GitSleuth — Precision GitHub Activity Timing & Developer Analytics',
    template: '%s | GitSleuth',
  },
  description:
    'Track and analyze exact creation, merge, and closing timestamps for GitHub pull requests and issues with interactive 3D developer telemetry.',
  keywords: [
    'GitHub',
    'GitHub activity tracker',
    'developer telemetry',
    'pull request timestamps',
    'issue velocity engine',
    'GitHub REST API v3',
    'open source analytics',
    'GitSleuth',
  ],
  authors: [{ name: 'ErebAsh', url: 'https://github.com/ErebAsh' }],
  creator: 'ErebAsh',
  publisher: 'GitSleuth',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://erebash.github.io/GitSleuth',
    siteName: 'GitSleuth',
    title: 'GitSleuth — Precision GitHub Activity Timing & Developer Analytics',
    description:
      'Track and analyze exact creation, merge, and closing timestamps for GitHub pull requests and issues with interactive 3D developer telemetry.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitSleuth — Precision GitHub Activity Timing & Developer Analytics',
    description:
      'Track and analyze exact creation, merge, and closing timestamps for GitHub pull requests and issues with interactive 3D developer telemetry.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#08090d',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GitSleuth',
  url: 'https://erebash.github.io/GitSleuth',
  description:
    'Interactive 3D developer telemetry and precision GitHub activity timing engine for pull requests and issues.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'ErebAsh',
    url: 'https://github.com/ErebAsh',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <TubesBackground />
        {children}
      </body>
    </html>
  );
}
