const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const attendanceRegisterSchema = new mongoose.Schema({
    year: {
        type: Number,
    },
    term: {
        type: Number,
    },

    attendance:[],
    studentDetails:{
        type:ObjectId,
        ref:'Student'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("AttendanceRegister", attendanceRegisterSchema);