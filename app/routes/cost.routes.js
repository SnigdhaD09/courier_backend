module.exports = (app) => {
    const Cost = require("../controllers/cost.controller.js");
    const { authenticateRoute } = require("../authentication/authentication.js");
    var router = require("express").Router();
  
    // Create a new Cost
    router.post("/costs/", [authenticateRoute], Cost.create);
  
    // Retrieve all Costs
    router.get("/costs", Cost.findAll);
  
    // Retrieve a single Cost with id
    router.get("/costs/:id", Cost.findOne);
  
    // Update a Cost with id
    router.put("/costs/:id", [authenticateRoute], Cost.update);
  
    // Delete a Cost with id
    router.delete("/costs/:id", [authenticateRoute], Cost.delete);
  
    // Delete all costs
    router.delete("/costs/", [authenticateRoute], Cost.deleteAll);
  
    app.use("/courierapi", router);
  };
  