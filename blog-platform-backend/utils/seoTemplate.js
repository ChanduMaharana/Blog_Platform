export function seoHTML(post) {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${post.ogTitle || post.title}</title>

  <meta name="description" content="${post.metaDescription || post.description}">
  <meta name="keywords" content="${post.metaKeywords || ''}">

  <!-- OpenGraph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${post.ogTitle || post.title}">
  <meta property="og:description" content="${post.ogDescription || post.description}">
  <meta property="og:image" content="${post.coverImage}">
  <meta property="og:url" content="https://your-frontend.vercel.app/post/${post.id}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${post.title}">
  <meta name="twitter:description" content="${post.description}">
  <meta name="twitter:image" content="${post.coverImage}">

  <!-- Canonical -->
  <link rel="canonical" href="https://your-frontend.vercel.app/post/${post.id}"/>

  <!-- Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${post.title}",
    "description": "${post.description}",
    "image": "${post.coverImage}",
    "author": {
      "@type": "Person",
      "name": "${post.author || 'Unknown'}"
    },
    "datePublished": "${post.date}"
  }
  </script>
</head>

<body>
  <h1>${post.title}</h1>
  <p>${post.description}</p>
</body>
</html>
`;
}
