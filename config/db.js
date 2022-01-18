const mongoose = require('mongoose')
require('dotenv').config();
const db = process.env.MONGODB_URI || process.env.mongoURI 
// mongoURI 
// ATLAS_URI
 
//Set up mongoose connection
const connectDB = async ()=>{
    
    try{
        await mongoose.connect(db, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        });
        console.log('connected to the database');
    } catch (err) {
        console.error(err.message);
        process.exit(1)
    }
}

module.exports = connectDB