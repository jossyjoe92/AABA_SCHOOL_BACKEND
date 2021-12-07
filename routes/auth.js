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
const checkRole = require('../middleware/checkRole')

router.post('/signup-student',requireLogin,checkRole(['super-admin','admin']), userSignupValidator,runValidation, async (req,res)=>{
    await auth_controller.new_user_signup(req,"student",res)
})

router.post('/signup-staff',userLoginValidator,runValidation, async (req,res)=>{
    await auth_controller.new_user_signup(req,"staff",res)
})

router.post('/signup-account', async (req,res)=>{
    await auth_controller.new_user_signup(req,"accountant",res)
})

router.post('/signup-admin',requireLogin,checkRole(['super-admin']), async (req,res)=>{
    await auth_controller.new_user_signup(req,"admin",res)
})

router.post('/signup-super-admin', async (req,res)=>{
    await auth_controller.new_user_signup(req,"super-admin",res)
})

// //confirm staff 
// router.post('/confirm-staff',requireLogin,checkRole(['super-admin','admin']),auth_controller.confirm_staff)

//user Login
router.post('/login-user',userLoginValidator,runValidation, auth_controller.user_login)


//Admin login
router.post('/login-admin', async (req,res)=>{

})

//Super Admin Login
router.post('/login-super-admin', async (req,res)=>{

})


module.exports = router;