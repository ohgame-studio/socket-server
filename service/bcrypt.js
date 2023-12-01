const bcrypt = require('bcrypt');
const logger = require("./log")
const saltRounds = 10;

async function encrypt(string_data) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(string_data, saltRounds)
            .then((hash) => {
                resolve(hash);
            })
            .catch((err) => {
                logger.error(err)
                reject(err);
            });
    });
}

async function compare(string_input, hash_code) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(string_input, hash_code)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                logger.error(err)
                reject(err);
            });
    });
}
module.exports={
    encrypt,
    compare
}