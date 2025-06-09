const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
campId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"campSpots"
},
userMail:{
    type:String,
    required:true
},
rating:{
     type:Number,
    default:""
},
comment:{
    type:String,
    default:""
}
})

const reviews = mongoose.model("reviews",reviewSchema)

module.exports = reviews