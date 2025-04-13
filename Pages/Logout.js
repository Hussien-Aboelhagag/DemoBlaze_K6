import http from "k6/http";
import { check } from "k6";

class Logout {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }


    logout() {
        const res = http.get(`${this.baseURL}/entries`);
        check(res, {
            "status is 200": (r) => r.status === 200
        });
        return res.json();
    }
}

export default Logout;