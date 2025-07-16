const express = require("express");
const { databaseConnection } = require("./config/dataBase");
const User = require("./model/user");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        res.send("user successfully created")
    }
    catch (err) {
        res.status(400).send(err.message)
    }
});

app.get("/user", async (req, res) => {
    const userEmailId = req.body.email;
    const user = await User.findOne({ email: userEmailId })
    try {
        if (!user) {
            res.status(404).send(user)
        }
        else {
            res.send(user)
        }
    } catch (err) {
        res.send("something went wrong")
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users)
    } catch (err) {
        res.status(500).send("data base error")
    }
});
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    console.log(userId);
    try {
        await User.findByIdAndDelete({ _id: userId });
        res.send("user is deleted successfully")
    } catch (err) {
        res.status(500).send("internal server error")
    }
});

app.patch("/user", async (req, res) => {
    const userId = req.body.userId
    const data = req.body;
    const allowedFilled = ["age", "skill", "password", "userId"]
    const isAllowed = Object.keys(req.body).every((el) => allowedFilled.includes(el));
    try {
        if (!isAllowed) {
            throw new Error("update not allwed")
        }
        if (data?.skill && data?.skill.length > 5) {
            throw new Error("skill not allowed more than 5");
        }
        const dataBefore = await User.findByIdAndUpdate(userId, data, { returnDocument: 'before', runValidators: true });
        res.send("updated successfully")
    } catch (err) {
        res.status(500).send(err.message)
    }
})
databaseConnection().then(() => {
    console.log("database connection is establish");
    app.listen(3000, () => {
        console.log("server is runnnig on port 3000..");
    });
}).catch((err) => {
    console.log("a error occured to connect db");
})

