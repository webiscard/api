export type ImageKind = 'ProfilePicture' | 'Background'

export interface Image {
  id: string
  kind: ImageKind
  mimetype: string
  filename: string
  userId: string
}
