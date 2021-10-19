const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// const multer = require('multer')
// const upload = multer();

const upload = require("../utils/multer");

const service_controller = require('../controllers/serviceController');
const family_controller = require('../controllers/familyController');
const gift_controller = require('../controllers/giftController');
const beloved_controller = require('../controllers/belovedController')
const requireLogin = require('../middleware/requireLogin')
// const checkRole = require('../middleware/checkRole')

//Create a new Family
router.post('/new-family',requireLogin,family_controller.new_family)

//Create a new Gift
router.post('/new-gift',requireLogin,upload.single('uploaded_file'),gift_controller.new_gift)

//Create a new Service
router.post('/new-service',requireLogin,upload.single('uploaded_file'),service_controller.new_service)

//Create a new Beloved
router.post('/new-beloved',requireLogin,upload.single('uploaded_file'),beloved_controller.new_beloved)

//Get a user's family list
router.get('/myfamilies',requireLogin,family_controller.my_families)

//Get a single family
router.get('/family/:id',requireLogin,family_controller.single_family)

//Get gifts in a family
router.get('/family-gifts/:familyId',requireLogin,family_controller.all_gifts)

//Get services in a family
router.get('/family-services/:familyId',requireLogin,family_controller.all_services)

//Get all beloved in a family
router.get('/family-beloved/:familyId',requireLogin,family_controller.all_beloved)

//Get a single gift
router.get('/single-gift/:giftId',requireLogin,gift_controller.single_gift)

//Get a single service
router.get('/single-service/:serviceId',requireLogin,service_controller.single_service)

//Get a single beloved
router.get('/single-beloved/:belovedId',requireLogin,beloved_controller.single_beloved)

//Make request for a gift offered in your family
router.put('/gift-request',requireLogin,gift_controller.gift_request)

//Make request for a service offered in your family
router.put('/service-request',requireLogin,service_controller.service_request)

//Make request for a beloved offered in your family
router.put('/beloved-request',requireLogin,beloved_controller.beloved_request)

//Accept a members request for a gift
router.put('/accept-gift-request',requireLogin,gift_controller.accept_gift_request)

//Accept a members request for a service
router.put('/accept-service-request',requireLogin,service_controller.accept_service_request)

//Accept a members request for a beloved
router.put('/accept-beloved-request',requireLogin,beloved_controller.accept_beloved_request)


//End request for a gift
router.put('/end-gift-request',requireLogin,gift_controller.end_gift_request)

//End request for a service
router.put('/end-service-request',requireLogin,service_controller.end_service_request)

//End request for a beloved
router.put('/end-beloved-request',requireLogin,beloved_controller.end_beloved_request)


module.exports = router