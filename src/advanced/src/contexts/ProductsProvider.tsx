import { useMemo, useState } from 'react';
import { usePreservedCallback } from '../hooks/usePreservedCallback';
import { createSafeContext } from '../lib/createSafeContext';
import { Product } from './ProductsProvider.types';

interface Props {
  children?: React.ReactNode;
}

const ProductsProvider = ({ children }: Props) => {
  const [state, setState] = useState<ContextState>({
    products: [
      { id: 'p1', name: '상품1', price: 10000, stock: 50 },
      { id: 'p2', name: '상품2', price: 20000, stock: 30 },
      { id: 'p3', name: '상품3', price: 30000, stock: 20 },
      { id: 'p4', name: '상품4', price: 15000, stock: 0 },
      { id: 'p5', name: '상품5', price: 25000, stock: 10 },
    ],
  });

  const getProduct = usePreservedCallback((id: string) => {
    return state.products.find((product) => product.id === id);
  });

  const updateProduct = usePreservedCallback((updatedProduct: Product) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    }));
  });

  const actions = useMemo<ContextActions>(
    () => ({
      getProduct,
      updateProduct,
    }),
    [getProduct],
  );

  return (
    <ProductsStateProvider {...state}>
      <ProductsActionsProvider {...actions}>{children}</ProductsActionsProvider>
    </ProductsStateProvider>
  );
};

// Context API
interface ContextState {
  products: Product[];
}

interface ContextActions {
  getProduct: (id: string) => Product | undefined;
  updateProduct: (updatedProduct: Product) => void;
}

export const [ProductsStateProvider, useProductsStateContext] =
  createSafeContext<ContextState>('ProductsProvider');
export const [ProductsActionsProvider, useProductsActionsContext] =
  createSafeContext<ContextActions>('ProductsProvider');

export default ProductsProvider;
