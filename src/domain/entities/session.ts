export interface Session {
  id: string
  userId: string
  fingerprint: string
  userAgent: string | null
  ip: string
  expiresAt: Date
  createdAt: Date
}
