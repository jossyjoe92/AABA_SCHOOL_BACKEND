const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const admin_controller = require('../controllers/admin');
const users_controller = require('../controllers/users');
// const multer = require('multer')
// const upload = multer();

// const upload = require("../utils/multer");

const requireLogin = require('../middleware/requireLogin')
const checkRole = require('../middleware/checkRole')
const useCalendar = require('../middleware/useCalendar')

//Staff Validation list
router.get('/registered-staffs',requireLogin,checkRole(['super-admin','admin']),admin_controller.staff_validation_list)

//Staff Details list
router.get('/staff-list',requireLogin,checkRole(['super-admin','admin']),admin_controller.staff_list)

//Student list By class
router.get('/student-list/:stdClass',requireLogin,checkRole(['super-admin','admin','accountant']),users_controller.student_list)

//get school calendar
router.get('/school-calendar',requireLogin,checkRole(['super-admin','admin','staff','student']),useCalendar,admin_controller.get_school_calendar)

//Staff Validation 
router.put('/validate-staff/:id',requireLogin,checkRole(['super-admin','admin']),admin_controller.staff_validation)

//Reset Password 
router.put('/reset-password/:id',requireLogin,checkRole(['super-admin','admin']),admin_controller.reset_user_password)

// Update student details
router.put('/update-student-details/:id',requireLogin,checkRole(['super-admin','admin']),admin_controller.update_student_details)

//Update School Calendar
router.put('/updatecalendar',requireLogin,checkRole(['super-admin','admin']),useCalendar,admin_controller.update_school_calendar)

//Update Term start
router.put('/updatetermstart',requireLogin,checkRole(['super-admin','admin']),admin_controller.update_term_start)

//Update Student photo
router.put('/update-student-photo/:id',requireLogin,checkRole(['super-admin','admin']),admin_controller.update_student_photo)

//Teacher remark Student Result
router.put('/hm-remark',requireLogin,checkRole(['super-admin','admin']),useCalendar,admin_controller.hm_comment_student_result)

//Create Subject List
router.post('/newsubjectList',requireLogin,checkRole(['super-admin','admin']),admin_controller.new_subject_list)

//Create School Calendar
router.post('/create-calendar',requireLogin,checkRole(['super-admin']),useCalendar,admin_controller.create_school_calendar)


//Delete Staff Account 
router.delete('/delete-staff-account/:id',requireLogin,checkRole(['super-admin','admin']),admin_controller.delete_staff_account)



// //Create a new Gift
// router.post('/new-gift',requireLogin,upload.single('uploaded_file'),gift_controller.new_gift)

// //Create a new Service
// router.post('/new-service',requireLogin,upload.single('uploaded_file'),service_controller.new_service)

// //Create a new Beloved
// router.post('/new-beloved',requireLogin,upload.single('uploaded_file'),beloved_controller.new_beloved)

// //Get a user's family list
// router.get('/myfamilies',requireLogin,family_controller.my_families)

// //Get a single family
// router.get('/family/:id',requireLogin,family_controller.single_family)

// //Get gifts in a family
// router.get('/family-gifts/:familyId',requireLogin,family_controller.all_gifts)

// //Get services in a family
// router.get('/family-services/:familyId',requireLogin,family_controller.all_services)

// //Get all beloved in a family
// router.get('/family-beloved/:familyId',requireLogin,family_controller.all_beloved)

// //Get a single gift
// router.get('/single-gift/:giftId',requireLogin,gift_controller.single_gift)

// //Get a single service
// router.get('/single-service/:serviceId',requireLogin,service_controller.single_service)

// //Get a single beloved
// router.get('/single-beloved/:belovedId',requireLogin,beloved_controller.single_beloved)

// //Make request for a gift offered in your family
// router.put('/gift-request',requireLogin,gift_controller.gift_request)

// //Make request for a service offered in your family
// router.put('/service-request',requireLogin,service_controller.service_request)

// //Make request for a beloved offered in your family
// router.put('/beloved-request',requireLogin,beloved_controller.beloved_request)

// //Accept a members request for a gift
// router.put('/accept-gift-request',requireLogin,gift_controller.accept_gift_request)

// //Accept a members request for a service
// router.put('/accept-service-request',requireLogin,service_controller.accept_service_request)

// //Accept a members request for a beloved
// router.put('/accept-beloved-request',requireLogin,beloved_controller.accept_beloved_request)


// //End request for a gift
// router.put('/end-gift-request',requireLogin,gift_controller.end_gift_request)

// //End request for a service
// router.put('/end-service-request',requireLogin,service_controller.end_service_request)

// //End request for a beloved
// router.put('/end-beloved-request',requireLogin,beloved_controller.end_beloved_request)


module.exports = router