import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminAuthGuard from '@/components/AdminAuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen min-w-[1024px] bg-background">
        <AdminSidebar />
        <main className="ml-64 min-h-screen min-w-0 bg-muted/30 p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </AdminAuthGuard>
  );
}
