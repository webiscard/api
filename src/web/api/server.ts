import { makeContainer } from '@/web/crosscutting/container'
import { makeApp } from './app'

const dependencies = makeContainer()
const PORT = Number(process.env.PORT) || 3000

const server = makeApp(dependencies)

server.listen({ port: PORT }, (error) => {
  if (error) {
    server.log.error(error)
    process.exit(1)
  }
})
