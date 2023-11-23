export const isReadableStream = (value: unknown): value is ReadableStream =>
  value instanceof ReadableStream
