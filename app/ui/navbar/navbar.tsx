"use client";

import Link from "next/link";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx';
import { NavigationItem } from '@/app/lib/definitions';
import { appConfig } from "@/app/app.config";
import { useTranslation } from 'react-i18next';
import ThemeToggle from "@/app/ui/navbar/theme-toggle";
import LanguageToggle from "@/app/ui/navbar/language-toggle";
import './navbar.css';

const Navbar = () => {
    const { t } = useTranslation('common');

    const navigation: NavigationItem[] = [
        { name: t('navHome'), href: '/', current: true },
        {
            name: t('navHowItWorks'),
            href: '#how-it-works',
            current: false,
            scrollTo: true
        },
        {
            name: t('navProjects'),
            href: '/dashboard',
            current: false
        },
        {
            name: t('navAboutUs'),
            href: '#about-us',
            current: false,
            scrollTo: true
        },
    ];

    const handleNavClick = (e: React.MouseEvent, href: string, scrollTo?: boolean) => {
        if (scrollTo && href.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    function classNames(...classes: (string | boolean | undefined)[]): string {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <Disclosure as="nav" className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </DisclosureButton>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <Link href="/" className="flex flex-shrink-0 items-center">
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
                                        <span className="hidden sm:inline text-slate-900 dark:text-white font-medium">
                                            {t('navTitle')}
                                        </span>
                                    </div>
                                </Link>
                                
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-1 items-center">
                                        {navigation.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={(e) => handleNavClick(e, link.href, link.scrollTo)}
                                                className={clsx(
                                                    "text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors rounded-md px-3 py-2",
                                                    {
                                                        'text-primary': link.current,
                                                    })}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                        <Link
                                            href="/upload"
                                            className="flex items-center justify-center rounded-full h-10 px-4 bg-primary text-slate-900 text-sm font-bold hover:bg-opacity-90 transition-all ml-2"
                                        >
                                            {t('navUpload')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                                <p className="navbar-text-muted hidden md:block mx-4 text-sm">
                                    {t('navTagline')}
                                </p>
                            </div>
                            
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 px-6">
                                <ThemeToggle />
                                <LanguageToggle />
                                {/* <div className="flex items-center space-x-2 pl-4">
                                    {!user ? (
                                        <>
                                            <button
                                                onClick={handleSignIn}
                                                className="navbar-text-muted hover:bg-logo-mid hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                            >
                                                {t('navLogin')}
                                            </button>
                                            <button
                                                onClick={handleSignUp}
                                                className="navbar-text-muted hover:bg-logo-mid hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                            >
                                                {t('navSignup')}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleSignOut}
                                            className="navbar-text-muted hover:bg-logo-mid hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                        >
                                            {t('navLogout') || 'Sign Out'}
                                        </button>
                                    )}
                                </div> */}
                            </div>
                        </div>
                    </div>
                    
                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    onClick={(e: React.MouseEvent) => handleNavClick(e, item.href, item.scrollTo)}
                                    aria-current={item.current ? 'page' : undefined}
                                    className={classNames(
                                        item.current
                                            ? 'text-primary'
                                            : 'text-slate-700 dark:text-slate-300 hover:text-primary',
                                        'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                            <DisclosureButton
                                as="a"
                                href="/upload"
                                className="flex items-center justify-center rounded-full h-10 px-4 bg-primary text-slate-900 text-sm font-bold hover:bg-opacity-90 transition-all mx-3 mt-4"
                            >
                                {t('navUpload')}
                            </DisclosureButton>
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
};

export default Navbar;