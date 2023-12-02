
const logger = require("../service/log")
const playerSessions = {};
function getAllPlayerSessions() {
    return playerSessions
}
function getPlayerSessionsByUUID(uuid) {
    return playerSessions[uuid]
}
function addPlayerSessions(uuid, websocket) {
    playerSessions[uuid] = websocket
}
function disconnectByUUID(uuid) {
    playerSessions[uuid].close();
    // delete playerSessions[uuid];
    // logger.log(`Player ${uuid} logged out.`);
}
function disconnect(websocket) {
    const playerId = Object.keys(playerSessions).find((id) => playerSessions[id] === websocket);
    if (playerId) {
        delete playerSessions[playerId];
        logger.log(`Player ${playerId} connection closed.`);
    } else {
        logger.log(`Guest connection closed.`);
    }
}
function disconnectByWesocket(websocket) {
    websocket.close();
}
function connectToServer(uuid, websocket) {
    addPlayerSessions(uuid, websocket)
    logger.log(`Player ${uuid} logged in.`);
}
function sendJsonToAllPlayer(json_data) {
    Object.values(playerSessions).forEach((playerWebSocket) => {
            //   playerWebSocket.send(JSON.stringify({ type: 'chat', playerId, message: messageContent }));
            playerWebSocket.send(json_data);
    });
}
module.exports = {
    disconnectByWesocket,
    disconnect,
    addPlayerSessions,
    connectToServer,
    disconnectByUUID,
    sendJsonToAllPlayer,
    getPlayerSessionsByUUID
}