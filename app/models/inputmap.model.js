module.exports = (sequelize, Sequelize) => {
    const InputMap = sequelize.define("inputmap", {
      startNode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      endNode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      route: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      numOfBlocks: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: -1,
      },
    });
  
    return InputMap;
  };