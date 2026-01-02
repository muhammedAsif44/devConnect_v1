import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
  ...props
}) => {
  const alertConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
      darkBg: 'dark:bg-green-900/20 dark:border-green-800',
      darkText: 'dark:text-green-200'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50 border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
      darkBg: 'dark:bg-red-900/20 dark:border-red-800',
      darkText: 'dark:text-red-200'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
      darkBg: 'dark:bg-yellow-900/20 dark:border-yellow-800',
      darkText: 'dark:text-yellow-200'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      darkBg: 'dark:bg-blue-900/20 dark:border-blue-800',
      darkText: 'dark:text-blue-200'
    }
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div 
      className={`
        p-4 border rounded-lg flex items-start space-x-3
        ${config.bgColor} ${config.darkBg}
        ${className}
      `}
      {...props}
    >
      <Icon 
        size={20} 
        className={`flex-shrink-0 mt-0.5 ${config.iconColor}`} 
      />
      
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={`text-sm font-medium ${config.textColor} ${config.darkText}`}>
            {title}
          </h3>
        )}
        {message && (
          <p className={`text-sm mt-1 ${config.textColor} ${config.darkText}`}>
            {message}
          </p>
        )}
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ml-3 ${config.textColor} hover:opacity-75`}
        >
          <XCircle size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
