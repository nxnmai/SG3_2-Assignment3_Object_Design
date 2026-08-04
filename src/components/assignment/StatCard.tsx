import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  iconColor?: string;
  bgColor?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = "text-blue-600",
  bgColor = "bg-blue-100",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${bgColor}`}
        >
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
    </div>
  );
}