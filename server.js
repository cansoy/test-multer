const express=require("express")
const server=express()
const path   =require("path")
const fs =require("fs")
const multer =require("multer")
const upload=multer()
const sharp=require("sharp")
const schemaUser=require("./schema/schemaUser")

const uri = ""
const mongoose=require("mongoose")
mongoose.connect(uri)
    .then(res=>{
        console.log(res.connection.readyState)

    })
    .catch(err=>{
        console.log(err.message)
    })

server.set("view engine","ejs")
server.set("views","./views")
server.use(express.static(path.join(__dirname,"./public")))

server.get("/",(req,res)=>{
    res.render("home")
})
server.post("/posted",upload.single("nameoffile"),async(req,res)=>{
    // Eğer sharp paketini kullanırsak yapmamız gerekn !
    const sharpedBuffer =await sharp(req.file.buffer).resize({width:100,height:100,fit:"inside"}).png({quality:90}).toBuffer()
    console.log(sharpedBuffer)
    console.log(req.file.buffer)
    console.log("----------------------------------------")
    try {
        const body =req.body
        const file =req.file
        const User=new schemaUser({
            name:req.body.name,
            surname:req.body.surname,
            city:req.body.city,
            mainland:req.body.mainland,
            fileofbuffer:req.file.buffer,
            filename:req.file.originalname,
            filesize:Number(req.file.size/1000),
            filetype:req.file.mimetype,
            bufferOfString:sharpedBuffer
        })
        const saveduser =await User.save()
    } 
    catch (error) {
        console.log(error.name)
        console.log(error.message)
        return res.send("we-have-error")
    }
    res.redirect("/")
})



server.get("/get-all-db",async(req,res)=>{
    const counterofpictures=await schemaUser.countDocuments()
    const users=await schemaUser.find()
    const filterUser =users.map(item=>{
        // console.log(item.fileofbuffer)
        // console.log(Buffer.from(item.fileofbuffer))
        return {
            name:item.name,
            surname:item.surname,
            filename:item.filename,
            base64:Buffer.from(item.fileofbuffer).toString("base64")
            // base64:item.fileofbuffer // Bunu muhakkak ki buffer tipine çevirmeliyiz! yoksa resmi alamyız !
        }
    })
    res.render("pictures",{counterofpictures,filterUser})
})

server.get("/pictures/:name",async(req,res)=>{
    const param=req.params.name
    const picture =await schemaUser.findOne({filename:param})
    const buffer =Buffer.from(picture.fileofbuffer)
    const newBuffer =await sharp(buffer).resize({width:400,height:400,fit:"inside"}).png({quality:20}).toBuffer()
    // const buffer =picture.fileofbuffer //bunu content-type şeklinde gönderdiğimiz için herhani bir dönüşüme gerek yok !
    console.log("response-picture-buffer",buffer)
    console.log("response-picture-buffer-size",buffer.length)
    res.set("content-type","image/png")
    console.log(newBuffer)
    console.log(newBuffer.length)
    res.send(newBuffer)
})

server.listen(3000,()=>console.log("*******************************"))