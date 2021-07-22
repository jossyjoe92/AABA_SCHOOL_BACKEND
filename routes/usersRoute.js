const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')

const business_controller = require('../controllers/business');
const ads_controller = require('../controllers/ads');
const user_controller = require('../controllers/users');
const requireLogin = require('../middleware/requireLogin')
const checkRole = require('../middleware/checkRole')

//Register a new Business
router.post('/newbusiness',requireLogin,checkRole(['users']),business_controller.new_business)

//Update Business profile.
router.put('/editbusiness',requireLogin,business_controller.edit_business_profile)

//Update Business profile cover photo
router.put('/updatebusinesscoverphoto',requireLogin,business_controller.business_cover_photo)

//Update User profile
router.put('/update-user',requireLogin,user_controller.update_user_profile)

//Update User Notification
router.put('/editnotification',requireLogin,user_controller.update_user_notification)

//Subscribe to a business
router.put('/subscribe',requireLogin,user_controller.subscribe_business)

//Update User profile photo
router.put('/update_user_photo',requireLogin,checkRole(['user']),user_controller.user_profile_photo)

//Post a New AD
router.post('/newpost',requireLogin,ads_controller.new_Post)

//Post a New Request
router.post('/makerequest',requireLogin,user_controller.new_Request)

//confirm users password
router.post('/confirm-password',requireLogin,user_controller.confirm_Password)

//update users password
router.post('/update-password',requireLogin,user_controller.update_Password)

//post a report 
router.post('/postreport',requireLogin,ads_controller.post_report)

//Get A registered User profile
router.get('/userprofile/:id',requireLogin,user_controller.user_profile)

//Get A single request to edit
router.get('/get-users-request/:id',requireLogin,user_controller.single_Request)

//Get A Single ad to edit
router.get('/singlepost/:id',requireLogin,ads_controller.single_post)

//Get A registered User Notificaions
router.get('/usernotification/:id',requireLogin,user_controller.user_notifications)

//UPDATE A Single ad 
router.put('/edit-ad/:id',requireLogin,ads_controller.edit_ad)

//A Registered user makes offer for an item
router.put('/makeoffer/:id',requireLogin,ads_controller.post_offer_request)

//A Registered Business Accepts offer for an item
router.put('/acceptoffer',requireLogin,ads_controller.accept_offer_request)

//A User is rating a business
router.put('/businessrating',requireLogin,business_controller.business_rating)

//A User is updating his request
router.put('/update-request/:id',requireLogin,user_controller.update_request)

//A Business is making an offer for a users request
router.put('/post-offer/:id',requireLogin,user_controller.offer_for_request)

//Delete a registered user request
router.delete('/delete-request/:id',requireLogin,user_controller.delete_request)

module.exports = router