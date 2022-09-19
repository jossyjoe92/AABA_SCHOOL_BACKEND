const Staff = require('../models/staffDetails')
const Student = require('../models/stdDetails')
const Subject = require('../models/subject')
const Result = require('../models/result')
const Attendance = require('../models/attendance')
const { request } = require('express')
const calendar = require('../models/calendar')

// single staff Info
exports.get_single_staff = async (req, res) => {

    try {
        const staff = await Staff.findOne({ user: req.params.id })
            .populate('user', "_id username ")

        res.json({ staff });
    } catch (error) {
        console.log(error)
    }
}

// update staff Info
exports.update_staff_details = async (req, res) => {

    const { firstname, middlename, lastname, sex, DOB, stateOfOrigin, classTeacher, phone, email, maritalStatus } = req.body

    try {
        const staff = await Staff.findOneAndUpdate({ user: req.params.id }, {
            $set: { firstname, middlename, lastname, sex, DOB, stateOfOrigin, classTeacher, phone, email, maritalStatus }
        }, { new: true })


        res.json({ staff, message: 'Staff Details updated Successfully' });
    } catch (error) {
        return res.json({ error: "Could not update staff info" })
    }
}

// single staff Info
exports.get_student_result_for_compute = async (req, res) => {
    try {

        // Check if this student result for the term has been computed
        const result = await Result.findOne({ studentDetails: req.params.id, year: req.calendar.year, term: req.calendar.term })

        if (!result) {
            const student = await Student.findOne({ _id: req.params.id })
                .select("id section firstname lastname DOB stdClass sex stateOfOrigin photo")

            const subjects = await Subject.findOne({ section: student.section })
                .select("id subjects")
            return res.json({ student: student, subjects: subjects, calendar: req.calendar })
        }
        return res.json({ hasResult: true })


    } catch (error) {
        console.log(error)
        return res.status(404).json({ error: "student not found" })
    }
}


// save student result after compute
exports.save_student_result_after_compute = async (req, res) => {
    const { id, resultId, scores, total, average, grade, scale, year, term, stdClass } = req.body

    if (!id || !scores || !total || !average) {
        return res.status(422).json({ error: 'Please add all the fields' })
    }

    try {

        const results = await Result.find({ studentDetails: id })
            .populate('studentDetails', "_id firstname lastname section stdClass")

        if (results[0] === undefined) {
            const result = new Result({
                year,
                term,
                scores,
                total,
                average,
                grade,
                scale,
                class: stdClass,
                studentDetails: id

            })
            const savedresult = await result.save()
            res.json({ result: savedresult })

        } else {
            //check if student already have result for the term
            const check = results.filter(result => ((result.year === req.calendar.year) && (Number(result.term) === req.calendar.term)))

            if (check.length > 0) {
                const result = await Result.findByIdAndUpdate(resultId, {
                    $set: { scores, total, average, grade, scale }
                }, {
                    new: true
                })

                return res.status(422).json({ message: 'Result Updated successfully' })
            } else {

                const result = new Result({
                    year,
                    term,
                    scores,
                    total,
                    average,
                    grade,
                    scale,
                    class: stdClass,
                    studentDetails: id

                })
                const savedresult = await result.save()

                res.json({ result: savedresult })
            }
        }

    } catch (error) {
        console.log(error)
        // return res.status(404).json({ error: "student not found" })
    }
}

// Save Student result Image url
exports.save_student_result_image = async (req, res) => {

    const { id, resultId, resultImage } = req.body

    if (!id || !resultImage || !resultId) {
        return res.status(422).json({ error: 'Please add all the fields' })
    }

    try {

        const result = await Result.findOne({ studentDetails: id, year: req.calendar.year, term: req.calendar.term })
            .populate('studentDetails', "_id firstname lastname section stdClass")

        result.resultImage = resultImage

        const updatedResult = await result.save()

        res.json({ result: updatedResult })

    } catch (error) {
        console.log(error)
        // return res.status(404).json({ error: "student not found" })
    }
}

// Teacher comment student result
exports.teacher_comment_student_result = async (req, res) => {

    const { resultId, teacherComment, classTeacher } = req.body

    try {
        const staff = await Staff.findOne({ user: classTeacher })
            .select("id firstname lastname");
        const result = await Result.findByIdAndUpdate(resultId, {
            $set: {
                teacherComment: {
                    teacherName: `${staff.firstname} ${staff.lastname}`,
                    comment: teacherComment
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

// Teacher compute student attendance for result
exports.compute_student_attendance = async (req, res) => {

    const { resultId, schOpened, present } = req.body

    try {

        const result = await Result.findByIdAndUpdate(resultId, {
            $set: {
                stdAttendance: {
                    schOpened,
                    present
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


// Get data to update student weekly attendance
exports.get_student_attendance_data = async (req, res) => {

    try {
        const studentAttendance = await Attendance.findOne({ studentDetails: req.params.id, year: req.calendar.year, term: req.calendar.term })
            .populate('studentDetails', "_id firstname lastname stdClass ")
        res.json({ calendar: req.calendar, studentAttendance });
    } catch (error) {
        console.log(error)
    }
}

// Teacher compute student psychomoto
exports.compute_student_psychomoto = async (req, res) => {

    const {
        resultId,
        attentiveness,
        honesty,
        politeness,
        neatness,
        punctuality,
        selfControl,
        obedience,
        reliability,
        responsibility,
        relationship } = req.body;

    const psyc = {
        attentiveness,
        honesty,
        politeness,
        neatness,
        punctuality,
        selfControl,
        obedience,
        reliability,
        responsibility,
        relationship
    }

    try {

        const result = await Result.findByIdAndUpdate(resultId, {
            $set: { psychomoto: psyc }
        }, {
            new: true
        })

        res.json({ result, message: 'Result updated Successfully' })

    } catch (error) {
        res.json({ error: 'Error updating Data' })
        console.log(error)
    }
}


// Teacher compute student weekly attendance
exports.save_student_weekly_attendance = async (req, res) => {

    const { id, week, attendance } = req.body

    const attendanceToSave = {
        week,
        attendance
    }

    if (!week) return res.status(422).json({ error: 'Please add all the fields' })

    try {
        // Find a student attence record for the term
        const studentAttendance = await Attendance.findOne({ studentDetails: id, year: req.calendar.year, term: req.calendar.term })

        // Filter out if exixt attendance for the specified week
        const attendanceData = studentAttendance.attendance.filter(item => item.week !== week)

        // Add week attendance to list
        attendanceData.push(attendanceToSave)
        studentAttendance.attendance = attendanceData

        console.log(studentAttendance)
        await studentAttendance.save()

        res.status(200).json({ message: 'Attendance updated Successfully' })

    } catch (error) {
        res.json({ error: 'Error updating Data' })
        console.log(error)
    }
}