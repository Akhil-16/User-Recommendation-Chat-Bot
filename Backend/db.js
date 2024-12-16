const { connect } = require("http2");
const mongoose= require("mongoose");

const url="mongodb+srv://Akhilsai:Akhil$123@atlascluster.mn7dkuk.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"
let connectdb = async()=>{
try{
let con = await mongoose.connect(url,{useUnifiedTopology :true,useNewUrlParser: true} )
   console.log("database is connected with the given URI ")
}
catch(err){
 console.log(err)
}


}


module.exports= connectdb


