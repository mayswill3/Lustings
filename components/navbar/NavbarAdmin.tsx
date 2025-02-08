'use client';
/* eslint-disable */
import Image from 'next/image';
import AdminNavbarLinks from './NavbarLinksAdmin';
import NavLink from '@/components/link/NavLink';
import TinselLinkLogo from '@/public/TinselLinkLogo.svg';

export default function AdminNavbar(props: {
  brandText: string;
  [x: string]: any;
}) {
  const { brandText } = props;

  return (
    <nav
      className={`fixed top-0 left-0 z-[10] flex w-full flex-row items-center justify-between bg-white/30 py-4 px-8 md:px-32 backdrop-blur-xl transition-all dark:bg-transparent`}
    >
      <div className="ml-[6px]">
        <div className="h-14 md:mb-0 md:w-[284px] md:pt-0">
          <NavLink
            className="text-xs font-normal capitalize text-zinc-950 hover:underline dark:text-white dark:hover:text-white"
            href="/"
          >
            <Image
              width="162"
              height="60"
              className="w-[122px] h-[60px]"
              src={TinselLinkLogo.src}
              alt="TinselLink"
              priority
            />

          </NavLink>
        </div>
      </div>
      <div className="w-[154px] min-w-max md:ml-auto md:w-[unset]">
        <AdminNavbarLinks />
      </div>
    </nav>
  );
}