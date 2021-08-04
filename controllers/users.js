const User = require('../models/user')
const requireLogin = require('../middleware/requireLogin')
const bcrypt = require('bcryptjs')

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

//Comfirm user password for change
exports.confirm_Password = async (req,res)=>{
    const {password} = req.body;
    try {

        const user = await User.findOne({_id:req.user._id})
      
        if(!user){
           
            return res.status(422).json({error:'Invalid email or password'})
         }
 
         const passwordMatch = await bcrypt.compare(password,user.password)
             //Check if password match
         if(passwordMatch){ 

             res.json({success:true})
             
         }else{
                //  password does not match
                 return res.status(422).json({success:false})
             }
    } catch (error) {
        console.log(error)
    }
  
}

//User Forgot Password. Confirm User Phone Number

exports.update_Password = async (req,res)=>{

    const {password} = req.body;

    try {

        const hashedPasssword =await bcrypt.hash(password,12)

         await User.findOneAndUpdate({_id:req.user._id},{
            $set:{password:hashedPasssword}
        },{
            new:true
        })
      
        res.status(200).json({message:'Password Updated Successfully'})  

    } catch (error) {
        console.log(error)
        res.json({error:'Password Update was unSuccessfully'})  
    }
 
}

//Update User Profile
exports.update_user_profile = async (req,res)=>{

    const updateUserProfile = {
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        phone:req.body.phone,
        email:req.body.email,
        DOB:req.body.DOB,
        Bio:req.body.bio,
        gender:req.body.gender,
        
    }
    try{
       const updatedUser = await User.findByIdAndUpdate(req.user._id,updateUserProfile,{new:true})
        
            res.json({user:updatedUser})
    } catch (error) {
        return res.status(422).json({error:'could not update photo'})
    }
  
}

//Get User Notification
exports.user_notifications = async (req,res)=>{

    try{
        const notifications =await User.findOne({_id:req.params.id})
        .select('_id notification')
        res.status(200).json(notifications)
    } catch (error) {
        console.log(error)
    }
  
}

//Update User Notification
exports.update_user_notification = async (req,res)=>{

    try{
       const updatedUserNotification = await User.findOne(req.user._id)
       for (let i = 0; i<updatedUserNotification.notification.length;i++){
           if(updatedUserNotification.notification[i].seen===false){
                updatedUserNotification.notification[i].seen=true          
           }
       }
       updatedUserNotification.save()
        res.status(200).json({message:'update successful'})
    } catch (error) {
        return res.status(422).json({error:'could not update photo'})
    }
  
}

//Update User Profile photo
exports.user_profile_photo = async (req,res)=>{
    try{
       const updatedUser = await User.findByIdAndUpdate(req.body.Id,{
                $set:{profileImage:req.body.imgUrl}
            },{new:true})
            .select('-password')
        
            res.json(updatedUser)
    } catch (error) {
        return res.status(422).json({error:'could not update photo'})
    }
  
}


//Subscribe to a business
exports.subscribe_business = async (req,res)=>{

    try{
        await Business.findByIdAndUpdate(req.body.subscribeId,{
        $push:{
            subscribers:req.user._id
        }
       }, {
        new:true
    })
    const businessSubscribed = await User.findByIdAndUpdate(req.user._id,{
            $push:{
                businessSubscribed:req.body.subscribeId
            }
        },{
            new:true
        }).select("-password")

        res.status(200).json(businessSubscribed)
    //     .select("-password")
    //     .then(result=>{
    //         res.json(result)
    //     }).catch(err=>{
    //         return res.status(422).json({error:err})
    //     })
    // })
} catch (error) {
    console.log(error)
    return res.status(422).json({error:error})
    }

    
}

//Register a new Request
exports.new_Request = async (req,res)=>{

    const {itemName,category,description,LGA,price} = req.body
    if(!itemName||!category||!LGA||!description){
        return res.status(422).json({error:'Please add all the fields'})
    }
  
    try {
       
        const request = new Request({
            itemName,
            category,
            location:LGA,
            description,
            price,
            postedBy:req.user,
        })
        await request.save()
  
        res.json({message:'Your request have been sent Successfully'})
    } catch (error) {
        console.log(error)
    }
  
  }

  //Get post by sub-category
exports.Get_Users_Requests = async (req,res)=>{

    try{
      let {page, size} = req.query;
      if(!page) page = 1;
      if (!size) size = 5;
  
      const limit = parseInt(size);
      const skip = (page - 1)* size;
      
        const requestCount =await Request.countDocuments({})
      
        let next = requestCount/page
        let showNext;
    
        if (next<=size){
          showNext=false;
        }else{
          showNext=true
        }
          const requests =await Request.find({})
          .sort({timestamp: -1})
          .limit(limit)
          .skip(skip)
          .populate('postedBy',"_id")
          res.status(200).json({page,size,requests:requests,showNext}) 
  
    } catch (error) {
        console.log(error)
    }
  
  }


  exports.single_Request = async (req,res)=>{
    
    try {
      const request = await Request.findOne({_id:req.params.id})
     
        res.json(request)
    } catch (error) {
        console.log(error)
    }
  
  }
  //Update a Request
  exports.update_request = async (req,res)=>{

    const {
        itemName,
        category,
        description,
        price,
        location:LGA
    } = req.body;
  
    try {
     
      const updatedRequest = await Request.findByIdAndUpdate(req.params.id,req.body,{new:true})

        res.json({updatedRequest:updatedRequest,message:'Your request have been updated Successfully'})
    } catch (error) {
        console.log(error)
    }
  
  }

 
  exports.offer_for_request = async (req,res)=>{
      const {itemName,postedBy} = req.body
      try {
        await Request.findByIdAndUpdate(req.params.id,{
            $push:{
                offers:req.user.businessRegistered
            }
           }, {
            new:true
        })

        const businessDetails = await Business.findOne({_id:req.user.businessRegistered})
      
        const notification = {
            sender:businessDetails.businessName,
            senderBusinessId:req.user.businessRegistered,
            notificationType:'offer_for_request',
            // phone:req.user.phone,
            senderId:req.user._id,
            notice:{
                image:businessDetails.photo,
              itemName,
            }
        }
        //send notification to user about offer
         await User.findByIdAndUpdate(postedBy,{
            $push:{notification}
        },{
            new:true
        })
        res.status(200).json({message:'Offer submited successfully'})
      } catch (error) {
          
      }

  }

  //Delete a Request
exports.delete_request = async (req,res)=>{
  
    try {
      const request = await Request.findByIdAndDelete(req.params.id)
        res.json({request:request,message:'Your request have been deleted Successfully'})
    } catch (error) {
        console.log(error)
    }
  
  }
 