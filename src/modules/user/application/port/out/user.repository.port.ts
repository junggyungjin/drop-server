import { User } from '../../../domain/user.entity';

export const UserRepositoryPorySymbol = Symbol('UserRepositoryPort');

export interface UserRepositoryPort {
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByProviderId(provider: string, providerId: string): Promise<User | null>;
}