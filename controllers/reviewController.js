const reviews = require("../model/reviewModel")




// post review
exports.addreviewController = async(req,res)=>{
    const {campId, rating,comment}= req.body
    const userMail= req.payload?.userMail
    console.log(userMail);
    console.log(campId, rating,comment);
    
    

    try {

        const newReview = new reviews({
            campId,userMail,rating,comment
        })
        await newReview.save()
        res.status(200).json(newReview)
        
    } catch (error) {
        res.status(500).json(error)
    }
}

// get review
exports.getReviewController = async(req,res)=>{

    const {campId} = req.params

    try {
        
        const review = await reviews.find({campId})
        res.status(200).json(review)
    } catch (error) {
         res.status(500).json(error)
    }
}