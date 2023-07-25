module.exports = (app) => {
    const InputMap = require("../controllers/inputMap.controller.js");
    const { authenticateRoute } = require("../authentication/authentication.js");
    var router = require("express").Router();
  
    // Create a new InputMap
    router.post("/inputmaps/", [authenticateRoute], InputMap.create);

    // Retrieve all Routes
    router.post("/inputmaps/find", InputMap.findAllRoutes);
  
    // Retrieve a single InputMap with id
    router.get("/inputmaps/:id", InputMap.findOne);
  
    // Update a InputMap with id
    router.put("/inputmaps/:id", [authenticateRoute], InputMap.update);
  
    // Delete a InputMap with id
    router.delete("/inputmaps/:id", [authenticateRoute], InputMap.delete);
  
    // Delete all inputmaps
    router.delete("/inputmaps/", [authenticateRoute], InputMap.deleteAll);
  
    app.use("/courierapi", router);
  };
  