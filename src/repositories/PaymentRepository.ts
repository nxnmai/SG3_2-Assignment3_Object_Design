import { JsonFileRepository } from './JsonFileRepository';
import { Payment } from '../domain/Payment';

export class PaymentRepository extends JsonFileRepository<Payment & { id: string }> {
  constructor() {
    super('src/data/payments.json');
  }
}
