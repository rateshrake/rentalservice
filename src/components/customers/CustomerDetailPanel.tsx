import React, { useState } from 'react';
import {
  MoreHorizontal,
  X,
  Phone,
  Mail,
  MapPin,
  Copy,
  Calendar,
  Fingerprint,
  Eye,
  EyeOff,
  FileText,
  Edit2,
  Check,
  MessageSquare,
  Send,
  Clock,
  ExternalLink,
  Trash2,
  Camera,
  FileCheck
} from 'lucide-react';
import { CustomerItem } from '../../types';

interface CustomerDetailPanelProps {
  customer: CustomerItem;
  onClose?: () => void;
  onUpdateNotes?: (id: number, notes: string) => void;
  onUpdateVerification?: (id: number, status: string) => void;
  onViewAllRentals?: () => void;
  onEditCustomer?: (customer: CustomerItem) => void;
  onDeleteCustomer?: (id: number) => void;
}

export const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({
  customer,
  onClose,
  onUpdateNotes,
  onUpdateVerification,
  onViewAllRentals,
  onEditCustomer,
  onDeleteCustomer,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showIdProof, setShowIdProof] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(customer.notes);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  React.useEffect(() => {
    setNotesText(customer.notes);
    setIsEditingNotes(false);
  }, [customer.id, customer.notes]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveNotes = () => {
    onUpdateNotes?.(customer.id, notesText);
    setIsEditingNotes(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between h-full overflow-y-auto">
      <div>
        {/* Top bar controls */}
        <div className="flex items-center justify-end gap-1 mb-2 relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-8 top-6 w-32 bg-white rounded-lg shadow-lg border border-slate-200 z-10 py-1">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onEditCustomer?.(customer);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowDeleteConfirm(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base leading-tight">
              {customer.name}
            </h3>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Copy className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                  {customer.code}
                </span>

                {customer.verification === 'Verified' ? (
                  <button
                    onClick={() => onUpdateVerification?.(customer.id, 'Pending')}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Verified
                  </button>
                ) : (
                  <button
                    onClick={() => onUpdateVerification?.(customer.id, 'Verified')}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Pending
                  </button>
                )}
              </div>
            </div>
          </div>

        {/* Contact Info List */}
        <div className="py-3.5 space-y-2.5 text-xs border-b border-slate-100">
          {/* Primary Phone */}
          <div className="flex items-center justify-between group p-2 rounded-lg bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-700 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center text-slate-500 shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 font-medium leading-none mb-1">Primary Phone</div>
                <div className="text-xs font-semibold text-slate-800">{customer.primary_phone}</div>
              </div>
            </div>
            <button
              onClick={() => handleCopy(customer.primary_phone, 'phone')}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
              title="Copy phone"
            >
              {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Alternate Phone */}
          {customer.alternate_phone && (
            <div className="flex items-center justify-between group p-2 rounded-lg bg-slate-50/70 border border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-700 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center text-slate-500 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-medium leading-none mb-1">Alternate Phone</div>
                  <div className="text-xs font-semibold text-slate-800">{customer.alternate_phone}</div>
                </div>
              </div>
              <button
                onClick={() => handleCopy(customer.alternate_phone || '', 'altPhone')}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                title="Copy alternate phone"
              >
                {copiedField === 'altPhone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {/* Address / Location */}
          {(customer.address || customer.location) && (
            <div className="flex items-start justify-between group p-2 rounded-lg bg-slate-50/70 border border-slate-100">
              <div className="flex items-start gap-2.5 text-slate-700 min-w-0 pr-2">
                <div className="w-7 h-7 rounded-lg bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-medium leading-none mb-1">Address</div>
                  <div className="text-xs font-semibold text-slate-800 leading-snug">{customer.address || customer.location}</div>
                </div>
              </div>
              <button
                onClick={() => handleCopy(customer.address || customer.location || '', 'loc')}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-colors shrink-0 cursor-pointer"
                title="Copy address"
              >
                {copiedField === 'loc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Customer Since & Total Rentals Tiles */}
        <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-100">
          <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight">Customer Since</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 leading-tight">{customer.customer_since}</div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight">Total Rentals</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 leading-tight">{customer.total_rentals}</div>
            </div>
          </div>
        </div>

        {/* Identity Proof Card */}
        <div className="py-3 border-b border-slate-100">
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {customer.id_proof_type || 'Identity Proof (Aadhaar)'}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-600 font-mono tracking-wider">
                    {showIdProof
                      ? (customer.aadhaar_number || customer.id_proof_masked || '4892 1892 1234')
                      : (customer.id_proof_masked || '•••• •••• ••••')}
                  </span>
                  <button
                    onClick={() => setShowIdProof(!showIdProof)}
                    className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showIdProof ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {customer.verification === 'Verified' ? (
              <button
                type="button"
                onClick={() => onUpdateVerification?.(customer.id, 'Pending')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
                title="Click to mark as Pending"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onUpdateVerification?.(customer.id, 'Verified')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
                title="Click to mark as Verified"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Pending
              </button>
            )}
          </div>
        </div>

        {/* Message Shortcuts */}
        <div className="pt-3">
          <div className="text-xs font-bold text-slate-900 mb-2">Message Shortcuts</div>
          <div className="space-y-2">
            <button
              onClick={() => window.open(`https://wa.me/${customer.primary_phone.replace(/[^0-9]/g, '')}`, '_blank')}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-2xs"
            >
              <span>✆</span>
              <span>Send on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Last updated: 27 May 2025, 10:24 AM</span>
        </div>
        <div>Created by: Ravi Kumar</div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Customer</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete <span className="font-semibold text-slate-700">{customer.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeleteCustomer?.(customer.id);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
