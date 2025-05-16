import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    UsersIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/solid';

export default function Dashboard({ auth }) {
    const isAdmin = auth.user.role === 'admin';
    const isHR = auth.user.role === 'hr';
    const isResumeTracker = auth.user.role === 'resume_tracker';

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <AuthenticatedLayout
            header={
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-semibold leading-tight text-gray-800"
                >
                    Dashboard
                </motion.h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg sm:rounded-lg"
                    >
                        <div className="p-6 text-gray-900">
                            <motion.h3 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                            >
                                Welcome, {auth.user.name}
                            </motion.h3>
                            <motion.div 
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                {(isAdmin || isHR) && (
                                    <>
                                        <motion.div variants={item}>
                                            <Link
                                                href="/employee-master"
                                                className="block p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-green-100 rounded-full blur-lg opacity-40"></div>
                                                        <UsersIcon className="w-12 h-12 text-green-600 relative z-10 transform transition-all duration-300 hover:scale-110" />
                                                    </div>
                                                    <h5 className="mt-4 mb-2 text-lg font-bold tracking-tight text-gray-900">
                                                        Employee Master
                                                    </h5>
                                                    <p className="text-sm text-gray-600 text-center">
                                                        Manage employee benefit records and information
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>

                                        <motion.div variants={item}>
                                            <Link
                                                href="/export-data"
                                                className="block p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg opacity-40"></div>
                                                        <ArrowDownTrayIcon className="w-12 h-12 text-blue-600 relative z-10 transform transition-all duration-300 hover:scale-110" />
                                                    </div>
                                                    <h5 className="mt-4 mb-2 text-lg font-bold tracking-tight text-gray-900">
                                                        Export Data
                                                    </h5>
                                                    <p className="text-sm text-gray-600 text-center">
                                                        Export employee benefit data to Excel
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    </>
                                )}

                                {(isAdmin || isHR || auth.user.role === 'user') && (
                                    <motion.div variants={item}>
                                        <Link
                                            href="/employee-search"
                                            className="block p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-purple-100 rounded-full blur-lg opacity-40"></div>
                                                    <MagnifyingGlassIcon className="w-12 h-12 text-purple-600 relative z-10 transform transition-all duration-300 hover:scale-110" />
                                                </div>
                                                <h5 className="mt-4 mb-2 text-lg font-bold tracking-tight text-gray-900">
                                                    Employee Search
                                                </h5>
                                                <p className="text-sm text-gray-600 text-center">
                                                    Search and view employee benefit details
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>

                    {(isAdmin || isResumeTracker) && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg sm:rounded-lg mt-6"
                        >
                            <div className="p-6 text-gray-900">
                                <motion.h3 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                                >
                                    Resume Tracker
                                </motion.h3>
                                <motion.div 
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                                >
                                    <motion.div variants={item}>
                                        <Link
                                            href="/candidates"
                                            className="block p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-orange-100 rounded-full blur-lg opacity-40"></div>
                                                    <DocumentTextIcon className="w-12 h-12 text-orange-600 relative z-10 transform transition-all duration-300 hover:scale-110" />
                                                </div>
                                                <h5 className="mt-4 mb-2 text-lg font-bold tracking-tight text-gray-900">
                                                    Candidates
                                                </h5>
                                                <p className="text-sm text-gray-600 text-center">
                                                    Manage candidate records and information
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
