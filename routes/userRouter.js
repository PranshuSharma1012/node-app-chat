const express = require('express')
const router = express.Router()
const path = require('path')
const userController = require('../controller/userController')
const multer = require('multer')
const asyncHandler = require('express-async-handler')
const checkLogin = require('../middleware/authMiddleware')

function checkFileType(req , file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
        return cb(null, true);
    } else {  
        req.fileValidationError ='Error: Images only! (jpeg, jpg, png, gif)'
        return cb(null , false , req.fileValidationError);
    }
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}--${file.originalname}`);
    //   cb(null, file.originalname)
    },
    onError: function(error , next){
        next(error)      
    }
})

var upload = multer({ 
    storage: storage,
    limits: { fileSize: 1000000},
    fileFilter: function(req, file, cb) {
        checkFileType(req , file, cb);
    }
})



router.get('/register' , userController.register)

router.post('/submit', upload.single('image') , asyncHandler(userController.addUser))

router.get('/login' , userController.login)

router.get('/logout' , userController.logout)

router.post('/validateLogin' , userController.validateLogin)

router.get('/home/:partnerId?', checkLogin , asyncHandler(userController.home))

router.post('/chat/message' , asyncHandler(userController.sendMessage))

router.get('/chatHistory/:reciverId' , asyncHandler(userController.chatHistory))

router.get('/profile' , asyncHandler(userController.getProfile))

router.get('/profile/update' , asyncHandler(userController.updateProfileForm))

router.post('/update/profile' , upload.single('image') , asyncHandler(userController.updateProfile))

module.exports = router