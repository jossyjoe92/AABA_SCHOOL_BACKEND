const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
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
    businessRegistered:{
      type:ObjectId,
        ref:'Business'
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
    businessSubscribed:[{type:ObjectId,ref:"Business"}],
    //followers:[{type:ObjectId,ref:"User"}],
    //following:[{type:ObjectId,ref:"User"}]
},
{
    timestamps: true
})

// userSchema.pre('save', async function (next) {
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt)
//     next();
// })

module.exports = mongoose.model("User", userSchema);