let {ObjectId } = require("mongodb")
let client = require("../database/data")

exports.createSingle = (req, res) => {
	client.connect((err, connectedClient) => {                                                                                    if (err) {
		return res.status(500).json({ message: err });
	}                                                                                                                     console.log("A successful connection has been made to the db");
		let db = connectedClient.db("samuel");

		let person = req.body;
		if((!person.name && !person.email && !person.country) || typeof person === "string"){
			return res.status(500).json({message:"Problem with the request body"})
		}
		db.collection("db").insertOne(
			{
				name: person.name,
				email: person.email,
				country: person.country,
			},                                                                                                                    (err, data) => {                                                                                                                                                                                                                                    if (err) {
				return res.status(500).json({ message: err });                                                                }                                                                                                                     if((!person.name && !person.email && !person.country) || typeof person === "string"){
					return res.status(500).json({message:"Problem with the request body"})
				}
				return res.status(200).json({
					message: "A new document has been created succesfully",
					data: data.ops[0],                                                                                            })                                                                                                            },
		);                                                                                                            });
}

exports.createMany = (req, res) => {
	client.connect((err, connectedClient) => {                                                                                    if (err) {
		return res.status(500).json({ message: err });
	}
		console.log("A successful connection has been made to the db");                                                       let db = connectedClient.db("samuel");                                                                                                                                                                                                      let people = req.body;

		db.collection("db").insertMany([...people], (err, data) => {
			if (err) {
				return res.status(500).json({ message: err });
			}                                                                                                                     return res.status(200).json({
				message: "A new set of documents have been created",                                                                  data: {                                                                                                                       createCount: data.ops.length,                                                                                         createdDocuments: data.ops,
				},
			});
		});
	});
}


exports.fetchOne = (req, res) => {
	client.connect((err, connectedClient) => {                                                                                    if (err) {                                                                                                                    return res.status(500).json({ message: err });                                                        }                                                                                                                             console.log("Connected to db successfully");                                                                          let db = connectedClient.db("samuel");
		let id =
			req.params.id.length === 24                                                                                           ? req.params.id                                                                                                       : "60963f0ab7be5a2f5e1b1346";                                                                                                                                                                                                       db.collection("db").findOne({ _id: ObjectId(id) }, (err, result) => {                                                         if (err) {
				return res.status(500).json({ message: err });                                                                } else if (!result) {                                                                                                         return res.status(404).json({                                                                                                 message: "Can't find a document with the specified id",                                                       });                                                                                                           }                                                                                                                     return res.status(200).json({                                                                                                 message: "Document fetched successfully",                                                                             data: result,                                                                                                 });
			});
	});
}

exports.fetchMany = (req, res) => {
	client.connect((err, connectedClient) => {
		if (err) {                                                                                                                    return res.status(500).json({ message: err });                                                                }                                                                                                                     console.log("Connected to db successfully");                                                                          let db = connectedClient.db("samuel");                                                                                db.collection("db")                                                                                                           .find({})                                                                                                             .toArray((err, result) => {                                                                                                   if (!result.length) {                                                                                                         return res.status(404).json({                                                                                                 message: "Database is empty please create a new document",
		});
		}
			if (err) {
				return res.status(500).json({ message: err });
			}
			return res.status(200).json({
				message: "Documents fetched successfully",
				data: {
					documentsCount: result.length,
					documents:result
				}
			});
		});                                                                                                   });       

}

exports.updateOne = (req, res) => {                                                                                     client.connect((err, connectedClient) => {                                                                                    if (err) {                                                                                                                    return res.status(500).json({ message: err });                                                                }                                                                                                                                            console.log("Connected to db successfully");                                                   let db = connectedClient.db("samuel");                                                                                let person = req.body;
	let setV = {};                                                                                                        if (person.name) {
		setV.name = person.name;
	}
	if (person.email) {
		setV.email = person.email;                                                                                                           }                                                                                                                                            if (person.country) {                                                                   setV.country = person.country;
		}
	console.log(req.params.id.length);

	/*error handler*/
	let id =
		req.params.id.length === 24
		? req.params.id
		: "60963f0ab7be5a2f5e1b1346";

	/*querying the database*/
	db.collection("db").findOneAndUpdate(                                                                                                                { _id: ObjectId(id) },                                                                                                                       {
		$set: {
			...setV,
		},
	},
		{ returnOriginal: false },
		(err, result) => {
			if (err) {
				return res.status(500).json({ message: err });
			} else if (!result["value"]) {
				return res.status(404).json({
					message: "Can't find a document with the specified id",
				});
			}
			return res.status(200).json({
				message: "Document updated successfully",
				data: result["value"],
			});
		},
	);
});
}

exports.updateMany = (req, res) => {                                                                                         client.connect((err, connectedClient) => {
	if (err) {                                                                                                                    return res.status(500).json({ message: err });                                                                }
	console.log("Connected to db successfully");

	let requestBody = req.body;

	/*let query = JSON.parse(req.query.query);*/
	console.log(requestBody);

	let updateObj = {};
	if (requestBody.update.name) {
		updateObj.name = requestBody.update.name;
	}
	if (requestBody.update.email) {
		updateObj.email = requestBody.update.email;
	}
	if (requestBody.update.country) {
		updateObj.country = requestBody.update.country;
	}

	let db = connectedClient.db("samuel");

	db.collection("db").updateMany(
		requestBody["query"],
		{
			$set: updateObj,
		},
		(err, result) => {
			if (err) {
				return res.status(500).json({ message: err });
			} else if (!result) {
				return res.status(404).json({
					message:
					"Can't find a documents with the specified query",
				});
			}
			return res.status(200).json({
				message: "Documents updated successfully",
				data: { updateCount: result.result.nModified },
			});
		},                                                                                                                                   );                                                                                                                                   });
}

exports.deleteOne = (req, res) => {
	client.connect((err, connectedClient) => {                                                                                    let db = connectedClient.db("samuel");                                                                                                                                                                                                      /*error handler*/                                                                                                     let id =                                                                                                                      req.params.id.length === 24
			? req.params.id
			: "60963f0ab7be5a2f5e1b1346";

		/*querying the database*/
		db.collection("db").findOneAndDelete(
			{ _id: ObjectId(id) },
			(err, result) => {
				if (err) {
					return res.status(500).json({ message: err });                                                                } else if (!result["value"]) {                                                                                                return res.status(404).json({                                                                                                 message: "Can't find a document with the specified id",                                                       });
					}
				return res.status(200).json({
					message: "Document deleted successfully",                                                                             data: { deletedDocument: result["value"] },                                                                   });                                                                                                           },
		);                                                                                                            });                                                                                                           }
