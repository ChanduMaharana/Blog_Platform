import { DataTypes } from "sequelize";
import sequelize from '../config/db.js';

const Banner = sequelize.define("Banner", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  image: {
    type: DataTypes.STRING, // store filename only
    allowNull: false,
  },

  redirectUrl: {
    type: DataTypes.STRING,
    allowNull: true,
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

export default Banner;
