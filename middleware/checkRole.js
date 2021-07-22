const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = roles => (req,res,next)=>{
  
  if(roles.includes(req.user.role)){
      return next();
  }
  return res.status(401).json({error:'Un-Authorized'})
}