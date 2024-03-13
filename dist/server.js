"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/groceryplus/user", userRoutes_1.default);
app.use("/groceryplus/products", productRoutes_1.default);
app.use("/groceryplus/orders", orderRoutes_1.default);
app.use("/groceryplus/payments", paymentRoutes_1.default);
mongoose_1.default
    .connect("mongodb+srv://antoniocorcoba1:4P8Lts5WkpxqNSuK@cluster0.iwirqeh.mongodb.net/Users")
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(2020, "localhost", () => {
        console.log(`Server running on http://localhost:2020`);
    });
})
    .catch((err) => console.error(err));
