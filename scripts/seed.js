const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

const sampleBranches = [
  { id: 'BR-HCM', name: 'Chi nhánh Hồ Chí Minh', address: '123 Nguyễn Huệ, Quận 1, TP.HCM', vehicleIds: ['VEH-001', 'VEH-002'], staffIds: ['STF-001'], driverIds: ['STF-D01', 'STF-D02'] },
  { id: 'BR-HN', name: 'Chi nhánh Hà Nội', address: '45 Tràng Tiền, Hoàn Kiếm, Hà Nội', vehicleIds: ['VEH-003', 'VEH-004'], staffIds: ['STF-002'], driverIds: ['STF-D03'] },
  { id: 'BR-DN', name: 'Chi nhánh Đà Nẵng', address: '78 Bạch Đằng, Hải Châu, Đà Nẵng', vehicleIds: ['VEH-005'], staffIds: ['STF-003'], driverIds: ['STF-D04'] },
];

const sampleVehicles = [
  { id: 'VEH-001', branchId: 'BR-HCM', type: 'TRUCK_5T', capacityKg: 5000, capacityVolumeM3: 20, status: 'AVAILABLE' },
  { id: 'VEH-002', branchId: 'BR-HCM', type: 'VAN', capacityKg: 1000, capacityVolumeM3: 5, status: 'AVAILABLE' },
  { id: 'VEH-003', branchId: 'BR-HN', type: 'TRUCK_2T', capacityKg: 2000, capacityVolumeM3: 10, status: 'AVAILABLE' },
  { id: 'VEH-004', branchId: 'BR-HN', type: 'VAN', capacityKg: 1000, capacityVolumeM3: 5, status: 'AVAILABLE' },
  { id: 'VEH-005', branchId: 'BR-DN', type: 'MOTORBIKE', capacityKg: 100, capacityVolumeM3: 0.5, status: 'AVAILABLE' },
];

const sampleDrivers = [
  {
    id: 'STF-D01',
    branchId: 'BR-HCM',
    name: 'Nguyễn Văn Tài (Tài Xế)',
    phone: '0909123456',
    email: 'driver1@smartfm.vn',
    role: 'DRIVER',
    credentials: { username: 'driver1', password: '123' },
    licenseExpiry: '2028-12-31T00:00:00.000Z',
    vehicleTypes: ['TRUCK_5T', 'TRUCK_2T', 'VAN'],
    status: 'AVAILABLE',
  },
  {
    id: 'STF-D02',
    branchId: 'BR-HCM',
    name: 'Lê Văn Lái (Tài Xế)',
    phone: '0909654321',
    email: 'driver2@smartfm.vn',
    role: 'DRIVER',
    credentials: { username: 'driver2', password: '123' },
    licenseExpiry: '2027-06-30T00:00:00.000Z',
    vehicleTypes: ['VAN', 'MOTORBIKE'],
    status: 'AVAILABLE',
  },
  {
    id: 'STF-D03',
    branchId: 'BR-HN',
    name: 'Phạm Văn Chạy (Tài Xế)',
    phone: '0912345678',
    email: 'driver3@smartfm.vn',
    role: 'DRIVER',
    credentials: { username: 'driver3', password: '123' },
    licenseExpiry: '2029-01-15T00:00:00.000Z',
    vehicleTypes: ['TRUCK_2T', 'VAN'],
    status: 'AVAILABLE',
  },
];

const sampleStaff = [
  {
    id: 'STF-001',
    branchId: 'BR-HCM',
    name: 'Trần Thị Thu (Nhân Viên Chi Nhánh)',
    phone: '0988776655',
    email: 'staff1@smartfm.vn',
    role: 'BRANCH_STAFF',
    credentials: { username: 'staff1', password: '123' },
  },
];

const sampleCustomers = [
  {
    id: 'CUST-001',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'customer@example.com',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    orderIds: ['ORD-001'],
    createdAt: new Date().toISOString(),
  },
];

const sampleOrders = [
  {
    id: 'ORD-001',
    customerId: 'CUST-001',
    offeringId: 'OFF-STD',
    goodsDescription: '2 thùng máy tính để bàn',
    origin: 'BR-HCM',
    destination: 'BR-HN',
    weight: 10,
    volume: 0.8,
    requiredVehicleType: 'VAN',
    status: 'PENDING_PAYMENT',
    totalAmount: 250000,
    createdAt: new Date().toISOString(),
  },
];

const sampleInvoices = [
  {
    id: 'INV-001',
    orderId: 'ORD-001',
    totalAmount: 250000,
    paidAmount: 0,
    status: 'UNPAID',
    createdAt: new Date().toISOString(),
  },
];

const sampleShipments = [
  {
    id: 'SHP-001',
    orderId: 'ORD-001',
    trackingNo: 'TRK-001',
    origin: 'BR-HCM',
    destination: 'BR-HN',
    weight: 10,
    volume: 0.8,
    requiredVehicleType: 'VAN',
    status: 'UNASSIGNED',
    currentLocation: 'BR-HCM',
    lastUpdated: new Date().toISOString(),
    trackingUpdates: [
      {
        id: 'TRK-UPD-001',
        shipmentId: 'SHP-001',
        status: 'UNASSIGNED',
        location: 'BR-HCM',
        source: 'SYSTEM',
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

const samplePayments = [];

function writeJson(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Seeded ${filename} (${data.length} records)`);
}

function runSeed() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  writeJson('branches.json', sampleBranches);
  writeJson('vehicles.json', sampleVehicles);
  writeJson('drivers.json', sampleDrivers);
  writeJson('staff.json', sampleStaff);
  writeJson('customers.json', sampleCustomers);
  writeJson('orders.json', sampleOrders);
  writeJson('invoices.json', sampleInvoices);
  writeJson('shipments.json', sampleShipments);
  writeJson('payments.json', samplePayments);

  console.log('✅ Seed data successfully initialized!');
}

runSeed();
