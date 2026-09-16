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
  ExternalLink
} from 'lucide-react';
import { CustomerItem } from '../../types';

interface CustomerDetailPanelProps {
  customer: CustomerItem;
  onClose?: () => void;
  onUpdateNotes?: (id: number, notes: string) => void;
  onViewAllRentals?: () => void;
}

export const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({
  customer,
  onClose,
  onUpdateNotes,
  onViewAllRentals,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showIdProof, setShowIdProof] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(customer.notes);

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
        <div className="flex items-center justify-end gap-1 mb-2">
          <button className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {customer.avatar_type === 'photo' && customer.avatar_img ? (
              <img
                src={customer.avatar_img}
                alt={customer.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-slate-200 text-slate-700 font-bold text-base flex items-center justify-center border-2 border-slate-100 shadow-xs">
                {customer.avatar_text || customer.name.slice(0, 2).toUpperCase()}
              </div>
            )}

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
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* WhatsApp Message Button */}
          <button
            onClick={() => window.open(`https://wa.me/${customer.primary_phone.replace(/[^0-9]/g, '')}`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <span className="text-emerald-600 font-bold">✆</span>
            <span>Message</span>
          </button>
        </div>

        {/* Contact Info List */}
        <div className="py-3 space-y-2 text-xs border-b border-slate-100">
          {/* Phone */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2.5 text-slate-700 font-medium">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{customer.primary_phone}</span>
            </div>
            <button
              onClick={() => handleCopy(customer.primary_phone, 'phone')}
              className="text-slate-400 hover:text-slate-700 transition-colors"
              title="Copy phone"
            >
              {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2.5 text-slate-700 font-medium">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{customer.email || 'customer@example.com'}</span>
            </div>
            <button
              onClick={() => handleCopy(customer.email || '', 'email')}
              className="text-slate-400 hover:text-slate-700 transition-colors"
              title="Copy email"
            >
              {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2.5 text-slate-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{customer.location || 'Mumbai, Maharashtra'}</span>
            </div>
            <button
              onClick={() => handleCopy(customer.location || '', 'loc')}
              className="text-slate-400 hover:text-slate-700 transition-colors"
              title="Copy location"
            >
              {copiedField === 'loc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
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
                    {showIdProof ? '4892 1892 1234' : customer.id_proof_masked}
                  </span>
                  <button
                    onClick={() => setShowIdProof(!showIdProof)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showIdProof ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified
            </span>
          </div>
        </div>

        {/* Notes Section */}
        <div className="py-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Notes</span>
            </div>
            {isEditingNotes ? (
              <button
                onClick={handleSaveNotes}
                className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
              >
                <Check className="w-3 h-3" /> Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            )}
          </div>

          {isEditingNotes ? (
            <textarea
              rows={3}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              className="w-full p-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">
              {notesText || customer.notes}
            </p>
          )}
        </div>

        {/* Rental History Summary */}
        <div className="py-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900">Rental History Summary</h4>
            <button
              onClick={onViewAllRentals}
              className="text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {/* Box 1: Total */}
            <div className="p-2 bg-slate-50 border border-slate-200/70 rounded-xl text-center">
              <div className="text-sm font-extrabold text-slate-900">{customer.total_rentals}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Total Rentals</div>
            </div>

            {/* Box 2: Active */}
            <div className="p-2 bg-rose-50/50 border border-rose-100 rounded-xl text-center">
              <div className="text-sm font-extrabold text-red-600">{customer.active_rentals}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Active Rentals</div>
            </div>

            {/* Box 3: Outstanding */}
            <div className="p-2 bg-rose-50/50 border border-rose-100 rounded-xl text-center">
              <div className="text-sm font-extrabold text-red-600 leading-tight">
                ₹{customer.outstanding_amount.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Outstanding</div>
            </div>

            {/* Box 4: Last Rental */}
            <div className="p-2 bg-slate-50 border border-slate-200/70 rounded-xl text-center">
              <div className="text-xs font-extrabold text-slate-900 leading-tight">{customer.last_rental}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Last Rental</div>
            </div>
          </div>
        </div>

        {/* Message Shortcuts */}
        <div className="pt-3">
          <div className="text-xs font-bold text-slate-900 mb-2">Message Shortcuts</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => window.open(`https://wa.me/${customer.primary_phone.replace(/[^0-9]/g, '')}`, '_blank')}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-2xs"
            >
              <span>✆</span>
              <span>Send on WhatsApp</span>
            </button>

            <button
              onClick={() => window.location.href = `mailto:${customer.email}`}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-red-600 font-semibold text-[11px] border border-rose-100 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Email</span>
            </button>

            <button
              onClick={() => alert(`Sending SMS to ${customer.primary_phone}`)}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-red-600 font-semibold text-[11px] border border-rose-100 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send SMS</span>
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
    </div>
  );
};
