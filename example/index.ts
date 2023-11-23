import { Elysia } from 'elysia'
import { compression } from '../src/index'
import Stream from '@elysiajs/stream'

const app = new Elysia()
  .use(compression({ type: 'gzip' }))
  .get('/', () => 'Hello, world!')
  .get('/json', () => ({ hello: 'world' }))
  .get('/pic', () => Bun.file('./tests/mei.jpg'))
  .get(
    '/sse',
    () =>
      new Stream(stream => {
        let count = 0
        const interval = setInterval(() => {
          count++
          stream.event = 'news'
          stream.send(`event #${count}`)
        }, 200)

        setTimeout(() => {
          clearInterval(interval)
          stream.close()
        }, 3000)
      }),
  )
  .listen(4000)

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
)

export type App = typeof app
