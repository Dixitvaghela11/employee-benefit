import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function EditEmployee({ auth, employee }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const [previewImage, setPreviewImage] = useState(employee.employee_photograph);

    const { data, setData, post, processing, errors } = useForm({
        employee_code: employee.employee_code,
        full_name: employee.full_name,
        gender: employee.gender,
        whatsapp_number: employee.whatsapp_number,
        department: employee.department,
        category: employee.category,
        is_active: employee.is_active,
        effective_from: formatDate(employee.effective_from),
        effective_till: employee.effective_till,
        self_dob: formatDate(employee.self_dob),
        employee_photograph: null,
        _method: 'PUT'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employee-master.update', employee.id));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('employee_photograph', file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Employee
                </h2>
            }
        >
            <Head title="Edit Employee" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="employee_code" value="Employee Code" />
                                        <TextInput
                                            id="employee_code"
                                            type="text"
                                            name="employee_code"
                                            value={data.employee_code}
                                            className="mt-1 block w-full"
                                            onChange={e => setData('employee_code', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.employee_code} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="full_name" value="Full Name" />
                                        <TextInput
                                            id="full_name"
                                            type="text"
                                            name="full_name"
                                            value={data.full_name}
                                            className="mt-1 block w-full"
                                            onChange={e => setData('full_name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.full_name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="gender" value="Gender" />
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={data.gender}
                                            onChange={e => setData('gender', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <InputError message={errors.gender} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="whatsapp_number" value="WhatsApp Number" />
                                        <TextInput
                                            id="whatsapp_number"
                                            type="text"
                                            name="whatsapp_number"
                                            value={data.whatsapp_number}
                                            className="mt-1 block w-full"
                                            onChange={e => setData('whatsapp_number', e.target.value)}
                                        />
                                        <InputError message={errors.whatsapp_number} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="department" value="Department" />
                                        <TextInput
                                            id="department"
                                            type="text"
                                            name="department"
                                            value={data.department}
                                            className="mt-1 block w-full"
                                            onChange={e => setData('department', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.department} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="category" value="Category" />
                                        <select
                                            id="category"
                                            name="category"
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Kiran Hospital">Kiran Hospital</option>
                                            <option value="Kiran Medical College">Kiran Medical College</option>
                                            <option value="Kiran Nursing College">Kiran Nursing College</option>
                                            <option value="Kiran Medical College Student">Kiran Medical College Student</option>
                                            <option value="Kiran Nursing College Student">Kiran Nursing College Student</option>
                                            <option value="Consultant">Consultant</option>
                                        </select>
                                        <InputError message={errors.category} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="effective_from" value="Effective From" />
                                        <TextInput
                                            id="effective_from"
                                            type="date"
                                            name="effective_from"
                                            value={data.effective_from}
                                            className="mt-1 block w-full"
                                            onChange={e => setData('effective_from', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.effective_from} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="self_dob" value="Date of Birth" />
                                        <TextInput
                                            id="self_dob"
                                            type="date"
                                            name="self_dob"
                                            value={data.self_dob}
                                            className="mt-1 block w-full"
                                            onChange={e => setData('self_dob', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.self_dob} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="employee_photograph" value="Employee Photograph" />
                                        {previewImage && (
                                            <div className="mt-2 mb-4">
                                                <img
                                                    src={previewImage}
                                                    alt="Employee preview"
                                                    className="w-32 h-32 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="employee_photograph"
                                            name="employee_photograph"
                                            onChange={handlePhotoChange}
                                            className="mt-1 block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                            accept="image/*"
                                        />
                                        <InputError message={errors.employee_photograph} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="is_active" value="Status" />
                                        <select
                                            id="is_active"
                                            name="is_active"
                                            value={data.is_active}
                                            onChange={e => setData('is_active', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Hold">Hold</option>
                                            <option value="Notice">Notice</option>
                                        </select>
                                        <InputError message={errors.is_active} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Update Employee
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 