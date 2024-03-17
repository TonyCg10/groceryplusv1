import { IP, ORDER, PAYMENT, PORT, PRODUCT, USER } from "./utils/utils";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import productsRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({origin: true, credentials: true}));

app.use(USER, userRoutes);
app.use(PRODUCT, productsRoutes);
app.use(ORDER, orderRoutes);
app.use(PAYMENT, paymentRoutes);

mongoose
.connect(
  "mongodb+srv://antoniocorcoba1:4P8Lts5WkpxqNSuK@cluster0.iwirqeh.mongodb.net/Users"
)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, IP, () => {
      console.log(`Server running on http://${IP}:${PORT}`);
    });
  })
  .catch((err) => console.error(err));
