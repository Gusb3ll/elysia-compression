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
        const app = new Elysia().use(compression({ 'type': 'deflate' })).get('/', () => response)
        const res = await app.handle(req())

        expect(res.headers.get('Content-Encoding')).toBe('deflate')
    })

    it('accept additional headers', async () => {
        const app = new Elysia().use(compression({ 'type': 'deflate' })).get('/', ({ set }) => {
            set.headers['x-powered-by'] = 'Elysia'

            return response
        })
        const res = await app.handle(req())

        expect(res.headers.get('Content-Encoding')).toBe('deflate')
        expect(res.headers.get('x-powered-by')).toBe('Elysia')
    })
})
