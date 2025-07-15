const express = require("express");
const {databaseConnection} = require("./config/dataBase");
const User = require("./model/user");

const app = express();
app.use(express.json());

app.post("/signup",async (req,res)=>{
    const user = new User(req.body);
    try{
       await  user.save()
       res.send("user successfully created")
    }
    catch(err){
        res.status(400).send("error occured")
    }
});

databaseConnection().then(() => {
    console.log("database connection is establish");
    app.listen(3000, () => {
        console.log("server is runnnig on port 3000..");
    });
}).catch((err) => {
    console.log("a error occured to connect db");
})

