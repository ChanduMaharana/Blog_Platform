export function seoHTML(post) {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${post.ogTitle || post.title || ""}</title>

  <meta name="description" content="${post.metaDescription || ""}" />
  <meta name="keywords" content="${post.metaKeywords || ""}" />

  <meta property="og:type" content="article" />
  <meta property="og:title" content="${post.ogTitle || post.title || ""}" />
  <meta property="og:description" content="${post.ogDescription || post.metaDescription || ""}" />
  <meta property="og:image" content="${post.coverImage || ""}" />
  <meta property="og:url" content="https://your-frontend.vercel.app/post/${post.id}" />

  <link rel="canonical" href="https://blog-backend-biys.onrender.com/api/posts/${post.id}" />

  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: post.coverImage,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author || "Unknown" }
  })}
  </script>
</head>
<body>
  <h1>${post.title || ""}</h1>
</body>
</html>`;
}
