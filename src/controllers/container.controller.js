const container = async (req,res)=>{
    const token=req.headers.authorization?.replace("Bearer ","");
    try{
        const session = await db.collection("session").findOne({token});
        const user= await db.collection("users").findOne({_id: session.userId});
        console.log(user)
        res.send(200);
    }catch(err){
        res.status(500).send(err.message);
    }
}
export {container};