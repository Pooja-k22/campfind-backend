// import moongoose
const mongoose = require("mongoose");

// schema

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  campId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "campSpots",
    required: true,
  },
   hostMail: {
    type: String, 
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },

  numberOfGuests: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
 
});

// create model

const bookings = mongoose.model("bookings", bookingSchema);

module.exports = bookings;
