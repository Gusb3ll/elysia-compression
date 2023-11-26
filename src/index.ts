import compressible from 'compressible'
import { Elysia, mapResponse } from 'elysia'
import { gzipSync, deflateSync, type ZlibCompressionOptions } from 'bun'
import { CompressionStream } from './stream'
import { isReadableStream } from './utils'
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

const shouldCompress = (res: any) => {
  const type = res.headers.get('Content-Type')
  if (!type) {
    return false
  }
  return compressible(type) ?? false
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

  if (!['gzip', 'deflate'].includes(type)) {
    throw new Error('Invalid compression type. Use gzip or deflate.')
  }

  return app.onAfterHandle(ctx => {
    ctx.set.headers['Content-Encoding'] = type

    const res = mapResponse(ctx.response, {
      status: 200,
      headers: {},
    })

    if (!res.headers.get('Content-Type')) {
      res.headers.set('Content-Type', 'text/plain')
    }

    if (!shouldCompress(res)) {
      delete ctx.set.headers['Content-Encoding']
      return ctx.response
    }

    const stream = (ctx as any).response?.stream
    const compressedBody = isReadableStream(stream)
      ? stream.pipeThrough(new CompressionStream(type))
      : type === 'gzip'
        ? gzipSync(
          toBuffer(ctx.response, encoding),
          options as ZlibCompressionOptions,
        )
        : deflateSync(
          toBuffer(ctx.response, encoding),
          options as ZlibCompressionOptions,
        )
    ctx.response = new Response(compressedBody, {
      headers: res.headers,
    })
  })
}
