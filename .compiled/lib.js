"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.square = square;
exports.diag = diag;
exports.sum = sum;
exports.sqrt = void 0;
var sqrt = Math.sqrt;
exports.sqrt = sqrt;

function square(x) {
  return x * x;
}

function diag(x, y) {
  return sqrt(square(x) + square(y));
}

function sum(a, b) {
  return a + b;
}
//# sourceMappingURL=lib.js.map