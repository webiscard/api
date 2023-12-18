import bcrypt from 'bcryptjs'
import { Unauthorized } from '@/app/common/exceptions'
import { Dependencies } from '@/infra/di'

interface GetSessionQuery {
  sessionId: string | null
  metaHeaders: {
    acceptLanguage?: string
    userAgent?: string
  }
}

export function makeGetSessionQuery({
  sessionsRepository,
}: Pick<Dependencies, 'sessionsRepository'>) {
  return async function getSessionQuery({
    sessionId,
    metaHeaders,
  }: GetSessionQuery) {
    if (!sessionId) throw Unauthorized()

    const session = await sessionsRepository.getWithUserById({ id: sessionId })
    if (!session) throw Unauthorized()

    if (session.expiresAt.getTime() < Date.now()) throw Unauthorized()

    const fingerprintMatches = await bcrypt.compare(
      `${metaHeaders.acceptLanguage}.${metaHeaders.userAgent}`,
      session.fingerprint,
    )
    if (!fingerprintMatches) throw Unauthorized()

    return {
      user: session.user,
    }
  }
}
