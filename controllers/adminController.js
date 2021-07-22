const Business = require('../models/business')
const User = require('../models/user')
const Ad = require('../models/ads')
const Report = require('../models/report')
const Request = require('../models/request')
const requireLogin = require('../middleware/requireLogin')


//Get All Users
exports.all_users = async (req,res)=>{
    try{
        let {page, size} = req.query;
        if(!page) page = 1;
        if (!size) size = 10;
    
        const limit = parseInt(size);
        const skip = (page - 1)* size;

        const usersCount =await User.countDocuments()
    
        let next = usersCount/page
        let showNext;
    
        if (next<=size){
          showNext=false;
        }else{
          showNext=true
        }
            const user =await User.find({})
          .sort({timestamp: -1})
          .limit(limit)
          .skip(skip)
          .select('-password -notification -businessSubscribed')
          .populate('businessRegistered',"_id businessName ") //phone LGA address isVerified photo rating timestamp
          res.status(200).json({page,size,user:user,showNext,usersCount})
       
    } catch (error) {
        console.log(error)
    }
  
}

//Get All Users
exports.get_reports = async (req,res)=>{

  try{
      let {page, size} = req.query;
      if(!page) page = 1;
      if (!size) size = 20;
  
      const limit = parseInt(size);
      const skip = (page - 1)* size;

      const reportCount =await Report.countDocuments()
  
      let next = reportCount/page
      let showNext;
  
      if (next<=size){
        showNext=false;
      }else{
        showNext=true
      }
          const reports =await Report.find({})
        // .sort({timestamp: -1})
        .limit(limit)
        .skip(skip)

        res.status(200).json({page,size,reports:reports,showNext,reportCount})
     
  } catch (error) {
      console.log(error)
  }

}
