const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const salarySchema = new mongoose.Schema({
    grossSalary: {
        type: Number,
    },
    deductions: {
        type: Number,
    },
    netSalary: {
        type: Number,
    },
    comment: {
        type: String,
    },
    paymentMtd: {
        type: String,
    },
    schoolYear: {
        type: Number,
    },
    term: {
        type: Number,
    },
    paymentDate: { type: Date },
    paymentYear: { type: Number },//This is to enable d accountant query by current year not sch. calendar yr
    month: { type: Number },
    staffDetails: {
        type: ObjectId,
        ref: 'Staff'
    }
})

module.exports = mongoose.model("Salary", salarySchema);