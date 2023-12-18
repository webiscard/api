import { User } from '@/domain/entities/user'

export class UserDto {
  readonly email: string

  constructor(user: User) {
    this.email = user.email
  }
}
