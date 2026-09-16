import React, { useState } from 'react';
import { DocumentsHeader } from './DocumentsHeader';
import { DocumentsFilterBar } from './DocumentsFilterBar';
import { DocumentCategoryCards, DocumentCategory } from './DocumentCategoryCards';
import { DocumentsTable } from './DocumentsTable';
import { DocumentPreviewPanel } from './DocumentPreviewPanel';
import { DocumentsData, DocumentItem } from '../../types';

interface DocumentsViewProps {
  data: DocumentsData;
  onUploadDocument: (data: Partial<DocumentItem>) => Promise<DocumentItem>;
  onOpenSearch: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  data,
  onUploadDocument,
  onOpenSearch,
}) => {
  const [activeCategory, setActiveCategory] = useState<DocumentCategory>('all');
  const [documentType, setDocumentType] = useState<string>('All Types');
  const [customer, setCustomer] = useState<string>('All Customers');
  const [rentalId, setRentalId] = useState<string>('All Rentals');
  const [dateRange, setDateRange] = useState<string>('01 May 2025 - 27 May 2025');
  const [selectedDocId, setSelectedDocId] = useState<number>(data.documents[0]?.id || 1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset filters
  const handleReset = () => {
    setActiveCategory('all');
    setDocumentType('All Types');
    setCustomer('All Customers');
    setRentalId('All Rentals');
    setDateRange('01 May 2025 - 27 May 2025');
    showToast('Filters reset to default');
  };

  // Filter documents
  const filteredDocuments = data.documents.filter((doc) => {
    // Category pill filter
    if (activeCategory === 'identity' && doc.type !== 'Identity Proof') return false;
    if (activeCategory === 'receipts' && doc.type !== 'Receipt') return false;
    if (activeCategory === 'agreements' && doc.type !== 'Agreement') return false;
    if (activeCategory === 'damage' && doc.type !== 'Damage Photo') return false;

    // Dropdown filters
    if (documentType !== 'All Types' && doc.type !== documentType) return false;
    if (customer !== 'All Customers' && doc.customer_name !== customer) return false;
    if (rentalId !== 'All Rentals' && doc.rental_id !== rentalId) return false;

    return true;
  });

  const selectedDocument =
    data.documents.find((d) => d.id === selectedDocId) || filteredDocuments[0] || null;

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <DocumentsHeader
        onUploadDocument={() => showToast('Upload document modal ready')}
        onOpenSearch={onOpenSearch}
      />

      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
        {/* Horizontal Filters Bar */}
        <DocumentsFilterBar
          documentType={documentType}
          onDocumentTypeChange={setDocumentType}
          customer={customer}
          onCustomerChange={setCustomer}
          rentalId={rentalId}
          onRentalIdChange={setRentalId}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onReset={handleReset}
          onSearch={() => showToast(`Search applied: ${filteredDocuments.length} results found`)}
        />

        {/* 5 Category Summary Cards */}
        <DocumentCategoryCards
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            if (cat === 'all') setDocumentType('All Types');
            else if (cat === 'identity') setDocumentType('Identity Proof');
            else if (cat === 'receipts') setDocumentType('Receipt');
            else if (cat === 'agreements') setDocumentType('Agreement');
            else if (cat === 'damage') setDocumentType('Damage Photo');
          }}
          counts={data.counts}
        />

        {/* Master-Detail Split Pane: Documents Table + Document Preview */}
        <div className="grid grid-cols-12 gap-5 items-start">
          {/* Left Table (~62% / 7 cols) */}
          <div className="col-span-12 lg:col-span-7 h-[580px]">
            <DocumentsTable
              documents={filteredDocuments}
              selectedDocumentId={selectedDocId}
              onSelectDocument={(doc) => setSelectedDocId(doc.id)}
              onActionClick={(doc) => showToast(`Options for ${doc.document_name}`)}
            />
          </div>

          {/* Right Document Preview (~38% / 5 cols) */}
          <div className="col-span-12 lg:col-span-5 h-[580px]">
            <DocumentPreviewPanel
              document={selectedDocument}
              onClose={() => showToast('Preview closed')}
              onDownload={(doc) => showToast(`Downloading ${doc.document_name}...`)}
              onShare={(doc) => showToast(`Secure link generated for ${doc.document_name}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
