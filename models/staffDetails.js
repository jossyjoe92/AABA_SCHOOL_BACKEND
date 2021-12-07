const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const staffSchema = new mongoose.Schema({

    firstname: { type: String, trim: true},
    middlename: { type: String, trim: true },
    lastname: { type: String, trim: true },
    user: { type:ObjectId,ref:"User", required: true },

    sex: {
        type: String,
       
    },
    DOB: {
        type: Date,
        // required:true
    },
    // position: {
    //     type: String
    // },
    classTeacher: {
        type: String,
    },
    stateOfOrigin: {
        type: String,
    
    },
    email: {
        type: String,
     
    },
    phone: {
        type: String,
        default: "123456789"
    },
    photo: {
        type: String,
        default: "https://res.cloudinary.com/jossyjoe/image/upload/v1606258324/UserIcon_tmu1v6.jpg"
    },

    maritalStatus: {
        type: String,
    },
    salary: {
        type: String,
    },
   
    notification: [{
        //sender:{type:ObjectId,ref:"User"},
        timestamp: { type: String },
        notice: { type: String },
    }],
    // students: [{ type: ObjectId, ref: "Student" }],

})


module.exports = mongoose.model("Staff", staffSchema);