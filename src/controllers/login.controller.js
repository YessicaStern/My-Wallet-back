import joi from "joi";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import db from "../database/db.js";

const userSchema= joi.object({
    email: joi.string().required(),
    password: joi.required(),
});
const login = async (req,res)=>{
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
                message: "Usuário não Autorizado"
            })
        };
        const isValid= bcrypt.compareSync(password, user.password);
        if(!isValid){
            return res.status(401).send({
                message: "Usuário não Autorizado"
            })
        };
        const token=uuidv4();
        // console.log(user._id);
        db.collection("session").insertOne({token, userId: user._id});  
    res.send({token:token,user:user.name});
    }catch(err){
        res.send(err.message);
    }
}
export {login};