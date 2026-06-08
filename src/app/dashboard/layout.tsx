import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row-reverse">
      <DashboardSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
