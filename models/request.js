const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const requestSchema = new mongoose.Schema({
    itemName:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },

    location:{
        type:String,
    },

    offers:[{
        business:{type:ObjectId,ref:"Business"},
    }],
  
    postedBy:{
        type:ObjectId,
        ref:'User'
    },
    timestamp: { type: Date, 'default': Date.now }
})

module.exports = mongoose.model("Request", requestSchema);