const express = require("express");

const app = express();

app.get("/server",(req,res)=>{
    res.send("helo from get  server devv")
}); 

app.post("/server",(req,res)=>{
    res.send("crete a instance in db ")
});

app.get("/param/:userId",(req,res)=>{
    console.log(req.params);
    res.send("testing multiple route")
})


app.listen(3000,()=>{
    console.log("server is runnnig on port 3000..");
});