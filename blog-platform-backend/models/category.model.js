import { DataTypes } from "sequelize";
import sequelize from '../config/db.js';

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
     unique: true,
  },

  orderNo: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },

  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default Category;
