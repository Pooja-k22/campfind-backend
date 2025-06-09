// import moongose
const mongoose = require("mongoose");

// create schema
const campSpotSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  maxGuest: {
    type: Number,
    required: true,
  },
  amenities: {
    type: Array,
    default: [],
  },
  activities:{
    type:Array,
    default:[]
  },
  uploadedImages: {
    type: Array,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  userMail: {
    type: String,
    required: true,
  },
},{ timestamps: true});

// create model
const campSpots = mongoose.model("campSpots", campSpotSchema);

// export model
module.exports = campSpots;
