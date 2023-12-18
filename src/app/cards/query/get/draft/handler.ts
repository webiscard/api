import { CardNotFound } from '@/app/common/exceptions'
import { Card } from '@/domain/entities/card'
import { Dependencies } from '@/infra/di'

type GetDraftCardQuery = Pick<Card, 'userId'>

export function makeGetDraftCardQuery({
  cardsRepository,
}: Pick<Dependencies, 'cardsRepository'>) {
  return async function getDraftCardQuery({ userId }: GetDraftCardQuery) {
    const card = await cardsRepository.findByUserId({ userId })
    if (!card) throw CardNotFound()

    const { username, draftData, isPublished } = card

    return { username, isPublished, ...draftData }
  }
}
