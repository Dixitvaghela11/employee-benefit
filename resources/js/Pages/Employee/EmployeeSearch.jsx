import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { calculateAge } from '@/utils/calculateAge';
import { formatRelation } from '@/utils/formatRelation';

export default function EmployeeSearch({ auth }) {
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const fetchSuggestions = debounce(async (value) => {
        if (value.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get('/employee-search/suggestions', {
                params: { search: value }
            });
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }, 300);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setShowSuggestions(true);
        fetchSuggestions(value);
    };

    const fetchEmployeeDetails = async (id) => {
        try {
            const response = await axios.get(`/employee-details/${id}`);
            setSelectedEmployee(response.data);
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

    const handleSelectEmployee = (employee) => {
        setSearch(`${employee.employee_code} - ${employee.full_name}`);
        setShowSuggestions(false);
        fetchEmployeeDetails(employee.id);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
                break;
            case 'Enter':
                if (focusedIndex >= 0) {
                    handleSelectEmployee(suggestions[focusedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setFocusedIndex(-1);
                break;
            case 'Tab':
                setShowSuggestions(false);
                setFocusedIndex(-1);
                break;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Employee Search
                </h2>
            }
        >
            <Head title="Employee Search" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 min-h-[calc(100vh-170px)]">
                            <div className="relative" ref={searchRef}>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search by Employee Code or Name..."
                                    className="w-full px-4 py-2 border rounded-md"
                                    role="combobox"
                                    aria-expanded={showSuggestions}
                                    aria-controls="suggestions-list"
                                    aria-activedescendant={focusedIndex >= 0 ? `suggestion-${suggestions[focusedIndex]?.id}` : undefined}
                                />

                                {showSuggestions && suggestions.length > 0 && (
                                    <div
                                        id="suggestions-list"
                                        role="listbox"
                                        className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto z-[100]"
                                    >
                                        {suggestions.map((suggestion, index) => (
                                            <div
                                                id={`suggestion-${suggestion.id}`}
                                                key={suggestion.id}
                                                role="option"
                                                aria-selected={focusedIndex === index}
                                                className={`px-4 py-2 cursor-pointer border-b last:border-b-0 ${focusedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-100'
                                                    }`}
                                                onClick={() => handleSelectEmployee(suggestion)}
                                            >
                                                <div className="font-medium text-gray-900">
                                                    {suggestion.employee_code} - {suggestion.full_name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {suggestion.department}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedEmployee && (
                                <div className="mt-8">
                                    <div className="flex gap-16">
                                        <div className=''>
                                            {selectedEmployee.employee_photograph ? (
                                                <img
                                                    src={selectedEmployee.employee_photograph}
                                                    alt="Employee"
                                                    className="w-32  object-cover rounded-lg shadow-md border p-1"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                    No photo
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-4 border-b">Employee Details</h3>
                                            <div className="grid grid-cols-5 gap-4 gap-x-24">
                                                <div>
                                                    <p className="text-sm text-gray-600">Employee Code</p>
                                                    <p className="font-medium">{selectedEmployee.employee_code}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Full Name</p>
                                                    <p className="font-medium">{selectedEmployee.full_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Department</p>
                                                    <p className="font-medium">{selectedEmployee.department}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Status</p>
                                                    <p className={`font-medium ${selectedEmployee.is_active === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {selectedEmployee.is_active}
                                                    </p>
                                                </div>
                                                {/* <div>
                                                    <p className="text-sm text-gray-600">WhatsApp</p>
                                                    <p className="font-medium">{selectedEmployee.whatsapp_number}</p>
                                                </div> */}
                                                <div>
                                                    <p className="text-sm text-gray-600">Gender</p>
                                                    <p className="font-medium">{selectedEmployee.gender}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Effective From</p>
                                                    <p className="font-medium">{selectedEmployee.effective_from ? new Date(selectedEmployee.effective_from).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Effective Till</p>
                                                    <p className="font-medium">{selectedEmployee.effective_till}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Self DOB</p>
                                                    <p className="font-medium">{selectedEmployee.self_dob ? new Date(selectedEmployee.self_dob).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Age</p>
                                                    <p className="font-medium">{calculateAge(selectedEmployee.self_dob)} years</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Category</p>
                                                    <p className="font-medium">{selectedEmployee.category}</p>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    {/* Dependents Section */}
                                    <div className="mt-8 border-t p-6 shadow-lg rounded-lg">
                                        <h3 className="text-lg font-medium mb-4">Dependents</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6">
                                            {selectedEmployee.dependents?.map((dependent) => (
                                                <div key={dependent.id} className="bg-gray-50 p-4 rounded-lg flex flex-col items-center shadow-sm">
                                                    {dependent.photoUrl && (
                                                        <img
                                                            src={dependent.photoUrl}
                                                            alt={dependent.name}
                                                            className=" h-32 object-cover rounded-lg mb-3 shadow-md"
                                                        />
                                                    )}
                                                    <p className="font-medium">{dependent.name}</p>
                                                    <p className="text-sm text-gray-600">{formatRelation(dependent.relation)}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Age: {calculateAge(dependent.dateOfBirth)} years
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        DOB: {new Date(dependent.dateOfBirth).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 