const express = require("express");
const axios = require("axios");
const Order = require("../models/Order");

const router = express.Router();

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
        const order = response.data;

        console.log(response.data)
        await Order.create({
            orderId: order.order_id,
            customerId,
            amount,
            userPhone: customerPhone,
            status: "PENDING", // Initial status
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error creating order:", error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to create payment order",
            error: error.response?.data || error.message,
        });
    }
});

router.get('/verify-order/:orderId', async (req, res) => {
    const { orderId } = req.params;

    try {
        const response = await axios.get(`https://api.cashfree.com/pg/orders/${orderId}`, {
            headers: {
                "Content-Type": "application/json",
                "x-api-version": "2025-01-01",
                "x-client-id": process.env.CASHFREE_CLIENT_ID,
                "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
            },
        });

        const orderStatus = response.data.order_status;

        // ✅ Update DB
        await Order.findOneAndUpdate(
            { orderId },
            {
                orderStatus,
                verifiedAt: new Date(),
            },
            { new: true }
        );


        if (orderStatus === 'PAID') {
            // ✅ Payment successful
            return res.status(200).json({ success: true, message: 'Payment verified', data: response.data });
        } else {
            // ❌ Not paid yet
            return res.status(400).json({ success: false, message: 'Payment not completed', status: orderStatus });
        }
    } catch (error) {
        console.error('Error verifying order:', error.response?.data || error.message);
        return res.status(500).json({ success: false, message: 'Order verification failed' });
    }
})

module.exports = router