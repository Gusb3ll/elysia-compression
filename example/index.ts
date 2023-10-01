import { Elysia } from 'elysia'
import { compression } from '../src/index'

const app = new Elysia()
  .use(compression({ type: 'deflate' }))
  .get('/', () => 'Hello, world!')
  .get('/json', () => ({ hello: 'world' }))
  .get('/pic', () => Bun.file('./tests/mei.jpg'))
  .listen(4000)

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
)

export type App = typeof app
