import SupabaseProvider from './supabase-provider';
import { PropsWithChildren } from 'react';
import '@/styles/globals.css';
import { ThemeProvider } from './theme-provider';

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children
}: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <title>
          TinselLink - Connect with Independent Companions
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Social tags */}
        <meta
          name="keywords"
          content="TinselLink, independent escorts, companion booking, adult services, escort directory"
        />
        <meta
          name="description"
          content="TinselLink - A professional platform connecting independent companions with verified clients. Safe, secure, and discreet booking service."
        />

        {/* Schema.org markup for Google+ */}
        <meta itemProp="name" content="TinselLink" />
        <meta
          itemProp="description"
          content="Professional platform for independent companions and verified clients"
        />
        <meta
          itemProp="image"
          content="https://tinsellink.com/img/social-card.jpg"
        />

        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TinselLink" />
        <meta
          name="twitter:description"
          content="Professional platform for independent companions and verified clients"
        />
        <meta
          name="twitter:image"
          content="https://tinsellink.com/img/social-card.jpg"
        />

        {/* Open Graph data */}
        <meta property="og:title" content="TinselLink" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tinsellink.com" />
        <meta
          property="og:image"
          content="https://tinsellink.com/img/social-card.jpg"
        />
        <meta
          property="og:description"
          content="Professional platform for independent companions and verified clients"
        />
        <meta property="og:site_name" content="TinselLink" />

        <link rel="canonical" href="https://tinsellink.com" />
        <link rel="icon" href="/img/favicon.ico" />
      </head>
      <body
        id="root"
        className="min-h-screen bg-customGrey dark:bg-zinc-900 transition-colors duration-200"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main id="skip" className="text-gray-900 dark:text-gray-100">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}