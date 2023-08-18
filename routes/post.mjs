import express from 'express'
import {nanoid}  from 'nanoid';
import { client } from './../mongodb.mjs'
let router = express.Router();
const database = client.db("allcrud")
const myCollection = database.collection("allposts")
// router.use(express.json());

router.post('/post', async(req,res)=>{
    try {
        const insertData = await myCollection.insertOne({
          id: nanoid(),
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


// router.put('/post/:postId', async (req, res, next) => {
//     const postId = req.params.postId;
//     const postTitle = req.body.PostTitle;
//     const postText = req.body.PostText;

//     const filter = { _id: ObjectId(postId) };
//     const update = {
//         $set: { PostTitle: postTitle, PostText: postText },
//         $currentDate: { lastModified: true }
//     };

//     try {
//         const updateResponse = await myCollection.updateOne(filter, update);

//         if (updateResponse.modifiedCount === 1) {
//             res.send('Post edited successfully');
//         } else {
//             res.status(404).send(`Error in editing Post with id ${postId}`);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send(`An error occurred while editing Post with id ${postId}`);
//     }
// });
router.put('/post/:postId', async (req, res, next) => {
  const id = req.params.postId;
  
    const filter = { id };
    const update = {};
  
    if (req.body.PostTitle) {
        update.PostTitle = req.body.PostTitle;
    }
    if (req.body.PostText) {
        update.PostText = req.body.PostText;
    }

    try {
        const updateResponse = await myCollection.updateOne(filter, { $set: update });
  
        if (updateResponse.modifiedCount === 1) {
            res.send('Post edited successfully');
        } else {
            res.status(404).send(`Error in editing Post with id ${_id}`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`An error occurred while editing Post with id ${_id}`);
    }
});

router.delete('/post/:postId', async (req, res, next) => {
    const id = req.params.postId;
    console.log('Received delete request for post ID:', id);
  
    const filter = { id };
  
    try {
      const deleteResponse = await myCollection.deleteOne(filter);
      if (deleteResponse.deletedCount === 1) {
        res.send('Post deleted successfully');
      } else {
        res.status(404).send(`Error in deleting Post with id ${id}`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`An error occurred while deleting Post with id ${postId}`);
    }
  });
export default router