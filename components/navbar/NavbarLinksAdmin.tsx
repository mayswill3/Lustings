'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerMenuItem
} from '@/components/ui/drawer';
import { OpenContext, UserContext } from '@/contexts/layout';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Sun, Moon, HelpCircle, LogOut, Settings, CreditCard, MessageSquareQuestion, X } from 'lucide-react';

const supabase = createClient();

export default function HeaderLinks(props: { [x: string]: any }) {
  const { theme, setTheme } = useTheme();
  const user = useContext(UserContext);
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Refs for dropdown containers
  const helpRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setIsHelpOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Mobile Icons Component
  const MobileNav = () => (
    <div className="flex items-center space-x-4">
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

      {/* Help Icon */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
      >
        <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* User Avatar */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="flex items-center space-x-3 cursor-pointer"
      >
        <Avatar>
          <AvatarFallback className="text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
            {user?.user_metadata.full_name
              ? user.user_metadata.full_name[0]
              : user?.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </button>
    </div>
  );

  // Mobile Menu with Drawer
  const MobileMenu = () => (
    <div className="md:hidden">
      <MobileNav />
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-[96vh]">
          <DrawerHeader className="border-b border-gray-200 dark:border-zinc-700">
            <DrawerTitle className="flex items-center justify-between">
              <span>Menu</span>
              <DrawerClose className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
                <X className="h-5 w-5" />
              </DrawerClose>
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  {user?.user_metadata.full_name
                    ? user.user_metadata.full_name[0]
                    : user?.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium dark:text-white">
                  {user?.user_metadata.full_name || user?.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-zinc-700" />
            <DrawerMenuItem
              icon={Settings}
              onClick={() => router.push('/dashboard/settings')}
            >
              Settings
            </DrawerMenuItem>
            <DrawerMenuItem
              icon={CreditCard}
              onClick={() => window.open('https://horizon-ui.com/boilerplate-shadcn#pricing', '_blank')}
            >
              Pricing
            </DrawerMenuItem>
            <DrawerMenuItem
              icon={MessageSquareQuestion}
              onClick={() => window.location.href = 'mailto:hello@horizon-ui.com'}
            >
              Help & Support
            </DrawerMenuItem>
            <DrawerMenuItem
              icon={HelpCircle}
              onClick={() => window.location.href = '/#faqs'}
            >
              FAQs & More
            </DrawerMenuItem>
            <div className="border-t border-gray-200 dark:border-zinc-700" />
            <DrawerMenuItem
              icon={LogOut}
              variant="destructive"
              onClick={handleSignOut}
            >
              Sign out
            </DrawerMenuItem>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );

  // Desktop Menu with Dropdowns
  const DesktopMenu = () => (
    <div className="hidden md:flex items-center space-x-4">
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
      <DropdownMenu className="relative" ref={helpRef}>
        <DropdownMenuTrigger
          onClick={() => {
            setIsHelpOpen(!isHelpOpen);
            setIsUserMenuOpen(false);
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        >
          <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          isOpen={isHelpOpen}
          className="w-56 right-0 z-50"
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
      <DropdownMenu className="relative" ref={userRef}>
        <DropdownMenuTrigger
          onClick={() => {
            setIsUserMenuOpen(!isUserMenuOpen);
            setIsHelpOpen(false);
          }}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <Avatar>
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

  return (
    <>
      <MobileMenu />
      <DesktopMenu />
    </>
  );
}