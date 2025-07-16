const express = require("express");
const bcrypt = require("bcrypt")
const { databaseConnection } = require("./config/dataBase");
const User = require("./model/user");
const { signupValidation } = require("./utils/validation");
const validator = require("validator");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
        signupValidation(req)
        const { email, password, lastName, firstName } = req.body
        const encryptedPass = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            email,
            password: encryptedPass
        });
        await user.save()
        res.send("user successfully created")
    }
    catch (err) {
        res.status(400).send(err.message)
    }
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        if (!validator.isEmail(email)) {
            throw new Error("please enter a valid email")
        }
        const user = await User.findOne({ email: email })
        if (!user) {
            res.send("please sign up")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.send("invalid credential")
        } else {
            res.send("welcome in devtinder")
        }
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})
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

