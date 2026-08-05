import { JsonFileRepository } from './JsonFileRepository';
import { Invoice } from '../domain/Invoice';

export class InvoiceRepository extends JsonFileRepository<Invoice & { id: string }> {
  constructor() {
    super('src/data/invoices.json');
  }

  public async findById(id: string): Promise<Invoice | null> {
    const raw = await super.findById(id);
    return raw ? this.hydrate(raw) : null;
  }

  public async findByOrderId(orderId: string): Promise<Invoice | null> {
    const list = await this.findAll();
    return list.find(inv => inv.orderId === orderId) || null;
  }

  public async findAll(): Promise<Invoice[]> {
    const list = await super.findAll();
    return list.map(item => this.hydrate(item));
  }

  private hydrate(raw: any): Invoice {
    return new Invoice(
      raw.id,
      raw.orderId,
      raw.totalAmount,
      raw.paidAmount,
      raw.status,
      raw.createdAt ? new Date(raw.createdAt) : new Date(),
    );
  }
}
