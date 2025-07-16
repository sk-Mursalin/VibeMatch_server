const mongoose = require("mongoose");


const databaseConnection  = async()=>{
    await mongoose.connect("mongodb+srv://skmursalin02:9378496506@learnmongo.lhejvp7.mongodb.net/devTinder");
}

module.exports = {databaseConnection};