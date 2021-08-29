const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const familySchema = new mongoose.Schema({
    familyName:{
        type:String,
        required:true
    },
    purpose:{
        type:String,
       
    },
    members:[{
        role:{
            type:String,
            default: "member",
            enum: ["member", "admin", "super-admin"]
        },
        member:{type:ObjectId,ref:"User"},
        timestamp: { type: Date, 'default': Date.now }
    }],
   
    photo:{
        type:String,
        default:"https://res.cloudinary.com/jossyjoe/image/upload/v1606258324/UserIcon_tmu1v6.jpg"
    },
    expectedGifts:[],
    expectedServices:[],
    gifts:[
        {type:ObjectId,ref:"Gift"}
    ],
    beloved:[
        {type:ObjectId,ref:"Beloved"}
    ]
 
    // notification:[{
    //     seen:{type: Boolean, 'default':false},
    //     notificationType:{type:String},
    //     accepted:{type: Boolean, 'default':false},
    //     rated:{type: Boolean, 'default':false},
    //     sender:{type:String},
    //     senderBusinessId:{type:String},
    //     senderId:{type:String},
    //     phone:{type:String},
    //     timestamp:{type:Date, 'default':Date.now },
    //     notice:{}
    // }],
    // myFamilies:[{type:ObjectId,ref:"Family"}],
    // //following:[{type:ObjectId,ref:"User"}]
},
{
    timestamps: true
})

module.exports = mongoose.model("Family", familySchema);