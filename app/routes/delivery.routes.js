module.exports = (app) => {
  const Delivery = require("../controllers/delivery.controller.js");
  const { authenticateRoute } = require("../authentication/authentication.js");
  var router = require("express").Router();

  // Create a new Delivery
  router.post("/deliveries/", [authenticateRoute], Delivery.create);

  // Retrieve all Deliverys
  router.get("/deliveries", Delivery.findAll);

  // Retrieve all Deliverys by customer
  router.get("/deliveries/customer/:customerId", Delivery.findAllByCustomer);

  // Retrieve a single Delivery with id
  router.get("/deliveries/:id", Delivery.findOne);

  // Update a Delivery with id
  router.put("/deliveries/:id", [authenticateRoute], Delivery.update);

  // Update a Delivery with status
  router.put("/deliveries/:id/status", [authenticateRoute], Delivery.statusUpdate);

  // Assign a courier to a delivery - create update a trip
  router.put("/deliveries/:deliveryId/assigncourier/:courierId", [authenticateRoute], Delivery.assignCourier);

  // Delete a Delivery with id
  router.delete("/deliveries/:id", [authenticateRoute], Delivery.delete);

  // Delete all deliveries
  router.delete("/deliveries/", [authenticateRoute], Delivery.deleteAll);

  app.use("/courierapi", router);
};
