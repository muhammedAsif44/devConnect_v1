import React from 'react';
import { Users, Calendar, DollarSign, Shield, CheckCircle } from 'lucide-react';

const iconMap = {
  users: Users,
  calendar: Calendar,
  dollar: DollarSign,
  shield: Shield,
};

const iconColorMap = {
  users: 'text-blue-500 bg-blue-50',
  calendar: 'text-green-500 bg-green-50',
  dollar: 'text-purple-500 bg-purple-50',
  shield: 'text-red-500 bg-red-50',
};

function StatCard({ title, value, icon, change, vs }) {
  const IconComponent = iconMap[icon] || Users;
  const iconColor = iconColorMap[icon] || 'text-gray-500 bg-gray-50';
  const isPositive = change && change.startsWith('+');
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <IconComponent size={24} />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-2 text-sm">
          <span className={`flex items-center gap-1 font-semibold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive && <CheckCircle size={14} />}
            {change}
          </span>
          <span className="text-gray-500">{vs}</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;
