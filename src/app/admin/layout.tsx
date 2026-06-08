import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row-reverse">
      <AdminSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
