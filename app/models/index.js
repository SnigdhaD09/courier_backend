const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.session = require("./session.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);

db.delivery = require("./delivery.model.js")(sequelize, Sequelize);
db.customer = require("./customer.model.js")(sequelize, Sequelize);
db.cost = require("./cost.model.js")(sequelize, Sequelize);
db.trip = require("./trip.model.js")(sequelize, Sequelize);

// foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.session.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for trip
db.user.hasMany(
  db.trip,
  { as: "trip" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
db.trip.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);


// foreign keys for daysites

db.customer.hasOne(db.delivery, {as: "deliveryorigin", foreignKey: "originCustomerId"});
db.customer.hasOne(db.delivery, {as: "deliverydestination", foreignKey: "destinationCustomerId"});

db.delivery.belongsTo(db.trip);

module.exports = db;