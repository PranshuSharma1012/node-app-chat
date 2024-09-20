const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const express = require('express')
const app = express()

app.use(cookieParser());

app.use(session({
    secret: 'pranshu',
    saveUninitialized: true,
    resave: true
}));


app.use(flash());


const errorHandler = (error , req , res , next) => {

    const errorStatus = error.statusCode || 500

    const errorMessage = error.message || 'Something Went Wrong!'

    req.flash('error' , errorMessage)

    res.redirect('/register')

    // res.location(req.get("Referrer") || "/")
    
    
    // res.status(errorStatus).json({
    //     success:false,
    //     status:errorStatus,
    //     message:`${errorMessage}` ,
    //     stack:process.env.NODE_ENVIRONMENT === 'devepolment' ? error.stack : {}
    // })


}

module.exports = {
    errorHandler
}