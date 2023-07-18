module.exports = (sequelize, Sequelize) => {
  const Trip = sequelize.define("trip", {
    collectedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    startedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    blocksToOrigin: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    blocksToDestination: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });

  return Trip;
};  