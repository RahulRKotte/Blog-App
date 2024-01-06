import bcrypt from "bcrypt";
import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // CHECK EXISTING USER
    const checkQuery = "SELECT * FROM users WHERE email = $1 OR username = $2";
    const checkResult = await db.query(checkQuery, [
      req.body.email,
      req.body.username,
    ]);

    if (checkResult.rows.length) {
      return res.status(409).json("User already exists!");
    }

    // HASHING THE PASSWORD and CREATE A USER
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const insertQuery =
      "INSERT INTO users(username, email, password) VALUES ($1, $2, $3)";
    const insertValues = [req.body.username, req.body.email, hash];

    await db.query(insertQuery, insertValues);

    return res.status(200).json("User has been created.");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const login = async (req, res) => {
  try {
    // CHECK USER
    const checkQuery = "SELECT * FROM users WHERE username = $1";
    const checkResult = await db.query(checkQuery, [req.body.username]);

    if (checkResult.rows.length === 0) {
      return res.status(409).json("User not Found!");
    }

    // CHECK PASSWORD
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      checkResult.rows[0].password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong username or Password!");
    }

    const token = jwt.sign({ id: checkResult.rows[0].id }, "jwtkey");
    const { password, ...other } = checkResult.rows[0];

    await res.cookie("access_token", token, {
      httpOnly: true,
    });

    return res.status(200).json(other);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const logout = async (req, res) => {
  await res.clearCookie("access_token", {
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json("user has benn logged out.");
};
