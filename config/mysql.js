const Sequelize = require("sequelize");

var database_name="miniiovn_myfish_demo"
var username="miniiovn_ohgame_myfish"
var password="ohgame_myfish"
var host='103.130.217.55'
const logger = require('../service/log');

const sequelize_db = new Sequelize(database_name, username, password, {
  host: host,
  dialect: 'mysql',
  logging:false
});

async function connectToDatabase() {
    try {
      await sequelize_db.sync();
      Sequelize.options.logging = false;
      logger.log('Connected to MySQL.');
    } catch (error) {
    logger.error(error);
    }
  }
  
  connectToDatabase();
  module.exports = sequelize_db;