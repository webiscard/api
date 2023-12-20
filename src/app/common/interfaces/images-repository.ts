import { Image } from '@/domain/entities/image'

export interface ImagesRepository {
  create(params: Omit<Image, 'id'>): Promise<Image>

  getByFilename(params: Pick<Image, 'filename'>): Promise<Image | null>
}
