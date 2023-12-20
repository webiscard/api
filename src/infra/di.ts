import { PrismaClient } from '@prisma/client'
import { asFunction, asValue, Resolver } from 'awilix'
import * as Interfaces from '@/app/common/interfaces'
import { ImageFileSystem, makeImageFileSystem } from './image-fs'
import * as repositories from './repos'

export interface Dependencies {
  db: PrismaClient
  imageFileSystem: ImageFileSystem
  usersRepository: Interfaces.UsersRepository
  cardsRepository: Interfaces.CardsRepository
  sessionsRepository: Interfaces.SessionsRepository
  imagesRepository: Interfaces.ImagesRepository
}

export function makeInfrastructure(): {
  [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]>
} {
  const db = new PrismaClient()

  db.$connect().catch(() => {
    process.exit(1)
  })

  return {
    db: asValue(db),
    imageFileSystem: asFunction(makeImageFileSystem).singleton(),
    usersRepository: asFunction(repositories.makeUsersRepository).singleton(),
    cardsRepository: asFunction(repositories.makeCardsRepository).singleton(),
    sessionsRepository: asFunction(
      repositories.makeSessionsRepository,
    ).singleton(),
    imagesRepository: asFunction(repositories.makeImagesRepository).singleton(),
  }
}
