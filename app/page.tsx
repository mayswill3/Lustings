import { createClient } from '@/utils/supabase/server';
import DashboardLayout from '@/components/layout';
import { getUserDetails, getUser } from '@/utils/supabase/queries';

export default async function Dashboard() {
  const supabase = createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  return (
    <DashboardLayout user={user} userDetails={userDetails} title="All Escorts" description="Browse all available escorts">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          3,301 Escorts in United Kingdom
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 - London Area */}
          <div className="border rounded-lg p-6">
            <div className="h-24 bg-gray-900 mb-4 rounded relative overflow-hidden">
              {/* London skyline silhouette */}
              <div className="absolute bottom-0 w-full h-16 bg-contain bg-no-repeat bg-bottom"
                style={{ backgroundImage: `url('/images/london-skyline.svg')` }} />
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-xl font-bold">London</span>
                <span className="text-xl">(2579)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Manchester</span>
                <span>(112)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Liverpool</span>
                <span>(144)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Watford</span>
                <span>(1)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Slough - SL1</span>
                <span>(5)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Hayes - UB3</span>
                <span>(3)</span>
              </li>
            </ul>
          </div>

          {/* Column 2 - Birmingham Area */}
          <div className="border rounded-lg p-6">
            <div className="h-24 bg-amber-100 mb-4 rounded relative overflow-hidden">
              {/* Birmingham skyline silhouette */}
              <div className="absolute bottom-0 w-full h-16 bg-amber-700/20" />
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-xl font-bold">Birmingham</span>
                <span className="text-xl">(107)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Leeds</span>
                <span>(24)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Luton</span>
                <span>(0)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Coventry</span>
                <span>(42)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Sheffield</span>
                <span>(85)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Brighton</span>
                <span>(3)</span>
              </li>
            </ul>
          </div>

          {/* Column 3 - Glasgow Area */}
          <div className="border rounded-lg p-6">
            <div className="h-24 bg-sky-50 mb-4 rounded relative overflow-hidden">
              {/* Glasgow skyline silhouette */}
              <div className="absolute bottom-0 w-full h-16 bg-sky-200/40" />
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-xl font-bold">Glasgow</span>
                <span className="text-xl">(35)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Edinburgh</span>
                <span>(5)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Ilford - IG1</span>
                <span>(3)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Southampton</span>
                <span>(11)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Wolverhampton</span>
                <span>(19)</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Newcastle</span>
                <span>(76)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* All Cities Link */}
        <div className="mt-8 text-right">
          <a href="#" className="text-lg font-medium underline">
            All cities of UK
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}