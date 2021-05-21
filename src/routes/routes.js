const router = require("express").Router()
const contrl = require("../controllers/controllers")

// initializing the CRUD operations

// C -> CREATE                                                                
// Creating a single document
router.post("/person", contrl.createSingle);
//Creating multiple documents
router.post("/people", contrl.createMany);

// R -> READ                                                                 
 // Fetching a single document
router.get("/people/:id", contrl.fetchOne);
// fetching multiple documents
router.get("/people", contrl.fetchMany);

// U -> UPDAiTE
// Update a single document
router.put("/people/:id", contrl.updateOne);
// update multiple documents matching  a database query
router.put("/people", contrl.updateMany);

//Delete operation
// Delete a single document
router.delete("/people/:id", contrl.deleteOne);

module.exports = router;
