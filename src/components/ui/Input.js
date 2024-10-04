// client/src/components/ui/Input.js
import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder = '', className = '', name }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${className}`}
    />
  );
};

export default Input;
