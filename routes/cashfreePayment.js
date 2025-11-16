const express = require("express");
const axios = require("axios");
const Order = require("../models/Order");
const { Cashfree, CFEnvironment } = require("cashfree-pg");
const User = require("../models/User");
const ClassBooking = require("../models/ClassBooking");
const cashfree = new Cashfree(CFEnvironment.PRODUCTION, process.env.CASHFREE_CLIENT_ID, process.env.CASHFREE_CLIENT_SECRET);
const router = express.Router();

router.post("/create-order", async (req, res) => {
    try {
        const { amount, customerId, customerPhone, mentorId, duration, session } = req.body;
        // console.log("MentorId ", mentorId)
        const user = await User.findOne({
            phone: customerPhone
        })
        const response = await axios.post(
            "https://api.cashfree.com/pg/orders",
            {
                order_currency: "INR",
                order_amount: amount,
                customer_details: {
                    customer_id: customerId,
                    customer_phone: customerPhone,
                },
                order_meta: {
                    return_url: `https://homentor.in/payment-status?orderId=${customerId}`,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-version": "2022-09-01",
                    "x-client-id": process.env.CASHFREE_CLIENT_ID,
                    "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
                },
            }
        );
        const order = response.data;

        // console.log(response.data)

        await Order.create({
            orderId: order.order_id,
            parent: user._id,
            amount,
            userPhone: customerPhone,
            status: "PENDING", // Initial status
            mentor: mentorId,
            duration: duration ? duration : null ,
            session : session ? session : 1
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

const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLThDODE3M0UzMDM4QTQ4NCIsImlhdCI6MTc1NDAzMTk0MywiZXhwIjoxOTExNzExOTQzfQ.xZesgbwmv9g2uypje1YpPaJLA1ZyXHFO0eNv3gjpBo6hfY65D3uaMIlsuDhJRL1zsTaL4Z8O5ThNk0iPdbkpfw";

router.get('/verify-order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        
        const oldOrder = await Order.findOne({
            orderId: orderId
        }).populate("mentor", "fullName phone").populate("parent", "phone");
    
        const response = await cashfree.PGOrderFetchPayments(orderId)
        // console.log(response)
        // cashfree.PG

        console.log('Order fetched successfully 2:', response.data);
        const getOrderResponse = response.data;
        if (
            getOrderResponse.filter(
                (transaction) => transaction.payment_status === "SUCCESS"
            ).length > 0
        ) {
            oldOrder.status = "success"

            const newBooking = new ClassBooking({
                mentor: oldOrder.mentor._id,
                price: oldOrder.amount,
                parent: oldOrder.parent._id,
                duration: oldOrder.duration ? oldOrder.duration : 22,
                session : oldOrder.session
            })
            await newBooking.save()
        }
        else if (
            getOrderResponse.filter(
                (transaction) => transaction.payment_status === "PENDING"
            ).length > 0
        ) {
            oldOrder.status = "pending"
        } else {
            oldOrder.status = "failed"
        }
        await oldOrder.save()
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error Verifying Order:", error.response?.data || error.message);
        res.status(500).json({
            message: "Failed to create payment order",
            error: error.response?.data || error.message,
        });
    }
})

module.exports = router