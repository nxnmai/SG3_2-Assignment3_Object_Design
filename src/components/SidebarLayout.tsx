'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Truck,
  CreditCard,
  Building2,
  MapPin,
  Settings,
  Bell,
  Search,
  User,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Bảng điều khiển', href: '/', icon: LayoutDashboard },
  { name: 'Tra cứu & Đặt hàng', href: '/orders', icon: Truck },
  { name: 'Thanh toán hóa đơn', href: '/payment', icon: CreditCard },
  { name: 'Trung tâm điều phối', href: '/assignment', icon: Building2 },
  { name: 'Theo dõi đơn hàng', href: '/tracking', icon: MapPin },
];

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-800 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 fixed h-full z-30 shadow-sm">
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
              SFM
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight block">ABC-Trans</span>
              <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">SmartFM System</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-md shadow-blue-600/25 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Settings */}
        <div className="border-t border-slate-100 pt-4 space-y-1">
          <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition">
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Cài đặt hệ thống</span>
          </button>
        </div>
      </aside>

      {/* Main Right Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Bar Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Top Search Input */}
          <div className="relative w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm mã vận đơn, xe, hoặc tài xế..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          {/* User & Notification Controls */}
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm border border-blue-200">
                A
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-slate-900 block">Nguyễn Văn An</span>
                <span className="text-slate-500 block">Khách hàng / Thành viên</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
