const Business = require('../models/business')
const User = require('../models/user')
const Ad = require('../models/ads')
const requireLogin = require('../middleware/requireLogin')

//Get User Profile
exports.user_profile = async (req,res)=>{
    try{
        const user =await User.find({_id:req.params.id})
        .select('-password')
        .populate('businessRegistered',"_id businessName ") //phone LGA address isVerified photo rating timestamp
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
  
}