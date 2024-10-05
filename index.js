// const express = require('express')
// const path = require('path')
// const bodyParser = require('body-parser')
// const session = require('express-session')
// const cookieParser = require('cookie-parser')
// const flash = require('connect-flash')
// const app = express()
// const {port} = require('./config')
// const multer = require('multer')
// const userRoutes = require('./routes/userRouter')

// const userModel = require('./model/userModel')

// const chatModel = require('./model/chatModel')

// require('./connection')

// const {errorHandler} = require('./middleware/errorMiddleware')

// const http = require('http');
// const server = http.createServer(app);
// const options = {
//     cors: true,
//     origins: ['http://127.0.0.1:4000'],
//   }
// const { Server } = require("socket.io");
// const io = new Server(server , options);
// let onlineUsers = 0


// app.use('/socket' , express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')))

// app.set('view engine', 'ejs')
// app.use(express.static('public'))
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(session({
//     secret: 'pranshu',
//     saveUninitialized: true,
//     resave: true,
//     // cookie:{secure:true}
// }));


// app.use(flash());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))

// app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

// app.use('/jquery/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

// app.use('/chatCss' , express.static(path.join(__dirname, 'public/css')))

// app.use('/custom/js' , express.static(path.join(__dirname, 'public/js')))

// app.use((req , res , next) => { 
    
//     // console.log(`session is : ${JSON.stringify(req.session)}`);
    

//     res.locals.loggedInUserId = req.session.user_id || false

//     // console.log(`UserId is ${res.locals.loggedInUserId}`)
    

//     res.locals.authInfo = async (id) => {

//         let result = await userModel.findOne({_id:id})
//         // let result = await userModel.findById(id)
    
//         // console.log(`in middleware ${result}`);       

//         return result || false
    
//     }
//     next()
// } )


// app.use('/' , userRoutes)

// app.use(errorHandler)


// // console.log(io);

// io.on('connection', (socket) => {
//     onlineUsers += 1;
//     socket.on('disconnect', () => {
//         onlineUsers -= 1;
//         console.log('user disconnected');
//         console.log(`number of users online are : ${onlineUsers}`);
//     });

//     io.emit('total_online_users' , {count:onlineUsers})
    
// //    console.log(io.sockets.sockets);
//    console.log(`number of users online are : ${onlineUsers}`);
// });

// server.listen(port, function (error) {
//     if (!error) {
//         console.log(`server running on port no. ${port}`);
        
//     }
// })

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

const chatModel = require('./model/chatModel')

const userController = require('./controller/userController')

require('./connection')

const {errorHandler} = require('./middleware/errorMiddleware')

const http = require('http');
const server = http.createServer(app);
const options = {
    cors: true,
    origins: ['http://127.0.0.1:4000'],
  }
const { Server } = require("socket.io");
const io = new Server(server , options);
let onlineUsers = 0


app.use('/socket' , express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'pranshu',
    saveUninitialized: true,
    resave: true,
    // cookie:{secure:true}
}));


app.use(flash());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))

app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

app.use('/jquery/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.use('/chatCss' , express.static(path.join(__dirname, 'public/css')))

app.use('/custom/js' , express.static(path.join(__dirname, 'public/js')))

app.use((req , res , next) => { 
    
    // console.log(session is : ${JSON.stringify(req.session)});
    

    res.locals.loggedInUserId = req.session.user_id || false

    // console.log(UserId is ${res.locals.loggedInUserId})
    

    res.locals.authInfo = async (id) => {

        let result = await userModel.findOne({_id:id})
        // let result = await userModel.findById(id)
    
        // console.log(in middleware ${result});       

        return result || false
    
    }
    next()
} )


app.use('/' , userRoutes)

app.use(errorHandler)


io.on('connection', (socket) => {
    // console.log(userController.app.get('authId')); // Author id

    io.emit('new_user' , {socketId:socket.id , authId:userController.app.get('authId')})
    
    onlineUsers += 1;

    socket.on('disconnect', () => {
        onlineUsers -= 1;
        io.emit('total_online_users' , {count:onlineUsers})

        console.log('user disconnected');
        
        console.log(`number of users online are : ${onlineUsers}`);

        io.emit('updateOffline' , {authId: userController.app.get('authId')})

    });
    
    socket.on('introduction' , (data) => {
        io.emit('updateDom' , {id:data.id})                
    });

    io.emit('total_online_users' , {count:onlineUsers})
    
    console.log(`number of users online are : ${onlineUsers}`);
});



server.listen(port, function (error) {
    if (!error) {
        console.log(`server running on port no. ${port}`);
        
    }
})

module.exports = app


// https://us05web.zoom.us/j/86851845094?pwd=txNu1aIiJZ2rVEluonFXBdCEyiqbVv.1