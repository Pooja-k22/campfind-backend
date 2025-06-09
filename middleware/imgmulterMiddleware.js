// import multer
const multer = require('multer')


// storage

 const storage = multer.diskStorage({
    // path for file store
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },

    // name of file store
    filename:(req,file,cb)=>{
        const fname = `image-${file.originalname}`
        cb(null,fname)
    }
 })


//  file filter
const fileFilter =(req,file,cb)=>{
    // true
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' ||  file.mimetype == 'image/jpeg' ){
        cb(null,true)
    }

    else{
        cb(null , false)
        return cb(new Error('accept onlt png, jpg, jpeg files'))
    }
}

// create multer config
const multerConfig = multer({
    storage,
    fileFilter
})

// export 
module.exports = multerConfig