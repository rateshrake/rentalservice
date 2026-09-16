import React from 'react';
import {
  X,
  FileText,
  Lock,
  Download,
  Share2,
  MoreHorizontal,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Receipt,
  Camera,
} from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentPreviewPanelProps {
  document: DocumentItem | null;
  onClose: () => void;
  onDownload?: (doc: DocumentItem) => void;
  onShare?: (doc: DocumentItem) => void;
}

export const DocumentPreviewPanel: React.FC<DocumentPreviewPanelProps> = ({
  document,
  onClose,
  onDownload,
  onShare,
}) => {
  if (!document) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-8 flex flex-col items-center justify-center text-center h-full text-slate-400">
        <FileText className="w-12 h-12 stroke-[1.5] text-slate-300 mb-2" />
        <p className="text-xs font-semibold text-slate-600">No document selected</p>
        <p className="text-[11px] text-slate-400 mt-1">Select a document from the table to preview</p>
      </div>
    );
  }

  const isAadhaar =
    document.document_name.toLowerCase().includes('aadhaar') ||
    (document.type === 'Identity Proof' && !document.document_name.toLowerCase().includes('pan'));

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white">
        <h2 className="text-sm font-bold text-slate-900">Document Preview</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Preview Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Document Title Banner */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-600 text-white font-black text-[10px] flex items-center justify-center shadow-xs shrink-0 tracking-tighter">
            PDF
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-slate-900 truncate">
              {document.document_name}
            </h3>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {document.customer_name} &bull; {document.rental_id} &bull; {document.type}
            </p>
          </div>
        </div>

        {/* Visual Document Facsimile */}
        {isAadhaar ? (
          /* Aadhaar Card Visual Replica */
          <div className="border border-slate-300 rounded-xl bg-white shadow-xs overflow-hidden relative">
            {/* Top Emblem & Header Banner */}
            <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-orange-50/50 via-white to-green-50/50">
              {/* Ashoka Pillar Emblem Replica */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-8 flex flex-col items-center justify-center text-slate-800">
                  <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-[7px] font-serif font-black">
                    🏛️
                  </div>
                  <span className="text-[6px] font-bold text-slate-600 tracking-tighter mt-0.5">
                    सत्यमेव जयते
                  </span>
                </div>
              </div>

              {/* Tricolor Header Title */}
              <div className="text-center">
                <div className="h-0.5 w-24 bg-orange-500 mx-auto rounded-full mb-0.5" />
                <div className="text-[10px] font-black text-slate-800 tracking-tight leading-none">
                  भारत सरकार
                </div>
                <div className="text-[9px] font-bold text-slate-700 tracking-tight leading-tight">
                  Government of India
                </div>
                <div className="h-0.5 w-24 bg-emerald-600 mx-auto rounded-full mt-0.5" />
              </div>

              {/* Aadhaar Logo Replica */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 relative flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border-2 border-dashed border-red-500 flex items-center justify-center text-[10px]">
                    ☀️
                  </div>
                </div>
                <span className="text-[7px] font-black tracking-widest text-red-600 mt-0.5">
                  AADHAAR
                </span>
              </div>
            </div>

            {/* Middle: Photo + Info + QR Code */}
            <div className="p-4 grid grid-cols-12 gap-3 items-center">
              {/* Photo Avatar */}
              <div className="col-span-4">
                <div className="w-20 h-24 bg-slate-100 border border-slate-300 rounded flex flex-col items-center justify-center text-slate-400 shadow-2xs">
                  <div className="w-9 h-9 rounded-full bg-slate-300 mb-1 flex items-center justify-center text-white text-xs font-bold">
                    👤
                  </div>
                  <div className="w-14 h-6 rounded-t-full bg-slate-300" />
                </div>
              </div>

              {/* Details */}
              <div className="col-span-5 space-y-1 text-slate-800">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {document.customer_name}
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  DOB: <span className="font-semibold text-slate-800">**/**/1995</span>
                </div>
                <div className="text-[10px] text-slate-600 font-medium">
                  Male
                </div>
              </div>

              {/* QR Code with Lock */}
              <div className="col-span-3 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 border border-slate-300 rounded p-1 flex items-center justify-center relative shadow-2xs">
                  <QrCode className="w-full h-full text-slate-800 opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xs">
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aadhaar Number in Large Spaced Font */}
            <div className="px-4 pb-2 text-center">
              <div className="text-sm font-extrabold text-slate-900 tracking-[0.25em] font-mono">
                XXXX XXXX 1234
              </div>
            </div>

            {/* Card Footer Red Bar */}
            <div className="py-1 px-3 bg-red-600 text-white text-center text-[9px] font-bold tracking-wider">
              मेरा आधार, मेरी पहचान &bull; Mera Aadhaar, Meri Pehchaan
            </div>
          </div>
        ) : document.type === 'Damage Photo' ? (
          /* Damage Inspection Photo Replica */
          <div className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden relative shadow-xs">
            <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-orange-600" />
                Equipment Inspection Visual
              </span>
              <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                Incident Report
              </span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <div className="w-full h-40 rounded-lg bg-slate-800 text-slate-300 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                <Camera className="w-12 h-12 text-slate-500 stroke-[1.5] mb-2" />
                <span className="text-xs font-semibold text-slate-200">
                  {document.document_name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  High Resolution In-take Photo • {document.rental_id}
                </span>
                <div className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  Damage Tag #4
                </div>
              </div>
            </div>
          </div>
        ) : document.type === 'Receipt' ? (
          /* Payment Receipt Replica */
          <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Payment Slip
              </span>
              <span className="text-[10px] font-mono text-slate-500">{document.rental_id}</span>
            </div>
            <div className="text-center py-2">
              <div className="text-[11px] text-slate-400">Total Collected</div>
              <div className="text-lg font-black text-slate-900">₹6,500.00</div>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Payment Confirmed
              </span>
            </div>
          </div>
        ) : (
          /* Agreement Document Replica */
          <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-purple-600" />
                Standard Rental Terms & Agreement
              </span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Signed
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              This legally binding rental contract between LensLedger and {document.customer_name} covers custody, insurance deductible, and return inspection protocols for {document.rental_id}.
            </p>
          </div>
        )}

        {/* Sensitive Information Banner */}
        <div className="p-3 bg-rose-50/60 border border-rose-200/80 rounded-xl flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-rose-900">
              Sensitive Information Protected
            </div>
            <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
              Aadhaar number is masked for security. Full document is encrypted and access is logged. Only authorized users can view this document.
            </p>
          </div>
        </div>

        {/* Metadata Details List */}
        <div className="divide-y divide-slate-100 text-xs pt-1">
          <div className="py-2 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Document Type</span>
            <span className="font-semibold text-slate-800">{document.type}</span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Uploaded On</span>
            <span className="font-semibold text-slate-800">
              {document.uploaded_on_date}, {document.uploaded_on_time}
            </span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Uploaded By</span>
            <span className="font-semibold text-slate-800">
              {document.customer_name} (Customer)
            </span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Verified By</span>
            <span className="font-semibold text-slate-800">{document.verified_by}</span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Status</span>
            <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{document.status}</span>
            </div>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-slate-400 font-medium">File Size</span>
            <span className="font-semibold text-slate-800">{document.file_size}</span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Security</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{document.security}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 border-t border-slate-200/80 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDownload?.(document)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={() => onShare?.(document)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share (Secure)</span>
          </button>
        </div>

        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
