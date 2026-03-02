# Error Handling

Handle errors gracefully in Next.js applications.

Reference: https://nextjs.org/docs/app/getting-started/error-handling

## Error Boundaries

### `error.tsx`

Catches errors in a route segment and its children:

```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

**Important:** `error.tsx` must be a Client Component.

### `global-error.tsx`

Catches errors in root layout:

```tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

**Important:** Must include `<html>` and `<body>` tags.

## Server Actions: Navigation API Gotcha

**Do NOT wrap navigation APIs in try-catch.** They throw special errors that Next.js handles internally.

Reference: https://nextjs.org/docs/app/api-reference/functions/redirect#behavior

```tsx
'use server'

import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

// Bad: try-catch catches the navigation "error"
async function createPost(formData: FormData) {
  try {
    const post = await db.post.create({ ... })
    redirect(`/posts/${post.id}`)  // This throws!
  } catch (error) {
    // redirect() throw is caught here - navigation fails!
    return { error: 'Failed to create post' }
  }
}

// Good: Call navigation APIs outside try-catch
async function createPost(formData: FormData) {
  let post
  try {
    post = await db.post.create({ ... })
  } catch (error) {
    return { error: 'Failed to create post' }
  }
  redirect(`/posts/${post.id}`)  // Outside try-catch
}

// Good: Re-throw navigation errors
async function createPost(formData: FormData) {
  try {
    const post = await db.post.create({ ... })
    redirect(`/posts/${post.id}`)
  } catch (error) {
    return { error: 'Failed to create post' }
  }
}
```

Same applies to:
- `redirect()` - 307 temporary redirect
- `permanentRedirect()` - 308 permanent redirect
- `notFound()` - 404 not found

If you must catch broadly (e.g. a shared helper), prefer structuring code so navigation calls happen **outside** the try-catch.

Some Next.js versions also expose helpers to rethrow internal navigation errors (often marked `unstable_*`).
If your installed Next.js version provides such a helper, you may use it — otherwise keep navigation outside try-catch.

## Redirects

```tsx
import { redirect, permanentRedirect } from 'next/navigation'

// 307 Temporary - use for most cases
redirect('/new-path')

// 308 Permanent - use for URL migrations (cached by browsers)
permanentRedirect('/new-url')
```

## Auth Errors

Auth/authorization UX is usually implemented via:
- Middleware redirects/rewrites (e.g. redirect unauthenticated users to `/login`)
- Segment-level `error.tsx` / `not-found.tsx` patterns
- App-specific “access denied” pages

Because auth primitives vary by Next.js version and by auth library, follow your project’s established pattern.

## Not Found

### `not-found.tsx`

Custom 404 page for a route segment:

```tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find the requested resource</p>
    </div>
  )
}
```

### Triggering Not Found

```tsx
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()  // Renders closest not-found.tsx
  }

  return <div>{post.title}</div>
}
```

## Error Hierarchy

Errors bubble up to the nearest error boundary:

```
app/
├── error.tsx           # Catches errors from all children
├── blog/
│   ├── error.tsx       # Catches errors in /blog/*
│   └── [slug]/
│       ├── error.tsx   # Catches errors in /blog/[slug]
│       └── page.tsx
└── layout.tsx          # Errors here go to global-error.tsx
```
