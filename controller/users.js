const Users = require("../models/users")
const logger = require('../service/log');
const bcrypt=require("../service/bcrypt")
async function addUser(username, password) {
    try {
        const new_user = await Users.create({
            username: username,
            password: password
        })
        logger.log(username+" created!")
        return new_user;
    } catch (err) {
        logger.log(err)
    }
}
async function findUserById(id){
    try{
        const user=await Users.findOne({
            where:{id:id},
        })
        if (user){
            return user;
        }else{
            return null;
        }
    }catch(err){
        logger.error(err);
    }
}
async function findUserByUsernamePassword(username,password){
    try{
        const user=await Users.findOne({
            where:{username:username},
        })
        if (user && user.password==password){
            return user;
        }else{
            return null;
        }
    }catch(err){
        logger.error(err);
    }
}
async function compareHashWithPassByUser(hash,user){
    let isTrue=await bcrypt.compare(user.password,hash)
    if (isTrue){
        return true
    }
    return false
}
module.exports={
    addUser,
    findUserById,
    compareHashWithPassByUser,
    findUserByUsernamePassword,
}