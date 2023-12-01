const Sequelize = require("sequelize");
const sequelize_db = require("../config/mysql")
const logger = require('../service/log');
const User = sequelize_db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
});
async function syncData() {
    try {
        await User.sync()
            .then(() => {
                logger.log('[User] Sync database');
            })
    } catch (err) {
        logger.error(error);
    }
}

syncData()


module.exports=User;