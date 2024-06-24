import { Sequelize } from "sequelize";
import { db } from "../database/connectSql.js";
import User from "./UsersModel.js";

const { DataTypes } = Sequelize;

const RefreshToken = db.define(
  "refresh_tokens",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "refresh_tokens",
  }
);

User.hasMany(RefreshToken);
RefreshToken.belongsTo(User, { foreignKey: "user_id" });

export default RefreshToken;