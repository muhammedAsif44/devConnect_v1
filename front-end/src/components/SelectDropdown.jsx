import React from "react";
import { useField } from "formik";
import { ChevronDown } from "lucide-react";

const SelectDropdown = React.memo(({ label, options = [], ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (e) => {
    helpers.setValue(e.target.value);
    if (props.onChange) props.onChange(e);
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={props.name}
        className="text-xs font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <select
          {...field}
          {...props}
          value={field.value || ""}
          onChange={handleChange}
          className={`w-full pl-3 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#043873] appearance-none ${
            meta.touched && meta.error
              ? "border-red-500 bg-red-50 focus:ring-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      {meta.touched && meta.error && (
        <p className="mt-1 text-xs text-red-600">{meta.error}</p>
      )}
    </div>
  );
});

export default SelectDropdown;
