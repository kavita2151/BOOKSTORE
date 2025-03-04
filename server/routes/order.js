const router = require("express").Router();
const Book= require("../models/book");
const Order= require("../models/order");
const User= require("../models/user");
const {authenticateToken} =require("./userAuth");

//place order
router.post("/place-order", authenticateToken, async (req,res)=>
{
    try{
        const { id } =req.headers;
        const { order } =req.body;
        for(const orderData of order){

            const neworder = new Order({ user:id, book: orderData._id });
            const orderDataFromDb =await neworder.save();

            //saving order in user model
            await User.findByIdAndUpdate(id, {
                $push:{ orders:orderDataFromDb._id},
            });

            //clearing cart
            await User.findByIdAndUpdate(id, {
                $pull:{cart:orderData._id},
            });
        }
        return res.json({
            status:"Success",
            message:"order placed successfully",

        });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message:"An error occurred"});
    }
});
//get order history of patrticular user
router.get("get-order-history", authenticateToken, async (req,res)=>{
    try{
        const { id } =req.headers;
        const userData = await User.findById(id).populate({
            path:"orders",
            populate: {path: "book"},       
     });
     const orderData =userData.orders.reverse();
     return res.json({
        status:"Success",
        data: orderData,
    });
} catch (error){
    console.log(error);
    return res.status(500).json({message: "An error Occurred"});
}
});

router.put("/update-status/:id",authenticateToken, async (req,res)=>{
   try{
    const { id } =req.params;
    await Order.findByIdAndUpdate(id, { status:req.body.status });

    return res.json({
        status:"Success",
        message:"Status updated successfully",
    });
} catch (error){
    console.log(error);
    return res.status(500).json({message: "An error Occurred"});
}
   });
module.exports=router;