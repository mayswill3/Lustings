'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { OpenContext, UserContext, UserDetailsContext } from '@/contexts/layout';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Menu, Sun, Moon, HelpCircle, LogOut, Settings, CreditCard, MessageSquareQuestion } from 'lucide-react';

const supabase = createClient();

export default function HeaderLinks(props: { [x: string]: any }) {
  const { open, setOpen } = useContext(OpenContext);
  const user = useContext(UserContext);
  const { theme, setTheme } = useTheme();
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  // State for controlling dropdowns
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push('/dashboard/signin');
  };

  // Helper component for menu items
  const MenuItem = ({ icon: Icon, children, onClick, className = '' }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-800 ${className}`}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </button>
  );

  return (
    <div className="flex items-center space-x-4">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setOpen(false)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors xl:hidden"
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-600" />
        ) : (
          <Sun className="h-5 w-5 text-gray-300" />
        )}
      </button>

      {/* Help Dropdown */}
      <DropdownMenu className="relative">
        <DropdownMenuTrigger
          onClick={() => setIsHelpOpen(!isHelpOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        >
          <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          isOpen={isHelpOpen}
          className="w-56 right-0 z-50 py-2"
        >
          <MenuItem
            icon={CreditCard}
            onClick={() => window.open('https://horizon-ui.com/boilerplate-shadcn#pricing', '_blank')}
          >
            Pricing
          </MenuItem>
          <MenuItem
            icon={MessageSquareQuestion}
            onClick={() => window.location.href = 'mailto:hello@horizon-ui.com'}
          >
            Help & Support
          </MenuItem>
          <div className="my-1 border-t border-gray-200 dark:border-zinc-700" />
          <MenuItem
            icon={HelpCircle}
            onClick={() => window.location.href = '/#faqs'}
          >
            FAQs & More
          </MenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Menu Dropdown */}
      <DropdownMenu className="relative">
        <DropdownMenuTrigger
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <Avatar size="small">
            {/* <AvatarImage
              src={user?.user_metadata.profilePictures[0]}
              alt={user?.user_metadata.full_name || user?.email}
            /> */}
            <AvatarFallback className="text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
              {user?.user_metadata.full_name
                ? user.user_metadata.full_name[0]
                : user?.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          isOpen={isUserMenuOpen}
          className="w-56 right-0 z-50"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
            <p className="text-sm font-medium dark:text-white">
              {user?.user_metadata.full_name || user?.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          <div className="py-2">
            <MenuItem
              icon={Settings}
              onClick={() => router.push('/dashboard/settings')}
            >
              Settings
            </MenuItem>
            <MenuItem
              icon={LogOut}
              onClick={handleSignOut}
              className="text-red-600 dark:text-red-400"
            >
              Sign out
            </MenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}