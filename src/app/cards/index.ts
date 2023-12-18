import { makePublishCardMutation } from '@/app/cards/mutations/publish'
import { makeUpdateCardMutation } from '@/app/cards/mutations/update/handler'
import { makeGetDraftCardQuery } from '@/app/cards/query/get/draft'
import { makeGetPublicCardQuery } from '@/app/cards/query/get/public'
import { Dependencies } from '@/infra/di'

export function makeCards(dependencies: Dependencies) {
  return {
    mutations: {
      update: makeUpdateCardMutation({
        cardsRepository: dependencies.cardsRepository,
      }),
      publish: makePublishCardMutation({
        cardsRepository: dependencies.cardsRepository,
      }),
    },
    queries: {
      get: {
        public: makeGetPublicCardQuery({
          cardsRepository: dependencies.cardsRepository,
        }),
        draft: makeGetDraftCardQuery({
          cardsRepository: dependencies.cardsRepository,
        }),
      },
    },
  }
}
