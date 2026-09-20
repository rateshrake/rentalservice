import React, { useState } from 'react';
import { X, UserPlus, Phone, PhoneCall, Fingerprint, MapPin, User } from 'lucide-react';

export interface CustomerFormData {
  name: string;
  primary_phone: string;
  alternate_phone: string;
  aadhaar_number: string;
  address: string;
  verification?: 'Verified' | 'Pending';
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: CustomerFormData) => void;
  initialData?: any;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name || '');
      setPrimaryPhone(initialData.primary_phone || '');
      setAlternatePhone(initialData.alternate_phone || '');
      setAadhaarNumber(initialData.aadhaar_number || '');
      setAddress(initialData.address || '');
      setIsVerified(initialData.verification === 'Verified');
    } else if (isOpen) {
      setName('');
      setPrimaryPhone('');
      setAlternatePhone('');
      setAadhaarNumber('');
      setAddress('');
      setIsVerified(false);
    }
  }, [isOpen, initialData]);

  const isEditMode = Boolean(initialData && 'id' in initialData && initialData.id);

  if (!isOpen) return null;

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only digits and format as XXXX XXXX XXXX (max 12 digits)
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setAadhaarNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !primaryPhone.trim()) return;

    setIsSubmitting(true);
    try {
      onSuccess?.({
        name: name.trim(),
        primary_phone: primaryPhone.trim(),
        alternate_phone: alternatePhone.trim(),
        aadhaar_number: aadhaarNumber.trim(),
        address: address.trim(),
        verification: isVerified ? 'Verified' : 'Pending',
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleModalClose = () => {
    setName('');
    setPrimaryPhone('');
    setAlternatePhone('');
    setAadhaarNumber('');
    setAddress('');
    setIsVerified(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center border border-rose-100 shadow-2xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h2>
              <p className="text-xs text-slate-500 mt-1">{isEditMode ? 'Update customer details' : 'Register a new customer to rent equipment'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="e.g. Rahul Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          {/* Primary Phone Number & Alternative Number Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Alternative Number
              </label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  placeholder="+91 91234 56789"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Aadhaar Number
            </label>
            <div className="relative">
              <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="XXXX XXXX XXXX (12-digit Aadhaar)"
                value={aadhaarNumber}
                onChange={handleAadhaarChange}
                maxLength={14}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs font-mono tracking-wider placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Used for customer identity verification and security deposit record.</p>
          </div>

          {/* Address Text Field */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <textarea
                rows={3}
                placeholder="Full address (Flat / House No., Street, Area, City, State - PIN Code)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Verification Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg mt-4">
            <div>
              <label className="block font-semibold text-slate-700">Verified</label>
              <p className="text-[10px] text-slate-500 mt-0.5">Mark if the customer's identity is verified.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsVerified(!isVerified)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                isVerified ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                  isVerified ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleModalClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !primaryPhone.trim()}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Register Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
