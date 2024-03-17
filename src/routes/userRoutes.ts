import express, { Request, Response } from "express";

import multer from "multer";
import path from "path";

import User from "../models/users";

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, "../uploads") });

router.get("/get-users", async (_req: Request, res: Response) => {
  try {
    const data = await User.find();
    
    console.log('get-users =====');
    console.log(data);
    console.log('=====');
    
    res.status(200).json({ success: true, data: data, message: "Users gotten" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post(
  "/create-user",
  upload.single("img"),
  async (req: Request, res: Response) => {
    try {
      const { name, email, password, phone, stripeCustomerId } = req.body;
      const img = req.file ? req.file.path : null;

      const newUser = new User({
        name,
        email,
        password,
        phone,
        img,
        stripeCustomerId,
      });
      const savedUser = await newUser.save();

      console.log('create-user =====');
      console.log(savedUser);
      console.log('=====');

      res
        .status(200)
        .json({ success: true, data: savedUser, message: "User created" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

router.post("/check-user", async (req: Request, res: Response) => {
  try {
    const { email, password, phone } = req.body;

    let query: any = {};

    if (email) {
      query.email = email;
    }

    if (password) {
      query.password = password;
    }

    if (phone) {
      query.phone = phone;
    }

    const user = await User.findOne(query);

    console.log('check-user =====');
    console.log(user);
    console.log('=====');

    if (user) {
      res.status(200).json({ exists: true, data: user, message: "Found" });
    } else {
      res.status(200).json({ exists: false, message: "Not Found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put(
  "/update-user/:id",
  upload.single("img"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const updateFields = req.body;
      const newImage = req.file;

      if (newImage) {
        updateFields.img = newImage.path;
        console.log(req.file);
      }

      console.log(req.file);
      
      const result = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true }
      );

      if (!result) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      console.log('update-user #####');
      console.log(result);
      console.log('#####');

      res
        .status(200)
        .json({ success: true, data: result, message: "User updated" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);


router.delete("/delete-user/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await User.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    console.log('delete-user =====');
    console.log(result);
    console.log('=====');

    res.status(200).json({ success: true, data: result, message: "Deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
