/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/make namespace object */
/******/ !function() {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ }();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var IntegrationConnect = /*#__PURE__*/function () {
  function IntegrationConnect() {
    var _this = this;
    _classCallCheck(this, IntegrationConnect);
    this.requests = {};
    this.subscribers = [];
    this.timeout_sec = 50;
    var onmessage = function onmessage(e) {
      // if (!this.isValidSource(e.origin, this.currIntegration.url_callback)){
      //     alert('Запрос с интеграции не корректен');
      //     return false;
      // }
      console.log('integration .onmessage ', 'e.origin=', e.origin, e.data);
      var message = e.data;
      if (message.hasOwnProperty('request') && message.hasOwnProperty('response')) {
        //full
        _this.handleResponse(message);
      } else {
        if (message.hasOwnProperty('request')) {
          _this.handleRequest(message);
        }
      }
    };
    if (window.addEventListener) {
      window.addEventListener('message', onmessage, false);
    } else if (window.attachEvent) {
      window.attachEvent('onmessage', onmessage);
    }
    setInterval(function () {
      var time = new Date().getTime();
      for (var id in _this.requests) {
        if (_this.requests.hasOwnProperty(id)) {
          var request = _this.requests[id];
          if (time > request.time + _this.timeout_sec * 1000) {
            request['response'] = {
              success: false,
              payload: {},
              message: "timeout",
              code: 1000
            };
            console.log('timeout request=', request);
            _this.handleResponse(request);
          }
        }
      }
    }, 5000);
  }
  _createClass(IntegrationConnect, [{
    key: "route",
    value: function route(type, callback) {
      this.subscribers.push({
        type: type,
        callback: callback
      });
    }
  }, {
    key: "send",
    value: function send() {
      console.log('.send', this);
      window.parent.postMessage(JSON.parse(JSON.stringify(this)), '*');
    }
  }, {
    key: "handleRequest",
    value: function handleRequest(message) {
      console.log('integration .handleRequest', message);
      var response = {
        success: true,
        payload: {}
      };
      message.send = this.send;
      message.response = response;
      try {
        var _iterator = _createForOfIteratorHelper(this.subscribers),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var subscriber = _step.value;
            if (subscriber.type === message.request.type) {
              subscriber.callback(message);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } catch (e) {
        response.success = false;
        response.error = e.message;
      }
      message.response = response;

      // window.parent.postMessage(JSON.parse(JSON.stringify(message)), '*');
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(message) {
      console.log('integration .handleResponse message=', message);
      if (message.id && this.requests.hasOwnProperty(message.id)) {
        var request = this.requests[message.id];
        request.callback(message.response);
        delete this.requests[message.id];
      } else {
        console.log('.handleResponse');
      }
    }
  }, {
    key: "sendRequest",
    value: function sendRequest(_message) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      try {
        var id = new Date().getTime();
        var message = {};
        message.id = id;
        message.callback = callback;
        message.request = _message;
        this.requests[id] = message;
        console.log('integration sendRequest ', message);
        window.parent.postMessage(JSON.parse(JSON.stringify(message)), '*');
      } catch (e) {
        console.log('.sendRequest', e);
      }
    }
  }, {
    key: "isValidSource",
    value: function isValidSource(url_source, url_integration) {
      return this.getHost(url_source) === this.getHost(url_integration);
    }
  }, {
    key: "getHost",
    value: function getHost(url) {
      var a = document.createElement('a');
      a.href = url;
      return a.hostname;
    }
  }]);
  return IntegrationConnect;
}();
/* harmony default export */ __webpack_exports__["default"] = (IntegrationConnect);

//# sourceMappingURL=bundle.js.map