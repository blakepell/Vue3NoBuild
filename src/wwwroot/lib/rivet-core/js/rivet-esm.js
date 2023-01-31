/*!
 * rivet-core - @version 2.2.0

 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */



if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
                              Element.prototype.webkitMatchesSelector;
}


if (!Element.prototype.closest) {
  Element.prototype.closest = function (selector) {
    var el = this;
    var ancestor = this;

    if (!document.documentElement.contains(el)) { return null }

    do {
      if (ancestor.matches(selector)) { return ancestor }

      ancestor = ancestor.parentElement;
    } while (ancestor !== null)

    return null
  };
}



(function () {
  if (typeof window.CustomEvent === 'function') { return false }

  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };

    var customEvent = document.createEvent('CustomEvent');

    customEvent.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );

    return customEvent
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();



if (!Array.from) {
  Array.from = (function () {
    var symbolIterator;

    try {
      symbolIterator = Symbol.iterator
        ? Symbol.iterator
        : 'Symbol(Symbol.iterator)';
    } catch (e) {
      symbolIterator = 'Symbol(Symbol.iterator)';
    }

    var toStr = Object.prototype.toString;

    var isCallable = function (fn) {
      return (
        typeof fn === 'function' ||
              toStr.call(fn) === '[object Function]'
      )
    };

    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) return 0
      if (number === 0 || !isFinite(number)) return number
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number))
    };

    var maxSafeInteger = Math.pow(2, 53) - 1;

    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger)
    };

    var setGetItemHandler = function setGetItemHandler (isIterator, items) {
      var iterator = isIterator && items[symbolIterator]();
      return function getItem (k) {
        return isIterator ? iterator.next() : items[k]
      }
    };

    var getArray = function getArray (
      T,
      A,
      len,
      getItem,
      isIterator,
      mapFn
    ) {
      var k = 0;

      while (k < len || isIterator) {
        var item = getItem(k);
        var kValue = isIterator ? item.value : item;

        if (isIterator && item.done) {
          return A
        } else {
          if (mapFn) {
            A[k] =
                          typeof T === 'undefined'
                            ? mapFn(kValue, k)
                            : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
        }
        k += 1;
      }

      if (isIterator) {
        throw new TypeError(
          'Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1'
        )
      } else {
        A.length = len;
      }

      return A
    };

    return function from (arrayLikeOrIterator ) {
      var C = this;

      var items = Object(arrayLikeOrIterator);
      var isIterator = isCallable(items[symbolIterator]);

      if (arrayLikeOrIterator == null && !isIterator) {
        throw new TypeError(
          'Array.from requires an array-like object or iterator - not null or undefined'
        )
      }

      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        if (!isCallable(mapFn)) {
          throw new TypeError(
            'Array.from: when provided, the second argument must be a function'
          )
        }

        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      var len = toLength(items.length);

      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      return getArray(
        T,
        A,
        len,
        setGetItemHandler(isIterator, items),
        isIterator,
        mapFn
      )
    }
  })();
}



(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) { return }

    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove () {
        if (this.parentNode === null) { return }

        this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

"inert"in HTMLElement.prototype||(Object.defineProperty(HTMLElement.prototype,"inert",{enumerable:!0,get:function(){return this.hasAttribute("inert")},set:function(h){h?this.setAttribute("inert",""):this.removeAttribute("inert");}}),window.addEventListener("load",function(){function h(a){var b=null;try{b=new KeyboardEvent("keydown",{keyCode:9,which:9,key:"Tab",code:"Tab",keyIdentifier:"U+0009",shiftKey:!!a,bubbles:!0});}catch(g){try{b=document.createEvent("KeyboardEvent"),b.initKeyboardEvent("keydown",
!0,!0,window,"Tab",0,a?"Shift":"",!1,"en");}catch(d){}}if(b){try{Object.defineProperty(b,"keyCode",{value:9});}catch(g){}document.dispatchEvent(b);}}function k(a){for(;a&&a!==document.documentElement;){if(a.hasAttribute("inert"))return a;a=a.parentElement;}return null}function e(a){var b=a.path;return b&&b[0]||a.target}function l(a){a.path[a.path.length-1]!==window&&(m(e(a)),a.preventDefault(),a.stopPropagation());}function m(a){var b=k(a);if(b){if(document.hasFocus()&&0!==f){var g=(c||document).activeElement;
h(0>f?!0:!1);if(g!=(c||document).activeElement)return;var d=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT,{acceptNode:function(a){return !a||!a.focus||0>a.tabIndex?NodeFilter.FILTER_SKIP:b.contains(a)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});d.currentNode=b;d=(-1===Math.sign(f)?d.previousNode:d.nextNode).bind(d);for(var e;e=d();)if(e.focus(),(c||document).activeElement!==g)return}a.blur();}}(function(a){var b=document.createElement("style");b.type="text/css";b.styleSheet?
b.styleSheet.cssText=a:b.appendChild(document.createTextNode(a));document.body.appendChild(b);})("/*[inert]*/*[inert]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none}");var n=function(a){return null};window.ShadowRoot&&(n=function(a){for(;a&&a!==document.documentElement;){if(a instanceof window.ShadowRoot)return a;a=a.parentNode;}return null});var f=0;document.addEventListener("keydown",function(a){f=9===a.keyCode?a.shiftKey?-1:1:0;});document.addEventListener("mousedown",
function(a){f=0;});var c=null;document.body.addEventListener("focus",function(a){var b=e(a);a=b==a.target?null:n(b);if(a!=c){if(c){if(!(c instanceof window.ShadowRoot))throw Error("not shadow root: "+c);c.removeEventListener("focusin",l,!0);}a&&a.addEventListener("focusin",l,!0);c=a;}m(b);},!0);document.addEventListener("click",function(a){var b=e(a);k(b)&&(a.preventDefault(),a.stopPropagation());},!0);}));


const globalSettings = {
  prefix: 'rvt'
};

var Lie = typeof Promise === 'function' ? Promise : function (fn) {
  let queue = [], resolved = 0, value;
  fn($ => {
    value = $;
    resolved = 1;
    queue.splice(0).forEach(then);
  });
  return {then};
  function then(fn) {
    return (resolved ? setTimeout(fn, 0, value) : queue.push(fn)), this;
  }
};

const TRUE = true, FALSE = false;
const QSA = 'querySelectorAll';

function add(node) {
  this.observe(node, {subtree: TRUE, childList: TRUE});
}

const notify = (callback, root, MO) => {
  const loop = (nodes, added, removed, connected, pass) => {
    for (let i = 0, {length} = nodes; i < length; i++) {
      const node = nodes[i];
      if (pass || (QSA in node)) {
        if (connected) {
          if (!added.has(node)) {
            added.add(node);
            removed.delete(node);
            callback(node, connected);
          }
        }
        else if (!removed.has(node)) {
          removed.add(node);
          added.delete(node);
          callback(node, connected);
        }
        if (!pass)
          loop(node[QSA]('*'), added, removed, connected, TRUE);
      }
    }
  };

  const observer = new (MO || MutationObserver)(records => {
    for (let
      added = new Set,
      removed = new Set,
      i = 0, {length} = records;
      i < length; i++
    ) {
      const {addedNodes, removedNodes} = records[i];
      loop(removedNodes, added, removed, FALSE, FALSE);
      loop(addedNodes, added, removed, TRUE, FALSE);
    }
  });

  observer.add = add;
  observer.add(root || document);

  return observer;
};

const QSA$1 = 'querySelectorAll';

const {document: document$1, Element: Element$1, MutationObserver: MutationObserver$1, Set: Set$1, WeakMap: WeakMap$1} = self;

const elements = element => QSA$1 in element;
const {filter} = [];

var QSAO = options => {
  const live = new WeakMap$1;
  const drop = elements => {
    for (let i = 0, {length} = elements; i < length; i++)
      live.delete(elements[i]);
  };
  const flush = () => {
    const records = observer.takeRecords();
    for (let i = 0, {length} = records; i < length; i++) {
      parse(filter.call(records[i].removedNodes, elements), false);
      parse(filter.call(records[i].addedNodes, elements), true);
    }
  };
  const matches = element => (
    element.matches ||
    element.webkitMatchesSelector ||
    element.msMatchesSelector
  );
  const notifier = (element, connected) => {
    let selectors;
    if (connected) {
      for (let q, m = matches(element), i = 0, {length} = query; i < length; i++) {
        if (m.call(element, q = query[i])) {
          if (!live.has(element))
            live.set(element, new Set$1);
          selectors = live.get(element);
          if (!selectors.has(q)) {
            selectors.add(q);
            options.handle(element, connected, q);
          }
        }
      }
    }
    else if (live.has(element)) {
      selectors = live.get(element);
      live.delete(element);
      selectors.forEach(q => {
        options.handle(element, connected, q);
      });
    }
  };
  const parse = (elements, connected = true) => {
    for (let i = 0, {length} = elements; i < length; i++)
      notifier(elements[i], connected);
  };
  const {query} = options;
  const root = options.root || document$1;
  const observer = notify(notifier, root, MutationObserver$1);
  const {attachShadow} = Element$1.prototype;
  if (attachShadow)
    Element$1.prototype.attachShadow = function (init) {
      const shadowRoot = attachShadow.call(this, init);
      observer.add(shadowRoot);
      return shadowRoot;
    };
  if (query.length)
    parse(root[QSA$1](query));
  return {drop, flush, observer, parse};
};

const {create, keys} = Object;

const attributes = new WeakMap;
const lazy = new Set;

const query = [];
const config = {};
const defined = {};

const attributeChangedCallback = (records, o) => {
  for (let h = attributes.get(o), i = 0, {length} = records; i < length; i++) {
    const {target, attributeName, oldValue} = records[i];
    const newValue = target.getAttribute(attributeName);
    h.attributeChanged(attributeName, oldValue, newValue);
  }
};

const set = (value, m, l, o) => {
  const handler = create(o, {element: {enumerable: true, value}});
  for (let i = 0, {length} = l; i < length; i++)
    value.addEventListener(l[i].t, handler, l[i].o);
  m.set(value, handler);
  if (handler.init)
    handler.init();
  const {observedAttributes} = o;
  if (observedAttributes) {
    const mo = new MutationObserver(attributeChangedCallback);
    mo.observe(value, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: observedAttributes.map(attributeName => {
        if (value.hasAttribute(attributeName))
          handler.attributeChanged(
            attributeName,
            null,
            value.getAttribute(attributeName)
          );
        return attributeName;
      })
    });
    attributes.set(mo, handler);
  }
  return handler;
};

const {drop, flush, parse} = QSAO({
  query,
  handle(element, connected, selector) {
    const {m, l, o} = config[selector];
    const handler = m.get(element) || set(element, m, l, o);
    const method = connected ? 'connected' : 'disconnected';
    if (method in handler)
      handler[method]();
  }
});

const define = (selector, definition) => {
  if (-1 < query.indexOf(selector))
    throw new Error('duplicated: ' + selector);
  flush();
  const listeners = [];
  const retype = create(null);
  for (let k = keys(definition), i = 0, {length} = k; i < length; i++) {
    const key = k[i];
    if (/^on/.test(key) && !/Options$/.test(key)) {
      const options = definition[key + 'Options'] || false;
      const lower = key.toLowerCase();
      let type = lower.slice(2);
      listeners.push({t: type, o: options});
      retype[type] = key;
      if (lower !== key) {
        type = key.slice(2, 3).toLowerCase() + key.slice(3);
        retype[type] = key;
        listeners.push({t: type, o: options});
      }
    }
  }
  if (listeners.length) {
    definition.handleEvent = function (event) {
      this[retype[event.type]](event);
    };
  }
  query.push(selector);
  config[selector] = {m: new WeakMap, l: listeners, o: definition};
  parse(document.querySelectorAll(selector));
  whenDefined(selector);
  if (!lazy.has(selector))
    defined[selector]._();
};

const whenDefined = selector => {
  if (!(selector in defined)) {
    let _, $ = new Lie($ => { _ = $; });
    defined[selector] = {_, $};
  }
  return defined[selector].$;
};



class Component {


  static initAll () {
    this.init(this.selector);
  }


  static init (selector) {
    define(selector, this.methods);

    return document.querySelector(selector)
  }


  static get selector () {
  }


  static get methods () {
  }


  static bindMethodToDOMElement (self, name, method) {
    Object.defineProperty(self.element, name, {
      value: method.bind(self),
      writable: false
    });
  }


  static dispatchCustomEvent (eventName, element, detail = {}) {
    const prefix = globalSettings.prefix;
    const event = new CustomEvent(`${prefix}${eventName}`, {
      bubbles: true,
      cancelable: true,
      detail
    });

    return element.dispatchEvent(event)
  }


  static dispatchComponentAddedEvent (element) {
    return this.dispatchCustomEvent('ComponentAdded', document, {
      component: element
    })
  }


  static dispatchComponentRemovedEvent (element) {
    return this.dispatchCustomEvent('ComponentRemoved', document, {
      component: element
    })
  }


  static watchForDOMChanges (self, callback = null) {
    self.observer = new MutationObserver((mutationList, observer) => {
      self._initElements();

      if (callback) {
        callback();
      }
    });

    self.observer.observe(self.element, { childList: true, subtree: true });
  }


  static stopWatchingForDOMChanges (self) {
    self.observer.disconnect();
  }

}


const keyCodes = {
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



class Accordion extends Component {


  static get selector () {
    return '[data-rvt-accordion]'
  }


  static get methods () {
    return {


      init () {
        this._initSelectors();
        this._initElements();
        this._setInitialPanelStates();

        Component.bindMethodToDOMElement(this, 'open', this.open);
        Component.bindMethodToDOMElement(this, 'close', this.close);
      },


      _initSelectors () {
        this.triggerAttribute = 'data-rvt-accordion-trigger';
        this.panelAttribute = 'data-rvt-accordion-panel';

        this.triggerSelector = `[${this.triggerAttribute}]`;
        this.panelSelector = `[${this.panelAttribute}]`;
      },


      _initElements () {
        this.triggers = Array.from(
          this.element.querySelectorAll(this.triggerSelector)
        );

        this.panels = Array.from(
          this.element.querySelectorAll(this.panelSelector)
        );
      },


      _setInitialPanelStates () {
        this._shouldOpenAllPanels()
          ? this._openAllPanels()
          : this._setPanelDefaultStates();
      },


      _shouldOpenAllPanels () {
        return this.element.hasAttribute('data-rvt-accordion-open-all')
      },


      _openAllPanels () {
        this.panels.forEach((panel, index) => this._openPanel(index));
      },


      _setPanelDefaultStates () {
        this.panels.forEach(panel => {
          this._panelShouldBeOpen(panel)
            ? this.open(panel.getAttribute(this.panelAttribute))
            : this.close(panel.getAttribute(this.panelAttribute));
        });
      },


      _panelShouldBeOpen (panel) {
        return panel.hasAttribute('data-rvt-accordion-panel-init')
      },


      connected () {
        Component.dispatchComponentAddedEvent(this.element);
        Component.watchForDOMChanges(this);
      },


      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
        Component.stopWatchingForDOMChanges(this);
      },


      onClick (event) {
        if (!this._eventOriginatedInsideTrigger(event)) { return }

        this._setTriggerToToggle(event);

        this._triggerToToggleIsOpen()
          ? this.close(this.triggerToToggleId)
          : this.open(this.triggerToToggleId);
      },


      _eventOriginatedInsideTrigger (event) {
        return event.target.closest(this.triggerSelector)
      },


      _setTriggerToToggle (event) {
        this.triggerToToggle = event.target.closest(this.triggerSelector);
        this.triggerToToggleId = this.triggerToToggle.getAttribute(this.triggerAttribute);
      },


      _triggerToToggleIsOpen () {
        return this.triggerToToggle.getAttribute('aria-expanded') === 'true'
      },


      onKeydown (event) {
        if (!this._eventOriginatedInsideTrigger(event)) { return }

        this._setNeighboringTriggerIndexes(event);

        switch (event.keyCode) {
          case keyCodes.up:
            this._focusPreviousTrigger();
            break

          case keyCodes.down:
            this._focusNextTrigger();
            break

          case keyCodes.home:
            this._focusFirstTrigger();
            break

          case keyCodes.end:
            this._focusLastTrigger();
            break
        }
      },


      _setNeighboringTriggerIndexes (event) {
        const currentTrigger = event.target.closest(this.triggerSelector);

        this.previousTriggerIndex = this.triggers.indexOf(currentTrigger) - 1;
        this.nextTriggerIndex = this.triggers.indexOf(currentTrigger) + 1;
      },


      _focusPreviousTrigger () {
        this.triggers[this.previousTriggerIndex]
          ? this.triggers[this.previousTriggerIndex].focus()
          : this.triggers[this.triggers.length - 1].focus();
      },


      _focusNextTrigger () {
        this.triggers[this.nextTriggerIndex]
          ? this.triggers[this.nextTriggerIndex].focus()
          : this.triggers[0].focus();
      },


      _focusFirstTrigger () {
        this.triggers[0].focus();
      },


      _focusLastTrigger () {
        this.triggers[this.triggers.length - 1].focus();
      },


      open (panelId) {
        this._setPanelToOpen(panelId);

        if (!this._panelToOpenExists()) {
          console.warn(`No such accordion panel '${panelId}' in open()`);
          return
        }

        if (!this._eventDispatched('AccordionOpened', this.panelToOpen)) { return }

        this._openPanel();
      },


      _setPanelToOpen (panelId) {
        this.triggerToOpen = this.element.querySelector(
          `[${this.triggerAttribute} = "${panelId}"]`
        );

        this.panelToOpen = this.element.querySelector(
          `[${this.panelAttribute} = "${panelId}"]`
        );
      },


      _panelToOpenExists () {
        return this.panelToOpen
      },


      _openPanel () {
        this.triggerToOpen.setAttribute('aria-expanded', 'true');
        this.panelToOpen.removeAttribute('hidden');
      },


      close (panelId) {
        this._setPanelToClose(panelId);

        if (!this._panelToCloseExists()) {
          console.warn(`No such accordion panel '${panelId}' in close()`);
          return
        }

        if (!this._eventDispatched('AccordionClosed', this.panelToClose)) { return }

        this._closePanel();
      },


      _setPanelToClose (panelId) {
        this.triggerToClose = this.element.querySelector(
          `[${this.triggerAttribute} = "${panelId}"]`
        );

        this.panelToClose = this.element.querySelector(
          `[${this.panelAttribute} = "${panelId}"]`
        );
      },


      _panelToCloseExists () {
        return this.panelToClose
      },


      _closePanel () {
        this.triggerToClose.setAttribute('aria-expanded', 'false');
        this.panelToClose.setAttribute('hidden', '');
      },


      _eventDispatched (name, panel) {
        const dispatched = Component.dispatchCustomEvent(
          name,
          this.element,
          { panel }
        );

        return dispatched
      }
    }
  }
}



class Alert extends Component {


  static get selector () {
    return '[data-rvt-alert]'
  }


  static get methods () {
    return {


      init () {
        this._initSelectors();
        this._initElements();

        Component.bindMethodToDOMElement(this, 'dismiss', this.dismiss);
      },


      _initSelectors () {
        this.closeButtonAttribute = 'data-rvt-alert-close';

        this.closeButtonSelector = `[${this.closeButtonAttribute}]`;
      },


      _initElements () {
        this.closeButton = this.element.querySelector(this.closeButtonSelector);
      },


      connected () {
        Component.dispatchComponentAddedEvent(this.element);
      },


      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
      },


      onClick (event) {
        if (this._clickOriginatedInsideCloseButton(event)) { this.dismiss(); }
      },


      _clickOriginatedInsideCloseButton (event) {
        return this.closeButton && this.closeButton.contains(event.target)
      },


      dismiss () {
        if (!this._dismissEventDispatched()) { return }

        this.element.remove();
      },


      _dismissEventDispatched () {
        const dispatched = Component.dispatchCustomEvent(
          'AlertDismissed',
          this.element
        );

        return dispatched
      }
    }
  }
}



class Dialog extends Component {


  static get selector () {
    return '[data-rvt-dialog]'
  }


  static get methods () {
    return {


      init () {
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


      _initSelectors () {
        this.dialogAttribute = 'data-rvt-dialog';
        this.triggerAttribute = 'data-rvt-dialog-trigger';
        this.closeButtonAttribute = 'data-rvt-dialog-close';
        this.modalAttribute = 'data-rvt-dialog-modal';
        this.disablePageInteractionAttribute = 'data-rvt-dialog-disable-page-interaction';

        this.triggerSelector = `[${this.triggerAttribute}]`;
        this.closeButtonSelector = `[${this.closeButtonAttribute}]`;
      },


      _initElements () {
        const dialogId = this.element.getAttribute(this.dialogAttribute);

        this.triggerButtons = Array.from(
          document.querySelectorAll(`[${this.triggerAttribute} = "${dialogId}"]`)
        );

        this.closeButtons = Array.from(
          this.element.querySelectorAll(this.closeButtonSelector)
        );

        this.lastClickedTriggerButton = null;
      },


      _initProperties () {
        this.id = this.element.getAttribute('id');
        this.isOpen = false;
        this.isModal = this.element.hasAttribute(this.modalAttribute);
      },


      _initAttributes () {
        if (this.isModal) {
          this.element.setAttribute('aria-modal', 'true');
        }
      },


      _makeDialogFirstElementInBody () {
        const body = document.body;
        const currentFirstElement = body.firstElementChild;
        body.insertBefore(this.element, currentFirstElement);
      },


      _bindExternalEventHandlers () {
        this._onTriggerClick = this._onTriggerClick.bind(this);
        this._onDocumentClick = this._onDocumentClick.bind(this);
      },


      connected () {
        Component.dispatchComponentAddedEvent(this.element);
        Component.watchForDOMChanges(this);

        this._addTriggerEventHandlers();
        this._addDocumentEventHandlers();

        if (this._shouldBeOpenByDefault()) { this.open(); }
      },


      _shouldBeOpenByDefault () {
        return this.element.hasAttribute('data-rvt-dialog-open-on-init')
      },


      _addTriggerEventHandlers () {
        if (!this._hasTriggerButton()) { return }

        this.triggerButtons.forEach(button => {
          button.addEventListener('click', this._onTriggerClick, false);
        });
      },


      _hasTriggerButton () {
        return this.triggerButtons.length
      },


      _addDocumentEventHandlers () {
        document.addEventListener('click', this._onDocumentClick, false);
      },


      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
        Component.stopWatchingForDOMChanges(this);

        this._removeTriggerEventHandlers();
        this._removeDocumentEventHandlers();
      },


      _removeTriggerEventHandlers () {
        if (!this._hasTriggerButton()) { return }

        this.triggerButtons.forEach(button => {
          button.removeEventListener('click', this._onTriggerClick, false);
        });
      },


      _removeDocumentEventHandlers () {
        document.removeEventListener('click', this._onDocumentClick, false);
      },


      onClick (event) {
        if (!this._isOpen()) { return }

        if (!this._clickOriginatedInCloseButton(event)) { return }

        this.close();
      },


      _isOpen () {
        return this.isOpen
      },


      _clickOriginatedInCloseButton (event) {
        return event.target.closest(this.closeButtonSelector)
      },


      _onTriggerClick (event) {
        this._setLastClickedTriggerButton(event);

        this._isOpen()
          ? this.close()
          : this.open();
      },


      _setLastClickedTriggerButton (event) {
        this.lastClickedTriggerButton = event.target.closest(this.triggerSelector);
      },


      _onDocumentClick (event) {
        if (this._clickOriginatedInsideDialogOrTrigger(event)) { return }

        if (!this._isOpen()) { return }

        if (this._shouldCloseOnClickOutside()) { return }

        this.close();
      },


      _clickOriginatedInsideDialogOrTrigger (event) {


        return event.target.closest(this.triggerSelector) ||
               event.composedPath().some(el => el.dataset && 'rvtDialog' in el.dataset)
      },


      _shouldCloseOnClickOutside () {
        return !this.isModal
      },


      onKeydown (event) {
        switch (event.keyCode) {
          case keyCodes.tab:
            this._setFocusableChildElements();
            this._shiftKeyPressed(event)
              ? this._handleBackwardTab(event)
              : this._handleForwardTab(event);
            break

          case keyCodes.escape:
            if (!this._shouldCloseOnClickOutside()) { this.close(); }
            break
        }
      },


      _setFocusableChildElements () {
        this.focusableChildElements = this.element.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="-1"]'
        );

        this.firstFocusableChildElement = this.focusableChildElements[0];
        this.lastFocusableChildElement = this.focusableChildElements[this.focusableChildElements.length - 1];
      },


      _shiftKeyPressed (event) {
        return event.shiftKey
      },


      _handleBackwardTab (event) {
        if (this._shouldTrapBackwardTabFocus()) {
          event.preventDefault();
          this.lastFocusableChildElement.focus();
        }
      },


      _shouldTrapBackwardTabFocus () {
        return document.activeElement === this.firstFocusableChildElement ||
               document.activeElement === this.element
      },


      _handleForwardTab (event) {
        if (this._shouldTrapForwardTabFocus()) {
          event.preventDefault();

          this.firstFocusableChildElement.focus();
        }
      },


      _shouldTrapForwardTabFocus () {
        return document.activeElement === this.lastFocusableChildElement
      },


      open () {
        if (this._isOpen()) { return }

        if (!this._eventDispatched('DialogOpened')) { return }

        this._setOpenState();
        this.focusDialog();

        if (this._shouldDisablePageInteraction()) {
          this._disablePageInteraction();
        }
      },


      _setOpenState () {
        this.isOpen = true;
        this.element.removeAttribute('hidden');

        if (this.isModal) {
          document.body.classList.add('rvt-dialog-prevent-scroll');
        }
      },


      focusDialog () {
        this.element.focus();
      },


      _shouldDisablePageInteraction () {
        return this.element.hasAttribute(this.disablePageInteractionAttribute)
      },


      _disablePageInteraction () {
        this._getDirectChildrenOfBody().forEach(child => {
          child.setAttribute('inert', '');
          child.setAttribute('aria-hidden', 'true');
        });
      },


      _getDirectChildrenOfBody () {
        return Array.from(
          document.querySelectorAll(`body > *:not([${this.dialogAttribute}])`)
        )
      },


      close () {
        if (!this._isOpen()) { return }

        if (!this._eventDispatched('DialogClosed')) { return }

        this._setClosedState();

        if (this._shouldDisablePageInteraction()) {
          this._enablePageInteraction();
        }

        if (this._hasTriggerButton()) {
          this.focusTrigger();
        }
      },


      _setClosedState () {
        this.isOpen = false;
        this.element.setAttribute('hidden', '');
        document.body.classList.remove('rvt-dialog-prevent-scroll');
      },


      _enablePageInteraction () {
        this._getDirectChildrenOfBody().forEach(child => {
          child.removeAttribute('inert');
          child.removeAttribute('aria-hidden');
        });
      },


      focusTrigger () {
        if (!this._hasTriggerButton()) {
          console.warn(`Could not find a trigger button for dialog ID '${this.id}'`);
          return
        }

        this.lastClickedTriggerButton && document.body.contains(this.lastClickedTriggerButton)
          ? this.lastClickedTriggerButton.focus()
          : this.triggerButtons[0].focus();
      },


      _eventDispatched (name) {
        const dispatched = Component.dispatchCustomEvent(name, this.element);

        return dispatched
      }
    }
  }
}



class Disclosure extends Component {


  static get selector () {
    return '[data-rvt-disclosure]'
  }


  static get methods () {
    return {


      init () {
        this._initSelectors();
        this._initElements();
        this._initProperties();
        this._setInitialDisclosureState();
        this._removeIconFromTabOrder();
        this._bindExternalEventHandlers();

        Component.bindMethodToDOMElement(this, 'open', this.open);
        Component.bindMethodToDOMElement(this, 'close', this.close);
      },


      _initSelectors () {
        this.toggleAttribute = 'data-rvt-disclosure-toggle';
        this.targetAttribute = 'data-rvt-disclosure-target';

        this.toggleSelector = `[${this.toggleAttribute}]`;
        this.targetSelector = `[${this.targetAttribute}]`;
      },


      _initElements () {
        this.toggleElement = this.element.querySelector(this.toggleSelector);
        this.targetElement = this.element.querySelector(this.targetSelector);
      },


      _initProperties () {
        this.isOpen = false;
      },


      _setInitialDisclosureState () {
        if (this._shouldBeOpenByDefault()) { this.open(); }
      },


      _shouldBeOpenByDefault () {
        return this.element.hasAttribute('data-rvt-disclosure-open-on-init')
      },


      _removeIconFromTabOrder () {
        const icon = this.element.querySelector('svg');

        if (icon) { icon.setAttribute('focusable', 'false'); }
      },


      _bindExternalEventHandlers () {
        this._onDocumentClick = this._onDocumentClick.bind(this);
      },


      connected () {
        Component.dispatchComponentAddedEvent(this.element);

        if (this._shouldAddDocumentEventHandlers()) {
          this._addDocumentEventHandlers();
        }
      },


      _shouldAddDocumentEventHandlers () {
        return this.element.hasAttribute('data-rvt-close-click-outside')
      },


      _addDocumentEventHandlers () {
        document.addEventListener('click', this._onDocumentClick, false);
      },


      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);

        this._removeDocumentEventHandlers();
      },


      _removeDocumentEventHandlers () {
        document.removeEventListener('click', this._onDocumentClick, false);
      },


      open () {
        if (this._isDisabled()) { return }

        if (!this._eventDispatched('DisclosureOpened')) { return }

        this._setOpenState();
      },


      _isDisabled () {
        return this.toggleElement.hasAttribute('disabled')
      },


      _setOpenState () {
        this.toggleElement.setAttribute('aria-expanded', 'true');
        this.targetElement.removeAttribute('hidden');

        this.isOpen = true;
      },


      close () {
        if (!this._isOpen()) { return }

        if (!this._eventDispatched('DisclosureClosed')) { return }

        this._setClosedState();
      },


      _isOpen () {
        return this.isOpen
      },


      _setClosedState () {
        this.toggleElement.setAttribute('aria-expanded', 'false');
        this.targetElement.setAttribute('hidden', '');

        this.isOpen = false;
      },


      _eventDispatched (name) {
        const dispatched = Component.dispatchCustomEvent(name, this.element);

        return dispatched
      },


      onClick (event) {
        if (this._clickOriginatedInsideDisclosureTarget(event)) { return }

        this._isOpen()
          ? this.close()
          : this.open();
      },


      _clickOriginatedInsideDisclosureTarget (event) {
        return this.targetElement.contains(event.target)
      },


      _onDocumentClick (event) {
        if (!this._clickOriginatedOutsideDisclosure(event)) { return }

        if (!this._isOpen()) { return }

        this.close();
      },


      _clickOriginatedOutsideDisclosure (event) {
        return ! this.element.contains(event.target)
      },


      onKeydown (event) {
        if (event.keyCode === keyCodes.escape) {
          this.close();
          this.toggleElement.focus();
        }
      }
    }
  }
}



class Dropdown extends Component {


  static get selector () {
    return '[data-rvt-dropdown]'
  }


  static get methods () {
    return {


      init () {
        this._initSelectors();
        this._initElements();
        this._initProperties();
        this._initMenuItems();
        this._removeIconFromTabOrder();
        this._bindExternalEventHandlers();

        Component.bindMethodToDOMElement(this, 'open', this.open);
        Component.bindMethodToDOMElement(this, 'close', this.close);
      },


      _initSelectors () {
        this.toggleAttribute = 'data-rvt-dropdown-toggle';
        this.menuAttribute = 'data-rvt-dropdown-menu';

        this.toggleSelector = `[${this.toggleAttribute}]`;
        this.menuSelector = `[${this.menuAttribute}]`;
      },


      _initElements () {
        this.toggleElement = this.element.querySelector(this.toggleSelector);
        this.menuElement = this.element.querySelector(this.menuSelector);
      },


      _initProperties () {
        this.isOpen = false;
      },


      _initMenuItems () {
        const focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]';

        this.menuItems = Array.from(this.menuElement.querySelectorAll(focusableElements));
        this.firstMenuItem = this.menuItems[0];
        this.lastMenuItem = this.menuItems[this.menuItems.length - 1];
      },


      _removeIconFromTabOrder () {
        const icon = this.element.querySelector('svg');

        if (icon) { icon.setAttribute('focusable', 'false'); }
      },


      _bindExternalEventHandlers () {
        this._onDocumentClick = this._onDocumentClick.bind(this);
      },


      connected () {
        Component.dispatchComponentAddedEvent(this.element);
        Component.watchForDOMChanges(this, () => this._initMenuItems());

        this._addDocumentEventHandlers();
      },


      _addDocumentEventHandlers () {
        document.addEventListener('click', this._onDocumentClick, false);
      },


      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
        Component.stopWatchingForDOMChanges(this);

        this._removeDocumentEventHandlers();
      },


      _removeDocumentEventHandlers () {
        document.removeEventListener('click', this._onDocumentClick, false);
      },


      open () {
        if (this._toggleElementIsDisabled()) { return }

        if (!this._eventDispatched('DropdownOpened')) { return }

        this._setOpenState();
      },


      _toggleElementIsDisabled () {
        return this.toggleElement.hasAttribute('disabled')
      },


      _setOpenState () {
        this.toggleElement.setAttribute('aria-expanded', 'true');
        this.menuElement.removeAttribute('hidden');
        this.firstMenuItem.focus();

        this.isOpen = true;
      },


      close () {
        if (!this._isOpen()) { return }

        if (!this._eventDispatched('DropdownClosed')) { return }

        this._setClosedState();
      },


      _isOpen () {
        return this.isOpen
      },


      _setClosedState () {
        this.toggleElement.setAttribute('aria-expanded', 'false');
        this.menuElement.setAttribute('hidden', '');

        this.isOpen = false;
      },


      _eventDispatched (name) {
        const dispatched = Component.dispatchCustomEvent(name, this.element);

        return dispatched
      },


      onClick (event) {
        if (this._eventOriginatedInsideMenu(event)) { return }

        this._isOpen()
          ? this.close()
          : this.open();
      },


      _eventOriginatedInsideMenu (event) {
        return this.menuElement.contains(event.target)
      },


      _onDocumentClick (event) {
        if (!this._clickOriginatedOutsideDropdown(event)) { return }

        if (!this._isOpen()) { return }

        this.close();
      },


      _clickOriginatedOutsideDropdown (event) {
        return !this.element.contains(event.target)
      },


      onKeydown (event) {
        switch (event.keyCode) {
          case keyCodes.escape:
            this._handleEscapeKey();
            break

          case keyCodes.up:
            this._handleUpKey(event);
            break

          case keyCodes.down:
            this._handleDownKey(event);
            break

          case keyCodes.tab:
            this._handleTabKey(event);
            break
        }
      },


      _handleEscapeKey () {
        this.close();
        this.toggleElement.focus();
      },


      _handleUpKey (event) {
        event.preventDefault();

        if (!this._eventOriginatedInsideMenu(event)) { return }

        this._focusPreviousMenuItem(event);
      },


      _focusPreviousMenuItem (event) {
        let currentMenuItemIndex;

        for (let i = 0; i < this.menuItems.length; i++) {
          if (event.target == this.menuItems[i]) {
            currentMenuItemIndex = i;
          }
        }

        const previousItem = this.menuItems[currentMenuItemIndex - 1];

        if (!previousItem && this.lastMenuItem !== undefined) {
          this.lastMenuItem.focus();

          return
        }

        previousItem.focus();
      },


      _handleDownKey (event) {
        event.preventDefault();

        if (!this._isOpen()) { this.open(); }

        this._eventOriginatedInsideMenu(event)
          ? this._focusNextMenuItem(event)
          : this.firstMenuItem.focus();
      },


      _focusNextMenuItem (event) {
        let currentMenuItemIndex;

        for (let i = 0; i < this.menuItems.length; i++) {
          if (event.target == this.menuItems[i]) {
            currentMenuItemIndex = i;
          }
        }

        const nextItem = this.menuItems[currentMenuItemIndex + 1];

        if (!nextItem) {
          this.firstMenuItem.focus();

          return
        }

        nextItem.focus();
      },


      _handleTabKey (event) {
        if (!this._eventOriginatedInsideMenu(event)) { return }

        if (this._userTabbedOutOfLastMenuItem(event)) { this.close(); }
      },


      _userTabbedOutOfLastMenuItem (event) {
        return document.activeElement == this.lastMenuItem && !event.shiftKey
      }
    }
  }
}



class FileInput extends Component {


  static get selector () {
    return '[data-rvt-file-input]'
  }


  static get methods () {
    return {


      init () {
        this._initSelectors();
        this._initElements();
        this._initProperties();
      },


      _initSelectors () {
        this.inputElementAttribute = 'data-rvt-file-input-button';
        this.previewElementAttribute = 'data-rvt-file-input-preview';

        this.inputElementSelector = `[${this.inputElementAttribute}]`;
        this.previewElementSelector = `[${this.previewElementAttribute}]`;
      },


      _initElements () {
        this.inputElement = this.element.querySelector(this.inputElementSelector);
        this.previewElement = this.element.querySelector(this.previewElementSelector);
      },


      _initProperties () {
        this.defaultPreviewText = this.previewElement.textContent;
      },


      connected () {
        Component.dispatchComponentAddedEvent(this.element);
      },


      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
      },


      onChange (event) {
        if (this._hasAttachedFiles()) {
          if (!this._attachEventDispatched()) { return }

          this._hasMultipleAttachedFiles()
            ? this._showNumberOfAttachedFiles()
            : this._showAttachedFilename();
        } else {
          this._resetPreviewTextToDefault();
        }
      },


      _hasAttachedFiles () {
        return this.inputElement.files.length > 0
      },


      _attachEventDispatched () {
        const files = Array.from(this.inputElement.files).map(f => f.name);
        const dispatched = Component.dispatchCustomEvent(
          'FileAttached',
          this.element,
          { files }
        );

        return dispatched
      },


      _hasMultipleAttachedFiles () {
        return this.inputElement.files.length > 1
      },


      _showNumberOfAttachedFiles () {
        this.previewElement.textContent = this.inputElement.files.length + ' files selected';
      },


      _showAttachedFilename () {
        this.previewElement.textContent = this._getSanitizedFilename();
      },


      _getSanitizedFilename () {
        return this.inputElement.files[0].name.replace(/[^\w\.\-]+/gi, '')
      },


      _resetPreviewTextToDefault () {
        this.previewElement.textContent = this.defaultPreviewText;
      }
    }
  }
}



class Sidenav extends Component {


  static get selector () {
    return '[data-rvt-sidenav]'
  }


  static get methods () {
    return {


      init () {
        this._initSelectors();
        this._initElements();
        this._setInitialChildMenuStates();

        Component.bindMethodToDOMElement(this, 'open', this.open);
        Component.bindMethodToDOMElement(this, 'close', this.close);
      },


      _initSelectors () {
        this.toggleAttribute = 'data-rvt-sidenav-toggle';
        this.childMenuAttribute = 'data-rvt-sidenav-list';

        this.toggleSelector = `[${this.toggleAttribute}]`;
        this.childMenuSelector = `[${this.childMenuAttribute}]`;
      },


      _initElements () {
        this.childMenuToggleButtons = Array.from(
          this.element.querySelectorAll(this.toggleSelector)
        );

        this.childMenus = Array.from(
          this.element.querySelectorAll(this.childMenuSelector)
        );
      },


      _setInitialChildMenuStates () {
        this._setChildMenuDefaultAriaAttributes();
        this._shouldOpenAllChildMenus()
          ? this._openAllChildMenus()
          : this._setChildMenuDefaultStates();
      },


      _setChildMenuDefaultAriaAttributes () {
        this.childMenuToggleButtons.forEach(
          toggleButton => toggleButton.setAttribute('aria-haspopup', 'true')
        );
      },


      _shouldOpenAllChildMenus () {
        return this.element.hasAttribute('data-rvt-sidenav-open-all')
      },


      _openAllChildMenus () {
        this.childMenuToggleButtons.forEach((toggleButton, index) => {
          toggleButton.setAttribute('aria-expanded', 'true');
          this.childMenus[index].removeAttribute('hidden');
        });
      },


      _setChildMenuDefaultStates () {
        this.childMenuToggleButtons.forEach((element, index) => {
          if (element.getAttribute('aria-expanded') === 'true') {
            this.childMenus[index].removeAttribute('hidden');
          } else {
            element.setAttribute('aria-expanded', 'false');
            this.childMenus[index].setAttribute('hidden', '');
          }
        });
      },


      connected () {
        Component.dispatchComponentAddedEvent(this.element);
        Component.watchForDOMChanges(this);
      },


      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
        Component.stopWatchingForDOMChanges(this);
      },


      onClick (event) {
        if (!this._clickOriginatedInChildMenuToggleButton(event)) { return }

        this._setChildMenuToToggle(event);

        if (!this._childMenuToToggleExists()) { return }

        this._childMenuToToggleIsOpen()
          ? this.close(this.childMenuToToggleId)
          : this.open(this.childMenuToToggleId);
      },


      _clickOriginatedInChildMenuToggleButton (event) {
        return event.target.closest(this.toggleSelector)
      },


      _setChildMenuToToggle (event) {
        this.childMenuToToggleId = event.target
          .closest(this.toggleSelector)
          .dataset.rvtSidenavToggle;

        this.childMenuToToggle = this.element.querySelector(
          `[${this.childMenuAttribute} = "${this.childMenuToToggleId}"]`
        );
      },


      _childMenuToToggleExists () {
        return this.childMenuToToggle &&
               this.childMenuToToggle.getAttribute(this.childMenuAttribute) !== ''
      },


      _childMenuToToggleIsOpen () {
        return !this.childMenuToToggle.hasAttribute('hidden')
      },


      open (childMenuId) {
        this._setChildMenuToOpen(childMenuId);

        if (!this._childMenuExists(childMenuId)) {
          console.warn(`No such subnav child menu '${childMenuId}' in open()`);
          return
        }

        if (!this._eventDispatched('SidenavListOpened', this.childMenuToOpen)) { return }

        this._openChildMenu();
      },


      _setChildMenuToOpen (childMenuId) {
        this.childMenuToOpenToggleButton = this.element.querySelector(
          `[${this.toggleAttribute} = "${childMenuId}"]`
        );

        this.childMenuToOpen = this.element.querySelector(
          `[${this.childMenuAttribute} = "${childMenuId}"]`
        );
      },


      _openChildMenu () {
        this.childMenuToOpenToggleButton.setAttribute('aria-expanded', 'true');
        this.childMenuToOpen.removeAttribute('hidden');
      },


      close (childMenuId) {
        this._setChildMenuToClose(childMenuId);

        if (!this._childMenuExists(childMenuId)) {
          console.warn(`No such subnav child menu '${childMenuId}' in close()`);
          return
        }

        if (!this._eventDispatched('SidenavListClosed', this.childMenuToClose)) { return }

        this._closeChildMenu();
      },


      _setChildMenuToClose (childMenuId) {
        this.childMenuToCloseToggleButton = this.element.querySelector(
          `[${this.toggleAttribute} = "${childMenuId}"]`
        );

        this.childMenuToClose = this.element.querySelector(
          `[${this.childMenuAttribute} = "${childMenuId}"]`
        );
      },


      _closeChildMenu () {
        this.childMenuToCloseToggleButton.setAttribute('aria-expanded', 'false');
        this.childMenuToClose.setAttribute('hidden', '');
      },


      _childMenuExists (childMenuId) {
        const childMenuToggleButton = this.element.querySelector(
          `[${this.toggleAttribute} = "${childMenuId}"]`
        );

        const childMenu = this.element.querySelector(
          `[${this.childMenuAttribute} = "${childMenuId}"]`
        );

        return childMenuToggleButton && childMenu
      },


      _eventDispatched (name, childMenu) {
        const dispatched = Component.dispatchCustomEvent(
          name,
          this.element,
          { list: childMenu }
        );

        return dispatched
      }
    }
  }
}



class Tabs extends Component {


  static get selector () {
    return '[data-rvt-tabs]'
  }


  static get methods () {
    return {


      init () {
        this._initSelectors();
        this._initElements();

        Component.bindMethodToDOMElement(this, 'activateTab', this.activateTab);
      },


      _initSelectors () {
        this.tabAttribute = 'data-rvt-tab';
        this.panelAttribute = 'data-rvt-tab-panel';

        this.tabSelector = `[${this.tabAttribute}]`;
        this.panelSelector = `[${this.panelAttribute}]`;
        this.tablistSelector = '[role="tablist"]';
        this.initialTabSelector = '[data-rvt-tab-init]';
      },


      _initElements () {
        this.tablist = this.element.querySelector(this.tablistSelector);
        this.tabs = Array.from(this.element.querySelectorAll(this.tabSelector));
        this.panels = Array.from(this.element.querySelectorAll(this.panelSelector));
      },


      connected () {
        Component.dispatchComponentAddedEvent(this.element);
        Component.watchForDOMChanges(this);

        this._activateInitialTab();
      },


      _activateInitialTab () {
        const initialTab = this.element.querySelector(this.initialTabSelector);
        const firstTab = this.panels[0];

        initialTab
          ? this.activateTab(initialTab.getAttribute(this.panelAttribute))
          : this.activateTab(firstTab.getAttribute(this.panelAttribute));
      },


      disconnected () {
        Component.dispatchComponentRemovedEvent(this.element);
        Component.stopWatchingForDOMChanges(this);
      },


      onClick (event) {
        if (!this._eventOriginatedInsideTab(event)) { return }

        this.activateTab(this._getClickedTabId(event));
      },


      _eventOriginatedInsideTab (event) {
        return event.target.closest(this.tabSelector)
      },


      _getClickedTabId (event) {
        return event.target.closest(this.tabSelector).getAttribute(this.tabAttribute)
      },


      onKeydown (event) {
        if (!this._eventOriginatedInsideTab(event)) { return }

        this._setNeighboringTabIndexes(event);

        switch (event.keyCode) {
          case keyCodes.left:
            event.preventDefault();
            this._focusPreviousTab();
            break

          case keyCodes.right:
            event.preventDefault();
            this._focusNextTab();
            break

          case keyCodes.home:
            event.preventDefault();
            this._focusFirstTab();
            break

          case keyCodes.end:
            event.preventDefault();
            this._focusLastTab();
            break
        }
      },


      _setNeighboringTabIndexes (event) {
        const currentTab = event.target.closest(this.tabSelector);

        this.previousTabIndex = this.tabs.indexOf(currentTab) - 1;
        this.nextTabIndex = this.tabs.indexOf(currentTab) + 1;
      },


      _focusPreviousTab () {
        this.tabs[this.previousTabIndex]
          ? this.tabs[this.previousTabIndex].focus()
          : this.tabs[this.tabs.length - 1].focus();
      },


      _focusNextTab () {
        this.tabs[this.nextTabIndex]
          ? this.tabs[this.nextTabIndex].focus()
          : this.tabs[0].focus();
      },


      _focusFirstTab () {
        this.tabs[0].focus();
      },


      _focusLastTab () {
        this.tabs[this.tabs.length - 1].focus();
      },


      activateTab (tabId) {
        this._setTabToActivate(tabId);

        if (!this._tabToActivateExists()) {
          console.warn(`No such tab '${tabId}' in activateTab()`);
          return
        }

        if (!this._tabActivatedEventDispatched()) { return }

        this._deactivateUnselectedTabs();
        this._activateSelectedTab();
      },


      _setTabToActivate (tabId) {
        this.tabToActivate = this.element.querySelector(`[${this.tabAttribute} = "${tabId}"]`);
        this.panelToActivate = this.element.querySelector(`[${this.panelAttribute} = "${tabId}"]`);
      },


      _tabToActivateExists () {
        return this.tabToActivate && this.panelToActivate
      },


      _tabActivatedEventDispatched () {
        const dispatched = Component.dispatchCustomEvent(
          'TabActivated',
          this.element,
          { tab: this.panelToActivate }
        );

        return dispatched
      },


      _deactivateUnselectedTabs () {
        this.panels.forEach((panel, index) => {
          if (!this._panelShouldBeActivated(panel)) {
            this._deactivateTab(panel, index);
          }
        });
      },


      _panelShouldBeActivated (panel) {
        panel.getAttribute(this.panelAttribute) !== this.panelToActivate.dataset.rvtTabPanel;
      },


      _deactivateTab (panel, tabIndex) {
        panel.setAttribute('hidden', '');
        this.tabs[tabIndex].setAttribute('aria-selected', 'false');
        this.tabs[tabIndex].setAttribute('tabindex', '-1');
      },


      _activateSelectedTab () {
        this.tabToActivate.setAttribute('aria-selected', 'true');
        this.tabToActivate.removeAttribute('tabindex');
        this.panelToActivate.removeAttribute('hidden');
      }
    }
  }
}



function init () {
  Accordion.initAll();
  Alert.initAll();
  Disclosure.initAll();
  Dropdown.initAll();
  FileInput.initAll();
  Dialog.initAll();
  Sidenav.initAll();
  Tabs.initAll();
}

export { Accordion, Alert, Dialog, Disclosure, Dropdown, FileInput, Sidenav, Tabs, init };
