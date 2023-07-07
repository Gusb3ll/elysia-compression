import type { Elysia } from 'elysia'
import type { ZlibCompressionOptions } from 'bun'

interface CompressionOptions {
      /**
     * @default `gzip`
     *
     * Algorithm to use for compression.
     */
  type: 'gzip' | 'deflate'
  options?: ZlibCompressionOptions
}

export const compression = ({ type = 'gzip', options }: CompressionOptions = { type: 'gzip' }) => (app: Elysia) => {
  if (type === 'gzip') {
    return app.onAfterHandle((_, res) => {
      const buf = Buffer.from(JSON.stringify(res),)
      const compressed = Bun.gzipSync(buf, options)  

      return new Response(compressed, {
        headers: {
          'Content-Encoding': 'gzip',
        }
      })
    })
  } else if (type === 'deflate') {
        return app.onAfterHandle((_, res) => {
      const buf = Buffer.from(JSON.stringify(res),)
      const compressed = Bun.deflateSync(buf, options)  

      return new Response(compressed, {
        headers: {
          'Content-Encoding': 'deflate',
        }
      })
    })
  } else {
    throw new Error('Invalid compression type.')
  }
}