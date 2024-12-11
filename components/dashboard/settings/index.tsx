'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { Settings2, User as UserIcon, Camera, Heart } from 'lucide-react';
import GeneralDetails from './components/general-details';
import PersonalDetails from './components/personal-details';
import ProfilePictures from './components/profile-pictures';
import AboutYou from './components/interview';

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
    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 hover:text-blue-600 dark:hover:text-blue-400 ${active
      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
      : 'border-transparent text-gray-600 dark:text-gray-400'
      }`}
  >
    {icon}
    {label}
  </button>
);

export default function Settings(props: Props) {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
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
              <div className="border-b border-gray-200 dark:border-zinc-700">
                <div className="flex overflow-x-auto">
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

              {/* Tab Content */}
              <div className="p-6">
                {tabs.find((tab) => tab.id === activeTab)?.component}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}