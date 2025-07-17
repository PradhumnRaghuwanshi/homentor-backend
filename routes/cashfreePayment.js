import express from "express";
import { createCashfreeOrder } from "../controller/paymentController.js";

const router = express.Router();

router.post("/create-order", createCashfreeOrder);

export default router;
