const mongoose = require('mongoose')

const bookListSchema = new mongoose.Schema({
    bookClass:{
        type:String,
        required:true
    },
    list:[],

})

module.exports = mongoose.model("BookList", bookListSchema);