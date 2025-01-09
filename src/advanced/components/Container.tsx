import { PropsWithChildren } from 'react';

export default function Container({ children }: PropsWithChildren) {
  return <div className='bg-gray-100 p-8'>{children}</div>;
}
