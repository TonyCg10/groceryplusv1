"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const secret_key = "sk_test_51OtIvaFORGuFh6IZ488rjT7rHk1EZ7S1ddJCEj57g1fDkeHGcNB2VBEA9b5A82teh1rhqzYhrKYFxIiS5n4eqKwD00bCturkYt";
const router = express_1.default.Router();
router.get("/customer/:id", async (req, res) => {
    try {
        const customerId = req.params.id;
        const stripe = new stripe_1.default(secret_key, {
            apiVersion: "2023-10-16",
        });
        const customer = await stripe.customers.retrieve(customerId);
        res.status(200).json({ customer });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/payment-method", async (req, res) => {
    const { email } = req.body;
    try {
        const stripe = new stripe_1.default(secret_key, {
            apiVersion: "2023-10-16",
        });
        const customers = await stripe.customers.list({ email });
        const existingCustomer = customers.data[0].id;
        const paymentMethod = await stripe.paymentMethods.list({
            customer: existingCustomer,
        });
        res.status(200).json({ paymentMethod });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/payment-method/:id", async (req, res) => {
    try {
        const paymentMethodId = req.params.id;
        const stripe = new stripe_1.default(secret_key, {
            apiVersion: "2023-10-16",
        });
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        res.status(200).json({ paymentMethod });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/payments-intents", async (req, res) => {
    const stripe = new stripe_1.default(secret_key, {
        apiVersion: "2023-10-16",
        typescript: true,
    });
    try {
        const paymentIntents = await stripe.paymentIntents.list();
        res.status(200).json({
            paymentIntent: paymentIntents,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/set-up-intents", async (req, res) => {
    var _a;
    const { email } = req.body;
    const stripe = new stripe_1.default(secret_key, {
        apiVersion: "2023-10-16",
        typescript: true,
    });
    try {
        const customer = await stripe.customers.list({ email: email });
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customer.data[0].id,
            type: "card",
        });
        const paymentMethodId = (_a = paymentMethods.data[0]) === null || _a === void 0 ? void 0 : _a.id;
        const setupIntents = await stripe.setupIntents.create({
            customer: customer.data[0].id,
            payment_method: paymentMethodId,
            payment_method_types: ["card"],
        });
        res.status(200).json({
            setupIntents: setupIntents.client_secret,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/create-payments-intents", async (req, res) => {
    var _a;
    const { amount, email } = req.body;
    const stripe = new stripe_1.default(secret_key, {
        apiVersion: "2023-10-16",
        typescript: true,
    });
    try {
        const customer = await stripe.customers.list({ email: email });
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customer.data[0].id,
            type: "card",
        });
        const paymentMethodId = (_a = paymentMethods.data[0]) === null || _a === void 0 ? void 0 : _a.id;
        if (!customer) {
            return res.status(400).json({ error: "No customers found" });
        }
        const ephemeralKey = await stripe.ephemeralKeys.create({
            customer: customer.data[0].id,
        }, {
            apiVersion: "2023-10-16",
        });
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            customer: customer.data[0].id,
            payment_method_types: ["card"],
            payment_method: paymentMethodId,
            confirmation_method: "manual",
        });
        const setupIntents = await stripe.setupIntents.create({
            customer: customer.data[0].id,
            payment_method: paymentMethodId,
            payment_method_types: ["card"],
        });
        res.status(200).json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.data[0].id,
            paymentStatus: paymentIntent.status,
            setupIntents: setupIntents.client_secret,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
