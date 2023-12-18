import { PrismaClient } from '@prisma/client'
import { asFunction, asValue, Resolver } from 'awilix'
import * as Interfaces from '@/app/common/interfaces'
import * as repositories from './repos'

export interface Dependencies {
  db: PrismaClient
  usersRepository: Interfaces.UsersRepository
  cardsRepository: Interfaces.CardsRepository
  sessionsRepository: Interfaces.SessionsRepository
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
    usersRepository: asFunction(repositories.makeUsersRepository).singleton(),
    cardsRepository: asFunction(repositories.makeCardsRepository).singleton(),
    sessionsRepository: asFunction(
      repositories.makeSessionsRepository,
    ).singleton(),
  }
}
