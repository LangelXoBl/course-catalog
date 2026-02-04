import type { ReactNode } from 'react';

import { Navbar } from './Navbar';

interface Props {
  children: ReactNode;
}
export const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-dvh mx-auto bg-background">
      <Navbar />
      <main className="w-3/5 mx-auto p-4">{children}</main>
    </div>
  );
};
