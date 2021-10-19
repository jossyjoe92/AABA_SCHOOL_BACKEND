const User = require("../models/user");
const Family = require("../models/family");
const Gift = require("../models/gift");
const Service = require("../models/service");

// sharp 4 image resize
const sharp = require("sharp");

// Cloudinary config
const cloudinary = require("../utils/cloudinary");

// // Azure config
// const { BlobServiceClient } = require('@azure/storage-blob')
// const blobSasUrl = process.env.SAS_URL

// const blobServiceClient = new BlobServiceClient(blobSasUrl)
// const containerName = 'beloved-dais-gift'
// const containerClient =blobServiceClient.getContainerClient(containerName);

//Register a new Service
exports.new_service = async (req, res) => {
  const { serviceTitle, alias, description, family } = req.body;
  // console.log(req.file);
  // console.log(giftTitle,alias,description,family)

  if (!serviceTitle || !alias || !description || !family) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  if (!req.file) {
    try {
      const service = new Service({
        serviceTitle,
        postedBy: req.user,
        postedByAlias: alias,
        description,
        family,
      });
      const newService = await service.save();

      //update family details

      const updateFamily = await Family.findByIdAndUpdate(
        newService.family,
        {
          $push: { services: newService._id, membersAlias: alias },
        },
        {
          new: true,
        }
      );
      res.json({ message: "Service uploaded Successfully" });
    } catch (error) {
      console.log(error);
      res.json({ error: error });
    }
  } else {
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
        photo: result.secure_url,
        serviceTitle,
        postedBy: req.user,
        postedByAlias: alias,
        description,
        family,
      });
      const newService = await service.save();

      //  update family details

      const updateFamily = await Family.findByIdAndUpdate(
        newService.family,
        {
          $push: { services: newService._id, membersAlias: alias },
        },
        {
          new: true,
        }
      );
      res.json({ message: "Service uploaded Successfully" });
    } catch (error) {
      console.log(error);
      res.json({ error: error });
    }
  }
};

// Get a single service
exports.single_service = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.serviceId });
    // console.log(myFamilies)
    res.status(200).json({ service });
  } catch (error) {
    console.log(error);
    return res.json({ error: error });
  }
};

// Make a request for a service

exports.service_request = async (req, res) => {
  const { reason, alias, serviceId } = req.body;

  if (!reason || !alias || !serviceId) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  try {
    const service = await Service.findById(serviceId ).populate(
      "family",
      "_id membersAlias"
    );

    // Check if user has already made a request
    if (service.requestedBy.includes(req.user._id)) {
      return res.status(422).json({ error: "User already made request" });
    }
  

    // check if alias already exists
    // first family alias

    if (service.family.membersAlias[0] !== undefined) {

      var regex = new RegExp(service.family.membersAlias.join("|"), "i");
      var aliasTaken = regex.test(alias);

      if (aliasTaken) {
        return res.status(422).json({ error: "Alias already exist" });
      }
    } 
      const serviceRequest = {
        reason,
        alias,
        postedBy: req.user._id,
      };

      const makeRequest = await Service.findByIdAndUpdate(
        req.body.serviceId,
        {
          $push: { serviceRequest: serviceRequest, requestedBy: req.user._id },
        },
        {
          new: true,
        }
      )
        .populate("serviceRequest.postedBy", "_id username photo")
        .populate("postedBy", "_id username photo");

        const serviceRequests = makeRequest.serviceRequest
      // Add user request Alias to family Alias
      await Family.findByIdAndUpdate(
        service.family._id,
        {
          $push: { membersAlias: alias },
        },
        {
          new: true,
        }
      );

      res.status(200).json(serviceRequests);
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: err });
  }
};

// Accept a request for a gift

exports.accept_service_request = async (req, res) => {
  const { requesterId, serviceId } = req.body;

  if (!requesterId || !serviceId) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  try {
   

    const acceptRequest = await Service.findByIdAndUpdate(
      serviceId,
      {
        $push: { recievedBy: requesterId },
        // $set: { serviceRequest:{requestAccepted: true} },
      },
      {
        new: true,
      }
    )
      .populate("serviceRequest.postedBy", "_id username photo")
      .populate("postedBy", "_id username photo")
      .populate("recievedBy", "_id username");

      const requestData = {
        requests:acceptRequest.serviceRequest,
        givenOut:acceptRequest.givenOut,
      } 

    res.status(200).json({ data: requestData, message: "request accepted succesfully" });
     
   
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: err });
  }
};

// End request for a gift

exports.end_service_request = async (req, res) => {
  const { serviceId } = req.body;

  if (!serviceId) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  try {

    const endRequest = await Service.findByIdAndUpdate(
      serviceId,
      {
        $set: { givenOut: true },
      },
      {
        new: true,
      }
    )
      // .populate("giftRequest.postedBy", "_id username photo")
      // .populate("postedBy", "_id username photo")
      // .populate("recievedBy", "_id username");

    res.status(200).json({ data: endRequest, message: "request ended succesfully" });
     
   
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: err });
  }
};
