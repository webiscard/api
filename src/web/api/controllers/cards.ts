import { Static, Type } from '@sinclair/typebox'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { Dependencies } from '@/web/crosscutting/container'

export function makeCardsController({ cards }: Dependencies) {
  return async function cardsController(
    fastify: FastifyInstance,
    _options: FastifyPluginOptions,
    done: (err?: Error | undefined) => void,
  ) {
    const updateCardBody = Type.Object({
      username: Type.Optional(Type.String()),
      avatarSize: Type.Optional(
        Type.Union([
          Type.Literal('sm'),
          Type.Literal('md'),
          Type.Literal('lg'),
        ]),
      ),
      avatarFilename: Type.Optional(Type.String()),
      name: Type.Optional(Type.String({ maxLength: 40 })),
      description: Type.Optional(Type.String({ maxLength: 110 })),
      socialNetworks: Type.Optional(
        Type.Array(
          Type.Object({
            id: Type.String(),
            type: Type.String(),
            value: Type.String(),
            enabled: Type.Boolean(),
          }),
        ),
      ),
      background: Type.Optional(Type.String()),
    })

    fastify.patch<{ Body: Static<typeof updateCardBody> }>(
      '/api/v1/card',
      { preHandler: fastify.verifySession, schema: { body: updateCardBody } },
      async (request, reply) => {
        const {
          username,
          avatarSize,
          avatarFilename,
          name,
          socialNetworks,
          description,
          background,
        } = request.body

        await cards.mutations.update({
          userId: request.user!.id,
          username,
          avatarSize,
          avatarFilename,
          name,
          socialNetworks,
          description,
          background,
        })

        return reply.send({ success: true })
      },
    )

    fastify.get(
      '/api/v1/card',
      { preHandler: fastify.verifySession },
      async (request, reply) => {
        const draftData = await cards.queries.get.draft({
          userId: request.user!.id,
        })

        return reply.send(draftData)
      },
    )

    fastify.get<{ Params: { username: string } }>(
      '/api/v1/card/:username',
      async (request, reply) => {
        const publicData = await cards.queries.get.public({
          username: request.params.username,
        })

        return reply.send(publicData)
      },
    )

    fastify.post(
      '/api/v1/publish-card',
      { preHandler: fastify.verifySession },
      async (request, reply) => {
        await cards.mutations.publish({ userId: request.user!.id })

        return reply.send({ success: true })
      },
    )

    done()
  }
}
