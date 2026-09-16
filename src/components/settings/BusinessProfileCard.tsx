import React from 'react';
import { Store, Camera } from 'lucide-react';
import { BusinessProfile } from '../../types';

interface BusinessProfileCardProps {
  profile: BusinessProfile;
  onChange: (updated: Partial<BusinessProfile>) => void;
  onChangeLogo?: () => void;
}

export const BusinessProfileCard: React.FC<BusinessProfileCardProps> = ({
  profile,
  onChange,
  onChangeLogo,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
          <Store className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-900">Business Profile</h2>
          <p className="text-[11px] text-slate-500">Your store details and branding</p>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="space-y-3.5 flex-1 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={profile.business_name || ''}
              onChange={(e) => onChange({ business_name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={profile.tagline || ''}
              onChange={(e) => onChange({ tagline: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile.email || ''}
              onChange={(e) => onChange({ email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Address
            </label>
            <textarea
              rows={3}
              value={profile.address || ''}
              onChange={(e) => onChange({ address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Logo
            </label>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#E11D48] flex items-center justify-center text-white shadow-xs shrink-0">
                <Camera className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={onChangeLogo}
                  className="px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  Change Logo
                </button>
                <div className="text-[10px] text-slate-400">
                  PNG, JPG (Max 2MB)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
