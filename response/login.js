const jwt=require("../service/jwt")
class LoginResponse {
    constructor(user, jwt) {
        this.data = {
            username: user.username,
            token: jwt
        };
    }
}
  
module.exports= LoginResponse;