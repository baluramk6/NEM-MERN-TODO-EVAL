const mongoose = require("mongoose")

const todoSchema = mongoose.Schema({
    taskname: String,
    status: String,
    tags: String
})


const Todos = mongoose.model("Todos", todoSchema)

module.exports = { Todos }