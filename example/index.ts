import { Elysia } from 'elysia'
import { compression } from '../src/index'

const app = new Elysia()
<<<<<<< HEAD
  .use(compression())
  .all('/', () => ({ value: 'Hello, World!' }))
  .all('/text', () => 'a')
  .listen(4000)

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
=======
    .use(compression())
    .post('/', ({ set }) => ({ value: 'Hello, World!' }))
    .listen(3000)

console.log(
    `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
>>>>>>> 8837f0df944a1b7a5f6a109d18b2b0f3884821d3
)

export type App = typeof app
