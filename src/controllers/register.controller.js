import joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
import db from "../database/db.js"
import bcrypt from "bcrypt";

const joiPassword = joi.extend(joiPasswordExtendCore);

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
});


const register = async (req,res)=>{
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
}
export {register};