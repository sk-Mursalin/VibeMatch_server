const express = require("express");

const app = express();

app.use("/server",(req,res)=>{
    res.send("helo from server devv")
});
app.listen(3000,()=>{
    console.log("server is runnnig on port 3000..");
});