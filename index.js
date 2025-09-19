const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch((err)=> console.error('MongoDB connection error'))

const taskSchema = new mongoose.Schema({
    taskId:{
        type: String,
        default: "Task-" + Date.now()
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    priority:{
        type: String,
        required: true
    },
    status:{
        type: String,
        default: "pending"
    },
    createdAt:{
        type: Date,
        default:  Date.now()
    },
})

const Task = mongoose.model('Task', taskSchema);

app.post('/api/tasks', (req, res)=>{

    const {title, description, priority, status, createdAt} = req.body;

    if (!title || ! priority){
        return res.status(400).json({error: "Title and priority are required"})
    }

    const task = new Task({title, description, priority, status, createdAt});
    task.save()
    .then((savedTask) => res.status(201).json(savedTask))
    .catch(()=> res.status(500).json({error: "Failed to add task"}));
});

app.get('/api/tasks', (req, res)=>{
    Task.find()
    .then((tasks)=> res.json(tasks))
    .catch(()=> res.status(500).json({error:"Failed to fetch tasks"}))
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))