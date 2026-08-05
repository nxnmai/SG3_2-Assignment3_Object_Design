import { IRepository } from './IRepository';
import defaultBranches from '../data/branches.json';
import defaultVehicles from '../data/vehicles.json';
import defaultDrivers from '../data/drivers.json';
import defaultStaff from '../data/staff.json';
import defaultCustomers from '../data/customers.json';
import defaultOrders from '../data/orders.json';
import defaultInvoices from '../data/invoices.json';
import defaultShipments from '../data/shipments.json';

const DEFAULT_DATA_MAP: Record<string, any[]> = {
  'src/data/branches.json': defaultBranches,
  'branches.json': defaultBranches,
  'src/data/vehicles.json': defaultVehicles,
  'vehicles.json': defaultVehicles,
  'src/data/drivers.json': defaultDrivers,
  'drivers.json': defaultDrivers,
  'src/data/staff.json': defaultStaff,
  'staff.json': defaultStaff,
  'src/data/customers.json': defaultCustomers,
  'customers.json': defaultCustomers,
  'src/data/orders.json': defaultOrders,
  'orders.json': defaultOrders,
  'src/data/invoices.json': defaultInvoices,
  'invoices.json': defaultInvoices,
  'src/data/shipments.json': defaultShipments,
  'shipments.json': defaultShipments,
};

// Generic JSON-file-backed repository with browser memory & fallback data.
export class JsonFileRepository<T extends { id: string }> implements IRepository<T> {
  private inMemoryItems: Map<string, T[]> = new Map();

  constructor(private readonly filePath: string) {}

  private async readAll(): Promise<T[]> {
    if (typeof window === 'undefined') {
      try {
        const { promises: fs } = await import('fs');
        const path = await import('path');
        const absolutePath = path.resolve(this.filePath);
        const raw = await fs.readFile(absolutePath, 'utf-8');
        return JSON.parse(raw) as T[];
      } catch (err) {
        const inMem = this.inMemoryItems.get(this.filePath);
        if (inMem && inMem.length > 0) return inMem;
        return (DEFAULT_DATA_MAP[this.filePath] as T[]) || [];
      }
    } else {
      // Browser environment: use localStorage or default data map fallback
      try {
        const key = `smartfm_${this.filePath}`;
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored) as T[];
      } catch (e) {
        // Fallback
      }
      const inMem = this.inMemoryItems.get(this.filePath);
      if (inMem && inMem.length > 0) return inMem;
      return (DEFAULT_DATA_MAP[this.filePath] as T[]) || [];
    }
  }

  private async writeAll(items: T[]): Promise<void> {
    this.inMemoryItems.set(this.filePath, items);

    if (typeof window === 'undefined') {
      try {
        const { promises: fs } = await import('fs');
        const path = await import('path');
        const absolutePath = path.resolve(this.filePath);
        await fs.writeFile(absolutePath, JSON.stringify(items, null, 2), 'utf-8');
      } catch (err) {
        // Ignore file write errors in restricted envs
      }
    } else {
      try {
        const key = `smartfm_${this.filePath}`;
        localStorage.setItem(key, JSON.stringify(items));
      } catch (e) {
        // Fallback
      }
    }
  }

  async findAll(): Promise<T[]> {
    return this.readAll();
  }

  async findById(id: string): Promise<T | undefined> {
    const items = await this.readAll();
    return items.find((i) => i.id === id);
  }

  async save(entity: T): Promise<void> {
    const items = await this.readAll();
    const idx = items.findIndex((i) => i.id === entity.id);
    if (idx >= 0) items[idx] = entity; else items.push(entity);
    await this.writeAll(items);
  }

  async delete(id: string): Promise<void> {
    const items = await this.readAll();
    await this.writeAll(items.filter((i) => i.id !== id));
  }
}
