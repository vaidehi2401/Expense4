const express = require("express");
const controller = require('../controllers/paymentController');
const { createOrder, getPaymentStatus } = require("../services/cashfreeServices");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.get(`/payment-status/:orderId/:customerId`,  controller.getPaymentStatus);
router.get(`/getSessionId`,authenticate, controller.getSessionId)


module.exports = router; 
