"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = __importDefault(require("../models/orders"));
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    try {
        const data = await orders_1.default.find();
        res.json({ success: true, data: data, message: "Orders gotten" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await orders_1.default.find({ userId });
        res.json({ success: true, data: orders, message: "Orders found" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.post("/orders", async (req, res) => {
    try {
        const { userId, products, issuedDate, hours, status } = req.body;
        const newOrder = new orders_1.default({ userId, products, issuedDate, hours, status });
        const savedOrder = await newOrder.save();
        res
            .status(201)
            .json({ success: true, data: savedOrder, message: "Order created" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put("/update/:id", async (req, res) => {
    try {
        const order = await orders_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete("/delete/:id", async (req, res) => {
    try {
        const order = await orders_1.default.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json({ message: "Order deleted" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete("/deleteProduct/:orderId/:productId", async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const productId = req.params.productId;
        const order = await orders_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        //   const productIndex: number = order.products
        //     .map((p: any) => p.productId)
        //     .findIndex((product: any) => product._id.toString() === productId);
        //   if (productIndex === -1) {
        //     return res
        //       .status(404)
        //       .json({ message: "Product not found in the order" });
        //   }
        //   order.products.splice(productIndex, 1);
        //   await order.save();
        //   if (order.products.length === 0) {
        //     await Order.findByIdAndDelete(orderId);
        //     return res.json({
        //       message: "Order deleted because it has no more products",
        //     });
        //   }
        //   res.json({ message: "Product deleted from the order" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
