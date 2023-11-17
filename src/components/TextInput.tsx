import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="
        text-sm font-medium text-gray-700
      ">
        {label}
      </label>
      <input
        className="
          border-gray-300 
          focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none 
          rounded py-2 px-4 block w-full shadow-sm
        "
        {...props}
      />
    </div>
  );
};

export default TextInput;
