let express = require("express");
let app = express();
let port = process.env.PORT || 5000;
let routes = require("./routes/routes");

app.use(express.json());
app.use(routes)

// index route
app.get("/", (req, res) => {
	res.send("welcome to flxapi");
});

app.listen(port, () => {
	console.log("server listening to port " + port);
});
