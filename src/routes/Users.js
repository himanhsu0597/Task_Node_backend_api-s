const express = require('express')
const jwt=require("jsonwebtoken")
const User = require('../models/User')
const auth=require("../middlewares/auth")
const router =new express.Router()


router.post('/users', async (req, res) => {
    const user = new User(req.body)
       // console.log(user);
    try{
        await user.save();
        const token=await user.generateAuthToken();
        res.status(201).send({user,token});
    }catch (e) {
        res.status(404).send(e)
    }
})


router.post('/users/logout', auth , async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token;
        })
        console.log(1);
        await req.user.save();
        //console.log(1)
        res.send()

    }catch(e)
    {
        res.status(500).send(e);
    }
})


router.post('/users/logoutAll', auth , async (req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()

    }catch(e)
    {
        res.status(500).send(e);
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token= await user.generateAuthToken();

        res.send({user,token})
    } catch (e) {
        res.status(400).send()
    }
})


router.get('/users/me',auth ,async (req, res) => {
        res.send(req.user);
})


// router.get('/users/:id', async (req, res) => {
//
//     const _id=req.params.id;
//
//     try{
//         const user= await User.findById(_id);
//         if(!user){
//             res.status(404).send();
//         }
//         res.send(user);
//
//     }catch (e) {
//         res.status(500).send(e)
//     }
// })



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