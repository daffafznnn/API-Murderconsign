import express from "express";
import helmet from "helmet";
import cors from "cors";
// import { db } from "../../database/ConnectSql.js";


// (async()=>{
//     await db.sync();
// })()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());


export default app;
