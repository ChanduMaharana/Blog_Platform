import { NextResponse } from 'next/server'

export async function middleware(req) {
  const ua = req.headers.get('user-agent') || ''
  const isBot = /facebookexternalhit|twitterbot|linkedinbot|googlebot/i.test(ua)

  if (!isBot) return

  const url = new URL(req.url)
  if (!url.pathname.startsWith('/posts/')) return

  const id = url.pathname.split('/').pop()

  const postRes = await fetch(
    `https://blog-backend-biys.onrender.com/posts/${id}`
  )
  const post = await postRes.json()

  const image =
    post.coverImage ||
    'https://blog-backend-biys.onrender.com/uploads/default-og.jpg'

  return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
<title>${post.ogTitle || post.title}</title>
<meta name="description" content="${post.metaDescription || ''}">

<meta property="og:title" content="${post.ogTitle || post.title}">
<meta property="og:description" content="${post.metaDescription || ''}">
<meta property="og:image" content="${image}">
<meta property="og:image:secure_url" content="${image}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url.href}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${image}">
</head>
<body></body>
</html>
`)
}
