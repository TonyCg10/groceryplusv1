"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils/utils");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(utils_1.USER, userRoutes_1.default);
app.use(utils_1.PRODUCT, productRoutes_1.default);
app.use(utils_1.ORDER, orderRoutes_1.default);
app.use(utils_1.PAYMENT, paymentRoutes_1.default);
mongoose_1.default
    .connect("mongodb+srv://antoniocorcoba1:4P8Lts5WkpxqNSuK@cluster0.iwirqeh.mongodb.net/Users")
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(utils_1.PORT, utils_1.IP, () => {
        console.log(`Server running on http://${utils_1.IP}:${utils_1.PORT}`);
    });
})
    .catch((err) => console.error(err));
