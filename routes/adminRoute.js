const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/users');
const admin_controller = require('../controllers/adminController');
const requireLogin = require('../middleware/requireLogin')
const checkRole = require('../middleware/checkRole')

//GET index page. 
router.get('/', function(req, res) {
  res.json('Hello! welcome to Sangere');
});

// //Get All Users
// router.get('/all-users',requireLogin,checkRole(['super-admin','admin']),admin_controller.all_users)

// //Get All Businesses
// router.get('/all-businesses',requireLogin,checkRole(['super-admin','admin']),admin_controller.all_businesses)

// //Get Reports
// router.get('/reports',requireLogin,checkRole(['super-admin','admin']),admin_controller.get_reports)


module.exports = router;