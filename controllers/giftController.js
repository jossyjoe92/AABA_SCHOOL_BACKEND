const User = require('../models/user')
const Family = require('../models/family')
const Gift = require('../models/gift')
const Beloved = require('../models/beloved')

// sharp 4 image resize
const sharp = require('sharp');

// Azure config
const { BlobServiceClient } = require('@azure/storage-blob')
const blobSasUrl = process.env.SAS_URL

const blobServiceClient = new BlobServiceClient(blobSasUrl)
const containerName = 'beloved-dais-gift'
const containerClient =blobServiceClient.getContainerClient(containerName);
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
            
        }
    }else{
        try {
            const semiTransparentRedPng = await sharp(req.file.buffer)
            .resize(500,500)
            .jpeg({ quality: 90 })
            .toBuffer();

            let possible = 'abcdefghijklmnopqrstuvwxyz1234567890',
            imageUrl = '';
            for(let i = 0; i<20; i++){
                imageUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            const blockBlobClient = containerClient.getBlockBlobClient(`${imageUrl}.jpeg`)
            const result = await blockBlobClient.uploadData(semiTransparentRedPng)

            const gift = new Gift({
                photo:blockBlobClient.url,
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
        }
    
  
    }
}