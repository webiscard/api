import { SessionsRepository } from '@/app/common/interfaces'
import { Dependencies } from '@/infra/di'

export function makeSessionsRepository({
  db,
}: Pick<Dependencies, 'db'>): SessionsRepository {
  return {
    async create({ userId, ...other }) {
      return db.session.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          ...other,
        },
      })
    },
    async getManyByUserId({ userId }) {
      return db.session.findMany({
        where: { userId },
      })
    },
    async deleteManyByUserId({ userId }) {
      db.session.deleteMany({
        where: { userId },
      })
    },
    async getWithUserById({ id }) {
      return db.session.findUnique({
        where: { id },
        include: {
          user: true,
        },
      })
    },
  }
}
