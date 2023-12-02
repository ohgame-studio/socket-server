
const logger = require('../service/log');
const Servers = require("../models/server")
const bcrypt = require("../service/bcrypt");
const UUID = require("uuid")
const UserController = require("./users")
async function findServerByServerName(servername) {
    try {
        const server = await Servers.findOne({
            where: { servername: servername },
        })
        if (server) {
            return server;
        } else {
            return null;
        }
    } catch (err) {
        logger.error(err);
    }
}
async function addServer(servername, url, port ) {
    if (!servername || !url || !port) {
        logger.error("Missing parameter")
        return
    }
    
    let   usertype=0
    
    let server_by_name =await findServerByServerName(servername)
    
    if (!server_by_name) {
        try {
            const new_server = await Servers.create({
                servername: servername,
                url: url,
                port: port,
                usertype: usertype,
            })
            
            logger.log(servername + " created!")
            return new_server;
        } catch (err) {
            logger.log(err)
        }
    }else{
        logger.log(servername+ " is exist!")
    }

}
async function getServerListByUserType(usertype) {
    try {
        const server = await Servers.findAll({
            where: { usertype: usertype },
        })
        if (server) {
            return server;
        } else {
            return null;
        }
    } catch (err) {
        logger.error(err);
    }

}

module.exports = {
    getServerListByUserType,
    addServer
}