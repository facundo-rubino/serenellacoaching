import type { Metadata } from "next";
import { AdminToaster } from "./AdminToaster";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <AdminToaster />
    </>
  );
}
