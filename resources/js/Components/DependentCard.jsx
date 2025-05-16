import { useState, useRef } from 'react'
import { formatRelation } from '@/utils/formatRelation';

export function DependentCard({ dependent, onUpdate, onRemove }) {
    const [photoPreview, setPhotoPreview] = useState(dependent.photoUrl || '')
    const fileInputRef = useRef(null)

    console.log('Dependent Card', dependent)

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64 = reader.result
                setPhotoPreview(base64)
                onUpdate({ ...dependent, photoUrl: base64 })
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePhotoClick = () => {
        fileInputRef.current?.click()
    }

    const imageSource = photoPreview?.startsWith('data:')
        ? photoPreview
        : photoPreview

    return (
        <div className="bg-white rounded border shadow-sm p-3 text-xs">
            <div className="flex justify-end mb-2">
                {/* <button
                    onClick={() => onRemove(dependent.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove Dependent"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button> */}
            </div>

            <div className="flex gap-3">
                {/* Left side - Photo */}
                <div className="flex flex-col justify-center space-y-2">
                    <div
                        onClick={handlePhotoClick}
                        className="w-28 h-36 relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                        title="Click to change photo"
                    >
                        {imageSource ? (
                            <img
                                src={imageSource}
                                alt={`Photo of ${dependent.name}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 mb-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Add Photo
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                    />
                </div>

                {/* Right side - Form fields */}
                <div className="flex-1 grid grid-cols-1 gap-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={dependent.name}
                            onChange={(e) => onUpdate({ ...dependent, name: e.target.value })}
                            className="block w-full rounded-md border-gray-300 shadow-sm 
                                focus:border-indigo-500 focus:ring-indigo-500 
                                py-1 text-xs"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            value={dependent.dateOfBirth}
                            onChange={(e) => onUpdate({ ...dependent, dateOfBirth: e.target.value })}
                            className="block w-full rounded-md border-gray-300 shadow-sm 
                                focus:border-indigo-500 focus:ring-indigo-500 
                                py-1 text-xs"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Relation
                        </label>
                        <select
                            value={dependent.relation}
                            onChange={(e) => onUpdate({ ...dependent, relation: e.target.value })}
                            className="block w-full rounded-md border-gray-300 shadow-sm 
                                focus:border-indigo-500 focus:ring-indigo-500 
                                py-1 text-xs"
                        >
                            <option value="spouse">{formatRelation('spouse')}</option>
                            <option value="dependent1">{formatRelation('dependent1')}</option>
                            <option value="dependent2">{formatRelation('dependent2')}</option>
                            <option value="father">{formatRelation('father')}</option>
                            <option value="mother">{formatRelation('mother')}</option>
                            <option value="additional_dependent1">{formatRelation('additional_dependent1')}</option>
                            <option value="additional_dependent2">{formatRelation('additional_dependent2')}</option>
                            <option value="additional_dependent3">{formatRelation('additional_dependent3')}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={dependent.status}
                            onChange={(e) => onUpdate({ ...dependent, status: e.target.value })}
                            className="block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 
            py-1 text-xs"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
} 