const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const businessSchema = new mongoose.Schema({
    businessName:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    state:{
        type:String,
        required:true
    },
    LGA:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isSubscribed:{
        type:String,
        default: "normal",
        enum: ["normal", "premium", "diamond"]
    },
    password:{
        type:String,
       
    },
    photo:{
        type:String,
        default:"https://res.cloudinary.com/jossyjoe/image/upload/v1606258324/UserIcon_tmu1v6.jpg"
    },
    phone:{
        type:String,
        required:true
    },
    coverVideo:{
        type:String,
        default:"https://res.cloudinary.com/jossyjoe/image/upload/v1606258324/UserIcon_tmu1v6.jpg"
    },
    description:{
        type:String,
        required:true
    },
    facebookPage:{
        type:String,
    },
    instagramPage:{
        type:String,
    },
    twitterPage:{
        type:String,
    },
    linkedInPage:{
        type:String,
    },
    website:{
        type:String,
    },
    transactions:[{type:ObjectId,ref:"User"}],
    rating:[{
        type:Number,
    }],
   subscribers:[{type:ObjectId,ref:"User"}],
   timestamp: { type: Date, 'default': Date.now }
   
})

module.exports = mongoose.model("Business", businessSchema);