import { CardNotFound, NotEmptyPayload } from '@/app/common/exceptions'
import { Card, CardData } from '@/domain/entities/card'
import { Dependencies } from '@/infra/di'

type UpdateCardMutation = Pick<Card, 'userId'> &
  Partial<Pick<Card, 'username'>> &
  Partial<{
    [Property in keyof CardData]: NonNullable<CardData[Property]>
  }>

export function makeUpdateCardMutation({
  cardsRepository,
}: Pick<Dependencies, 'cardsRepository'>) {
  return async function updateCardMutation({
    userId,
    username,
    ...draftData
  }: UpdateCardMutation) {
    const draftDataEmpty = Object.keys(draftData).reduce(
      (acc, key) =>
        acc ? draftData[key as keyof typeof draftData] === undefined : false,
      true,
    )

    if (draftDataEmpty && !username) throw NotEmptyPayload()

    const card = await cardsRepository.findByUserId({ userId })
    if (!card) throw CardNotFound()

    await cardsRepository.updateCard({
      userId,
      username,
      draftData,
    })
  }
}
