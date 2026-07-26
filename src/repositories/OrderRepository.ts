import { JsonFileRepository } from './JsonFileRepository';
import { Order } from '../domain/Order';

export class OrderRepository extends JsonFileRepository<Order & { id: string }> {
  constructor() {
    super('src/data/orders.json');
  }
}
