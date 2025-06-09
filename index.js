
// import dot env
require('dotenv').config()

// import express server
const express = require('express')

// import cors
const cors = require('cors')

// import route
const route = require('./routes')

// import db connection
require('./dbconnection')

// create server
const campspotServer = express()




// server to use
campspotServer.use(cors())
//return middleware for parse the data  - middleware which break the request response cycle
campspotServer.use(express.json())
// use routes
campspotServer.use(route)
// export the upload img folder
campspotServer.use('/upload',express.static('./uploads'))




// create port
PORT = 4001 || process.env.PORT

// port listen
campspotServer.listen(PORT , ()=>{
    console.log(`server running successfully at port number ${PORT}`);
    
})