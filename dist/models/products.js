"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    brand: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
    description: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
    discountPercentage: {
        type: mongoose_1.default.Schema.Types.Number,
    },
    images: {
        type: [mongoose_1.default.Schema.Types.String],
        required: true,
    },
    price: {
        type: mongoose_1.default.Schema.Types.Number,
        required: true,
    },
    rating: {
        type: mongoose_1.default.Schema.Types.Number,
        required: true,
    },
    stock: {
        type: mongoose_1.default.Schema.Types.Number,
        required: true,
    },
    thumbnail: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
    title: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.default.model('Product', productSchema);
