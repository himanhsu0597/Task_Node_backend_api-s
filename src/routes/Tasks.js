const express = require('express')
const router= new express.Router()
const Task = require('../models/Task')


router.get('/tasks', async (req, res) => {


    try{
        const tasks=await Task.find({});
        res.send(tasks);
    }catch (e) {
        res.status(500).send(e)
    }
})


router.get('/tasks/:id', async (req, res) => {

    const _id=req.params.id;

    try{
        const task= await Task.findById(_id);
        if(!task){
            res.status(404).send();
        }
        res.send(task);

    }catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {

    const _id=req.params.id;

    try{
        const task= await Task.findByIdAndDelete(_id);
        if(!task){
            res.status(404).send();
        }
        res.send(task);

    }catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', async (req, res) => {

    const _id=req.params.id;
    const keys=Object.keys(req.body);
    const arr=['description','complete'];

    const flag=keys.every((key)=>{
        return arr.includes((key));
    })

    if(!flag){
        return res.status(400).send({error:"Invalid Update!"})
    }

    try{
        const task= await Task.findById(_id);
        keys.map((key)=>{
            task[key]=req.body[key];
        })
        await task.save();
        if(!task){
            res.status(404).send();
        }
        res.send(task);

    }catch (e) {
        res.status(500).send(e)
    }



})


router.post("/tasks",async (req,res)=>{
    const task = new Task(req.body)

    try{
        await task.save();
        res.send(task);
    }catch (e) {
        res.status(404).send(e)
    }
})


module.exports=router