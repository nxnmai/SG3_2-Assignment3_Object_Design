export interface IRepository<T, IdType = string> {
  findAll(): Promise<T[]>;
  findById(id: IdType): Promise<T | undefined>;
  save(entity: T): Promise<void>;
  delete(id: IdType): Promise<void>;
}
