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
        const { amount, customerId, customerPhone, mentorId } = req.body;
        console.log("MentorId ", mentorId)
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
            parent: user._id,
            amount,
            userPhone: customerPhone,
            status: "PENDING", // Initial status
            mentor: mentorId
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

const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTNGMkU1OTlEMDkzRDRDNCIsImlhdCI6MTc1MDU5MjAyMywiZXhwIjoxOTA4MjcyMDIzfQ.CU0VtNuJu5MzHoSh-ItvVdeYEQqURgRTHymtUtuka-S6fxqzfuLPM8KgoVIMiCc965oZjw-XoKvSPQZhk00S4g";

router.get('/verify-order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log(req.params.id);
        const oldOrder = await Order.findOne({
            orderId: orderId
        }).populate("mentor", "fullName phone").populate("parent", "phone");
        const url = `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=C-8C8173E3038A484&senderId=UTOMOB&type=SMS&flowType=SMS&mobileNumber=${oldOrder?.parent?.phone}&message=Dear Sir/Ma'am, your class booking on Homentor is confirmed! 🎉  Mentor: ${oldOrder?.mentor?.fullName}. We’re excited to support your child’s learning journey.  Feel free to reach out anytime for help.  - Team Homentor`;
        const mentorUrl = `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=C-8C8173E3038A484&senderId=UTOMOB&type=SMS&flowType=SMS&mobileNumber=${oldOrder?.mentor?.phone}&message=Hello ${oldOrder?.mentor?.fullName}, you have a new class booking on Homentor! 🎉 Parent: ${oldOrder?.parent?.phone}  Let’s deliver an impactful session.  - Team Homentor`;

        const response = await cashfree.PGOrderFetchPayments(orderId)

        console.log('Order fetched successfully:', response.data);
        const getOrderResponse = response.data;
        if (
            getOrderResponse.filter(
                (transaction) => transaction.payment_status === "SUCCESS"
            ).length > 0
        ) {
            oldOrder.status = "success"
            const response = await axios.post(url, null, {

                headers: {
                    authToken: token,
                },
            });
            const mentorResponse = await axios.post(mentorUrl, null, {

                headers: {
                    authToken: token,
                },
            });
            console.log(response.data)

            const newBooking = new ClassBooking({
                mentor: oldOrder.mentor._id,
                price: oldOrder.amount,
                parent: oldOrder.parent._id
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