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

      //update Business details

       const business = await Business.findOne({_id:req.user.businessRegistered})
       business.noOfAds = business.noOfAds + 1;
       const updatedBusiness = await business.save()

      res.json({saveAd,message:'Business saved Successfully'})
  } catch (error) {
      console.log(error)
  }

}


//Get post by sub-category
exports.Product_category = async (req,res)=>{
   
  try{
      const post =await Ad.find({subCategory:req.params.subcategory})
      .populate('business',"_id businessName phone LGA address isVerified")
      res.status(200).json(post)
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
     
