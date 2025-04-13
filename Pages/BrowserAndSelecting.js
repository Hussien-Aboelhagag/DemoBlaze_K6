import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const categories = new SharedArray('categories', function () {
    return papaparse.parse(open('./Data/demoBlaze_Category.csv'), { header: true }).data;
});

class BrowserAndSelecting {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.headers = { 'Content-Type': 'application/json' };
        this.prodId=randomIntBetween(1, 9);
        this.categories = categories;
    }

    getPayloadForCategory(user) {
        return JSON.stringify({
            cat: user.Cat,
        });
    }
    getPayloadForProduct() {
        return JSON.stringify({
            id: `${this.prodId}`,
        });
    }

    selectCategory() {
        const randomCategory = randomItem(this.categories); // Pick a random category
        const payload = this.getPayloadForCategory(randomCategory);
        const res = http.post(`${this.baseURL}/bycat`, payload, {
            headers: this.headers,
        });
        check(res, {
            'status is 200': (r) => r.status === 200,
            'body contains selected category': (r) => r.body.includes(randomCategory.Cat),
        });
        return res.json();
    }

    selectProduct() {
        const payload = this.getPayloadForProduct();
        const res = http.post(`${this.baseURL}/view`, payload, {
            headers: this.headers,
        });
        check(res, {
            'status is 200': (r) => r.status === 200,
            'body contains selected product': (r) => r.body.includes(this.prodId),
        });
        return res.json();
    }
}
export default BrowserAndSelecting;