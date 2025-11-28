import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'default' | 'alert';
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, children, icon: Icon, variant = 'default' }) => {
  const borderColor = variant === 'alert' ? 'border-cet-red' : 'border-cet-primary/20';
  const headerBg = variant === 'alert' ? 'bg-red-50' : 'bg-slate-50';
  const titleColor = variant === 'alert' ? 'text-cet-red' : 'text-cet-primary';

  return (
    <div className={`card-print bg-white rounded-lg border ${borderColor} shadow-sm overflow-hidden mb-4`}>
      <div className={`${headerBg} px-4 py-3 border-b ${borderColor} flex items-center gap-2`}>
        {Icon && <Icon className={`w-5 h-5 ${titleColor}`} />}
        <h3 className={`font-bold text-sm uppercase tracking-wide ${titleColor}`}>
          {title}
        </h3>
      </div>
      <div className="p-4 text-sm text-slate-700 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
};