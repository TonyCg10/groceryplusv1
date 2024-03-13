import express, { Request, Response } from "express";

import Product from "../models/products";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await Product.find();
    res.json({ success: true, data: data, message: "Products gotten" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/check/single/:id", async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (product) {
      res
        .status(200)
        .json({ exists: true, message: "Product exists", result: product });
    } else {
      res.status(404).json({ exists: false, message: "Product not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/check/multiple/:ids", async (req: Request, res: Response) => {
  try {
    const productIds = req.params.ids.split(",");
    const products = await Product.find({ _id: { $in: productIds } });
    res
      .status(200)
      .json({ exists: true, message: "Products exists", result: products });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/products", async (req: Request, res: Response) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      discountPercentage,
      images,
      price,
      rating,
      stock,
      thumbnail,
      title,
    } = req.body;

    const newProduct = new Product({
      name,
      brand,
      category,
      description,
      discountPercentage,
      images,
      price,
      rating,
      stock,
      thumbnail,
      title,
    });

    const savedProduct = await newProduct.save();

    res
      .status(201)
      .json({ success: true, data: savedProduct, message: "Product created" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/update/:id", async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const updateFields = req.body;

    const result = await Product.updateOne(
      { _id: productId },
      { $set: updateFields }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    res.status(200).json({ success: true, message: "Updated", data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await Product.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
