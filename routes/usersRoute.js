const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const users_controller = require('../controllers/users');
const useCalendar = require('../middleware/useCalendar')


const requireLogin = require('../middleware/requireLogin')

//Get a single student Details
router.get('/single-student/:id',requireLogin,users_controller.get_single_student)

//Get a single student Result
router.get('/student-result/:id',requireLogin,useCalendar,users_controller.student_result)

router.get('/studentbroad/:class',requireLogin,useCalendar,users_controller.class_broad_sheet)

//Get a single student Book List
router.get('/studentbook/:id',requireLogin,useCalendar,users_controller.student_books)

//Get a single student weekly Attendance
router.get('/studentattendance/:id',requireLogin,useCalendar,users_controller.student_attendance)

//Get a single student subjects
router.get('/studentsubjects/:section',requireLogin,users_controller.student_subjects)

//Get a single student weekly performance report
router.get('/weeklyperformancereport/:id',requireLogin,useCalendar,users_controller.weekly_performance_report)

//Get a single student weekly Quiz
router.get('/take-quiz/:stdClass',requireLogin,useCalendar,users_controller.take_quiz)

// Update result from broadsheet
router.put('/student-result-update/:id',requireLogin,useCalendar,users_controller.student_compute_result_update)


// Update users Password
router.put('/reset-password/:id',requireLogin,users_controller.reset_Password)

module.exports = router