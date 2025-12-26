import { Navbar } from './Navbar';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
export const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-dvh mx-auto bg-surface">
      <Navbar />
      <main className="w-3/5 mx-auto p-4">{children}</main>
    </div>
  );
};
