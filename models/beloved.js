const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const belovedSchema = new mongoose.Schema({
    itemTitle:{
        type:String,
        required:true
    },
    postedBy:{type:ObjectId,ref:"User"},
    postedByAlias:{type:String},
    description:{
        type:String,
    },
    family:{
        type:ObjectId,ref:"Family"
    },
    photo:{
        type:String,
        default:"https://res.cloudinary.com/jossyjoe/image/upload/v1606258324/UserIcon_tmu1v6.jpg"
    },
    blovedRequest: [{
        reason: String,
        alias: String,
        postedBy: { type: ObjectId, ref: "User" },
        requestAccepted: { type: Boolean, 'default': false },
        timestamp: { type: Date, 'default': Date.now }
    }],

    requestedBy: [{ type: ObjectId, ref: "User" }],// All who requested 4 d service

    givenOut: { type: Boolean, 'default': false }, // Has d service been delivered
    recievedBy:[ { type: ObjectId, ref: "User" }]// who are d members dat were offered d service
 
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

module.exports = mongoose.model("Beloved", belovedSchema);