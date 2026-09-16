import React from 'react';
import { FileText, Image as ImageIcon, MoreVertical, MoreHorizontal } from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentsTableProps {
  documents: DocumentItem[];
  selectedDocumentId: number;
  onSelectDocument: (doc: DocumentItem) => void;
  onActionClick?: (doc: DocumentItem) => void;
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  selectedDocumentId,
  onSelectDocument,
  onActionClick,
}) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Identity Proof':
        return 'bg-blue-50 text-blue-600 border-blue-200/70';
      case 'Receipt':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200/70';
      case 'Agreement':
        return 'bg-purple-50 text-purple-600 border-purple-200/70';
      case 'Damage Photo':
        return 'bg-orange-50 text-orange-600 border-orange-200/70';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') {
      return (
        <div className="w-7 h-7 rounded bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-rose-600 stroke-[2]" />
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
        <ImageIcon className="w-4 h-4 text-rose-600 stroke-[2]" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs flex flex-col h-full">
      {/* Table Header Row */}
      <div className="px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white">
        <h2 className="text-sm font-bold text-slate-900">
          Documents <span className="text-slate-400 font-normal">({documents.length})</span>
        </h2>
        <button
          type="button"
          className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-4 font-bold">Document Name</th>
              <th className="py-2.5 px-4 font-bold">Customer</th>
              <th className="py-2.5 px-4 font-bold">Rental ID</th>
              <th className="py-2.5 px-4 font-bold">Type</th>
              <th className="py-2.5 px-4 font-bold">Uploaded On</th>
              <th className="py-2.5 px-4 font-bold">Verified By</th>
              <th className="py-2.5 px-4 font-bold">Status</th>
              <th className="py-2.5 px-3 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {documents.map((doc) => {
              const isSelected = doc.id === selectedDocumentId;
              return (
                <tr
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className={`transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-rose-50/50 hover:bg-rose-50/70'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Document Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      {getFileIcon(doc.file_type)}
                      <span
                        className={`font-semibold truncate max-w-[160px] ${
                          isSelected ? 'text-[#E11D48]' : 'text-slate-900'
                        } group-hover:text-[#E11D48] transition-colors`}
                      >
                        {doc.document_name}
                      </span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                    {doc.customer_name}
                  </td>

                  {/* Rental ID */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {doc.rental_id}
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getTypeBadge(
                        doc.type
                      )}`}
                    >
                      {doc.type}
                    </span>
                  </td>

                  {/* Uploaded On */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-[11px] font-medium text-slate-800">
                      {doc.uploaded_on_date}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {doc.uploaded_on_time}
                    </div>
                  </td>

                  {/* Verified By */}
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {doc.verified_by}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          doc.status === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      <span
                        className={`text-[11px] font-semibold ${
                          doc.status === 'Verified' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onActionClick?.(doc);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
