const db = require("../models");
const Cost = db.cost;
const Op = db.Sequelize.Op;
// Create and Save a new Cost
exports.create = (req, res) => {
  // Validate request
  if (req.body.name === undefined) {
    res.status(404).send({
        message: `Cost name cannot be empty for cost!`,
      });return;
  } else if (req.body.price === undefined) {
    res.status(404).send({
        message: `Price cannot be empty for cost!`,
      });return;
  }

  // Create a Cost
  const cost = {
    name: req.body.name,
    price: req.body.price,
  };
  // Save Cost in the database
  Cost.create(cost)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Cost.",
      });
    });
};

// Find all Customers
exports.findAll = (req, res) => {
  Cost.findAll({
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

// Find a single Cost with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Cost.findOne({
    where: { id: id },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Cost with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Cost with id=" + id,
      });
    });
};
// Update a Cost by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Cost.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Cost was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Cost with id=${id}. Maybe Cost was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Cost with id=" + id,
      });
    });
};
// Delete a Cost with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Cost.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Cost was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Cost with id=${id}. Maybe Cost was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Cost with id=" + id,
      });
    });
};
// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  Cost.destroy({
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
