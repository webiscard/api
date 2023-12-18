import { makeGetSessionQuery } from '@/app/sessions/query/get'
import { Dependencies } from '@/infra/di'
import { makeCreateSessionMutation } from './mutations/create'

export function makeSessions(dependencies: Dependencies) {
  return {
    mutations: {
      create: makeCreateSessionMutation({
        usersRepository: dependencies.usersRepository,
        sessionsRepository: dependencies.sessionsRepository,
      }),
    },
    queries: {
      get: makeGetSessionQuery({
        sessionsRepository: dependencies.sessionsRepository,
      }),
    },
  }
}
