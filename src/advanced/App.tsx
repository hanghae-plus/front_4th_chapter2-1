import React from 'react';
import { GlobalContextProvider } from './context';
import AppContent from './AppContent';

export const App = () => {
  return (
    <GlobalContextProvider>
      <AppContent />
    </GlobalContextProvider>
  );
};
