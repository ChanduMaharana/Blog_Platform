import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Category from './category.model.js';

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

Post.belongsTo(Category, { foreignKey: "categoryId" });

sequelize.sync({ alter: true });

export default Post;
