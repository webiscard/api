import { asFunction, Resolver } from 'awilix'
import { makeCards } from './cards'
import { makeImages } from './images'
import { makeSessions } from './sessions'
import { makeUsers } from './users'

export interface Dependencies {
  users: ReturnType<typeof makeUsers>
  cards: ReturnType<typeof makeCards>
  sessions: ReturnType<typeof makeSessions>
  images: ReturnType<typeof makeImages>
}

export function makeApplication(): {
  [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]>
} {
  return {
    users: asFunction(makeUsers).singleton(),
    cards: asFunction(makeCards).singleton(),
    sessions: asFunction(makeSessions).singleton(),
    images: asFunction(makeImages).singleton(),
  }
}
