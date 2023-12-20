import { Dependencies } from '@/infra/di'
import { ImageNotFound } from '@/app/common/exceptions'

interface GetImageQuery {
  filename: string
}

export function makeGetImageQuery({
  imageFileSystem,
  imagesRepository,
}: Pick<Dependencies, 'imageFileSystem' | 'imagesRepository'>) {
  return async function getImageQuery({ filename }: GetImageQuery) {
    const image = await imagesRepository.getByFilename({ filename })
    if (!image) {
      throw ImageNotFound()
    }

    const buffer = await imageFileSystem.read(filename)

    return { mimetype: image.mimetype, buffer }
  }
}
