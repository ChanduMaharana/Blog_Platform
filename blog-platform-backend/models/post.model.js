const Post = sequelize.define('Post', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  content: DataTypes.TEXT,
  author: DataTypes.STRING,
  date: DataTypes.STRING,

  image: DataTypes.STRING,      // ONE SINGLE COLUMN

  popular: DataTypes.BOOLEAN,
  featured: DataTypes.BOOLEAN,
  trending: DataTypes.BOOLEAN,
  published: DataTypes.BOOLEAN,

  views: DataTypes.INTEGER,

  excerpt: DataTypes.TEXT,
  metaDescription: DataTypes.TEXT,
  metaKeywords: DataTypes.STRING,
  ogTitle: DataTypes.STRING,
  ogDescription: DataTypes.TEXT,

  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
