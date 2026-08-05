import { JsonFileRepository } from './JsonFileRepository';
import { Customer } from '../domain/Customer';

export class CustomerRepository extends JsonFileRepository<Customer & { id: string }> {
  constructor() {
    super('src/data/customers.json');
  }

  public async findById(id: string): Promise<Customer | null> {
    const raw = await super.findById(id);
    return raw ? this.hydrate(raw) : null;
  }

  public async findAll(): Promise<Customer[]> {
    const list = await super.findAll();
    return list.map(item => this.hydrate(item));
  }

  private hydrate(raw: any): Customer {
    return new Customer(
      raw.id,
      raw.name,
      raw.phone,
      raw.email,
      raw.address,
      raw.orderIds || [],
      raw.createdAt ? new Date(raw.createdAt) : new Date(),
    );
  }
}
