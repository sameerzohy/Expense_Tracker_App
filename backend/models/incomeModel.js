const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    title:{
        type:String, 
        require:true,
        trim:true,
        maxLength:50
    },
    amount:{
        type:Number, 
        require:true,
        maxLength:20,
        trim:true
    },
    type:{
        type:String,
        default:"income"
    },
    date:{
        type:Date,
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String, 
        required:true,
        maxLength:50,
        trim:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',  // Link to the User model
    }
}, {timestamps:true})

module.exports = mongoose.model('Income', IncomeSchema);