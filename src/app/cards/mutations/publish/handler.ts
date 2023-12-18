import { CardNotFound } from '@/app/common/exceptions'
import { Card } from '@/domain/entities/card'
import { Dependencies } from '@/infra/di'

type UpdateCardMutation = Pick<Card, 'userId'>

export function makePublishCardMutation({
  cardsRepository,
}: Pick<Dependencies, 'cardsRepository'>) {
  return async function publishCardMutation({ userId }: UpdateCardMutation) {
    const card = await cardsRepository.findByUserId({ userId })
    if (!card) throw CardNotFound()

    await cardsRepository.publish({ userId })
  }
}
