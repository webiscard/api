import { createError } from '@fastify/error'
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'
import { Unauthorized } from '@/app/common/exceptions'
import { User } from '@/domain/entities/user'
import { Dependencies } from '@/web/crosscutting/container'

declare module 'fastify' {
  interface FastifyRequest {
    user: User | null
  }

  interface FastifyInstance {
    verifySession: (
      request: FastifyRequest,
      reply: FastifyReply,
      done: (err?: Error | undefined) => void,
    ) => void
  }
}

export function makeSessionPlugin({ sessions }: Dependencies) {
  return fastifyPlugin(
    (
      fastify: FastifyInstance,
      _options: FastifyPluginOptions,
      done: (err?: Error | undefined) => void,
    ) => {
      const InvalidCookies = createError(
        'FST_INVALID_COOKIES',
        'Cookies are invalid',
        403,
      )

      fastify.decorateRequest('user', null)

      fastify.decorate('verifySession', async (request: FastifyRequest) => {
        if (!request.cookies.sessionId) throw Unauthorized()

        const unsignResult = fastify.unsignCookie(request.cookies.sessionId)

        if (!unsignResult.valid) throw InvalidCookies()

        const sessionId = unsignResult.value
        const metaHeaders = {
          acceptLanguage: request.headers['accept-language'],
          userAgent: request.headers['user-agent'],
        }

        const { user } = await sessions.queries.get({
          sessionId,
          metaHeaders,
        })

        // eslint-disable-next-line require-atomic-updates
        request.user = user
      })

      done()
    },
  )
}
