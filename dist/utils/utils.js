"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT = exports.ORDER = exports.PRODUCT = exports.USER = exports.URL = exports.PORT = exports.IP = void 0;
// export const IP: string = 'localhost';
exports.IP = '10.0.0.139';
exports.PORT = 2020;
exports.URL = `http://${exports.IP}:${exports.PORT}`;
exports.USER = "/groceryplus/users";
exports.PRODUCT = "/groceryplus/products";
exports.ORDER = "/groceryplus/orders";
exports.PAYMENT = "/groceryplus/payments";
