const express = require("express")
const { connection } = require("./config/db")
const { UserModel } = require("./Usermodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Todos } = require("./todos/Todo")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Home page")
})

app.post("/signup", async (req, res) => {
    const { email, password } = req.body
    const isUser = await UserModel.findOne({ email })
    if (isUser) {
        res.send({ "msg": "User already existists" })
    } else {
        bcrypt.hash(password, 4, async function (err, hash) {
            if (err) {
                res.send("Someting went wrong")
            }
            const new_user = new UserModel({
                email, password: hash
            })
            try {
                await new_user.save()
                res.send({ "msg": "Signup succesfull" })
            } catch (error) {
                res.send("Something wrong")
            }
        })
    }
})

app.post("/signin", async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    const hashed_password = user.password
    bcrypt.compare(password, hashed_password, function (err, result) {
        if (result) {
            const token = jwt.sign({ email: email }, "abc123")
            res.send({ "msg": "Login successfull", token: token })
        } else {
            res.send({ "msg": "Login failed" })
        }
    })
})

const authentication = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1]
    try {
        var decode = jwt.verify(token, "abc123")
        req.body.email = decode.email
        next()
    } catch (error) {
        res.send({ "msg": "Please login again" })
    }
}

const authorisation = (permitrole) => {
    return async (req, res, next) => {
        const email = req.body.email
        const user = await UserModel.findOne({ email: email })
        const role = user.role
        if (permitrole.includes(role)) { next() }
        else {
            res.send("Not authorized")
        }
    }
}

app.post("/todos/create", authentication, async (req, res) => {
    const { taskname, status, tags } = req.body
    const new_todos = new Todos({
        taskname: taskname,
        status: status,
        tags: tags
    })
    await new_todos.save()
    console.log(new_todos)
    res.send({ "msg": "Todo created" })
})

app.get("/todos", authentication, async (req, res) => {
    const todos = await Todos.find(req.query)
    console.log(req.query)
    res.json(todos)
})

app.put("/todos/:id", authentication, async (req, res) => {
    const { id } = req.params
    const { taskname, status, tags } = req.body
    const new_todo = await Todos.findByIdAndUpdate(id, taskname, status, tags)
})

app.delete("/todos/:id", authentication, async (req, res) => {
    const { id } = req.params
    const todo = await Todos.findById(id)
    await todo.remove()
    console.log(id)
    res.send({ msg: "Deleted successfully" })
})


app.listen(8956, async () => {
    try {
        await connection;
        console.log("Database connected");
    } catch (error) {
        console.log(error);
        console.log("Not connected");
    }
    console.log("Listning at PORT 8956");
})