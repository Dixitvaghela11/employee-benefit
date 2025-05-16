import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'
import React, { useState, useEffect } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'
import axios from 'axios'
import { calculateAge } from '@/utils/calculateAge';
import { calculateDeductions } from '@/utils/calculateDeductions';
import { useDispatch, useSelector } from 'react-redux';
import { setEmployeeFilters, resetEmployeeFilters } from '@/store/slices/filterSlice';

// Define initial state values
const initialFilters = {
    employee_code: '',
    full_name: '',
    department: '',
    status: '',
    category: '',
    page: 1,
};

const EmployeeMaster = ({ auth, employees: initialEmployees }) => {
    const dispatch = useDispatch();
    const savedFilters = useSelector((state) => state.filters.employeeMaster);
    const [employees, setEmployees] = useState(initialEmployees.data);
    const [departments, setDepartments] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: initialEmployees.current_page,
        last_page: initialEmployees.last_page,
        from: initialEmployees.from,
        to: initialEmployees.to,
        total: initialEmployees.total,
    });
    const [filters, setFilters] = useState(savedFilters);

    useEffect(() => {
        dispatch(setEmployeeFilters(filters));
    }, [filters]);

    // Extract unique departments on component mount
    useEffect(() => {
        const fetchAllDepartments = async () => {
            try {
                const response = await axios.get('/api/departments');
                const uniqueDepartments = [...new Set(response.data)].filter(Boolean).sort();
                setDepartments(uniqueDepartments);
            } catch (error) {
                console.error('Error fetching departments:', error);
                // Fallback to current page departments if API fails
                const uniqueDepartments = [...new Set(initialEmployees.data.map(emp => emp.department))].filter(Boolean).sort();
                setDepartments(uniqueDepartments);
            }
        };

        fetchAllDepartments();
    }, []); // Remove initialEmployees from dependency array

    useEffect(() => {
        // Check if there are any active filters (any filter with a non-empty value)
        const hasActiveFilters = Object.values(savedFilters).some(value => value !== '');
        
        // If there are active filters, fetch the filtered data
        if (hasActiveFilters) {
            fetchData(savedFilters);
        }
    }, []); // Run only on mount

    const handleFilterChange = async (e) => {
        const { name, value } = e.target
        const newFilters = { ...filters, [name]: value, page: 1 }
        setFilters(newFilters)
        await fetchData(newFilters)
    }

    const handlePageChange = async (page) => {
        const newFilters = { ...filters, page }
        setFilters(newFilters)
        await fetchData(newFilters)
    }

    const fetchData = async (params) => {
        try {
            const response = await axios.get('/employee-master/filter', {
                params
            })
            setEmployees(response.data.data)
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                from: response.data.from,
                to: response.data.to,
                total: response.data.total,
            })
        } catch (error) {
            console.error('Error fetching filtered data:', error)
        }
    }

    // Define columns
    const columns = React.useMemo(
        () => [
            {
                header: 'EmpCode',
                accessorKey: 'employee_code',
            },
            {
                header: 'Full Name',
                accessorKey: 'full_name',
            },
            {
                header: 'Department',
                accessorKey: 'department',
            },
            {
                header: 'Category',
                accessorKey: 'category',
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
                cell: info => {
                    const status = info.getValue();
                    const colors = {
                        'Active': 'text-green-600',
                        'Inactive': 'text-red-600',
                        'Hold': 'text-yellow-600',
                        'Notice': 'text-orange-600'
                    };
                    return <span className={colors[status]}>{status}</span>;
                },
            },
            {
                header: 'From',
                accessorKey: 'effective_from',
                cell: info => new Date(info.getValue()).toLocaleDateString(),
            },
            {
                header: 'DOB',
                accessorKey: 'self_dob',
                cell: info => new Date(info.getValue()).toLocaleDateString(),
            },
            {
                header: 'Gender',
                accessorKey: 'gender',
            },
            {
                header: 'WhatsApp',
                accessorKey: 'whatsapp_number',
            },
            {
                header: 'Age',
                accessorFn: (row) => calculateAge(row.self_dob),
                cell: info => `${info.getValue()} years`
            },
            {
                header: 'Deduction',
                accessorFn: (row) => calculateDeductions(row),
                cell: info => `₹${info.getValue()}`,
            },
            {
                header: 'Actions',
                accessorKey: 'id',
                cell: info => (
                    <div className="flex space-x-2">
                        <Link
                            href={route('employee-master.edit', info.getValue())}
                            className="inline-flex items-center px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md"
                        >
                            Edit
                        </Link>
                        <Link
                            href={`/employee-dependents/${info.getValue()}`}
                            className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                        >
                            View Dependents
                        </Link>
                    </div>
                ),
            },
        ],
        []
    )

    // Create table instance
    const table = useReactTable({
        data: employees,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    // Add pagination component at the bottom of the table
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

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Employee Master
                    </h2>
                    <div>
                        <button
                            onClick={() => {
                                dispatch(resetEmployeeFilters());
                                setFilters(initialFilters);
                                fetchData(initialFilters);
                            }}
                            className="inline-flex items-center px-4 mr-2 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md"
                        >
                            Reset Filters
                        </button>
                        <Link
                            href={route('employee.list')}
                            className="inline-flex items-center px-4 mr-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md">
                            Export
                        </Link>
                        <Link
                            href={route('employee-master.create')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md"
                        >
                            Create Employee
                        </Link>

                    </div>
                </div>
            }
        >
            <Head title="Employee Master" />
            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Filter Section */}
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Employee Code
                                    </label>
                                    <input
                                        type="text"
                                        name="employee_code"
                                        value={filters.employee_code}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={filters.full_name}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Department
                                    </label>
                                    <select
                                        name="department"
                                        value={filters.department}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">All Departments</option>
                                        {departments.map(department => (
                                            <option key={department} value={department}>
                                                {department}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Hold">Hold</option>
                                        <option value="Notice">Notice</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">All Categories</option>
                                        <option value="Kiran Hospital">Kiran Hospital</option>
                                        <option value="Kiran Medical College">Kiran Medical College</option>
                                        <option value="Kiran Nursing College">Kiran Nursing College</option>
                                        <option value="Kiran Medical College Student">Kiran Medical College Student</option>
                                        <option value="Kiran Nursing College Student">Kiran Nursing College Student</option>
                                        <option value="Consultant">Consultant</option>
                                    </select>
                                </div>
                            </div>

                            <div className="max-h-[calc(100vh-370px)] overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        {table.getHeaderGroups().map(headerGroup => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(header => (
                                                    <th
                                                        key={header.id}
                                                        className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                                                        className="px-2 py-1 whitespace-nowrap text-sm text-gray-900"
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
    )
}

export default EmployeeMaster