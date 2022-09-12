import db from "../database/db.js";
import joi from "joi";

const entrySchema= joi.object({
        value: joi.number().required(),
        description: joi.string().required()
})

const container = async (req,res)=>{
    const token=req.headers.authorization?.replace("Bearer ","");
    try{
        const session = await db.collection("session").findOne({token});
        const transitions= await db.collection("movements").find({userId: session.userId}).toArray();
        res.status(200).send(transitions);
    }catch(err){
        res.status(500).send(err.message);
    }
}

const newEntry = async (req,res)=>{
    const token=req.headers.authorization?.replace("Bearer ","");
    const entry=req.body;
    const {value, description}=entry;
    const validation=entrySchema.validate(entry);

    let day = `${new Date().getDate()}/${(new Date().getMonth() + 1)}`

    if(validation.error){
        return res.status(422).send({
            message: "Preencha os campos corretamente"
        });
    }
    try{
        const session = await db.collection("session").findOne({token});
        const user= await db.collection("users").findOne({_id: session.userId});
        db.collection("movements").insertOne({value,description,day,type:"entry", userId: user._id});
        res.send(201);
    }catch(err){
        res.send(err.message);
    }
}

const newExit = async (req,res)=>{
    const token=req.headers.authorization?.replace("Bearer ","");
    const entry=req.body;
    const {value, description}=entry;
    const validation=entrySchema.validate(entry);

    let today = `${new Date().getDate()}/${(new Date().getMonth() + 1)}`

    if(validation.error){
        return res.status(422).send({
            message: "Preencha os campos corretamente"
        });
    }
    try{
        const session = await db.collection("session").findOne({token});
        const user= await db.collection("users").findOne({_id: session.userId});
        db.collection("movements").insertOne({value,description,today,type:"exit", userId: user._id});
        res.send(201);
    }catch(err){
        res.send(err.message);
    }
}


export {container,newEntry,newExit};