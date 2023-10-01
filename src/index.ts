import { Elysia, mapResponse } from 'elysia'
import { gzipSync, deflateSync, type ZlibCompressionOptions } from 'bun'
// import { brotliCompressSync, BrotliOptions } from 'zlib'

export type CompressionOptions = {
  /**
   * @default `gzip`
   *
   * Algorithm to use for compression.
   */
  type: 'gzip' | 'deflate' // | 'brotli'
  /**
   * @param {Object}
   *
   * Options for the compression algorithm.
   */
  options?: ZlibCompressionOptions // | BrotliOptions
  /**
   * @default `utf-8`
   *
   * Encoding for the response body.
   */
  encoding?: BufferEncoding
}

const toBuffer = (data: unknown, encoding: BufferEncoding) =>
  Buffer.from(
    typeof data === 'object'
      ? JSON.stringify(data)
      : data?.toString() ?? new String(data),
    encoding,
  )

export const compression = (
  { type = 'gzip', options = {}, encoding = 'utf-8' }: CompressionOptions = {
    type: 'gzip',
    encoding: 'utf-8',
  },
) => {
  const app = new Elysia({
    name: 'elysia-compression',
  })

  switch (type) {
    case 'gzip':
      return app.onAfterHandle(ctx => {
        ctx.set.headers['Content-Encoding'] = 'gzip'

        const compressed = gzipSync(
          toBuffer(ctx.response, encoding),
          options as ZlibCompressionOptions,
        )

        const response = mapResponse(ctx.response, {
          status: 200,
          headers: {},
        })

        if (!response.headers.get('Content-Type'))
          ctx.set.headers['content-type'] = 'text/plain'

        ctx.response = response
      })

    case 'deflate':
      return app.onAfterHandle(ctx => {
        ctx.set.headers['Content-Encoding'] = 'deflate'

        const compressed = deflateSync(
          toBuffer(ctx.response, encoding),
          options as ZlibCompressionOptions,
        )

        const response = mapResponse(ctx.response, {
          status: 200,
          headers: {},
        })

        if (!response.headers.get('Content-Type'))
          ctx.set.headers['content-type'] = 'text/plain'

        ctx.response = response
      })

    // case 'brotli':
    //     return app.onAfterHandle((ctx) => {
    //     ctx.set.headers['Content-Encoding'] = 'br';
    //     const compressed = brotliCompressSync(toBuffer(ctx.response, encoding), options as BrotliOptions);
    //     ctx.response = new Response(compressed, ctx as any);
    //     })

    default:
      throw new Error('Invalid compression type.')
  }

  return app
}
