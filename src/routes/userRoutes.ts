import express, { Request, Response } from "express";

import multer from "multer";
import path from "path";
import Stripe from "stripe";


import User from "../models/users";

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, "../uploads") });
const secret_key =
  "sk_test_51OtIvaFORGuFh6IZ488rjT7rHk1EZ7S1ddJCEj57g1fDkeHGcNB2VBEA9b5A82teh1rhqzYhrKYFxIiS5n4eqKwD00bCturkYt";

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await User.find();
    res.json({ success: true, data: data, message: "Users gotten" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/users", upload.single("img"), async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, stripeCustomerId } = req.body;
    const img = req.file ? req.file.path : null;

    const newUser = new User({ name, email, password, phone, img, stripeCustomerId });
    const savedUser = await newUser.save();

    res.status(201).json({ success: true, data: savedUser, message: "User created" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add/customer", async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const stripe = new Stripe(secret_key as string, {
      apiVersion: "2023-10-16",
      typescript: true,
    });

    const customer = await stripe.customers.create({
      email,
      name,
    });

    res.status(200).json({ success: true, data: customer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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

    if (user) {
      res.status(200).json({ exists: true, user, message: "Found" });
    } else {
      res.status(200).json({ exists: false, message: "Not Found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:id", upload.single("img"), async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updateFields = req.body;
    const newImage = req.file;

    if (newImage) {
      updateFields.img = newImage.path;
    }

    if (updateFields.stripeCustomerId) {
      const result = await User.findByIdAndUpdate(userId, { $set: { stripeCustomerId: updateFields.stripeCustomerId } }, { new: true });

      if (!result) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, message: "User updated", data: result });
    }

    const result = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });

    if (!result) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated", data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await User.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
