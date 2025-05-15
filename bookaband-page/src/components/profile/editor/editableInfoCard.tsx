import { Pencil } from 'lucide-react';
import React, { useState } from 'react';

interface EditableInfoCardProps {
  firstName: string;
  familyName: string;
  email: string;
  bio?: string;
  onSave: (data: {
    newFirstName: string;
    newFamilyName: string;
    newBio: string;
  }) => void;
}

export default function EditableInfoCard({
  firstName: initialFirstName,
  familyName: initialFamilyName,
  email,
  bio: initialBio = '',
  onSave,
}: EditableInfoCardProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [familyName, setFamilyName] = useState(initialFamilyName);
  const [bio, setBio] = useState(initialBio);

  const handleSave = () => {
    onSave({ newFirstName: firstName, newFamilyName: familyName, newBio: bio });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-4 flex items-center gap-2">
        <Pencil className="h-5 w-5 text-[#15b7b9]" />
        <h2 className="text-lg font-semibold text-gray-800">
          Edit Personal Info
        </h2>
      </div>

      <div className="space-y-4">
        {/* Nombre */}
        <div className="flex items-center space-x-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Surname
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            value={email}
            disabled={true}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="pt-4 text-right">
          <button
            onClick={handleSave}
            className="rounded-full bg-[#15b7b9] px-5 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:bg-[#13a0a1]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
