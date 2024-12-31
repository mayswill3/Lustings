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
import { Sun, Moon, HelpCircle, LogOut, Settings, CreditCard, X, Mail, Coins, Plus } from 'lucide-react';
import { CreditPurchaseDialog } from '@/components/credit-purchase/CreditPurchaseDialog';
import { Button } from '@/components/ui/button';

const supabase = createClient();

export default function HeaderLinks(props: { [x: string]: any }) {
  const { theme, setTheme } = useTheme();
  const user = useContext(UserContext);
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [credits, setCredits] = useState({ regular: 0, trial: 0 });
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

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

  // Fetch credits
  useEffect(() => {
    const fetchCredits = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('users')
          .select('credits, trial_credits')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setCredits({
            regular: data.credits || 0,
            trial: data.trial_credits || 0
          });
        }
      }
    };

    fetchCredits();
  }, [user]);


  const handleSignOut = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push('/dashboard/signin');
  };

  // Helper component for menu items
  const MenuItem = ({ icon: Icon, children, onClick, className = '' }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-2 text-sm 
                 text-gray-700 dark:text-gray-200 
                 hover:bg-gray-100 dark:hover:bg-zinc-800/50 
                 transition-colors duration-200 ${className}`}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </button>
  );

  const MobileNav = () => (
    <div className="flex items-center space-x-4">
      {user && (
        <button
          onClick={() => router.push('/bookings')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-full transition-colors duration-200"
        >
          <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      )}

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-full transition-colors duration-200"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-600" />
        ) : (
          <Sun className="h-5 w-5 text-gray-300" />
        )}
      </button>

      {user ? (
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
      ) : (
        <Button
          onClick={() => router.push('/dashboard/signin/password_signin')}
          variant="ghost"
          size="sm"
        >
          Sign in
        </Button>
      )}
    </div>
  );


  const DrawerMenuItem = ({ icon: Icon, children, onClick, variant }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-3 text-sm 
                   ${variant === 'destructive'
          ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50'}
                   transition-colors duration-200 rounded-lg`}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </button>
  );

  const CreditsDisplay = ({ className = '', showPurchaseButton = false }) => (
    <div className={`px-4 py-2 space-y-2 border-t border-gray-200 dark:border-zinc-700 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Coins className="h-4 w-4" />
          Credits
        </span>
        <span className="font-medium text-gray-900 dark:text-white">{credits.regular}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Trial Credits
        </span>
        <span className="font-medium text-gray-900 dark:text-white">{credits.trial}</span>
      </div>
      {showPurchaseButton && (
        <Button
          onClick={() => setIsPurchaseDialogOpen(true)}
          className="w-full mt-2 flex items-center justify-center gap-2"
          variant="default"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Buy Credits
        </Button>
      )}
    </div>
  );

  const MobileMenu = () => (
    <div className="md:hidden">
      <MobileNav />
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-[96vh] bg-white dark:bg-zinc-900">
          <DrawerHeader className="border-b border-gray-200 dark:border-zinc-700">
            <DrawerTitle className="flex items-center justify-between text-gray-900 dark:text-gray-100">
              <span>Menu</span>
              <DrawerClose className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-full">
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </DrawerClose>
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  {user?.user_metadata.full_name
                    ? user.user_metadata.full_name[0]
                    : user?.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.user_metadata.full_name || user?.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Credits Display with Purchase Button */}
            <CreditsDisplay showPurchaseButton={true} />

            <div className="border-t border-gray-200 dark:border-zinc-700" />

            {/* Menu Items */}
            <div className="space-y-1">
              <DrawerMenuItem
                icon={Mail}
                onClick={() => router.push('/bookings')}
              >
                Bookings
              </DrawerMenuItem>
              <DrawerMenuItem
                icon={Settings}
                onClick={() => router.push('/dashboard/settings')}
              >
                Settings
              </DrawerMenuItem>
              <DrawerMenuItem
                icon={LogOut}
                variant="destructive"
                onClick={handleSignOut}
              >
                Sign out
              </DrawerMenuItem>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );

  const DesktopMenu = () => (
    <div className="hidden md:flex items-center space-x-4">
      {user && (
        <button
          onClick={() => router.push('/bookings')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-full transition-colors duration-200"
        >
          <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      )}

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-full transition-colors duration-200"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-600" />
        ) : (
          <Sun className="h-5 w-5 text-gray-300" />
        )}
      </button>

      {user ? (

        <DropdownMenu className="relative" ref={userRef}>
          <DropdownMenuTrigger
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsHelpOpen(false);
            }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <Avatar>
              <AvatarFallback className="text-sm font-semibold 
                                     bg-blue-100 dark:bg-blue-900 
                                     text-blue-600 dark:text-blue-400">
                {user?.user_metadata.full_name
                  ? user.user_metadata.full_name[0]
                  : user?.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            isOpen={isUserMenuOpen}
            className="w-56 right-0 z-50 bg-white dark:bg-zinc-900 
                    border border-gray-200 dark:border-zinc-700"
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.user_metadata.full_name || user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>

            {/* Credits Display with Purchase Button */}
            <CreditsDisplay showPurchaseButton={true} />

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
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Sign out
              </MenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={() => router.push('/dashboard/signin/password_signin')}
          variant="ghost"
          size="sm"
        >
          Sign in
        </Button>
      )}
    </div>
  );

  return (
    <>
      <MobileMenu />
      <DesktopMenu />

      {/* Credit Purchase Dialog */}
      <CreditPurchaseDialog
        isOpen={isPurchaseDialogOpen}
        onClose={() => setIsPurchaseDialogOpen(false)}
        userId={user?.id}
      />
    </>
  );
}