import { promises as fs } from 'fs';
import path from 'path';
import { IRepository } from './IRepository';

// Generic JSON-file-backed repository. Satisfies the spec's "database
// design (in an OO manner)" requirement without a real DB.
export class JsonFileRepository<T extends { id: string }> implements IRepository<T> {
  constructor(private readonly filePath: string) {}

  private async readAll(): Promise<T[]> {
    const raw = await fs.readFile(path.resolve(this.filePath), 'utf-8');
    return JSON.parse(raw) as T[];
  }

  private async writeAll(items: T[]): Promise<void> {
    await fs.writeFile(path.resolve(this.filePath), JSON.stringify(items, null, 2));
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
