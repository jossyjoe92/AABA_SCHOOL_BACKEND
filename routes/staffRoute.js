const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const admin_controller = require('../controllers/admin');
const users_controller = require('../controllers/users');
const staff_controller = require('../controllers/staff');
// const multer = require('multer')
// const upload = multer();

// const upload = require("../utils/multer");

const requireLogin = require('../middleware/requireLogin')
const checkRole = require('../middleware/checkRole')
const useCalendar = require('../middleware/useCalendar')

//Get a single staff Details
router.get('/single-staff/:id',requireLogin,checkRole(['super-admin','admin','staff']),staff_controller.get_single_staff)

// Update staff details
router.put('/update-details/:id',requireLogin,checkRole(['super-admin','admin','staff']),staff_controller.update_staff_details)

//Student list By class
router.get('/student-list/:stdClass',requireLogin,checkRole(['staff']),users_controller.student_list)

//Compute Student Result
router.get('/compute-result/:id',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.get_student_result_for_compute)

//Data to update Student Attendance
router.get('/updatestudentattendance/:id',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.get_student_attendance_data)

//Get Class quiz report
router.get('/display-quiz/:stdClass',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.get_class_quiz_data)

//Save Computed Student Result
router.post('/student-result',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.save_student_result_after_compute)

//Save New Quiz
router.post('/new-quiz',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.save_new_quiz)

//Save Student week Attendance 
router.put('/student-weekly-attendance',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.save_student_weekly_attendance)

//Save Student Result Image Url
router.put('/student-result-image',requireLogin,checkRole(['super-admin','admin','staff']),staff_controller.save_student_result_image)

//Teacher remark Student Result
router.put('/teacher-remark',requireLogin,checkRole(['super-admin','admin','staff']),staff_controller.teacher_comment_student_result)

//Teacher compute Student Attendance for result
router.put('/compute-attendance',requireLogin,checkRole(['super-admin','admin','staff']),staff_controller.compute_student_attendance)

//Teacher compute Student Psychomoto
router.put('/psychomoto',requireLogin,checkRole(['super-admin','admin','staff']),staff_controller.compute_student_psychomoto)

//Teacher compute Student weekly Subject Performance
router.put('/weekly-subject-report',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.student_weekly_subject_report)

//Teacher compute Student weekly Psychomoto Performance
router.put('/weekly-psychomoto',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.student_weekly_psychomoto_report)

//Teacher Comment Student weekly Performance
router.put('/weekly-teacher-remark',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.weekly_teacher_remark)

// Quiz Section


module.exports = router