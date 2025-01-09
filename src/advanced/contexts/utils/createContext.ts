import { useContext } from 'react';

export const useCreateCartContext = <T>(context: React.Context<T>, contextname: string, ProviderName: string) => {
  const createdContext = useContext(context);
  if (createdContext === undefined) {
    throw new Error(`${contextname} must be used within ${ProviderName}`);
  }
  return createdContext;
};
