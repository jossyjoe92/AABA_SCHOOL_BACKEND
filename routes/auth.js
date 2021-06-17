const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')
const auth_controller = require('../controllers/auth');
const {runValidation} = require('../validators/index')
const {userSignupValidator,userLoginValidator} = require('../validators/auth')

router.post('/signup-user', userSignupValidator,runValidation, async (req,res)=>{
    await auth_controller.new_user_signup(req,"user",res)
})

router.post('/signup-admin', async (req,res)=>{
    await auth_controller.new_user_signup(req,"admin",res)
})

router.post('/signup-super-admin', async (req,res)=>{
    await auth_controller.new_user_signup(req,"super-admin",res)
})

//confirm phone verification code
router.post('/verify-phone',auth_controller.confirm_user_phone)

//user Login
router.post('/login-user',userLoginValidator,runValidation, auth_controller.user_login)

////user Forgot password
router.post('/confirm-phone', auth_controller.confirm_user_phone_number)

////user Forgot password
router.post('/update-password', auth_controller.update_user_password)



//Admin login
router.post('/login-admin', async (req,res)=>{

})

//Super Admin Login
router.post('/login-super-admin', async (req,res)=>{

})


module.exports = router;