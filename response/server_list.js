
class ServerListResponse {
    constructor(server_array) {
        this.data = [];

        Object.values(server_array).forEach((server) => {
            this.data.push({
                name: server.servername,
                url: `${server.url}:${server.port}`
            });
        });
        return this
    }
}
  
module.exports= ServerListResponse; 