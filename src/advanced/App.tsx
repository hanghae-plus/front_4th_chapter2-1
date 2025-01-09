import React, { useEffect } from 'react';
import { CartTemplate } from './pages/Cart';
import { eventTimer } from './utils/eventTimer';

export default function App() {
  useEffect(() => {
    eventTimer();
  }, []);

  return <CartTemplate />;
}
