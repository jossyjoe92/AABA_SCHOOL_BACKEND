const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/users');

//GET index page. 
router.get('/', function(req, res) {
  res.json('Hello! welcome to Beloved Dais');
});

module.exports = router;