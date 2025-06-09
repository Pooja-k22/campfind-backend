const bookings = require("../model/bookingModel");

const campSpots = require("../model/campSpotModel");

const stripe = require("stripe")(process.env.STRIPEKEY);

// booking
exports.bookingCampController = async (req, res) => {
  const { campId, checkInDate, numberOfGuests, totalPrice } =
    req.body;
  console.log(campId, checkInDate, numberOfGuests, totalPrice);

  const userId = req.payload.userId;
  console.log(userId);
  
  
  

  try {
    const camp = await campSpots.findById(campId);
    console.log(camp);

    const hostMail= camp.userMail
    console.log(hostMail);
    
    

    // Step 2.1: Create booking document first (
    const newBooking = new bookings({
      userId,
      campId,
      hostMail,
      checkInDate,
     numberOfGuests,
      totalPrice,
    });
    await newBooking.save();

    //  // Step 2.2: Create Stripe checkout session for payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Camping spot booking: ${camp.title}`,
              description: `Booking on ${checkInDate}  for ${numberOfGuests} guests`,
            },
            unit_amount: Math.round(totalPrice * 100), // INR in paise, so multiply by 100
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-error",
      metadata: {
        userId,
        campId,
        hostMail,
        checkInDate,
        numberOfGuests,
        totalPrice,
      },
    });
    res.status(200).json({ newBooking, sessionId: session.id });
  } catch (error) {
    res.status(500).json(error);
  }
};


// get user booking
exports.getUserBookingController= async(req,res)=>{

    const userId = req.payload.userId

    try {

        const userBookings = await bookings.find({userId}).populate('campId')

        res.status(200).json(userBookings)
        
    } catch (error) {
         res.status(500).json(error)
    }
}


// get reservation list 
exports.getReservationListController=async(req,res)=>{
  const userMail = req.payload.userMail
  console.log(userMail);

  try {
    
    const reservation = await bookings.find({hostMail :userMail}).populate('campId').populate('userId')
    res.status(200).json(reservation)
  } catch (error) {
      res.status(500).json(error);
  }
  
}

// Check capacity on a specific date
exports.checkCampCapacityController = async (req, res) => {
  const { campId, date, guests } = req.query;

  console.log("Received =>", { campId, date, guests });

  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(selectedDate);
  nextDay.setDate(nextDay.getDate() + 1);

  try {
    const bookingsOnDate = await bookings.find({
      campId,
      checkInDate: {
        $gte: selectedDate,
        $lt: nextDay,
      },
    });

    console.log("Bookings found:", bookingsOnDate);

    const totalGuests = bookingsOnDate.reduce(
      (sum, booking) => sum + booking.numberOfGuests,
      0
    );

    console.log("Total guests on date:", totalGuests);

    const camp = await campSpots.findById(campId);

    if (!camp) {
      console.log("Camp not found");
      return res.status(404).json({ error: "Camp not found" });
    }

    const requestedGuests = Number(guests);
    const isFull = totalGuests + requestedGuests > camp.maxGuest;

    console.log("Requested:", requestedGuests);
    console.log("Max allowed:", camp.maxGuest);
    console.log("Total after request:", totalGuests + requestedGuests);
    console.log("Is full:", isFull);

    res.status(200).json({
      isFull,
      totalGuests,
      maxGuests: camp.maxGuest,
    });
  } catch (error) {
    console.error("Error checking capacity:", error);
    res.status(500).json({ error: "Error checking capacity" });
  }
};

// get all bookings
exports.getAllBookingsController = async(req,res)=>{
  try {
    const booking = await bookings.find().populate('userId').populate('campId')
    res.status(200).json(booking)
    
  } catch (error) {
    res.status(200).json(error)
    
  }
}


