import express from "express";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes";
import productsRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/groceryplus/user", userRoutes);
app.use("/groceryplus/products", productsRoutes);
app.use("/groceryplus/orders", orderRoutes);
app.use("/groceryplus/payments", paymentRoutes);

mongoose
.connect(
  "mongodb+srv://antoniocorcoba1:4P8Lts5WkpxqNSuK@cluster0.iwirqeh.mongodb.net/Users"
)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(2020, "localhost", () => {
      console.log(`Server running on http://localhost:2020`);
    });
  })
  .catch((err) => console.error(err));
