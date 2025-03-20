"use client";

import Link from "next/link";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx';
import { NavigationItem } from '@/app/lib/definitions';
import { Button } from "@/app/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/ui/dropdown-menu";
import {
    IconButton,
    DropdownMenu as DropdownMenuRoot,
  } from '@radix-ui/themes';
  import {
    HamburgerMenuIcon,
  } from '@radix-ui/react-icons';
import ThemeToggle from "@/app/ui/theme-toggle";
import { theme, appConfig } from "@/app/app.config";

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

const Navbar = () => {
    return (
        <Disclosure as="nav" className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <Image
                            src={appConfig.logo.path}
                            alt={appConfig.logo.alt}
                            width={32}
                            height={32}
                            style={{
                                height: "2rem",
                                width: "auto",
                                marginRight: "0.5rem",
                            }}
                        />
                        <div className="flex items-center">
                            <span
                                className="hidden sm:inline"
                                style={{ color: theme.colors.text.primary }}
                            >
                                {appConfig.title}
                            </span>
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
                        <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                    <p 
                        className="text-white hidden md:block"
                        style={{ marginLeft: "1rem", marginRight: "1rem", overflow: "visible" }} // Ensure no text cutting
                    >
                        The Platform to analyze projects with nature cause
                    </p>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <ThemeToggle />
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
                                <Link href="">
                                    <button type={"button"}>Login</button>
                                </Link>
                                </DropdownMenuRoot.Item>
                                <DropdownMenuRoot.Item>
                                <Link href="">
                                    <button type={"button"}>Sign up</button>
                                </Link>
                                </DropdownMenuRoot.Item>
                                <DropdownMenuRoot.Item>
                                <Link href="/connect">
                                    <button type={"button"}>Blockchain</button>
                                </Link>
                                </DropdownMenuRoot.Item>

                                <DropdownMenuSeparator />
        
                                <DropdownMenuRoot.Item>Docs</DropdownMenuRoot.Item>
                                </DropdownMenuRoot.Content>
                            </DropdownMenuRoot.Root>
                            </div>
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