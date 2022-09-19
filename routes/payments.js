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

// Get All Payment made to the school By Term
router.get('/term_payment/:term',payment_controller.payment_by_term);

// Get a particular Student Payment History
router.get('/studentpaymenthistory/:id',useCalendar,payment_controller.student_payment_history);

// Get Fees to pay For Each Section
router.get('/fees/:section',payment_controller.section_fee);

// Get a student Payment By term
router.get('/studentfees/:id',useCalendar,payment_controller.student_payment_details);

// Get requisitions 
router.get('/view-requisitions/:sort',payment_controller.view_requisitions);

// Get salaries
router.get('/view-salaries/:sort',payment_controller.view_salaries);

// Get single staff salary history
router.get('/view-salary-history/:id',payment_controller.view_salary_history);

// Get single salary item
router.get('/single-salary/:id',useCalendar,payment_controller.single_salary);

// Get financial summary
router.get('/financial-summary/:sort',useCalendar,payment_controller.financial_summary);

// Save A New Requisition form
router.post('/create-requisition',payment_controller.create_requisition);

// Save A New Salary Payment
router.post('/pay-salary',payment_controller.pay_salary);

// Update Fees to pay For Each Section
router.put('/updatefees/:id',payment_controller.update_section_fee);

// Update Fees Paid by a student for the current session
router.put('/studentfees/update/:id',payment_controller.update_student_Payment);

// Update A Requisition form
router.put('/update-requisition/:id',payment_controller.update_requisition);

// Update A Salary Info
router.put('/single-salary-update/:id',payment_controller.single_salary_update);

module.exports = router