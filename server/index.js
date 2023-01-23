const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/userRoute")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/postRoute")

dotenv.config();

async function connectDB (){
    const URL = process.env.MONGO_URL
    mongoose.set('strictQuery', true);
    await mongoose.connect(URL,()=>{
        console.log("Database connected");
        // return ture
    })
}
connectDB()
// let status = await connectDB();


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use("/api/users",userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts",postRoute);
app.listen(8000,()=>{
    console.log("server running!");
})