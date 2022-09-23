const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const quizSchema = new mongoose.Schema({
   year:{
    type:Number,
   },
   term:{
    type:Number,
   },
    questions:[],
    stdClass:{
        type:String
    },
    subject:{
        type:String
    },
 
    week:{
        type:String
    },
    submissionInfo:[{
        score:{ type:String},
        submittedBy:{type:ObjectId,ref:"Student"},
        timestamp: { type: Date, 'default': Date.now }
    }],
   
     deadline:{
        type:String
    },
 
},{
    timestamps: true
})

module.exports = mongoose.model("Quiz", quizSchema);