import { createContainer } from 'awilix'
import {
  Dependencies as ApplicationDependencies,
  makeApplication,
} from '@/app/di'
import { makeInfrastructure } from '@/infra/di'

export type Dependencies = ApplicationDependencies

export function makeContainer() {
  const container = createContainer()

  container.register({
    ...makeInfrastructure(),
    ...makeApplication(),
  })

  return container.cradle as Dependencies
}
