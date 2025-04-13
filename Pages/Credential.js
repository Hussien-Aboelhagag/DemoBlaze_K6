import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';


const usersOfSignup = new SharedArray('users of signup', function () {
    return papaparse.parse(open('./Data/demoBlaze.csv'), { header: true }).data;
});

const usersOfLogin = new SharedArray('users of login', function () {
    return papaparse.parse(open('./Data/demoBlazeLogindata.csv'), { header: true }).data;
});

class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.headers = { 'Content-Type': 'application/json' };
        // Load CSV data into SharedArray during instantiation
        this.usersOfSignup = usersOfSignup;
        this.usersOfLogin = usersOfLogin;
        this.token = null; // Initialize token to null
    }

    getPayload(user) {
        return JSON.stringify({
            username: user.username,
            password: user.password,
        });
    }

    getLandingPage() {
        const res = http.get(`${this.baseURL}/entries`);
        check(res, {
            'status is 200': (r) => r.status === 200,
            'body contains "phone"': (r) => r.body.includes('phone'),
        });
        return res.json();
    }

    postSignupForAllUsers() {
        this.usersOfSignup.forEach((user) => {
            const payload = this.getPayload(user);
            const res = http.post(`${this.baseURL}/signup`, payload, {
                headers: this.headers,
            });
            check(res, {
                'status is 200': (r) => r.status === 200,
                'body contains "" indicating successful signup': (r) => r.body.includes('""'),
            });
        });
    }

    postLoginForAllUsers() {
        this.usersOfSignup.forEach((user, index) => {
            const payload = this.getPayload(user);
            const res = http.post(`${this.baseURL}/login`, payload, {
                headers: this.headers,
            });
            check(res, {
                'status is 200': (r) => r.status === 200,
            });

            // Extract and save the token
            const responseBody = res.body; // e.g., "Auth_token: aHVzc2ljbjUwMTc0NDkxMg=="
            if (responseBody.includes('Auth_token')) {
                const token = responseBody.split('Auth_token: ')[1].trim();
                const tokenParts = token.split('"')[0];
                this.token = tokenParts; // Store the token in the instance
                console.log(`Token for user ${index + 1}: ${this.token}`);
            }
        });
    }

}
export default APIClient;