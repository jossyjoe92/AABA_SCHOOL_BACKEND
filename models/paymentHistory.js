const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const paymentHistorySchema = new mongoose.Schema({
    section:{
        type:String,    
    },
    stdClass:{
        type:String
    },
    year:{
        type:Number,
    },
    term:{
        type:Number,
    },
    paymentInfo:{
        registration:{ type: Number},
        registrationRemark:{type:String},
        schoolFees:{ type: Number},
        schoolFeesRemark:{type:String},
        uniform:{type: Number},
        uniformRemark:{type:String},
        books:{ type: Number},
        booksRemark:{type:String},
        schBus:{type: Number},
        schBusRemark:{type:String},
        total:{type: Number}      
    },
   
     studentDetails:{
        type:ObjectId,
        ref:'Student'
    },
    timestamp: {type: Date},
    paymentMth:{type:String}
})

module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);