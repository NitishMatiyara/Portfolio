const express = require('express');
const path = require('path');
const app = express();
const bodyparser = require("body-parser")
const mongoose = require('mongoose');
const port = process.env.PORT || 8001;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost/contactMe',{useNewUrlParser: true,
  useUnifiedTopology: true,});
}

// Define Mongoose Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    desc: String
  });

const Contact = mongoose.model('Contact', contactSchema);


// Express stuff
app.use(express.static(path.join(__dirname, "static")))

app.use(express.urlencoded())
app.engine('html', require('ejs').renderFile)

app.get('/', (req, res) => {
  res.status(200).render("index.html")
})

app.get('/index.html', (req, res) => {
  res.status(200).render("index.html")
})

app.post('/index.html', (req, res) => {
    var myData = new Contact(req.body)
    myData.save().then(()=>{
        res.send("Contact saved to the database")
            // res.status(400).send("Contact not saved to the database")
        })
    });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


