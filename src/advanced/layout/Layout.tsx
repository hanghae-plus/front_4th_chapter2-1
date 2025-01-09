import React from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-gray-100 p-8'>
      <div className='mx-auto max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl'>
        {children}
      </div>
    </div>
  );
};
