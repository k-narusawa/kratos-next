import React, { ReactNode } from 'react';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => (
  <div className="
    w-full max-w-md p-8 space-y-4 
  bg-white rounded-lg shadow dark:bg-gray-800
  ">
    {children}
  </div>
);

export default Card;