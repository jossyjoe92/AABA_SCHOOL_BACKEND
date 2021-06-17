const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin')
const business_controller = require('../controllers/business');
const ads_controller = require('../controllers/ads');

//GET index page. 
router.get('/', function(req, res) {
  res.json('Hello! welcome to Sangere');
});

//Get ProductBy Categories
router.get('/post/:subcategory',ads_controller.Product_category)

//Get A Single Item
router.get('/singlepost/:id',ads_controller.single_post)

//Search For item
router.post('/search-ads',ads_controller.search_ads)

//Search result For a ad query
router.get('/search-ads/:query',ads_controller.search_ads)


//Get A registered Business profile
router.get('/businessprofile/:id',business_controller.business_profile)


module.exports = router;