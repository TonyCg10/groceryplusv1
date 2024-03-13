import { Request, Response, Router } from "express";
import { Document } from "mongoose";
import Order, { OrderType } from "../models/orders";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await Order.find();

    res.json({ success: true, data: data, message: "Orders gotten" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId: string = req.params.userId;
    const orders = await Order.find({ userId });

    res.json({ success: true, data: orders, message: "Orders found" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/orders", async (req: Request, res: Response) => {
  try {
    const { userId, products, issuedDate, hours, status } = req.body;

    const newOrder = new Order({ userId, products, issuedDate, hours, status });
    const savedOrder = await newOrder.save();

    res
      .status(201)
      .json({ success: true, data: savedOrder, message: "Order created" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:id", async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteProduct/:orderId/:productId", async (req: Request, res: Response) => {
  try {
    const orderId: string = req.params.orderId;
    const productId: string = req.params.productId;

    const order: Document<OrderType> | null = await Order.findById(orderId);

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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
