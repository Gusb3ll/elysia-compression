import { Elysia } from 'elysia'
import { compression } from '../src/index'

const app = new Elysia()
  .use(compression())
  .all('/', () => ({ value: 'Hello, World!' }))
  .listen(4000)

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
)

export type App = typeof app
