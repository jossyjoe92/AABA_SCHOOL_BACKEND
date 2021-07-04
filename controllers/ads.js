const Business = require('../models/business')
const User = require('../models/user')
const Ad = require('../models/ads')
const requireLogin = require('../middleware/requireLogin')


//Register a new Ad
exports.new_Post = async (req,res)=>{

  const {itemName,category,subCategory,specificCategory,remark,description,status,image1,image2,image3,price} = req.body
  if(!itemName||!category||!subCategory||!status||!description||!image1){
      return res.status(422).json({error:'Please add all the fields'})
  }

  try {
     
      const ad = new Ad({
          itemName,
          category,
          subCategory,
          specificCategory,
          remark,
          status,
          description,
          price,
          mainImage:image1,
          secondImage:image2,
          thirdImage:image3,
          postedBy:req.user,
          business:req.user.businessRegistered
          
      })
      const saveAd = await ad.save()

      res.json({saveAd,message:'Ad saved Successfully'})
  } catch (error) {
      console.log(error)
  }

}

//Edit and Update An Ad
exports.edit_ad = async (req,res)=>{

  const {
    itemName,
    category,
    subCategory,
    specificCategory,
    description,
    status,
    remark,
    price,
    mainImage,
    secondImage,
    thirdImage
} = req.body

// if(!Name||!email||!phone||!state||!LGA||!address){
//     return res.status(422).json({error:'Please add all the fields'})
// }
try{
   const updatedAd = await Ad.findByIdAndUpdate(req.params.id,req.body,{new:true})
    
        res.json({Ad:updatedAd,message:'Ad Updated Successfully'})
} catch (error) {
    return res.status(422).json({error:'could not update photo'})
}
}


//Get post by sub-category
exports.Product_category = async (req,res)=>{

  try{

    let {page,specificCategory, size} = req.query;
    if(!page) page = 1;
    if (!size) size = 10;

    const limit = parseInt(size);
    const skip = (page - 1)* size;
    
    //No Specific category specified
    if(!specificCategory){
      const postCount =await Ad.countDocuments({subCategory:req.params.subcategory,})
    
      let next = postCount/page
      let showNext;
  
      if (next<=size){
        showNext=false;
      }else{
        showNext=true
      }
        const post =await Ad.find({subCategory:req.params.subcategory})
        .limit(limit)
        .skip(skip)
        .populate('business',"_id businessName phone LGA address isVerified")
        res.status(200).json({page,size,post:post,showNext})

    }else{//specific category specified
      const postCount =await Ad.countDocuments({subCategory:req.params.subcategory,specificCategory})
    
      let next = postCount/page
      let showNext;
  
      if (next<=size){
        showNext=false;
      }else{
        showNext=true
      }
        const post =await Ad.find({subCategory:req.params.subcategory,specificCategory})
        .limit(limit)
        .skip(skip)
        .populate('business',"_id businessName phone LGA address isVerified")
        res.status(200).json({page,size,post:post,showNext})
    }
  
     

  } catch (error) {
      console.log(error)
  }

}

//Get a single post
exports.single_post = async (req,res)=>{
   
  try{
      const post =await Ad.findOne({_id:req.params.id})
      .populate('business',"_id businessName phone LGA address isVerified photo rating timestamp")
      .populate('postedBy',"_id")
      post.views = post.views + 1;
      const updatePost  = await post.save()
       res.status(200).json(updatePost)
  } catch (error) {
      console.log(error)
  }

}

//search
exports.search_ads = async (req,res)=>{
    // let userPattern = new RegExp("^"+req.body.query)
    
     const searchKeyword = req.body.query
     ? {
         itemName: {
           $regex: req.body.query,
           $options: 'i',
         },
       }
     : req.params.query?{
      itemName: {
        $regex: req.params.query,
        $options: 'i',
      },
     }:{};
  
     try{
        const ads = await Ad.find( {...searchKeyword })
        .populate('business',"_id businessName phone LGA address isVerified photo rating timestamp")
          res.json({ads})
     } catch (err) {
      console.log(err)
     }
     
    }
    
    // A user Is making an offer for a product
exports.post_offer_request = async (req,res)=>{
  // console.log(req.params.id,req.body)
  try {
    const notification = {
      sender:`${req.user.firstname}  ${req.user.lastname}`,
      notificationType:'offer',
      phone:req.user.phone,
      senderId:req.user._id,
      notice:{
        postId:req.params.id,
        business:req.body.business,
        businessId:req.body.businessId,
        itemName:req.body.itemName,
        image:req.body.mainImage,
  
      }
  }
   await User.findByIdAndUpdate(req.body.postedBy,{
      $push:{notification}
  },{
      new:true
  })
 
  res.status(200).json({message:'Your offer was sent successfully.'})
  } catch (error) {
    console.log(error)
  }

}

//Send user notification of accepted offer
exports.accept_offer_request = async (req,res)=>{

  try {
    const notification = {
      sender:req.body.business,
      senderBusinessId:req.body.businessId,
      notificationType:'accepted_offer',
      // phone:req.user.phone,
      senderId:req.user._id,
      notice:{
        image:req.body.image,
      }
  }
  //send notification to user that made offer
   await User.findByIdAndUpdate(req.body.senderId,{
      $push:{notification}
  },{
      new:true
  })

  // Update current user notification acceptance

    const updatedUserNotification = await User.findOne(req.user._id)
    for (let i = 0; i<updatedUserNotification.notification.length;i++){
   
        if(updatedUserNotification.notification[i]._id==req.body.notificationId){
             updatedUserNotification.notification[i].accepted=true   
             
        }
    }
    updatedUserNotification.save()
    res.status(200).json({message:'Offer accepted successfully.'})
    
  } catch (error) {
    console.log(error)
  }

}