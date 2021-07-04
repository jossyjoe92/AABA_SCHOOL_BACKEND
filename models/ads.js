const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const adsSchema = new mongoose.Schema({
    itemName:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true
    },
    specificCategory:{
        type:String,
    },
    price:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    remark:{
        type:String,
    },
    mainImage:{
        type:String,
        required:true    
    },
    secondImage:{
        type:String,  
    },
    thirdImage:{
        type:String,      
    },

    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"},
        timestamp: { type: Date, 'default': Date.now }
    }],
    views:{type:Number,default: 0},
    likes:[{type:ObjectId,
        ref:'User'}],
   
    postedBy:{
        type:ObjectId,
        ref:'User'
    },
    business:{
        type:ObjectId,
        ref:'Business'
    },
    timestamp: { type: Date, 'default': Date.now }
})

module.exports = mongoose.model("Ads", adsSchema);