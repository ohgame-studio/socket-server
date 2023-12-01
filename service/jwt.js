require('dotenv').config()
var UserController=require("../controller/users")
const jwt = require('jsonwebtoken')
const logger=require("../service/log")
const bcrypt=require("./bcrypt")
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
        jwt.verify(jwt_string, process.env.ACCESS_TOKEN_SECRET, async function (err, payload) {

            if (err) {
                logger.error(err)
                return
            } else {
                let user = await UserController.findUserById(payload.id)
                if ((user)&&(await UserController.compareHashWithPassByUser(payload.hash,user))){
                    return user;
                }
                return
            }
        });

    } catch (err) {
        logger.error(err)
        return
    }
}
module.exports = {
    createJWTByUser,
    getUserByJWT
}