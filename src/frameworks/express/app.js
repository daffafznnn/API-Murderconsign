import express from "express";
import helmet from "helmet";
import cors from "cors";
import UsersRoute from "./routes/UsersRoute.js";
// import { db } from "../../database/connectSql.js";


// (async()=>{
//     await db.sync();
// })()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// routes
app.use("/api/v1/users", UsersRoute);


export default app;
