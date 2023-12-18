import { Session } from '@/domain/entities/session'
import { User } from '@/domain/entities/user'

export interface SessionsRepository {
  create(params: Omit<Session, 'id' | 'createdAt'>): Promise<Session>

  getManyByUserId(params: Pick<Session, 'userId'>): Promise<Session[]>

  getWithUserById(
    params: Pick<Session, 'id'>,
  ): Promise<(Session & { user: User }) | null>

  deleteManyByUserId(params: Pick<Session, 'userId'>): Promise<void>
}
