const express = require("express");

const app = express();

app.get("/route", (req, res) => {
    throw new Error("sjfnw");
});

app.use("/", (err, req, res) => {
    if (err) {
        res.status(500).send("error is occured")
    }
});

app.listen(3000, () => {
    console.log("server is runnnig on port 3000..");
});