import http from "../commons/http-common";

class UserService {
    login(data) {
        return http.post("/auth", {data});
    }
}

export default new UserService();