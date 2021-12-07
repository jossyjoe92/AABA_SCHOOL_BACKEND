const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const resultSchema = new mongoose.Schema({
   year:{
    type:Number,
   },
   term:{
    type:Number,
   },
    scores:[],
    class:{
        type:String
    },
    total:{
        type:Number,
        default:0
    },
    average:{
        type:Number,
        default:0
        
    },
    grade:{
        type:String
    },
     scale:{
        type:String
    },
    teacherComment:{
        teacherName:{type:String},
        comment:{type:String},
    },
    hmComment:{
        hmName:{type:String},
        comment:{type:String},
    },
    stdAttendance:{
        schOpened:{type:Number},
        present:{type:Number},
    },
    psychomoto:{
            attentiveness:{type:String},
            honesty:{type:String},
            politeness:{type:String},
            neatness:{type:String},
            punctuality:{type:String},
            selfControl:{type:String},
            obedience:{type:String},
            reliability:{type:String},
            responsibility:{type:String},
            relationship:{type:String}
        
    },
    studentDetails:{
        type:ObjectId,
        ref:'Student'
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Result", resultSchema);