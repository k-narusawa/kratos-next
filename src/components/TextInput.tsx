
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextInput: React.FC<TextInputProps> = (props) => {
  return (
    <input
      className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none rounded py-2 px-4 block w-full shadow-sm"
      {...props}
    />
  );
};

export default TextInput;
