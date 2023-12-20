import { CardsRepository } from '@/app/common/interfaces/cards-repository'
import { CardData } from '@/domain/entities/card'
import { Dependencies } from '@/infra/di'

export function makeCardsRepository({
  db,
}: Pick<Dependencies, 'db'>): CardsRepository {
  return {
    async create({ userId, username }) {
      return db.card.create({
        data: {
          username,
          user: {
            connect: {
              id: userId,
            },
          },
          publicData: {},
          draftData: {},
        },
      })
    },
    async updateCard({ userId, ...data }) {
      const { username, draftData } = data

      await db.card.update({
        where: { userId },
        data: {
          username,
          draftData: draftData ? { update: { ...draftData } } : undefined,
        },
      })
    },
    async publish({ userId }) {
      const existingCard = await db.card.findUnique({
        where: { userId },
      })

      if (!existingCard) return

      const draftData: CardData = existingCard.draftData

      await db.card.update({
        where: { userId },
        data: {
          publicData: { ...draftData },
          publishedAt: new Date(Date.now()),
          isPublished: true,
        },
      })
    },
    async findByUsername({ username }) {
      return db.card.findUnique({
        where: { username },
      })
    },
    async findByUserId({ userId }) {
      return db.card.findUnique({
        where: { userId },
      })
    },
  }
}
