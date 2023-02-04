const express=require('express');
const User = require('../models/User');
const router =express.Router()

//valid emails or passwords only
const { body, validationResult } = require('express-validator');

//for hash 
const bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
const Jwt_secret='jwtstringsecret90';

const fetchuser = require('../middleware/fetchuser');

//ROUTE 1:
//creating a user using post "/api/auth/createuser" no login reqd
router.post('/createuser',[
    body('email','invalid email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('password','password must be atleast 5 char').isLength({ min: 5 })
],async(req,res)=>{
    let success=false;

    //if errors return bad and err
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,errors: errors.array() });
    }
    //email unique?
    try {
    let user=await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({success, error:'enter unique email'})
    }

    //hash
    const salt=await bcrypt.genSalt(10)
    const secpass=await bcrypt.hash(req.body.password,salt)

    user=await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secpass,
      })
      
    //   .then(user => res.json(user))
    //   .catch(err=>{console.log(err)
    // res.json({error:'please enter a unique email value',message:err.message})
    // })
    const data={
        user:{
            id:user.id
        }
    }
    const authtoken = jwt.sign(data, Jwt_secret)

    success=true;
    res.json({success, authtoken})
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('some error occured')
    }
})


//ROUTE 2:
//authenticate a user using post "/api/auth/login" no login reqd
//login endpoint
router.post('/login',[
    body('email','invalid email').isEmail(),
    body('password','Passowrd cannot be blank').exists()
],async(req,res)=>{
    let success=false

    //if errors return bad and err
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const{email,password}=req.body;
    try {
        //checking if user with that email exists
        let user=await User.findOne({email})
        if(!user){
            success=false;
            return res.status(400).json({ success,errors:'Please check your credentials' });
            
        }

        //checking password
        const passcompare=await bcrypt.compare(password,user.password)
        if(!passcompare){
            success=false;
            return res.status(400).json({ success,errors:'Please check your credentials' });
            
        }
        
        //sending user data if verified
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken = jwt.sign(data, Jwt_secret);
        success=true;
        res.json({success,authtoken})


    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send('internal server error occured')
    }

})

//ROUTE 3:
//get user details after login using post "/api/auth/getuser"  login reqd

router.post('/getuser',fetchuser,async(req,res)=>{
try {
    userid=req.user.id
    const user = await User.findById(userid).select("-password")
    res.send(user)
} 

catch (error) {
    console.log(error.message);
    res.status(500).send('internal server error occured')
}
})


module.exports=router