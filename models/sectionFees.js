const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const sectionFeeSchema = new mongoose.Schema({
    section:{
        type:String,    
    },
    feeInfo:{
        registration:{ type: Number},
        schoolFees:{ type: Number},
        maleUniform:{type: Number},
        femaleUniform:{type: Number},
        textBooks:{ type: Number},
        schBus:{ type: Number},
        // maleTotal:{type: Number},
        // femaleTotal:{type: Number}
    },

},{
    timestamps: true
})

module.exports = mongoose.model("SectionFee", sectionFeeSchema);