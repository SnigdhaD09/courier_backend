const db = require("../models");
const Delivery = db.delivery;
const Customer = db.customer;
const Trip = db.trip;
const User = db.user;
const InputMap = db.inputMap;
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
  }  else if (req.body.status === undefined) {
    req.body.status = 'Pending Pickup';
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

  Customer.findOne({
    where: {id: req.body.originCustomerId}
  }).then((originCustomerData)=> {
    Customer.findOne({
      where: {id: req.body.destinationCustomerId}
    }).then((destinationCustomerData)=> {
      InputMap.findOne({
        where: {
          startNode: originCustomerData.dataValues.location,
          endNode: destinationCustomerData.dataValues.location,
        }
      }).then((data)=>{
        delivery.blocksEstimate = data.dataValues.numOfBlocks;
        delivery.chargeEstimate = delivery.blocksEstimate * 1.5;
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

      }).catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching Map info.",
        });
      });  
    }).catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching destination customer info.",
        });
      });  
  }).catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while fetching origin customer info.",
      });
    });  
};

// Find all Deliveries
exports.findAll = (req, res) => {
  const userId = req.params.userId;
  Delivery.findAll({
    include: [
      {
        model: Customer,
        as: "originCustomer",
        required: false,
      },
      {
        model: Customer,
        as: "destinationCustomer",
        required: false,
      },
      {
        model: Trip,
        as: "trip",
        required: false,
      },
    ],
    order: [
      ["updatedAt", "DESC"],
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


// Find all Deliveries
exports.findAllByCustomer = (req, res) => {
  const customerId = req.params.customerId;
  Delivery.findAll({
    where: {
      originCustomerId: customerId
    },
    include: [
      {
        model: Customer,
        as: "originCustomer",
        required: false,
      },
      {
        model: Customer,
        as: "destinationCustomer",
        required: false,
      },
      {
        model: Trip,
        as: "trip",
        required: false,
      },
    ],
    order: [
      ["updatedAt", "DESC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Deliveries by Customer.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Deliveries by Customer.",
      });
    });
};

// Find all Deliveries
exports.findAllByCourier = (req, res) => {
  const courierId = req.params.courierId;
  Delivery.findAll({
    where: {
      '$trip.assignedCourierId$': courierId
    },
    include: [
      {
        model: Customer,
        as: "originCustomer",
        required: false,
      },
      {
        model: Customer,
        as: "destinationCustomer",
        required: false,
      },
      {
        model: Trip,
        as: "trip",
        required: false,
        include: {
          model: User,
          as: "assignedCourier",
          required: false,
        },
      },      
    ],
    order: [
      ["updatedAt", "DESC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Deliveries by Courier.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Deliveries by Courier.",
      });
    });
};

// Find a single Delivery with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Delivery.findOne({
    where: { id: id },
    include: [
      {
        model: Customer,
        as: "originCustomer",
        required: false,
      },
      {
        model: Customer,
        as: "destinationCustomer",
        required: false,
      },
      {
        model: Trip,
        as: "trip",
        required: false,
      },
    ],
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
// Update a Delivery with the status in the request
exports.statusUpdate = (req, res) => {
  const id = req.params.id;
  const newDelivery = req.body.newDelivery;
  const newTrip = req.body.newTrip;
  Delivery.update(newDelivery, {
    where: { id: id },
  })
    .then((number) => {
      if (number == 1) {
        Trip.update(newTrip, {
          where: { deliveryId: id },
        })
          .then((data) => {
              res.send({
                message: "Trip was updated successfully.",
              });
            }).catch((err) => {
              res.status(500).send({
                message: err.message || "Error updating Trip with deliveryId=" + id,
              });
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

// Assign a Courier to a Delivery
exports.assignCourier = (req, res) => {
  const id = req.params.deliveryId;
  const assignedCourierId = req.params.courierId;
  Trip.findOne({
    where: { deliveryId: id },
  })
    .then((data) => {

      var newTrip = {};
      if (data) {
        newTrip = data.dataValues;
        newTrip.assignedCourierId = assignedCourierId;
        //Found trip, so update
        return Trip.update(newTrip, {
                  where: { deliveryId: newTrip.deliveryId },
                })
                .then((data) => {
                  res.send(data);
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message || "Some error occurred while updating the Trip.",
                  });
                });;     
      } else {
        //Trip not found, create one
        newTrip = {
          deliveryId: id,
          assignedCourierId: assignedCourierId,
        };
        return Trip.create(newTrip)
                .then((data) => {
                  console.log(data);
                  Delivery.update({tripId: data.dataValues.id}, {where: {id: id}})
                  .then((data) => {
                    res.send(data);
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message:
                        err.message || "Some error occurred while updating tripId in Delivery.",
                    });
                  });;     
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message || "Some error occurred while creating the Trip.",
                  });
                });;
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Delivery with id=" + id,
      });
    });
};