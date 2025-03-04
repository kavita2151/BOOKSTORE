const mongoose =require("mongoose");
require("dotenv").config();
const conn = async()=>{
    try{
       // console.log("MongoDB URI:", process.env.URI);
        await mongoose.connect(process.env.URI);
        console.log("connected to Database");
    }catch(error){
        console.log(error);
    }
};
conn();
