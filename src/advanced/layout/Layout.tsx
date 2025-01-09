import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className='bg-gray-100 p-8'>
      <div className='mx-auto max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl'>
        <Header>{title}</Header>
        {children}
      </div>
    </div>
  );
};
