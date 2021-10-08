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
//Register a new gift
exports.new_gift = async (req, res) => {
  const { giftTitle, alias, description, family } = req.body;
  // console.log(req.file);
  // console.log(giftTitle,alias,description,family)

  if (!giftTitle || !alias || !description || !family) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  // check if alias already exists

  try {
    const family = await Family.findById(family);

    if (family.membersAlias[0] !== undefined) {
      var regex = new RegExp(family.membersAlias.join("|"), "i");
      var aliasTaken = regex.test(alias);

      if (aliasTaken) {
        return res.status(422).json({ error: "Alias already exist" });
      }
    }
  } catch (error) {
    res.json({ error: error });
  }

  if (!req.file) {
    try {
      const gift = new Gift({
        giftTitle,
        postedBy: req.user,
        postedByAlias: alias,
        description,
        family,
      });
      const newGift = await gift.save();

      //update family details

      await Family.findByIdAndUpdate(
        newGift.family,
        {
          $push: { gifts: newGift._id, membersAlias: alias },
        },
        {
          new: true,
        }
      );
      res.json({ message: "Gift uploaded Successfully" });
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

      const gift = new Gift({
        // photo:blockBlobClient.url,
        photo: result.secure_url,
        giftTitle,
        postedBy: req.user,
        postedByAlias: alias,
        description,
        family,
      });
      const newGift = await gift.save();

      //  update family details

      const updateFamily = await Family.findByIdAndUpdate(
        newGift.family,
        {
          $push: { gifts: newGift._id, membersAlias: alias },
        },
        {
          new: true,
        }
      );
      res.json({ message: "Gift uploaded Successfully" });
    } catch (error) {
      res.json({ error: error });
    }
  }
};

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

// Get a single gift
exports.single_gift = async (req, res) => {
  try {
    const gift = await Gift.findOne({ _id: req.params.giftId });
    // console.log(myFamilies)
    res.status(200).json({ gift });
  } catch (error) {
    console.log(error);
    return res.json({ error: error });
  }
};

// Make a request for a gift

exports.gift_request = async (req, res) => {
  const { reason, alias, giftId } = req.body;

  if (!reason || !alias || !giftId) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  try {
    const gift = await Gift.findById(giftId).populate(
      "family",
      "_id membersAlias"
    );

    // Check if user has already made a request
    if (gift.requestedBy.includes(req.user._id)) {
      return res.status(422).json({ error: "User already made request" });
    }
  

    // check if alias already exists
    // first family alias

    if (gift.family.membersAlias[0] !== undefined) {

      var regex = new RegExp(gift.family.membersAlias.join("|"), "i");
      var aliasTaken = regex.test(alias);

      if (aliasTaken) {
        return res.status(422).json({ error: "Alias already exist" });
      }
    } 
      const giftRequest = {
        reason,
        alias,
        postedBy: req.user._id,
      };

      const makeRequest = await Gift.findByIdAndUpdate(
        req.body.giftId,
        {
          $push: { giftRequest: giftRequest, requestedBy: req.user._id },
        },
        {
          new: true,
        }
      )
        .populate("giftRequest.postedBy", "_id username photo")
        .populate("postedBy", "_id username photo");

        const giftRequests = makeRequest.giftRequest
      // Add user request Alias to family Alias
      await Family.findByIdAndUpdate(
        gift.family._id,
        {
          $push: { membersAlias: alias },
        },
        {
          new: true,
        }
      );

      res.status(200).json(giftRequests);
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: err });
  }
};

// Accept a request for a gift

exports.accept_gift_request = async (req, res) => {
  const { requesterId, giftId } = req.body;

  if (!requesterId || !giftId) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  try {
    // const gift = await Gift.findById(giftId)

    // Check if current user is the owner of the gift. Handled in d front end.
    // if (gift.postedBy !== req.user._id) {
    //     return res.status(422).json({ error: 'Only owner of gift can accept request' })
    // }

    const acceptRequest = await Gift.findByIdAndUpdate(
      giftId,
      {
        $push: { recievedBy: requesterId },
        // $set: { givenOut: true },
      },
      {
        new: true,
      }
    )
      .populate("giftRequest.postedBy", "_id username photo")
      .populate("postedBy", "_id username photo")
      .populate("recievedBy", "_id username");

      const requestData = {
        requests:acceptRequest.giftRequest,
        givenOut:acceptRequest.givenOut,
      } 

    res.status(200).json({ data: requestData, message: "request accepted succesfully" });
     
   
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: err });
  }
};

// End request for a gift

exports.end_gift_request = async (req, res) => {
  const { giftId } = req.body;

  if (!giftId) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  try {

    const endRequest = await Gift.findByIdAndUpdate(
      giftId,
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
