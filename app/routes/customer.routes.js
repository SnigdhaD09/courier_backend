module.exports = (app) => {
  const Customer = require("../controllers/customer.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new Customer
  router.post("/customers/", [authenticateRoute], Customer.create);

  // Retrieve all Customers
  router.get("/customers", Customer.findAll);
  
  // Retrieve all Start Nodes
  router.get("/customers/startnodes", Customer.findAllStartNodes);
  
  // Retrieve pickup route
  router.post("/customers/route", Customer.findRoute);
  
  // Retrieve a single Customer with id
  router.get("/customers/:id", Customer.findOne);

  // Update a Customer with id
  router.put("/customers/:id", [authenticateRoute], Customer.update);

  // Delete a Customer with id
  router.delete("/customers/:id", [authenticateRoute], Customer.delete);

  // Delete all customers
  router.delete("/customers/", [authenticateRoute], Customer.deleteAll);

  app.use("/courierapi", router);
};
