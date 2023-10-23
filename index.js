const express = require("express");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const port = process.env.PORT || 8001;

require("dotenv").config();
connectDB();

// Define Mongoose Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  description: String,
});

const contact = mongoose.model("contact", contactSchema);

// Express stuff
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded());

app.set("views", path.join(__dirname, "views"));

app.engine("html", require("ejs").renderFile);

app.get("/", (req, res) => {
  res.status(200).render("index.html");
});

app.get("/index.html", (req, res) => {
  res.status(200).render("index.html");
});

app.post("/index.html", async (req, res) => {
  const myData = new contact(req.body);
  const { name, email, subject, description } = myData;
  const isUser = await contact.findOne({ name, email, subject, description });
  if (isUser) {
    res.send("User info already exist");
  } else {
    myData
      .save()
      .then(() => {
        res.send("Message sent successfully");
      })
      .catch(() => {
        res.send("Failed sending message.");
      });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
