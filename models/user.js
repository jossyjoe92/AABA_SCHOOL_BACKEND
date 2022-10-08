const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
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
        default: "student",
       enum: ["student","staff", "accountant","admin", "super-admin"] 
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

},
{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);