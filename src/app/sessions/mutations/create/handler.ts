import bcrypt from 'bcryptjs'
import { UserNotFound, WrongPassword } from '@/app/common/exceptions'
import { UserDto } from '@/domain/dtos/user'
import { Dependencies } from '@/infra/di'

interface CreateSessionMutation {
  email: string
  password: string
  ip: string
  metaHeaders: {
    acceptLanguage?: string
    userAgent?: string
  }
}

export function makeCreateSessionMutation({
  usersRepository,
  sessionsRepository,
}: Pick<Dependencies, 'usersRepository' | 'sessionsRepository'>) {
  return async function createSessionMutation({
    email,
    password,
    ip,
    metaHeaders,
  }: CreateSessionMutation) {
    const lowerEmail = email.toLowerCase()
    const user = await usersRepository.findByEmail({ email: lowerEmail })
    if (!user) throw UserNotFound()

    const passwordEquals = await bcrypt.compare(password, user.password)
    if (!passwordEquals) throw WrongPassword()

    const activeSessions = await sessionsRepository.getManyByUserId({
      userId: user.id,
    })

    if (activeSessions.length > 5) {
      await sessionsRepository.deleteManyByUserId({ userId: user.id })
    }

    const fingerprint = bcrypt.hashSync(
      `${metaHeaders.acceptLanguage}.${metaHeaders.userAgent}`,
    )

    const session = await sessionsRepository.create({
      ip,
      fingerprint,
      userId: user.id,
      userAgent: metaHeaders.userAgent ? metaHeaders.userAgent : null,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    })

    return {
      sessionId: session.id,
      userDto: new UserDto(user),
    }
  }
}
