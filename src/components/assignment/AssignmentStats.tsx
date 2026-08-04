'use client'

import {
  Truck,
  Users,
  Package,
  CheckCircle,
} from "lucide-react";

import StatCard from "./StatCard";

interface AssignmentStatsProps {
  pendingShipments?: number;
  availableVehicles?: number;
  availableDrivers?: number;
  completedAssignments?: number;
}

export default function AssignmentStats({
  pendingShipments = 5,
  availableVehicles = 4,
  availableDrivers = 6,
  completedAssignments = 12,
}: AssignmentStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Pending Shipments"
        value={pendingShipments}
        subtitle="Waiting for assignment"
        icon={<Package size={24} />}
        bgColor="bg-orange-100"
        iconColor="text-orange-600"
      />

      <StatCard
        title="Available Vehicles"
        value={availableVehicles}
        subtitle="Ready for dispatch"
        icon={<Truck size={24} />}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
      />

      <StatCard
        title="Available Drivers"
        value={availableDrivers}
        subtitle="Qualified and available"
        icon={<Users size={24} />}
        bgColor="bg-green-100"
        iconColor="text-green-600"
      />

      <StatCard
        title="Assignments Today"
        value={completedAssignments}
        subtitle="Successfully completed"
        icon={<CheckCircle size={24} />}
        bgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
    </div>
  );
}