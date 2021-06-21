const Business = require('../models/business')
const User = require('../models/user')
const Ad = require('../models/ads')
const requireLogin = require('../middleware/requireLogin')


//Register a new Ad
exports.new_Post = async (req,res)=>{

  const {itemName,category,subCategory,remark,description,status,image1,image2,image3,price} = req.body
  if(!itemName||!category||!subCategory||!status||!description||!image1){
      return res.status(422).json({error:'Please add all the fields'})
  }

  try {
     
      const ad = new Ad({
          itemName,
          category,
          subCategory,
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
console.log(req.body.status)
  const {
    itemName,
    category,
    subCategory,
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

    let {page, size} = req.query;
    if(!page) page = 1;
    if (!size) size = 10;

    const limit = parseInt(size);
    const skip = (page - 1)* size;
    const postCount =await Ad.countDocuments({subCategory:req.params.subcategory})
    
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

  } catch (error) {
      console.log(error)
  }

}

//Get a single post
exports.single_post = async (req,res)=>{
   
  try{
      const post =await Ad.find({_id:req.params.id})
      .populate('business',"_id businessName phone LGA address isVerified photo rating timestamp")
      res.status(200).json(post)
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
     
