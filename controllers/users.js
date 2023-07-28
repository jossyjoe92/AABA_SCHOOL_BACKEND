const User = require('../models/user')
const Student = require('../models/stdDetails')
const Result = require('../models/result')
const Books = require('../models/bookList')
const Attendance = require('../models/attendance')
const WeeklyPerformance = require('../models/weeklyPerformance')
const bcrypt = require('bcryptjs')
const TermStart = require('../models/termStart')
const Subjects = require('../models/subject')
const Quiz = require('../models/quiz')

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

exports.search_students = async (req, res) => {
    // let userPattern = new RegExp("^"+req.body.query)

    const searchKeyword = req.body.query ? {
        $or: [
            { firstname: { $regex: req.body.query, $options: 'i' } }, // 'i' option makes it case-insensitive
            { middlename: { $regex: req.body.query, $options: 'i' } },
            { lastname: { $regex: req.body.query, $options: 'i' } }
        ]
    } : {};

    try {
        const students = await Student.find({ ...searchKeyword });

        res.status(200).json({ students });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error searching for students." });
    }
};
// Get List of Books by class
exports.book_list = async (req, res) => {

    try {
        const request = await Books.find({ bookClass: req.params.bookClass })

        res.json(request)
    } catch (error) {
        console.log(error)
    }

}


// Get Student Subjects by Section
exports.student_subjects = async (req, res) => {

    try {
        const request = await Subjects.findOne({ section: req.params.section })
        res.json(request)
    } catch (error) {
        console.log(error)
    }

}

// single student Info
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

        if (req.user.role !== 'student') {

            const termStart = await TermStart.findOne({})
            const result = await Result.findOne({ studentDetails: req.params.id, year: req.calendar.year, term: req.calendar.term })

            if (!result) return res.status(422).json({ error: 'This student has no result for this term yet' })
            const stdDetails = await Student.findById(req.params.id)
                .populate('user', "_id username")
            return res.status(200).json({ stdDetails, termStart, result })
        } else {
            // This is from the student portal
            // const termStart = await TermStart.findOne({})

            const result = await Result.findOne({ studentDetails: req.params.id, year: req.calendar.year, term: req.calendar.term })

            // No Result Image has been uploaded for this student
            if (!result || !result.resultImage) return res.status(422).json({ error: 'This student has no result for this term yet' })

            // Result Image has been uploaded for this student

            res.status(200).json({ result })

        }

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

// Get A Student Book List
exports.student_books = async (req, res) => {


    try {
        const studentBooks = await Student.findOne({ _id: req.params.id })
            .select("id firstname middlename lastname section stdClass bookList")

        // This functions create a new booklist for a student
        const createNewBook = async (request) => {
            const createStudentBookList = request.list.map(item => {

                return {
                    author: item.author,
                    title: item.title,
                    condition: 'good'
                }

            })
            const bookToUpdate = {
                bookListDate: request.lastUpdated,
                list: createStudentBookList
            }
            // return console.log(bookToUpdate)
            const newBookListCreated = await Student.findByIdAndUpdate(req.params.id,
                { $set: { bookList: bookToUpdate } }, {
                new: true
            })
                .select("id firstname middlename lastname section stdClass bookList")

            return res.status(200).json(newBookListCreated);
        }

        //No book List have been created for this student 
        if (!studentBooks.bookList?.list[0]) {
            const request = await Books.findOne({ bookClass: studentBooks.stdClass })

            if (!request) return res.status(422).json({ error: "No book List Found For this student" })
            createNewBook(request)

        } else {
            const request = await Books.findOne({ bookClass: studentBooks.stdClass })

            if (studentBooks.bookList.bookListDate.toString() !== request.lastUpdated.toString()) {
                // Student has moved to a new class or book list has been updated
                createNewBook(request)
                return
            } else {
                // Everything is the same
                return res.status(200).json(studentBooks);
            }
        }

    } catch (error) {
        console.log(error)
    }

}

// Get a single student Attendance

exports.student_attendance = async (req, res) => {

    try {
        const studentAttendance = await Attendance.findOne({ studentDetails: req.params.id, year: req.calendar.year, term: req.calendar.term })
            .populate('studentDetails', "_id firstname lastname stdClass ")
        if (!studentAttendance) {
            const studentAttendance = new Attendance({
                year: req.calendar.year,
                term: req.calendar.term,
                studentDetails: req.params.id

            })
            studentAttendance.populate('studentDetails', "_id firstname lastname stdClass ").execPopulate();
            const stdAttendance = await studentAttendance.save()

            return res.json({ studentAttendance: stdAttendance });
        }
        res.json({ studentAttendance });

    } catch (error) {
        console.log(error)
    }

}

// single student Weekly Performance report
exports.weekly_performance_report = async (req, res) => {
    const { year, term, week } = req.calendar

    try {
        let weeklyPerformance = await WeeklyPerformance.findOne({ year, term, week, studentDetails: req.params.id })
            .populate('studentDetails', "_id firstname middlename lastname section stdClass")

        // No report created yet. Send student details
        if (!weeklyPerformance) {
            const student = await Student.findOne({ _id: req.params.id })
                .select("firstname middlename lastname section stdClass")
            weeklyPerformance = { studentDetails: student }

            return res.json({ calendar: req.calendar, weeklyPerformance });
        }

        res.json({ calendar: req.calendar, weeklyPerformance });
    } catch (error) {
        console.log(error)
    }
}



// Reset Users Password
exports.reset_Password = async (req, res) => {
    const { password, newPassword } = req.body


    if (!newPassword || !password) return res.status(422).json({ error: "Enter All fields" })
    if (newPassword.length < 8) return res.status(422).json({ error: "Password must be at least 8 characters long" })
    try {
        const user = await User.findOne({ _id: req.user._id })

        if (!user) {

            return res.status(422).json({ error: 'Un-Authorized' })
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

// single student Quizes
exports.take_quiz = async (req, res) => {
    const { year, term, week } = req.calendar
    const { stdClass } = req.params

    try {
        const quiz = await Quiz.find({ stdClass, year, term, week })
            .populate("submissionInfo.submittedBy", "_id firstname middlename lastname photo")
        res.json({ quiz });
    } catch (error) {
        console.log(error)
    }
}

// single Quiz for a single student
exports.tackle_quiz = async (req, res) => {
    const { id } = req.params

    try {
        const quiz = await Quiz.findById(id)
        res.json({ quiz });
    } catch (error) {
        console.log(error)
    }
}
// single Quiz for a single student
exports.submit_student_quiz_result = async (req, res) => {
    const { quizId, score } = req.body

    try {
        // Get the student id and add to quiz submited by
        const student = await Student.findOne({ user: req.user._id })
            .select("_id")

        const submissionInfo = {
            score,
            submittedBy: student._id
        }
        const quizUpdate = await Quiz.findByIdAndUpdate(quizId, {
            $push: { submissionInfo }
        }, {
            new: true
        })
            .populate("submissionInfo.submittedBy", "_id firstname lastname middlename photo")
        res.status(200).json({ quizUpdate });

    } catch (error) {
        res.status(400).json({ error: 'Could not submit quiz' })
    }
}
