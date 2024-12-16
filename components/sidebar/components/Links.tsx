'use client';

import NavLink from '@/components/link/NavLink';
import { IRoute } from '@/types/types';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useCallback } from 'react';

interface SidebarLinksProps extends PropsWithChildren {
  routes: IRoute[];
  horizontal?: boolean;
  [x: string]: any;
}

export function SidebarLinks(props: SidebarLinksProps) {
  const pathname = usePathname();
  const { routes, horizontal = false } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname]
  );

  const activeLayout = useCallback(
    (routeName: string) => {
      return pathname?.includes('/ai');
    },
    [pathname]
  );

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, key) => {
      if (route.disabled) {
        return (
          <div
            key={key}
            className={`${horizontal ? 'inline-flex' : 'flex'
              } w-full max-w-full cursor-not-allowed items-center justify-between ${horizontal ? 'px-4 py-2' : 'py-3 pl-8'
              } font-medium`}
          >
            <div className="w-full items-center justify-center">
              <div className="flex w-full items-center justify-center">
                <div
                  className={`text mr-3 ${horizontal ? '' : 'mt-1.5'
                    } text-zinc-950 opacity-30 dark:text-white`}
                >
                  {route.icon}
                </div>
                <p
                  className={`mr-auto text-sm text-zinc-950 opacity-30 dark:text-white ${horizontal ? 'whitespace-nowrap' : ''
                    }`}
                >
                  {route.name}
                </p>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div key={key} className={horizontal ? 'inline-block' : 'block'}>
            <div
              className={`${horizontal ? 'inline-flex mx-1' : 'flex'
                } w-full max-w-full items-center justify-between rounded-lg ${horizontal ? 'px-4 py-2' : 'py-3 pl-8'
                } ${activeRoute(route.path.toLowerCase())
                  ? 'bg-zinc-950 font-semibold text-white dark:bg-white dark:text-zinc-950'
                  : 'font-medium text-zinc-950 dark:text-zinc-400'
                }`}
            >
              <NavLink
                href={route.layout ? route.layout + route.path : route.path}
                key={key}
                styles={{ width: '100%' }}
              >
                <div className="w-full items-center justify-center">
                  <div className="flex w-full items-center justify-center">
                    <div
                      className={`text mr-3 ${horizontal ? '' : 'mt-1.5'
                        } ${activeRoute(route.path.toLowerCase())
                          ? 'font-semibold text-white dark:text-zinc-950'
                          : 'text-zinc-950 dark:text-white'
                        } `}
                    >
                      {route.icon}
                    </div>
                    <p
                      className={`mr-auto text-sm ${horizontal ? 'whitespace-nowrap' : ''
                        } ${activeRoute(route.path.toLowerCase())
                          ? 'font-semibold text-white dark:text-zinc-950'
                          : 'font-medium text-zinc-950 dark:text-zinc-400'
                        }`}
                    >
                      {route.name}
                    </p>
                  </div>
                </div>
              </NavLink>
            </div>
          </div>
        );
      }
    });
  };

  return (
    <div className={horizontal ? 'flex items-center overflow-x-auto' : ''}>
      {createLinks(routes)}
    </div>
  );
}

export default SidebarLinks;