import { MultipartFile, MultipartValue } from '@fastify/multipart'
import { Static, TSchema, Type } from '@sinclair/typebox'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ImageKind } from '@/domain/entities/image'
import { Dependencies } from '@/web/crosscutting/container'

interface TCustom<T> extends TSchema {
  static: T
}

const TMultipartField = <T extends TSchema>(schema: T) => {
  return Type.Object({
    value: schema,
  }) as unknown as TCustom<MultipartValue<T['static']>>
}

const TMultipartFile = (schema: { $ref: `#${string}` }) => {
  return schema as unknown as TCustom<MultipartFile>
}

export function makeImagesController({ images }: Dependencies) {
  return async function imagesController(
    fastify: FastifyInstance,
    _options: FastifyPluginOptions,
    done: (err?: Error | undefined) => void,
  ) {
    fastify.get<{ Params: { filename: string } }>(
      '/api/v1/image/:filename',
      async (request, reply) => {
        const image = await images.queries.get({
          filename: request.params.filename,
        })

        return reply.type(image.mimetype).send(image.buffer)
      },
    )

    const postImageBody = Type.Object({
      file: TMultipartFile({ $ref: '#multipartSharedSchema' }),
      kind: TMultipartField(
        Type.Union([
          Type.Literal<ImageKind>('Background'),
          Type.Literal<ImageKind>('ProfilePicture'),
        ]),
      ),
    })

    fastify.post<{ Body: Static<typeof postImageBody> }>(
      '/api/v1/image',
      {
        schema: { body: postImageBody },
        preHandler: fastify.verifySession,
      },
      async (request, reply) => {
        const { file, kind } = request.body

        const createdImage = await images.mutations.create({
          mimetype: file.mimetype,
          buffer: await file.toBuffer(),
          kind: kind.value,
          userId: request.user!.id,
          originalFilename: file.filename,
        })

        return reply.send({ filename: createdImage.filename })
      },
    )

    done()
  }
}
