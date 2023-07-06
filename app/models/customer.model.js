const { saltSize, keySize } = require("../authentication/crypto");

module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customer", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    delivery: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Customer;
};