const express = require('express');
const mongoose = require('mongoose')
const connectDB = require('./config/db');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
// const businessRouter = require('./routes/business');
const adminRouter = require('./routes/adminRoute');
const usersRouter = require('./routes/usersRoute');
const staffRouter = require('./routes/staffRoute');
const paymentRouter = require('./routes/payments');
const schoolCalendar = require('./config/schoolCalendar')
// const cron = require('node-cron');

require('dotenv').config();
const cors = require('cors');


const PORT = process.env.PORT || 5002;
connectDB();
// schoolCalendar();
// cron.schedule('10 6 * * 5', () => {
//     console.log('running a task every Friday');
//     schoolCalendar();
//   });
const app = express();

app.use(cors())
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended:false}));


app.use('/', indexRouter);
app.use('/api', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/staff', staffRouter);
app.use('/api/users', usersRouter);


app.listen(PORT, ()=>console.log(`server has started on port ${PORT}`));
