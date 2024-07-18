const express = require('express');
const router = express.Router();
const axios = require('axios');

const user_controller = require('../controllers/users');

//GET index page. 
router.get('/', async function (req, res) {
  // res.json('Hello! welcome to Beloved Dais');

  const response = await axios.get('https://afcs-app.onrender.com');
  console.log(response.data)

  // Send the response from the external API back to the client
  res.status(200).json(response.data);

});

module.exports = router;