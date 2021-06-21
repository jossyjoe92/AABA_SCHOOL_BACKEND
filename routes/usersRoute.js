const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')

const business_controller = require('../controllers/business');
const ads_controller = require('../controllers/ads');
const user_controller = require('../controllers/users');
const requireLogin = require('../middleware/requireLogin')

//Register a new Business
router.post('/newbusiness',requireLogin,business_controller.new_business)

//Update Business profile.
router.put('/editbusiness',requireLogin,business_controller.edit_business_profile)


//Update Business profile cover photo
router.put('/updatebusinesscoverphoto',requireLogin,business_controller.business_cover_photo)

//Update User profile
router.put('/update-user',requireLogin,user_controller.update_user_profile)


//Subscribe to a business
router.put('/subscribe',requireLogin,user_controller.subscribe_business)

//Update User profile photo
router.put('/update_user_photo',requireLogin,user_controller.user_profile_photo)

//Post a New Product
router.post('/newpost',requireLogin,ads_controller.new_Post)

//Get A Single ad to edit
router.get('/singlepost/:id',ads_controller.single_post)

//UPDATE A Single ad 
router.put('/edit-ad/:id',ads_controller.edit_ad)


//Get A registered User profile
router.get('/userprofile/:id',user_controller.user_profile)








//Get a single business profile
//router.get('/:id',requireLogin,business_controller.business_profile)

module.exports = router