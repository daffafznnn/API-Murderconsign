import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const connectSQL = async () => {
  try {
    await db.authenticate();
    console.log(
      "Connection to SQL database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the SQL database:", error);
  }
};

export { db, connectSQL };