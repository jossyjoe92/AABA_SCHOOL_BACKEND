const mongoose = require('mongoose')
const User = require('../models/user')
const StdDetails = require('../models/stdDetails')
const StaffDetails = require('../models/staffDetails')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
2

//Register a new user
exports.new_user_signup = async (req, role, res) => {

    const { username, password } = req.body;

    if (!username || !password) return res.status(422).json({ error: "Enter Username and Password" })

    try {

        const user = username.toLowerCase()

        //check if a user with this registration Number alraedy exist
        let findUser = await User.findOne({ username: user })

        if (findUser) {
            return res.status(422).json({ error: "A user with this registration number already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 12)

        // student registration
        if (role === 'student') {
            const {
                firstName, middleName, lastName, sex, state, section, DOB,religion, stdClass, parentName, phone, occupation,
            } = req.body

            const newUser = new User({
                username: user,
                password: hashedPassword,
                role,
                isVerified: true

            })
            const savedUser = await newUser.save()

            // create student details
            const student = new StdDetails({
                firstname: firstName,
                middlename: middleName,
                lastname: lastName,
                parentName,
                occupation,
                religion,
                phone,
                stateOfOrigin: state,
                sex,
                DOB,
                stdClass,
                section,
                user: savedUser._id
            })
            await student.save()

            return res.status(200).json({ message: `Student Registration Successful` })
        }
        // Staff, Admin etc registration
        const newUser = new User({
            username: user,
            password: hashedPassword,
            role

        })
        const savedUser = await newUser.save()
        // create staff details
        const staff = new StaffDetails({
            firstname: '',
            middlename: '',
            lastname: '',

            user: savedUser._id
        })
        await staff.save()

        res.status(200).json({ message: `Please Proceed to admin to confirm your registration` })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false });

    }

}

//Authenticate and login user
exports.user_login = async (req, res) => {
 
    const { username, password } = req.body;
    if (!username || !password) return res.status(422).json({ error: "Enter Username and Password" })
   
    try {
        const userName = username.toLowerCase()

        const user = await User.findOne({ username: userName })

        if (!user) {

            return res.status(422).json({ error: 'Invalid username or password' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        //Check if User is registered and verified
        if (passwordMatch && user.isVerified) {
            //asign jwt token and send user data and jwt token
            const token = jwt.sign({ _id: user._id }, process.env.jwt)
            const { _id, isVerified, role, username } = user

            // Get details Other user details for staff
            if (role === 'staff') {
                const staff = await StaffDetails.findOne({ user: _id })
                    .select('_id classTeacher photo firstname lastname')
                return res.status(200).json({ token, message: 'User login Succesful', user: { _id, role, username, isVerified }, staff })
            }
            // Get Other std details
            if (role === 'student') {
                const student = await StdDetails.findOne({ user: _id })
                    .select('_id stdClass  section photo')
                return res.status(200).json({ token, message: 'User login Succesful', user: { _id, role, username, isVerified }, student })
            }
            res.status(200).json({ token, message: 'User login Succesful', user: { _id, role, username, isVerified } })

        } else if (passwordMatch && !user.isVerified) {
            res.status(200).json({ message: `Please Proceed to admin to confirm your registration` })

        } else {
            //This user is neither registered nor verified
            return res.status(422).json({ error: 'Invalid Username or password' })
        }


    } catch (error) {
        console.log(error)
    }
    //check if user exists in the DB
}

