// client/src/components/ui/Select.js
import React from 'react';

const Select = ({ children, value, onChange, multiple = false, className = '', name }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      multiple={multiple}
      className={`border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${className}`}
    >
      {children}
    </select>
  );
};

export default Select;
