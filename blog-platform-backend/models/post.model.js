import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Post = sequelize.define('Post', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  content: DataTypes.TEXT,
  author: DataTypes.STRING,
  date: DataTypes.STRING,

  image: DataTypes.STRING,      
 coverImage: DataTypes.STRING,
  popular: DataTypes.BOOLEAN,
  featured: DataTypes.BOOLEAN,
  trending: DataTypes.BOOLEAN,
  published: DataTypes.BOOLEAN,

  views: DataTypes.BIGINT,
  slug: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true
},

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

export default Post;
