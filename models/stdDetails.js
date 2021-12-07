const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const studentSchema = new mongoose.Schema({
    firstname: { type: String, trim: true, required: true },
    middlename: { type: String, trim: true },
    lastname: { type: String, trim: true, required: true },
    user: { type:ObjectId,ref:"User", required: true },
    sex:{type:String,
        required:true
    },
    DOB:{
        type: Date,
       // required:true
    },
    section:{
        type:String,
        required:true
    },
    religion:{
        type:String,
        required:true
    },
    stdClass:{
        type:String,
        required:true
    },
    stateOfOrigin:{
        type:String,
        required:true
    },
   
    parentName:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        default:"123456789"
    },
    occupation:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"https://res.cloudinary.com/jossyjoe/image/upload/v1606258324/UserIcon_tmu1v6.jpg"
    },
    // bookList:[],
    notification:[{
        sender:{type:ObjectId,ref:"User"},
        timestamp:{type:String},
        notice:{type:String},
    }],

})

module.exports = mongoose.model("Student", studentSchema);