const express = require("express");
const { createCashfreeOrder } = require("../controller/paymentController.js");
const { Cashfree, CFEnvironment } = require("cashfree-pg");

const router = express.Router();
const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION,
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
  
  
);
router.post("/create-order", async (req, res) => {
    try {
        const { amount, customerId, customerName, customerEmail, customerPhone } = req.body;

        const request = {
            order_amount: amount,
            order_currency: "INR",
            customer_details: {
                customer_id: customerId,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
            },
            order_meta: {
                return_url: `https://homentor.onrender.com/payment-successful?orderId=${customerId}`,
            },
            order_note: "Payment for your services",
        };

        const response = await cashfree.PGCreateOrder(request);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error creating order:", error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to create payment order",
            error: error.response?.data || error.message,
        });
    }
});

module.exports = router