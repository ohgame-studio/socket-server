const Users = require("../models/users")
const logger = require('../service/log');
const bcrypt = require("../service/bcrypt");
const UUID = require("uuid")
async function addUser(username, password) {
    let user_by_name=await findUserByUsername(username)
    if (!user_by_name){
        try {
            const new_user = await Users.create({
                username: username,
                password: password
            })
            logger.log(username + " created!")
            return new_user;
        } catch (err) {
            logger.log(err)
        }
    }else{
        logger.log(username + " exist!")
    }
   
}
async function addUUIDByUser(user) {
    
    try {
        let uuid_create = UUID.v4()
        user.uuid = uuid_create;
        user.save();
        logger.log(user.username + " update!")
        return user;
    } catch (err) { 
        logger.log(err)
    }
}
async function findUserById(id) {
    try {
        const user = await Users.findOne({
            where: { id: id },
        })
        if (user) {
            return user;
        } else {
            return null;
        }
    } catch (err) {
        logger.error(err);
    }
}
async function findUserByUsername(username) {
    try {
        const user = await Users.findOne({
            where: { username: username },
        })
        if (user) {
            return user;
        } else {
            return null;
        }
    } catch (err) {
        logger.error(err);
    }
}
async function findUserByUUID(uuid) {
    try {
        const user = await Users.findOne({
            where: { uuid: uuid },
        })
        if (user) {
            return user;
        } else {
            return null;
        }
    } catch (err) {
        logger.error(err);
    }
}
async function findUserByUsernamePassword(username, password) {
    try {
        const user = await Users.findOne({
            where: { username: username },
        })
        if (user && user.password == password) {
            return user;
        } else {
            return null;
        }
    } catch (err) {
        logger.error(err);
    }
}
async function compareHashWithPassByUser(hash, user) {
    let isTrue = await bcrypt.compare(user.password, hash)
    if (isTrue) {
        return true
    }
    return false
}
module.exports = {
    addUser,
    addUUIDByUser,
    findUserById,
    compareHashWithPassByUser,
    findUserByUsernamePassword,
    findUserByUUID,
}