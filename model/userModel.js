const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    phone:String,
    city:String,
    about:String,
    image:String
},{
    timestamps:{createdAt:'created_at'}
})

const user = mongoose.model('user' ,userSchema )

module.exports = user