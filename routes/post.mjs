import express from 'express'

import { client } from './../mongodb.mjs'
let router = express.Router();
const database = client.db("allcrud")
const myCollection = database.collection("allposts")
// router.use(express.json());

router.post('/post', async(req,res)=>{
    try {
        const insertData = await myCollection.insertOne({
            PostTitle: req.body.PostTitle,
            PostText: req.body.PostText,
from: req.body.decoded.email
            
          });   
          res.send({
             message: "Data inserted successfully",
             data: insertData });
       } catch (e) {
           console.log(e);
           res.status(500).send("An error occurred while inserting data.");
       }

  

})
router.get('/posts', async (req,res)=>{
    const cursor = myCollection.find({})
    .sort({ _id: -1 })
    // .limit(100);

try {
    let results = await cursor.toArray()
    console.log("results: ", results);
    res.send(results);
}
  catch(e){
    console.log(e)
  }

})
export default router