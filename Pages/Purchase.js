import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const usersOfSignup = new SharedArray('users of signup', function () {
    return papaparse.parse(open('./Data/demoBlaze.csv'), { header: true }).data;
});
class Purchase {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.headers = { 'Content-Type': 'application/json' };
        this.usersOfSignup = usersOfSignup;
    }

    getPayload(user) {
        return JSON.stringify({
            cookie: user.username,
        });
    }

    purchase() {
        this.usersOfSignup.forEach((user) => {
            const payload = this.getPayload(user);
            const res = http.post(`${this.baseURL}/deletecart`, payload, {
                headers: this.headers,
            });
            check(res, {
                'status is 200': (r) => r.status === 200,
                'body contains "deletecart"': (r) => r.body.includes('deleted'),
            });

            return res.json();
        });
    }
}
export default Purchase;