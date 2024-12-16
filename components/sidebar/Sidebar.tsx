'use client';

import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Users, Star, MapPin, Calendar, Phone } from 'lucide-react';

interface SidebarProps {
  variant?: string;
}

function Sidebar(props: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const categories = [
    { name: 'All Escorts', path: '/escorts/', icon: Users },
    { name: 'Featured', path: '/escorts/featured', icon: Star },
    { name: 'Local Escorts', path: '/escorts/local', icon: MapPin },
    { name: 'Available Today', path: '/escorts/available', icon: Calendar },
    { name: 'Directory', path: '/escorts/directory', icon: Phone },
  ];

  // Category button component
  const CategoryButton = ({ name, path, icon: Icon, isMobile = false }) => {
    const isActive = pathname === path;
    return (
      <button
        onClick={() => router.push(path)}
        className={`
          w-full px-6 py-4 text-left
          rounded-xl transition-all duration-200
          flex items-center gap-3
          ${isActive
            ? 'bg-purple-50 text-purple-700'
            : 'bg-white text-gray-600 hover:bg-gray-50'
          }
          ${isMobile ? 'whitespace-nowrap' : ''}
          border border-gray-100
        `}
      >
        <Icon className={`h-5 w-5 ${isActive ? 'text-purple-700' : 'text-gray-400'}`} />
        <span className="text-base font-medium">{name}</span>
      </button>
    );
  };

  // Mobile horizontal sidebar with grid
  const MobileSidebar = () => (
    <Card className="mx-2 mb-4 mt-24 xl:mt-0 xl:hidden border-0 shadow-none bg-transparent">
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
    </Card>
  );

  // Desktop vertical sidebar
  const DesktopSidebar = () => (
    <div
      className={`!mt-[70px] lg:!z-99 fixed !z-[99] hidden min-h-full w-[300px] transition-all md:!z-[99] xl:!z-0 xl:block ${props.variant === 'auth' ? 'xl:hidden' : ''
        }`}
    >
      <Card className="m-3 ml-3 w-full !rounded-xl border-0 shadow-none bg-transparent p-4 sm:my-4 sm:mr-4 md:m-5 md:mr-[-50px]">
        <div className="flex flex-col gap-3">
          {categories.map((category) => (
            <CategoryButton
              key={category.path}
              name={category.name}
              path={category.path}
              icon={category.icon}
            />
          ))}
        </div>
      </Card>
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