'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { Settings2, User as UserIcon, Camera, Heart, Map, HelpCircle, Clock } from 'lucide-react';
import GeneralDetails from './components/general-details';
import PersonalDetails from './components/personal-details';
import ProfilePictures from './components/profile-pictures';
import AboutYou from './components/interview';
import Escorts from './components/escorting-options';
import FAQDetails from './components/faq-detail';
import AvailabilitySettings from './components/availability-settings/availability-settings';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton = ({ active, onClick, icon, label }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium whitespace-nowrap
          transition-all duration-200 border-b-2 hover:text-blue-600 dark:hover:text-blue-400 
          ${active
        ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
        : 'border-transparent text-gray-600 dark:text-gray-400'
      }`}
  >
    <span className="sm:hidden">{icon}</span>
    <span className="hidden sm:inline">{icon}</span>
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden">{label.split(' ')[0]}</span>
  </button>
);

export default function Settings(props: Props) {
  const [activeTab, setActiveTab] = useState('general');

  // Base tabs that are always shown
  const baseTabs = [
    {
      id: 'general',
      label: 'General Details',
      icon: <Settings2 className="w-4 h-4" />,
      component: <GeneralDetails user={props.user} userDetails={props.userDetails} />,
    },
    {
      id: 'personal',
      label: 'Personal Details',
      icon: <UserIcon className="w-4 h-4" />,
      component: <PersonalDetails user={props.user} userDetails={props.userDetails} />,
    },
    {
      id: 'about',
      label: 'About You',
      icon: <Heart className="w-4 h-4" />,
      component: <AboutYou />,
    },
    {
      id: 'pictures',
      label: 'Pictures',
      icon: <Camera className="w-4 h-4" />,
      component: <ProfilePictures user={props.user} userDetails={props.userDetails} />,
    },
  ];

  // Service provider specific tabs
  const serviceProviderTabs = [
    {
      id: 'availability',
      label: 'Availability',
      icon: <Clock className="w-4 h-4" />,
      component: <AvailabilitySettings user={props.user} userDetails={props.userDetails} />,
    },
    {
      id: 'escorts',
      label: 'Escorts',
      icon: <Map className="w-4 h-4" />,
      component: <Escorts user={props.user} userDetails={props.userDetails} />,
    },
    {
      id: 'faq',
      label: 'FAQ',
      icon: <HelpCircle className="w-4 h-4" />,
      component: <FAQDetails />,
    },
  ];

  // Combine tabs based on member_type
  const tabs = props.user?.user_metadata?.member_type === 'Offering Services'
    ? [...baseTabs, ...serviceProviderTabs]
    : baseTabs;

  // Set default tab to 'availability' if user is a service provider
  useEffect(() => {
    if (props.user?.user_metadata?.member_type === 'Offering Services') {
      setActiveTab('availability');
    }
  }, [props.user?.user_metadata?.member_type]);

  // If current active tab is not available for the user, reset to 'general'
  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab('general');
    }
  }, [tabs, activeTab]);

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Account Settings"
      description="Profile settings."
    >
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
        <div className="relative mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>

            {/* Main Content */}
            <Card className="overflow-hidden bg-white dark:bg-zinc-800 shadow-sm">
              {/* Tabs Navigation */}
              <>
                {/* Mobile Buttons Grid */}
                <div className="sm:hidden border-b border-gray-200 dark:border-zinc-700 p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex items-center justify-center gap-2 px-3 py-3 
                          rounded-lg text-sm font-medium transition-all duration-200
                          ${activeTab === tab.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                            : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700'
                          }
                          border
                        `}
                      >
                        {tab.icon}
                        <span className="truncate">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop Tabs */}
                <div className="hidden sm:block border-b border-gray-200 dark:border-zinc-700">
                  <div className="flex overflow-x-auto scrollbar-hide -mb-px">
                    {tabs.map((tab) => (
                      <TabButton
                        key={tab.id}
                        active={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        icon={tab.icon}
                        label={tab.label}
                      />
                    ))}
                  </div>
                </div>
              </>

              {/* Tab Content */}
              <div className="p-3 sm:p-6">
                {tabs.find((tab) => tab.id === activeTab)?.component}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}