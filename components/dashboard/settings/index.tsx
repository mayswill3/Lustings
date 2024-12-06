'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import GeneralDetails from './components/general-details';
import PersonalDetails from './components/personal-details';
import ProfilePictures from './components/profile-pictures';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

function AccountDetails() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Account Details</h2>
      {/* Place the account details form component here */}
    </div>
  );
}

function LocationDetails() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Location Details</h2>
      {/* Place the location details form component here */}
    </div>
  );
}

function Preferences() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Preferences</h2>
      {/* Place the preferences form component here */}
    </div>
  );
}

export default function Settings(props: Props) {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <DashboardLayout user={props.user}
      userDetails={props.userDetails}
      title="Account Settings"
      description="Profile settings.">
      <div className="relative mx-auto max-w-screen-lg flex flex-col lg:pt-[100px] lg:pb-[100px]">
        <Card className="w-full p-6">
          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 text-lg ${activeTab === 'general'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
                }`}
            >
              General Details
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2 text-lg ${activeTab === 'personal'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
                }`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-2 text-lg ${activeTab === 'preferences'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
                }`}
            >
              Pictures
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'general' && <GeneralDetails user={props.user} userDetails={{}} />}
            {activeTab === 'personal' && <PersonalDetails user={props.user} userDetails={{}} />}
            {activeTab === 'preferences' && <ProfilePictures user={props.user} userDetails={{}} />}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
