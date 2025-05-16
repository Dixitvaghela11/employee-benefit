import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    UsersIcon,
    MagnifyingGlassIcon,
    DocumentTextIcon,
    ChartBarIcon,
    HomeIcon
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const isAdmin = user.role === 'admin';
    const isHR = user.role === 'hr';
    const isResumeTracker = user.role === 'resume_tracker';

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-100"
        >
            <nav className="border-b border-gray-100 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/90">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-2">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                    <h3 className="text-base font-bold">Employee Benefit System</h3>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-flex items-center"
                                    >
                                        <HomeIcon className="w-5 h-5 text-blue-600 me-2" />
                                        Dashboard
                                    </motion.div>
                                </NavLink>

                                {(isAdmin || isHR) && (
                                    <>
                                        <NavLink
                                            href={route('employee-master.index')}
                                            active={route().current('employee-master.index')}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="inline-flex items-center"
                                            >
                                                <UsersIcon className="w-5 h-5 text-green-600 me-2" />
                                                Employee Master
                                            </motion.div>
                                        </NavLink>
                                    </>
                                )}

                                {(isAdmin || isHR || user.role === 'user') && (
                                    <NavLink
                                        href={route('employee-search')}
                                        active={route().current('employee-search')}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center"
                                        >
                                            <MagnifyingGlassIcon className="w-5 h-5 text-purple-600 me-2" />
                                            Employee Search
                                        </motion.div>
                                    </NavLink>
                                )}

                                {(isAdmin || isResumeTracker) && (
                                    <NavLink
                                        href={route('candidates.index')}
                                        active={route().current('candidates.index')}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center"
                                        >
                                            <DocumentTextIcon className="w-5 h-5 text-orange-600 me-2" />
                                            Resume Tracker
                                        </motion.div>
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <motion.span 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex rounded-md"
                                        >
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </motion.span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </motion.button>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={false}
                    animate={{
                        height: showingNavigationDropdown ? 'auto' : 0,
                        opacity: showingNavigationDropdown ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className={`sm:hidden overflow-hidden`}
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center"
                            >
                                <ChartBarIcon className="w-5 h-5 text-blue-600 me-2" />
                                Dashboard
                            </motion.div>
                        </ResponsiveNavLink>

                        {(isAdmin || isHR) && (
                            <>
                                <ResponsiveNavLink
                                    href={route('employee-master.index')}
                                    active={route().current('employee-master.index')}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-flex items-center"
                                    >
                                        <UsersIcon className="w-5 h-5 text-green-600 me-2" />
                                        Employee Master
                                    </motion.div>
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    href={route('employee.list')}
                                    active={route().current('employee.list')}
                                >
                                    Export
                                </ResponsiveNavLink>
                            </>
                        )}

                        {(isAdmin || isHR || user.role === 'user') && (
                            <ResponsiveNavLink
                                href={route('employee-search')}
                                active={route().current('employee-search')}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center"
                                >
                                    <MagnifyingGlassIcon className="w-5 h-5 text-purple-600 me-2" />
                                    Employee Search
                                </motion.div>
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </motion.div>
            </nav>

            {header && (
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white shadow"
                >
                    <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </motion.header>
            )}

            <motion.main
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {children}
            </motion.main>
        </motion.div>
    );
}
