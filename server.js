const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const meetingRoutes = require("./Routes/MeetingRoutes");
dotenv.config();
require("./db");
const app = express();




app.use(cors());
app.use(express.json());
app.use(meetingRoutes);
// app.use(profileRoutes);
// app.use(postRoutes);


if(process.env.NODE_ENV ==='production'){
    console.log("hello");
    app.use(express.static('client/build'));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })
}

app.use((error,req,res,next)=>{
    return res.status(error.statusCode || 500).send({
        errors:error
    })
});


const PORT = process.env.PORT||1234



app.listen(PORT,()=>{
    // console.log(path.resolve(__dirname,"F.E","build","index.html"));

    console.log("Server is running at port " + PORT);
});
