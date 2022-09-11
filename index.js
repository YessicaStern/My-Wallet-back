import express from "express";
import joi from "joi";
import dotenv from "dotenv";
import {MongoClient, ObjectId} from "mongodb"
import cors from "cors";
import bcrypt from "bcrypt";
import { joiPasswordExtendCore } from "joi-password";
import {v4 as uuidv4} from "uuid"

const joiPassword = joi.extend(joiPasswordExtendCore);

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());

const mongoClient= new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(()=>{db=mongoClient.db("mywallet")});





const userSchema= joi.object({
    email: joi.string().required(),
    password: joi.required(),
});

app.post("/", async (req,res)=>{
    const user=req.body;
    const {email, password}= user;

    const validation=userSchema.validate(user);
    if(validation.error){
        return res.send(422);
    }
    try{
        const user = await db.collection("users").findOne({email});
        if(!user){
            return res.status(401).send({
                mesage: "email ou senha icorreto"
            })
        };
        const isValid= bcrypt.compareSync(password, user.password);
        if(!isValid){
            return res.status(401).send({
                mesage: "email ou senha icorreto"
            })
        };
        const token=uuidv4();
        // console.log(user._id);
        db.collection("session").insertOne({token, userId: user._id});
        res.send(token);
    }catch(err){
        res.send(err.message);
    }
});













const newUserSchema= joi.object({

    name: joi.string().required(),

    email: joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),

    password: joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
    passwordConfirm:joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
})

app.post("/cadastro" ,async (req,res)=>{
    const newUser=req.body;
    const {name, email, password, passwordConfirm}= newUser;
    const validation=newUserSchema.validate(newUser);
    if(validation.error){
        return res.status(422).send({
            message: "É necessário ter no mínimo um caractere especial,letra maiúscula,minúscula e um número"
        });
    }
    if(password!==passwordConfirm){
        return res.status(422).send({message: "senha incompatível"});
    }
    try{
        const emailUser = await db.collection("users").findOne({email});
        if(emailUser){
            return res.status(409).send({message: "Este email já esta sendo utilizado"});
        };
        const hashPassword = bcrypt.hashSync(password,12);
        await db.collection("users").insertOne({name,email,password:hashPassword});

        res.send(201);
    }catch(err){
        res.status(500).send(err.message);
    }
})









app.get("/conteudo", async (req,res)=>{
    const token=req.headers.authorization?.replace("Bearer ","");
    try{
        const session = await db.collection("session").findOne({token});
        console.log(session);
        res.send(200);
    }catch(err){
        res.status(500).send(err.message);
    }
})




app.listen(4000,()=>{console.log("Listening to port 4000")});



