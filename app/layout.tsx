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
          TinselLink - Find & Book Verified Independent Escorts | Secure & Discreet
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Social tags */}
        <meta
          name="keywords"
          content="TinselLink, independent escorts, companion booking, adult services, escort directory"
        />
        <meta
          name="description"
          content="TinselLink is a premier escort directory for finding and booking verified independent escorts. Enjoy a secure, discreet, and seamless experience."
        />

        {/* Schema.org markup for Google+ */}
        <meta itemProp="name" content="TinselLink" />
        <meta
          itemProp="description"
          content="TinselLink is a premier escort directory for finding and booking verified independent escorts. Enjoy a secure, discreet, and seamless experience."
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
          content="TinselLink is a premier escort directory for finding and booking verified independent escorts. Enjoy a secure, discreet, and seamless experience."
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
        <meta property="og:description" content="Book verified independent escorts easily on TinselLink. Find trusted companions in London, Manchester, Birmingham, and more." />

        <meta property="og:site_name" content="TinselLink" />

        <link rel="canonical" href="https://tinsellink.com" />
        <link rel="icon" href="/img/favicon.ico" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VHHJJEHJNP"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VHHJJEHJNP');
          `
        }} />
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