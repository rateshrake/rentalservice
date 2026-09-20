import React, { useState, useEffect } from 'react';
import { X, Camera, UploadCloud, Link as LinkIcon } from 'lucide-react';
import { InventoryItem, EquipmentStatusType, EquipmentConditionType, EquipmentCategoryType } from '../../types';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<InventoryItem>) => void;
  itemToEdit?: InventoryItem | null;
}

const normalizeDateForInput = (val?: string): string => {
  if (!val) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return '';
};

export const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    category: 'Cameras' as EquipmentCategoryType,
    rental_rate: '',
    status: 'Available' as EquipmentStatusType,
    condition: 'Excellent' as EquipmentConditionType,
    image_url: '',
    serial_number: '',
    purchase_date: '',
    warranty: '',
  });
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  
  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || '',
        subtitle: itemToEdit.subtitle || '',
        category: itemToEdit.category || 'Cameras',
        rental_rate: itemToEdit.rental_rate ? String(itemToEdit.rental_rate) : '',
        status: itemToEdit.status || 'Available',
        condition: itemToEdit.condition || 'Excellent',
        image_url: itemToEdit.image_url || '',
        serial_number: itemToEdit.serial_number || '',
        purchase_date: normalizeDateForInput(itemToEdit.purchase_date),
        warranty: normalizeDateForInput(itemToEdit.warranty),
      });
      if (itemToEdit.image_url && itemToEdit.image_url.startsWith('data:')) {
        setImageMode('file');
      } else {
        setImageMode('url');
      }
    } else {
      setFormData({
        name: '',
        subtitle: '',
        category: 'Cameras',
        rental_rate: '',
        status: 'Available',
        condition: 'Excellent',
        image_url: '',
        serial_number: '',
        purchase_date: '',
        warranty: '',
      });
      setImageMode('url');
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name.trim(),
      subtitle: formData.subtitle.trim(),
      category: formData.category,
      rental_rate: Number(formData.rental_rate) || 0,
      status: formData.status,
      condition: formData.condition,
      image_url: formData.image_url.trim(),
      serial_number: formData.serial_number.trim(),
      purchase_date: formData.purchase_date,
      warranty: formData.warranty.trim(),
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setFormData((prev) => ({ ...prev, image_url: ev.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {itemToEdit ? 'Edit Equipment' : 'Add New Equipment'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {itemToEdit ? 'Update inventory details' : 'Add to your inventory'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Name & Alias */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Equipment Name *</label>
              <input 
                required
                type="text"
                placeholder="e.g. Sony A7 IV"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Alias Name</label>
              <input 
                type="text"
                placeholder="e.g. Primary Cam"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
              />
            </div>
          </div>

          {/* Category & Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as EquipmentCategoryType})}
              >
                <option value="Cameras">Cameras</option>
                <option value="Lenses">Lenses</option>
                <option value="Audio">Audio</option>
                <option value="Lighting">Lighting</option>
                <option value="Gimbals">Gimbals</option>
                <option value="Tripods">Tripods</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Rate per day (₹) *</label>
              <input 
                required
                type="number"
                min="0"
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                value={formData.rental_rate}
                onChange={(e) => setFormData({...formData, rental_rate: e.target.value})}
              />
            </div>
          </div>

          {/* Status & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as EquipmentStatusType})}
              >
                {(!itemToEdit || formData.status === 'Available') && <option value="Available">Available</option>}
                <option value="Rented Out">Rented Out</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Condition</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value as EquipmentConditionType})}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Needs Repair">Needs Repair</option>
              </select>
            </div>
          </div>

          {/* Optional Fields: Serial Number, Purchase Date, Warranty */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Serial Number</label>
              <input 
                type="text"
                placeholder="Optional"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                value={formData.serial_number}
                onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Purchase Date</label>
              <input 
                type="date"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none cursor-pointer"
                value={formData.purchase_date}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Warranty Validity</label>
              <input 
                type="date"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none cursor-pointer"
                value={formData.warranty}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                onChange={(e) => setFormData({...formData, warranty: e.target.value})}
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Image</label>
              <div className="flex bg-slate-100 rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-2 py-1 text-[10px] font-semibold rounded-sm transition-colors cursor-pointer ${imageMode === 'url' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <LinkIcon className="w-3 h-3 inline-block mr-1" /> URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`px-2 py-1 text-[10px] font-semibold rounded-sm transition-colors cursor-pointer ${imageMode === 'file' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <UploadCloud className="w-3 h-3 inline-block mr-1" /> Upload
                </button>
              </div>
            </div>
            
            {imageMode === 'url' ? (
              <input 
                type="text"
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              />
            ) : (
              <div className="relative w-full">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-slate-200 file:text-slate-700 file:text-[10px] file:font-semibold hover:file:bg-slate-300 cursor-pointer"
                />
              </div>
            )}
            {formData.image_url && (
              <div className="mt-3 flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="w-14 h-14 rounded-md overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800">Image Preview</div>
                  <div className="text-[10.5px] text-slate-500 truncate max-w-xs">{formData.image_url.startsWith('data:') ? 'Local file attached' : formData.image_url}</div>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, image_url: ''})}
                    className="text-[10.5px] font-semibold text-red-600 hover:text-red-700 mt-1 cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm shadow-red-600/20"
            >
              {itemToEdit ? 'Save Changes' : 'Add Equipment'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
