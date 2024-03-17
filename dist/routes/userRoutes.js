"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const users_1 = __importDefault(require("../models/users"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: path_1.default.join(__dirname, "../uploads") });
router.get("/get-users", async (_req, res) => {
    try {
        const data = await users_1.default.find();
        console.log('get-users =====');
        console.log(data);
        console.log('=====');
        res.status(200).json({ success: true, data: data, message: "Users gotten" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.post("/create-user", upload.single("img"), async (req, res) => {
    try {
        const { name, email, password, phone, stripeCustomerId } = req.body;
        const img = req.file ? req.file.path : null;
        const newUser = new users_1.default({
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
        console.log('check-user =====');
        console.log(user);
        console.log('=====');
        if (user) {
            res.status(200).json({ exists: true, data: user, message: "Found" });
        }
        else {
            res.status(200).json({ exists: false, message: "Not Found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put("/update-user/:id", upload.single("img"), async (req, res) => {
    try {
        const userId = req.params.id;
        const updateFields = req.body;
        const newImage = req.file;
        if (newImage) {
            updateFields.img = newImage.path;
            console.log(req.file);
        }
        console.log(req.file);
        const result = await users_1.default.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.delete("/delete-user/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await users_1.default.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Document not found" });
        }
        console.log('delete-user =====');
        console.log(result);
        console.log('=====');
        res.status(200).json({ success: true, data: result, message: "Deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
