const User = require('../models/user')
const Books = require('../models/bookList')
const SchoolCalendar = require('../models/calendar')
const SchoolEventCalendar = require('../models/eventCalendar')
const Student = require('../models/stdDetails')
const Staff = require('../models/staffDetails')
const Subject = require('../models/subject')
const Result = require('../models/result')
const TermStart = require('../models/termStart')
const bcrypt = require('bcryptjs')

//Staff Validation List
exports.staff_validation_list = async (req, res) => {
    try {
        const user = await User.find({ $or: [{ role: "accountant" }, { role: "staff" }] })
            .select('-password')
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }

}


//Validate A single staff
exports.staff_validation = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: { isVerified: true }
        }, { new: true })
            .select('-password')

        res.json({ user: updatedUser, message: "Account verified successfully" });
    } catch (error) {

        return res.status(422).json({ error: 'could not update account' })
    }
}

//Staff List
exports.staff_list = async (req, res) => {
    try {
        const staffs = await Staff.find({})
            .populate('user', "_id username ")
        res.status(200).json(staffs)
    } catch (error) {
        console.log(error)
    }

}


//Reset A staff Password
exports.reset_user_password = async (req, res) => {
    try {
        const password = await bcrypt.hash('aabamemorialschool', 12)
        await User.findByIdAndUpdate(req.params.id, {
            $set: { password }
        }, { new: true })

        res.json({ message: "Password Updated successfully" });
    } catch (error) {
        console.log(error)
        return res.status(422).json({ error: 'could not update account' })
    }
}

//Create Subject List
exports.new_subject_list = async (req, res) => {
    const { section, subjects } = req.body
    if (!section || !subjects) {
        return res.status(422).json({ error: 'please add all the fields' })
    }

    try {
        const sectionResult = await Subject.findOne({ section: section })

        //   If list already exist, delete from DB
        if (sectionResult) return res.status(422).json({ error: "Subjects for ths Section Already Exists", result: sectionResult })

        const subject = new Subject({
            section,
            subjects

        })
        await subject.save()
        res.json({ message: "Subject List Created successfully" });
    } catch (error) {
        console.log(error)
    }

}


//Create Book List
exports.new_book_list = async (req, res) => {
    const { bookClass, books } = req.body
    // return console.log(books)
    if (!bookClass || !books) {
        return res.status(422).json({ error: 'please add all the fields' })
    }

    try {
        const bookList = new Books({
            bookClass,
            list: books,
            lastUpdated: new Date()

        })
        await bookList.save()
        res.json({ message: "Book List Created successfully" });
    } catch (error) {
        console.log(error)
    }

}

//Update Class Book List
exports.update_class_booklist = async (req, res) => {
    const { bookClass, books } = req.body
    // return console.log(books)
    if (!bookClass || !books) {
        return res.status(422).json({ error: 'please add all the fields' })
    }

    try {
        await Books.findByIdAndUpdate(req.params.id, {
            $set: {
                bookClass,
                list: books,
                lastUpdated: new Date()
            }
        }, { new: true })

        res.json({ message: "Calendar Updated successfully" });
    } catch (error) {
        console.log(error)
    }

}

//Update Student Book List
exports.update_student_booklist = async (req, res) => {
    const { books } = req.body

    if (!books) {
        return res.status(422).json({ error: 'please add all the fields' })
    }

    try {

        const bookListUpdated = await Student.findByIdAndUpdate(req.params.id,
            { $set: { 'bookList.list': books } }, {
            new: true
        })
            .select("id firstname middlename lastname section stdClass bookList")

        return res.status(200).json(bookListUpdated);
    } catch (error) {
        console.log(error)
    }

}
//Create School calendar. Called After real DB is created deployment
// comment out before deployment
exports.create_school_calendar = async (req, res) => {

    if (req.calendar !== 'No Calendar created yet') {

        return res.status(422).json({ error: "Calendar Already Created" });
    }

    try {
        const calendar = new SchoolCalendar({
            year: new Date().getFullYear(),
            term: 1,
            week: 'one',
            active: true,
        })
        await calendar.save()

        res.json({ message: "Calendar Created successfully" });
    } catch (error) {

        return res.status(422).json({ error: 'could not create Calendar' })
    }
}

//Get School Calendar
exports.get_school_calendar = async (req, res) => {
    if (req.calendar !== 'No Calendar created yet') {
        return res.json(req.calendar);
    }
    return res.status(422).json({ error: 'Server Issues! Contact Admin for support' })

}

//Update School calendar
exports.update_school_calendar = async (req, res) => {
    const { year, term, week } = req.body

    if (req.calendar === 'No Calendar created yet') {
        return res.status(422).json({ error: 'Server Issues! Contact Admin for support' })
    }

    try {

        await SchoolCalendar.findByIdAndUpdate(req.calendar._id, {
            $set: { year, term, week }
        }, { new: true })

        res.json({ message: "Calendar Updated successfully" });

    } catch (error) {

        return res.status(422).json({ error: 'could not update Calendar' })
    }
}

// Update Term Begins
exports.update_term_start = async (req, res) => {
    const { termStart } = req.body

    try {
        const termStarting = await TermStart.findOne({})
        console.log(termStarting)
        if (!termStarting) {
            const newTerm = new TermStart({
                termStart,

            })
            await newTerm.save()

            return res.json({ message: "Term Start Updated successfully" });
        }
        termStarting.termStart = termStart
        await termStarting.save()
        res.json({ message: "Term Start Updated successfully" });

    } catch (error) {

        return res.status(422).json({ error: 'could not update Term Start' })
    }
}
// get_school_event_calendar
exports.get_school_event_calendar = async (req, res) => {

    const { year, term } = req.calendar;
    try {
        const event = await SchoolEventCalendar.findOne({ year, term })

        res.status(200).json({ event })
    } catch (error) {
        console.log(error)
    }

}
// Update school event calendar
exports.update_event_calender = async (req, res) => {
    const { year, term, week } = req.calendar
    const { eventData } = req.body

    try {
        const eventCalendar = await SchoolEventCalendar.findOne({ year, term })
        if (!eventCalendar) {
            const calendar = new SchoolEventCalendar({
                year,
                term,
                events: eventData
            })
            const data = await calendar.save()
            return res.json({ message: "Event Calendar Updated successfully" });
        }


        const data = await SchoolEventCalendar.findOneAndUpdate({ year, term }, {
            $set: { year, term, events: eventData }
        }, { new: true })

        res.json({ message: "Event Calendar Updated successfully" });

    } catch (error) {
        console.log(error)
        return res.status(422).json({ error: 'could not update Calendar of Events' })
    }
}


// update student Info
exports.update_student_details = async (req, res) => {

    const { firstName,
        middleName,
        lastName,
        sex,
        state,
        section,
        religion,
        DOB,
        stdClass,
        parentName,
        phone,
        occupation,
        username } = req.body

    try {
        const student = await Student.findOneAndUpdate({ user: req.params.id }, {
            $set: {
                firstname: firstName,
                middlename: middleName,
                lastname: lastName,
                sex,
                DOB,
                stateOfOrigin: state,
                section,
                stdClass,
                phone,
                religion,
                parentName,
                phone,
                occupation
            }
        }, { new: true })



        const user = await User.findOneAndUpdate({ _id: student.user }, {
            $set: {
                username
            }
        }, { new: true })

        res.json({ student, message: 'Student Details updated Successfully' });
    } catch (error) {
        return res.json({ error: "Could not update student info" })
    }
}
//Update Student Photo
exports.update_student_photo = async (req, res) => {

    try {
        const student = await Student.findByIdAndUpdate(req.params.id, {
            $set: { photo: req.body.imgUrl }
        }, { new: true })
            .select('-password')


        res.json({ data: student, message: "Photo Updated successfully" });
    } catch (error) {
        console.log(error)
        return res.status(422).json({ error: 'could not update photo' })
    }
}

// HM comment student result
exports.hm_comment_student_result = async (req, res) => {

    const { resultId, hmComment, hmId } = req.body

    try {
        const hm = await Staff.findOne({ user: hmId })
            .select("id firstname lastname");

        const result = await Result.findByIdAndUpdate(resultId, {
            $set: {
                hmComment: {
                    hmName: `${hm.firstname} ${hm.lastname}`,
                    comment: hmComment
                }
            }
        }, {
            new: true
        })

        res.json({ result, message: 'Result updated Successfully' })

    } catch (error) {
        res.json({ error: 'Error updating Comment' })
        console.log(error)
    }
}
//Delete A staff Account
exports.delete_staff_account = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)

        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.log(error)
        return res.status(422).json({ error: 'could not delete account' })
    }
}

//Promote student to new class
exports.promote_student_to_newClass = async (req, res) => {

    const { stdClass, newClass } = req.body

    console.log(newClass)
    try {
        const classStudents = await Student.find({ stdClass })
        if (newClass === "Primary1") {

            for (let i = 0; i < classStudents.length; i++) {
                const item = classStudents[i];
                item.stdClass = newClass
                item.section = "Lower-Grade"
                await item.save()

            }
        } else if (newClass === "JSS1(Gold)" || newClass === "JSS1(Diamond)") {
            for (let i = 0; i < classStudents.length; i++) {
                const item = classStudents[i];
                item.stdClass = newClass
                item.section = "Secondary"
                await item.save()

            }

        } else if (newClass === "Primary4A" || newClass === "Primary4B") {
            for (let i = 0; i < classStudents.length; i++) {
                const item = classStudents[i];
                item.stdClass = newClass
                item.section = "Upper-Grade"
                await item.save()

            }
        } else {
            for (let i = 0; i < classStudents.length; i++) {
                const item = classStudents[i];
                item.stdClass = newClass
                await item.save()

            }
        }

        res.status(200).json({ message: "Student Promoted Successfully" });
    } catch (error) {
        console.log(error)
        return res.status(422).json({ error: 'could not promote students.' })
    }
}



