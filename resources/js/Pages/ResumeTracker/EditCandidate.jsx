import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { TimelineIcons } from '@/Components/TimelineIcons';
import { getEventTypeStyles } from '@/Components/TimelineIcons';
const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

export default function EditCandidate({ auth, candidate, departments, documentCategories }) {


    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    console.log(candidate.timeline_events);

    const [data, setData] = useState({
        application_date: formatDate(candidate.application_date) || '',
        interview_date: formatDate(candidate.interview_date) || '',
        offered_salary: candidate.offered_salary || '',
        full_name: candidate.full_name || '',
        department_id: candidate.department_id || '',
        position_applied: candidate.position_applied || '',
        contact_number: candidate.contact_number || '',
        contact_number_2: candidate.contact_number_2 || '',
        email: candidate.email || '',
        city: candidate.city || '',
        education: candidate.education || '',
        experience_years: candidate.experience_years || '',
        current_organization: candidate.current_organization || '',
        current_salary: candidate.current_salary || '',
        expected_salary: candidate.expected_salary || '',
        referred_by: candidate.referred_by || '',
        remarks: candidate.remarks || '',
        referred_type: candidate.referred_type || '',
        interview_status: candidate.interview_status || '',
        final_status: candidate.final_status || '',
        timeline_note: '',
        document_category_id: '',
        document_file: '',
        document_file_name: '',
        status: candidate.status || 'Active',
    });

    const [interviewRounds, setInterviewRounds] = useState([
        {
            round_number: 1,
            interviewer_name: candidate.interview_rounds?.[0]?.interviewer_name || '',
            status: candidate.interview_rounds?.[0]?.status || '',
            feedback: candidate.interview_rounds?.[0]?.feedback || '',
            interview_date: formatDate(candidate.interview_rounds?.[0]?.interview_date) || ''
        },
        {
            round_number: 2,
            interviewer_name: candidate.interview_rounds?.[1]?.interviewer_name || '',
            status: candidate.interview_rounds?.[1]?.status || '',
            feedback: candidate.interview_rounds?.[1]?.feedback || '',
            interview_date: formatDate(candidate.interview_rounds?.[1]?.interview_date) || ''
        },
        // {
        //     round_number: 3,
        //     interviewer_name: candidate.interview_rounds?.[2]?.interviewer_name || '',
        //     status: candidate.interview_rounds?.[2]?.status || '',
        //     feedback: candidate.interview_rounds?.[2]?.feedback || '',
        //     interview_date: formatDate(candidate.interview_rounds?.[2]?.interview_date) || ''
        // }
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'interview_date' && value) {
            const applicationDate = new Date(data.application_date);
            const interviewDate = new Date(value);

            if (interviewDate < applicationDate) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    interview_date: 'Interview date cannot be earlier than application date.'
                }));
                return;
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    interview_date: null
                }));
            }
        }

        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();

        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        interviewRounds.forEach((round, index) => {
            Object.keys(round).forEach(key => {
                formData.append(`interview_rounds[${index}][${key}]`, round[key]);
            });
        });

        formData.append('_method', 'PUT');

        try {
            await axios.post(`/candidates/${candidate.id}`, formData);

            toast.success('Candidate updated successfully!');
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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Candidate: <Link href={route('candidates.show', candidate.id)} className="text-blue-500 hover:underline">{candidate.full_name}</Link>
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <select
                                id="status"
                                name="status"
                                value={data.status}
                                onChange={handleChange}
                                className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <PrimaryButton disabled={processing} onClick={handleSubmit}>
                            Update Candidate
                        </PrimaryButton>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Candidate - ${candidate.full_name}`} />

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* Column 1: Basic Information */}
                                    <div className="space-y-6 h-[calc(100vh-250px)] overflow-y-auto">
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 sticky top-0 bg-white">Basic Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="application_date" value="Application Date" required />
                                                <TextInput
                                                    id="application_date"
                                                    type="date"
                                                    name="application_date"
                                                    value={data.application_date}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full"
                                                    required
                                                />
                                                <InputError message={errors.application_date} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="full_name" value="Full Name" required />
                                                <TextInput
                                                    id="full_name"
                                                    type="text"
                                                    name="full_name"
                                                    value={data.full_name}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full"
                                                    required
                                                />
                                                <InputError message={errors.full_name} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="status" value="Status" required />
                                                <select
                                                    id="status"
                                                    name="status"
                                                    value={data.status}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                    required
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                                <InputError message={errors.status} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="department_id" value="Department" required />
                                                <select
                                                    id="department_id"
                                                    name="department_id"
                                                    value={data.department_id}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
                                                <InputLabel htmlFor="email" value="Email Address" />
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
                                                <InputLabel htmlFor="referred_type" value="Referred Type" />
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

                                            <div>
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
                                    </div>

                                    {/* Column 2: Interview Details & Documents */}
                                    <div className="space-y-6 h-[calc(100vh-250px)] overflow-y-auto">
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Details</h3>
                                        <div className="space-y-4">
                                            {/* Documents */}
                                            {/* <div>
                                                <InputLabel htmlFor="document_category_id" value="Document Category" />
                                                <select
                                                    id="document_category_id"
                                                    name="document_category_id"
                                                    value={data.document_category_id}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                >
                                                    <option value="">Select Category</option>
                                                    {documentCategories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.category_name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.document_category_id} className="mt-2" />
                                                <div className="mt-2">
                                                    <InputLabel htmlFor="document_file" value="Document File" />
                                                    <div className="flex items-center justify-center w-full">
                                                        <label
                                                            htmlFor="document_file"
                                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                                            onDragOver={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                e.currentTarget.classList.add('border-blue-500');
                                                            }}
                                                            onDragLeave={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                e.currentTarget.classList.remove('border-blue-500');
                                                            }}
                                                            onDrop={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                e.currentTarget.classList.remove('border-blue-500');

                                                                const file = e.dataTransfer.files[0];
                                                                if (file) {
                                                                    // Check file type
                                                                    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
                                                                    if (allowedTypes.includes(file.type)) {
                                                                        setData(prev => ({
                                                                            ...prev,
                                                                            document_file: file,
                                                                        }));
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                {!data.document_file ? (
                                                                    <>
                                                                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                                        </svg>
                                                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG or TXT</p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <svg className="w-8 h-8 mb-4 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                        </svg>
                                                                        <p className="mb-2 text-sm text-gray-500">Selected file:</p>
                                                                        <p className="text-sm font-semibold text-gray-900">{data.document_file.name}</p>
                                                                        <p className="mt-2 text-xs text-blue-500 hover:underline cursor-pointer">Click to change file</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <input
                                                                id="document_file"
                                                                type="file"
                                                                name="document_file"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    setData(prev => ({
                                                                        ...prev,
                                                                        document_file: file,
                                                                    }));
                                                                }}
                                                                className="hidden"
                                                                accept=".pdf,.doc,.docx,.txt, .jpg, .jpeg, .png"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                                <InputError message={errors.document_file} className="mt-2" />
                                                <div className="mt-2">
                                                    <InputLabel htmlFor="document_file_name" value="Document File Name" />
                                                    <TextInput
                                                        id="document_file_name"
                                                        type="text"
                                                        name="document_file_name"
                                                        value={data.document_file_name}
                                                        className="mt-1 block w-full"
                                                        onChange={handleChange}
                                                    />
                                                    <InputError message={errors.document_file_name} className="mt-2" />
                                                </div>
                                            </div> */}

                                            {/* <div className="mt-2 border-t pt-2">
                                                <InputLabel htmlFor="interview_date" value="Interview Date" />
                                                <TextInput
                                                    type="date"
                                                    id="interview_date"
                                                    name="interview_date"
                                                    value={data.interview_date}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full"
                                                    min={data.application_date}
                                                />
                                                <InputError message={errors.interview_date} className="mt-2" />
                                            </div> */}
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
                                            <div>
                                                <InputLabel htmlFor="offered_salary" value="Offered Salary (₹)" />
                                                <TextInput
                                                    id="offered_salary"
                                                    type="number"
                                                    name="offered_salary"
                                                    value={data.offered_salary}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full"
                                                />
                                            </div>
                                            <div className="">
                                                <InputLabel htmlFor="interview_status" value="Final Interview Status" />
                                                <select
                                                    id="interview_status"
                                                    name="interview_status"
                                                    value={data.interview_status}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                >
                                                    {/* enum('Hold','Observation','Selected','Shortlisted','Rejected','Pending') */}
                                                    <option value="">Select Status</option>
                                                    <option value="Selected">Selected</option>
                                                    <option value="Rejected">Rejected</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Shortlisted">Shortlisted</option>
                                                    <option value="Hold">Hold</option>
                                                    <option value="Observation">Observation</option>
                                                    <option value="NA">NA</option>

                                                </select>
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="final_status" value="Final Status" />
                                                <select
                                                    id="final_status"
                                                    name="final_status"
                                                    value={data.final_status}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                >
                                                    {/* enum('Hold','Joined','Not Interested','Observation','Offer Rejected','Offered','Rejected','Selected') */}
                                                    <option value="">Select Status</option>
                                                    <option value="Joined">Joined</option>
                                                    <option value="Rejected">Rejected</option>
                                                    <option value="Hold">Hold</option>
                                                    <option value="Offered">Offered</option>
                                                    <option value="Not Interested">Not Interested</option>
                                                    <option value="Observation">Observation</option>
                                                    <option value="Offer Rejected">Offer Rejected</option>
                                                    <option value="Selected">Selected</option>
                                                    <option value="Shortlisted">Shortlisted</option>
                                                    <option value="NA">NA</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Interview Rounds */}
                                    <div className="space-y-6 h-[calc(100vh-250px)] overflow-y-auto">
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 sticky top-0 bg-white">Interview Rounds</h3>
                                        {interviewRounds.map((round, index) => (
                                            <div key={round.round_number} className="border rounded-lg p-4 space-y-4">
                                                <h4 className="font-medium">Round {round.round_number}</h4>

                                                <div>
                                                    <InputLabel htmlFor={`interviewer_${round.round_number}`} value="Interviewer Name" />
                                                    <TextInput
                                                        id={`interviewer_${round.round_number}`}
                                                        type="text"
                                                        name={`interviewer_${round.round_number}`}
                                                        value={round.interviewer_name}
                                                        onChange={(e) => {
                                                            const newRounds = [...interviewRounds];
                                                            newRounds[index].interviewer_name = e.target.value;
                                                            setInterviewRounds(newRounds);
                                                        }}
                                                        className="mt-1 block w-full"
                                                    />
                                                    <InputError message={errors.interviewer_name} className="mt-2" />
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor={`interview_date_${round.round_number}`} value="Interview Date" />
                                                    <TextInput
                                                        id={`interview_date_${round.round_number}`}
                                                        type="date"
                                                        name={`interview_date_${round.round_number}`}
                                                        value={round.interview_date}
                                                        onChange={(e) => {
                                                            const newRounds = [...interviewRounds];
                                                            newRounds[index].interview_date = e.target.value;
                                                            setInterviewRounds(newRounds);
                                                        }}
                                                        className="mt-1 block w-full"
                                                    />
                                                    <InputError message={errors.interview_date} className="mt-2" />
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor={`status_${round.round_number}`} value="Status" />
                                                    <select
                                                        id={`status_${round.round_number}`}
                                                        name={`status_${round.round_number}`}
                                                        value={round.status}
                                                        onChange={(e) => {
                                                            const newRounds = [...interviewRounds];
                                                            newRounds[index].status = e.target.value;
                                                            setInterviewRounds(newRounds);
                                                        }}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                    >
                                                        <option value="">Select Status</option>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Selected">Selected</option>
                                                        <option value="Rejected">Rejected</option>
                                                        <option value="On Hold">On Hold</option>
                                                        <option value="No Show">No Show</option>
                                                    </select>
                                                    <InputError message={errors.status} className="mt-2" />
                                                </div>

                                                <div>
                                                    <InputLabel htmlFor={`feedback_${round.round_number}`} value="Feedback" />
                                                    <textarea
                                                        id={`feedback_${round.round_number}`}
                                                        name={`feedback_${round.round_number}`}
                                                        value={round.feedback}
                                                        onChange={(e) => {
                                                            const newRounds = [...interviewRounds];
                                                            newRounds[index].feedback = e.target.value;
                                                            setInterviewRounds(newRounds);
                                                        }}
                                                        rows="3"
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                    />
                                                    <InputError message={errors.feedback} className="mt-2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Column 3: Timeline */}
                                    <div className="space-y-6 h-[calc(100vh-250px)] overflow-y-auto">
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 sticky top-0 bg-white z-10">Timeline</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="timeline_note" value="Add Note" />
                                                <textarea
                                                    id="timeline_note"
                                                    name="timeline_note"
                                                    value={data.timeline_note}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                    placeholder="Add a note about this update..."
                                                />
                                                <InputError message={errors.timeline_note} className="mt-2" />
                                            </div>

                                            {/* Timeline History */}
                                            <div className="mt-6">
                                                <ul className="-mb-8">
                                                    {candidate.timeline_events?.map((event, index) => (
                                                        <li key={index}>
                                                            <div className="relative pb-8">
                                                                {index !== candidate.timeline_events.length - 1 && (
                                                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                                                )}
                                                                <div className="relative flex space-x-3">
                                                                    <div>
                                                                        <span className={`h-8 w-8 rounded-full ${getEventTypeStyles(event.event_type).bgColor} flex items-center justify-center ring-8 ${getEventTypeStyles(event.event_type).ringColor}`}>
                                                                            <TimelineIcons eventType={event.event_type} />
                                                                        </span>
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div>
                                                                            <p className="text-sm text-gray-500">{event.event_description}</p>
                                                                            <div className="flex items-center">
                                                                                <p className="mt-1 text-xs text-gray-400">
                                                                                    {format(new Date(event.created_at), 'dd/MM/yyyy HH:mm')}
                                                                                </p>
                                                                                <p className="mt-1 text-xs text-gray-400">
                                                                                    &nbsp; | {event.created_by_user.name}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <PrimaryButton disabled={processing}>
                                        Update Candidate
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