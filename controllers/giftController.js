const User = require('../models/user')
const Family = require('../models/family')
const Gift = require('../models/gift')
const Service = require('../models/service')

// sharp 4 image resize
const sharp = require('sharp');

// Cloudinary config
const cloudinary = require("../utils/cloudinary");

// // Azure config
// const { BlobServiceClient } = require('@azure/storage-blob')
// const blobSasUrl = process.env.SAS_URL

// const blobServiceClient = new BlobServiceClient(blobSasUrl)
// const containerName = 'beloved-dais-gift'
// const containerClient =blobServiceClient.getContainerClient(containerName);
//Register a new gift
exports.new_gift = async (req,res)=>{

    const {giftTitle,alias,description,family} = req.body
    // console.log(req.file);
    // console.log(giftTitle,alias,description,family)
 
    if(!giftTitle||!alias||!description||!family){
        return res.status(422).json({error:'Please add all the fields'})
    }

    if(!req.file){
        try {
            
            const gift = new Gift({
                giftTitle,
                postedBy:req.user,
                postedByAlias:alias,
                description,
                family,
                
            })
            const newGift = await gift.save()

             //update family details

        const updateFamily = await Family.findByIdAndUpdate(newGift.family,{
            $push:{gifts:newGift._id}
        },{
            new:true
        })
        res.json({message:'Gift uploaded Successfully'})
      
        } catch (error) {
            console.log(error)
            res.json({error:error})
            
        }
    }else{
        try {
            // const semiTransparentRedPng = await sharp(req.file.buffer)
            // .resize(500,500)
            // .jpeg({ quality: 90 })
            // .toBuffer();

            // let possible = 'abcdefghijklmnopqrstuvwxyz1234567890',
            // imageUrl = '';
            // for(let i = 0; i<20; i++){
            //     imageUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            // }

            const result = await cloudinary.uploader.upload(req.file.path);
            // console.log(result)
            // const blockBlobClient = containerClient.getBlockBlobClient(`${imageUrl}.jpeg`)
            // const result = await blockBlobClient.uploadData(semiTransparentRedPng)

            const gift = new Gift({
                // photo:blockBlobClient.url,
                photo:result.secure_url,
                giftTitle,
                postedBy:req.user,
                postedByAlias:alias,
                description,
                family,
                
            })
            const newGift = await gift.save()

            //  update family details

        const updateFamily = await Family.findByIdAndUpdate(newGift.family,{
            $push:{gifts:newGift._id}
        },{
            new:true
        })
        res.json({message:'Gift uploaded Successfully'})
        } catch (error) {
            res.json({error:error})
        }
    
  
    }
}

//Register a new Service
exports.new_service = async (req,res)=>{

    const {serviceTitle,alias,description,family} = req.body
    // console.log(req.file);
    // console.log(giftTitle,alias,description,family)
 
    if(!serviceTitle||!alias||!description||!family){
        return res.status(422).json({error:'Please add all the fields'})
    }

    if(!req.file){
        try {
            
            const service = new Service({
                serviceTitle,
                postedBy:req.user,
                postedByAlias:alias,
                description,
                family,
                
            })
            const newService = await service.save()

             //update family details

        const updateFamily = await Family.findByIdAndUpdate(newService.family,{
            $push:{services:newService._id}
        },{
            new:true
        })
        res.json({message:'Service uploaded Successfully'})
      
        } catch (error) {
            console.log(error)
            res.json({error:error})
            
        }
    }else{
        try {
            // const semiTransparentRedPng = await sharp(req.file.buffer)
            // .resize(500,500)
            // .jpeg({ quality: 90 })
            // .toBuffer();

            // let possible = 'abcdefghijklmnopqrstuvwxyz1234567890',
            // imageUrl = '';
            // for(let i = 0; i<20; i++){
            //     imageUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            // }

            const result = await cloudinary.uploader.upload(req.file.path);
            // console.log(result)
            // const blockBlobClient = containerClient.getBlockBlobClient(`${imageUrl}.jpeg`)
            // const result = await blockBlobClient.uploadData(semiTransparentRedPng)

            const service = new Service({
                // photo:blockBlobClient.url,
                photo:result.secure_url,
                serviceTitle,
                postedBy:req.user,
                postedByAlias:alias,
                description,
                family,
                
            })
            const newService = await service.save()

            //  update family details

            const updateFamily = await Family.findByIdAndUpdate(newService.family,{
                $push:{services:newService._id}
            },{
                new:true
            })
            res.json({message:'Service uploaded Successfully'})
          
            } catch (error) {
                console.log(error)
                res.json({error:error})
                
            }
    
  
    }
}