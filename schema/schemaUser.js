const { name } = require("ejs")
const mongoose=require("mongoose")
const {Schema}=require("mongoose")

const schemaUser =new Schema({
    name:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    mainland:{
        type:String,
        required:true
    },
    fileofbuffer:{
        type:Buffer,
        required:true
    },
    filename:{
        type:String,
        required:true 
    },
    filesize:{
        type:String,
        required:true  
    },
    filetype:{
        type:String,
        required:true 
    },
    bufferOfString:{
        type:String,
        required:true 
    }
})

const SchemaUser=mongoose.model("SchemaUser",schemaUser)

module.exports=SchemaUser


