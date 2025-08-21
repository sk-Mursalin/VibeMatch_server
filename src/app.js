const express = require("express");
const { databaseConnection } = require("./config/dataBase");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
const http = require("http");
const initialSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
const postRouter = require("./routes/post");
require('dotenv').config()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/", postRouter)


const server = http.createServer(app);
initialSocket(server);


databaseConnection().then(() => {
    console.log("database connection is establish");
    server.listen(process.env.PORT, () => {
        console.log(`server is runnnig on port ${process.env.PORT}..`);
    });
}).catch((err) => {
    console.log("a error occured to connect db");
})

