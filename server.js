const express = require('express');
const mongoose = require('mongoose')
const connectDB = require('./config/db');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
// const businessRouter = require('./routes/business');
const adminRouter = require('./routes/adminRoute');
const usersRouter = require('./routes/usersRoute');

require('dotenv').config();
const cors = require('cors');


const PORT = process.env.PORT || 5000;
connectDB();
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/api', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/users', usersRouter);


app.listen(PORT, ()=>console.log(`server has started on port ${PORT}`));
