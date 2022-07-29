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

//Save Computed Student Result
router.post('/student-result',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.save_student_result_after_compute)

//Save Student Result Image Url
router.put('/student-result-image',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.save_student_result_image)

//Teacher remark Student Result
router.put('/teacher-remark',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.teacher_comment_student_result)

//Teacher compute Student Attendance
router.put('/compute-attendance',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.compute_student_attendance)

//Teacher compute Student Psychomoto
router.put('/psychomoto',requireLogin,checkRole(['super-admin','admin','staff']),useCalendar,staff_controller.compute_student_psychomoto)


module.exports = router