# Async Patterns

Depending on your Next.js version (and whether you’re on canary/experimental features), some request APIs may be asynchronous.

Examples that may become async in newer versions:
- `params`, `searchParams` passed to pages/layouts
- `cookies()`, `headers()` helpers

Guidance:
- Prefer writing Server Components as `async` and use `await` in a way that stays compatible if values become Promises.
- Do **not** blindly change types across a codebase. Check the installed Next.js version and follow the official migration notes/codemods.

## Async Params and SearchParams

If your version passes `params` / `searchParams` as Promises, you must await them.
If your version passes them synchronously, `await` still works at runtime, but TypeScript types differ.

To keep code forward-compatible, you can use a `MaybePromise<T>` helper type:

```tsx
type MaybePromise<T> = T | Promise<T>
```

### Pages and Layouts

```tsx
type MaybePromise<T> = T | Promise<T>
type Props = { params: MaybePromise<{ slug: string }> }

export default async function Page({ params }: Props) {
  const { slug } = await params
}
```

### Route Handlers

```tsx
export async function GET(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  const { id } = await params
}
```

### SearchParams

```tsx
type Props = {
  params: { slug: string } | Promise<{ slug: string }>
  searchParams: { query?: string } | Promise<{ query?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params
  const { query } = await searchParams
}
```

### Synchronous Components

Use `React.use()` for non-async components:

```tsx
import { use } from 'react'

type Props = { params: Promise<{ slug: string }> }

export default function Page({ params }: Props) {
  const { slug } = use(params)
}
```

### generateMetadata

```tsx
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: slug }
}
```

## Async Cookies and Headers

```tsx
import { cookies, headers } from 'next/headers'

export default async function Page() {
  // Some versions return values synchronously, some asynchronously.
  // Using await keeps the call sites compatible.
  const cookieStore = await cookies()
  const headersList = await headers()

  const theme = cookieStore.get('theme')
  const userAgent = headersList.get('user-agent')
}
```

## Migration Codemod

```bash
npx @next/codemod@latest next-async-request-api .
```
