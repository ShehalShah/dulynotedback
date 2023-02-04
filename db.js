const mongoose=require('mongoose')
// const mongoURI="mongodb://localhost:27017/dulynoted"
const mongoURI="mongodb+srv://shehalshah:DNfifaf00tball@cluster0.eyuz9uv.mongodb.net/?retryWrites=true&w=majority"

const connectionparams={
    useNewUrlParser:true,
    useUnifiedTopology:true
}

const connectToMongo=()=>{
    mongoose.connect(mongoURI,connectionparams, ()=>{
        console.log("connected to mongo successfully!");
    })
}

module.exports=connectToMongo;