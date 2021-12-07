const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
    section:{
        type:String,
        required:true
    },
    subjects:[]
})

module.exports = mongoose.model("Subject", subjectSchema);