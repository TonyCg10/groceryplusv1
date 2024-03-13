"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_1 = __importDefault(require("../models/products"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        const data = await products_1.default.find();
        res.json({ success: true, data: data, message: "Products gotten" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.get("/check/single/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await products_1.default.findById(productId);
        if (product) {
            res
                .status(200)
                .json({ exists: true, message: "Product exists", result: product });
        }
        else {
            res.status(404).json({ exists: false, message: "Product not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/check/multiple/:ids", async (req, res) => {
    try {
        const productIds = req.params.ids.split(",");
        const products = await products_1.default.find({ _id: { $in: productIds } });
        res
            .status(200)
            .json({ exists: true, message: "Products exists", result: products });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/products", async (req, res) => {
    try {
        const { name, brand, category, description, discountPercentage, images, price, rating, stock, thumbnail, title, } = req.body;
        const newProduct = new products_1.default({
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.put("/update/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const updateFields = req.body;
        const result = await products_1.default.updateOne({ _id: productId }, { $set: updateFields });
        if (!result) {
            return res
                .status(404)
                .json({ success: false, message: "Document not found" });
        }
        res.status(200).json({ success: true, message: "Updated", data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await products_1.default.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Document not found" });
        }
        res.status(200).json({ success: true, message: "Deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
