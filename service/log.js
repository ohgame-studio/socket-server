const fs = require('fs');
const os = require('os');

const logDirectory = 'logs';

const path = require('path');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');
const filelog = `logs_${year}${month}${day}${hours}${minutes}${seconds}.log`;


const hostname = 'localhost';
const isLocalhost = (process.env.NODE_ENV === undefined) || (process.env.NODE_ENV === hostname);
var filename = "logs.log";
if (isLocalhost) {
  filename = "logs.log";
} else {
  filename = filelog;
}
const logFilePath = path.join(logDirectory, filename);

function log(message) {
  const stack = new Error().stack.split('\n');
  const callingFunction = stack[2].trim().split(' ')[1];
  const filename_call = path.basename(callingFunction);
  const logMessage = `[${new Date().toISOString()}][${filename_call.padStart(25, ' ')}]: ${message}`;
  console.log(logMessage)
  fs.appendFile(logFilePath, logMessage + "\n", (err) => {
    if (err) {
      console.error('Lỗi khi ghi log:', err);
    }
  });
}
function error(message) {
    const stack = new Error().stack.split('\n');
    const callingFunction = stack[2].trim().split(' ')[1];
    const filename_call = path.basename(callingFunction);
    const logMessage = `[--ERROR--][${new Date().toISOString()}][${filename_call.padStart(25, ' ')}]: ${message}`;
    console.error(logMessage)
    fs.appendFile(logFilePath, logMessage + "\n", (err) => {
      if (err) {
        console.error('Lỗi khi ghi log:', err);
      }
    });
  }
module.exports = { log,error };
