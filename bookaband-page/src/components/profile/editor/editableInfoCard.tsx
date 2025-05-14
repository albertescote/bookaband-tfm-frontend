import { Pencil } from 'lucide-react';
import { useState } from 'react';

export interface BillingAddress {
  country: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
}

interface EditableInfoCardProps {
  fullName: string;
  email: string;
  bio?: string;
  billingAddress: BillingAddress;
  onSave: (data: {
    fullName: string;
    email: string;
    bio: string;
    billingAddress: BillingAddress;
  }) => void;
}

export default function EditableInfoCard({
  fullName: initialName,
  email: initialEmail,
  bio: initialBio = '',
  billingAddress: initialAddress,
  onSave,
}: EditableInfoCardProps) {
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [bio, setBio] = useState(initialBio);
  const [billingAddress, setBillingAddress] =
    useState<BillingAddress>(initialAddress);

  const handleChange = (key: keyof BillingAddress, value: string) => {
    setBillingAddress({ ...billingAddress, [key]: value });
  };

  const handleSave = () => {
    onSave({ fullName, email, bio, billingAddress });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Edit Personal Info
        </h2>
        <Pencil className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-[#15b7b9] focus:ring-1 focus:ring-[#15b7b9]"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
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
            onChange={(e) => setEmail(e.target.value)}
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
