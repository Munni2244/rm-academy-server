const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT ||5000;
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${ process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crn6x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();

    const database = client.db("RM-Academy");
    const studentsCollection = database.collection("Students");

    ///get all student
    app.get('/students', async(req, res)=>{
        const cursor = await studentsCollection.find({}).toArray();
        // console.log(cursor);
        res.send(cursor)

    })

    //get single students
    app.get('/students/:id', async(req, res)=>{
        const studentId= req.params.id;
        const query= {_id: ObjectId(studentId)};
        const result = await studentsCollection.findOne(query);
        // console.log(result);
        res.send(result)

    })

    //add student List
    app.post('/student', async(req,res)=>{
      const doc=req.body;
      const result= await studentsCollection.insertOne(doc);
      console.log(result);
      res.send(result)
    })

    // update  student information
    app.put('/student/:id', async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: updateData
      };
      const result = await studentsCollection.updateOne(filter, updateDoc, options);

      console.log(result);
      // console.log(req.body);
      res.json(result);
  })

  //remove student
  app.delete("/student/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await studentsCollection.deleteOne({
        _id: ObjectId(req.params.id),
    });
    res.send(result);
});

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("Welcome To RM Academy !")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})