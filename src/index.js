import express from "express";
import cors from "cors";
import router  from "./routers/routers.router.js";

console.log(router);

const app=express();
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(4000,()=>{console.log("Listening to port 4000")});



