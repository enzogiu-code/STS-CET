import React from 'react';
import { LucideIcon } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface DateResultCardProps {
  label: string;
  date: Date;
  description: string;
  icon: LucideIcon;
  isCritical?: boolean;
  timeOverride?: string;
  code: string;
}

export const DateResultCard: React.FC<DateResultCardProps> = ({ 
  label, 
  date, 
  description, 
  icon: Icon, 
  isCritical = false,
  timeOverride,
  code
}) => {
  const formattedDate = format(date, 'EEEE d MMMM yyyy', { locale: it });

  return (
    <div className={`card-print relative overflow-hidden rounded-xl border-l-4 shadow-md bg-white p-5 transition-all
      ${isCritical ? 'border-cet-red' : 'border-cet-secondary'}
    `}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider ${isCritical ? 'text-cet-red' : 'text-cet-secondary'}`}>
            {code}
          </span>
          <h4 className="text-lg font-bold text-slate-900 mt-1">{label}</h4>
        </div>
        <div className={`p-2 rounded-full ${isCritical ? 'bg-red-100 text-cet-red' : 'bg-blue-50 text-cet-secondary'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xl font-mono font-semibold text-slate-800 capitalize">
          {formattedDate}
          {timeOverride && <span className="text-cet-red ml-2 font-bold">{timeOverride}</span>}
        </p>
        <p className="text-sm text-slate-500 mt-2 leading-snug">
          {description}
        </p>
      </div>
    </div>
  );
};