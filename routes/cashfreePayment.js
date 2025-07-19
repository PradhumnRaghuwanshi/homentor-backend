const express = require("express");
const { createCashfreeOrder } = require("../controller/paymentController.js");
const { Cashfree, CFEnvironment } = require("cashfree-pg");
const  axios  = require("axios");

const router = express.Router();
const cashfree = new Cashfree(
    CFEnvironment.PRODUCTION,
    process.env.CASHFREE_CLIENT_ID,
    process.env.CASHFREE_CLIENT_SECRET


);
router.post("/create-order", async (req, res) => {
    try {
        
        const { amount, customerId, customerPhone } = req.body;
        const response = await axios.post(
            "https://api.cashfree.com/pg/orders",
            {
                order_currency: "INR",
                order_amount: amount,
                customer_details: {
                    customer_id: customerId,
                    customer_phone: "9999988888",
                },
                order_meta: {
                    return_url: `https://homentor.in/payment-successful?orderId=${customerId}`,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-version": "2025-01-01",
                    "x-client-id": process.env.CASHFREE_CLIENT_ID,
                    "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
                },
            }
        );
        const paymentLink = response.data.payment_link;
        console.log(response.data)
        res.status(200).json( response.data );


        // const request = {
        //     order_amount: amount,
        //     order_currency: "INR",
        //     customer_details: {
        //         customer_id: customerId,
        //         customer_name: customerName,
        //         customer_email: customerEmail,
        //         customer_phone: customerPhone,
        //     },
        //     order_meta: {
        //         return_url: `https://homentor.onrender.com/payment-successful?orderId=${customerId}`,
        //     },
        //     order_note: "Payment for your services",
        // };

        // const response = await cashfree.PGCreateOrder(request);
        // res.status(200).json(response.data);
    } catch (error) {
        console.error("Error creating order:", error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to create payment order",
            error: error.response?.data || error.message,
        });
    }
});

module.exports = router