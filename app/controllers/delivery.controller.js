const db = require("../models");
const Delivery = db.delivery;
// Create and Save a new Delivery
exports.create = (req, res) => {
  // Validate request
  if (req.body.originCustomerId === undefined) {
    res.status(400).send({
      message: `Origin Customer cannot be empty for delivery!`,
    });
    return;
  } else if (req.body.destinationCustomerId === undefined) {
    res.status(400).send({
      message: `Destination Customer cannot be empty for delivery!`,
    });
    return;
  } else if (req.body.collectionTime === undefined) {
    res.status(400).send({
      message: `Collection Time cannot be empty for delivery!`,
    });
    return;
  } else if (req.body.deliveryTime === undefined) {
    res.status(400).send({
      message: `Delivery Time cannot be empty for delivery!`,
    });
    return;
  } else if (req.body.blocksEstimate === undefined) {
    res.status(400).send({
      message: `Blocks Estimate Date cannot be empty for delivery!`,
    });
    return;
  } else if (req.body.status === undefined) {
    req.body.status = 'Pending Pickup';
  } else if (req.body.chargeEstimate === undefined) {
    res.status(400).send({
      message: `Charge Estimate cannot be empty for delivery!`,
    });
    return;
  }

  // Create a Delivery
  const delivery = {
    originCustomerId: req.body.originCustomerId,
    destinationCustomerId: req.body.destinationCustomerId,
    collectionTime: req.body.collectionTime,
    deliveryTime: req.body.deliveryTime,
    blocksEstimate: req.body.blocksEstimate,
    status: req.body.status,
    chargeEstimate: req.body.chargeEstimate,
  };
  console.log(delivery);
  // Save Delivery in the database
  Delivery.create(delivery)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Delivery.",
      });
    });
};

// Find all Deliveries
exports.findAll = (req, res) => {
  const userId = req.params.userId;
  Delivery.findAll({
    order: [
      ["deliveryName", "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Deliveries.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Deliveries.",
      });
    });
};

// Find a single Delivery with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Delivery.findOne({
    where: { id: id },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Delivery with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Delivery with id=" + id,
      });
    });
};
// Update a Delivery by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Delivery.update(req.body, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Delivery was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Delivery with id=${id}. Maybe Delivery was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Delivery with id=" + id,
      });
    });
};
// Delete a Delivery with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Delivery.destroy({
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        res.send({
          message: "Delivery was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Delivery with id=${id}. Maybe Delivery was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Delivery with id=" + id,
      });
    });
};
// Delete all Deliveries from the database.
exports.deleteAll = (req, res) => {
  Delivery.destroy({
    where: {},
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Deliveries were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all deliveries.",
      });
    });
};
