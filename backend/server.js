import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import asyncHandler from "express-async-handler";
import { fileURLToPath } from "url";
import fs from "fs";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import path from "path";
import { config } from "./config/config.js";
import multer from "multer";
import connectDB from "./config/db.js";
import PDF from "./models/pdfModel.js";
import User from "./models/userModel.js";

dotenv.config();

const app = express();
app.use(express.json());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(cors());

// Set up MongoDB connection
connectDB();

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

app.post(
  "/api/uploadpdf",
  asyncHandler(async (req, res) => {
    const uploadUser = req.query.id;
    upload(req, res, function (err) {
      const filepath = path.join(__dirname, "../") + req.file.path;

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
          user: uploadUser,
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
    const data = req.query;
    const fetchedPdfs = await PDF.find({ user: data.id });
    res.json(fetchedPdfs);
  })
);

//signup-signin form

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
    if (user) {
      await user.save();
      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: config.jwtExpiration,
      });
      res
        .status(200)
        .json({ token, userDetails: { id: user._id, email: user.email } });
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
      const user = await User.findOne({ email });
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
      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: config.jwtExpiration,
      });

      res
        .status(200)
        .json({ token, userDetails: { id: user._id, email: user.email } });
      // res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Login error", error);
      res.status(500).json({ message: "Login failed" });
    }
  })
);

app.get(
  "/logout",
  asyncHandler(async (req, res) => {})
);

app.delete(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    const pdfId = req.params.id;
    const file = await PDF.findByIdAndRemove(pdfId);

    if (!file) {
      console.error("Failed to delete PDF");
      res.status(500).send("Failed to delete PDF");
      return;
    }
    res.status(200).json({ message: "PDF deleted successfully" });
  })
);

app.get(
  "/pdf/:id",
  asyncHandler(async (req, res) => {
    const pdfId = req.params.id;

    // Find the PDF document by ID
    const file = await PDF.findById(pdfId);
    if (file) {
      res.json(file);
    } else {
      res.status(500).json({ message: "Invalid PDF File" });
    }
  })
);
app.get(
  "/pdf/shared/:id",
  asyncHandler(async (req, res) => {
    const pdfId = req.params.id;
    // Find the PDF document by ID
    const file = await PDF.findById(pdfId);
    if (file) {
      res.json(file);
    } else {
      res.status(500).json({ message: "Invalid PDF File" });
    }
  })
);

app.get(
  "/pdf/allcomments/:id",
  asyncHandler(async (req, res) => {
    const pdfId = req.params.id;
    const file = await PDF.findById(pdfId);
    if (file) {
      res.json(file);
    } else {
      res.status(500).json({ message: "Unable to Save" });
    }
  })
);

app.post(
  "/pdf/comments/:id",
  asyncHandler(async (req, res) => {
    const pdfId = req.params.id;
    const { message } = req.body;
    const file = await PDF.findById(pdfId);
    file.comments.push(message);
    const saved = await file.save();
    if (saved) {
      res.json(file);
    } else {
      res.status(500).json({ message: "Unable to Save" });
    }
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("Server is running on Port", PORT));
