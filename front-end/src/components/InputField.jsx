import React from 'react';
import { useField } from 'formik';

const InputField = ({ label, icon: Icon, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div className="flex flex-col">
            <label htmlFor={props.name} className="text-xs font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />}
                <input
                    {...field}
                    {...props}
                    value={field.value || ''}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#043873] ${
                        meta.touched && meta.error ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-300'
                    }`}
                />
            </div>
            {meta.touched && meta.error && <p className="mt-1 text-xs text-red-600">{meta.error}</p>}
        </div>
    );
};

export default InputField;
