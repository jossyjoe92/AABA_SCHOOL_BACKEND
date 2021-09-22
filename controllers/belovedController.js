const User = require('../models/user')
const Family = require('../models/family')
const Gift = require('../models/gift')
const Beloved = require('../models/beloved')


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

//Register a new beloved
exports.new_beloved = async (req,res)=>{

    const {itemTitle,alias,description,family} = req.body
   
    if(!itemTitle||!alias||!description||!family){
        return res.status(422).json({error:'Please add all the fields'})
    }

    if(!req.file){
        try {
            
            const beloved = new Beloved({
                itemTitle,
                postedBy:req.user,
                postedByAlias:alias,
                description,
                family,
                
            })
            const newBeloved = await beloved.save()

             //update family details

        const updateFamily = await Family.findByIdAndUpdate(newBeloved.family,{
            $push:{beloved:newBeloved._id}
        },{
            new:true
        })
           
        res.json({message:'beloved uploaded Successfully'})
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
            // const blockBlobClient = containerClient.getBlockBlobClient(`${imageUrl}.jpeg`)
            // const result = await blockBlobClient.uploadData(semiTransparentRedPng)

            const result = await cloudinary.uploader.upload(req.file.path);
            
            const beloved = new Beloved({
                // photo:blockBlobClient.url,
                photo:result.secure_url,
                itemTitle,
                postedBy:req.user,
                postedByAlias:alias,
                description,
                family,
                
            })
            const newBeloved = await beloved.save()

             //update family details

        const updateFamily = await Family.findByIdAndUpdate(newBeloved.family,{
            $push:{beloved:newBeloved._id}
        },{
            new:true
        })
           
        res.json({message:'beloved uploaded Successfully'})
        } catch (error) {
            console.log(error)
            res.json({error:error})
            
        }
    }
  
  
}