import http from 'k6/http';
import { check } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';


class AddToCart {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.headers = { 'Content-Type': 'application/json' };
        this.prodId = randomIntBetween(1, 9);
    }

    getPayloadForAddToCart(token) {
        return JSON.stringify({
          id: '56265434-d5e8-18b7-4d26-734078ff2a10',
          cookie: token, // Use the specific token
          prod_id: this.prodId,
          flag: true,
        });
      }

    getPayloadForNavigateToCart() {
        return JSON.stringify({
            id: this.prodId,
        });
    }
    addToCart(tokens) {
        
          const payload = this.getPayloadForAddToCart(tokens);
          const res = http.post(`${this.baseURL}/addtocart`, payload, {
            headers: this.headers,
          });
          check(res, {
            'status is 200': (r) => r.status === 200,
          });
      }
    navigateToCart() {
        const payload = this.getPayloadForNavigateToCart();
        const res = http.post(`${this.baseURL}/view`, payload, {
            headers: this.headers,
        });
        check(res, {
            'status is 200': (r) => r.status === 200,
        });
        return res.json();
    } 
}
export default AddToCart;