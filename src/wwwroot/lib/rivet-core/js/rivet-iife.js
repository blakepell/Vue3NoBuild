/*!
 * rivet-core - @version 2.2.0

 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Rivet = function (exports) {
  'use strict';

  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
      var el = this;
      var ancestor = this;

      if (!document.documentElement.contains(el)) {
        return null;
      }

      do {
        if (ancestor.matches(selector)) {
          return ancestor;
        }

        ancestor = ancestor.parentElement;
      } while (ancestor !== null);

      return null;
    };
  }

  (function () {
    if (typeof window.CustomEvent === 'function') {
      return false;
    }

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var customEvent = document.createEvent('CustomEvent');
      customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return customEvent;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  })();

  if (!Array.from) {
    Array.from = function () {
      var symbolIterator;

      try {
        symbolIterator = Symbol.iterator ? Symbol.iterator : 'Symbol(Symbol.iterator)';
      } catch (e) {
        symbolIterator = 'Symbol(Symbol.iterator)';
      }

      var toStr = Object.prototype.toString;

      var isCallable = function isCallable(fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };

      var toInteger = function toInteger(value) {
        var number = Number(value);
        if (isNaN(number)) return 0;
        if (number === 0 || !isFinite(number)) return number;
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };

      var maxSafeInteger = Math.pow(2, 53) - 1;

      var toLength = function toLength(value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      var setGetItemHandler = function setGetItemHandler(isIterator, items) {
        var iterator = isIterator && items[symbolIterator]();
        return function getItem(k) {
          return isIterator ? iterator.next() : items[k];
        };
      };

      var getArray = function getArray(T, A, len, getItem, isIterator, mapFn) {
        var k = 0;

        while (k < len || isIterator) {
          var item = getItem(k);
          var kValue = isIterator ? item.value : item;

          if (isIterator && item.done) {
            return A;
          } else {
            if (mapFn) {
              A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
            } else {
              A[k] = kValue;
            }
          }

          k += 1;
        }

        if (isIterator) {
          throw new TypeError('Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1');
        } else {
          A.length = len;
        }

        return A;
      };

      return function from(arrayLikeOrIterator) {
        var C = this;
        var items = Object(arrayLikeOrIterator);
        var isIterator = isCallable(items[symbolIterator]);

        if (arrayLikeOrIterator == null && !isIterator) {
          throw new TypeError('Array.from requires an array-like object or iterator - not null or undefined');
        }

        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;

        if (typeof mapFn !== 'undefined') {
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        var len = toLength(items.length);
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
        return getArray(T, A, len, setGetItemHandler(isIterator, items), isIterator, mapFn);
      };
    }();
  }

  (function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('remove')) {
        return;
      }

      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          if (this.parentNode === null) {
            return;
          }

          this.parentNode.removeChild(this);
        }
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

  "inert" in HTMLElement.prototype || (Object.defineProperty(HTMLElement.prototype, "inert", {
    enumerable: !0,
    get: function get() {
      return this.hasAttribute("inert");
    },
    set: function set(h) {
      h ? this.setAttribute("inert", "") : this.removeAttribute("inert");
    }
  }), window.addEventListener("load", function () {
    function h(a) {
      var b = null;

      try {
        b = new KeyboardEvent("keydown", {
          keyCode: 9,
          which: 9,
          key: "Tab",
          code: "Tab",
          keyIdentifier: "U+0009",
          shiftKey: !!a,
          bubbles: !0
        });
      } catch (g) {
        try {
          b = document.createEvent("KeyboardEvent"), b.initKeyboardEvent("keydown", !0, !0, window, "Tab", 0, a ? "Shift" : "", !1, "en");
        } catch (d) {}
      }

      if (b) {
        try {
          Object.defineProperty(b, "keyCode", {
            value: 9
          });
        } catch (g) {}

        document.dispatchEvent(b);
      }
    }

    function k(a) {
      for (; a && a !== document.documentElement;) {
        if (a.hasAttribute("inert")) return a;
        a = a.parentElement;
      }

      return null;
    }

    function e(a) {
      var b = a.path;
      return b && b[0] || a.target;
    }

    function l(a) {
      a.path[a.path.length - 1] !== window && (m(e(a)), a.preventDefault(), a.stopPropagation());
    }

    function m(a) {
      var b = k(a);

      if (b) {
        if (document.hasFocus() && 0 !== f) {
          var g = (c || document).activeElement;
          h(0 > f ? !0 : !1);
          if (g != (c || document).activeElement) return;
          var d = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
            acceptNode: function acceptNode(a) {
              return !a || !a.focus || 0 > a.tabIndex ? NodeFilter.FILTER_SKIP : b.contains(a) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
          });
          d.currentNode = b;
          d = (-1 === Math.sign(f) ? d.previousNode : d.nextNode).bind(d);

          for (var e; e = d();) {
            if (e.focus(), (c || document).activeElement !== g) return;
          }
        }

        a.blur();
      }
    }

    (function (a) {
      var b = document.createElement("style");
      b.type = "text/css";
      b.styleSheet ? b.styleSheet.cssText = a : b.appendChild(document.createTextNode(a));
      document.body.appendChild(b);
    })("/*[inert]*/*[inert]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}");

    var n = function n(a) {
      return null;
    };

    window.ShadowRoot && (n = function n(a) {
      for (; a && a !== document.documentElement;) {
        if (a instanceof window.ShadowRoot) return a;
        a = a.parentNode;
      }

      return null;
    });
    var f = 0;
    document.addEventListener("keydown", function (a) {
      f = 9 === a.keyCode ? a.shiftKey ? -1 : 1 : 0;
    });
    document.addEventListener("mousedown", function (a) {
      f = 0;
    });
    var c = null;
    document.body.addEventListener("focus", function (a) {
      var b = e(a);
      a = b == a.target ? null : n(b);

      if (a != c) {
        if (c) {
          if (!(c instanceof window.ShadowRoot)) throw Error("not shadow root: " + c);
          c.removeEventListener("focusin", l, !0);
        }

        a && a.addEventListener("focusin", l, !0);
        c = a;
      }

      m(b);
    }, !0);
    document.addEventListener("click", function (a) {
      var b = e(a);
      k(b) && (a.preventDefault(), a.stopPropagation());
    }, !0);
  }));
  var globalSettings = {
    prefix: 'rvt'
  };
  var Lie = typeof Promise === 'function' ? Promise : function (fn) {
    var queue = [],
        resolved = 0,
        value;
    fn(function ($) {
      value = $;
      resolved = 1;
      queue.splice(0).forEach(then);
    });
    return {
      then: then
    };

    function then(fn) {
      return resolved ? setTimeout(fn, 0, value) : queue.push(fn), this;
    }
  };
  var TRUE = true,
      FALSE = false;
  var QSA = 'querySelectorAll';

  function add(node) {
    this.observe(node, {
      subtree: TRUE,
      childList: TRUE
    });
  }

  var notify = function notify(callback, root, MO) {
    var loop = function loop(nodes, added, removed, connected, pass) {
      for (var i = 0, length = nodes.length; i < length; i++) {
        var node = nodes[i];

        if (pass || QSA in node) {
          if (connected) {
            if (!added.has(node)) {
              added.add(node);
              removed["delete"](node);
              callback(node, connected);
            }
          } else if (!removed.has(node)) {
            removed.add(node);
            added["delete"](node);
            callback(node, connected);
          }

          if (!pass) loop(node[QSA]('*'), added, removed, connected, TRUE);
        }
      }
    };

    var observer = new (MO || MutationObserver)(function (records) {
      for (var added = new Set(), removed = new Set(), i = 0, length = records.length; i < length; i++) {
        var _records$i = records[i],
            addedNodes = _records$i.addedNodes,
            removedNodes = _records$i.removedNodes;
        loop(removedNodes, added, removed, FALSE, FALSE);
        loop(addedNodes, added, removed, TRUE, FALSE);
      }
    });
    observer.add = add;
    observer.add(root || document);
    return observer;
  };

  var QSA$1 = 'querySelectorAll';
  var _self = self,
      document$1 = _self.document,
      Element$1 = _self.Element,
      MutationObserver$1 = _self.MutationObserver,
      Set$1 = _self.Set,
      WeakMap$1 = _self.WeakMap;

  var elements = function elements(element) {
    return QSA$1 in element;
  };

  var filter = [].filter;

  var QSAO = function QSAO(options) {
    var live = new WeakMap$1();

    var drop = function drop(elements) {
      for (var i = 0, length = elements.length; i < length; i++) {
        live["delete"](elements[i]);
      }
    };

    var flush = function flush() {
      var records = observer.takeRecords();

      for (var i = 0, length = records.length; i < length; i++) {
        parse(filter.call(records[i].removedNodes, elements), false);
        parse(filter.call(records[i].addedNodes, elements), true);
      }
    };

    var matches = function matches(element) {
      return element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
    };

    var notifier = function notifier(element, connected) {
      var selectors;

      if (connected) {
        for (var q, m = matches(element), i = 0, length = query.length; i < length; i++) {
          if (m.call(element, q = query[i])) {
            if (!live.has(element)) live.set(element, new Set$1());
            selectors = live.get(element);

            if (!selectors.has(q)) {
              selectors.add(q);
              options.handle(element, connected, q);
            }
          }
        }
      } else if (live.has(element)) {
        selectors = live.get(element);
        live["delete"](element);
        selectors.forEach(function (q) {
          options.handle(element, connected, q);
        });
      }
    };

    var parse = function parse(elements) {
      var connected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      for (var i = 0, length = elements.length; i < length; i++) {
        notifier(elements[i], connected);
      }
    };

    var query = options.query;
    var root = options.root || document$1;
    var observer = notify(notifier, root, MutationObserver$1);
    var attachShadow = Element$1.prototype.attachShadow;
    if (attachShadow) Element$1.prototype.attachShadow = function (init) {
      var shadowRoot = attachShadow.call(this, init);
      observer.add(shadowRoot);
      return shadowRoot;
    };
    if (query.length) parse(root[QSA$1](query));
    return {
      drop: drop,
      flush: flush,
      observer: observer,
      parse: parse
    };
  };

  var create = Object.create,
      keys = Object.keys;
  var attributes = new WeakMap();
  var lazy = new Set();
  var query = [];
  var config = {};
  var defined = {};

  var attributeChangedCallback = function attributeChangedCallback(records, o) {
    for (var h = attributes.get(o), i = 0, length = records.length; i < length; i++) {
      var _records$i2 = records[i],
          target = _records$i2.target,
          attributeName = _records$i2.attributeName,
          oldValue = _records$i2.oldValue;
      var newValue = target.getAttribute(attributeName);
      h.attributeChanged(attributeName, oldValue, newValue);
    }
  };

  var set = function set(value, m, l, o) {
    var handler = create(o, {
      element: {
        enumerable: true,
        value: value
      }
    });

    for (var i = 0, length = l.length; i < length; i++) {
      value.addEventListener(l[i].t, handler, l[i].o);
    }

    m.set(value, handler);
    if (handler.init) handler.init();
    var observedAttributes = o.observedAttributes;

    if (observedAttributes) {
      var mo = new MutationObserver(attributeChangedCallback);
      mo.observe(value, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: observedAttributes.map(function (attributeName) {
          if (value.hasAttribute(attributeName)) handler.attributeChanged(attributeName, null, value.getAttribute(attributeName));
          return attributeName;
        })
      });
      attributes.set(mo, handler);
    }

    return handler;
  };

  var _QSAO = QSAO({
    query: query,
    handle: function handle(element, connected, selector) {
      var _config$selector = config[selector],
          m = _config$selector.m,
          l = _config$selector.l,
          o = _config$selector.o;
      var handler = m.get(element) || set(element, m, l, o);
      var method = connected ? 'connected' : 'disconnected';
      if (method in handler) handler[method]();
    }
  }),
      drop = _QSAO.drop,
      flush = _QSAO.flush,
      parse = _QSAO.parse;

  var define = function define(selector, definition) {
    if (-1 < query.indexOf(selector)) throw new Error('duplicated: ' + selector);
    flush();
    var listeners = [];
    var retype = create(null);

    for (var k = keys(definition), i = 0, length = k.length; i < length; i++) {
      var key = k[i];

      if (/^on/.test(key) && !/Options$/.test(key)) {
        var options = definition[key + 'Options'] || false;
        var lower = key.toLowerCase();
        var type = lower.slice(2);
        listeners.push({
          t: type,
          o: options
        });
        retype[type] = key;

        if (lower !== key) {
          type = key.slice(2, 3).toLowerCase() + key.slice(3);
          retype[type] = key;
          listeners.push({
            t: type,
            o: options
          });
        }
      }
    }

    if (listeners.length) {
      definition.handleEvent = function (event) {
        this[retype[event.type]](event);
      };
    }

    query.push(selector);
    config[selector] = {
      m: new WeakMap(),
      l: listeners,
      o: definition
    };
    parse(document.querySelectorAll(selector));
    whenDefined(selector);
    if (!lazy.has(selector)) defined[selector]._();
  };

  var whenDefined = function whenDefined(selector) {
    if (!(selector in defined)) {
      var _,
          $ = new Lie(function ($) {
        _ = $;
      });

      defined[selector] = {
        _: _,
        $: $
      };
    }

    return defined[selector].$;
  };

  var Component = /*#__PURE__*/function () {
    function Component() {
      _classCallCheck(this, Component);
    }

    _createClass(Component, null, [{
      key: "initAll",
      value: function initAll() {
        this.init(this.selector);
      }
    }, {
      key: "init",
      value: function init(selector) {
        define(selector, this.methods);
        return document.querySelector(selector);
      }
    }, {
      key: "selector",
      get: function get() {}
    }, {
      key: "methods",
      get: function get() {}
    }, {
      key: "bindMethodToDOMElement",
      value: function bindMethodToDOMElement(self, name, method) {
        Object.defineProperty(self.element, name, {
          value: method.bind(self),
          writable: false
        });
      }
    }, {
      key: "dispatchCustomEvent",
      value: function dispatchCustomEvent(eventName, element) {
        var detail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var prefix = globalSettings.prefix;
        var event = new CustomEvent("".concat(prefix).concat(eventName), {
          bubbles: true,
          cancelable: true,
          detail: detail
        });
        return element.dispatchEvent(event);
      }
    }, {
      key: "dispatchComponentAddedEvent",
      value: function dispatchComponentAddedEvent(element) {
        return this.dispatchCustomEvent('ComponentAdded', document, {
          component: element
        });
      }
    }, {
      key: "dispatchComponentRemovedEvent",
      value: function dispatchComponentRemovedEvent(element) {
        return this.dispatchCustomEvent('ComponentRemoved', document, {
          component: element
        });
      }
    }, {
      key: "watchForDOMChanges",
      value: function watchForDOMChanges(self) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        self.observer = new MutationObserver(function (mutationList, observer) {
          self._initElements();

          if (callback) {
            callback();
          }
        });
        self.observer.observe(self.element, {
          childList: true,
          subtree: true
        });
      }
    }, {
      key: "stopWatchingForDOMChanges",
      value: function stopWatchingForDOMChanges(self) {
        self.observer.disconnect();
      }
    }]);

    return Component;
  }();

  var keyCodes = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    tab: 9,
    enter: 13,
    escape: 27,
    home: 36,
    end: 35,
    pageUp: 33,
    pageDown: 34
  };

  var Accordion = /*#__PURE__*/function (_Component) {
    _inherits(Accordion, _Component);

    var _super = _createSuper(Accordion);

    function Accordion() {
      _classCallCheck(this, Accordion);

      return _super.apply(this, arguments);
    }

    _createClass(Accordion, null, [{
      key: "selector",
      get: function get() {
        return '[data-rvt-accordion]';
      }
    }, {
      key: "methods",
      get: function get() {
        return {
          init: function init() {
            this._initSelectors();

            this._initElements();

            this._setInitialPanelStates();

            Component.bindMethodToDOMElement(this, 'open', this.open);
            Component.bindMethodToDOMElement(this, 'close', this.close);
          },
          _initSelectors: function _initSelectors() {
            this.triggerAttribute = 'data-rvt-accordion-trigger';
            this.panelAttribute = 'data-rvt-accordion-panel';
            this.triggerSelector = "[".concat(this.triggerAttribute, "]");
            this.panelSelector = "[".concat(this.panelAttribute, "]");
          },
          _initElements: function _initElements() {
            this.triggers = Array.from(this.element.querySelectorAll(this.triggerSelector));
            this.panels = Array.from(this.element.querySelectorAll(this.panelSelector));
          },
          _setInitialPanelStates: function _setInitialPanelStates() {
            this._shouldOpenAllPanels() ? this._openAllPanels() : this._setPanelDefaultStates();
          },
          _shouldOpenAllPanels: function _shouldOpenAllPanels() {
            return this.element.hasAttribute('data-rvt-accordion-open-all');
          },
          _openAllPanels: function _openAllPanels() {
            var _this = this;

            this.panels.forEach(function (panel, index) {
              return _this._openPanel(index);
            });
          },
          _setPanelDefaultStates: function _setPanelDefaultStates() {
            var _this2 = this;

            this.panels.forEach(function (panel) {
              _this2._panelShouldBeOpen(panel) ? _this2.open(panel.getAttribute(_this2.panelAttribute)) : _this2.close(panel.getAttribute(_this2.panelAttribute));
            });
          },
          _panelShouldBeOpen: function _panelShouldBeOpen(panel) {
            return panel.hasAttribute('data-rvt-accordion-panel-init');
          },
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
            Component.watchForDOMChanges(this);
          },
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
            Component.stopWatchingForDOMChanges(this);
          },
          onClick: function onClick(event) {
            if (!this._eventOriginatedInsideTrigger(event)) {
              return;
            }

            this._setTriggerToToggle(event);

            this._triggerToToggleIsOpen() ? this.close(this.triggerToToggleId) : this.open(this.triggerToToggleId);
          },
          _eventOriginatedInsideTrigger: function _eventOriginatedInsideTrigger(event) {
            return event.target.closest(this.triggerSelector);
          },
          _setTriggerToToggle: function _setTriggerToToggle(event) {
            this.triggerToToggle = event.target.closest(this.triggerSelector);
            this.triggerToToggleId = this.triggerToToggle.getAttribute(this.triggerAttribute);
          },
          _triggerToToggleIsOpen: function _triggerToToggleIsOpen() {
            return this.triggerToToggle.getAttribute('aria-expanded') === 'true';
          },
          onKeydown: function onKeydown(event) {
            if (!this._eventOriginatedInsideTrigger(event)) {
              return;
            }

            this._setNeighboringTriggerIndexes(event);

            switch (event.keyCode) {
              case keyCodes.up:
                this._focusPreviousTrigger();

                break;

              case keyCodes.down:
                this._focusNextTrigger();

                break;

              case keyCodes.home:
                this._focusFirstTrigger();

                break;

              case keyCodes.end:
                this._focusLastTrigger();

                break;
            }
          },
          _setNeighboringTriggerIndexes: function _setNeighboringTriggerIndexes(event) {
            var currentTrigger = event.target.closest(this.triggerSelector);
            this.previousTriggerIndex = this.triggers.indexOf(currentTrigger) - 1;
            this.nextTriggerIndex = this.triggers.indexOf(currentTrigger) + 1;
          },
          _focusPreviousTrigger: function _focusPreviousTrigger() {
            this.triggers[this.previousTriggerIndex] ? this.triggers[this.previousTriggerIndex].focus() : this.triggers[this.triggers.length - 1].focus();
          },
          _focusNextTrigger: function _focusNextTrigger() {
            this.triggers[this.nextTriggerIndex] ? this.triggers[this.nextTriggerIndex].focus() : this.triggers[0].focus();
          },
          _focusFirstTrigger: function _focusFirstTrigger() {
            this.triggers[0].focus();
          },
          _focusLastTrigger: function _focusLastTrigger() {
            this.triggers[this.triggers.length - 1].focus();
          },
          open: function open(panelId) {
            this._setPanelToOpen(panelId);

            if (!this._panelToOpenExists()) {
              console.warn("No such accordion panel '".concat(panelId, "' in open()"));
              return;
            }

            if (!this._eventDispatched('AccordionOpened', this.panelToOpen)) {
              return;
            }

            this._openPanel();
          },
          _setPanelToOpen: function _setPanelToOpen(panelId) {
            this.triggerToOpen = this.element.querySelector("[".concat(this.triggerAttribute, " = \"").concat(panelId, "\"]"));
            this.panelToOpen = this.element.querySelector("[".concat(this.panelAttribute, " = \"").concat(panelId, "\"]"));
          },
          _panelToOpenExists: function _panelToOpenExists() {
            return this.panelToOpen;
          },
          _openPanel: function _openPanel() {
            this.triggerToOpen.setAttribute('aria-expanded', 'true');
            this.panelToOpen.removeAttribute('hidden');
          },
          close: function close(panelId) {
            this._setPanelToClose(panelId);

            if (!this._panelToCloseExists()) {
              console.warn("No such accordion panel '".concat(panelId, "' in close()"));
              return;
            }

            if (!this._eventDispatched('AccordionClosed', this.panelToClose)) {
              return;
            }

            this._closePanel();
          },
          _setPanelToClose: function _setPanelToClose(panelId) {
            this.triggerToClose = this.element.querySelector("[".concat(this.triggerAttribute, " = \"").concat(panelId, "\"]"));
            this.panelToClose = this.element.querySelector("[".concat(this.panelAttribute, " = \"").concat(panelId, "\"]"));
          },
          _panelToCloseExists: function _panelToCloseExists() {
            return this.panelToClose;
          },
          _closePanel: function _closePanel() {
            this.triggerToClose.setAttribute('aria-expanded', 'false');
            this.panelToClose.setAttribute('hidden', '');
          },
          _eventDispatched: function _eventDispatched(name, panel) {
            var dispatched = Component.dispatchCustomEvent(name, this.element, {
              panel: panel
            });
            return dispatched;
          }
        };
      }
    }]);

    return Accordion;
  }(Component);

  var Alert = /*#__PURE__*/function (_Component2) {
    _inherits(Alert, _Component2);

    var _super2 = _createSuper(Alert);

    function Alert() {
      _classCallCheck(this, Alert);

      return _super2.apply(this, arguments);
    }

    _createClass(Alert, null, [{
      key: "selector",
      get: function get() {
        return '[data-rvt-alert]';
      }
    }, {
      key: "methods",
      get: function get() {
        return {
          init: function init() {
            this._initSelectors();

            this._initElements();

            Component.bindMethodToDOMElement(this, 'dismiss', this.dismiss);
          },
          _initSelectors: function _initSelectors() {
            this.closeButtonAttribute = 'data-rvt-alert-close';
            this.closeButtonSelector = "[".concat(this.closeButtonAttribute, "]");
          },
          _initElements: function _initElements() {
            this.closeButton = this.element.querySelector(this.closeButtonSelector);
          },
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
          },
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
          },
          onClick: function onClick(event) {
            if (this._clickOriginatedInsideCloseButton(event)) {
              this.dismiss();
            }
          },
          _clickOriginatedInsideCloseButton: function _clickOriginatedInsideCloseButton(event) {
            return this.closeButton && this.closeButton.contains(event.target);
          },
          dismiss: function dismiss() {
            if (!this._dismissEventDispatched()) {
              return;
            }

            this.element.remove();
          },
          _dismissEventDispatched: function _dismissEventDispatched() {
            var dispatched = Component.dispatchCustomEvent('AlertDismissed', this.element);
            return dispatched;
          }
        };
      }
    }]);

    return Alert;
  }(Component);

  var Dialog = /*#__PURE__*/function (_Component3) {
    _inherits(Dialog, _Component3);

    var _super3 = _createSuper(Dialog);

    function Dialog() {
      _classCallCheck(this, Dialog);

      return _super3.apply(this, arguments);
    }

    _createClass(Dialog, null, [{
      key: "selector",
      get: function get() {
        return '[data-rvt-dialog]';
      }
    }, {
      key: "methods",
      get: function get() {
        return {
          init: function init() {
            this._initSelectors();

            this._initElements();

            this._initProperties();

            this._initAttributes();

            this._makeDialogFirstElementInBody();

            this._bindExternalEventHandlers();

            Component.bindMethodToDOMElement(this, 'open', this.open);
            Component.bindMethodToDOMElement(this, 'close', this.close);
            Component.bindMethodToDOMElement(this, 'focusTrigger', this.focusTrigger);
            Component.bindMethodToDOMElement(this, 'focusDialog', this.focusDialog);
          },
          _initSelectors: function _initSelectors() {
            this.dialogAttribute = 'data-rvt-dialog';
            this.triggerAttribute = 'data-rvt-dialog-trigger';
            this.closeButtonAttribute = 'data-rvt-dialog-close';
            this.modalAttribute = 'data-rvt-dialog-modal';
            this.disablePageInteractionAttribute = 'data-rvt-dialog-disable-page-interaction';
            this.triggerSelector = "[".concat(this.triggerAttribute, "]");
            this.closeButtonSelector = "[".concat(this.closeButtonAttribute, "]");
          },
          _initElements: function _initElements() {
            var dialogId = this.element.getAttribute(this.dialogAttribute);
            this.triggerButtons = Array.from(document.querySelectorAll("[".concat(this.triggerAttribute, " = \"").concat(dialogId, "\"]")));
            this.closeButtons = Array.from(this.element.querySelectorAll(this.closeButtonSelector));
            this.lastClickedTriggerButton = null;
          },
          _initProperties: function _initProperties() {
            this.id = this.element.getAttribute('id');
            this.isOpen = false;
            this.isModal = this.element.hasAttribute(this.modalAttribute);
          },
          _initAttributes: function _initAttributes() {
            if (this.isModal) {
              this.element.setAttribute('aria-modal', 'true');
            }
          },
          _makeDialogFirstElementInBody: function _makeDialogFirstElementInBody() {
            var body = document.body;
            var currentFirstElement = body.firstElementChild;
            body.insertBefore(this.element, currentFirstElement);
          },
          _bindExternalEventHandlers: function _bindExternalEventHandlers() {
            this._onTriggerClick = this._onTriggerClick.bind(this);
            this._onDocumentClick = this._onDocumentClick.bind(this);
          },
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
            Component.watchForDOMChanges(this);

            this._addTriggerEventHandlers();

            this._addDocumentEventHandlers();

            if (this._shouldBeOpenByDefault()) {
              this.open();
            }
          },
          _shouldBeOpenByDefault: function _shouldBeOpenByDefault() {
            return this.element.hasAttribute('data-rvt-dialog-open-on-init');
          },
          _addTriggerEventHandlers: function _addTriggerEventHandlers() {
            var _this3 = this;

            if (!this._hasTriggerButton()) {
              return;
            }

            this.triggerButtons.forEach(function (button) {
              button.addEventListener('click', _this3._onTriggerClick, false);
            });
          },
          _hasTriggerButton: function _hasTriggerButton() {
            return this.triggerButtons.length;
          },
          _addDocumentEventHandlers: function _addDocumentEventHandlers() {
            document.addEventListener('click', this._onDocumentClick, false);
          },
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
            Component.stopWatchingForDOMChanges(this);

            this._removeTriggerEventHandlers();

            this._removeDocumentEventHandlers();
          },
          _removeTriggerEventHandlers: function _removeTriggerEventHandlers() {
            var _this4 = this;

            if (!this._hasTriggerButton()) {
              return;
            }

            this.triggerButtons.forEach(function (button) {
              button.removeEventListener('click', _this4._onTriggerClick, false);
            });
          },
          _removeDocumentEventHandlers: function _removeDocumentEventHandlers() {
            document.removeEventListener('click', this._onDocumentClick, false);
          },
          onClick: function onClick(event) {
            if (!this._isOpen()) {
              return;
            }

            if (!this._clickOriginatedInCloseButton(event)) {
              return;
            }

            this.close();
          },
          _isOpen: function _isOpen() {
            return this.isOpen;
          },
          _clickOriginatedInCloseButton: function _clickOriginatedInCloseButton(event) {
            return event.target.closest(this.closeButtonSelector);
          },
          _onTriggerClick: function _onTriggerClick(event) {
            this._setLastClickedTriggerButton(event);

            this._isOpen() ? this.close() : this.open();
          },
          _setLastClickedTriggerButton: function _setLastClickedTriggerButton(event) {
            this.lastClickedTriggerButton = event.target.closest(this.triggerSelector);
          },
          _onDocumentClick: function _onDocumentClick(event) {
            if (this._clickOriginatedInsideDialogOrTrigger(event)) {
              return;
            }

            if (!this._isOpen()) {
              return;
            }

            if (this._shouldCloseOnClickOutside()) {
              return;
            }

            this.close();
          },
          _clickOriginatedInsideDialogOrTrigger: function _clickOriginatedInsideDialogOrTrigger(event) {
            return event.target.closest(this.triggerSelector) || event.composedPath().some(function (el) {
              return el.dataset && 'rvtDialog' in el.dataset;
            });
          },
          _shouldCloseOnClickOutside: function _shouldCloseOnClickOutside() {
            return !this.isModal;
          },
          onKeydown: function onKeydown(event) {
            switch (event.keyCode) {
              case keyCodes.tab:
                this._setFocusableChildElements();

                this._shiftKeyPressed(event) ? this._handleBackwardTab(event) : this._handleForwardTab(event);
                break;

              case keyCodes.escape:
                if (!this._shouldCloseOnClickOutside()) {
                  this.close();
                }

                break;
            }
          },
          _setFocusableChildElements: function _setFocusableChildElements() {
            this.focusableChildElements = this.element.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="-1"]');
            this.firstFocusableChildElement = this.focusableChildElements[0];
            this.lastFocusableChildElement = this.focusableChildElements[this.focusableChildElements.length - 1];
          },
          _shiftKeyPressed: function _shiftKeyPressed(event) {
            return event.shiftKey;
          },
          _handleBackwardTab: function _handleBackwardTab(event) {
            if (this._shouldTrapBackwardTabFocus()) {
              event.preventDefault();
              this.lastFocusableChildElement.focus();
            }
          },
          _shouldTrapBackwardTabFocus: function _shouldTrapBackwardTabFocus() {
            return document.activeElement === this.firstFocusableChildElement || document.activeElement === this.element;
          },
          _handleForwardTab: function _handleForwardTab(event) {
            if (this._shouldTrapForwardTabFocus()) {
              event.preventDefault();
              this.firstFocusableChildElement.focus();
            }
          },
          _shouldTrapForwardTabFocus: function _shouldTrapForwardTabFocus() {
            return document.activeElement === this.lastFocusableChildElement;
          },
          open: function open() {
            if (this._isOpen()) {
              return;
            }

            if (!this._eventDispatched('DialogOpened')) {
              return;
            }

            this._setOpenState();

            this.focusDialog();

            if (this._shouldDisablePageInteraction()) {
              this._disablePageInteraction();
            }
          },
          _setOpenState: function _setOpenState() {
            this.isOpen = true;
            this.element.removeAttribute('hidden');

            if (this.isModal) {
              document.body.classList.add('rvt-dialog-prevent-scroll');
            }
          },
          focusDialog: function focusDialog() {
            this.element.focus();
          },
          _shouldDisablePageInteraction: function _shouldDisablePageInteraction() {
            return this.element.hasAttribute(this.disablePageInteractionAttribute);
          },
          _disablePageInteraction: function _disablePageInteraction() {
            this._getDirectChildrenOfBody().forEach(function (child) {
              child.setAttribute('inert', '');
              child.setAttribute('aria-hidden', 'true');
            });
          },
          _getDirectChildrenOfBody: function _getDirectChildrenOfBody() {
            return Array.from(document.querySelectorAll("body > *:not([".concat(this.dialogAttribute, "])")));
          },
          close: function close() {
            if (!this._isOpen()) {
              return;
            }

            if (!this._eventDispatched('DialogClosed')) {
              return;
            }

            this._setClosedState();

            if (this._shouldDisablePageInteraction()) {
              this._enablePageInteraction();
            }

            if (this._hasTriggerButton()) {
              this.focusTrigger();
            }
          },
          _setClosedState: function _setClosedState() {
            this.isOpen = false;
            this.element.setAttribute('hidden', '');
            document.body.classList.remove('rvt-dialog-prevent-scroll');
          },
          _enablePageInteraction: function _enablePageInteraction() {
            this._getDirectChildrenOfBody().forEach(function (child) {
              child.removeAttribute('inert');
              child.removeAttribute('aria-hidden');
            });
          },
          focusTrigger: function focusTrigger() {
            if (!this._hasTriggerButton()) {
              console.warn("Could not find a trigger button for dialog ID '".concat(this.id, "'"));
              return;
            }

            this.lastClickedTriggerButton && document.body.contains(this.lastClickedTriggerButton) ? this.lastClickedTriggerButton.focus() : this.triggerButtons[0].focus();
          },
          _eventDispatched: function _eventDispatched(name) {
            var dispatched = Component.dispatchCustomEvent(name, this.element);
            return dispatched;
          }
        };
      }
    }]);

    return Dialog;
  }(Component);

  var Disclosure = /*#__PURE__*/function (_Component4) {
    _inherits(Disclosure, _Component4);

    var _super4 = _createSuper(Disclosure);

    function Disclosure() {
      _classCallCheck(this, Disclosure);

      return _super4.apply(this, arguments);
    }

    _createClass(Disclosure, null, [{
      key: "selector",
      get: function get() {
        return '[data-rvt-disclosure]';
      }
    }, {
      key: "methods",
      get: function get() {
        return {
          init: function init() {
            this._initSelectors();

            this._initElements();

            this._initProperties();

            this._setInitialDisclosureState();

            this._removeIconFromTabOrder();

            this._bindExternalEventHandlers();

            Component.bindMethodToDOMElement(this, 'open', this.open);
            Component.bindMethodToDOMElement(this, 'close', this.close);
          },
          _initSelectors: function _initSelectors() {
            this.toggleAttribute = 'data-rvt-disclosure-toggle';
            this.targetAttribute = 'data-rvt-disclosure-target';
            this.toggleSelector = "[".concat(this.toggleAttribute, "]");
            this.targetSelector = "[".concat(this.targetAttribute, "]");
          },
          _initElements: function _initElements() {
            this.toggleElement = this.element.querySelector(this.toggleSelector);
            this.targetElement = this.element.querySelector(this.targetSelector);
          },
          _initProperties: function _initProperties() {
            this.isOpen = false;
          },
          _setInitialDisclosureState: function _setInitialDisclosureState() {
            if (this._shouldBeOpenByDefault()) {
              this.open();
            }
          },
          _shouldBeOpenByDefault: function _shouldBeOpenByDefault() {
            return this.element.hasAttribute('data-rvt-disclosure-open-on-init');
          },
          _removeIconFromTabOrder: function _removeIconFromTabOrder() {
            var icon = this.element.querySelector('svg');

            if (icon) {
              icon.setAttribute('focusable', 'false');
            }
          },
          _bindExternalEventHandlers: function _bindExternalEventHandlers() {
            this._onDocumentClick = this._onDocumentClick.bind(this);
          },
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);

            if (this._shouldAddDocumentEventHandlers()) {
              this._addDocumentEventHandlers();
            }
          },
          _shouldAddDocumentEventHandlers: function _shouldAddDocumentEventHandlers() {
            return this.element.hasAttribute('data-rvt-close-click-outside');
          },
          _addDocumentEventHandlers: function _addDocumentEventHandlers() {
            document.addEventListener('click', this._onDocumentClick, false);
          },
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);

            this._removeDocumentEventHandlers();
          },
          _removeDocumentEventHandlers: function _removeDocumentEventHandlers() {
            document.removeEventListener('click', this._onDocumentClick, false);
          },
          open: function open() {
            if (this._isDisabled()) {
              return;
            }

            if (!this._eventDispatched('DisclosureOpened')) {
              return;
            }

            this._setOpenState();
          },
          _isDisabled: function _isDisabled() {
            return this.toggleElement.hasAttribute('disabled');
          },
          _setOpenState: function _setOpenState() {
            this.toggleElement.setAttribute('aria-expanded', 'true');
            this.targetElement.removeAttribute('hidden');
            this.isOpen = true;
          },
          close: function close() {
            if (!this._isOpen()) {
              return;
            }

            if (!this._eventDispatched('DisclosureClosed')) {
              return;
            }

            this._setClosedState();
          },
          _isOpen: function _isOpen() {
            return this.isOpen;
          },
          _setClosedState: function _setClosedState() {
            this.toggleElement.setAttribute('aria-expanded', 'false');
            this.targetElement.setAttribute('hidden', '');
            this.isOpen = false;
          },
          _eventDispatched: function _eventDispatched(name) {
            var dispatched = Component.dispatchCustomEvent(name, this.element);
            return dispatched;
          },
          onClick: function onClick(event) {
            if (this._clickOriginatedInsideDisclosureTarget(event)) {
              return;
            }

            this._isOpen() ? this.close() : this.open();
          },
          _clickOriginatedInsideDisclosureTarget: function _clickOriginatedInsideDisclosureTarget(event) {
            return this.targetElement.contains(event.target);
          },
          _onDocumentClick: function _onDocumentClick(event) {
            if (!this._clickOriginatedOutsideDisclosure(event)) {
              return;
            }

            if (!this._isOpen()) {
              return;
            }

            this.close();
          },
          _clickOriginatedOutsideDisclosure: function _clickOriginatedOutsideDisclosure(event) {
            return !this.element.contains(event.target);
          },
          onKeydown: function onKeydown(event) {
            if (event.keyCode === keyCodes.escape) {
              this.close();
              this.toggleElement.focus();
            }
          }
        };
      }
    }]);

    return Disclosure;
  }(Component);

  var Dropdown = /*#__PURE__*/function (_Component5) {
    _inherits(Dropdown, _Component5);

    var _super5 = _createSuper(Dropdown);

    function Dropdown() {
      _classCallCheck(this, Dropdown);

      return _super5.apply(this, arguments);
    }

    _createClass(Dropdown, null, [{
      key: "selector",
      get: function get() {
        return '[data-rvt-dropdown]';
      }
    }, {
      key: "methods",
      get: function get() {
        return {
          init: function init() {
            this._initSelectors();

            this._initElements();

            this._initProperties();

            this._initMenuItems();

            this._removeIconFromTabOrder();

            this._bindExternalEventHandlers();

            Component.bindMethodToDOMElement(this, 'open', this.open);
            Component.bindMethodToDOMElement(this, 'close', this.close);
          },
          _initSelectors: function _initSelectors() {
            this.toggleAttribute = 'data-rvt-dropdown-toggle';
            this.menuAttribute = 'data-rvt-dropdown-menu';
            this.toggleSelector = "[".concat(this.toggleAttribute, "]");
            this.menuSelector = "[".concat(this.menuAttribute, "]");
          },
          _initElements: function _initElements() {
            this.toggleElement = this.element.querySelector(this.toggleSelector);
            this.menuElement = this.element.querySelector(this.menuSelector);
          },
          _initProperties: function _initProperties() {
            this.isOpen = false;
          },
          _initMenuItems: function _initMenuItems() {
            var focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]';
            this.menuItems = Array.from(this.menuElement.querySelectorAll(focusableElements));
            this.firstMenuItem = this.menuItems[0];
            this.lastMenuItem = this.menuItems[this.menuItems.length - 1];
          },
          _removeIconFromTabOrder: function _removeIconFromTabOrder() {
            var icon = this.element.querySelector('svg');

            if (icon) {
              icon.setAttribute('focusable', 'false');
            }
          },
          _bindExternalEventHandlers: function _bindExternalEventHandlers() {
            this._onDocumentClick = this._onDocumentClick.bind(this);
          },
          connected: function connected() {
            var _this5 = this;

            Component.dispatchComponentAddedEvent(this.element);
            Component.watchForDOMChanges(this, function () {
              return _this5._initMenuItems();
            });

            this._addDocumentEventHandlers();
          },
          _addDocumentEventHandlers: function _addDocumentEventHandlers() {
            document.addEventListener('click', this._onDocumentClick, false);
          },
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
            Component.stopWatchingForDOMChanges(this);

            this._removeDocumentEventHandlers();
          },
          _removeDocumentEventHandlers: function _removeDocumentEventHandlers() {
            document.removeEventListener('click', this._onDocumentClick, false);
          },
          open: function open() {
            if (this._toggleElementIsDisabled()) {
              return;
            }

            if (!this._eventDispatched('DropdownOpened')) {
              return;
            }

            this._setOpenState();
          },
          _toggleElementIsDisabled: function _toggleElementIsDisabled() {
            return this.toggleElement.hasAttribute('disabled');
          },
          _setOpenState: function _setOpenState() {
            this.toggleElement.setAttribute('aria-expanded', 'true');
            this.menuElement.removeAttribute('hidden');
            this.firstMenuItem.focus();
            this.isOpen = true;
          },
          close: function close() {
            if (!this._isOpen()) {
              return;
            }

            if (!this._eventDispatched('DropdownClosed')) {
              return;
            }

            this._setClosedState();
          },
          _isOpen: function _isOpen() {
            return this.isOpen;
          },
          _setClosedState: function _setClosedState() {
            this.toggleElement.setAttribute('aria-expanded', 'false');
            this.menuElement.setAttribute('hidden', '');
            this.isOpen = false;
          },
          _eventDispatched: function _eventDispatched(name) {
            var dispatched = Component.dispatchCustomEvent(name, this.element);
            return dispatched;
          },
          onClick: function onClick(event) {
            if (this._eventOriginatedInsideMenu(event)) {
              return;
            }

            this._isOpen() ? this.close() : this.open();
          },
          _eventOriginatedInsideMenu: function _eventOriginatedInsideMenu(event) {
            return this.menuElement.contains(event.target);
          },
          _onDocumentClick: function _onDocumentClick(event) {
            if (!this._clickOriginatedOutsideDropdown(event)) {
              return;
            }

            if (!this._isOpen()) {
              return;
            }

            this.close();
          },
          _clickOriginatedOutsideDropdown: function _clickOriginatedOutsideDropdown(event) {
            return !this.element.contains(event.target);
          },
          onKeydown: function onKeydown(event) {
            switch (event.keyCode) {
              case keyCodes.escape:
                this._handleEscapeKey();

                break;

              case keyCodes.up:
                this._handleUpKey(event);

                break;

              case keyCodes.down:
                this._handleDownKey(event);

                break;

              case keyCodes.tab:
                this._handleTabKey(event);

                break;
            }
          },
          _handleEscapeKey: function _handleEscapeKey() {
            this.close();
            this.toggleElement.focus();
          },
          _handleUpKey: function _handleUpKey(event) {
            event.preventDefault();

            if (!this._eventOriginatedInsideMenu(event)) {
              return;
            }

            this._focusPreviousMenuItem(event);
          },
          _focusPreviousMenuItem: function _focusPreviousMenuItem(event) {
            var currentMenuItemIndex;

            for (var i = 0; i < this.menuItems.length; i++) {
              if (event.target == this.menuItems[i]) {
                currentMenuItemIndex = i;
              }
            }

            var previousItem = this.menuItems[currentMenuItemIndex - 1];

            if (!previousItem && this.lastMenuItem !== undefined) {
              this.lastMenuItem.focus();
              return;
            }

            previousItem.focus();
          },
          _handleDownKey: function _handleDownKey(event) {
            event.preventDefault();

            if (!this._isOpen()) {
              this.open();
            }

            this._eventOriginatedInsideMenu(event) ? this._focusNextMenuItem(event) : this.firstMenuItem.focus();
          },
          _focusNextMenuItem: function _focusNextMenuItem(event) {
            var currentMenuItemIndex;

            for (var i = 0; i < this.menuItems.length; i++) {
              if (event.target == this.menuItems[i]) {
                currentMenuItemIndex = i;
              }
            }

            var nextItem = this.menuItems[currentMenuItemIndex + 1];

            if (!nextItem) {
              this.firstMenuItem.focus();
              return;
            }

            nextItem.focus();
          },
          _handleTabKey: function _handleTabKey(event) {
            if (!this._eventOriginatedInsideMenu(event)) {
              return;
            }

            if (this._userTabbedOutOfLastMenuItem(event)) {
              this.close();
            }
          },
          _userTabbedOutOfLastMenuItem: function _userTabbedOutOfLastMenuItem(event) {
            return document.activeElement == this.lastMenuItem && !event.shiftKey;
          }
        };
      }
    }]);

    return Dropdown;
  }(Component);

  var FileInput = /*#__PURE__*/function (_Component6) {
    _inherits(FileInput, _Component6);

    var _super6 = _createSuper(FileInput);

    function FileInput() {
      _classCallCheck(this, FileInput);

      return _super6.apply(this, arguments);
    }

    _createClass(FileInput, null, [{
      key: "selector",
      get: function get() {
        return '[data-rvt-file-input]';
      }
    }, {
      key: "methods",
      get: function get() {
        return {
          init: function init() {
            this._initSelectors();

            this._initElements();

            this._initProperties();
          },
          _initSelectors: function _initSelectors() {
            this.inputElementAttribute = 'data-rvt-file-input-button';
            this.previewElementAttribute = 'data-rvt-file-input-preview';
            this.inputElementSelector = "[".concat(this.inputElementAttribute, "]");
            this.previewElementSelector = "[".concat(this.previewElementAttribute, "]");
          },
          _initElements: function _initElements() {
            this.inputElement = this.element.querySelector(this.inputElementSelector);
            this.previewElement = this.element.querySelector(this.previewElementSelector);
          },
          _initProperties: function _initProperties() {
            this.defaultPreviewText = this.previewElement.textContent;
          },
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
          },
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
          },
          onChange: function onChange(event) {
            if (this._hasAttachedFiles()) {
              if (!this._attachEventDispatched()) {
                return;
              }

              this._hasMultipleAttachedFiles() ? this._showNumberOfAttachedFiles() : this._showAttachedFilename();
            } else {
              this._resetPreviewTextToDefault();
            }
          },
          _hasAttachedFiles: function _hasAttachedFiles() {
            return this.inputElement.files.length > 0;
          },
          _attachEventDispatched: function _attachEventDispatched() {
            var files = Array.from(this.inputElement.files).map(function (f) {
              return f.name;
            });
            var dispatched = Component.dispatchCustomEvent('FileAttached', this.element, {
              files: files
            });
            return dispatched;
          },
          _hasMultipleAttachedFiles: function _hasMultipleAttachedFiles() {
            return this.inputElement.files.length > 1;
          },
          _showNumberOfAttachedFiles: function _showNumberOfAttachedFiles() {
            this.previewElement.textContent = this.inputElement.files.length + ' files selected';
          },
          _showAttachedFilename: function _showAttachedFilename() {
            this.previewElement.textContent = this._getSanitizedFilename();
          },
          _getSanitizedFilename: function _getSanitizedFilename() {
            return this.inputElement.files[0].name.replace(/[^\w\.\-]+/gi, '');
          },
          _resetPreviewTextToDefault: function _resetPreviewTextToDefault() {
            this.previewElement.textContent = this.defaultPreviewText;
          }
        };
      }
    }]);

    return FileInput;
  }(Component);

  var Sidenav = /*#__PURE__*/function (_Component7) {
    _inherits(Sidenav, _Component7);

    var _super7 = _createSuper(Sidenav);

    function Sidenav() {
      _classCallCheck(this, Sidenav);

      return _super7.apply(this, arguments);
    }

    _createClass(Sidenav, null, [{
      key: "selector",
      get: function get() {
        return '[data-rvt-sidenav]';
      }
    }, {
      key: "methods",
      get: function get() {
        return {
          init: function init() {
            this._initSelectors();

            this._initElements();

            this._setInitialChildMenuStates();

            Component.bindMethodToDOMElement(this, 'open', this.open);
            Component.bindMethodToDOMElement(this, 'close', this.close);
          },
          _initSelectors: function _initSelectors() {
            this.toggleAttribute = 'data-rvt-sidenav-toggle';
            this.childMenuAttribute = 'data-rvt-sidenav-list';
            this.toggleSelector = "[".concat(this.toggleAttribute, "]");
            this.childMenuSelector = "[".concat(this.childMenuAttribute, "]");
          },
          _initElements: function _initElements() {
            this.childMenuToggleButtons = Array.from(this.element.querySelectorAll(this.toggleSelector));
            this.childMenus = Array.from(this.element.querySelectorAll(this.childMenuSelector));
          },
          _setInitialChildMenuStates: function _setInitialChildMenuStates() {
            this._setChildMenuDefaultAriaAttributes();

            this._shouldOpenAllChildMenus() ? this._openAllChildMenus() : this._setChildMenuDefaultStates();
          },
          _setChildMenuDefaultAriaAttributes: function _setChildMenuDefaultAriaAttributes() {
            this.childMenuToggleButtons.forEach(function (toggleButton) {
              return toggleButton.setAttribute('aria-haspopup', 'true');
            });
          },
          _shouldOpenAllChildMenus: function _shouldOpenAllChildMenus() {
            return this.element.hasAttribute('data-rvt-sidenav-open-all');
          },
          _openAllChildMenus: function _openAllChildMenus() {
            var _this6 = this;

            this.childMenuToggleButtons.forEach(function (toggleButton, index) {
              toggleButton.setAttribute('aria-expanded', 'true');

              _this6.childMenus[index].removeAttribute('hidden');
            });
          },
          _setChildMenuDefaultStates: function _setChildMenuDefaultStates() {
            var _this7 = this;

            this.childMenuToggleButtons.forEach(function (element, index) {
              if (element.getAttribute('aria-expanded') === 'true') {
                _this7.childMenus[index].removeAttribute('hidden');
              } else {
                element.setAttribute('aria-expanded', 'false');

                _this7.childMenus[index].setAttribute('hidden', '');
              }
            });
          },
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
            Component.watchForDOMChanges(this);
          },
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
            Component.stopWatchingForDOMChanges(this);
          },
          onClick: function onClick(event) {
            if (!this._clickOriginatedInChildMenuToggleButton(event)) {
              return;
            }

            this._setChildMenuToToggle(event);

            if (!this._childMenuToToggleExists()) {
              return;
            }

            this._childMenuToToggleIsOpen() ? this.close(this.childMenuToToggleId) : this.open(this.childMenuToToggleId);
          },
          _clickOriginatedInChildMenuToggleButton: function _clickOriginatedInChildMenuToggleButton(event) {
            return event.target.closest(this.toggleSelector);
          },
          _setChildMenuToToggle: function _setChildMenuToToggle(event) {
            this.childMenuToToggleId = event.target.closest(this.toggleSelector).dataset.rvtSidenavToggle;
            this.childMenuToToggle = this.element.querySelector("[".concat(this.childMenuAttribute, " = \"").concat(this.childMenuToToggleId, "\"]"));
          },
          _childMenuToToggleExists: function _childMenuToToggleExists() {
            return this.childMenuToToggle && this.childMenuToToggle.getAttribute(this.childMenuAttribute) !== '';
          },
          _childMenuToToggleIsOpen: function _childMenuToToggleIsOpen() {
            return !this.childMenuToToggle.hasAttribute('hidden');
          },
          open: function open(childMenuId) {
            this._setChildMenuToOpen(childMenuId);

            if (!this._childMenuExists(childMenuId)) {
              console.warn("No such subnav child menu '".concat(childMenuId, "' in open()"));
              return;
            }

            if (!this._eventDispatched('SidenavListOpened', this.childMenuToOpen)) {
              return;
            }

            this._openChildMenu();
          },
          _setChildMenuToOpen: function _setChildMenuToOpen(childMenuId) {
            this.childMenuToOpenToggleButton = this.element.querySelector("[".concat(this.toggleAttribute, " = \"").concat(childMenuId, "\"]"));
            this.childMenuToOpen = this.element.querySelector("[".concat(this.childMenuAttribute, " = \"").concat(childMenuId, "\"]"));
          },
          _openChildMenu: function _openChildMenu() {
            this.childMenuToOpenToggleButton.setAttribute('aria-expanded', 'true');
            this.childMenuToOpen.removeAttribute('hidden');
          },
          close: function close(childMenuId) {
            this._setChildMenuToClose(childMenuId);

            if (!this._childMenuExists(childMenuId)) {
              console.warn("No such subnav child menu '".concat(childMenuId, "' in close()"));
              return;
            }

            if (!this._eventDispatched('SidenavListClosed', this.childMenuToClose)) {
              return;
            }

            this._closeChildMenu();
          },
          _setChildMenuToClose: function _setChildMenuToClose(childMenuId) {
            this.childMenuToCloseToggleButton = this.element.querySelector("[".concat(this.toggleAttribute, " = \"").concat(childMenuId, "\"]"));
            this.childMenuToClose = this.element.querySelector("[".concat(this.childMenuAttribute, " = \"").concat(childMenuId, "\"]"));
          },
          _closeChildMenu: function _closeChildMenu() {
            this.childMenuToCloseToggleButton.setAttribute('aria-expanded', 'false');
            this.childMenuToClose.setAttribute('hidden', '');
          },
          _childMenuExists: function _childMenuExists(childMenuId) {
            var childMenuToggleButton = this.element.querySelector("[".concat(this.toggleAttribute, " = \"").concat(childMenuId, "\"]"));
            var childMenu = this.element.querySelector("[".concat(this.childMenuAttribute, " = \"").concat(childMenuId, "\"]"));
            return childMenuToggleButton && childMenu;
          },
          _eventDispatched: function _eventDispatched(name, childMenu) {
            var dispatched = Component.dispatchCustomEvent(name, this.element, {
              list: childMenu
            });
            return dispatched;
          }
        };
      }
    }]);

    return Sidenav;
  }(Component);

  var Tabs = /*#__PURE__*/function (_Component8) {
    _inherits(Tabs, _Component8);

    var _super8 = _createSuper(Tabs);

    function Tabs() {
      _classCallCheck(this, Tabs);

      return _super8.apply(this, arguments);
    }

    _createClass(Tabs, null, [{
      key: "selector",
      get: function get() {
        return '[data-rvt-tabs]';
      }
    }, {
      key: "methods",
      get: function get() {
        return {
          init: function init() {
            this._initSelectors();

            this._initElements();

            Component.bindMethodToDOMElement(this, 'activateTab', this.activateTab);
          },
          _initSelectors: function _initSelectors() {
            this.tabAttribute = 'data-rvt-tab';
            this.panelAttribute = 'data-rvt-tab-panel';
            this.tabSelector = "[".concat(this.tabAttribute, "]");
            this.panelSelector = "[".concat(this.panelAttribute, "]");
            this.tablistSelector = '[role="tablist"]';
            this.initialTabSelector = '[data-rvt-tab-init]';
          },
          _initElements: function _initElements() {
            this.tablist = this.element.querySelector(this.tablistSelector);
            this.tabs = Array.from(this.element.querySelectorAll(this.tabSelector));
            this.panels = Array.from(this.element.querySelectorAll(this.panelSelector));
          },
          connected: function connected() {
            Component.dispatchComponentAddedEvent(this.element);
            Component.watchForDOMChanges(this);

            this._activateInitialTab();
          },
          _activateInitialTab: function _activateInitialTab() {
            var initialTab = this.element.querySelector(this.initialTabSelector);
            var firstTab = this.panels[0];
            initialTab ? this.activateTab(initialTab.getAttribute(this.panelAttribute)) : this.activateTab(firstTab.getAttribute(this.panelAttribute));
          },
          disconnected: function disconnected() {
            Component.dispatchComponentRemovedEvent(this.element);
            Component.stopWatchingForDOMChanges(this);
          },
          onClick: function onClick(event) {
            if (!this._eventOriginatedInsideTab(event)) {
              return;
            }

            this.activateTab(this._getClickedTabId(event));
          },
          _eventOriginatedInsideTab: function _eventOriginatedInsideTab(event) {
            return event.target.closest(this.tabSelector);
          },
          _getClickedTabId: function _getClickedTabId(event) {
            return event.target.closest(this.tabSelector).getAttribute(this.tabAttribute);
          },
          onKeydown: function onKeydown(event) {
            if (!this._eventOriginatedInsideTab(event)) {
              return;
            }

            this._setNeighboringTabIndexes(event);

            switch (event.keyCode) {
              case keyCodes.left:
                event.preventDefault();

                this._focusPreviousTab();

                break;

              case keyCodes.right:
                event.preventDefault();

                this._focusNextTab();

                break;

              case keyCodes.home:
                event.preventDefault();

                this._focusFirstTab();

                break;

              case keyCodes.end:
                event.preventDefault();

                this._focusLastTab();

                break;
            }
          },
          _setNeighboringTabIndexes: function _setNeighboringTabIndexes(event) {
            var currentTab = event.target.closest(this.tabSelector);
            this.previousTabIndex = this.tabs.indexOf(currentTab) - 1;
            this.nextTabIndex = this.tabs.indexOf(currentTab) + 1;
          },
          _focusPreviousTab: function _focusPreviousTab() {
            this.tabs[this.previousTabIndex] ? this.tabs[this.previousTabIndex].focus() : this.tabs[this.tabs.length - 1].focus();
          },
          _focusNextTab: function _focusNextTab() {
            this.tabs[this.nextTabIndex] ? this.tabs[this.nextTabIndex].focus() : this.tabs[0].focus();
          },
          _focusFirstTab: function _focusFirstTab() {
            this.tabs[0].focus();
          },
          _focusLastTab: function _focusLastTab() {
            this.tabs[this.tabs.length - 1].focus();
          },
          activateTab: function activateTab(tabId) {
            this._setTabToActivate(tabId);

            if (!this._tabToActivateExists()) {
              console.warn("No such tab '".concat(tabId, "' in activateTab()"));
              return;
            }

            if (!this._tabActivatedEventDispatched()) {
              return;
            }

            this._deactivateUnselectedTabs();

            this._activateSelectedTab();
          },
          _setTabToActivate: function _setTabToActivate(tabId) {
            this.tabToActivate = this.element.querySelector("[".concat(this.tabAttribute, " = \"").concat(tabId, "\"]"));
            this.panelToActivate = this.element.querySelector("[".concat(this.panelAttribute, " = \"").concat(tabId, "\"]"));
          },
          _tabToActivateExists: function _tabToActivateExists() {
            return this.tabToActivate && this.panelToActivate;
          },
          _tabActivatedEventDispatched: function _tabActivatedEventDispatched() {
            var dispatched = Component.dispatchCustomEvent('TabActivated', this.element, {
              tab: this.panelToActivate
            });
            return dispatched;
          },
          _deactivateUnselectedTabs: function _deactivateUnselectedTabs() {
            var _this8 = this;

            this.panels.forEach(function (panel, index) {
              if (!_this8._panelShouldBeActivated(panel)) {
                _this8._deactivateTab(panel, index);
              }
            });
          },
          _panelShouldBeActivated: function _panelShouldBeActivated(panel) {
            panel.getAttribute(this.panelAttribute) !== this.panelToActivate.dataset.rvtTabPanel;
          },
          _deactivateTab: function _deactivateTab(panel, tabIndex) {
            panel.setAttribute('hidden', '');
            this.tabs[tabIndex].setAttribute('aria-selected', 'false');
            this.tabs[tabIndex].setAttribute('tabindex', '-1');
          },
          _activateSelectedTab: function _activateSelectedTab() {
            this.tabToActivate.setAttribute('aria-selected', 'true');
            this.tabToActivate.removeAttribute('tabindex');
            this.panelToActivate.removeAttribute('hidden');
          }
        };
      }
    }]);

    return Tabs;
  }(Component);

  function init() {
    Accordion.initAll();
    Alert.initAll();
    Disclosure.initAll();
    Dropdown.initAll();
    FileInput.initAll();
    Dialog.initAll();
    Sidenav.initAll();
    Tabs.initAll();
  }

  exports.Accordion = Accordion;
  exports.Alert = Alert;
  exports.Dialog = Dialog;
  exports.Disclosure = Disclosure;
  exports.Dropdown = Dropdown;
  exports.FileInput = FileInput;
  exports.Sidenav = Sidenav;
  exports.Tabs = Tabs;
  exports.init = init;
  return exports;
}({});