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
import React from 'react';

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

  return (
    <div className="flex min-h-screen flex-col">
      <UserContext.Provider value={props.user}>
        <UserDetailsContext.Provider value={props.userDetails}>
          <OpenContext.Provider value={{ open, setOpen }}>
            <Navbar brandText={getActiveRoute(routes, pathname)} />

            <div className="flex-grow flex flex-row dark:bg-zinc-900">
              {/* This div creates the full-height border */}
              <div className="hidden xl:block w-[300px] border-r border-gray-200 dark:border-zinc-800">
                {/* Sidebar is now a child of this div */}
                <Sidebar routes={routes} setOpen={setOpen} />
              </div>

              {/* Mobile sidebar */}
              <div className="xl:hidden w-full">
                <Sidebar routes={routes} setOpen={setOpen} />
              </div>

              <div className="flex-grow dark:bg-zinc-900">
                <main className={`mx-2.5 transition-all dark:bg-zinc-900 md:pr-2`}>
                  <div className="mx-auto p-2 xl:!pt-[90px] md:p-2">
                    {props.children}
                  </div>
                  <div className="p-3">
                    {/* Additional spacing if needed */}
                  </div>
                </main>
              </div>
            </div>

          </OpenContext.Provider>
        </UserDetailsContext.Provider>
      </UserContext.Provider>
      {/* Footer is now outside the main content area but still within the flex column layout */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;