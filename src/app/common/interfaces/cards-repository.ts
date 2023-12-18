import {
  Background,
  Card,
  ProfilePictureSize,
  SocialNetwork,
} from '@/domain/entities/card'

export interface CardsRepository {
  create(params: Pick<Card, 'userId' | 'username'>): Promise<Card>

  findByUsername(params: Pick<Card, 'username'>): Promise<Card | null>

  findByUserId(params: Pick<Card, 'userId'>): Promise<Card | null>

  updateCard(
    params: Pick<Card, 'userId'> &
      Partial<{
        username: string
        draftData: Partial<{
          profilePicture: Partial<{
            filename: string
            size: ProfilePictureSize
          }>
          name: string
          description: string
          socialNetworks: SocialNetwork[]
          background: Background
        }>
      }>,
  ): Promise<void>

  publish(params: Pick<Card, 'userId'>): Promise<void>
}
