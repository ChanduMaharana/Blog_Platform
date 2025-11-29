import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Post from "./post.model.js";

const Comment = sequelize.define("Comment", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: false },
}, {
  timestamps: true
});

Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId" });

export default Comment;
