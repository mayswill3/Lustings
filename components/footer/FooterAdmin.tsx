'use client';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-4">
      <div className="container mx-auto px-4 py-6">
        {/* Top section with logo and social media */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <div className="text-lg font-bold text-zinc-800 dark:text-white">
              TinselLink
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
              The premier platform connecting adult industry professionals with clients across the UK.
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-3">
            {/* Twitter */}
            <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-purple-100 hover:text-purple-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-purple-100 hover:text-purple-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-purple-100 hover:text-purple-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Main footer links - compact grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6 text-sm">
          {/* Alternatives column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">
              Platform Alternatives
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="/classifieds/adultwork-alternative" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 transition-colors">
                  AdultWork Alternative
                </a>
              </li>
              <li>
                <a href="/classifieds/onlyfans-alternative" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 transition-colors">
                  OnlyFans Alternative
                </a>
              </li>
              <li>
                <a href="/classifieds/vivastreet-alternative" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 transition-colors">
                  VivaStreet Alternative
                </a>
              </li>
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">
              Support
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="mailto:info@tinslelink.com" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-2">
              Legal
            </h4>
            <ul className="space-y-1">
              <li>
                <a href="/privacy-policy" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="/compliance" className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 transition-colors">
                  Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Simplified newsletter */}
        <div className="mb-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 py-1 text-sm rounded-md flex-grow border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
            />
            <button className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md">
              Subscribe
            </button>
          </div>
        </div>

        {/* Copyright footer */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-2 md:mb-0 text-zinc-500 dark:text-zinc-400">
              ©{new Date().getFullYear()} TinselLink. All Rights Reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/accessibility" className="text-zinc-500 dark:text-zinc-400 hover:text-purple-600">Accessibility</a>
              <a href="/sitemap" className="text-zinc-500 dark:text-zinc-400 hover:text-purple-600">Sitemap</a>
              <a href="/cookie-preferences" className="text-zinc-500 dark:text-zinc-400 hover:text-purple-600">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}