const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')

const business_controller = require('../controllers/ads');
const requireLogin = require('../middleware/requireLogin')


// //Search For token
// router.post('/search-ads',business_controller.search_ads)

module.exports = router;