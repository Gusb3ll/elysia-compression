import { describe, it, expect } from 'bun:test'

import { Elysia } from 'elysia'
import { compression } from '../src'

const req = () => new Request('http://localhost/')

const response = `
もしも願いが一つ叶うなら
世界でたった一人だけの友達を
生きることは素晴らしいこと
そんなふうに私も思ってみたい`

describe('Compression', () => {
  it('handle gzip compression', async () => {
    const app = new Elysia().use(compression()).get('/', () => response)
    const res = await app.handle(req())

    expect(res.headers.get('Content-Encoding')).toBe('gzip')
  })

  it('handle deflate compression', async () => {
    const app = new Elysia()
      .use(compression({ type: 'deflate' }))
      .get('/', () => response)
    const res = await app.handle(req())

    expect(res.headers.get('Content-Encoding')).toBe('deflate')
  })

  it('accept additional headers', async () => {
    const app = new Elysia()
      .use(compression({ type: 'deflate' }))
      .get('/', ({ set }) => {
        set.headers['x-powered-by'] = 'Elysia'

        return response
      })
    const res = await app.handle(req())

    expect(res.headers.get('Content-Encoding')).toBe('deflate')
    expect(res.headers.get('x-powered-by')).toBe('Elysia')
  })

  it('return correct plain/text', async () => {
    const app = new Elysia()
      .use(compression({ type: 'deflate' }))
      .get('/', () => response)

    const res = await app.handle(req())

    expect(res.headers.get('Content-Type')).toBe('text/plain')
  })

  it('return correct application/json', async () => {
    const app = new Elysia()
      .use(compression({ type: 'deflate' }))
      .get('/', () => ({ hello: 'world' }))

    const res = await app.handle(req())

    expect(res.headers.get('Content-Type')).toBe('application/json')
  })

  it('return correct application/json', async () => {
    const app = new Elysia()
      .use(compression({ type: 'deflate' }))
      .get('/', () => ({ hello: 'world' }))

    const res = await app.handle(req())

    expect(res.headers.get('Content-Type')).toBe('application/json')
  })

  it('return correct image type', async () => {
    const app = new Elysia()
      .use(compression({ type: 'deflate' }))
      .get('/', () => Bun.file('tests/mei.jpg'))

    const res = await app.handle(req())

    expect(res.headers.get('Content-Type')).toBe('image/jpeg')
  })
})
