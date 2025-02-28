import Link from "next/link";
import Image from "next/image";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx';
import { PowerIcon } from '@heroicons/react/24/outline';
import { auth, signOut } from "../../auth";
import { NavigationItem } from '@/app/lib/definitions';
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
    IconButton,
    DropdownMenu as DropdownMenuRoot,
  } from '@radix-ui/themes';
  import {
    HamburgerMenuIcon,
  } from '@radix-ui/react-icons';
import ThemeToggle from "@/app/components/ui/theme-toggle";

const navigation: NavigationItem[] = [
    { name: 'Home', href: '/', current: true },
    { name: 'Dashboard', href: '/dashboard', current: false, subLinks: [
        { name: 'Projects', href: '/dashboard' },
        { name: 'Growth Curves', href: '/dashboard/growth' },
    ]},
    { name: 'Upload', href: '/upload', current: false },
];

function classNames(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

const Navbar = async () => {
    const session = await auth();

    return (
        <Disclosure as="nav" className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Image
                                alt="Nuwa Projects"
                                src="/nuwa-logo1.png"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((link) => (
                                    link.subLinks ? (
                                        <DropdownMenu key={link.name}>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className={clsx(
                                                    "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium",
                                                    {
                                                        'bg-gray-900 text-white': link.current,
                                                    })}
                                                >
                                                    {link.name}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                {link.subLinks.map((subLink) => (
                                                    <DropdownMenuItem key={subLink.name} asChild>
                                                        <Link href={subLink.href}>
                                                            {subLink.name}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={clsx(
                                                "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium",
                                                {
                                                    'bg-gray-900 text-white': link.current,
                                                })}
                                        >
                                            {link.name}
                                        </Link>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <ThemeToggle />
                        { session && session?.user ? (
                            <>
                                <button
                                    type="button"
                                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                                    >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon aria-hidden="true" className="size-6" />
                                </button>
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <Image
                                                alt=""
                                                src="/nuwa-logo1.png"
                                                width={32}
                                                height={32}
                                                className="size-8 rounded-full"
                                            />
                                        </MenuButton>
                                    </div>
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                    >
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Settings
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <form action={async () => {
                                                "use server";
                                                await signOut({ "redirectTo": "/" });
                                            }}>
                                                <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                                                    <PowerIcon className="w-6" />
                                                    <div className="hidden md:block">Sign Out</div>
                                                </button>
                                            </form>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4 p-2">
                            <DropdownMenuRoot.Root>
                                <DropdownMenuRoot.Trigger>
                                <IconButton
                                    variant="ghost"
                                    color="gray"
                                    style={{ marginRight: `calc(var(--space-2) * -1)` }}
                                >
                                    <HamburgerMenuIcon className="text-gray-100" />
                                </IconButton>
                                </DropdownMenuRoot.Trigger>
                                <DropdownMenuRoot.Content align="end">
                                <DropdownMenuRoot.Item>
                                <Link href="/login">
                                    <button type={"button"}>Login</button>
                                </Link>
                                </DropdownMenuRoot.Item>
                                <DropdownMenuRoot.Item>
                                <Link href="/login">
                                    <button type={"button"}>Sign up</button>
                                </Link>
                                </DropdownMenuRoot.Item>

                                <DropdownMenuSeparator />
        
                                <DropdownMenuRoot.Item>Docs</DropdownMenuRoot.Item>
                                </DropdownMenuRoot.Content>
                            </DropdownMenuRoot.Root>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        item.subLinks ? (
                            <div key={item.name}>
                                <DisclosureButton
                                    as="div"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                    {item.name}
                                </DisclosureButton>
                                <div className="pl-4">
                                    {item.subLinks.map((subLink) => (
                                        <DisclosureButton
                                            key={subLink.name}
                                            as="a"
                                            href={subLink.href}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                        >
                                            {subLink.name}
                                        </DisclosureButton>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <DisclosureButton
                                key={item.name}
                                as="a"
                                href={item.href}
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium',
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        )
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
};

export default Navbar;