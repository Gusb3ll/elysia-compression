import { Elysia } from 'elysia'
import { compression } from '../src/index'

const app = new Elysia()
    .use(compression())
    .post('/', () => ({ value: 'Hello, World!' }))
    .listen(3000)

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
console.log('Server is running on port 3000.')