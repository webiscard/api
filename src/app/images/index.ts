import { makeCreateImageMutation } from '@/app/images/mutations/create/handler'
import { makeGetImageQuery } from '@/app/images/query/get'
import { Dependencies } from '@/infra/di'

export function makeImages(dependencies: Dependencies) {
  return {
    queries: {
      get: makeGetImageQuery({
        imagesRepository: dependencies.imagesRepository,
        imageFileSystem: dependencies.imageFileSystem,
      }),
    },
    mutations: {
      create: makeCreateImageMutation({
        imagesRepository: dependencies.imagesRepository,
        imageFileSystem: dependencies.imageFileSystem,
      }),
    },
  }
}
