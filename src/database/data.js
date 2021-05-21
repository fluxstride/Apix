let {MongoClient} = require("mongodb");
let dotenv = require("dotenv");
let path = require("path")
dotenv.config({path: path.join(__dirname,".env")})
let connectionString
if(process.env.PORT){
	    connectionString=process.env.MONGODB_URI;
}else{
	connectionString = process.env.MONGODB_OFF_URI;
}
module.exports = new MongoClient(connectionString, { useUnifiedTopology: true });
