import type { Elysia } from 'elysia'
import { gzipSync, deflateSync ,type ZlibCompressionOptions } from 'bun'

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
            return app.onAfterHandle((context) => {
                context.set.headers['Content-Encoding'] = 'gzip';
                const compressed = gzipSync(toBuffer(context.response), options);
                context.response = new Response(compressed, context as any);
            })
        } else if (type === 'deflate') {
            return app.onAfterHandle((context) => {
                context.set.headers['Content-Encoding'] = 'deflate';
                const compressed = deflateSync(toBuffer(context.response), options);
                context.response = new Response(compressed, context as any);

            })
        } else {
            throw new Error('Invalid compression type.')
        }
    }
