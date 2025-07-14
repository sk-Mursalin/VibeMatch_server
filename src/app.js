const express = require("express");

const app = express();

app.use("/admin", (req, res,next) => {
    console.log("auth checking");
    let token = "xyz";
    let isAdmin = token === "xyz"
    if (!isAdmin) {
        res.status(401).send("admin is not authorised")
    } else {
        next()
    }
});

app.get("/admin/getAllData", (req, res) => {
    res.send("send all data to admin")
});

app.get("/admin/deleteAllData", (req, res) => {
    res.send("delete all data of admin")
});

app.listen(3000, () => {
    console.log("server is runnnig on port 3000..");
});