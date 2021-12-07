const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const payment_controller = require('../controllers/payments')
const requireLogin = require('../middleware/requireLogin')
const useCalendar = require('../middleware/useCalendar')

// //Make a payment
// router.post('/payfees/:id',payment_controller.fees_payment);

// Get Payment By date
router.get('/:date',payment_controller.payment_date);

// Get Payment By month
router.get('/monthly_payment/:month',payment_controller.payment_by_month);

// Get Fees to pay For Each Section
router.get('/fees/:section',payment_controller.section_fee);

// Get a student Payment By term
router.get('/studentfees/:id',useCalendar,payment_controller.student_payment_details);

// Update Fees to pay For Each Section
router.put('/updatefees/:id',payment_controller.update_section_fee);

// Update Fees Paid by a student for the current session
router.put('/studentfees/update/:id',payment_controller.update_student_Payment);



module.exports = router