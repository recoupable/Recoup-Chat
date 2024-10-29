"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/jose";
exports.ids = ["vendor-chunks/jose"];
exports.modules = {

/***/ "(ssr)/./node_modules/jose/dist/node/esm/lib/buffer_utils.js":
/*!*************************************************************!*\
  !*** ./node_modules/jose/dist/node/esm/lib/buffer_utils.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   concat: () => (/* binding */ concat),\n/* harmony export */   concatKdf: () => (/* binding */ concatKdf),\n/* harmony export */   decoder: () => (/* binding */ decoder),\n/* harmony export */   encoder: () => (/* binding */ encoder),\n/* harmony export */   lengthAndInput: () => (/* binding */ lengthAndInput),\n/* harmony export */   p2s: () => (/* binding */ p2s),\n/* harmony export */   uint32be: () => (/* binding */ uint32be),\n/* harmony export */   uint64be: () => (/* binding */ uint64be)\n/* harmony export */ });\n/* harmony import */ var _runtime_digest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../runtime/digest.js */ \"(ssr)/./node_modules/jose/dist/node/esm/runtime/digest.js\");\n\nconst encoder = new TextEncoder();\nconst decoder = new TextDecoder();\nconst MAX_INT32 = 2 ** 32;\nfunction concat(...buffers) {\n    const size = buffers.reduce((acc, { length }) => acc + length, 0);\n    const buf = new Uint8Array(size);\n    let i = 0;\n    buffers.forEach((buffer) => {\n        buf.set(buffer, i);\n        i += buffer.length;\n    });\n    return buf;\n}\nfunction p2s(alg, p2sInput) {\n    return concat(encoder.encode(alg), new Uint8Array([0]), p2sInput);\n}\nfunction writeUInt32BE(buf, value, offset) {\n    if (value < 0 || value >= MAX_INT32) {\n        throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);\n    }\n    buf.set([value >>> 24, value >>> 16, value >>> 8, value & 0xff], offset);\n}\nfunction uint64be(value) {\n    const high = Math.floor(value / MAX_INT32);\n    const low = value % MAX_INT32;\n    const buf = new Uint8Array(8);\n    writeUInt32BE(buf, high, 0);\n    writeUInt32BE(buf, low, 4);\n    return buf;\n}\nfunction uint32be(value) {\n    const buf = new Uint8Array(4);\n    writeUInt32BE(buf, value);\n    return buf;\n}\nfunction lengthAndInput(input) {\n    return concat(uint32be(input.length), input);\n}\nasync function concatKdf(secret, bits, value) {\n    const iterations = Math.ceil((bits >> 3) / 32);\n    const res = new Uint8Array(iterations * 32);\n    for (let iter = 0; iter < iterations; iter++) {\n        const buf = new Uint8Array(4 + secret.length + value.length);\n        buf.set(uint32be(iter + 1));\n        buf.set(secret, 4);\n        buf.set(value, 4 + secret.length);\n        res.set(await (0,_runtime_digest_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])('sha256', buf), iter * 32);\n    }\n    return res.slice(0, bits >> 3);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvam9zZS9kaXN0L25vZGUvZXNtL2xpYi9idWZmZXJfdXRpbHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQTBDO0FBQ25DO0FBQ0E7QUFDUDtBQUNPO0FBQ1Asd0NBQXdDLFFBQVE7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRCxjQUFjLGFBQWEsTUFBTTtBQUMzRjtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBLHVCQUF1QixtQkFBbUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsOERBQU07QUFDNUI7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hhdGJvdC8uL25vZGVfbW9kdWxlcy9qb3NlL2Rpc3Qvbm9kZS9lc20vbGliL2J1ZmZlcl91dGlscy5qcz81MDE3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkaWdlc3QgZnJvbSAnLi4vcnVudGltZS9kaWdlc3QuanMnO1xuZXhwb3J0IGNvbnN0IGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbmV4cG9ydCBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCk7XG5jb25zdCBNQVhfSU5UMzIgPSAyICoqIDMyO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdCguLi5idWZmZXJzKSB7XG4gICAgY29uc3Qgc2l6ZSA9IGJ1ZmZlcnMucmVkdWNlKChhY2MsIHsgbGVuZ3RoIH0pID0+IGFjYyArIGxlbmd0aCwgMCk7XG4gICAgY29uc3QgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7XG4gICAgbGV0IGkgPSAwO1xuICAgIGJ1ZmZlcnMuZm9yRWFjaCgoYnVmZmVyKSA9PiB7XG4gICAgICAgIGJ1Zi5zZXQoYnVmZmVyLCBpKTtcbiAgICAgICAgaSArPSBidWZmZXIubGVuZ3RoO1xuICAgIH0pO1xuICAgIHJldHVybiBidWY7XG59XG5leHBvcnQgZnVuY3Rpb24gcDJzKGFsZywgcDJzSW5wdXQpIHtcbiAgICByZXR1cm4gY29uY2F0KGVuY29kZXIuZW5jb2RlKGFsZyksIG5ldyBVaW50OEFycmF5KFswXSksIHAyc0lucHV0KTtcbn1cbmZ1bmN0aW9uIHdyaXRlVUludDMyQkUoYnVmLCB2YWx1ZSwgb2Zmc2V0KSB7XG4gICAgaWYgKHZhbHVlIDwgMCB8fCB2YWx1ZSA+PSBNQVhfSU5UMzIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYHZhbHVlIG11c3QgYmUgPj0gMCBhbmQgPD0gJHtNQVhfSU5UMzIgLSAxfS4gUmVjZWl2ZWQgJHt2YWx1ZX1gKTtcbiAgICB9XG4gICAgYnVmLnNldChbdmFsdWUgPj4+IDI0LCB2YWx1ZSA+Pj4gMTYsIHZhbHVlID4+PiA4LCB2YWx1ZSAmIDB4ZmZdLCBvZmZzZXQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVpbnQ2NGJlKHZhbHVlKSB7XG4gICAgY29uc3QgaGlnaCA9IE1hdGguZmxvb3IodmFsdWUgLyBNQVhfSU5UMzIpO1xuICAgIGNvbnN0IGxvdyA9IHZhbHVlICUgTUFYX0lOVDMyO1xuICAgIGNvbnN0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KDgpO1xuICAgIHdyaXRlVUludDMyQkUoYnVmLCBoaWdoLCAwKTtcbiAgICB3cml0ZVVJbnQzMkJFKGJ1ZiwgbG93LCA0KTtcbiAgICByZXR1cm4gYnVmO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVpbnQzMmJlKHZhbHVlKSB7XG4gICAgY29uc3QgYnVmID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gICAgd3JpdGVVSW50MzJCRShidWYsIHZhbHVlKTtcbiAgICByZXR1cm4gYnVmO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGxlbmd0aEFuZElucHV0KGlucHV0KSB7XG4gICAgcmV0dXJuIGNvbmNhdCh1aW50MzJiZShpbnB1dC5sZW5ndGgpLCBpbnB1dCk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29uY2F0S2RmKHNlY3JldCwgYml0cywgdmFsdWUpIHtcbiAgICBjb25zdCBpdGVyYXRpb25zID0gTWF0aC5jZWlsKChiaXRzID4+IDMpIC8gMzIpO1xuICAgIGNvbnN0IHJlcyA9IG5ldyBVaW50OEFycmF5KGl0ZXJhdGlvbnMgKiAzMik7XG4gICAgZm9yIChsZXQgaXRlciA9IDA7IGl0ZXIgPCBpdGVyYXRpb25zOyBpdGVyKyspIHtcbiAgICAgICAgY29uc3QgYnVmID0gbmV3IFVpbnQ4QXJyYXkoNCArIHNlY3JldC5sZW5ndGggKyB2YWx1ZS5sZW5ndGgpO1xuICAgICAgICBidWYuc2V0KHVpbnQzMmJlKGl0ZXIgKyAxKSk7XG4gICAgICAgIGJ1Zi5zZXQoc2VjcmV0LCA0KTtcbiAgICAgICAgYnVmLnNldCh2YWx1ZSwgNCArIHNlY3JldC5sZW5ndGgpO1xuICAgICAgICByZXMuc2V0KGF3YWl0IGRpZ2VzdCgnc2hhMjU2JywgYnVmKSwgaXRlciAqIDMyKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcy5zbGljZSgwLCBiaXRzID4+IDMpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/jose/dist/node/esm/lib/buffer_utils.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/jose/dist/node/esm/lib/is_object.js":
/*!**********************************************************!*\
  !*** ./node_modules/jose/dist/node/esm/lib/is_object.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ isObject)\n/* harmony export */ });\nfunction isObjectLike(value) {\n    return typeof value === 'object' && value !== null;\n}\nfunction isObject(input) {\n    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== '[object Object]') {\n        return false;\n    }\n    if (Object.getPrototypeOf(input) === null) {\n        return true;\n    }\n    let proto = input;\n    while (Object.getPrototypeOf(proto) !== null) {\n        proto = Object.getPrototypeOf(proto);\n    }\n    return Object.getPrototypeOf(input) === proto;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvam9zZS9kaXN0L25vZGUvZXNtL2xpYi9pc19vYmplY3QuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hhdGJvdC8uL25vZGVfbW9kdWxlcy9qb3NlL2Rpc3Qvbm9kZS9lc20vbGliL2lzX29iamVjdC5qcz9jZGQwIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsO1xufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNPYmplY3QoaW5wdXQpIHtcbiAgICBpZiAoIWlzT2JqZWN0TGlrZShpbnB1dCkgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKGlucHV0KSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbGV0IHByb3RvID0gaW5wdXQ7XG4gICAgd2hpbGUgKE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90bykgIT09IG51bGwpIHtcbiAgICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKGlucHV0KSA9PT0gcHJvdG87XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/jose/dist/node/esm/lib/is_object.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/jose/dist/node/esm/runtime/base64url.js":
/*!**************************************************************!*\
  !*** ./node_modules/jose/dist/node/esm/runtime/base64url.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   decode: () => (/* binding */ decode),\n/* harmony export */   decodeBase64: () => (/* binding */ decodeBase64),\n/* harmony export */   encode: () => (/* binding */ encode),\n/* harmony export */   encodeBase64: () => (/* binding */ encodeBase64)\n/* harmony export */ });\n/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! buffer */ \"buffer\");\n/* harmony import */ var _lib_buffer_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/buffer_utils.js */ \"(ssr)/./node_modules/jose/dist/node/esm/lib/buffer_utils.js\");\n\n\nlet encode;\nfunction normalize(input) {\n    let encoded = input;\n    if (encoded instanceof Uint8Array) {\n        encoded = _lib_buffer_utils_js__WEBPACK_IMPORTED_MODULE_1__.decoder.decode(encoded);\n    }\n    return encoded;\n}\nif (buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.isEncoding('base64url')) {\n    encode = (input) => buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(input).toString('base64url');\n}\nelse {\n    encode = (input) => buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\\+/g, '-').replace(/\\//g, '_');\n}\nconst decodeBase64 = (input) => buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(input, 'base64');\nconst encodeBase64 = (input) => buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(input).toString('base64');\n\nconst decode = (input) => buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(normalize(input), 'base64');\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvam9zZS9kaXN0L25vZGUvZXNtL3J1bnRpbWUvYmFzZTY0dXJsLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFnQztBQUNpQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix5REFBTztBQUN6QjtBQUNBO0FBQ0E7QUFDQSxJQUFJLDBDQUFNO0FBQ1Ysd0JBQXdCLDBDQUFNO0FBQzlCO0FBQ0E7QUFDQSx3QkFBd0IsMENBQU07QUFDOUI7QUFDTyxnQ0FBZ0MsMENBQU07QUFDdEMsZ0NBQWdDLDBDQUFNO0FBQzNCO0FBQ1gsMEJBQTBCLDBDQUFNIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hhdGJvdC8uL25vZGVfbW9kdWxlcy9qb3NlL2Rpc3Qvbm9kZS9lc20vcnVudGltZS9iYXNlNjR1cmwuanM/OTBlNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCdWZmZXIgfSBmcm9tICdidWZmZXInO1xuaW1wb3J0IHsgZGVjb2RlciB9IGZyb20gJy4uL2xpYi9idWZmZXJfdXRpbHMuanMnO1xubGV0IGVuY29kZTtcbmZ1bmN0aW9uIG5vcm1hbGl6ZShpbnB1dCkge1xuICAgIGxldCBlbmNvZGVkID0gaW5wdXQ7XG4gICAgaWYgKGVuY29kZWQgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgIGVuY29kZWQgPSBkZWNvZGVyLmRlY29kZShlbmNvZGVkKTtcbiAgICB9XG4gICAgcmV0dXJuIGVuY29kZWQ7XG59XG5pZiAoQnVmZmVyLmlzRW5jb2RpbmcoJ2Jhc2U2NHVybCcpKSB7XG4gICAgZW5jb2RlID0gKGlucHV0KSA9PiBCdWZmZXIuZnJvbShpbnB1dCkudG9TdHJpbmcoJ2Jhc2U2NHVybCcpO1xufVxuZWxzZSB7XG4gICAgZW5jb2RlID0gKGlucHV0KSA9PiBCdWZmZXIuZnJvbShpbnB1dCkudG9TdHJpbmcoJ2Jhc2U2NCcpLnJlcGxhY2UoLz0vZywgJycpLnJlcGxhY2UoL1xcKy9nLCAnLScpLnJlcGxhY2UoL1xcLy9nLCAnXycpO1xufVxuZXhwb3J0IGNvbnN0IGRlY29kZUJhc2U2NCA9IChpbnB1dCkgPT4gQnVmZmVyLmZyb20oaW5wdXQsICdiYXNlNjQnKTtcbmV4cG9ydCBjb25zdCBlbmNvZGVCYXNlNjQgPSAoaW5wdXQpID0+IEJ1ZmZlci5mcm9tKGlucHV0KS50b1N0cmluZygnYmFzZTY0Jyk7XG5leHBvcnQgeyBlbmNvZGUgfTtcbmV4cG9ydCBjb25zdCBkZWNvZGUgPSAoaW5wdXQpID0+IEJ1ZmZlci5mcm9tKG5vcm1hbGl6ZShpbnB1dCksICdiYXNlNjQnKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/jose/dist/node/esm/runtime/base64url.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/jose/dist/node/esm/runtime/digest.js":
/*!***********************************************************!*\
  !*** ./node_modules/jose/dist/node/esm/runtime/digest.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ \"crypto\");\n\nconst digest = (algorithm, data) => (0,crypto__WEBPACK_IMPORTED_MODULE_0__.createHash)(algorithm).update(data).digest();\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (digest);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvam9zZS9kaXN0L25vZGUvZXNtL3J1bnRpbWUvZGlnZXN0LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQW9DO0FBQ3BDLG9DQUFvQyxrREFBVTtBQUM5QyxpRUFBZSxNQUFNLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGF0Ym90Ly4vbm9kZV9tb2R1bGVzL2pvc2UvZGlzdC9ub2RlL2VzbS9ydW50aW1lL2RpZ2VzdC5qcz9hN2I3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUhhc2ggfSBmcm9tICdjcnlwdG8nO1xuY29uc3QgZGlnZXN0ID0gKGFsZ29yaXRobSwgZGF0YSkgPT4gY3JlYXRlSGFzaChhbGdvcml0aG0pLnVwZGF0ZShkYXRhKS5kaWdlc3QoKTtcbmV4cG9ydCBkZWZhdWx0IGRpZ2VzdDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/jose/dist/node/esm/runtime/digest.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/jose/dist/node/esm/util/base64url.js":
/*!***********************************************************!*\
  !*** ./node_modules/jose/dist/node/esm/util/base64url.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   decode: () => (/* binding */ decode),\n/* harmony export */   encode: () => (/* binding */ encode)\n/* harmony export */ });\n/* harmony import */ var _runtime_base64url_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../runtime/base64url.js */ \"(ssr)/./node_modules/jose/dist/node/esm/runtime/base64url.js\");\n\nconst encode = _runtime_base64url_js__WEBPACK_IMPORTED_MODULE_0__.encode;\nconst decode = _runtime_base64url_js__WEBPACK_IMPORTED_MODULE_0__.decode;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvam9zZS9kaXN0L25vZGUvZXNtL3V0aWwvYmFzZTY0dXJsLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFxRDtBQUM5QyxlQUFlLHlEQUFnQjtBQUMvQixlQUFlLHlEQUFnQiIsInNvdXJjZXMiOlsid2VicGFjazovL2NoYXRib3QvLi9ub2RlX21vZHVsZXMvam9zZS9kaXN0L25vZGUvZXNtL3V0aWwvYmFzZTY0dXJsLmpzPzBkZjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYmFzZTY0dXJsIGZyb20gJy4uL3J1bnRpbWUvYmFzZTY0dXJsLmpzJztcbmV4cG9ydCBjb25zdCBlbmNvZGUgPSBiYXNlNjR1cmwuZW5jb2RlO1xuZXhwb3J0IGNvbnN0IGRlY29kZSA9IGJhc2U2NHVybC5kZWNvZGU7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/jose/dist/node/esm/util/base64url.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/jose/dist/node/esm/util/decode_jwt.js":
/*!************************************************************!*\
  !*** ./node_modules/jose/dist/node/esm/util/decode_jwt.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   decodeJwt: () => (/* binding */ decodeJwt)\n/* harmony export */ });\n/* harmony import */ var _base64url_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base64url.js */ \"(ssr)/./node_modules/jose/dist/node/esm/util/base64url.js\");\n/* harmony import */ var _lib_buffer_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/buffer_utils.js */ \"(ssr)/./node_modules/jose/dist/node/esm/lib/buffer_utils.js\");\n/* harmony import */ var _lib_is_object_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/is_object.js */ \"(ssr)/./node_modules/jose/dist/node/esm/lib/is_object.js\");\n/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors.js */ \"(ssr)/./node_modules/jose/dist/node/esm/util/errors.js\");\n\n\n\n\nfunction decodeJwt(jwt) {\n    if (typeof jwt !== 'string')\n        throw new _errors_js__WEBPACK_IMPORTED_MODULE_0__.JWTInvalid('JWTs must use Compact JWS serialization, JWT must be a string');\n    const { 1: payload, length } = jwt.split('.');\n    if (length === 5)\n        throw new _errors_js__WEBPACK_IMPORTED_MODULE_0__.JWTInvalid('Only JWTs using Compact JWS serialization can be decoded');\n    if (length !== 3)\n        throw new _errors_js__WEBPACK_IMPORTED_MODULE_0__.JWTInvalid('Invalid JWT');\n    if (!payload)\n        throw new _errors_js__WEBPACK_IMPORTED_MODULE_0__.JWTInvalid('JWTs must contain a payload');\n    let decoded;\n    try {\n        decoded = (0,_base64url_js__WEBPACK_IMPORTED_MODULE_1__.decode)(payload);\n    }\n    catch {\n        throw new _errors_js__WEBPACK_IMPORTED_MODULE_0__.JWTInvalid('Failed to base64url decode the payload');\n    }\n    let result;\n    try {\n        result = JSON.parse(_lib_buffer_utils_js__WEBPACK_IMPORTED_MODULE_2__.decoder.decode(decoded));\n    }\n    catch {\n        throw new _errors_js__WEBPACK_IMPORTED_MODULE_0__.JWTInvalid('Failed to parse the decoded payload as JSON');\n    }\n    if (!(0,_lib_is_object_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(result))\n        throw new _errors_js__WEBPACK_IMPORTED_MODULE_0__.JWTInvalid('Invalid JWT Claims Set');\n    return result;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvam9zZS9kaXN0L25vZGUvZXNtL3V0aWwvZGVjb2RlX2p3dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFxRDtBQUNKO0FBQ047QUFDRjtBQUNsQztBQUNQO0FBQ0Esa0JBQWtCLGtEQUFVO0FBQzVCLFlBQVkscUJBQXFCO0FBQ2pDO0FBQ0Esa0JBQWtCLGtEQUFVO0FBQzVCO0FBQ0Esa0JBQWtCLGtEQUFVO0FBQzVCO0FBQ0Esa0JBQWtCLGtEQUFVO0FBQzVCO0FBQ0E7QUFDQSxrQkFBa0IscURBQVM7QUFDM0I7QUFDQTtBQUNBLGtCQUFrQixrREFBVTtBQUM1QjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIseURBQU87QUFDbkM7QUFDQTtBQUNBLGtCQUFrQixrREFBVTtBQUM1QjtBQUNBLFNBQVMsNkRBQVE7QUFDakIsa0JBQWtCLGtEQUFVO0FBQzVCO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGF0Ym90Ly4vbm9kZV9tb2R1bGVzL2pvc2UvZGlzdC9ub2RlL2VzbS91dGlsL2RlY29kZV9qd3QuanM/YWVhYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWNvZGUgYXMgYmFzZTY0dXJsIH0gZnJvbSAnLi9iYXNlNjR1cmwuanMnO1xuaW1wb3J0IHsgZGVjb2RlciB9IGZyb20gJy4uL2xpYi9idWZmZXJfdXRpbHMuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4uL2xpYi9pc19vYmplY3QuanMnO1xuaW1wb3J0IHsgSldUSW52YWxpZCB9IGZyb20gJy4vZXJyb3JzLmpzJztcbmV4cG9ydCBmdW5jdGlvbiBkZWNvZGVKd3Qoand0KSB7XG4gICAgaWYgKHR5cGVvZiBqd3QgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgSldUSW52YWxpZCgnSldUcyBtdXN0IHVzZSBDb21wYWN0IEpXUyBzZXJpYWxpemF0aW9uLCBKV1QgbXVzdCBiZSBhIHN0cmluZycpO1xuICAgIGNvbnN0IHsgMTogcGF5bG9hZCwgbGVuZ3RoIH0gPSBqd3Quc3BsaXQoJy4nKTtcbiAgICBpZiAobGVuZ3RoID09PSA1KVxuICAgICAgICB0aHJvdyBuZXcgSldUSW52YWxpZCgnT25seSBKV1RzIHVzaW5nIENvbXBhY3QgSldTIHNlcmlhbGl6YXRpb24gY2FuIGJlIGRlY29kZWQnKTtcbiAgICBpZiAobGVuZ3RoICE9PSAzKVxuICAgICAgICB0aHJvdyBuZXcgSldUSW52YWxpZCgnSW52YWxpZCBKV1QnKTtcbiAgICBpZiAoIXBheWxvYWQpXG4gICAgICAgIHRocm93IG5ldyBKV1RJbnZhbGlkKCdKV1RzIG11c3QgY29udGFpbiBhIHBheWxvYWQnKTtcbiAgICBsZXQgZGVjb2RlZDtcbiAgICB0cnkge1xuICAgICAgICBkZWNvZGVkID0gYmFzZTY0dXJsKHBheWxvYWQpO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIHRocm93IG5ldyBKV1RJbnZhbGlkKCdGYWlsZWQgdG8gYmFzZTY0dXJsIGRlY29kZSB0aGUgcGF5bG9hZCcpO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0O1xuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoZGVjb2Rlci5kZWNvZGUoZGVjb2RlZCkpO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIHRocm93IG5ldyBKV1RJbnZhbGlkKCdGYWlsZWQgdG8gcGFyc2UgdGhlIGRlY29kZWQgcGF5bG9hZCBhcyBKU09OJyk7XG4gICAgfVxuICAgIGlmICghaXNPYmplY3QocmVzdWx0KSlcbiAgICAgICAgdGhyb3cgbmV3IEpXVEludmFsaWQoJ0ludmFsaWQgSldUIENsYWltcyBTZXQnKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/jose/dist/node/esm/util/decode_jwt.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/jose/dist/node/esm/util/errors.js":
/*!********************************************************!*\
  !*** ./node_modules/jose/dist/node/esm/util/errors.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   JOSEAlgNotAllowed: () => (/* binding */ JOSEAlgNotAllowed),\n/* harmony export */   JOSEError: () => (/* binding */ JOSEError),\n/* harmony export */   JOSENotSupported: () => (/* binding */ JOSENotSupported),\n/* harmony export */   JWEDecompressionFailed: () => (/* binding */ JWEDecompressionFailed),\n/* harmony export */   JWEDecryptionFailed: () => (/* binding */ JWEDecryptionFailed),\n/* harmony export */   JWEInvalid: () => (/* binding */ JWEInvalid),\n/* harmony export */   JWKInvalid: () => (/* binding */ JWKInvalid),\n/* harmony export */   JWKSInvalid: () => (/* binding */ JWKSInvalid),\n/* harmony export */   JWKSMultipleMatchingKeys: () => (/* binding */ JWKSMultipleMatchingKeys),\n/* harmony export */   JWKSNoMatchingKey: () => (/* binding */ JWKSNoMatchingKey),\n/* harmony export */   JWKSTimeout: () => (/* binding */ JWKSTimeout),\n/* harmony export */   JWSInvalid: () => (/* binding */ JWSInvalid),\n/* harmony export */   JWSSignatureVerificationFailed: () => (/* binding */ JWSSignatureVerificationFailed),\n/* harmony export */   JWTClaimValidationFailed: () => (/* binding */ JWTClaimValidationFailed),\n/* harmony export */   JWTExpired: () => (/* binding */ JWTExpired),\n/* harmony export */   JWTInvalid: () => (/* binding */ JWTInvalid)\n/* harmony export */ });\nclass JOSEError extends Error {\n    static get code() {\n        return 'ERR_JOSE_GENERIC';\n    }\n    constructor(message) {\n        var _a;\n        super(message);\n        this.code = 'ERR_JOSE_GENERIC';\n        this.name = this.constructor.name;\n        (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, this.constructor);\n    }\n}\nclass JWTClaimValidationFailed extends JOSEError {\n    static get code() {\n        return 'ERR_JWT_CLAIM_VALIDATION_FAILED';\n    }\n    constructor(message, claim = 'unspecified', reason = 'unspecified') {\n        super(message);\n        this.code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';\n        this.claim = claim;\n        this.reason = reason;\n    }\n}\nclass JWTExpired extends JOSEError {\n    static get code() {\n        return 'ERR_JWT_EXPIRED';\n    }\n    constructor(message, claim = 'unspecified', reason = 'unspecified') {\n        super(message);\n        this.code = 'ERR_JWT_EXPIRED';\n        this.claim = claim;\n        this.reason = reason;\n    }\n}\nclass JOSEAlgNotAllowed extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JOSE_ALG_NOT_ALLOWED';\n    }\n    static get code() {\n        return 'ERR_JOSE_ALG_NOT_ALLOWED';\n    }\n}\nclass JOSENotSupported extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JOSE_NOT_SUPPORTED';\n    }\n    static get code() {\n        return 'ERR_JOSE_NOT_SUPPORTED';\n    }\n}\nclass JWEDecryptionFailed extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JWE_DECRYPTION_FAILED';\n        this.message = 'decryption operation failed';\n    }\n    static get code() {\n        return 'ERR_JWE_DECRYPTION_FAILED';\n    }\n}\nclass JWEDecompressionFailed extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JWE_DECOMPRESSION_FAILED';\n        this.message = 'decompression operation failed';\n    }\n    static get code() {\n        return 'ERR_JWE_DECOMPRESSION_FAILED';\n    }\n}\nclass JWEInvalid extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JWE_INVALID';\n    }\n    static get code() {\n        return 'ERR_JWE_INVALID';\n    }\n}\nclass JWSInvalid extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JWS_INVALID';\n    }\n    static get code() {\n        return 'ERR_JWS_INVALID';\n    }\n}\nclass JWTInvalid extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JWT_INVALID';\n    }\n    static get code() {\n        return 'ERR_JWT_INVALID';\n    }\n}\nclass JWKInvalid extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JWK_INVALID';\n    }\n    static get code() {\n        return 'ERR_JWK_INVALID';\n    }\n}\nclass JWKSInvalid extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JWKS_INVALID';\n    }\n    static get code() {\n        return 'ERR_JWKS_INVALID';\n    }\n}\nclass JWKSNoMatchingKey extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JWKS_NO_MATCHING_KEY';\n        this.message = 'no applicable key found in the JSON Web Key Set';\n    }\n    static get code() {\n        return 'ERR_JWKS_NO_MATCHING_KEY';\n    }\n}\nclass JWKSMultipleMatchingKeys extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';\n        this.message = 'multiple matching keys found in the JSON Web Key Set';\n    }\n    static get code() {\n        return 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';\n    }\n}\nSymbol.asyncIterator;\nclass JWKSTimeout extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JWKS_TIMEOUT';\n        this.message = 'request timed out';\n    }\n    static get code() {\n        return 'ERR_JWKS_TIMEOUT';\n    }\n}\nclass JWSSignatureVerificationFailed extends JOSEError {\n    constructor() {\n        super(...arguments);\n        this.code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';\n        this.message = 'signature verification failed';\n    }\n    static get code() {\n        return 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvam9zZS9kaXN0L25vZGUvZXNtL3V0aWwvZXJyb3JzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2hhdGJvdC8uL25vZGVfbW9kdWxlcy9qb3NlL2Rpc3Qvbm9kZS9lc20vdXRpbC9lcnJvcnMuanM/YjQxMCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgSk9TRUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIHN0YXRpYyBnZXQgY29kZSgpIHtcbiAgICAgICAgcmV0dXJuICdFUlJfSk9TRV9HRU5FUklDJztcbiAgICB9XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmNvZGUgPSAnRVJSX0pPU0VfR0VORVJJQyc7XG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgKF9hID0gRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKEVycm9yLCB0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSldUQ2xhaW1WYWxpZGF0aW9uRmFpbGVkIGV4dGVuZHMgSk9TRUVycm9yIHtcbiAgICBzdGF0aWMgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiAnRVJSX0pXVF9DTEFJTV9WQUxJREFUSU9OX0ZBSUxFRCc7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGNsYWltID0gJ3Vuc3BlY2lmaWVkJywgcmVhc29uID0gJ3Vuc3BlY2lmaWVkJykge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5jb2RlID0gJ0VSUl9KV1RfQ0xBSU1fVkFMSURBVElPTl9GQUlMRUQnO1xuICAgICAgICB0aGlzLmNsYWltID0gY2xhaW07XG4gICAgICAgIHRoaXMucmVhc29uID0gcmVhc29uO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBKV1RFeHBpcmVkIGV4dGVuZHMgSk9TRUVycm9yIHtcbiAgICBzdGF0aWMgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiAnRVJSX0pXVF9FWFBJUkVEJztcbiAgICB9XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgY2xhaW0gPSAndW5zcGVjaWZpZWQnLCByZWFzb24gPSAndW5zcGVjaWZpZWQnKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLmNvZGUgPSAnRVJSX0pXVF9FWFBJUkVEJztcbiAgICAgICAgdGhpcy5jbGFpbSA9IGNsYWltO1xuICAgICAgICB0aGlzLnJlYXNvbiA9IHJlYXNvbjtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSk9TRUFsZ05vdEFsbG93ZWQgZXh0ZW5kcyBKT1NFRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmNvZGUgPSAnRVJSX0pPU0VfQUxHX05PVF9BTExPV0VEJztcbiAgICB9XG4gICAgc3RhdGljIGdldCBjb2RlKCkge1xuICAgICAgICByZXR1cm4gJ0VSUl9KT1NFX0FMR19OT1RfQUxMT1dFRCc7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEpPU0VOb3RTdXBwb3J0ZWQgZXh0ZW5kcyBKT1NFRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmNvZGUgPSAnRVJSX0pPU0VfTk9UX1NVUFBPUlRFRCc7XG4gICAgfVxuICAgIHN0YXRpYyBnZXQgY29kZSgpIHtcbiAgICAgICAgcmV0dXJuICdFUlJfSk9TRV9OT1RfU1VQUE9SVEVEJztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSldFRGVjcnlwdGlvbkZhaWxlZCBleHRlbmRzIEpPU0VFcnJvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuY29kZSA9ICdFUlJfSldFX0RFQ1JZUFRJT05fRkFJTEVEJztcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gJ2RlY3J5cHRpb24gb3BlcmF0aW9uIGZhaWxlZCc7XG4gICAgfVxuICAgIHN0YXRpYyBnZXQgY29kZSgpIHtcbiAgICAgICAgcmV0dXJuICdFUlJfSldFX0RFQ1JZUFRJT05fRkFJTEVEJztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSldFRGVjb21wcmVzc2lvbkZhaWxlZCBleHRlbmRzIEpPU0VFcnJvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuY29kZSA9ICdFUlJfSldFX0RFQ09NUFJFU1NJT05fRkFJTEVEJztcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gJ2RlY29tcHJlc3Npb24gb3BlcmF0aW9uIGZhaWxlZCc7XG4gICAgfVxuICAgIHN0YXRpYyBnZXQgY29kZSgpIHtcbiAgICAgICAgcmV0dXJuICdFUlJfSldFX0RFQ09NUFJFU1NJT05fRkFJTEVEJztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSldFSW52YWxpZCBleHRlbmRzIEpPU0VFcnJvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuY29kZSA9ICdFUlJfSldFX0lOVkFMSUQnO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiAnRVJSX0pXRV9JTlZBTElEJztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSldTSW52YWxpZCBleHRlbmRzIEpPU0VFcnJvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuY29kZSA9ICdFUlJfSldTX0lOVkFMSUQnO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiAnRVJSX0pXU19JTlZBTElEJztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSldUSW52YWxpZCBleHRlbmRzIEpPU0VFcnJvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuY29kZSA9ICdFUlJfSldUX0lOVkFMSUQnO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiAnRVJSX0pXVF9JTlZBTElEJztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSldLSW52YWxpZCBleHRlbmRzIEpPU0VFcnJvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuY29kZSA9ICdFUlJfSldLX0lOVkFMSUQnO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiAnRVJSX0pXS19JTlZBTElEJztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSldLU0ludmFsaWQgZXh0ZW5kcyBKT1NFRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmNvZGUgPSAnRVJSX0pXS1NfSU5WQUxJRCc7XG4gICAgfVxuICAgIHN0YXRpYyBnZXQgY29kZSgpIHtcbiAgICAgICAgcmV0dXJuICdFUlJfSldLU19JTlZBTElEJztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSldLU05vTWF0Y2hpbmdLZXkgZXh0ZW5kcyBKT1NFRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmNvZGUgPSAnRVJSX0pXS1NfTk9fTUFUQ0hJTkdfS0VZJztcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gJ25vIGFwcGxpY2FibGUga2V5IGZvdW5kIGluIHRoZSBKU09OIFdlYiBLZXkgU2V0JztcbiAgICB9XG4gICAgc3RhdGljIGdldCBjb2RlKCkge1xuICAgICAgICByZXR1cm4gJ0VSUl9KV0tTX05PX01BVENISU5HX0tFWSc7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEpXS1NNdWx0aXBsZU1hdGNoaW5nS2V5cyBleHRlbmRzIEpPU0VFcnJvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuY29kZSA9ICdFUlJfSldLU19NVUxUSVBMRV9NQVRDSElOR19LRVlTJztcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gJ211bHRpcGxlIG1hdGNoaW5nIGtleXMgZm91bmQgaW4gdGhlIEpTT04gV2ViIEtleSBTZXQnO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiAnRVJSX0pXS1NfTVVMVElQTEVfTUFUQ0hJTkdfS0VZUyc7XG4gICAgfVxufVxuU3ltYm9sLmFzeW5jSXRlcmF0b3I7XG5leHBvcnQgY2xhc3MgSldLU1RpbWVvdXQgZXh0ZW5kcyBKT1NFRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmNvZGUgPSAnRVJSX0pXS1NfVElNRU9VVCc7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9ICdyZXF1ZXN0IHRpbWVkIG91dCc7XG4gICAgfVxuICAgIHN0YXRpYyBnZXQgY29kZSgpIHtcbiAgICAgICAgcmV0dXJuICdFUlJfSldLU19USU1FT1VUJztcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSldTU2lnbmF0dXJlVmVyaWZpY2F0aW9uRmFpbGVkIGV4dGVuZHMgSk9TRUVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5jb2RlID0gJ0VSUl9KV1NfU0lHTkFUVVJFX1ZFUklGSUNBVElPTl9GQUlMRUQnO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnc2lnbmF0dXJlIHZlcmlmaWNhdGlvbiBmYWlsZWQnO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0IGNvZGUoKSB7XG4gICAgICAgIHJldHVybiAnRVJSX0pXU19TSUdOQVRVUkVfVkVSSUZJQ0FUSU9OX0ZBSUxFRCc7XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/jose/dist/node/esm/util/errors.js\n");

/***/ })

};
;