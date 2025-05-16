import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { DependentCard } from '@/Components/DependentCard'
import axios from 'axios'
import { toast } from 'react-toastify'
import { calculateAge } from '@/utils/calculateAge';

const EmployeeDependent = ({ auth, employee, existingDependents }) => {
    const [dependents, setDependents] = useState(existingDependents || []);
    const [employeePhoto, setEmployeePhoto] = useState(employee.employee_photograph ? `${employee.employee_photograph}` : '');

    const handleEmployeePhotoChange = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setEmployeePhoto(reader.result)
            }
            reader.readAsDataURL(file)
        }
    };

    const handleDependentUpdate = (updated) => {
        const newDependents = dependents.map(dep =>
            dep.id === updated.id ? updated : dep
        );
        setDependents(newDependents);
    };

    const addDependent = () => {
        if (dependents.length < 5) {
            const newDependent = {
                id: Date.now(),
                name: '',
                relation: 'spouse',
                dateOfBirth: '',
                photoUrl: '',
                status: 'Active',
            };
            setDependents([...dependents, newDependent]);

        }
    };

    const removeDependent = (id) => {
        const newDependents = dependents.filter(dep => dep.id !== id);
        setDependents(newDependents);
    };

    const handleSave = async () => {
        try {
            await axios.post(`/employee-dependents/${employee.id}/save`, {
                employeePhoto: employeePhoto?.startsWith('data:') ? employeePhoto : null,
                dependents: dependents
            });
            toast.success('Dependents saved successfully');
        } catch (error) {
            toast.error('Error saving dependents');
            console.error('Error saving dependents:', error);
        }
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Employee Dependents
                </h2>
            }
        >
            <Head title="Employee Dependents" />
            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-4 space-y-6">
                            <div className="flex  border-b pb-6">
                                <div className="">
                                    <div className="space-y-4">
                                        <div className="w-32 h-44 relative bg-gray-100 rounded-lg overflow-hidden">
                                            {employeePhoto ? (
                                                <img
                                                    src={employeePhoto}
                                                    alt="Employee"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    No photo
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleEmployeePhotoChange}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                        />
                                    </div>
                                </div>

                                <div className="w-full">
                                    <h3 className="text-lg font-medium mb-4 border-b">Employee Details</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Employee Code</p>
                                            <p className="font-medium">{employee.employee_code}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Full Name</p>
                                            <p className="font-medium">{employee.full_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Department</p>
                                            <p className="font-medium">{employee.department}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Date of Birth</p>
                                            <p className="font-medium">{new Date(employee.self_dob).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <p className={`font-medium ${employee.is_active === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                                                {employee.is_active}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Effective From</p>
                                            <p className="font-medium">{new Date(employee.effective_from).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Age</p>
                                            <p className="font-medium">{calculateAge(employee.self_dob)} years</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Gender</p>
                                            <p className="font-medium">{employee.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Category</p>
                                            <p className="font-medium">{employee.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">Dependents</h3>
                                    {dependents.length < 5 && (
                                        <button
                                            onClick={addDependent}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            Add Dependent
                                        </button>
                                    )}
                                </div>

                                {dependents.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        No dependents added yet. Click "Add Dependent" to begin.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                        {dependents.map((dependent) => (
                                            <DependentCard
                                                key={dependent.id}
                                                dependent={dependent}
                                                onUpdate={handleDependentUpdate}
                                                onRemove={removeDependent}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            {dependents.length > 0 && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>
    )
}

export default EmployeeDependent 