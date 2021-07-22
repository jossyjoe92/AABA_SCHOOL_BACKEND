const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const reportSchema = new mongoose.Schema({
    itemName:{
        type:String,
        required:true
    },
    adId:{type:ObjectId,ref:"Ads"},
    reportedBy:{type:ObjectId,ref:"User"},
    reportComment:{
        type:String,
    },
    reportReason:{
        type:String,
    },
    mainImage:{
        type:String,  
    },
},
    {
        timestamps: true
    
})

module.exports = mongoose.model("Report", reportSchema);