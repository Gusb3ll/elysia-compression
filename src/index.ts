import type { Elysia } from 'elysia'
import { deflateSync, gzipSync, type ZlibCompressionOptions } from 'bun'

interface CompressionOptions {
    /**
     * @default `gzip`
     *
     * Algorithm to use for compression.
     */
    type: 'gzip' | 'deflate'
    options?: ZlibCompressionOptions
}

const toBuffer = (res: unknown) =>
    Buffer.from(
        typeof res === 'object'
            ? JSON.stringify(res)
            : res?.toString() ?? new String(res)
    )

export const compression =
    ({ type = 'gzip', options }: CompressionOptions = { type: 'gzip' }) =>
    (app: Elysia) => {
        if (type === 'gzip') {
            return app.onAfterHandle(({ set }, res) => {
                set.headers['Content-Encoding'] = 'gzip'

                return new Response(gzipSync(toBuffer(res), options), set)
            })
        } else if (type === 'deflate') {
            return app.onAfterHandle(({ set }, res) => {
                set.headers['Content-Encoding'] = 'deflate'

                return new Response(deflateSync(toBuffer(res)), set)
            })
        } else {
            throw new Error('Invalid compression type.')
        }
    }
