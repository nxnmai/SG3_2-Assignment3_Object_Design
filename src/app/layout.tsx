import './globals.css';
import { SidebarLayout } from '../components/SidebarLayout';

export const metadata = {
  title: 'ABC-Trans — SmartFM Logistics Management System',
  description: 'Hệ thống quản lý kho vận thông minh SmartFM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
