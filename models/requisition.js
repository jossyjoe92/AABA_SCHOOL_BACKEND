const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const requisitionSchema = new mongoose.Schema({
    name:{
        type:String,    
    },
    schoolYear:{
        type:Number,
    },
    term:{
        type:Number,
    },
    date:{type:Date},
    items:[],
    requisitionYear: { type: Number },//This is to enable d accountant query by current year not sch. calendar yr
    month:{type:Number}
})

module.exports = mongoose.model("Requisition", requisitionSchema);