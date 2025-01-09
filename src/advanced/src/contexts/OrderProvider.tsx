import { useMemo, useState } from 'react';
import { usePreservedCallback } from '../hooks/usePreservedCallback';
import { createSafeContext } from '../lib/createSafeContext';

interface Props {
  children?: React.ReactNode;
}

const OrderProvider = ({ children }: Props) => {
  const [state, setState] = useState<ContextState>({
    recentOrder: '',
  });

  const setOrder = usePreservedCallback((productId: string) => {
    setState((prev) => ({ ...prev, recentOrder: productId }));
  });

  const actions = useMemo<ContextActions>(
    () => ({
      setOrder,
    }),
    [setOrder],
  );

  return (
    <OrderStateProvider {...state}>
      <OrderActionsProvider {...actions}>{children}</OrderActionsProvider>
    </OrderStateProvider>
  );
};

// Context API
interface ContextState {
  recentOrder: string;
}

interface ContextActions {
  setOrder: (productId: string) => void;
}

export const [OrderStateProvider, useOrderStateContext] =
  createSafeContext<ContextState>('OrderProvider');
export const [OrderActionsProvider, useOrderActionsContext] =
  createSafeContext<ContextActions>('OrderProvider');

export default OrderProvider;
