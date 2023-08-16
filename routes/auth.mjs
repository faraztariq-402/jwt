import express from 'express'
let router = express.Router();
import { client } from './../mongodb.mjs';
import { stringToHash,varifyHash} from "bcrypt-inzi"
import jwt from 'jsonwebtoken'
const usersCollection = client.db("allcrud").collection("users")


router.post('/login', async (req, res) => {
    if (!req.body?.email
        || !req.body?.password
    ) {
        res.status(403).send(`
    required parameters missing. Example request body:
    { 
        email faraz123@gmail.com,
  password: faraz123}`)
        return
    }  
    req.body.email = req.body.email.toLowerCase()
    try {
        const result = await usersCollection.findOne({email: req.body.email});   
        console.log("result:", result)  
        if(!result){
           res.send(`user not exists`) 
           return
          }
          
          else{
          const isMatch = await varifyHash(req.body.password, result.password)
            if(isMatch){
                const dateAfter24Hr = (new Date().getTime() + (24*60*60*1000))
                const token = jwt.sign({
                    firstName: result.firstName,
                    lastName: result.lastName,
                    isAdmin: false,
                    email: req.body.email,
}, process.env.SECRET, 
{expiresIn:'24h'})
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                })
                res.status(200).send({
                    message: "Login Successful"})
                    return
            }else{
                res.status(401).send({
                    message: "Email or Password Incorrect"
                })

            }
            return
          }
       
    } catch (e) {
        console.log(e);
        res.status(500).send("An error occurred while inserting user data.");
    }
})





router.post('/signup', async (req, res) => {
    if (!req.body?.firstName
        || !req.body?.lastName
        || !req.body?.email
        || !req.body?.password
    ) {
        res.status(403).send(`
    required parameters missing. Example request body:
    {firstName: firstName,
    lastName: lastName  
    email faraz123@gmail.com
  password: faraz123}`)
        return
    }
    req.body.email = req.body.email.toLowerCase()
    try {
        const result = await usersCollection.findOne({email: req.body.email});   
        console.log("result:", result) 
        let hashPassword =  await stringToHash(req.body.password) 
        if(!result){
            const insertData = await usersCollection.insertOne({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashPassword,
                createdOn: new Date()
            
    
                
              }); 
              res.send("Signup Successful")  
          }else{
            res.send(`user already exists`)
          }
       
    } catch (e) {
        console.log(e);
        res.status(500).send("An error occurred while inserting user data.");
    }
})
export default router