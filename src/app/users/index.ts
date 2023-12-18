import { Dependencies } from '@/infra/di'
import { makeCreateUserMutation } from './mutations/create/handler'

export function makeUsers(dependencies: Dependencies) {
  return {
    mutations: {
      create: makeCreateUserMutation({
        usersRepository: dependencies.usersRepository,
        cardsRepository: dependencies.cardsRepository,
      }),
    },
  }
}
