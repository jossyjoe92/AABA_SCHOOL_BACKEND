const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
       
    },
    phone:{
        type:String,
         required:true
    },
    DOB:{
         type: Date
    },
    Bio:{
        type:String,
    },
    gender:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default: "user",
        enum: ["user", "admin", "super-admin"]
    },
    photo:{
        type:String,
        default:"https://res.cloudinary.com/jossyjoe/image/upload/v1606258324/UserIcon_tmu1v6.jpg"
    },
 
    notification:[{
        seen:{type: Boolean, 'default':false},
        notificationType:{type:String},
        accepted:{type: Boolean, 'default':false},
        rated:{type: Boolean, 'default':false},
        sender:{type:String},
        senderBusinessId:{type:String},
        senderId:{type:String},
        phone:{type:String},
        timestamp:{type:Date, 'default':Date.now },
        notice:{}
    }],
    myFamilies:[{type:ObjectId,ref:"Family"}],
    //following:[{type:ObjectId,ref:"User"}]
},
{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);