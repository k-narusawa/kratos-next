import React from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const primaryStyle = 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500'
  const secondaryStyle = 'hover:bg-blue-100 text-blue-500 focus:ring-blue-100'

  const baseClass = `py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded ${
    variant === 'primary' ? primaryStyle : secondaryStyle
  }`

  const mergedClass = twMerge(baseClass, className)

  return (
    <button className={mergedClass} {...props}>
      {children}
    </button>
  )
}

export default Button
