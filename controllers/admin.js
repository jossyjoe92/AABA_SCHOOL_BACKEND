const User = require('../models/user')
const SchoolCalendar = require('../models/calendar')
const Student = require('../models/stdDetails')
const Staff = require('../models/staffDetails')
const Subject = require('../models/subject')
const Result = require('../models/result')
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

//Staff Validation List
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


        res.json({ student,message: 'Student Details updated Successfully' });
    } catch (error) {
        return res.json({ error: "Could not update student info" })
    }
}
//Update Student Photo
exports.update_student_photo = async (req, res) => {

    try {
        const student = await Student.findByIdAndUpdate(req.params.id,{
            $set:{photo:req.body.imgUrl}
        },{new:true})
        .select('-password')
     

        res.json({data:student, message: "Photo Updated successfully" });
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


