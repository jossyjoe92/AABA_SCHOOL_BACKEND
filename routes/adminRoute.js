const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const admin_controller = require('../controllers/admin');
const users_controller = require('../controllers/users');
const multer = require('multer')
// const upload = multer();

const upload = require("../utils/multer");

const requireLogin = require('../middleware/requireLogin')
const checkRole = require('../middleware/checkRole')
const useCalendar = require('../middleware/useCalendar')

//Staff Validation list
router.get('/registered-staffs', requireLogin, checkRole(['super-admin', 'admin']), admin_controller.staff_validation_list)

//Staff Details list
router.get('/staff-list', requireLogin, checkRole(['super-admin', 'admin', 'accountant']), admin_controller.staff_list)

//Student list By class
router.get('/student-list/:stdClass', requireLogin, checkRole(['super-admin', 'admin', 'accountant']), users_controller.student_list)

//Search For item
router.post('/search-students', requireLogin, checkRole(['super-admin', 'admin', 'accountant']), users_controller.search_students)
//Student Booklist By class
router.get('/book-list/:bookClass', requireLogin, checkRole(['super-admin', 'admin', 'staff']), users_controller.book_list)

//get school calendar
router.get('/school-calendar', requireLogin, checkRole(['super-admin', 'admin', 'staff', 'accountant', 'student']), useCalendar, admin_controller.get_school_calendar)

//get school Event calendar
router.get('/school-event-calendar', requireLogin, useCalendar, admin_controller.get_school_event_calendar)

//Staff Validation 
router.put('/validate-staff/:id', requireLogin, checkRole(['super-admin', 'admin']), admin_controller.staff_validation)

//Reset Password 
router.put('/reset-password/:id', requireLogin, checkRole(['super-admin', 'admin']), admin_controller.reset_user_password)

// Update student details
router.put('/update-student-details/:id', requireLogin, checkRole(['super-admin', 'admin']), admin_controller.update_student_details)

// Update Class Book List
router.put('/booklist/:id', requireLogin, checkRole(['super-admin', 'admin', 'staff']), admin_controller.update_class_booklist)

// Update Student Book List
router.put('/studentbooklist/:id', requireLogin, checkRole(['super-admin', 'admin', 'staff']), admin_controller.update_student_booklist)

//Update School Calendar
router.put('/updatecalendar', requireLogin, checkRole(['super-admin', 'admin']), useCalendar, admin_controller.update_school_calendar)

//Update Term start
router.put('/updatetermstart', requireLogin, checkRole(['super-admin', 'admin']), admin_controller.update_term_start)

//Update Student photo
router.put('/update-student-photo/:id', requireLogin, checkRole(['super-admin', 'admin']), admin_controller.update_student_photo)

//HM remark Student Result
router.put('/hm-remark', requireLogin, checkRole(['super-admin', 'admin']), useCalendar, admin_controller.hm_comment_student_result)

//Update School Event Calendar
router.put('/update-eventcalendar', requireLogin, checkRole(['super-admin', 'admin']), useCalendar, admin_controller.update_event_calender)

//Promote student to new class
router.put('/promote-students', requireLogin, checkRole(['super-admin', 'admin']), useCalendar, admin_controller.promote_student_to_newClass)

//Create Subject List
router.post('/newsubjectList', requireLogin, checkRole(['super-admin', 'admin']), admin_controller.new_subject_list)

// Create Book List for A Class
router.post('/newbooklist', requireLogin, checkRole(['super-admin', 'admin', 'staff']), admin_controller.new_book_list)

//Create School Calendar
router.post('/create-calendar', requireLogin, checkRole(['super-admin']), useCalendar, admin_controller.create_school_calendar)


//Delete Staff Account 
router.delete('/delete-staff-account/:id', requireLogin, checkRole(['super-admin', 'admin']), admin_controller.delete_staff_account)


module.exports = router