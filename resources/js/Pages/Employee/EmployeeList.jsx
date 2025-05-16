import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { calculateAge } from '@/utils/calculateAge';
import { calculateDeductions } from '@/utils/calculateDeductions';
import Papa from 'papaparse';

const EmployeeList = ({ auth, employees: initialEmployees }) => {
    const [employees, setEmployees] = useState(initialEmployees.data);
    const [filters, setFilters] = useState({
        category: '',
        status: '',
        department: ''
    });

    const categories = [...new Set(initialEmployees.data.map(emp => emp.category))];
    const departments = [...new Set(initialEmployees.data.map(emp => emp.department))];
    const statuses = ['Active', 'Inactive', 'Hold', 'Notice'];


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = {
            ...filters,
            [name]: value
        };
        setFilters(newFilters);

        const filteredEmployees = initialEmployees.data.filter(employee => {
            return (
                (newFilters.category === '' || employee.category === newFilters.category) &&
                (newFilters.status === '' || employee.is_active === newFilters.status) &&
                (newFilters.department === '' || employee.department === newFilters.department)
            );
        });

        setEmployees(filteredEmployees);
    };

    const exportToCSV = () => {
        const exportData = employees.map(employee => ({
            'Employee Code': employee.employee_code,
            'Full Name': employee.full_name,
            'Department': employee.department,
            'Category': employee.category,
            'Status': employee.is_active,
            'Date of Birth': new Date(employee.self_dob).toLocaleDateString(),
            'Age': calculateAge(employee.self_dob),
            'Gender': employee.gender,
            'WhatsApp': employee.whatsapp_number,
            'Spouse': employee.dependents?.spouse_name || '',
            'Spouse DOB': employee.dependents?.spouse_dob ? new Date(employee.dependents.spouse_dob).toLocaleDateString() : '',
            'Spouse Age': employee.dependents?.spouse_dob ? calculateAge(employee.dependents.spouse_dob) : '',
            'Spouse Status': employee.dependents?.spouse_status || '',
            'Dependent 1': employee.dependents?.dependent1_name || '',
            'Dependent 1 DOB': employee.dependents?.dependent1_dob ? new Date(employee.dependents.dependent1_dob).toLocaleDateString() : '',
            'Dependent 1 Age': employee.dependents?.dependent1_dob ? calculateAge(employee.dependents.dependent1_dob) : '',
            'Dependent 1 Status': employee.dependents?.dependent1_status || '',
            'Dependent 2': employee.dependents?.dependent2_name || '',
            'Dependent 2 DOB': employee.dependents?.dependent2_dob ? new Date(employee.dependents.dependent2_dob).toLocaleDateString() : '',
            'Dependent 2 Age': employee.dependents?.dependent2_dob ? calculateAge(employee.dependents.dependent2_dob) : '',
            'Dependent 2 Status': employee.dependents?.dependent2_status || '',
            'Father': employee.dependents?.father_name || '',
            'Father DOB': employee.dependents?.father_dob ? new Date(employee.dependents.father_dob).toLocaleDateString() : '',
            'Father Age': employee.dependents?.father_dob ? calculateAge(employee.dependents.father_dob) : '',
            'Father Status': employee.dependents?.father_status || '',
            'Mother': employee.dependents?.mother_name || '',
            'Mother DOB': employee.dependents?.mother_dob ? new Date(employee.dependents.mother_dob).toLocaleDateString() : '',
            'Mother Age': employee.dependents?.mother_dob ? calculateAge(employee.dependents.mother_dob) : '',
            'Mother Status': employee.dependents?.mother_status || '',
            'Additional Dependent 1': employee.dependents?.additional_dependent1_name || '',
            'Additional Dependent 1 DOB': employee.dependents?.additional_dependent1_dob ? new Date(employee.dependents.additional_dependent1_dob).toLocaleDateString() : '',
            'Additional Dependent 1 Age': employee.dependents?.additional_dependent1_dob ? calculateAge(employee.dependents.additional_dependent1_dob) : '',
            'Additional Dependent 1 Status': employee.dependents?.additional_dependent1_status || '',
            'Additional Dependent 2': employee.dependents?.additional_dependent2_name || '',
            'Additional Dependent 2 DOB': employee.dependents?.additional_dependent2_dob ? new Date(employee.dependents.additional_dependent2_dob).toLocaleDateString() : '',
            'Additional Dependent 2 Age': employee.dependents?.additional_dependent2_dob ? calculateAge(employee.dependents.additional_dependent2_dob) : '',
            'Additional Dependent 2 Status': employee.dependents?.additional_dependent2_status || '',
            'Additional Dependent 3': employee.dependents?.additional_dependent3_name || '',
            'Additional Dependent 3 DOB': employee.dependents?.additional_dependent3_dob ? new Date(employee.dependents.additional_dependent3_dob).toLocaleDateString() : '',
            'Additional Dependent 3 Age': employee.dependents?.additional_dependent3_dob ? calculateAge(employee.dependents.additional_dependent3_dob) : '',
            'Additional Dependent 3 Status': employee.dependents?.additional_dependent3_status || '',
            'Total Deduction': `${calculateDeductions(employee)}`
        }));

        const csv = Papa.unparse(exportData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'Employee_List_with_Dependents.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Employee List</h2>}
        >
            <Head title="Employee List" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {/* Filters Section */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All Statuses</option>
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department
                                </label>
                                <select
                                    name="department"
                                    value={filters.department}
                                    onChange={handleFilterChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(department => (
                                        <option key={department} value={department}>{department}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={exportToCSV}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Export to CSV
                                </button>
                            </div>
                        </div>

                        {/* Summary Section */}
                        <div className="mt-4">
                            <p className="text-gray-600">
                                Total Employees: {employees.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EmployeeList; 