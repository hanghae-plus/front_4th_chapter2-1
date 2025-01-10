import { createContext } from 'react';

import { Cart } from '@/advanced/types/types';

export const CartStoreContext = createContext<Cart | null>(null);

// export const cartStoreProvider = (children: React.ReactNode) => {

//   return <CartStoreContext.Provider>{children}</CartStoreContext.Provider>;
// };
