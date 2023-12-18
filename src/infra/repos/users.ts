import { UsersRepository } from '@/app/common/interfaces'
import { Dependencies } from '@/infra/di'

export function makeUsersRepository({
  db,
}: Pick<Dependencies, 'db'>): UsersRepository {
  return {
    async create({ email, password }) {
      return db.user.create({
        data: { email, password },
      })
    },
    async findById({ id }) {
      return db.user.findUnique({
        where: { id },
      })
    },
    async findByEmail({ email }) {
      return db.user.findUnique({
        where: { email },
      })
    },
  }
}
