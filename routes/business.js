const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')

const business_controller = require('../controllers/business');
const requireLogin = require('../middleware/requireLogin')

//Register a new Business
router.post('/newbusiness',requireLogin,business_controller.new_business)

//Get a single business profile
//router.get('/:id',requireLogin,business_controller.business_profile)

module.exports = router