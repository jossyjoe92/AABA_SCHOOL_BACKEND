const Business = require('../models/business')
const User = require('../models/user')
const Ad = require('../models/ads')
const requireLogin = require('../middleware/requireLogin')

//Register a new business
exports.new_business = async (req,res)=>{

    const {businessName,email,state,LGA,address,description,phone,website} = req.body
    if(!businessName||!state||!LGA||!address||!phone){
        return res.status(422).json({error:'Please add all the fields'})
    }

    try {
       
        const business = new Business({
            businessName,
            email,
            state,
            LGA,
            address,
            description,
            phone,
            website,
            
        })
        const saveBusiness = await business.save()

        //update user details

        const user = await User.findByIdAndUpdate(req.user._id,{
            $set:{businessRegistered:saveBusiness._id}
        },{
            new:true
        })
        .select("-password")

        res.json({user,message:'Business saved Successfully'})
    } catch (error) {
        console.log(error)
    }
  
}

//Get Business Profile
exports.business_profile = async (req,res)=>{
    try{
        const business =await Business.find({_id:req.params.id})
        const ads = await Ad.find({business:req.params.id})
        res.status(200).json({business,ads})
    } catch (error) {
        console.log(error)
    }
  
}

//Update Business Profile photo
exports.business_cover_photo = async (req,res)=>{
    try{
       const updatedBusiness = await Business.findByIdAndUpdate(req.body.Id,{
                $set:{photo:req.body.imgUrl}
            },{new:true})
        
            res.json(updatedBusiness)
    } catch (error) {
        return res.status(422).json({error:'could not update photo'})
    }
  
}



//Update User Business Profile
exports.edit_business_profile = async (req,res)=>{

    const {
        businessName,
        phone,
        email,
        description,
        website,
        state,
        LGA,
        address
    } = req.body

    if(!businessName||!email||!phone||!state||!LGA||!address){
        return res.status(422).json({error:'Please add all the fields'})
    }
    try{
       const updatedBusiness = await Business.findByIdAndUpdate(req.user.businessRegistered,req.body,{new:true})
        
            res.json({business:updatedBusiness,message:'Business Updated Successfully'})
    } catch (error) {
        return res.status(422).json({error:'could not update photo'})
    }
  
}



