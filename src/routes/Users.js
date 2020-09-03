const express = require('express')

const User = require('../models/User')

const router =new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
        console.log(user);
    try{
        await user.save();
        res.send(user);
    }catch (e) {
        res.status(404).send(e)
    }
})


router.get('/users', async (req, res) => {

    try{
        const users=await User.find({});
        res.send(users);
    }catch (e) {
        res.status(500).send(e)
    }


})


router.get('/users/:id', async (req, res) => {

    const _id=req.params.id;

    try{
        const user= await User.findById(_id);
        if(!user){
            res.status(404).send();
        }
        res.send(user);

    }catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/users/:id', async (req, res) => {

    const _id=req.params.id;

    try{
        const user= await User.findByIdAndDelete(_id);
        if(!user){
            res.status(404).send();
        }
        res.send(user);

    }catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/users/:id', async (req, res) => {

    const _id=req.params.id;
    const keys=Object.keys(req.body);
    const arr=['name','email','password','age'];

    const flag=keys.every((key)=>{
        return arr.includes((key));
    })

    if(!flag){
        return res.status(400).send({error:"Invalid Update!"})
    }

    try{
        const user= await User.findById(_id);
        keys.map((key)=>{
            user[key]=req.body[key];
        })

        await user.save();

        if(!user){
            res.status(404).send();
        }
        res.send(user);

    }catch (e) {
        res.status(500).send(e)
    }



})

module.exports=router