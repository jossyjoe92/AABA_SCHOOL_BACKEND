const User = require('../models/user')
const Student = require('../models/stdDetails')
const Result = require('../models/result')
const requireLogin = require('../middleware/requireLogin')
const bcrypt = require('bcryptjs')
const TermStart = require('../models/termStart')

// Get List of students by class
exports.student_list = async (req, res) => {

    try {
        const request = await Student.find({ stdClass: req.params.stdClass })
            .populate('user', "_id username ")

        res.json(request)
    } catch (error) {
        console.log(error)
    }

}

// single staff Info
exports.get_single_student = async (req, res) => {

    try {
        const student = await Student.findOne({ _id: req.params.id })
            .populate('user', "_id username ")

        res.json({ student });
    } catch (error) {
        console.log(error)
    }
}

// get single student result
exports.student_result = async (req, res) => {
    try {
        const termStart = await TermStart.findOne({})
        const result = await Result.findOne({ studentDetails: req.params.id, year: req.calendar.year, term: req.calendar.term })
        const stdDetails = await Student.findById(req.params.id)
            .populate('user', "_id username")

      
        res.status(200).json({ stdDetails,termStart,result })
    } catch (error) {
        console.log(error)
    }
 

}

// get Class Broad
exports.class_broad_sheet = async (req, res) => {
    try {

        const broad = await Result.find({ class: req.params.class, year: req.calendar.year, term: req.calendar.term })
            .populate('studentDetails', "_id firstname lastname sex section stdClass")


        res.json({ broad })

    } catch (error) {
        console.log(error)
    }
}

// update Student Result
exports.student_compute_result_update = async (req, res) => {
    const { data } = req.body

    try {
        const result = await Result.findByIdAndUpdate(req.params.id, data, {
            new: true
        })

        res.json({ result, message: 'Result updated Successfully' })

    } catch (error) {
        console.log(error)
    }

}
// Reset Users Password
exports.reset_Password = async (req, res) => {
    const { password, newPassword } = req.body
    console.log(password, newPassword)

    if (!newPassword || !password) return res.status(422).json({ error: "Enter All fields" })
    try {
        const user = await User.findOne({ _id: req.user._id })

        if (!user) {

            return res.status(422).json({ error: 'An-Authorized' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        //Check if User is registered and verified
        if (passwordMatch && user.isVerified) {
            const passwordNow = await bcrypt.hash(newPassword, 12)
            await User.findByIdAndUpdate(req.user._id, {
                $set: { password: passwordNow }
            }, { new: true })

            res.json({ message: "Password Updated successfully" });
        } else {
            return res.status(422).json({ error: 'Invalid current Password' })
        }
    } catch (error) {
        console.log(error)
        return res.status(422).json({ error: 'could not update account' })
    }

}