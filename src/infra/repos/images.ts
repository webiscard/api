import { ImagesRepository } from '@/app/common/interfaces/images-repository'
import { Image } from '@/domain/entities/image'
import { Dependencies } from '@/infra/di'

export function makeImagesRepository({
  db,
}: Pick<Dependencies, 'db'>): ImagesRepository {
  return {
    async create({ userId, ...params }: Omit<Image, 'id'>) {
      return db.image.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          ...params,
        },
      })
    },
    async getByFilename({ filename }) {
      return db.image.findUnique({ where: { filename } })
    },
  }
}
