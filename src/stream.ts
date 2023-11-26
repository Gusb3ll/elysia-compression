import zlib from 'node:zlib'

/** NOTE: can be removed once Bun has implemented this class
 *
 * https://github.com/oven-sh/bun/issues/1723
 * https://github.com/oven-sh/bun/issues/1723#issuecomment-1774174194
 * */
export class CompressionStream {
  readable: ReadableStream
  writable: WritableStream

  constructor(format: 'gzip' | 'deflate') {
    const handle =
      format === 'deflate'
        ? zlib.createDeflate()
        : format === 'gzip'
          ? zlib.createGzip()
          : zlib.createDeflateRaw()

    this.readable = new ReadableStream({
      start(controller) {
        handle.on('data', (chunk: Uint8Array) => controller.enqueue(chunk))
        handle.once('end', () => controller.close())
      },
    })

    this.writable = new WritableStream({
      write: (chunk: Uint8Array) => handle.write(chunk) as any,
      close: () => handle.end() as any,
    })
  }
}
