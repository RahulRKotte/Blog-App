import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  try {
    // GETTING POSTS
    const getPostsQuery = req.query.uid
      ? "SELECT * FROM posts WHERE uid = $1 ORDER BY date DESC"
      : req.query.cat
      ? "SELECT * FROM posts WHERE cat = $1 ORDER BY date DESC"
      : "SELECT * FROM posts ORDER BY date DESC";

    let postsResult;

    if (req.query.uid) {
      postsResult = await db.query(getPostsQuery, [req.query.uid]);
    } else if (req.query.cat) {
      postsResult = await db.query(getPostsQuery, [req.query.cat]);
    } else {
      postsResult = await db.query(getPostsQuery);
    }

    return res.status(200).json(postsResult.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getPost = async (req, res) => {
  try {
    // VALIDATE PARAMS
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // GETTING POST
    const getPostQuery =
      "SELECT p.id, u.username, p.title, p.desc, p.img, u.img AS userImg, p.cat, p.date FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = $1";
    const postResult = await db.query(getPostQuery, [postId]);

    // CHECK IF POST EXISTS
    const post = postResult.rows[0];
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addPost = async (req, res) => {
  try {
    // GET TOKEN and VERIFY LOGIN
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(403).json({ error: "Please Login to Create Posts" });
    }

    const userInfo = jwt.verify(token, "jwtkey");
    if (!userInfo) {
      return res.status(403).json("Token is not valid!");
    }

    // CREATE POST
    const putQuery =
      'INSERT INTO posts (title, "desc", img, date, uid, cat) VALUES ($1, $2, $3, $4, $5, $6)';

    const valuesToInsert = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.date,
      userInfo.id,
      req.body.cat,
    ];

    const putResult = await db.query(putQuery, valuesToInsert);

    return res.json({ message: "Post has been created!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    // GET TOKEN and VERIFY USER
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json("Not authenticated!");
    }

    const postId = req.params.id;

    const userInfo = jwt.verify(token, "jwtkey");
    if (!userInfo) {
      return res.status(403).json("Token is not valid!");
    }

    // Detete POST
    const deleteQuery = "DELETE FROM posts WHERE id = $1 AND uid = $2";
    const postResult = await db.query(deleteQuery, [postId, userInfo.id]);

    return res.json("Post has been deleted!");
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: "You can delete only your post!" });
  }
};

export const updatePost = async (req, res) => {
  try {
    // GET TOKEN and VERIFY LOGIN
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(403).json("Please Login to Create Posts");
    }

    const userInfo = jwt.verify(token, "jwtkey");
    if (!userInfo) {
      return res.status(403).json("Token is not valid!");
    }

    const postId = req.params.id;

    // UPDATE POST
    const patchQuery =
      'UPDATE posts SET title = $1, "desc" = $2, img = $3, cat = $4 WHERE id = $5 AND uid = $6';
    const patchResult = await db.query(patchQuery, [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      postId,
      userInfo.id,
    ]);

    return res.json("Post has been updated!");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
