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
import { Card } from '@/components/ui/card';
import Link from 'next/link';

// Safer approach to rendering route items
// const RouteItem = ({ route }) => {
//   // Only render the icon if it's a valid React component
//   const IconComponent = route.icon && typeof route.icon === 'function' ? route.icon : null;

//   return (
//     <Link
//       href={route.path}
//       className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
//     >
//       {IconComponent && <IconComponent className="h-5 w-5" />}
//       <span>{route.name}</span>
//     </Link>
//   );
// };

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
    <UserContext.Provider value={props.user}>
      <UserDetailsContext.Provider value={props.userDetails}>
        <OpenContext.Provider value={{ open, setOpen }}>
          <div className="flex h-full w-full flex-col dark:bg-zinc-900">
            <Navbar brandText={getActiveRoute(routes, pathname)} />
            {/* Original Sidebar */}
            <Sidebar routes={routes} setOpen={setOpen} />
            <div className="h-full w-full dark:bg-zinc-900">
              <main className={`mx-2.5 flex-none transition-all dark:bg-zinc-900 md:pr-2 xl:ml-[328px]`}>
                <div className="mx-auto min-h-screen p-2 xl:!pt-[90px] md:p-2">
                  {props.children}
                </div>
                <div className="p-3">
                  <Footer />
                </div>
              </main>
            </div>
          </div>
        </OpenContext.Provider>
      </UserDetailsContext.Provider>
    </UserContext.Provider>
  );
};

export default DashboardLayout;