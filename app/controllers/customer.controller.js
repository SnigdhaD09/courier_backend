const db = require("../models");
const Customer = db.customer;
const Op = db.Sequelize.Op;
// Create and Save a new Customer
exports.create = (req, res) => {
  // Validate request
  if (req.body.name === undefined) {
    res.status(404).send({
        message: `Customer name cannot be empty for customer!`,
      });return;
  } else if (req.body.location === undefined) {
    res.status(404).send({
        message: `Location cannot be empty for customer!`,
      });return;
  } else if (req.body.delivery === undefined) {
    res.status(404).send({
        message: `Delivery cannot be empty for customer!`,
      });return;
  }

  // Create a Customer
  const customer = {
    name: req.body.name,
    location: req.body.location,
    delivery: req.body.delivery,
  };
  // Save Customer in the database
  Customer.create(customer)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer.",
      });
    });
};

// Find all Customers
exports.findAll = (req, res) => {
  Customer.findAll({
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Customers.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Customers.",
      });
    });
};

// Find a single Customer with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Customer.findOne({
    where: { id: id },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Customer with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Customer with id=" + id,
      });
    });
};
// Update a Customer by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Customer.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Customer was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Customer with id=" + id,
      });
    });
};
// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Customer.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Customer was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Customer with id=" + id,
      });
    });
};
// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  Customer.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Customers were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all customers.",
      });
    });
};
