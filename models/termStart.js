const mongoose = require('mongoose')

const termStartSchema = new mongoose.Schema({
    termStart: { type: Date },

})

module.exports = mongoose.model("TermStart", termStartSchema);