import { Static, Type } from '@sinclair/typebox'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { UserDto } from '@/domain/dtos/user'
import { Dependencies } from '@/web/crosscutting/container'

export function makeAuthController({ users, sessions }: Dependencies) {
  return async function authController(
    fastify: FastifyInstance,
    _options: FastifyPluginOptions,
    done: (err?: Error | undefined) => void,
  ) {
    const signupBody = Type.Object({
      email: Type.String({ format: 'email' }),
      password: Type.String({ minLength: 8, maxLength: 32 }),
      username: Type.String({ minLength: 4, maxLength: 18 }),
    })

    fastify.post<{ Body: Static<typeof signupBody> }>(
      '/api/v1/signup',
      { schema: { body: signupBody } },
      async (request, reply) => {
        const { email, password, username } = request.body

        await users.mutations.create({ email, password, username })

        return reply.status(201).send({ success: true })
      },
    )

    const loginBody = Type.Object({
      email: Type.String({ format: 'email' }),
      password: Type.String({ minLength: 8, maxLength: 32 }),
    })

    fastify.post<{ Body: Static<typeof loginBody> }>(
      '/api/v1/login',
      {
        schema: { body: loginBody },
      },
      async (request, reply) => {
        const { email, password } = request.body
        const ip = request.ip
        const metaHeaders = {
          acceptLanguage: request.headers['accept-language'],
          userAgent: request.headers['user-agent'],
        }

        const { sessionId, userDto } = await sessions.mutations.create({
          email,
          password,
          ip,
          metaHeaders,
        })

        return reply
          .setCookie('sessionId', sessionId, {
            httpOnly: true,
            secure: 'auto',
            path: '/',
            sameSite: true,
            maxAge: 60 * 60 * 24 * 30,
            signed: true,
          })
          .send(userDto)
      },
    )

    fastify.get(
      '/api/v1/session',
      { preHandler: fastify.verifySession },
      async (request, reply) => {
        return reply.send(new UserDto(request.user!))
      },
    )

    done()
  }
}
