export type ProfilePictureSize = 'sm' | 'md' | 'lg'

export interface ProfilePicture {
  filename: string | null
  size: ProfilePictureSize
}

export interface SocialNetwork {
  id: string
  type: string
  value: string
  enabled: boolean
}

export type BackgroundType = 'CustomImage' | 'Gradient'

export interface Background {
  type: BackgroundType
  value: string
}

export interface CardData {
  profilePicture: ProfilePicture
  name: string
  description: string
  socialNetworks: SocialNetwork[]
  background: Background | null
}

export interface Card {
  id: string
  username: string
  publicData: CardData
  draftData: CardData
  updatedAt: Date
  publishedAt: Date | null
  isPublished: boolean
  userId: string
}
