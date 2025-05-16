import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { TimelineIcons } from '@/Components/TimelineIcons';
import { getEventTypeStyles } from '@/Components/TimelineIcons';

const StatusBadge = ({ status, type }) => {
    const colors = type === 'interview' ? {
        'Selected': 'bg-green-100 text-green-800',
        'Rejected': 'bg-red-100 text-red-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Shortlisted': 'bg-blue-100 text-blue-800',
    } : {
        'Joined': 'bg-green-100 text-green-800',
        'Rejected': 'bg-red-100 text-red-800',
        'Hold': 'bg-yellow-100 text-yellow-800',
        'Offered': 'bg-blue-100 text-blue-800',
    };

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

export default function CandidateShow({ auth, candidate }) {

    console.log(candidate.timeline_events);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Candidate Profile
                    </h2>
                    <Link
                        href={route('candidates.edit', candidate.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Edit Candidate
                    </Link>
                </div>
            }
        >
            <Head title={`Candidate - ${candidate.full_name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                        {/* Basic Information */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg col-span-1 h-[calc(100vh-180px)] overflow-y-auto">
                            <h3 className="text-lg font-medium text-gray-900 border-b p-6 pb-2 mb-4 sticky top-0 bg-white z-10">Basic Information</h3>
                            <dl className="space-y-4 px-6">
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Full Name</dt>
                                    <dd className="mt-1 text-base text-gray-900">{candidate.full_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Department</dt>
                                    <dd className="mt-1 text-base text-gray-900">{candidate.department.department_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Position Applied</dt>
                                    <dd className="mt-1 text-base text-gray-900">{candidate.position_applied}</dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Contact Number</dt>
                                    <dd className="mt-1 text-base text-gray-900">{candidate.contact_number}</dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Additional Contact Number</dt>
                                    <dd className="mt-1 text-base text-gray-900">{candidate.contact_number_2}</dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-base text-gray-900">{candidate.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">City</dt>
                                    <dd className="mt-1 text-base text-gray-900">{candidate.city || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Education</dt>
                                    <dd className="mt-1 text-base text-gray-900">{candidate.education || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Experience</dt>
                                    <dd className="mt-1 text-base text-gray-900">{candidate.experience_years} years</dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Referred Type</dt>
                                    <dd className="mt-1 text-base text-gray-900">
                                        {candidate.referred_type ? candidate.referred_type : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Referred By Name</dt>
                                    <dd className="mt-1 text-base text-gray-900">
                                        {candidate.referred_by ? candidate.referred_by : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Remarks</dt>
                                    <dd className="mt-1 text-base text-gray-900">
                                        {candidate.remarks ? candidate.remarks : '-'}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Interview Details */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg  h-[calc(100vh-180px)] overflow-y-auto">
                            <h3 className="text-lg font-medium text-gray-900 border-b p-6 pb-2 mb-4 sticky top-0 bg-white z-10">Interview Details</h3>
                            <dl className="space-y-4 px-6">
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Application Date</dt>
                                    <dd className="mt-1 text-base text-gray-900">
                                        {format(new Date(candidate.application_date), 'dd/MM/yyyy')}
                                    </dd>
                                </div>
                                
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Current Organization</dt>
                                    <dd className="mt-1 text-base text-gray-900">{candidate.current_organization || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Current Salary</dt>
                                    <dd className="mt-1 text-base text-gray-900">
                                        {candidate.current_salary ? `₹${candidate.current_salary}` : '-'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-base font-medium text-gray-500">Expected Salary</dt>
                                    <dd className="mt-1 text-base text-gray-900">
                                        {candidate.expected_salary ? `₹${candidate.expected_salary}` : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Offered Salary</dt>
                                    <dd className="mt-1 text-base text-gray-900">
                                        {candidate.offered_salary ? `₹${candidate.offered_salary}` : '-'}
                                    </dd>
                                </div>
                                {/* <div>
                                    <dt className="text-base font-medium text-gray-500">Interview Date</dt>
                                    <dd className="mt-1 text-base text-gray-900">
                                        {candidate.interview_date ? format(new Date(candidate.interview_date), 'dd/MM/yyyy') : '-'}
                                    </dd>
                                </div> */}
                                <div>
                                    <dt className="text-base font-medium text-gray-500">Final Interview Status</dt>
                                    <dd className="mt-1">
                                        {candidate.interview_status ?
                                            <StatusBadge status={candidate.interview_status} type="interview" /> : '-'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-base font-medium text-gray-500">Final Status</dt>
                                    <dd className="mt-1">
                                        {candidate.final_status ?
                                            <StatusBadge status={candidate.final_status} type="final" /> : '-'}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Interview Rounds */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg  h-[calc(100vh-180px)] overflow-y-auto">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 p-6 mb-4 sticky top-0 bg-white z-10">Interview Rounds</h3>
                            {candidate.interview_rounds && candidate.interview_rounds.length > 0 ? (
                                <div className="space-y-6 px-6">
                                    {candidate.interview_rounds.map((round) => (
                                        <div key={round.round_number} className="border rounded-lg p-4">
                                            <h4 className="font-medium text-gray-900 mb-3">Round {round.round_number}</h4>
                                            <dl className="space-y-3">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Interviewer</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{round.interviewer_name}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Interview Date</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {round.interview_date ? format(new Date(round.interview_date), 'dd/MM/yyyy') : '-'}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                    <dd className="mt-1">
                                                        <StatusBadge status={round.status} type="interview" />
                                                    </dd>
                                                </div>
                                                {round.feedback && (
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-500">Feedback</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">{round.feedback}</dd>
                                                    </div>
                                                )}
                                            </dl>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-base text-gray-500 px-6">No interview rounds recorded yet.</p>
                            )}
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg col-span-1 h-[calc(100vh-180px)] overflow-y-auto">
                            <h3 className="text-lg font-medium text-gray-900 border-b p-6 pb-2 mb-4 sticky top-0 bg-white z-10">Documents</h3>
                            {candidate.documents.length > 0 ? (
                                // Group documents by category
                                Object.entries(
                                    candidate.documents.reduce((acc, doc) => {
                                        const categoryName = doc.category.category_name;
                                        if (!acc[categoryName]) {
                                            acc[categoryName] = [];
                                        }
                                        acc[categoryName].push(doc);
                                        return acc;
                                    }, {})
                                ).map(([category, docs]) => (
                                    <div key={category} className="mb-6 last:mb-0 px-6">
                                        <h4 className="text-lg font-medium text-gray-700 mb-2">{category}</h4>
                                        <ul className="space-y-3 pl-4">
                                            {docs.map((doc, index) => (
                                                <li key={index} className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-base text-gray-900">{doc.document_name}</p>
                                                        <p className="text-xs text-gray-400">
                                                            {format(new Date(doc.upload_datetime), 'dd/MM/yyyy HH:mm')}
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={`/storage/${doc.file_path}`}
                                                        target="_blank"
                                                        className="text-base text-blue-600 hover:text-blue-800"
                                                    >
                                                        View
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p className="text-base text-gray-500 px-6">No documents uploaded yet.</p>
                            )}
                        </div>
                        <div className="col-span-2  rounded-lg">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg h-[calc(100vh-180px)] overflow-y-auto">
                                <h3 className="text-lg p-6 font-medium text-gray-900 border-b pb-2 mb-4 sticky top-0 bg-white z-10">Timeline</h3>
                                <div className="flow-root px-6">
                                    <ul className="-mb-8">
                                        {candidate.timeline_events.map((event, index) => (
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
                                                                <p className="text-base text-gray-500">{event.event_description}</p>
                                                                <p className="mt-0.5 text-xs text-gray-400">
                                                                    {format(new Date(event.created_at), 'dd/MM/yyyy HH:mm')}
                                                                    &nbsp; | {event.created_by_user.name}
                                                                </p>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 