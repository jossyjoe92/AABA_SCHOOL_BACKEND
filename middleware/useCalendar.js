const mongoose = require('mongoose')
const Calendar = require('../models/calendar')

module.exports =  async (req,res,next)=>{
    const calendar = await Calendar.findOne({})
       if(!calendar){
           req.calendar = 'No Calendar created yet'
          return next()
       }
        req.calendar = calendar
        next()
  
}