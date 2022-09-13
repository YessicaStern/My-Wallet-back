function Test(req,res,next){
    const token=req.headers.authorization?.replace("Bearer ","");
    console.log("Middleware",token);
    next();
}
export {Test}