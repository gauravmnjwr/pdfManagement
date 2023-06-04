import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import asyncHandler from "express-async-handler";
import { fileURLToPath } from "url";
import fs from "fs";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

import path from "path";

import mongoose from "mongoose";

dotenv.config();

var userId;

const app = express();
app.use(express.json());
// app.use(bodyParser.json());

app.use(cors());

// Set up MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  // dbName: "pdfManagement",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//schema

const pdfSchema = new mongoose.Schema(
  {
    name: String,
    path: String,
    contentType: String,
    data: Buffer,
    base64Data: String,
    user: String,
  },
  { timestamps: true }
);

const PDF = mongoose.model("PDF", pdfSchema);

//
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("file");

//
app.get("/", (req, res) => {
  res.json({ message: "Hye" });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(path.join(__dirname, "../"));

app.post(
  "/api/uploadpdf",
  asyncHandler(async (req, res) => {
    upload(req, res, function (err) {
      const filepath = path.join(__dirname, "../") + req.file.path;
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err);
      } else if (err) {
        return res.status(500).json(err);
      }

      fs.readFile(filepath, { encoding: "base64" }, (err, data) => {
        if (err) {
          console.error("Failed to read PDF file", err);
          return;
        }
        PDF.create({
          name: req.file.originalname,
          path: filepath,
          contentType: req.file.mimetype,
          base64Data: data,
          user: userId,
        });
      });

      return res.status(200).send(req.file);
    });

    console.log("post req");
  })
);

app.get(
  "/allpdfs",
  asyncHandler(async (req, res) => {
    const fetchedPdfs = await PDF.find({ user: userId });
    res.json(fetchedPdfs);
  })
);

//signup-signin form
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Signup route
app.post(
  "/signup",
  asyncHandler(async (req, res) => {
    console.log("signeddd");
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    // save user id
    userId = user._id.toString();
    if (user) {
      await user.save();
      res.status(201).json({ message: "Signup successful" });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  })
);

// Login route
app.post(
  "/login",
  asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find the user in the database
      const user = await User.findOne({ email });
      userId = user._id.toString();
      if (!user) {
        res.status(404);
        throw new Error("User Not Found");
      }
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Authentication failed" });
        return;
      }
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Login error", error);
      res.status(500).json({ message: "Login failed" });
    }
  })
);

// app.get("/allusers",asyncHandler(async(req,res) =>{

// }))

// app.get('/getuser')

app.get(
  "/pdf/:id",
  asyncHandler(async (req, res) => {
    const pdfId = req.params.id;

    // Find the PDF document by ID
    const file = await PDF.findById(pdfId);
    console.log(file.contentType);
    if (file) {
      res.setHeader("Content-Type", file.contentType);
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${file.filename}"`
      );
      // Stream the PDF data to the response
      const stream = fs.createReadStream(file.data);
      stream.pipe(res);
    }

    // Set the response headers
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("Server is running on Port", PORT));
