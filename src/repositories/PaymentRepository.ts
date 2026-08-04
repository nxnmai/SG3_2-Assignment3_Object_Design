import { JsonFileRepository } from './JsonFileRepository';
import { Payment, PaymentMethod, PaymentStatus } from '../domain/Payment';

export class PaymentRepository extends JsonFileRepository<Payment & { id: string }> {
  constructor() {
    super('src/data/payments.json');
  }

  private hydrate(raw: Payment & { id: string }): Payment {
    return new Payment(
      raw.id,
      raw.invoiceId,
      raw.method as PaymentMethod,
      raw.amount,
      raw.transactionRef,
      raw.status as PaymentStatus,
      raw.error,
      raw.isDeposit,
      new Date(raw.createdAt),
    );
  }

  async findAll(): Promise<Payment[]> {
    const items = await super.findAll();
    return items.map((item) => this.hydrate(item));
  }

  async findById(id: string): Promise<Payment | undefined> {
    const item = await super.findById(id);
    return item ? this.hydrate(item) : undefined;
  }

  async findByInvoiceId(invoiceId: string): Promise<Payment[]> {
    const items = await super.findAll();
    return items
      .filter((item) => item.invoiceId === invoiceId)
      .map((item) => this.hydrate(item));
  }

  async save(entity: Payment): Promise<void> {
    await super.save(entity as Payment & { id: string });
  }
}
