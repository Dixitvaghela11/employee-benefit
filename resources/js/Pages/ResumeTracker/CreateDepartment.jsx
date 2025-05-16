import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function CreateDepartment({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        department_name: '',
    });

    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState('');

    const submit = (e) => {
        e.preventDefault();
        post(route('departments.store'));
    };

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Department</h2>}
        >
            <Head title="Create Department" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <InputLabel htmlFor="department_name" value="Department Name" />
                                    <TextInput
                                        id="department_name"
                                        type="text"
                                        name="department_name"
                                        value={data.department_name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('department_name', e.target.value)}
                                    />
                                    <InputError message={errors.department_name} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Create Department
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-4 bg-white rounded-md max-h-[300px] overflow-y-auto">
                        <div className="flex justify-between items-center p-2 sticky top-0 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-semibold mb-2">Departments</h3>
                            <input type="text" className="border border-gray-300 rounded-md p-2" placeholder="Search departments" onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="p-4">
                            {departments.filter((department) => department.department_name.toLowerCase().includes(search.toLowerCase())).map((department) => (
                                <div key={department.id} className="mb-2 ">
                                    {department.department_name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 