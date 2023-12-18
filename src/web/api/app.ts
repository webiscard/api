import { fastifyCookie } from '@fastify/cookie'
import { fastifyCors } from '@fastify/cors'
import { createError } from '@fastify/error'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import Fastify from 'fastify'
import { Dependencies } from '@/web/crosscutting/container'
import * as controllers from './controllers'
import * as plugins from './plugins'

export function makeApp(dependencies: Dependencies) {
  const fastify = Fastify({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>()

  const ServerError = createError(
    'FST_INTERNAL_SERVER_ERROR',
    'Unknown error occurred',
    500,
  )

  fastify.setErrorHandler((error, request, reply) => {
    if (!error.statusCode || (error.statusCode && error.statusCode >= 500)) {
      fastify.log.error(error)

      reply.send(ServerError())
    } else {
      reply.send(error)
    }
  })

  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'onRequest',
    parseOptions: {},
  })

  fastify.register(fastifyCors, {
    origin: true, // TODO: ОБЯЗАТЕЛЬНО ПОМЕНЯТЬ!!!
    credentials: true,
  })

  fastify.register(plugins.makeSessionPlugin(dependencies))

  fastify.register(controllers.makeAuthController(dependencies))
  fastify.register(controllers.makeCardsController(dependencies))

  return fastify
}
