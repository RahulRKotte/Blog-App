import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalnameWithoutSpaces = file.originalname.replace(/\s+/g, "_");
    cb(null, uniquePrefix + "-" + originalnameWithoutSpaces);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  try {
    if (req.file) {
      const file = req.file;
      res.status(200).json(file.filename);
    } else {
      res.status(200).json();
    }
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(8800, () => {
  console.log("Listening ....");
});
