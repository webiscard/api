export type AvatarSize = 'sm' | 'md' | 'lg'

export interface SocialNetwork {
  id: string
  type: string
  value: string
  enabled: boolean
}

export interface CardData {
  avatarSize: AvatarSize
  avatarFilename: string | null
  name: string
  description: string
  socialNetworks: SocialNetwork[]
  background: string | null
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
