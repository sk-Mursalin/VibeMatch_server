const express = require("express");
const { databaseConnection } = require("./config/dataBase");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


databaseConnection().then(() => {
    console.log("database connection is establish");
    app.listen(3000, () => {
        console.log("server is runnnig on port 3000..");
    });
}).catch((err) => {
    console.log("a error occured to connect db");
})

