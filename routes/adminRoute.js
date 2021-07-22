const express = require('express');
const router = express.Router();
const business_controller = require('../controllers/business');
const ad_controller = require('../controllers/ads');
const user_controller = require('../controllers/users');
const admin_controller = require('../controllers/adminController');
const requireLogin = require('../middleware/requireLogin')
const checkRole = require('../middleware/checkRole')

//GET index page. 
router.get('/', function(req, res) {
  res.json('Hello! welcome to Sangere');
});

//Get All Users
router.get('/all-users',requireLogin,checkRole(['admin']),admin_controller.all_users)

//Get Reports
router.get('/reports',requireLogin,checkRole(['admin']),admin_controller.get_reports)


module.exports = router;