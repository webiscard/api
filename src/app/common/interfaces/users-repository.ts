import { User } from '@/domain/entities/user'

export interface UsersRepository {
  create(params: Omit<User, 'id'>): Promise<User>

  findById(params: Pick<User, 'id'>): Promise<User | null>

  findByEmail(params: Pick<User, 'email'>): Promise<User | null>
}
