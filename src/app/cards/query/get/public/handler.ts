import { CardNotFound } from '@/app/common/exceptions'
import { Card } from '@/domain/entities/card'
import { Dependencies } from '@/infra/di'

type GetPublicCardQuery = Pick<Card, 'username'>

export function makeGetPublicCardQuery({
  cardsRepository,
}: Pick<Dependencies, 'cardsRepository'>) {
  return async function getPublicCardQuery({ username }: GetPublicCardQuery) {
    const card = await cardsRepository.findByUsername({ username })
    if ((card && !card.isPublished) || !card) throw CardNotFound()

    const publicData = card.publicData

    return {
      ...publicData,
      socialNetworks: publicData.socialNetworks.filter((item) => item.enabled),
    }
  }
}
