const express = require("express");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const port = process.env.PORT || 8001;
const axios = require("axios");

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
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));

app.engine("html", require("ejs").renderFile);

app.get("/", (req, res) => {
  res.status(200).render("index.html");
});

app.get("/index.html", (req, res) => {
  res.status(200).render("index.html");
});

// POST handler
app.post("/submit", async (req, res) => {
  try {
    // 🛡️ 1. Verify reCAPTCHA
    const token = req.body["g-recaptcha-response"];
    if (!token) {
      return res.status(400).send("Captcha token missing");
    }

    const verify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
    );

    if (!verify.data.success) {
      return res.status(400).send("Captcha failed, try again.");
    }

    // 🛡️ 2. Honeypot field (hidden input 'website')
    if (req.body.website) {
      return res.status(400).send("Bot detected.");
    }

    // 🛡️ 3. Server-side validation
    const { name, email, subject, description } = req.body;

    const nameRegex = /^[A-Za-z. ]{3,20}$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/;
    const subjectRegex = /^[0-9]{7,15}$/; // treating subject as "mobile"?
    const descRegex = /^.{5,500}$/;

    if (!nameRegex.test(name)) return res.status(400).send("Invalid name");
    if (!emailRegex.test(email)) return res.status(400).send("Invalid email");
    if (!subjectRegex.test(subject)) return res.status(400).send("Invalid subject/mobile");
    if (!descRegex.test(description)) return res.status(400).send("Invalid description");

    // 🛡️ 4. Check duplicates (like before)
    const isUser = await contact.findOne({ name, email, subject, description });
    if (isUser) {
      return res.send("User info already exists");
    }

    // ✅ Save to DB
    const myData = new contact({ name, email, subject, description });
    await myData.save();

    res.send("Message sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error, please try later.");
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
