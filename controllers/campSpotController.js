const campSpots = require("../model/campSpotModel");

// add spot
exports.campSpotAddController = async (req, res) => {
  const {
    title,
    description,
    category,
    location,
    price,
    maxGuest,
    amenities,
    activities,
    imageUrl,
  } = req.body;

  console.log(
    title,
    description,
    category,
    location,
    price,
    maxGuest,
    amenities,
    activities,
    imageUrl
  );

  uploadedImages = [];
  req.files.map((item) => uploadedImages.push(item.filename));
  console.log(uploadedImages);

  const email = req.payload.userMail;
  console.log(email);

  try {
    const existingCamp = await campSpots.findOne({ title, userMail: email });

    if (existingCamp) {
      res.status(401).json("You have already added the camp spot");
    } else {
      const newCamp = new campSpots({
        title,
        description,
        category,
        location,
        price,
        maxGuest,
        amenities,
        activities,
        uploadedImages,
        imageUrl,
        userMail: email,
      });
      await newCamp.save();
      res.status(200).json(newCamp);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// get camp
exports.getAllHomeCampController = async (req, res) => {
  try {
    const allHomeCamp = await campSpots.find().sort({ _id: -1 }).limit(4);
    res.status(200).json(allHomeCamp);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get all camp in explore
exports.getAllCampController = async (req, res) => {
  console.log(req.query);
  const searchkey = req.query.search;
  const userMail = req.payload.userMail;

  try {
    const query = {
      $or: [
        { title: { $regex: searchkey, $options: "i" } },
        { location: { $regex: searchkey, $options: "i" } },
        { category: { $regex: searchkey, $options: "i" } },
      ],
      userMail: { $ne: userMail },
    };

    const allCamp = await campSpots.find(query);
    res.status(200).json(allCamp);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get particular camp
exports.getACampController = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const aCamp = await campSpots.findOne({ _id: id });
    res.status(200).json(aCamp);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get host camp
exports.getHostCampController = async (req, res) => {
  const userMail = req.payload.userMail;

  try {
    const camp = await campSpots.find({ userMail });
    res.status(200).json(camp);
  } catch (error) {
    res.status(500).json(error);
  }
};

// delete camp
exports.deleteCampController = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    await campSpots.findByIdAndDelete({ _id: id });
    res.status(200).json("delete success");
  } catch (error) {
    res.status(500).json(error);
  }
};

// get admin camp
exports.getAllAdminCampController = async (req, res) => {
  try {
    const allCamp = await campSpots.find();
    res.status(200).json(allCamp);
  } catch (error) {
    res.status(500).json(error);
  }
};

// to approve camp
exports.approveCampController = async (req, res) => {
  const {
    _id,
    title,
    description,
    category,
    location,
    price,
    maxGuest,
    amenities,
    activities,
    uploadedImages,
    imageUrl,
    status,
    userMail,
  } = req.body;

  console.log(
    _id,
    title,
    description,
    category,
    location,
    price,
    maxGuest,
    amenities,
    activities,
    uploadedImages,
    imageUrl,
    status,
    userMail
  );

  try {

    const existingCamp = await campSpots.findByIdAndUpdate({_id},{_id,
    title,
    description,
    category,
    location,
    price,
    maxGuest,
    amenities,
    activities,
    uploadedImages,
    imageUrl,
    status:"approved",
    userMail},{new:true})

    await existingCamp.save()
    res.status(200).json(existingCamp)
  } catch (error) {
    res.status(500).json(error);
  }
};
