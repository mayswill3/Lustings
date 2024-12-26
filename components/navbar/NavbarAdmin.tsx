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
      className={`fixed top-0 left-0 z-[10] flex w-full flex-row items-center justify-between bg-white/30 py-2 px-4 backdrop-blur-xl transition-all dark:bg-transparent`}
    >
      <div className="ml-[6px]">
        <div className="h-10 md:mb-0 md:w-[224px] md:pt-0">
          {/* <a
            className="hidden text-xs font-normal text-zinc-950 hover:underline dark:text-white dark:hover:text-white md:inline"
            href=""
          >
            Pages
            <span className="mx-1 text-xs text-zinc-950 hover:text-zinc-950 dark:text-white">
              {' '}
              /{' '}
            </span>
          </a> */}
          <NavLink
            className="text-xs font-normal capitalize text-zinc-950 hover:underline dark:text-white dark:hover:text-white"
            href="/"
          >
            {/* {brandText} */}
            <Image
              width="108"
              height="40"
              className="w-[108px] h-[40px]"
              src={TinselLinkLogo.src}
              alt="TinselLink"
              priority
            />
          </NavLink>
        </div>
        {/* <p className="text-md shrink capitalize text-zinc-950 dark:text-white md:text-3xl">
          <NavLink
            href="#"
            className="font-bold capitalize hover:text-zinc-950 dark:hover:text-white"
          >
            {brandText}
          </NavLink>
        </p> */}
      </div>
      <div className="w-[154px] min-w-max md:ml-auto md:w-[unset]">
        <AdminNavbarLinks />
      </div>
    </nav>
  );
}
