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

//Update Business Profile photo
exports.user_profile_photo = async (req,res)=>{
    try{
       const updatedUser = await User.findByIdAndUpdate(req.body.Id,{
                $set:{photo:req.body.imgUrl}
            },{new:true})
        
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
        console.log(businessSubscribed)

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
