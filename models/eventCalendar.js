const mongoose = require('mongoose')
const schoolEventCalendarSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true
    },
    term: {
        type: Number,
        required: true
    },
    events: [{
        week: {
            type: String,
            required: true
        },
        date: {
            type: String,
        }, 
        activity: {
            type: String,
        },
    }
       
    ]


})

module.exports = mongoose.model("SchoolEventCalendar", schoolEventCalendarSchema);