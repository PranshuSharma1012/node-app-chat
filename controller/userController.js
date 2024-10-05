const path = require('path')
const bodyParser = require('body-parser')
// const session = require('express-session')
// const cookieParser = require('cookie-parser')
// const flash = require('connect-flash')
const bcrypt = require('bcrypt')
const express = require('express')
const app = express()
const {saveUser, checkLogin , userdata , getAllUsers , getPartnerDetail , getChat} = require('../helpers/userHelper')
const { appendFile } = require('fs')
const userModel = require('../model/userModel')
const chatModel = require('../model/chatModel')
const ejs = require('ejs')
const mongoose = require('mongoose')
app.set('view engine' , 'ejs')


let register = (req , res) => {

    let error = req.flash('error')

    console.log(JSON.stringify(error))

    return res.render('pages/register' , {data:{} , error:error})
}

let addUser = async (req , res , next) => {
    
    let data = req.body
    
    data.image = req.file.filename
    // console.log(req.file.filename);

    // res.send('working')
     

    const saltRounds = 10
    data.password = await bcrypt.hash(data.password , saltRounds)

    let result = await saveUser(data , req , next)

    if (result) {
        res.render('pages/login')
    }
    else{

        throw new Error('Failed to add user in database')
        // res.redirect('back')
    }

}

let login = (req , res) => {
    res.render('pages/login')
}

let validateLogin = async (req , res) => {
    try{    
        // console.log(`session inside login ${JSON.stringify(req.session)}`);
        
        let data = req.body

        let result = await checkLogin(data , req)

        if (result.is_success) {
            // console.log(` id is  ${result.result.id}`);
            req.session.user_id = result.result._id
            req.session.save()
            app.set('authId' , req.session.user_id)
            // console.log(`the user id is : ${req.session.user_id}`);
            res.redirect('/home')
        }
        else{
            req.flash('error' , result.error)
            
        }
        res.redirect('/login')
    }
    catch(error){
        console.log(`inside catch of validateLogin ${error}`);
        
    }

}

// app.locals.authInfo = async (id) => {

//     let result = await userModel.findById(id)

//     return result || false

// }

// app.locals.name = 'pranshu'



let home = async (req , res) => {
    
    
    let result = await getAllUsers(req)
    console.log(result);  

    let partner = {}

    if (result.is_success) {

        let partnerId = req.params['partnerId'] || result.users[0].id

        let senderId = req.session.user_id

        let chat = await getChat(senderId , partnerId )

        partner = await getPartnerDetail(partnerId) 
     
        let readUpdate = await chatModel.findOneAndUpdate({
            senderId:partnerId,
            reciverId:senderId
        } , {is_read:1});
        
        res.render('pages/home' , {data:result.users , partner:partner , chat:chat , chatCount:chat.length , async:true}  , (error , promise)=> {
            promise.then((html) => {
                // console.log(html);
                
                res.send(html)
            })
        } )

    }
    else{
        res.send('No User Available')
    }

}

let logout = (req , res) => {  

    req.session.destroy()

    res.redirect('/login')

}

let sendMessage = async (req , res) => {

    let {message} = req.body
    let {reciverId} = req.body
    let senderId = req.session.user_id

    // console.log(`${message} , ${senderId} , ${reciverId}`);
    

    const chatObj = new chatModel({
        message:message,
        reciverId:reciverId,
        senderId:senderId,
        is_read:0
    })

    let result = await chatObj.save()

    // console.log(`senderId ${senderId} , reciverId ${reciverId} `);
    
    let chat = await chatModel.find({
        $or:[
            {$and:[{reciverId:`${new mongoose.Types.ObjectId(reciverId)}`} ,{senderId:`${new mongoose.Types.ObjectId(senderId)}`}]},
            {$and:[{reciverId:`${new mongoose.Types.ObjectId(senderId)}`} ,{senderId:`${new mongoose.Types.ObjectId(reciverId)}`}]},
        ]
    }).populate(['senderId' , 'reciverId'])

    // console.log(chat) 
    
    res.json({is_success:true})

    // if (result) {
    //     console.log('chat saved successfully');
    // }
    // else{
    //     console.log('error saving chat');        
    // }
    
}

let chatHistory = async (req , res) => {

    let reciverId = req.params.reciverId
    let senderId = req.session.user_id

    let chat = await getChat(senderId , reciverId)

    res.render('pages/chatArea' , {chat:chat , async:true}  , (error , promise)=> {
        promise.then((html) => {
            // console.log(html);
            
            res.json({is_success:true , html:html , chatCount:chat.length})

            // res.send(html)
        })
      
        // console.log(html);
        
    })
}

let getProfile = async (req , res) => {
    let authId = req.session.user_id

    let data = await getPartnerDetail(authId)

    res.render('pages/profile' , {data:data})
}

let updateProfileForm = async (req , res) => {

    let authId = req.session.user_id

    let data = await getPartnerDetail(authId)

    res.render('pages/profileUpdate' , {data:data , async:true} , (error , promise) => {
        promise.then((html) => {

            res.send(html)

        })
    })

}

let updateProfile = async (req ,res) => {
    let {name, email, phone, city , about} = req.body
    let authId = req.session.user_id

    let filter = {
        _id:authId
    }

    // update image 

    let image = req.file.filename
    // console.log(` the image name is ${req.file.filename}`);

    if (image) {
        let updateData = {
            name, email, phone, city , about , image
        }
        let result = await userModel.findOneAndUpdate(filter, updateData);
    
        if (result) {
            req.flash('success' , 'Updated Successfully')
            // console.log('image update success')            
        }
    }
    else{

        let updateData = {
            name, email, phone, city , about 
        }
        let result = await userModel.findOneAndUpdate(filter, updateData);
    
        if (result) {
            req.flash('success' , 'Updated Successfully')
            // console.log('image update failed')
        }
    }


    res.redirect('/profile')
}

module.exports = {
    register,
    addUser,
    login,
    validateLogin,
    home,
    logout,
    sendMessage,
    chatHistory,
    getProfile,
    updateProfileForm,
    updateProfile,
    app
}