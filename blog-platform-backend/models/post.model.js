import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Post = sequelize.define('Post', {
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
  coverImage: { type: DataTypes.STRING, allowNull: true },

  popular: { type: DataTypes.BOOLEAN, defaultValue: false },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  trending: { type: DataTypes.BOOLEAN, defaultValue: false },
  published: { type: DataTypes.BOOLEAN, defaultValue: false },

  views: { type: DataTypes.INTEGER, defaultValue: 0 },

  excerpt: { type: DataTypes.TEXT, allowNull: true },
  metaDescription: { type: DataTypes.TEXT, allowNull: true },
  metaKeywords: { type: DataTypes.STRING, allowNull: true },
  ogTitle: { type: DataTypes.STRING, allowNull: true },
  ogDescription: { type: DataTypes.TEXT, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true }

  
});
sequelize.sync({ alter: true });


export default Post;
