const express = require("express");
const controller = require('../controllers/forgotPasswordController');
const router = express.Router();
router.post(`/forgotPassword`,  controller.getForgotEmail);
router.get(`/resetPassword/:forgotid`, controller.checkForgotEmail)
router.post('/setPassword', controller.setNewPassword)
module.exports=router
