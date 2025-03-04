const router = require("express").Router();
const User= require("../models/user");
const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken");
const {authenticateToken} =require("./userAuth");


//sign up
router.post("/sign-up",async( req , res)=>{
    try{
        const { username , email  , password, address }= req.body;
        //check username length is more than 3
        if(username.length < 4){
            return res
            .status(400)
            .json({message:"Username length should be greater than 3"});
        }

        //check the username already exist or not?
        const existingUsername =await User.findOne({username:username});
        if(existingUsername){
            return res.status(400).json({message: "Username already exists"});
        }
        //check the email already exist or not?
        const existingEmail =await User.findOne({email: email});
        if(existingEmail){
            return res.status(400).json({message: "Email already exists"});
        }
        //check password length
        if(password.length <= 6){
            return res
            .status(400)
            .json({message:"Password  length should be greater than 6"});
        }
        const hashPass= await  bcrypt.hash(password,10);
        
        const newUser= new User({
            username:username,
            email:email,
            password:hashPass,
            address:address,
        });
        await newUser.save();
        return res.status(200).json({ message:"SignUp Successfully "});
        
    } catch(error){
        console.error("error is",error);
        res.status(500).json({message:"Internal server error"});
}
});
//sign in
router.post("/sign-in",async(req, res)=>{
    console.log("Request Body:", req.body); 
    try{
        const {username , password} =req.body;

        const existingUser= await User.findOne({username});
        if(!existingUser){
            res.status(400).json({message:"Invalid Credentials"});
        } 

        const isMatch = await bcrypt.compare(password, existingUser.password);
            if (isMatch){
                     const authClaims =[
                    {name:existingUser.username},
                   { role:existingUser.role},
                ];
                const token =jwt.sign({authClaims}, "bookstore123",{
                expiresIn: "30d"
            });
                return res.status(200).json({
                    id: existingUser._id ,
                     role: existingUser.role ,
                     token: token,
                    });
            } else{
               return  res.status(400).json({message:"Invalid Credentials"});
            }
          }
     catch(error){
        console.error("error is",error);
       return res.status(500).json({message:"Internal server error"});
}
});
//get-user-information
router.get("/get-user-information", authenticateToken, async(req,res)=>{
    console.log("Headers:", req.headers);
    try{
        const{ id }= req.headers;
        const data =await User.findById(id).select("-password");
    return res.status(200).json(data);
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
});


//update address
router.put("/update-address",authenticateToken,async(req,res)=>{
    try{
        const {id} =req.headers;
        const{address} =req.body;
        await User.findByIdAndUpdate(id,{address: address});
        return res.status(200).json({message:"Address updates successfully"});
    }catch(error){
        res.status(500).json({message:"Internal server error"})
    }
    });
    module.exports = router;

