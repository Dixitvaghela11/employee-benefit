import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';

export default function CreateCandidate({ auth, departments, documentCategories }) {
    console.log(documentCategories);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        full_name: '',
        department_id: '',
        position_applied: '',
        contact_number: '',
        contact_number_2: '',
        email: '',
        city: '',
        education: '',
        experience_years: '',
        current_organization: '',
        current_salary: '',
        expected_salary: '',
        referred_by: '',
        referred_type: '',
        remarks: '',
        document_category_id: '1',
        document_file: '',
        document_file_name: '',
    });

    console.log(data);
    
    const handleChange = (e) => {
        const { name, value } = e.target;

        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        
        // Append all form fields to FormData
        Object.keys(data).forEach(key => {
            // Skip document_file as it needs special handling
            if (key !== 'document_file') {
                formData.append(key, data[key]);
            }
        });

        // Append the file if it exists
        if (data.document_file) {
            formData.append('document_file', data.document_file);
        }

        try {
            await axios.post(route('candidates.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            toast.success('Candidate created successfully!');
            router.visit(route('candidates.index'));
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                toast.error('Please check the form for errors.');
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add New Candidate
                </h2>
            }
        >
            <Head title="Add New Candidate" />

            <div className="pt-4 h-[calc(100vh-125px)] overflow-y-auto">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                                {/* Left Column - All Information */}
                                <div className="lg:w-2/3 space-y-8">
                                    {/* Basic Information Section */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <InputLabel htmlFor="full_name" value="Full Name" required /> 
                                                <TextInput
                                                    id="full_name"
                                                    type="text"
                                                    name="full_name"
                                                    value={data.full_name}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <InputError message={errors.full_name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="department_id" value="Department" required />
                                                <select
                                                    id="department_id"
                                                    name="department_id"
                                                    value={data.department_id}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    required
                                                >
                                                    <option value="">Select Department</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>
                                                            {dept.department_name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.department_id} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="position_applied" value="Position Applied For" required />
                                                <TextInput
                                                    id="position_applied"
                                                    type="text"
                                                    name="position_applied"
                                                    value={data.position_applied}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <InputError message={errors.position_applied} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="referred_type" value="Referred Type" required/>
                                                <select
                                                    id="referred_type"
                                                    name="referred_type"
                                                    value={data.referred_type}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="Physical">Physical</option>
                                                    <option value="Website">Website</option>
                                                    <option value="Employee">Employee</option>
                                                    <option value="Email">Email</option>
                                                    <option value="CUG Whatsapp">CUG Whatsapp</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <InputError message={errors.referred_type} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="referred_by" value="Referred By" />
                                                <TextInput
                                                    id="referred_by"
                                                    type="text"
                                                    name="referred_by"
                                                    value={data.referred_by}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={errors.referred_by} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information Section */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Information</h3>
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <InputLabel htmlFor="contact_number" value="Contact Number" required />
                                                <TextInput
                                                    id="contact_number"
                                                    type="tel"
                                                    name="contact_number"
                                                    value={data.contact_number}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <InputError message={errors.contact_number} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="contact_number_2" value="Additional Contact Number" />
                                                <TextInput
                                                    id="contact_number_2"
                                                    type="tel"
                                                    name="contact_number_2"
                                                    value={data.contact_number_2}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={errors.contact_number_2} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="email" value="Email Address"  />
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                    
                                                />
                                                <InputError message={errors.email} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="city" value="City" />
                                                <TextInput
                                                    id="city"
                                                    type="text"
                                                    name="city"
                                                    value={data.city}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={errors.city} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Information Section */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Professional Information</h3>
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <InputLabel htmlFor="education" value="Education" />
                                                <TextInput
                                                    id="education"
                                                    type="text"
                                                    name="education"
                                                    value={data.education}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={errors.education} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="experience_years" value="Years of Experience" />
                                                <TextInput
                                                    id="experience_years"
                                                    type="number"
                                                    step="0.1"
                                                    name="experience_years"
                                                    value={data.experience_years}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={errors.experience_years} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="current_organization" value="Current Organization" />
                                                <TextInput
                                                    id="current_organization"
                                                    type="text"
                                                    name="current_organization"
                                                    value={data.current_organization}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={errors.current_organization} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Salary Information Section */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Salary Information</h3>
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <InputLabel htmlFor="current_salary" value="Current Salary (₹)" />
                                                <TextInput
                                                    id="current_salary"
                                                    type="number"
                                                    step="0.01"
                                                    name="current_salary"
                                                    value={data.current_salary}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={errors.current_salary} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="expected_salary" value="Expected Salary (₹)" />
                                                <TextInput
                                                    id="expected_salary"
                                                    type="number"
                                                    step="0.01"
                                                    name="expected_salary"
                                                    value={data.expected_salary}
                                                    className="mt-1 block w-full"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={errors.expected_salary} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Document Upload and Remarks */}
                                <div className="lg:w-1/3 space-y-8">
                                    {/* Document Upload Section */}
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Document Upload</h3>
                                        <div className="mt-4 space-y-6">
                                            <div>
                                                <InputLabel htmlFor="document_file_name" value="Document Name" />
                                                <TextInput
                                                    id="document_file_name"
                                                    type="text"
                                                    name="document_file_name"
                                                    value={data.document_file_name}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full"
                                                />
                                                <InputError message={errors.document_file_name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="document_file" value="Upload Document" />
                                                <input
                                                    type="file"
                                                    id="document_file"
                                                    name="document_file"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        setData(prev => ({
                                                            ...prev,
                                                            document_file: file,
                                                        }));
                                                    }}
                                                    className="mt-1 block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                                <InputError message={errors.document_file} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remarks Section */}
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Additional Information</h3>
                                        <div className="mt-4">
                                            <InputLabel htmlFor="remarks" value="Remarks" />
                                            <textarea
                                                id="remarks"
                                                name="remarks"
                                                value={data.remarks}
                                                onChange={handleChange}
                                                rows="3"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <InputError message={errors.remarks} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                                            Create Candidate
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
