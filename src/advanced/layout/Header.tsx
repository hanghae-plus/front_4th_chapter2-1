import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  return <div className='mb-4 text-2xl font-bold'>{children}</div>;
};
