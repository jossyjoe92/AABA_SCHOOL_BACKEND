const User = require('../models/user')
const Family = require('../models/family')
const beloved = require('../models/beloved')
const Beloved = require('../models/beloved')


// sharp 4 image resize
const sharp = require('sharp');

// Cloudinary config
const cloudinary = require("../utils/cloudinary");
// // Azure config
// const { BlobServiceClient } = require('@azure/storage-blob')
// const blobSasUrl = process.env.SAS_URL

// const blobServiceClient = new BlobServiceClient(blobSasUrl)
// const containerName = 'beloved-dais-beloved'
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

// Get a single beloved
exports.single_beloved = async (req, res) => {
    try {
      const beloved = await Beloved.findOne({ _id: req.params.belovedId });
      // console.log(myFamilies)
      res.status(200).json({ beloved });
    } catch (error) {
      console.log(error);
      return res.json({ error: error });
    }
  };

  // Make a request for a beloved

exports.beloved_request = async (req, res) => {
    const { reason, alias, belovedId } = req.body;
  
    if (!reason || !alias || !belovedId) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    try {
      const beloved = await Beloved.findById(belovedId).populate(
        "family",
        "_id membersAlias"
      );
 
      // Check if user has already made a request
      if (beloved.requestedBy.includes(req.user._id)) {
        return res.status(422).json({ error: "User already made request" });
      }
    
  
      // check if alias already exists
      // first family alias
  
      if (beloved.family.membersAlias[0] !== undefined) {
  
        var regex = new RegExp(beloved.family.membersAlias.join("|"), "i");
        var aliasTaken = regex.test(alias);
  
        if (aliasTaken) {
          return res.status(422).json({ error: "Alias already exist" });
        }
      } 
        const belovedRequest = {
          reason,
          alias,
          postedBy: req.user._id,
        };
  
        const makeRequest = await Beloved.findByIdAndUpdate(
          req.body.belovedId,
          {
            $push: { belovedRequest: belovedRequest, requestedBy: req.user._id },
          },
          {
            new: true,
          }
        )
          .populate("belovedRequest.postedBy", "_id username photo")
          .populate("postedBy", "_id username photo");
  
          const belovedRequests = makeRequest.belovedRequest
        // Add user request Alias to family Alias
        await Family.findByIdAndUpdate(
          beloved.family._id,
          {
            $push: { membersAlias: alias },
          },
          {
            new: true,
          }
        );
  
        res.status(200).json(belovedRequests);
    } catch (error) {
      console.log(error);
      return res.status(422).json({ error: err });
    }
  };
  
  // Accept a request for a beloved
  
  exports.accept_beloved_request = async (req, res) => {
    const { requesterId, belovedId } = req.body;
  
    if (!requesterId || !belovedId) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    try {
      // const beloved = await beloved.findById(belovedId)
  
      // Check if current user is the owner of the beloved. Handled in d front end.
      // if (beloved.postedBy !== req.user._id) {
      //     return res.status(422).json({ error: 'Only owner of beloved can accept request' })
      // }
  
      const acceptRequest = await Beloved.findByIdAndUpdate(
        belovedId,
        {
          $push: { recievedBy: requesterId },
          // $set: { belovedRequest:{requestAccepted: true} },
        },
        {
          new: true,
        }
      )
        .populate("belovedRequest.postedBy", "_id username photo")
        .populate("postedBy", "_id username photo")
        .populate("recievedBy", "_id username");
  
        const requestData = {
          requests:acceptRequest.belovedRequest,
          givenOut:acceptRequest.givenOut,
        } 
  
      res.status(200).json({ data: requestData, message: "request accepted succesfully" });
       
     
    } catch (error) {
      console.log(error);
      return res.status(422).json({ error: err });
    }
  };
  
  // End request for a beloved
  
  exports.end_beloved_request = async (req, res) => {
    const { belovedId } = req.body;
  
    if (!belovedId) {
      return res.status(422).json({ error: "Please add all the fields" });
    }
    try {
  
      const endRequest = await Beloved.findByIdAndUpdate(
        belovedId,
        {
          $set: { givenOut: true },
        },
        {
          new: true,
        }
      )
        // .populate("belovedRequest.postedBy", "_id username photo")
        // .populate("postedBy", "_id username photo")
        // .populate("recievedBy", "_id username");
  
      res.status(200).json({ data: endRequest, message: "request ended succesfully" });
       
     
    } catch (error) {
      console.log(error);
      return res.status(422).json({ error: err });
    }
  };
  