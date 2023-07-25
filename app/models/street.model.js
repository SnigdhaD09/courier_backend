module.exports = (sequelize, Sequelize) => {
    const Street = sequelize.define("street", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      direction: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      twoWay: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    });
    return Street;
  };
  