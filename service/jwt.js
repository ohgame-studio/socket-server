require('dotenv').config()
var UserController=require("../controller/users")
const jwt = require('jsonwebtoken')
const logger=require("../service/log")
const bcrypt=require("./bcrypt")
const util = require('util');

const verifyAsync = util.promisify(jwt.verify);
async function createJWTByUser(user) {
    try {
        const accessToken = await jwt.sign({ id: user.id,hash:await bcrypt.encrypt(user.password) }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '24h',
        });
        return accessToken;
    } catch (err) {
        logger.log(err)
    }
}

async function getUserByJWT(jwt_string) {
    try {
        const payload = await verifyAsync(jwt_string, process.env.ACCESS_TOKEN_SECRET);

        let user = await UserController.findUserById(payload.id);

        if (user && (await UserController.compareHashWithPassByUser(payload.hash, user))) {
            return user;
        }

        logger.error("User not found or hash does not match");
        return null;
    } catch (err) {
        logger.error(err.message);
        return null;
    }
}

module.exports = {
    createJWTByUser,
    getUserByJWT
}