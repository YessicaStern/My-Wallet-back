import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const mongoClient= new MongoClient("mongodb://localhost:27017");

try{
    await mongoClient.connect();
    console.log("Mongo Conectado!!!");
}catch(err){
    console.log(err.message);
}
const db=mongoClient.db("mywallet");

export default db;