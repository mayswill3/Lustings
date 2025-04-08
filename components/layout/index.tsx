'use client';

import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { routes } from '@/components/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import { getActiveRoute } from '@/utils/navigation';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import {
  OpenContext,
  UserContext,
  UserDetailsContext
} from '@/contexts/layout';
import React, { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  title: string;
  description: string;
  user: User | null | undefined;
  userDetails: User | null | undefined | any;
}

const DashboardLayout: React.FC<Props> = (props: Props) => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // Calculate and set the footer height as a CSS variable
  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRef.current) {
        const footerHeight = footerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
      }
    };

    // Update on mount and when window resizes
    updateFooterHeight();
    window.addEventListener('resize', updateFooterHeight);

    return () => {
      window.removeEventListener('resize', updateFooterHeight);
    };
  }, []);

  return (
    <>
      <div className="flex h-full w-full flex-col dark:bg-zinc-900">
        <UserContext.Provider value={props.user}>
          <UserDetailsContext.Provider value={props.userDetails}>
            <OpenContext.Provider value={{ open, setOpen }}>
              <Navbar brandText={getActiveRoute(routes, pathname)} />
              {/* Original Sidebar */}
              <Sidebar routes={routes} setOpen={setOpen} />
              <div className="h-full w-full dark:bg-zinc-900">
                <main className={`mx-2.5 flex-none transition-all dark:bg-zinc-900 md:pr-2 xl:ml-[328px]`}>
                  <div className="mx-auto min-h-screen p-2 xl:!pt-[90px] md:p-2">
                    {props.children}
                  </div>
                  <div className="p-3">
                  </div>
                </main>
              </div>
            </OpenContext.Provider>
          </UserDetailsContext.Provider>
        </UserContext.Provider>
      </div>
      <div ref={footerRef}>
        <Footer />
      </div>
    </>
  );
};

export default DashboardLayout;