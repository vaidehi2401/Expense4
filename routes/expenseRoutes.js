const express = require('express');
const authenticate = require('../middleware/auth')
const router = express.Router();
const controller = require('../controllers/expenseController');
router.post('/add-expense',authenticate, controller.postExpense);
router.get('/get-expense/:page',authenticate,  controller.getExpense )
router.delete('/delete-expense/:id', authenticate, controller.deleteExpense);
module.exports =router;