const express = require("express");
const controller = require('../controllers/premiumController');
const { createOrder, getPaymentStatus } = require("../services/cashfreeServices");
const authenticate = require("../middleware/auth");
const router = express.Router();
router.get('/isPremium', authenticate, controller.isPremium)
router.get('/getPremiumData', controller.getPremiumData)
module.exports=router
