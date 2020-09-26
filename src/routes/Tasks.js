const express = require('express')
const router= new express.Router()
const Task = require('../models/Task')
const auth=require('../middlewares/auth')

router.post("/tasks",auth,async (req,res)=>{
    //const task = new Task(req.body)
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save();
        res.send(task);
    }catch (e) {
        res.status(404).send(e)
    }
})



router.get('/tasks',auth, async (req, res) => {
    const match={}
    const sort={}

    if(req.query.completed){
        match.completed=req.query.completed === "true"
    }

    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }

    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    }catch (e) {
        res.status(500).send(e)
    }
})


router.get('/tasks/:id', auth,async (req, res) => {

    const _id=req.params.id;

    try{
        const task= await Task.findOne({_id, owner: req.user._id});
        if(!task){
           return res.status(404).send();
        }
        res.send(task);

    }catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id',auth,async (req, res) => {

    const _id=req.params.id;

    try{
        const task= await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
        if(!task){
            res.status(404).send();
        }
        res.send(task);

    }catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id',auth, async (req, res) => {

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
        const task=await Task.findOne({_id,owner:req.user._id})
        if(!task){
            res.status(404).send();
        }
        keys.map((key)=>{
            task[key]=req.body[key];
        })
        await task.save();
        res.send(task);

    }catch (e) {
        res.status(500).send(e)
    }



})



module.exports=router