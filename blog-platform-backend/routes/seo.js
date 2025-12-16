router.get('/seo/posts/:id', async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).send('Not found');

  const image = post.coverImage?.startsWith('http')
    ? post.coverImage
    : 'https://blog-backend-biys.onrender.com/uploads/default-og.jpg';

  res.send(`
<!DOCTYPE html>
<html>
<head>
<title>${post.title}</title>
<meta property="og:title" content="${post.title}">
<meta property="og:description" content="${post.metaDescription || ''}">
<meta property="og:image" content="${image}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://yourdomain.com/posts/${post.id}">
</head>
<body></body>
</html>
`);
});
