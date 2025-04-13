import { sleep } from 'k6';

import APIClient from './Pages/Credential.js'
import BrowserAndSelecting from './Pages/BrowserAndSelecting.js';
import AddToCart from './Pages/AddToCart.js';
import Purchase from './Pages/Purchase.js';
import Logout from './Pages/Logout.js';

export const options ={
    thresholds: {
        http_req_duration: ['p(95)<500'],
        'http_req_connecting': ['p(95)<500'],
        'http_req_blocked': ['p(95)<500'],
        'http_req_waiting': ['p(95)<500'],
        'http_req_sending': ['p(95)<500'],
        'http_req_receiving': ['p(95)<500'],
    },
    stages: [
        { duration: '11s', target: 10 }, // 0:00-0:11: Ramp to 10 VUs
        { duration: '3s', target: 50 }, // 0:11-0:14: Ramp to 50 VUs
        { duration: '8s', target: 50 }, // 0:14-0:22: Hold at 50 VUs
        { duration: '3s', target: 10 }, // 0:22-0:25: Drop to 10 VUs
        { duration: '11s', target: 10 }, // 0:25:-0:36: Hold at 10 VUs
        { duration: '3s', target: 50 }, // 0:36-0:39: Ramp to 50 VUs
        { duration: '8s', target: 50 }, // 0:39-0:47: Hold at 50 VUs
        { duration: '3s', target: 10 }, // 0:47-0:50: Drop to 10 VUs
        { duration: '8s', target: 10 }, // 0:50-0:58: Hold at 10 VUs
        { duration: '11s', target: 0 },  // 0:58-1:09: Drop to 0 VUs
      ],
}

export default function () {
    const endpoints=new APIClient("https://api.demoblaze.com");
    const browserAndSelecting=new BrowserAndSelecting("https://api.demoblaze.com");

    endpoints.getLandingPage();
    sleep(1);
    endpoints.postSignupForAllUsers();
    sleep(1);
    endpoints.postLoginForAllUsers();
    sleep(1);
    browserAndSelecting.selectCategory();
    sleep(1);
    browserAndSelecting.selectProduct();
    sleep(1);
    const addToCart=new AddToCart("https://api.demoblaze.com");
    addToCart.addToCart(endpoints.token);
    sleep(1);
    addToCart.navigateToCart();
    sleep(1);
    const purchase=new Purchase("https://api.demoblaze.com");
    purchase.purchase();
    sleep(1);
    const logout=new Logout("https://api.demoblaze.com");
    logout.logout();
    sleep(1);
}