import React from 'react';

export const getEventTypeStyles = (eventType) => {
    switch (eventType) {
        case 'UpdateFinalStatus':
            return {
                bgColor: 'bg-green-500',
                ringColor: 'ring-green-50'
            };
        case 'UpdateInterviewStatus':
            return {
                bgColor: 'bg-blue-500',
                ringColor: 'ring-blue-50'
            };
        case 'UploadDocument':
            return {
                bgColor: 'bg-purple-500',
                ringColor: 'ring-purple-50'
            };
        case 'UpdateOfferedSalary':
            return {
                bgColor: 'bg-yellow-500',
                ringColor: 'ring-yellow-50'
            };
        case 'UpdateInterviewDate':
            return {
                bgColor: 'bg-indigo-500',
                ringColor: 'ring-indigo-50'
            };
        case 'Note':
            return {
                bgColor: 'bg-gray-500',
                ringColor: 'ring-gray-50'
            };
        case 'Created':
            return {
                bgColor: 'bg-teal-500',
                ringColor: 'ring-teal-50'
            };
        default:
            return {
                bgColor: 'bg-gray-500',
                ringColor: 'ring-gray-50'
            };
    }
};

export const TimelineIcons = ({ eventType }) => {
    switch (eventType) {
        case 'UpdateFinalStatus':
            return (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'UpdateInterviewStatus':
            return (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            );
        case 'UploadDocument':
            return (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        case 'UpdateOfferedSalary':
            return (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'UpdateInterviewDate':
            return (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'Note':
            return (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            );
        case 'Created':
            return (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            );
        default:
            return (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
    }
}; 