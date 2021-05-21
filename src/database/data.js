let {MongoClient} = require("mongodb");
let path = require("path")
let connectionString=process.env.MONGODB_URI;
module.exports = new MongoClient(connectionString, { useUnifiedTopology: true });
