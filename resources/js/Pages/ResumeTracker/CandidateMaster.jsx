import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setCandidateFilters, resetCandidateFilters } from '@/store/slices/filterSlice';

const initialFilters = {
    application_date_from: '',
    application_date_to: '',
    interview_date_from: '',
    interview_date_to: '',
    full_name: '',
    contact_number: '',
    department_id: '',
    position_applied: '',
    final_status: '',
    page: 1,
};

export default function CandidateMaster({ auth, candidates: initialCandidates }) {
    const dispatch = useDispatch();
    const savedFilters = useSelector((state) => state.filters.candidateMaster);
    const [candidates, setCandidates] = useState(initialCandidates.data);
    const [departments, setDepartments] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: initialCandidates.current_page,
        last_page: initialCandidates.last_page,
        from: initialCandidates.from,
        to: initialCandidates.to,
        total: initialCandidates.total,
    });
    const [filters, setFilters] = useState(savedFilters);

    useEffect(() => {
        dispatch(setCandidateFilters(filters));
    }, [filters]);

    // Fetch departments on component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/api/departments/list');
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    const handleFilterChange = async (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value, page: 1 };
        setFilters(newFilters);
        await fetchData(newFilters);
    };

    const handlePageChange = async (page) => {
        const newFilters = { ...filters, page };
        setFilters(newFilters);
        await fetchData(newFilters);
    };

    const fetchData = async (params) => {
        try {
            const response = await axios.get('/candidates/filter', { params });
            setCandidates(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                from: response.data.from,
                to: response.data.to,
                total: response.data.total,
            });
        } catch (error) {
            console.error('Error fetching filtered data:', error);
        }
    };

    const columns = React.useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'full_name',
                cell: info => (
                    <Link
                        href={route('candidates.show', info.row.original.id)}
                        className="text-blue-600 hover:text-blue-900 font-semibold uppercase"
                    >
                        {info.getValue()}
                    </Link>
                ),
            },
            {
                header: 'Department',
                accessorKey: 'department.department_name',
            },
            {
                header: 'Position',
                accessorKey: 'position_applied',
            },
            {
                header: 'Contact',
                accessorKey: 'contact_number',
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Experience',
                accessorKey: 'experience_years',
                cell: info => info.getValue() ? `${info.getValue()} years` : '-',
            },
            {
                header: 'City',
                accessorKey: 'city',
            },
            {
                header: 'Expected Salary',
                accessorKey: 'expected_salary',
                cell: info => info.getValue() ? `₹${Number(info.getValue()).toLocaleString()}` : '-',
            },
            {
                header: 'Applied Date',
                accessorKey: 'application_date',
                cell: info => format(new Date(info.getValue()), 'dd/MM/yyyy'),
            },
            {
                header: 'Interview Date',
                accessorKey: 'interview_date',
                cell: info => info.getValue() ? format(new Date(info.getValue()), 'dd/MM/yyyy') : '-',
            },
            {
                header: 'Interview Status',
                accessorKey: 'interview_status',
                cell: info => {
                    const status = info.getValue();
                    const colors = {
                        'Selected': 'bg-green-100 text-green-800',
                        'Rejected': 'bg-red-100 text-red-800',
                        'Pending': 'bg-yellow-100 text-yellow-800',
                        'Shortlisted': 'bg-blue-100 text-blue-800',
                        'Hold': 'bg-orange-100 text-orange-800',
                        'Observation': 'bg-purple-100 text-purple-800',
                    };
                    return status ? (
                        <span className={`px-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                            {status}
                        </span>
                    ) : '-';
                },
            },
            {
                header: 'Final Status',
                accessorKey: 'final_status',
                cell: info => {
                    const status = info.getValue();
                    const colors = {
                        'Joined': 'bg-green-100 text-green-800',
                        'Rejected': 'bg-red-100 text-red-800',
                        'Hold': 'bg-yellow-100 text-yellow-800',
                        'Offered': 'bg-blue-100 text-blue-800',
                    };
                    return status ? (
                        <span className={`px-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                            {status}
                        </span>
                    ) : '-';
                },
            },
            {
                header: 'Actions',
                accessorKey: 'id',
                cell: info => (
                    <Link
                        href={route('candidates.edit', info.getValue())}
                        className="inline-flex items-center px-3 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md"
                    >
                        Edit
                    </Link>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: candidates,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    console.log(candidates)

    const Pagination = () => {
        const getPageNumbers = () => {
            const pageNumbers = [];
            const totalPages = pagination.last_page;
            const currentPage = pagination.current_page;

            // Always show first page
            pageNumbers.push(1);

            if (currentPage > 3) {
                pageNumbers.push('...');
            }

            // Show pages around current page
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pageNumbers.push(i);
            }

            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
            }

            // Always show last page
            if (totalPages > 1) {
                pageNumbers.push(totalPages);
            }

            return pageNumbers;
        };

        return (
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Showing {pagination.from} to {pagination.to} of{' '}
                    {pagination.total} results
                </div>
                <div className="flex space-x-1">
                    <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className="px-3 py-1 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-1">...</span>
                            ) : (
                                <button
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded ${pagination.current_page === page
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}

                    <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                        className="px-3 py-1 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    useEffect(() => {
        // Check if there are any active filters (any filter with a non-empty value)
        const hasActiveFilters = Object.values(savedFilters).some(value => value !== '');
        
        // If there are active filters, fetch the filtered data
        if (hasActiveFilters) {
            fetchData(savedFilters);
        }
    }, []); // Run only on mount

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Candidates Master
                    </h2>
                    <div>
                        <button
                            onClick={() => {
                                dispatch(resetCandidateFilters());
                                setFilters(initialFilters);
                                fetchData(initialFilters);
                            }}
                            className="inline-flex items-center px-4 mr-2 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md"
                        >
                            Reset Filters
                        </button>
                        <button
                            onClick={async () => {
                                try {
                                    const response = await axios.get(route('candidates.export', filters), {
                                        responseType: 'blob'
                                    });

                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', 'candidates_' + new Date().toISOString().split('T')[0] + '.csv');
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                    window.URL.revokeObjectURL(url);
                                } catch (error) {
                                    console.error('Export failed:', error);
                                    toast.error('Failed to export data');
                                }
                            }}
                            className="inline-flex items-center px-4 mr-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                        >
                            Export
                        </button>
                        <Link
                            href={route('departments.create')}
                            className="inline-flex items-center px-4 mr-2 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md"
                        >
                            Add New Department
                        </Link>
                        <Link
                            href={route('candidates.create')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md"
                        >
                            Add New Candidate
                        </Link>

                    </div>
                </div>
            }
        >
            <Head title="Candidates Master" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-9">
                                {/* Application Date Range Filters */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Application From Date</label>
                                    <input
                                        type="date"
                                        name="application_date_from"
                                        value={filters.application_date_from}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Application To Date</label>
                                    <input
                                        type="date"
                                        name="application_date_to"
                                        value={filters.application_date_to}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                {/* Interview Date Range Filters */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Interview From Date</label>
                                    <input
                                        type="date"
                                        name="interview_date_from"
                                        value={filters.interview_date_from}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Interview To Date</label>
                                    <input
                                        type="date"
                                        name="interview_date_to"
                                        value={filters.interview_date_to}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                {/* Name Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={filters.full_name}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Search by name..."
                                    />
                                </div>

                                {/* Contact Number Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                    <input
                                        type="text"
                                        name="contact_number"
                                        value={filters.contact_number}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Search by contact number..."
                                    />
                                </div>

                                {/* Department Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <select
                                        name="department_id"
                                        value={filters.department_id}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">All Departments</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.department_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Position Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Position</label>
                                    <input
                                        type="text"
                                        name="position_applied"
                                        value={filters.position_applied}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Search by position..."
                                    />
                                </div>

                                {/* Final Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Final Status</label>
                                    <select
                                        name="final_status"
                                        value={filters.final_status}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Joined">Joined</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Hold">Hold</option>
                                        <option value="Offered">Offered</option>
                                        <option value="Not Interested">Not Interested</option>
                                        <option value="Observation">Observation</option>
                                        <option value="Offer Rejected">Offer Rejected</option>
                                    </select>
                                </div>
                            </div>
                            <div className="max-h-[calc(100vh-370px)] overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(header => (
                                                    <th
                                                        key={header.id}
                                                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {table.getRowModel().rows.map(row => (
                                            <tr key={row.id}>
                                                {row.getVisibleCells().map(cell => (
                                                    <td
                                                        key={cell.id}
                                                        className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 