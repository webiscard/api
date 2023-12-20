import { createError } from '@fastify/error'

export const EmailExist = createError(
  'FST_EMAIL_EXIST',
  'User with given email already exist',
  409,
)

export const UsernameExist = createError(
  'FST_USERNAME_EXIST',
  'User with given username already exist',
  409,
)

export const UserNotFound = createError(
  'FST_USER_NOT_FOUND',
  'User with given credentials not found',
  404,
)

export const WrongPassword = createError(
  'FST_WRONG_PASSWORD',
  'Given incorrect password',
  403,
)

export const CardNotFound = createError(
  'FST_CARD_NOT_FOUND',
  'Card not found',
  404,
)

export const Unauthorized = createError('FST_UNAUTHORIZED', 'Unauthorized', 401)

export const NotEmptyPayload = createError(
  'FST_NOT_EMPTY_PAYLOAD',
  "Payload shouldn't be empty",
  400,
)

export const ForbiddenMimetype = createError(
  'FST_FORBIDDEN_MIMETYPE',
  'This type of file is not allowed',
  403,
)

export const ImageNotFound = createError(
  'FST_IMAGE_NOT_FOUND',
  'Image with given filename not found',
  404,
)
