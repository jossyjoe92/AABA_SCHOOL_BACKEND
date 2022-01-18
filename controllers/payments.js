const Payment = require('../models/payments');
const StudentDetails = require('../models/stdDetails');
const PaymentHistory = require('../models/paymentHistory')
const SectionFees = require('../models/sectionFees');
const stdDetails = require('../models/stdDetails');

//Get All payments by date
exports.payment_date = async (req, res) => {
    const { date } = req.params
    const { stdClass } = (req.query)

    try {
        if (!stdClass) {
            const paymentdetails = await PaymentHistory.find({ timestamp: date })
                .populate('studentDetails', "_id firstname middlename lastname stdClass")
            res.status(200).json(paymentdetails)
        } else {
            const paymentdetails = await PaymentHistory.find({ timestamp: date, stdClass })
                .populate('studentDetails', "_id firstname middlename lastname stdClass")
            res.status(200).json(paymentdetails)
        }
    } catch (error) {
        console.log(error)
    }

}

//Get All payments by Month
exports.payment_by_month = async (req, res) => {
    const { month } = req.params
    const { stdClass } = (req.query)
    const year = new Date().getFullYear()
    try {
        if (!stdClass) {
            const paymentdetails = await PaymentHistory.find({ paymentYr: year, paymentMth: month })
                .populate('studentDetails', "_id firstname middlename lastname stdClass")
            res.status(200).json(paymentdetails)
        } else {
            const paymentdetails = await PaymentHistory.find({ paymentYr: year, paymentMth: month, stdClass })
                .populate('studentDetails', "_id firstname middlename lastname stdClass")
            res.status(200).json(paymentdetails)
        }
    } catch (error) {
        console.log(error)
    }

}


//Get All payments made in a Term
exports.payment_by_term = async (req, res) => {
    const { term } = req.params
    const { stdClass, year } = (req.query)//Year is school session
    try {
        if (!stdClass) {
            const paymentdetails = await PaymentHistory.find({ year, term })
                .populate('studentDetails', "_id firstname middlename lastname stdClass")
            console.log(paymentdetails)
            res.status(200).json(paymentdetails)
        } else {
            const paymentdetails = await PaymentHistory.find({ year, term, stdClass })
                .populate('studentDetails', "_id firstname middlename lastname stdClass")
            res.status(200).json(paymentdetails)
        }
    } catch (error) {
        console.log(error)
    }

}

//Get payments Required for a section
exports.section_fee = async (req, res) => {
    const { section } = req.params

    try {

        const sectionFees = await SectionFees.findOne({ section })

        if (!sectionFees) {
            const fee = new SectionFees({
                section: section,
                feeInfo: {
                    schoolFees: 0,
                    maleUniform: 0,
                    femaleUniform: 0,
                    registration: 0,
                    schBus: 0,
                    textBooks: 0,
                    total: 0

                },

            })
            const savedFee = await fee.save()
            return res.status(200).json(savedFee)
        }
        res.status(200).json(sectionFees)
    } catch (error) {
        console.log(error)
    }

}

// Get a student payment History in a term
exports.student_payment_history = async (req, res) => {
    const { id } = req.params
    const { year, term } = req.calendar

    try {

        const paymentdetails = await PaymentHistory.find({ studentDetails: id, year, term })
            .populate('studentDetails', "_id firstname middlename lastname section stdClass")
        console.log(paymentdetails)
        res.status(200).json(paymentdetails)

    } catch (error) {
        console.log(error)
    }

}


//Update payments Required for a section
exports.update_section_fee = async (req, res) => {

    const {
        registrationFee,
        schoolFees,
        maleUniform,
        femaleUniform,
        textBook,
        schBus

    } = req.body

    // const maleTotal = schoolFees+maleUniform+registrationFee+schBus+textBook
    // const femaleTotal = schoolFees+femaleUniform+registrationFee+schBus+textBook

    const feeInfo = {
        schoolFees,
        maleUniform,
        femaleUniform,
        registration: registrationFee,
        schBus,
        textBooks: textBook,
        // maleTotal,
        // femaleTotal

    }

    try {
        await SectionFees.findByIdAndUpdate({ _id: req.params.id },
            { $set: { feeInfo } }, {
            new: true
        })

        res.status(200).json({ message: 'Fees updated successfully' })
    } catch (error) {
        console.log(error)
    }

}

//Get A students payment by term
exports.student_payment_details = async (req, res) => {

    try {
        const stdPaymentDetails = await Payment.findOne({ studentDetails: req.params.id, year: req.calendar.year, term: req.calendar.term })
            .populate('studentDetails', "_id firstname lastname stdClass section sex")

        if (!stdPaymentDetails) {
            const stdDetails = await StudentDetails.findOne({ _id: req.params.id })

            // Fees for the section that the student belong to 
            const sectionFees = await SectionFees.findOne({ section: stdDetails.section })

            const payment = new Payment({
                section: stdDetails.section,
                stdClass: stdDetails.stdClass,
                year: req.calendar.year,
                term: req.calendar.term,
                paymentInfo: {
                    registration: 0,
                    registrationRemark: "Not Paid",
                    schoolFees: 0,
                    schoolFeesRemark: "Not Paid",
                    uniform: 0,
                    uniformRemark: "Not Paid",
                    books: 0,
                    booksRemark: "Not Paid",
                    schBus: 0,
                    schBusRemark: "Not Paid",
                    total: 0

                },
                studentDetails: req.params.id,

            })
            const savedPayment = await payment.save()

            return res.status(200).json({ payment: savedPayment, stdDetails, sectionFees })
        }

        const sectionFees = await SectionFees.findOne({ section: stdPaymentDetails.studentDetails.section })
        res.status(200).json({ payment: stdPaymentDetails, stdDetails: stdPaymentDetails.studentDetails, sectionFees })
    } catch (error) {
        console.log(error)
    }

}

//Make payment for a student in d current session n term
exports.update_student_Payment = async (req, res) => {

    const {
        paymentDetails,
        studentDetails,
        paymentMode
    } = req.body


    const today = new Date().toDateString()
    const paymentYr = new Date().getFullYear()
    const paymentMth = new Date().getUTCMonth()

    try {

        const stdPaymentDetails = await Payment.findOne({ _id: req.params.id })


        // If no amount was entered Do not populate payment History
        if (paymentDetails.total !== 0) {
            // Save payment to student payment History using school calendar
            paymentDetails.year = stdPaymentDetails.year
            paymentDetails.month = stdPaymentDetails.paymentMth

            const newPayment = new PaymentHistory({
                section: stdPaymentDetails.section,
                stdClass: stdPaymentDetails.stdClass,
                year: stdPaymentDetails.year,//or use req.calendar.year
                term: stdPaymentDetails.term,
                paymentInfo: {
                    registration: paymentDetails.registrationFeePaidNow,
                    registrationRemark: paymentDetails.registrationFeeRemark,
                    schoolFees: paymentDetails.schoolFeePaidNow,
                    schoolFeesRemark: paymentDetails.schoolFeeRemark,
                    uniform: paymentDetails.uniformFeePaidNow,
                    uniformRemark: paymentDetails.uniformFeeRemark,
                    books: paymentDetails.txtBookFeePaidNow,
                    booksRemark: paymentDetails.txtBookFeeRemark,
                    schBus: paymentDetails.schBusFeePaidNow,
                    schBusRemark: paymentDetails.schBusFeeRemark,
                    total: paymentDetails.total

                },
                studentDetails: studentDetails,
                paymentMode,
                paymentMth,
                paymentYr,
                timestamp: today

            })
            const savedPayment = await newPayment.save()

        }

        // Update student payment with current payment

        stdPaymentDetails.timestamp = today
        stdPaymentDetails.paymentMth = paymentMth
        stdPaymentDetails.paymentYr = paymentYr
        const feeDetails = stdPaymentDetails.paymentInfo

        feeDetails.registration = feeDetails.registration + Number(paymentDetails.registrationFeePaidNow)
        feeDetails.registrationRemark = paymentDetails.registrationFeeRemark
        feeDetails.schoolFees = feeDetails.schoolFees + Number(paymentDetails.schoolFeePaidNow)
        feeDetails.schoolFeesRemark = paymentDetails.schoolFeeRemark
        feeDetails.uniform = feeDetails.uniform + Number(paymentDetails.uniformFeePaidNow)
        feeDetails.uniformRemark = paymentDetails.uniformFeeRemark
        feeDetails.books = feeDetails.books + Number(paymentDetails.txtBookFeePaidNow)
        feeDetails.booksRemark = paymentDetails.txtBookFeeRemark
        feeDetails.schBus = feeDetails.schBus + Number(paymentDetails.schBusFeePaidNow)
        feeDetails.schBusRemark = paymentDetails.schBusFeeRemark
        feeDetails.total = feeDetails.total + Number(paymentDetails.total)



        const feePaid = await stdPaymentDetails.save()

        console.log(feePaid)
        return res.status(200).json({ message: 'Fee Updated Successfully' })


    } catch (error) {
        console.log(error)
    }

}
