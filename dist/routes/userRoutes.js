"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const stripe_1 = __importDefault(require("stripe"));
const users_1 = __importDefault(require("../models/users"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: path_1.default.join(__dirname, "../uploads") });
const secret_key = "sk_test_51OtIvaFORGuFh6IZ488rjT7rHk1EZ7S1ddJCEj57g1fDkeHGcNB2VBEA9b5A82teh1rhqzYhrKYFxIiS5n4eqKwD00bCturkYt";
router.get("/", async (req, res) => {
    try {
        const data = await users_1.default.find();
        res.json({ success: true, data: data, message: "Users gotten" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.post("/users", upload.single("img"), async (req, res) => {
    try {
        const { name, email, password, phone, stripeCustomerId } = req.body;
        const img = req.file ? req.file.path : null;
        const newUser = new users_1.default({ name, email, password, phone, img, stripeCustomerId });
        const savedUser = await newUser.save();
        res.status(201).json({ success: true, data: savedUser, message: "User created" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/add/customer", async (req, res) => {
    try {
        const { email, name } = req.body;
        const stripe = new stripe_1.default(secret_key, {
            apiVersion: "2023-10-16",
            typescript: true,
        });
        const customer = await stripe.customers.create({
            email,
            name,
        });
        res.status(200).json({ success: true, data: customer });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/check-user", async (req, res) => {
    try {
        const { email, password, phone } = req.body;
        let query = {};
        if (email) {
            query.email = email;
        }
        if (password) {
            query.password = password;
        }
        if (phone) {
            query.phone = phone;
        }
        const user = await users_1.default.findOne(query);
        if (user) {
            res.status(200).json({ exists: true, user, message: "Found" });
        }
        else {
            res.status(200).json({ exists: false, message: "Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put("/update/:id", upload.single("img"), async (req, res) => {
    try {
        const userId = req.params.id;
        const updateFields = req.body;
        const newImage = req.file;
        if (newImage) {
            updateFields.img = newImage.path;
        }
        if (updateFields.stripeCustomerId) {
            const result = await users_1.default.findByIdAndUpdate(userId, { $set: { stripeCustomerId: updateFields.stripeCustomerId } }, { new: true });
            if (!result) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            return res.status(200).json({ success: true, message: "User updated", data: result });
        }
        const result = await users_1.default.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });
        if (!result) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User updated", data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await users_1.default.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }
        res.status(200).json({ success: true, message: "Deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
