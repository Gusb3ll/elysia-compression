import { Elysia } from 'elysia'
import { compression } from '../src/index'

const app = new Elysia()
    .use(compression())
    .post('/', ({ set }) => ({ value: 'Hello, World!' }))
    .listen(3000)

console.log(
    `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)

export type App = typeof app
