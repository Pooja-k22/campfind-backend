const express = require('express')

// import controller
const userController = require('./controllers/userController')
const campSpotController = require('./controllers/campSpotController')
const bookingController = require('./controllers/bookingController')
const reviewController = require('./controllers/reviewController')

// middleware
const jwtMiddleware = require('./middleware/jwtMiddleware')
const multerConfig = require('./middleware/imgmulterMiddleware')



// instance create
const route = new express.Router()

// path set

// register
route.post('/register', userController.registerController)

// path for login
route.post('/login',userController.loginController)

// google login
route.post('/google-login',userController.googleLoginController)



// --------------------------------------------------------------------USER-----------------------------------------------------------------------

// add spot
route.post('/add-camp',jwtMiddleware,multerConfig.array('uploadedImages', 3),campSpotController.campSpotAddController)


// get all home camp
route.get('/all-home-camp',campSpotController.getAllHomeCampController)

// get all explore camp
route.get('/all-camp',jwtMiddleware,campSpotController.getAllCampController)

// path to view a camp
route.get('/view-camp/:id',campSpotController.getACampController)


// booking post
route.post('/booking',jwtMiddleware,bookingController.bookingCampController)

// get user bookings
route.get('/user-bookings',jwtMiddleware,bookingController.getUserBookingController)

// get reservation for host spot
route.get('/reservation',jwtMiddleware,bookingController.getReservationListController)


// add remove in camp details wishlist
route.put('/wishlist',jwtMiddleware,userController.WishlistControlller)

// get wishlist in wishlist page
route.get("/get-wishlist",jwtMiddleware,userController.getWishlistController)

// get host camp
route.get('/host-camp',jwtMiddleware,campSpotController.getHostCampController)


// delete camp
route.delete('/delete-camp/:id',campSpotController.deleteCampController)


// edit user profile 
route.put('/userProfile-edit',jwtMiddleware,multerConfig.single('profile'), userController.userProfileEditController)

// booking capacity
route.get("/check-capacity", bookingController.checkCampCapacityController);

// post review
route.post('/add-review',jwtMiddleware,reviewController.addreviewController)


// get review
route.get('/get-review/:campId',reviewController.getReviewController)


// ----------------------------------------------------------ADMIN_-----------------------------------------------------------------------

// get admin camp
route.get('/admin-camp',jwtMiddleware,campSpotController.getAllAdminCampController)

// approve camp
route.put('/approve-camp', campSpotController.approveCampController)

// get all uaser
route.get('/get-users', userController.getAllUserController)

// admin profile edit
route.put('/admin-profile-edit',jwtMiddleware,userController.adminProfileEditController)


// all bookings
route.get('/bookings',bookingController.getAllBookingsController)








// route export
module.exports = route