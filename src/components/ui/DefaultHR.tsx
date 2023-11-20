import React from 'react'
import { twMerge } from 'tailwind-merge'

interface DefaultHRProps extends React.HTMLAttributes<HTMLHRElement> {}

const DefaultHR: React.FC<DefaultHRProps> = ({ className, ...props }) => {
  const baseClass = 'my-4 border-gray-200' // ここにデフォルトのHRスタイルを定義

  const mergedClass = twMerge(baseClass, className)

  return <hr className={mergedClass} {...props} />
}

export default DefaultHR
