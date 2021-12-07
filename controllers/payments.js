const Payment = require('../models/payments');
const StudentDetails = require('../models/stdDetails');

const SectionFees = require('../models/sectionFees');

//Get All payments by date
exports.payment_date = async (req, res) => {
    const { date } = req.params
    // const { stdClass } = (req.query)
    // console.log(stdClass)

        const paymentdetails = await Payment.find({ timestamp: date })
            .populate('studentDetails', "_id firstname  middlename lastname stdClass")
        res.status(200).json(paymentdetails)
 

}

//Get All payments by Month
exports.payment_by_month = async (req, res) => {
    const { month } = req.params
    // const { stdClass } = (req.query)
    // console.log(stdClass)

    if (!stdClass) {
        const paymentdetails = await Payment.find({ paymentMth: month })
            .populate('studentDetails', "_id firstname  middlename lastname stdClass")
        res.status(200).json(paymentdetails)
    } else {
        const paymentdetails = await Payment.find({ timestamp: date, stdClass })
            .populate('studentDetails', "_id name stdClass")
        res.status(200).json(paymentdetails)
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

            const today = new Date().toDateString()
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
                // timestamp: today,

            })
            const savedPayment = await payment.save()

            res.status(200).json({ payment: savedPayment, stdDetails, sectionFees })
        }

        const sectionFees = await SectionFees.findOne({ section: stdPaymentDetails.studentDetails.section })
        res.status(200).json({ payment: stdPaymentDetails, stdDetails: stdPaymentDetails.studentDetails, sectionFees })
    } catch (error) {

    }

}

//Make payment for a student in d current session n term
exports.update_student_Payment = async (req, res) => {

    const {
        paymentDetails
    } = req.body

    console.log(paymentDetails)
    const today = new Date().toDateString()

    try {

        const stdPaymentDetails = await Payment.findOne({ _id: req.params.id })
    

        stdPaymentDetails.timestamp = today
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
        return res.status(200).json({message:'Fee Updated Successfully'})
    

    } catch (error) {
        console.log(error)
    }

}
