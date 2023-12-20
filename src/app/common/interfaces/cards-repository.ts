import { Card, CardData } from '@/domain/entities/card'

type UpdateCardParams = Pick<Card, 'userId'> &
  Partial<Pick<Card, 'username'>> & {
    draftData: Partial<{
      [Property in keyof CardData]: NonNullable<CardData[Property]>
    }>
  }

export interface CardsRepository {
  create(params: Pick<Card, 'userId' | 'username'>): Promise<Card>

  findByUsername(params: Pick<Card, 'username'>): Promise<Card | null>

  findByUserId(params: Pick<Card, 'userId'>): Promise<Card | null>

  updateCard(params: UpdateCardParams): Promise<void>

  publish(params: Pick<Card, 'userId'>): Promise<void>
}
