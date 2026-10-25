const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    department:{
        type:String,
        required:true
    },

    semester:{
        type:Number,
        required:true
    },

    section:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("User", userSchema);