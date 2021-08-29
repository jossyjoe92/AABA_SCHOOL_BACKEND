const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const multer = require('multer')
const upload = multer();


const user_controller = require('../controllers/users');
const family_controller = require('../controllers/familyController');
const gift_controller = require('../controllers/giftController');
const beloved_controller = require('../controllers/belovedController')
const requireLogin = require('../middleware/requireLogin')
// const checkRole = require('../middleware/checkRole')

//Create a new Family
router.post('/new-family',requireLogin,family_controller.new_family)

//Create a new Gift
router.post('/new-gift',requireLogin,upload.single('uploaded_file'),gift_controller.new_gift)

//Create a new Beloved
router.post('/new-beloved',requireLogin,upload.single('uploaded_file'),beloved_controller.new_beloved)

//Update User profile
router.put('/update-user',requireLogin,user_controller.update_user_profile)

//Update User Notification
router.put('/editnotification',requireLogin,user_controller.update_user_notification)

//Subscribe to a business
router.put('/subscribe',requireLogin,user_controller.subscribe_business)

//Update User profile photo
router.put('/update_user_photo',requireLogin,user_controller.user_profile_photo)




//confirm users password
router.post('/confirm-password',requireLogin,user_controller.confirm_Password)

//update users password
router.post('/update-password',requireLogin,user_controller.update_Password)


//Get A registered User profile
router.get('/userprofile/:id',requireLogin,user_controller.user_profile)

//Get A single request to edit
router.get('/get-users-request/:id',requireLogin,user_controller.single_Request)

//Get A registered User Notificaions
router.get('/usernotification/:id',requireLogin,user_controller.user_notifications)



//A User is updating his request
router.put('/update-request/:id',requireLogin,user_controller.update_request)

//A Business is making an offer for a users request
router.put('/post-offer/:id',requireLogin,user_controller.offer_for_request)

//Delete a registered user request
router.delete('/delete-request/:id',requireLogin,user_controller.delete_request)

module.exports = router