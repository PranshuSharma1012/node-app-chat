const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const bcrypt = require('bcrypt')
const express = require('express')
const app = express()
const {saveUser, checkLogin , userdata , getAllUsers , getPartnerDetail} = require('../helpers/userHelper')
const { appendFile } = require('fs')
const userModel = require('../model/userModel')
const ejs = require('ejs')

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
        let data = req.body

        let result = await checkLogin(data , req)

        if (result.is_success) {

            req.session.user_id = result.result.id

            console.log(`the user id is : ${req.session.user_id}`);
            

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

    let result = await getAllUsers()

    let partner = {}

    if (result.is_success) {

        let partnerId = req.params['partnerId'] || result.users[0].id

        partner = await getPartnerDetail(partnerId) 

        console.log(` partner is : ${partner}`);
        
        // res.render('pages/home' , {data:result.users , partner:partner} )

        const html = await ejs.renderFile('views/pages/home.ejs' , {data:result.users , partner:partner} , {async:true}) 
        
        res.send(html)
        
    }
    else{
        res.send('No User Available')
    }

}

module.exports = {
    register,
    addUser,
    login,
    validateLogin,
    home
}