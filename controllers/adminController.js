const User = require('../models/user')
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
            const users =await User.find({})
          .sort({timestamp: -1})
          .limit(limit)
          .skip(skip)
          .select('-password -notification -businessSubscribed')
          // .populate('businessRegistered',"_id businessName ") //phone LGA address isVerified photo rating timestamp
          res.status(200).json({page,size,users:users,showNext,usersCount})
       
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
        //.sort({timestamp: -1})
        .limit(limit)
        .skip(skip)

        res.status(200).json({page,size,reports:reports,showNext,reportCount})
     
  } catch (error) {
      console.log(error)
  }

}

//Get All Businesses
exports.all_businesses = async (req,res)=>{

  try{
      let {page, size} = req.query;
      if(!page) page = 1;
      if (!size) size = 20;
  
      const limit = parseInt(size);
      const skip = (page - 1)* size;

      const businessCount = await Business.countDocuments()

      let next = businessCount/page
      let showNext;
  
      if (next<=size){
        showNext=false;
      }else{
        showNext=true
      }
        const businesses = await Business.find({})
        // .sort({timestamp: -1})
        .limit(limit)
        .skip(skip)
      

        res.status(200).json({page,size,businesses:businesses,showNext,businessCount})
     
  } catch (error) {
      console.log(error)
  }

}