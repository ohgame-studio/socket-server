const Sequelize = require("sequelize");
const sequelize_db = require("../config/mysql")
const logger = require('../service/log');
const Server = sequelize_db.define('server', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    servername: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    port: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    usertype: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
});
async function syncData() {
    try {
        await Server.sync({ alter: true })
            .then(() => {
                logger.log('[Server] Sync database');
            })
    } catch (err) {
        logger.error(err);
    }
}

syncData()

module.exports=Server;