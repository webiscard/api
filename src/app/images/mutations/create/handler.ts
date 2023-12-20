import * as uuid from 'uuid'
import { ForbiddenMimetype } from '@/app/common/exceptions'
import { Dependencies } from '@/infra/di'

interface CreateImageMutation {
  mimetype: string
  buffer: Buffer
  userId: string
  originalFilename: string
  kind: 'Background' | 'ProfilePicture'
}

export function makeCreateImageMutation({
  imageFileSystem,
  imagesRepository,
}: Pick<Dependencies, 'imageFileSystem' | 'imagesRepository'>) {
  return async function createImageMutation({
    mimetype,
    buffer,
    kind,
    userId,
    originalFilename,
  }: CreateImageMutation) {
    if (!['image/jpeg', 'image/png'].includes(mimetype)) {
      throw ForbiddenMimetype()
    }

    const filename = uuid.v4() + '.' + originalFilename.split('.').at(-1)

    await imageFileSystem.write(filename, buffer)
    return imagesRepository.create({ userId, filename, kind, mimetype })
  }
}
