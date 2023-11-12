import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseStyle = 'py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded';
  const primaryStyle = 'bg-blue-500 hover:bg-blue-700 text-white focus:ring-blue-500';
  const secondaryStyle = 'bg-gray-500 hover:bg-gray-700 text-white focus:ring-gray-500';

  const style = `${baseStyle} ${variant === 'primary' ? primaryStyle : secondaryStyle}`;

  return (
    <button className={style} {...props}>
      {children}
    </button>
  );
};

export default Button;
