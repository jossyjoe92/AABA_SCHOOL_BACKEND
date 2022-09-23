const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const weeklyPerformanceSchema = new mongoose.Schema({
    year: {
        type: Number,
    },
    term: {
        type: Number,
    },
    week:{
        type:String
    },

    academicPerformance:[],
    psychomoto:[],
    teacherComment:{
        teacherName:{type:String},
        comment:{type:String},
    },

    studentDetails:{
        type:ObjectId,
        ref:'Student'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("WeeklyPerformance", weeklyPerformanceSchema);