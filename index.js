const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const app = express()
const {port} = require('./config')
const multer = require('multer')
const userRoutes = require('./routes/userRouter')

const userModel = require('./model/userModel')
require('./connection')

const {errorHandler} = require('./middleware/errorMiddleware')


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'pranshu',
    saveUninitialized: true,
    resave: true
}));


app.use(flash());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))

app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

app.use('/jquery/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.use('/chatCss' , express.static(path.join(__dirname, 'public/css/chat')))

app.use((req , res , next) => {    

    res.locals.authInfo = async (id) => {

        let result = await userModel.findById(id)
    
        return result || false
    
    }
    next()
} )

app.use('/' , userRoutes)

 
app.use(errorHandler)

app.listen(port, function (error) {
    if (!error) {
        console.log(`server running on port no. ${port}`);

    }
})



