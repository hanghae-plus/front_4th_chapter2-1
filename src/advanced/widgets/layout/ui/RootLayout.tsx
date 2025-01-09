import { PropsWithChildren } from "react";

export function RootLayout({ children }: PropsWithChildren) {
  return <div className="bg-gray-100 p-8">{children}</div>;
}
