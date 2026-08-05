import { JsonFileRepository } from './JsonFileRepository';
import { Order } from '../domain/Order';

export class OrderRepository extends JsonFileRepository<Order & { id: string }> {
  constructor() {
    super('src/data/orders.json');
  }

  public async findById(id: string): Promise<Order | null> {
    const raw = await super.findById(id);
    return raw ? this.hydrate(raw) : null;
  }

  public async findAll(): Promise<Order[]> {
    const list = await super.findAll();
    return list.map(item => this.hydrate(item));
  }

  private hydrate(raw: any): Order {
    return new Order(
      raw.id,
      raw.customerId,
      raw.offeringId,
      raw.goodsDescription,
      raw.origin,
      raw.destination,
      raw.weight,
      raw.requiredVehicleType,
      raw.totalAmount,
      raw.status,
      raw.volume || 0.5,
      raw.createdAt ? new Date(raw.createdAt) : new Date(),
    );
  }
}
