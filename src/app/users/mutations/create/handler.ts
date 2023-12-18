import bcrypt from 'bcryptjs'
import { EmailExist, UsernameExist } from '@/app/common/exceptions'
import { Dependencies } from '@/infra/di'

interface CreateUserMutation {
  email: string
  password: string
  username: string
}

export function makeCreateUserMutation({
  usersRepository,
  cardsRepository,
}: Pick<Dependencies, 'usersRepository' | 'cardsRepository'>) {
  return async function createUserMutation({
    email,
    password,
    username,
  }: CreateUserMutation) {
    const lowerEmail = email.toLowerCase()
    const lowerUsername = username.toLowerCase()

    const userCandidate = await usersRepository.findByEmail({
      email: lowerEmail,
    })
    if (userCandidate) throw EmailExist()

    const cardCandidate = await cardsRepository.findByUsername({
      username: lowerUsername,
    })
    if (cardCandidate) throw UsernameExist()

    const hashPassword = bcrypt.hashSync(password, 7)

    const user = await usersRepository.create({
      email: lowerEmail,
      password: hashPassword,
    })
    const card = await cardsRepository.create({
      username: lowerUsername,
      userId: user.id,
    })

    return { user, card }
  }
}
