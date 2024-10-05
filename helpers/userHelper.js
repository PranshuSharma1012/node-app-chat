const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const path = require('path')
const userModel = require('../model/userModel')
const chatModel = require('../model/chatModel')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')



let saveUser = async (data , req ,next) => {
    
    const userObj = new userModel(data)

    // throw new Error('connection not working')

    let result = await userObj.save()

    if(result){

        req.flash('success' , 'user registered successfully!')
        
        return true

    }
    else{
        req.flash('error' , 'Failed to register user')
        return false
    }

}

let checkLogin = async (data, req) => {
    try{

        let {email} = data

        // const user = new userModel() 

        let result = await userModel.findOne({ email:email })

        if (result) {
            let response = await bcrypt.compare(data.password , result.password)
            
            if (response) {
                return {is_success:true,
                    result:result
                };
            } 
        }
        else{
            return {is_success:false,
                error:'Invalid Username or password'
            };
        }
        
        
    }
    catch(error){
        console.log(`inside catch of checkLogin : ${error}`);

        return {is_sucess:false,
            error:error
        };
        
    }
}

let getAllUsers = async(req)=>{

    let authId = req.session.user_id

    let users = await userModel.aggregate([
        {
            $lookup:{
                from:'chats',
                localField:'_id',
                foreignField:'senderId',
                as:'chatCount',
            },
            $match:{
                $and:[
                    {
                        reciverId:authId
                    }
                ]
            }
        }
    ])

    if (users) {
        return {is_success:true,
            users:users
        }
    }
    return {
        is_success:false
    }
}

let getPartnerDetail = async (partnerId) => {
   
    let id = partnerId

    let result = await userModel.findOne({_id:id})

    return result 

}

let getChat = async (senderId , reciverId) => {

    // reciverId = '66e92bf2f07f64750a188ff9'

    let chat = await chatModel.find({
        $or:[
            {$and:[{reciverId:`${new mongoose.Types.ObjectId(reciverId)}`} ,{senderId:`${new mongoose.Types.ObjectId(senderId)}`}]},
            {$and:[{reciverId:`${new mongoose.Types.ObjectId(senderId)}`} ,{senderId:`${new mongoose.Types.ObjectId(reciverId)}`}]},
        ]
    }).populate(['senderId' , 'reciverId'])

    return chat
}

module.exports = {
    saveUser,
    checkLogin,
    getAllUsers,
    getPartnerDetail,
    getChat
    
}