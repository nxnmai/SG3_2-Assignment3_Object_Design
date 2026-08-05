import { IRepository } from './IRepository';

// Generic JSON-file-backed repository with browser memory fallback.
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
        return this.inMemoryItems.get(this.filePath) || [];
      }
    } else {
      // Browser environment: use localStorage or in-memory map fallback
      try {
        const key = `smartfm_${this.filePath}`;
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored) as T[];
      } catch (e) {
        // Fallback
      }
      return this.inMemoryItems.get(this.filePath) || [];
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
