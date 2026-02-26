const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

// FIX: Correct config path because this file runs inside /api
const connectDB = require("../config/db");

connectDB(); // connect once

const app = express();

// FIXED PATHS
const ROOT = path.join(__dirname, "..");

app.use(express.static(path.join(ROOT, "static")));
app.set("views", path.join(ROOT, "views"));
app.use(express.urlencoded({ extended: true }));

app.engine("html", require("ejs").renderFile);

// Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  description: String,
});

const contact = mongoose.model("contact", contactSchema);

// Routes
app.get("/", (req, res) => {
  res.status(200).render("index.html");
});

app.post("/submit", async (req, res) => {
  try {
    const token = req.body["g-recaptcha-response"];
    if (!token) return res.status(400).send("Captcha token missing");

    const verify = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
    );

    if (!verify.data.success)
      return res.status(400).send("Captcha failed, try again.");

    if (req.body.website) return res.status(400).send("Bot detected.");

    const { name, email, subject, description } = req.body;

    const nameRegex = /^[A-Za-z. ]{3,20}$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/;
    const subjectRegex = /^[0-9]{7,15}$/;
    const descRegex = /^.{5,500}$/;

    if (!nameRegex.test(name)) return res.status(400).send("Invalid name");
    if (!emailRegex.test(email)) return res.status(400).send("Invalid email");
    if (!subjectRegex.test(subject))
      return res.status(400).send("Invalid subject/mobile");
    if (!descRegex.test(description))
      return res.status(400).send("Invalid description");

    const isUser = await contact.findOne({ name, email, subject, description });
    if (isUser) return res.send("User info already exists");

    await new contact({ name, email, subject, description }).save();

    res.send("Message sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error, please try later.");
  }
});

// EXPORT FOR VERCEL
module.exports = app;
module.exports.handler = serverless(app);
