'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Users, Star, MapPin, Calendar, Phone } from 'lucide-react';
import { IRoute } from '@/types/types';

interface SidebarProps {
  routes: IRoute[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  variant?: string;
}

function Sidebar(props: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const categories = [
    { name: 'All Escorts', path: '/escorts/', icon: Users },
    // { name: 'Featured', path: '/escorts/featured', icon: Star },
    { name: 'Local Escorts', path: '/escorts/local', icon: MapPin },
    { name: 'Available Today', path: '/escorts/available-today', icon: Calendar },
    // { name: 'Directory', path: '/escorts/directory', icon: Phone },
  ];

  const CategoryButton = ({ name, path, icon: Icon, isMobile = false }) => {
    const isActive = pathname === path;
    return (
      <button
        onClick={() => router.push(path)}
        className={`
          w-full px-6 py-4 text-left
          rounded transition-all duration-200
          flex items-center gap-3 shadow-md
          ${isActive
            ? 'bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
            : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
          }
          ${isMobile ? 'whitespace-nowrap' : ''}
          border border-gray-100 dark:border-zinc-700
        `}
      >
        <Icon
          className={`h-5 w-5 ${isActive
            ? 'text-purple-700 dark:text-purple-300'
            : 'text-gray-400 dark:text-gray-500'
            }`}
        />
        <span className="text-base font-medium">{name}</span>
      </button>
    );
  };

  const MobileSidebar = () => (
    <div className="mx-2 mb-4 mt-16 xl:mt-0 xl:hidden">
      <div className="grid grid-cols-2 gap-3 p-4">
        {categories.map((category) => (
          <CategoryButton
            key={category.path}
            name={category.name}
            path={category.path}
            icon={category.icon}
            isMobile={true}
          />
        ))}
      </div>
    </div>
  );

  const DesktopSidebar = () => (
    <div
      className={`
        hidden xl:block fixed top-0 left-0 h-full w-[300px]
        pt-[70px] bg-transparent dark:bg-transparent
        border-r border-gray-200 dark:border-zinc-800
        ${props.variant === 'auth' ? 'xl:hidden' : ''}
      `}
    >
      <div className="flex flex-col gap-3 p-4">
        {categories.map((category) => (
          <CategoryButton
            key={category.path}
            name={category.name}
            path={category.path}
            icon={category.icon}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
}

export default Sidebar;