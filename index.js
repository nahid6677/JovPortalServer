const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xch7i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting  in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("JobPortal");
    const jobs = database.collection("Jobs");
    const jobApplicationCollection = database.collection("job_application");

    // Auth related api
    

    app.get("/jobs", async (req, res) => {
      const emails = req.query.email;
      // console.log(emails, "email")
      let querys = {};
      if (emails) {
        querys = { hr_email: emails };
      }
      const allJobs = jobs.find(querys);
      const result = await allJobs.toArray();
      res.send(result);
    });

    app.post("/jobs", async (req, res) => {
      const newJob = req.body;
      const result = await jobs.insertOne(newJob);
      res.send(result);
    });

    app.get(`/jobs/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobs.findOne(query);
      res.send(result);
    });
    // Job application api

    app.post("/job-application", async (req, res) => {
      const application = req.body;
      const result = await jobApplicationCollection.insertOne(application);

      const id = application.job_id;
      const query = { _id: new ObjectId(id) };
      const job = await jobs.findOne(query);
      let newCount = 0;
      if (job.applicationCount) {
        newCount = job.applicationCount + 1;
      } else {
        newCount = 1;
      }

      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          applicationCount: newCount,
        },
      };
      const updateResults = await jobs.updateOne(filter, updatedDoc);

      res.send(result);
    });

    app.get("/job-application/jobs/:job_id", async (req, res) => {
      const jobId = req.params.job_id;
      console.log(jobId, "connnnnn");

      const query = { job_id: jobId };
      const result = await jobApplicationCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/job-application/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobApplicationCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/job-application", async (req, res) => {
      const queryEmail = req.query.email;
      // console.log(queryEmail, "emeil");
      let query = {};
      if (queryEmail) {
        query = { applicant_email: queryEmail };
      }
      const result = await jobApplicationCollection.find(query).toArray();
      for (const apps of result) {
        const query1 = { _id: new ObjectId(apps.job_id) };
        const result1 = await jobs.findOne(query1);
        if (result1) {
          apps.title = result1.title;
          apps.company = result1.company;
          apps.company_logo = result1.company_logo;
          apps.location = result1.location;
        }
      }
      res.send(result);
    });
    app.get("/job-application", async (req, res) => {
      const applications = jobApplicationCollection.find();
      const result = await applications.toArray();
      res.send(result);
    });
    app.put("/job-application/:id", async (req, res) => {
      const job_id = req.params.id;
      const { status, id } = req.body;
      // console.log(job_id, status)
      const filter = { _id: new ObjectId(job_id) };
      const filters = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          status: status,
        },
      };
      // const result = await jobs.updateOne(
      //   filter,
      //   updatedDoc,
      //   options
      // );
      const result = await jobApplicationCollection.updateOne(filters,
        updatedDoc,
        options)
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("JobPortalServer is Running........");
});
app.listen(port, () => {
  console.log(`JobPortalServer is Running on port: ${port}`);
});
