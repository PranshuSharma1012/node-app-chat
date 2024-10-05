const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    message:String,
    senderId:{ type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    reciverId:{ type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    is_read:Number
    
},{
    timestamps:{createdAt:'created_at'}
})

const chat = mongoose.model('chat' ,chatSchema )

module.exports = chat