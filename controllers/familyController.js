const User = require('../models/user')
const Family = require('../models/family')
const Gift = require('../models/gift')
const Beloved = require('../models/beloved')

//Register a new family
exports.new_family = async (req, res) => {

    const { familyName, purpose, expectedGifts, expectedServices } = req.body
    if (!familyName || !purpose || !expectedGifts || !expectedServices) {
        return res.status(422).json({ error: 'Please add all the fields' })
    }

    try {

        const family = new Family({
            familyName,
            purpose,
            expectedGifts: [...expectedGifts],
            expectedServices: [...expectedServices],
            members: [
                {
                    role: 'super-admin',
                    member: req.user,
                }
            ]

        })
        const newFamily = await family.save()


        //update user details

        const user = await User.findByIdAndUpdate(req.user._id, {
            $push: { myFamilies: newFamily._id }
        }, {
            new: true
        })
            .select("-password")

        res.json({ user, message: 'Family created Successfully' })
    } catch (error) {
        console.log(error)
    }

}
exports.my_families = async (req, res) => {

    try {
        const myFamilies = await Family.find({ _id: { $in: req.user.myFamilies } })
        // console.log(myFamilies)
        res.status(200).json({ myFamilies: myFamilies })
    } catch (error) {
        console.log(error)
        return res.json({ error: error })
    }


}

// single_family
exports.single_family = async (req, res) => {

    try {
        const family = await Family.findOne({ _id: req.params.id })
        // console.log(myFamilies)
        res.status(200).json({ family })
    } catch (error) {
        console.log(error)
        return res.json({ error: error })
    }


}
exports.all_gifts = async (req, res) => {
    try {
        const gifts = await Gift.find({ family: req.params.familyId })
        // console.log(myFamilies)
        res.status(200).json({ gifts })
    } catch (error) {
        console.log(error)
        return res.json({ error: error })
    }
}

exports.all_services = async (req, res) => {
    try {
        const services = await Service.find({ family: req.params.familyId })
        // console.log(myFamilies)
        res.status(200).json({ services })
    } catch (error) {
        console.log(error)
        return res.json({ error: error })
    }
}

exports.all_beloved = async (req, res) => {
    try {
        const beloveds = await Beloved.find({ family: req.params.familyId })
        // console.log(myFamilies)
        res.status(200).json({ beloveds })
    } catch (error) {
        console.log(error)
        return res.json({ error: error })
    }
}


