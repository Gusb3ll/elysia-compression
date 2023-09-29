# elysia-compression

Compression plugin for [elysia](https://github.com/elysiajs/elysia)

## Installation

```bash
bun add elysia-compression
```

## Example

```typescript
import { Elysia } from 'elysia'
import { compression } from 'elysia-compression'

const app = new Elysia().use(compression()).listen(8080)
```

## Config

### type

@default `gzip`

The type of compression to use. Can be one of the following:

- `gzip`
- `deflate`

### options

@default `{}`

Options passed to the compression library.

Refer to the bun zlib options [documentation](https://bun.sh/docs/api/utils#bun-gzipsync) for more details.

### encoding

@default `utf-8`

The encoding of the response body that is being compressed.
