module.exports = (sequelize, Sequelize) => {
  const Delivery = sequelize.define("delivery", {
    collectionTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deliveryTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    blocksEstimate: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    chargeEstimate: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    }      
  });

  return Delivery;
};