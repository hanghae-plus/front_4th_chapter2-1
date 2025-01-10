import { useContext } from 'react';

import { CartStoreContext } from '../stores/CartStore';

export const useCartStore = () => {
  const context = useContext(CartStoreContext);

  if (!context) {
    throw new Error('useCartStore must be used within a CartStoreProvider');
  }
};
