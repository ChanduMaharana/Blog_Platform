export function seoHTML(post = {}) {
  return `<!doctype html>
<html>
<head>
  <title>${post.ogTitle || post.title || ""}</title>
  <meta name="description" content="${post.metaDescription || ""}">
  <meta property="og:image" content="${post.coverImage || ""}">
</head>
<body>
  <h1>${post.title || ""}</h1>
</body>
</html>`;
}
