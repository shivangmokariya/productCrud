const mongoose=require("mongoose");
mongoose.set('strictQuery', false);
// console.log(process.env.MONGO_URI)
mongoose
.connect(process.env.MONGO_URI)
.then(()=>console.log("Database connection succesfull"))
.catch((e)=>console.log("no connection in Database"+e))