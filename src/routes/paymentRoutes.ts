import express, { Request, Response } from "express";

import Stripe from "stripe";

const secret_key =
  "sk_test_51OtIvaFORGuFh6IZ488rjT7rHk1EZ7S1ddJCEj57g1fDkeHGcNB2VBEA9b5A82teh1rhqzYhrKYFxIiS5n4eqKwD00bCturkYt";

const router = express.Router();

router.post("/add-customer", async (req: Request, res: Response) => {
  try {
    const { email, name, phone } = req.body;
    
    const stripe = new Stripe(secret_key as string, {
      apiVersion: "2023-10-16",
      typescript: true,
    });

    let customer = ''

    const customers = await stripe.customers.list({ email });
    const existingCustomer = customers.data[0];

    if (existingCustomer) {
      customer = existingCustomer.id
    } else {
      const createCustomer = await stripe.customers.create({
        email,
        name,
        phone,
      });

      customer = createCustomer.id
    }


    console.log('add-customer =====');
    console.log(customer);
    console.log('=====');

    res.status(200).json({ success: true, data: customer, message: "Customer created" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-customer/:id", async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const stripe = new Stripe(secret_key, {
      apiVersion: "2023-10-16",
    });

    const customer = await stripe.customers.retrieve(customerId);

    res.status(200).json({ customer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/add-payment-method", async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const stripe = new Stripe(secret_key, {
      apiVersion: "2023-10-16",
    });

    const customers = await stripe.customers.list({ email });
    const existingCustomer = customers.data[0].id;

    const paymentMethod = await stripe.paymentMethods.list({
      customer: existingCustomer,
    });

    res.status(200).json({ paymentMethod });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-payment-method/:id", async (req: Request, res: Response) => {
  try {
    const paymentMethodId = req.params.id;
    const stripe = new Stripe(secret_key, {
      apiVersion: "2023-10-16",
    });

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    res.status(200).json({ paymentMethod });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-payments-intents", async (req: Request, res: Response) => {
  const stripe = new Stripe(secret_key as string, {
    apiVersion: "2023-10-16",
    typescript: true,
  });

  try {
    const paymentIntents = await stripe.paymentIntents.list();

    res.status(200).json({
      paymentIntent: paymentIntents,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/set-up-intents", async (req: Request, res: Response) => {
  const { email } = req.body;

  const stripe = new Stripe(secret_key as string, {
    apiVersion: "2023-10-16",
    typescript: true,
  });

  try {
    const customer = await stripe.customers.list({ email: email });

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.data[0].id,
      type: "card",
    });

    const paymentMethodId = paymentMethods.data[0]?.id;

    const setupIntents = await stripe.setupIntents.create({
      customer: customer.data[0].id,
      payment_method: paymentMethodId,
      payment_method_types: ["card"],
    });

    res.status(200).json({
      setupIntents: setupIntents.client_secret,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create-payments-intents", async (req: Request, res: Response) => {
  const { amount, email } = req.body;

  const stripe = new Stripe(secret_key as string, {
    apiVersion: "2023-10-16",
    typescript: true,
  });

  try {
    const customer = await stripe.customers.list({ email: email });

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.data[0].id,
      type: "card",
    });

    const paymentMethodId = paymentMethods.data[0]?.id;

    if (!customer) {
      return res.status(400).json({ error: "No customers found" });
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      {
        customer: customer.data[0].id,
      },
      {
        apiVersion: "2023-10-16",
      }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      customer: customer.data[0].id,
      payment_method_types: ["card"],
      payment_method: paymentMethodId,
      confirmation_method: "automatic",
    });

    res.status(200).json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.data[0].id,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
