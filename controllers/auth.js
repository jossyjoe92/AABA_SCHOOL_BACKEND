const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {accountSid,authToken,serviceID} = require('../config/keys')

//Twilio client for sending phone number verification sms
const client = require('twilio')(accountSid, authToken);

//Register a new user
exports.new_user_signup = async (req,role,res)=>{
    
    const {username,email,phone,password} = req.body;
    const phone_number = `+234${phone.substring(phone.length - 10,phone.length)}`

    try {
       //If the user entered email, Check if a user with the email already exist.
       //This is to allow users login with either phone number or email address.

       if(email){
        let findUser = await User.findOne({email})

        if(findUser){
            return res.status(422).json({error:"A user with this email already exists"})
        }
       }

       //check if a user with this phone number alraedy exist
        let findUser = await User.findOne({phone:phone_number})

        if(findUser){
            return res.status(422).json({error:"A user with this phone number already exists proceed to login"})
        }
        const hashedPassword = await bcrypt.hash(password,12)

        const user = new User({
            email,
            password:hashedPassword,
            username,
            phone:phone_number,
            role
               
        })
        const newUser = await user.save()
        
        const regUser = {
            id:newUser._id,
            email: newUser.email,
            username:newUser.username,
            phone: newUser.phone,
            role: newUser.role,
            isVerified:newUser.isVerified
        }


           //Use Twilio client to send verification sms
        const phoneVerification = await client.verify
        .services(serviceID)
        .verifications
        .create({
            to:newUser.phone,
            channel:'sms'
        })
      
        res.status(200).json({phoneVerification,message:`Please Enter Verification code sent to ${newUser.phone}`,user:regUser})             
       

    } catch (error){
        console.log(error)
        res.status(400).json({ success: false });

    }

}

 //Verify token entered by user.
 exports.confirm_user_phone = async (req,res)=>{

    const {token,phone,user} = req.body
   
    if(!token){
        return res.status(422).json({error:`please enter the token sent to ${phone}` })
    }
    try {
        const confirmPhone = await client.verify
        .services(serviceID)
        .verificationChecks
        .create({
            to:`+${phone}`,
            code:token
        })
        
        if(confirmPhone.status === 'approved'){
            await User.findByIdAndUpdate(user,{
                $set:{isVerified:true}
            },{new:true})
            
            res.status(200).json({message:'User Registered successfully'})
        }else{
            res.status(422).json({error:"Please enter a vilid token"});
        }
        
    } catch (error) {
        res.json(error)
    }
  }

   //Authenticate and login user
exports.user_login = async (req,res)=>{

    const {phone,password} = req.body;
    console.log(phone,password)
   
    const phone_number = `+234${phone.substring(phone.length - 10,phone.length)}`
    try {
        const user = await User.findOne({phone:phone_number})

        if(!user){
           
           return res.status(422).json({error:'Invalid email or password'})
        }

        const passwordMatch = await bcrypt.compare(password,user.password)
            //Check if User is registered and verified
        if(passwordMatch && user.isVerified){ 

            //asign jwt token and send user data and jwt token
            const token = jwt.sign({_id:user._id},process.env.jwt)
            const {_id,isVerified,role,photo,username,email,phone}=user
            res.json({token,message:'User login Succesful', user:{_id,role,username,email,phone,photo,isVerified}})
            
        }else if(passwordMatch && !user.isVerified){

            const regUser = {
                id:user._id,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified:user.isVerified
            }

                // //This user is registered but not verified
                // const phoneVerification = await client.verify
                // .services(serviceID)
                // .verifications
                // .create({
                //     to:user.phone,
                //     channel:'sms'
                // })
              
                res.status(200).json({phoneVerification,message:'verify',user:regUser})  

            }else{
                //This user is neither registered nor verified
                return res.status(422).json({error:'Invalid Email or password'})
            }
        
       
    } catch (error) {
        console.log(error)
    }
    //check if user exists in the DB
}

   //Resend Phone verification
   exports.send_verification_code = async (req,res)=>{
    const {phone} = req.body;
    console.log(phone)
   
    const phone_number = `+234${phone.substring(phone.length - 10,phone.length)}`
    try {
        const newUser = await User.findOne({phone:phone_number})

        if(!newUser){
           
            return res.status(422).json({error:'User does not exist'})
         }

         const regUser = {
            id:newUser._id,
            email: newUser.email,
            username:newUser.username,
            phone: newUser.phone,
            role: newUser.role,
            isVerified:newUser.isVerified
        }


         //This user is registered but not verified
                const phoneVerification = await client.verify
                .services(serviceID)
                .verifications
                .create({
                    to:newUser.phone,
                    channel:'sms'
                })
                res.status(200).json({phoneVerification,message:`Please Enter Verification code sent to ${newUser.phone}`,user:regUser})             
       
            }catch(e){
                console.log(e)
            }

   }
 //User Forgot Password. Confirm User Phone Number

exports.confirm_user_phone_number = async (req,res)=>{

    const {phone} = req.body;
    const phone_number = `+234${phone.substring(phone.length - 10,phone.length)}`

    try {
        const user = await User.findOne({phone:phone_number})
   
        if(!user){
           return res.status(422).json({error:'Phone Number Does not exist'})
        }

            const regUser = {
                id:user._id,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified:user.isVerified
            }

                const phoneVerification = await client.verify
                .services(serviceID)
                .verifications
                .create({
                    to:user.phone,
                    channel:'sms'
                })
              
                res.status(200).json({phoneVerification,message:`Please Enter Verification code sent to ${user.phone}`,user:regUser})  

        
       
    } catch (error) {
        console.log(error)
    }
 
}


 //User Forgot Password. Update user Password

 exports.update_user_password = async (req,res)=>{

    const {phone,password} = req.body;
    const phone_number = `+234${phone.substring(phone.length - 10,phone.length)}`

    try {

        const hashedPasssword =await bcrypt.hash(password,12)

        const user = await User.findOneAndUpdate({phone:phone_number},{
            $set:{password:hashedPasssword}
        },{
            new:true
        })
      
        res.status(200).json({message:'Password Updated Successfully'})  

    } catch (error) {
        console.log(error)
    }
 
}

