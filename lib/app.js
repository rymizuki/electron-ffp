/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _riot = __webpack_require__(1);

	var _riot2 = _interopRequireDefault(_riot);

	__webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_riot2.default.mount('ffp');

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.3.1, @license MIT, (c) 2015 Muut Inc. + contributors */

	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.3.1', settings: {} },
	  // be aware, internal usage
	  // ATTENTION: prefix the global dynamic variables with `__`

	  // counter to give a unique id to all the Tag instances
	  __uid = 0,
	  // tags instances cache
	  __virtualDom = [],
	  // tags implementation cache
	  __tagImpl = {},

	  /**
	   * Const
	   */
	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',

	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_FUNCTION = 'function',
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:opt(ion|group)|tbody|col|t[rhd])$/,
	  RESERVED_WORDS_BLACKLIST = ['_item', '_id', '_parent', 'update', 'root', 'mount', 'unmount', 'mixin', 'isMounted', 'isLoop', 'tags', 'parent', 'opts', 'trigger', 'on', 'off', 'one'],

	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0
	/* istanbul ignore next */
	riot.observable = function(el) {

	  /**
	   * Extend the original object or create a new empty one
	   * @type { Object }
	   */

	  el = el || {}

	  /**
	   * Private variables and methods
	   */

	  var callbacks = {},
	    onEachEvent = function(e, fn) { e.replace(/\S+/g, fn) },
	    defineProperty = function (key, value) {
	      Object.defineProperty(el, key, {
	        value: value,
	        enumerable: false,
	        writable: false,
	        configurable: false
	      })
	    }

	  /**
	   * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
	   * @param  { String } events - events ids
	   * @param  { Function } fn - callback function
	   * @returns { Object } el
	   */

	  defineProperty('on', function(events, fn) {
	    if (typeof fn != 'function')  return el

	    onEachEvent(events, function(name, pos) {
	      (callbacks[name] = callbacks[name] || []).push(fn)
	      fn.typed = pos > 0
	    })

	    return el
	  })

	  /**
	   * Removes the given space separated list of `events` listeners
	   * @param   { String } events - events ids
	   * @param   { Function } fn - callback function
	   * @returns { Object } el
	   */

	  defineProperty('off', function(events, fn) {
	    if (events == '*') callbacks = {}
	    else {
	      onEachEvent(events, function(name) {
	        if (fn) {
	          var arr = callbacks[name]
	          for (var i = 0, cb; cb = arr && arr[i]; ++i) {
	            if (cb == fn) arr.splice(i--, 1)
	          }
	        } else delete callbacks[name]
	      })
	    }
	    return el
	  })

	  /**
	   * Listen to the given space separated list of `events` and execute the `callback` at most once
	   * @param   { String } events - events ids
	   * @param   { Function } fn - callback function
	   * @returns { Object } el
	   */

	  defineProperty('one', function(events, fn) {
	    function on() {
	      el.off(events, on)
	      fn.apply(el, arguments)
	    }
	    return el.on(events, on)
	  })

	  /**
	   * Execute all callback functions that listen to the given space separated list of `events`
	   * @param   { String } events - events ids
	   * @returns { Object } el
	   */

	  defineProperty('trigger', function(events) {

	    // getting the arguments
	    // skipping the first one
	    var arglen = arguments.length - 1,
	      args = new Array(arglen)
	    for (var i = 0; i < arglen; i++) {
	      args[i] = arguments[i + 1]
	    }

	    onEachEvent(events, function(name) {

	      var fns = (callbacks[name] || []).slice(0)

	      for (var i = 0, fn; fn = fns[i]; ++i) {
	        if (fn.busy) return
	        fn.busy = 1

	        try {
	          fn.apply(el, fn.typed ? [name].concat(args) : args)
	        } catch (e) { /* error */}
	        if (fns[i] !== fn) { i-- }
	        fn.busy = 0
	      }

	      if (callbacks.all && name != 'all')
	        el.trigger.apply(el, ['all', name].concat(args))

	    })

	    return el
	  })

	  return el

	}
	/* istanbul ignore next */
	;(function(riot) { if (!window) return;

	/**
	 * Simple client-side router
	 * @module riot-route
	 */


	var RE_ORIGIN = /^.+?\/+[^\/]+/,
	  EVENT_LISTENER = 'EventListener',
	  REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
	  ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
	  HAS_ATTRIBUTE = 'hasAttribute',
	  REPLACE = 'replace',
	  POPSTATE = 'popstate',
	  TRIGGER = 'trigger',
	  MAX_EMIT_STACK_LEVEL = 3,
	  win = window,
	  doc = document,
	  loc = win.history.location || win.location, // see html5-history-api
	  prot = Router.prototype, // to minify more
	  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
	  started = false,
	  central = riot.observable(),
	  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0

	/**
	 * Default parser. You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_PARSER(path) {
	  return path.split(/[/?#]/)
	}

	/**
	 * Default parser (second). You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @param {string} filter - filter string (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_SECOND_PARSER(path, filter) {
	  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
	    args = path.match(re)

	  if (args) return args.slice(1)
	}

	/**
	 * Router class
	 */
	function Router() {
	  this.$ = []
	  riot.observable(this) // make it observable
	  central.on('stop', this.s.bind(this))
	  central.on('emit', this.e.bind(this))
	}

	function normalize(path) {
	  return path[REPLACE](/^\/|\/$/, '')
	}

	function isString(str) {
	  return typeof str == 'string'
	}

	/**
	 * Get the part after domain name
	 * @param {string} href - fullpath
	 * @returns {string} path from root
	 */
	function getPathFromRoot(href) {
	  return (href || loc.href)[REPLACE](RE_ORIGIN, '')
	}

	/**
	 * Get the part after base
	 * @param {string} href - fullpath
	 * @returns {string} path from base
	 */
	function getPathFromBase(href) {
	  return base[0] == '#'
	    ? (href || loc.href).split(base)[1] || ''
	    : getPathFromRoot(href)[REPLACE](base, '')
	}

	function emit(force) {
	  // the stack is needed for redirections
	  var isRoot = emitStackLevel == 0
	  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return

	  emitStackLevel++
	  emitStack.push(function() {
	    var path = getPathFromBase()
	    if (force || path != current) {
	      central[TRIGGER]('emit', path)
	      current = path
	    }
	  })
	  if (isRoot) {
	    while (emitStack.length) {
	      emitStack[0]()
	      emitStack.shift()
	    }
	    emitStackLevel = 0
	  }
	}

	function click(e) {
	  if (
	    e.which != 1 // not left click
	    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
	    || e.defaultPrevented // or default prevented
	  ) return

	  var el = e.target
	  while (el && el.nodeName != 'A') el = el.parentNode
	  if (
	    !el || el.nodeName != 'A' // not A tag
	    || el[HAS_ATTRIBUTE]('download') // has download attr
	    || !el[HAS_ATTRIBUTE]('href') // has no href attr
	    || el.target && el.target != '_self' // another window or frame
	    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
	  ) return

	  if (el.href != loc.href) {
	    if (el.href.split('#')[0] == loc.href.split('#')[0]) return // internal jump
	    go(getPathFromBase(el.href), el.title || doc.title)
	  }
	  e.preventDefault()
	}

	/**
	 * Go to the path
	 * @param {string} path - destination path
	 * @param {string} title - page title
	 */
	function go(path, title) {
	  title = title || doc.title
	  // browsers ignores the second parameter `title`
	  history.pushState(null, title, base + normalize(path))
	  // so we need to set it manually
	  doc.title = title
	  emit()
	}

	/**
	 * Go to path or set action
	 * a single string:                go there
	 * two strings:                    go there with setting a title
	 * a single function:              set an action on the default route
	 * a string/RegExp and a function: set an action on the route
	 * @param {(string|function)} first - path / action / filter
	 * @param {(string|RegExp|function)} second - title / action
	 */
	prot.m = function(first, second) {
	  if (isString(first) && (!second || isString(second))) go(first, second)
	  else if (second) this.r(first, second)
	  else this.r('@', first)
	}

	/**
	 * Stop routing
	 */
	prot.s = function() {
	  this.off('*')
	  this.$ = []
	}

	/**
	 * Emit
	 * @param {string} path - path
	 */
	prot.e = function(path) {
	  this.$.concat('@').some(function(filter) {
	    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter))
	    if (args) {
	      this[TRIGGER].apply(null, [filter].concat(args))
	      return true // exit from loop
	    }
	  }, this)
	}

	/**
	 * Register route
	 * @param {string} filter - filter for matching to url
	 * @param {function} action - action to register
	 */
	prot.r = function(filter, action) {
	  if (filter != '@') {
	    filter = '/' + normalize(filter)
	    this.$.push(filter)
	  }
	  this.on(filter, action)
	}

	var mainRouter = new Router()
	var route = mainRouter.m.bind(mainRouter)

	/**
	 * Create a sub router
	 * @returns {function} the method of a new Router object
	 */
	route.create = function() {
	  var newSubRouter = new Router()
	  // stop only this sub-router
	  newSubRouter.m.stop = newSubRouter.s.bind(newSubRouter)
	  // return sub-router's main method
	  return newSubRouter.m.bind(newSubRouter)
	}

	/**
	 * Set the base of url
	 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
	 */
	route.base = function(arg) {
	  base = arg || '#'
	  current = getPathFromBase() // recalculate current path
	}

	/** Exec routing right now **/
	route.exec = function() {
	  emit(true)
	}

	/**
	 * Replace the default router to yours
	 * @param {function} fn - your parser function
	 * @param {function} fn2 - your secondParser function
	 */
	route.parser = function(fn, fn2) {
	  if (!fn && !fn2) {
	    // reset parser for testing...
	    parser = DEFAULT_PARSER
	    secondParser = DEFAULT_SECOND_PARSER
	  }
	  if (fn) parser = fn
	  if (fn2) secondParser = fn2
	}

	/**
	 * Helper function to get url query as an object
	 * @returns {object} parsed query
	 */
	route.query = function() {
	  var q = {}
	  loc.href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v })
	  return q
	}

	/** Stop routing **/
	route.stop = function () {
	  if (started) {
	    win[REMOVE_EVENT_LISTENER](POPSTATE, emit)
	    doc[REMOVE_EVENT_LISTENER](clickEvent, click)
	    central[TRIGGER]('stop')
	    started = false
	  }
	}

	/**
	 * Start routing
	 * @param {boolean} autoExec - automatically exec after starting if true
	 */
	route.start = function (autoExec) {
	  if (!started) {
	    win[ADD_EVENT_LISTENER](POPSTATE, emit)
	    doc[ADD_EVENT_LISTENER](clickEvent, click)
	    started = true
	  }
	  if (autoExec) emit(true)
	}

	/** Prepare the router **/
	route.base()
	route.parser()

	riot.route = route
	})(riot)
	/* istanbul ignore next */

	/**
	 * The riot template engine
	 * @version 2.3.0
	 */

	/**
	 * @module brackets
	 *
	 * `brackets         `  Returns a string or regex based on its parameter:
	 *                      With a number returns the current left (0) or right (1) brackets.
	 *                      With a regex, returns the original regex if the current brackets
	 *                      are the default, or a new one with the default brackets replaced
	 *                      by the current custom brackets.
	 *                      WARNING: recreated regexes discards the `/i` and `/m` flags.
	 * `brackets.settings`  This object mirrors the `riot.settings` object, you can assign this
	 *                      if riot is not in context.
	 * `brackets.set     `  The recommended option to change the current tiot brackets, check
	 *                      its parameter and reconfigures the internal state immediately.
	 */

	var brackets = (function (UNDEF) {

	  var
	    REGLOB  = 'g',

	    MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,
	    STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,

	    S_QBSRC = STRINGS.source + '|' +
	      /(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/])/.source + '|' +
	      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,

	    DEFAULT = '{ }',

	    FINDBRACES = {
	      '(': _regExp('([()])|'   + S_QBSRC, REGLOB),
	      '[': _regExp('([[\\]])|' + S_QBSRC, REGLOB),
	      '{': _regExp('([{}])|'   + S_QBSRC, REGLOB)
	    }

	  var
	    cachedBrackets = UNDEF,
	    _regex,
	    _pairs = []

	  function _regExp(source, flags) { return new RegExp(source, flags) }

	  function _loopback(re) { return re }

	  function _rewrite(re) {
	    return new RegExp(
	      re.source.replace(/{/g, _pairs[2]).replace(/}/g, _pairs[3]), re.global ? REGLOB : ''
	    )
	  }

	  function _reset(pair) {
	    pair = pair || DEFAULT

	    if (pair !== _pairs[8]) {
	      var bp = pair.split(' ')

	      if (pair === DEFAULT) {
	        _pairs = bp.concat(bp)
	        _regex = _loopback
	      }
	      else {
	        if (bp.length !== 2 || /[\x00-\x1F<>a-zA-Z0-9'",;\\]/.test(pair)) {
	          throw new Error('Unsupported brackets "' + pair + '"')
	        }
	        _pairs = bp.concat(pair.replace(/(?=[[\]()*+?.^$|])/g, '\\').split(' '))
	        _regex = _rewrite
	      }
	      _pairs[4] = _regex(_pairs[1].length > 1 ? /(?:^|[^\\]){[\S\s]*?}/ : /(?:^|[^\\]){[^}]*}/)
	      _pairs[5] = _regex(/\\({|})/g)
	      _pairs[6] = _regex(/(\\?)({)/g)
	      _pairs[7] = _regExp('(\\\\?)(?:([[({])|(' + _pairs[3] + '))|' + S_QBSRC, REGLOB)
	      _pairs[9] = _regExp(/^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S+)\s*}/)
	      _pairs[8] = pair
	    }
	    _brackets.settings.brackets = cachedBrackets = pair
	  }

	  function _set(pair) {
	    if (cachedBrackets !== pair) {
	      _reset(pair)
	    }
	  }

	  function _brackets(reOrIdx) {
	    _set(_brackets.settings.brackets)
	    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _pairs[reOrIdx]
	  }

	  _brackets.split = function split(str, tmpl) {

	    var
	      parts = [],
	      match,
	      isexpr,
	      start,
	      pos,
	      re = _brackets(6)

	    isexpr = start = re.lastIndex = 0

	    while (match = re.exec(str)) {

	      pos = match.index

	      if (isexpr) {

	        if (match[2]) {
	          re.lastIndex = skipBraces(match[2], re.lastIndex)
	          continue
	        }

	        if (!match[3])
	          continue
	      }

	      if (!match[1]) {
	        unescapeStr(str.slice(start, pos))
	        start = re.lastIndex
	        re = _pairs[6 + (isexpr ^= 1)]
	        re.lastIndex = start
	      }
	    }

	    if (str && start < str.length) {
	      unescapeStr(str.slice(start))
	    }

	    return parts

	    function unescapeStr(str) {
	      if (tmpl || isexpr)
	        parts.push(str && str.replace(_pairs[5], '$1'))
	      else
	        parts.push(str)
	    }

	    function skipBraces(ch, pos) {
	      var
	        match,
	        recch = FINDBRACES[ch],
	        level = 1
	      recch.lastIndex = pos

	      while (match = recch.exec(str)) {
	        if (match[1] &&
	          !(match[1] === ch ? ++level : --level)) break
	      }
	      return match ? recch.lastIndex : str.length
	    }
	  }

	  _brackets.hasExpr = function hasExpr(str) {
	    return _brackets(4).test(str)
	  }

	  _brackets.loopKeys = function loopKeys(expr) {
	    var m = expr.match(_brackets(9))
	    return m ?
	      { key: m[1], pos: m[2], val: _pairs[0] + m[3] + _pairs[1] } : { val: expr.trim() }
	  }

	  _brackets.array = function array(pair) {
	    if (pair != null) _reset(pair)
	    return _pairs
	  }

	  /* istanbul ignore next: in the node version riot is not in the scope */
	  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
	  _brackets.set = _set

	  _brackets.R_STRINGS = STRINGS
	  _brackets.R_MLCOMMS = MLCOMMS
	  _brackets.S_QBLOCKS = S_QBSRC

	  _reset(_brackets.settings.brackets)

	  return _brackets

	})()

	/**
	 * @module tmpl
	 *
	 * tmpl          - Root function, returns the template value, render with data
	 * tmpl.hasExpr  - Test the existence of a expression inside a string
	 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
	 */

	var tmpl = (function () {

	  var
	    FALSE  = !1,
	    _cache = {}

	  function _tmpl(str, data) {
	    if (!str) return str

	    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
	  }

	  _tmpl.hasExpr = brackets.hasExpr

	  _tmpl.loopKeys = brackets.loopKeys

	  _tmpl.errorHandler = FALSE

	  function _logErr(err, ctx) {

	    if (_tmpl.errorHandler) {

	      err.riotData = {
	        tagName: ctx && ctx.root && ctx.root.tagName,
	        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
	      }
	      _tmpl.errorHandler(err)
	    }
	  }

	  function _create(str) {

	    var expr = _getTmpl(str)
	    if (expr.slice(0, 11) !== "try{return ") expr = 'return ' + expr

	    return new Function('E', expr + ';')  // eslint-disable-line indent
	  }

	  var
	    RE_QBLOCK = new RegExp(brackets.S_QBLOCKS, 'g'),
	    RE_QBMARK = /\x01(\d+)~/g

	  function _getTmpl(str) {
	    var
	      qstr = [],
	      expr,
	      parts = brackets.split(str, 1)

	    if (parts.length > 2 || parts[0]) {
	      var i, j, list = []

	      for (i = j = 0; i < parts.length; ++i) {

	        expr = parts[i]

	        if (expr && (expr = i & 1 ?

	              _parseExpr(expr, 1, qstr) :

	              '"' + expr
	                .replace(/\\/g, '\\\\')
	                .replace(/\r\n?|\n/g, '\\n')
	                .replace(/"/g, '\\"') +
	              '"'

	          )) list[j++] = expr

	      }

	      expr = j < 2 ? list[0] :
	             '[' + list.join(',') + '].join("")'
	    }
	    else {

	      expr = _parseExpr(parts[1], 0, qstr)
	    }

	    if (qstr[0])
	      expr = expr.replace(RE_QBMARK, function (_, pos) {
	        return qstr[pos]
	          .replace(/\r/g, '\\r')
	          .replace(/\n/g, '\\n')
	      })

	    return expr
	  }

	  var
	    CS_IDENT = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\x01(\d+)~):/,
	    RE_BRACE = /,|([[{(])|$/g

	  function _parseExpr(expr, asText, qstr) {

	    expr = expr
	          .replace(RE_QBLOCK, function (s, div) {
	            return s.length > 2 && !div ? '\x01' + (qstr.push(s) - 1) + '~' : s
	          })
	          .replace(/\s+/g, ' ').trim()
	          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')

	    if (expr) {
	      var
	        list = [],
	        cnt = 0,
	        match

	      while (expr &&
	            (match = expr.match(CS_IDENT)) &&
	            !match.index
	        ) {
	        var
	          key,
	          jsb,
	          re = /,|([[{(])|$/g

	        expr = RegExp.rightContext
	        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]

	        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)

	        jsb  = expr.slice(0, match.index)
	        expr = RegExp.rightContext

	        list[cnt++] = _wrapExpr(jsb, 1, key)
	      }

	      expr = !cnt ? _wrapExpr(expr, asText) :
	          cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
	    }
	    return expr

	    function skipBraces(jsb, re) {
	      var
	        match,
	        lv = 1,
	        ir = jsb === '(' ? /[()]/g : jsb === '[' ? /[[\]]/g : /[{}]/g

	      ir.lastIndex = re.lastIndex
	      while (match = ir.exec(expr)) {
	        if (match[0] === jsb) ++lv
	        else if (!--lv) break
	      }
	      re.lastIndex = lv ? expr.length : ir.lastIndex
	    }
	  }

	  // istanbul ignore next: not both
	  var JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').'
	  var JS_VARNAME = /[,{][$\w]+:|(^ *|[^$\w\.])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g

	  function _wrapExpr(expr, asText, key) {
	    var tb = FALSE

	    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
	      if (mvar) {
	        pos = tb ? 0 : pos + match.length

	        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
	          match = p + '("' + mvar + JS_CONTEXT + mvar
	          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
	        }
	        else if (pos)
	          tb = !/^(?=(\.[$\w]+))\1(?:[^.[(]|$)/.test(s.slice(pos))
	      }
	      return match
	    })

	    if (tb) {
	      expr = "try{return " + expr + '}catch(e){E(e,this)}'
	    }

	    if (key) {

	      expr = (tb ?
	          'function(){' + expr + '}.call(this)' : '(' + expr + ')'
	        ) + '?"' + key + '":""'
	    }
	    else if (asText) {

	      expr = 'function(v){' + (tb ?
	          expr.replace('return ', 'v=') : 'v=(' + expr + ')'
	        ) + ';return v||v===0?v:""}.call(this)'
	    }

	    return expr
	  }

	  // istanbul ignore next: compatibility fix for beta versions
	  _tmpl.parse = function (s) { return s }

	  return _tmpl

	})()


	/*
	  lib/browser/tag/mkdom.js

	  Includes hacks needed for the Internet Explorer version 9 and bellow

	*/
	// http://kangax.github.io/compat-table/es5/#ie8
	// http://codeplanet.io/dropping-ie8/

	var mkdom = (function (checkIE) {

	  var rootEls = {
	      'tr': 'tbody',
	      'th': 'tr',
	      'td': 'tr',
	      'tbody': 'table',
	      'col': 'colgroup'
	    },
	    GENERIC = 'div'

	  checkIE = checkIE && checkIE < 10

	  // creates any dom element in a div, table, or colgroup container
	  function _mkdom(html) {

	    var match = html && html.match(/^\s*<([-\w]+)/),
	      tagName = match && match[1].toLowerCase(),
	      rootTag = rootEls[tagName] || GENERIC,
	      el = mkEl(rootTag)

	    el.stub = true

	    /* istanbul ignore next */
	    if (checkIE && tagName && (match = tagName.match(SPECIAL_TAGS_REGEX)))
	      ie9elem(el, html, tagName, !!match[1])
	    else
	      el.innerHTML = html

	    return el
	  }

	  // creates tr, th, td, option, optgroup element for IE8-9
	  /* istanbul ignore next */
	  function ie9elem(el, html, tagName, select) {

	    var div = mkEl(GENERIC),
	      tag = select ? 'select>' : 'table>',
	      child

	    div.innerHTML = '<' + tag + html + '</' + tag

	    child = $(tagName, div)
	    if (child)
	      el.appendChild(child)

	  }
	  // end ie9elem()

	  return _mkdom

	})(IE_VERSION)

	/**
	 * Convert the item looped into an object used to extend the child tag properties
	 * @param   { Object } expr - object containing the keys used to extend the children tags
	 * @param   { * } key - value to assign to the new object returned
	 * @param   { * } val - value containing the position of the item in the array
	 * @returns { Object } - new object containing the values of the original item
	 *
	 * The variables 'key' and 'val' are arbitrary.
	 * They depend on the collection type looped (Array, Object)
	 * and on the expression used on the each tag
	 *
	 */
	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}

	/**
	 * Unmount the redundant tags
	 * @param   { Array } items - array containing the current items to loop
	 * @param   { Array } tags - array containing all the children tags
	 */
	function unmountRedundant(items, tags) {

	  var i = tags.length,
	    j = items.length

	  while (i > j) {
	    var t = tags[--i]
	    tags.splice(i, 1)
	    t.unmount()
	  }
	}

	/**
	 * Move the nested custom tags in non custom loop tags
	 * @param   { Object } child - non custom loop tag
	 * @param   { Number } i - current position of the loop tag
	 */
	function moveNestedTags(child, i) {
	  Object.keys(child.tags).forEach(function(tagName) {
	    var tag = child.tags[tagName]
	    if (isArray(tag))
	      each(tag, function (t) {
	        moveChildTag(t, tagName, i)
	      })
	    else
	      moveChildTag(tag, tagName, i)
	  })
	}

	/**
	 * Adds the elements for a virtual tag
	 * @param { Tag } tag - the tag whose root's children will be inserted or appended
	 * @param { Node } src - the node that will do the inserting or appending
	 * @param { Tag } target - only if inserting, insert before this tag's first child
	 */
	function addVirtual(tag, src, target) {
	  var el = tag._root
	  tag._virts = []
	  while (el) {
	    var sib = el.nextSibling
	    if (target)
	      src.insertBefore(el, target._root)
	    else
	      src.appendChild(el)

	    tag._virts.push(el) // hold for unmounting
	    el = sib
	  }
	}

	/**
	 * Move virtual tag and all child nodes
	 * @param { Tag } tag - first child reference used to start move
	 * @param { Node } src  - the node that will do the inserting
	 * @param { Tag } target - insert before this tag's first child
	 * @param { Number } len - how many child nodes to move
	 */
	function moveVirtual(tag, src, target, len) {
	  var el = tag._root
	  for (var i = 0; i < len; i++) {
	    var sib = el.nextSibling
	    src.insertBefore(el, target._root)
	    el = sib
	  }
	}


	/**
	 * Manage tags having the 'each'
	 * @param   { Object } dom - DOM node we need to loop
	 * @param   { Tag } parent - parent tag instance where the dom node is contained
	 * @param   { String } expr - string contained in the 'each' attribute
	 */
	function _each(dom, parent, expr) {

	  // remove the each property from the original tag
	  remAttr(dom, 'each')

	  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
	    tagName = getTagName(dom),
	    impl = __tagImpl[tagName] || { tmpl: dom.outerHTML },
	    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
	    root = dom.parentNode,
	    isSpecialTag = SPECIAL_TAGS_REGEX.test(tagName),
	    ref = document.createTextNode(''),
	    child = getTag(dom),
	    tags = [],
	    oldItems = [],
	    checksum,
	    isVirtual = dom.tagName == 'VIRTUAL'

	  // parse the each expression
	  expr = tmpl.loopKeys(expr)

	  // insert a marked where the loop tags will be injected
	  root.insertBefore(ref, dom)

	  // clean template code
	  parent.one('before-mount', function () {

	    // remove the original DOM node
	    dom.parentNode.removeChild(dom)
	    if (root.stub) root = parent.root

	  }).on('update', function () {
	    // get the new items collection
	    var items = tmpl(expr.val, parent),
	      // create a fragment to hold the new DOM nodes to inject in the parent tag
	      frag = document.createDocumentFragment()

	    // object loop. any changes cause full redraw
	    if (!isArray(items)) {
	      checksum = items ? JSON.stringify(items) : ''
	      items = !items ? [] :
	        Object.keys(items).map(function (key) {
	          return mkitem(expr, key, items[key])
	        })
	    }

	    // loop all the new items
	    each(items, function(item, i) {
	      // reorder only if the items are objects
	      var _mustReorder = mustReorder && item instanceof Object,
	        oldPos = oldItems.indexOf(item),
	        pos = ~oldPos && _mustReorder ? oldPos : i,
	        // does a tag exist in this position?
	        tag = tags[pos]

	      item = !checksum && expr.key ? mkitem(expr, item, i) : item

	      // new tag
	      if (
	        !_mustReorder && !tag // with no-reorder we just update the old tags
	        ||
	        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
	      ) {

	        tag = new Tag(impl, {
	          parent: parent,
	          isLoop: true,
	          hasImpl: !!__tagImpl[tagName],
	          root: useRoot ? root : dom.cloneNode(),
	          item: item
	        }, dom.innerHTML)

	        tag.mount()
	        if (isVirtual) tag._root = tag.root.firstChild // save reference for further moves or inserts
	        // this tag must be appended
	        if (i == tags.length) {
	          if (isVirtual)
	            addVirtual(tag, frag)
	          else frag.appendChild(tag.root)
	        }
	        // this tag must be insert
	        else {
	          if (isVirtual)
	            addVirtual(tag, root, tags[i])
	          else root.insertBefore(tag.root, tags[i].root)
	          oldItems.splice(i, 0, item)
	        }

	        tags.splice(i, 0, tag)
	        pos = i // handled here so no move
	      } else tag.update(item)

	      // reorder the tag if it's not located in its previous position
	      if (pos !== i && _mustReorder) {
	        // update the DOM
	        if (isVirtual)
	          moveVirtual(tag, root, tags[i], dom.childNodes.length)
	        else root.insertBefore(tag.root, tags[i].root)
	        // update the position attribute if it exists
	        if (expr.pos)
	          tag[expr.pos] = i
	        // move the old tag instance
	        tags.splice(i, 0, tags.splice(pos, 1)[0])
	        // move the old item
	        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0])
	        // if the loop tags are not custom
	        // we need to move all their custom tags into the right position
	        if (!child) moveNestedTags(tag, i)
	      }

	      // cache the original item to use it in the events bound to this node
	      // and its children
	      tag._item = item
	      // cache the real parent tag internally
	      defineProperty(tag, '_parent', parent)

	    })

	    // remove the redundant tags
	    unmountRedundant(items, tags)

	    // insert the new nodes
	    if (isSpecialTag) root.appendChild(frag)
	    else root.insertBefore(frag, ref)

	    // set the 'tags' property of the parent tag
	    // if child is 'undefined' it means that we don't need to set this property
	    // for example:
	    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
	    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
	    if (child) parent.tags[tagName] = tags

	    // clone the items array
	    oldItems = items.slice()

	  })

	}


	function parseNamedElements(root, tag, childTags, forceParsingNamed) {

	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop || (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each')) ? 1 : 0

	      // custom child tag
	      if (childTags) {
	        var child = getTag(dom)

	        if (child && !dom.isLoop)
	          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag))
	      }

	      if (!dom.isLoop || forceParsingNamed)
	        setNamed(dom, tag, [])
	    }

	  })

	}

	function parseExpressions(root, tag, expressions) {

	  function addExpr(dom, val, extra) {
	    if (tmpl.hasExpr(val)) {
	      var expr = { dom: dom, expr: val }
	      expressions.push(extend(expr, extra))
	    }
	  }

	  walk(root, function(dom) {
	    var type = dom.nodeType

	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return

	    /* element */

	    // loop
	    var attr = getAttr(dom, 'each')

	    if (attr) { _each(dom, tag, attr); return false }

	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]

	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }

	    })

	    // skip custom tags
	    if (getTag(dom)) return false

	  })

	}
	function Tag(impl, conf, innerHTML) {

	  var self = riot.observable(this),
	    opts = inherit(conf.opts) || {},
	    dom = mkdom(impl.tmpl),
	    parent = conf.parent,
	    isLoop = conf.isLoop,
	    hasImpl = conf.hasImpl,
	    item = cleanUpData(conf.item),
	    expressions = [],
	    childTags = [],
	    root = conf.root,
	    fn = impl.fn,
	    tagName = root.tagName.toLowerCase(),
	    attr = {},
	    propsInSyncWithParent = []

	  if (fn && root._tag) root._tag.unmount(true)

	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop

	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this

	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  defineProperty(this, '_riot_id', ++__uid) // base 1 allows test !t._riot_id

	  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)

	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (tmpl.hasExpr(val)) attr[el.name] = val
	  })

	  if (dom.innerHTML && !/^(select|optgroup|table|tbody|tr|col(?:group)?)$/.test(tagName))
	    // replace all the yield tags with the tag inner html
	    dom.innerHTML = replaceYield(dom.innerHTML, innerHTML)

	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self

	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      opts[toCamel(el.name)] = tmpl(el.value, ctx)
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[toCamel(name)] = tmpl(attr[name], ctx)
	    })
	  }

	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
	        self[key] = data[key]
	    }
	  }

	  function inheritFromParent () {
	    if (!self.parent || !isLoop) return
	    each(Object.keys(self.parent), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !contains(RESERVED_WORDS_BLACKLIST, k) && contains(propsInSyncWithParent, k)
	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = self.parent[k]
	      }
	    })
	  }

	  defineProperty(this, 'update', function(data) {

	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent
	    inheritFromParent()
	    // normalize the tag properties in case an item object was initially passed
	    if (data && typeof item === T_OBJECT) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)
	    self.trigger('updated')
	    return this
	  })

	  defineProperty(this, 'mixin', function() {
	    each(arguments, function(mix) {
	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
	      each(Object.keys(mix), function(key) {
	        // bind methods to self
	        if (key != 'init')
	          self[key] = isFunction(mix[key]) ? mix[key].bind(self) : mix[key]
	      })
	      // init method will be called automatically
	      if (mix.init) mix.init.bind(self)()
	    })
	    return this
	  })

	  defineProperty(this, 'mount', function() {

	    updateOpts()

	    // initialiation
	    if (fn) fn.call(self, opts)

	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)

	    // mount the child tags
	    toggle(true)

	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs || hasImpl) {
	      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v) })
	      parseExpressions(self.root, self, expressions)
	    }

	    if (!self.parent || isLoop) self.update(item)

	    // internal use only, fixes #403
	    self.trigger('before-mount')

	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      self.root = root = dom.firstChild

	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) self.root = root = parent.root
	    }

	    // parse the named dom nodes in the looped child
	    // adding them to the parent as well
	    if (isLoop)
	      parseNamedElements(self.root, self.parent, null, true)

	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  })


	  defineProperty(this, 'unmount', function(keepRootTag) {
	    var el = root,
	      p = el.parentNode,
	      ptag

	    self.trigger('before-unmount')

	    // remove this tag instance from the global virtualDom variable
	    __virtualDom.splice(__virtualDom.indexOf(self), 1)

	    if (this._virts) {
	      each(this._virts, function(v) {
	        v.parentNode.removeChild(v)
	      })
	    }

	    if (p) {

	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._riot_id == self._riot_id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }

	      else
	        while (el.firstChild) el.removeChild(el.firstChild)

	      if (!keepRootTag)
	        p.removeChild(el)
	      else
	        // the riot-tag attribute isn't needed anymore, remove it
	        remAttr(p, 'riot-tag')
	    }


	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    self.isMounted = false
	    // somehow ie8 does not like `delete root._tag`
	    root._tag = null

	  })

	  function toggle(isMount) {

	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

	    // listen/unlisten parent (events flow one way from parent to children)
	    if (parent) {
	      var evt = isMount ? 'on' : 'off'

	      // the loop tags will be always in sync with the parent automatically
	      if (isLoop)
	        parent[evt]('unmount', self.unmount)
	      else
	        parent[evt]('update', self.update)[evt]('unmount', self.unmount)
	    }
	  }

	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)

	}
	/**
	 * Attach an event to a DOM node
	 * @param { String } name - event name
	 * @param { Function } handler - event callback
	 * @param { Object } dom - dom node
	 * @param { Tag } tag - tag instance
	 */
	function setEventHandler(name, handler, dom, tag) {

	  dom[name] = function(e) {

	    var ptag = tag._parent,
	      item = tag._item,
	      el

	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag._parent
	      }

	    // cross browser event fix
	    e = e || window.event

	    // override the event properties
	    if (isWritable(e, 'currentTarget')) e.currentTarget = dom
	    if (isWritable(e, 'target')) e.target = e.srcElement
	    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode

	    e.item = item

	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }

	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }

	  }

	}


	/**
	 * Insert a DOM node replacing another one (used by if- attribute)
	 * @param   { Object } root - parent node
	 * @param   { Object } node - node replaced
	 * @param   { Object } before - node added
	 */
	function insertTo(root, node, before) {
	  if (root) {
	    root.insertBefore(before, node)
	    root.removeChild(node)
	  }
	}

	/**
	 * Update the expressions in a Tag instance
	 * @param   { Array } expressions - expression that must be re evaluated
	 * @param   { Tag } tag - tag instance
	 */
	function update(expressions, tag) {

	  each(expressions, function(expr, i) {

	    var dom = expr.dom,
	      attrName = expr.attr,
	      value = tmpl(expr.expr, tag),
	      parent = expr.dom.parentNode

	    if (expr.bool)
	      value = value ? attrName : false
	    else if (value == null)
	      value = ''

	    // leave out riot- prefixes from strings inside textarea
	    // fix #815: any value -> string
	    if (parent && parent.tagName == 'TEXTAREA') value = ('' + value).replace(/riot-/g, '')

	    // no change
	    if (expr.value === value) return
	    expr.value = value

	    // text node
	    if (!attrName) {
	      dom.nodeValue = '' + value    // #815 related
	      return
	    }

	    // remove original attribute
	    remAttr(dom, attrName)
	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)

	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	        add = function() { insertTo(stub.parentNode, stub, dom) },
	        remove = function() { insertTo(dom.parentNode, dom, stub) }

	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted) el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        // otherwise we need to wait the updated event
	        else (tag.parent || tag).one('updated', remove)

	        dom.inStub = true
	      }
	    // show / hide
	    } else if (/^(show|hide)$/.test(attrName)) {
	      if (attrName == 'hide') value = !value
	      dom.style.display = value ? '' : 'none'

	    // field value
	    } else if (attrName == 'value') {
	      dom.value = value

	    // <img src="{ expr }">
	    } else if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	      if (value)
	        setAttr(dom, attrName.slice(RIOT_PREFIX.length), value)

	    } else {
	      if (expr.bool) {
	        dom[attrName] = value
	        if (!value) return
	      }

	      if (typeof value !== T_OBJECT) setAttr(dom, attrName, value)

	    }

	  })

	}
	/**
	 * Loops an array
	 * @param   { Array } els - collection of items
	 * @param   {Function} fn - callback function
	 * @returns { Array } the array looped
	 */
	function each(els, fn) {
	  for (var i = 0, len = (els || []).length, el; i < len; i++) {
	    el = els[i]
	    // return false -> remove current item during loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}

	/**
	 * Detect if the argument passed is a function
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}

	/**
	 * Remove any DOM attribute from a node
	 * @param   { Object } dom - DOM node we want to update
	 * @param   { String } name - name of the property we want to remove
	 */
	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}

	/**
	 * Convert a string containing dashes to camle case
	 * @param   { String } string - input string
	 * @returns { String } my-string -> myString
	 */
	function toCamel(string) {
	  return string.replace(/(\-\w)/g, function(match) {
	    return match.toUpperCase().replace('-', '')
	  })
	}

	/**
	 * Get the value of any DOM attribute on a node
	 * @param   { Object } dom - DOM node we want to parse
	 * @param   { String } name - name of the attribute we want to get
	 * @returns { String | undefined } name of the node attribute whether it exists
	 */
	function getAttr(dom, name) {
	  return dom.getAttribute(name)
	}

	/**
	 * Set any DOM attribute
	 * @param { Object } dom - DOM node we want to update
	 * @param { String } name - name of the property we want to set
	 * @param { String } val - value of the property we want to set
	 */
	function setAttr(dom, name, val) {
	  dom.setAttribute(name, val)
	}

	/**
	 * Detect the tag implementation by a DOM node
	 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
	 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
	 */
	function getTag(dom) {
	  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
	}
	/**
	 * Add a child tag to its parent into the `tags` object
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the new tag will be stored
	 * @param   { Object } parent - tag instance where the new child tag will be included
	 */
	function addChildTag(tag, tagName, parent) {
	  var cachedTag = parent.tags[tagName]

	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      // don't add the same tag twice
	      if (cachedTag !== tag)
	        parent.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!contains(parent.tags[tagName], tag))
	      parent.tags[tagName].push(tag)
	  } else {
	    parent.tags[tagName] = tag
	  }
	}

	/**
	 * Move the position of a custom tag in its parent tag
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the tag was stored
	 * @param   { Number } newPos - index where the new tag will be stored
	 */
	function moveChildTag(tag, tagName, newPos) {
	  var parent = tag.parent,
	    tags
	  // no parent no move
	  if (!parent) return

	  tags = parent.tags[tagName]

	  if (isArray(tags))
	    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0])
	  else addChildTag(tag, tagName, parent)
	}

	/**
	 * Create a new child tag including it correctly into its parent
	 * @param   { Object } child - child tag implementation
	 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
	 * @param   { String } innerHTML - inner html of the child node
	 * @param   { Object } parent - instance of the parent tag including the child custom tag
	 * @returns { Object } instance of the new child tag just created
	 */
	function initChildTag(child, opts, innerHTML, parent) {
	  var tag = new Tag(child, opts, innerHTML),
	    tagName = getTagName(opts.root),
	    ptag = getImmediateCustomParentTag(parent)
	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag
	  // store the real parent tag
	  // in some cases this could be different from the custom parent tag
	  // for example in nested loops
	  tag._parent = parent

	  // add this tag to the custom parent tag
	  addChildTag(tag, tagName, ptag)
	  // and also to the real parent tag
	  if (ptag !== parent)
	    addChildTag(tag, tagName, parent)
	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  opts.root.innerHTML = ''

	  return tag
	}

	/**
	 * Loop backward all the parents tree to detect the first custom parent tag
	 * @param   { Object } tag - a Tag instance
	 * @returns { Object } the instance of the first custom parent tag found
	 */
	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}

	/**
	 * Helper function to set an immutable property
	 * @param   { Object } el - object where the new property will be set
	 * @param   { String } key - object key where the new property will be stored
	 * @param   { * } value - value of the new property
	* @param   { Object } options - set the propery overriding the default options
	 * @returns { Object } - the initial object
	 */
	function defineProperty(el, key, value, options) {
	  Object.defineProperty(el, key, extend({
	    value: value,
	    enumerable: false,
	    writable: false,
	    configurable: false
	  }, options))
	  return el
	}

	/**
	 * Get the tag name of any DOM node
	 * @param   { Object } dom - DOM node we want to parse
	 * @returns { String } name to identify this dom node in riot
	 */
	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = getAttr(dom, 'name'),
	    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
	                namedTag :
	              child ? child.name : dom.tagName.toLowerCase()

	  return tagName
	}

	/**
	 * Extend any object with other properties
	 * @param   { Object } src - source object
	 * @returns { Object } the resulting extended object
	 *
	 * var obj = { foo: 'baz' }
	 * extend(obj, {bar: 'bar', foo: 'bar'})
	 * console.log(obj) => {bar: 'bar', foo: 'bar'}
	 *
	 */
	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if (obj = args[i]) {
	      for (var key in obj) {
	        // check if this property of the source object could be overridden
	        if (isWritable(src, key))
	          src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}

	/**
	 * Check whether an array contains an item
	 * @param   { Array } arr - target array
	 * @param   { * } item - item to test
	 * @returns { Boolean } Does 'arr' contain 'item'?
	 */
	function contains(arr, item) {
	  return ~arr.indexOf(item)
	}

	/**
	 * Check whether an object is a kind of array
	 * @param   { * } a - anything
	 * @returns {Boolean} is 'a' an array?
	 */
	function isArray(a) { return Array.isArray(a) || a instanceof Array }

	/**
	 * Detect whether a property of an object could be overridden
	 * @param   { Object }  obj - source object
	 * @param   { String }  key - object property
	 * @returns { Boolean } is this property writable?
	 */
	function isWritable(obj, key) {
	  var props = Object.getOwnPropertyDescriptor(obj, key)
	  return typeof obj[key] === T_UNDEF || props && props.writable
	}


	/**
	 * With this function we avoid that the internal Tag methods get overridden
	 * @param   { Object } data - options we want to use to extend the tag instance
	 * @returns { Object } clean object without containing the riot internal reserved words
	 */
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION)) return data

	  var o = {}
	  for (var key in data) {
	    if (!contains(RESERVED_WORDS_BLACKLIST, key))
	      o[key] = data[key]
	  }
	  return o
	}

	/**
	 * Walk down recursively all the children tags starting dom node
	 * @param   { Object }   dom - starting node where we will start the recursion
	 * @param   { Function } fn - callback to transform the child node just found
	 */
	function walk(dom, fn) {
	  if (dom) {
	    // stop the recursion
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild

	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}

	/**
	 * Minimize risk: only zero or one _space_ between attr & value
	 * @param   { String }   html - html string we want to parse
	 * @param   { Function } fn - callback function to apply on any attribute found
	 */
	function walkAttributes(html, fn) {
	  var m,
	    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g

	  while (m = re.exec(html)) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}

	/**
	 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
	 * @param   { Object }  dom - DOM node we want to parse
	 * @returns { Boolean } -
	 */
	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}

	/**
	 * Create a generic DOM node
	 * @param   { String } name - name of the DOM node we want to create
	 * @returns { Object } DOM node just created
	 */
	function mkEl(name) {
	  return document.createElement(name)
	}

	/**
	 * Replace the yield tag from any tag template with the innerHTML of the
	 * original tag in the page
	 * @param   { String } tmpl - tag implementation template
	 * @param   { String } innerHTML - original content of the tag in the DOM
	 * @returns { String } tag template updated without the yield tag
	 */
	function replaceYield(tmpl, innerHTML) {
	  return tmpl.replace(/<(yield)\/?>(<\/\1>)?/gi, innerHTML || '')
	}

	/**
	 * Shorter and fast way to select multiple nodes in the DOM
	 * @param   { String } selector - DOM selector
	 * @param   { Object } ctx - DOM node where the targets of our search will is located
	 * @returns { Object } dom nodes found
	 */
	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}

	/**
	 * Shorter and fast way to select a single node in the DOM
	 * @param   { String } selector - unique dom selector
	 * @param   { Object } ctx - DOM node where the target of our search will is located
	 * @returns { Object } dom node found
	 */
	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}

	/**
	 * Simple object prototypal inheritance
	 * @param   { Object } parent - parent object
	 * @returns { Object } child instance
	 */
	function inherit(parent) {
	  function Child() {}
	  Child.prototype = parent
	  return new Child()
	}

	/**
	 * Get the name property needed to identify a DOM node in riot
	 * @param   { Object } dom - DOM node we need to parse
	 * @returns { String | undefined } give us back a string to identify this dom node
	 */
	function getNamedKey(dom) {
	  return getAttr(dom, 'id') || getAttr(dom, 'name')
	}

	/**
	 * Set the named properties of a tag element
	 * @param { Object } dom - DOM node we need to parse
	 * @param { Object } parent - tag instance where the named dom element will be eventually added
	 * @param { Array } keys - list of all the tag instance properties
	 */
	function setNamed(dom, parent, keys) {
	  // get the key value we want to add to the tag instance
	  var key = getNamedKey(dom),
	    // add the node detected to a tag instance using the named property
	    add = function(value) {
	      // avoid to override the tag properties already set
	      if (contains(keys, key)) return
	      // check whether this value is an array
	      var isArr = isArray(value)
	      // if the key was never set
	      if (!value)
	        // set it once on the tag instance
	        parent[key] = dom
	      // if it was an array and not yet set
	      else if (!isArr || isArr && !contains(value, dom)) {
	        // add the dom node into the array
	        if (isArr)
	          value.push(dom)
	        else
	          parent[key] = [value, dom]
	      }
	    }

	  // skip the elements with no named properties
	  if (!key) return

	  // check whether this key has been already evaluated
	  if (tmpl.hasExpr(key))
	    // wait the first updated event only once
	    parent.one('updated', function() {
	      key = getNamedKey(dom)
	      add(parent[key])
	    })
	  else
	    add(parent[key])

	}

	/**
	 * Faster String startsWith alternative
	 * @param   { String } src - source string
	 * @param   { String } str - test string
	 * @returns { Boolean } -
	 */
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}

	/**
	 * Function needed to inject in runtime the custom tags css
	 */
	var injectStyle = (function() {

	  if (!window) return // skip injection on the server

	  // create the style node
	  var styleNode = mkEl('style'),
	    placeholder = $('style[type=riot]')

	  setAttr(styleNode, 'type', 'text/css')

	  // inject the new node into the DOM -- in head
	  if (placeholder) {
	    placeholder.parentNode.replaceChild(styleNode, placeholder)
	    placeholder = null
	  }
	  else document.getElementsByTagName('head')[0].appendChild(styleNode)

	  /**
	   * This is the function exported that will be used to update the style tag just created
	   * innerHTML seems slow: http://jsperf.com/riot-insert-style
	   * @param   { String } css [description]
	   */
	  return styleNode.styleSheet ?
	    function (css) { styleNode.styleSheet.cssText += css } :
	    function (css) { styleNode.innerHTML += css }

	})()

	/**
	 * Mount a tag creating new Tag instance
	 * @param   { Object } root - dom node where the tag will be mounted
	 * @param   { String } tagName - name of the riot tag we want to mount
	 * @param   { Object } opts - options to pass to the Tag instance
	 * @returns { Tag } a new Tag instance
	 */
	function mountTo(root, tagName, opts) {
	  var tag = __tagImpl[tagName],
	    // cache the inner HTML to fix #855
	    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

	  // clear the inner html
	  root.innerHTML = ''

	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

	  if (tag && tag.mount) {
	    tag.mount()
	    // add this tag to the virtualDom variable
	    if (!contains(__virtualDom, tag)) __virtualDom.push(tag)
	  }

	  return tag
	}
	/**
	 * Riot public api
	 */

	// share methods for other riot parts, e.g. compiler
	riot.util = { brackets: brackets, tmpl: tmpl }

	/**
	 * Create a mixin that could be globally shared across all the tags
	 */
	riot.mixin = (function() {
	  var mixins = {}

	  /**
	   * Create/Return a mixin by its name
	   * @param   { String } name - mixin name
	   * @param   { Object } mixin - mixin logic
	   * @returns { Object } the mixin logic
	   */
	  return function(name, mixin) {
	    if (!mixin) return mixins[name]
	    mixins[name] = mixin
	  }

	})()

	/**
	 * Create a new riot tag implementation
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else if (injectStyle) injectStyle(css)
	  }
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}

	/**
	 * Create a new riot tag implementation (for use by the compiler)
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @param   { string }  [bpair] - brackets used in the compilation
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag2 = function(name, html, css, attrs, fn, bpair) {
	  if (css && injectStyle) injectStyle(css)
	  //if (bpair) riot.settings.brackets = bpair
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}

	/**
	 * Mount a tag using a specific tag implementation
	 * @param   { String } selector - tag DOM selector
	 * @param   { String } tagName - tag implementation name
	 * @param   { Object } opts - tag logic
	 * @returns { Array } new tags instances
	 */
	riot.mount = function(selector, tagName, opts) {

	  var els,
	    allTags,
	    tags = []

	  // helper functions

	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      list += ', *[' + RIOT_TAG + '="' + e.trim() + '"]'
	    })
	    return list
	  }

	  function selectAllTags() {
	    var keys = Object.keys(__tagImpl)
	    return keys + addRiotTags(keys)
	  }

	  function pushTags(root) {
	    var last

	    if (root.tagName) {
	      if (tagName && (!(last = getAttr(root, RIOT_TAG)) || last != tagName))
	        setAttr(root, RIOT_TAG, tagName)

	      var tag = mountTo(root, tagName || root.getAttribute(RIOT_TAG) || root.tagName.toLowerCase(), opts)

	      if (tag) tags.push(tag)
	    } else if (root.length)
	      each(root, pushTags)   // assume nodeList

	  }

	  // ----- mount code -----

	  if (typeof tagName === T_OBJECT) {
	    opts = tagName
	    tagName = 0
	  }

	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(','))

	    // make sure to pass always a selector
	    // to the querySelectorAll function
	    els = selector ? $$(selector) : []
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector

	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }

	  if (els.tagName)
	    pushTags(els)
	  else
	    each(els, pushTags)

	  return tags
	}

	/**
	 * Update all the tags instances created
	 * @returns { Array } all the tags instances
	 */
	riot.update = function() {
	  return each(__virtualDom, function(tag) {
	    tag.update()
	  })
	}

	/**
	 * Export the Tag constructor
	 */
	riot.Tag = Tag
	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if (true)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return (window.riot = riot) }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot

	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(3);

	__webpack_require__(27);

	var _style = __webpack_require__(46);

	var _style2 = _interopRequireDefault(_style);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	riot.tag2('ffp', '<ffp-header></ffp-header> <ffp-body></ffp-body>', '{ css }', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(4);

	var _style = __webpack_require__(25);

	var _style2 = _interopRequireDefault(_style);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	riot.tag2('ffp-header', '<ffp-input></ffp-input>', '{ css }', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var _style = __webpack_require__(5);

	var _style2 = _interopRequireDefault(_style);

	var _actionCreator = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	riot.tag2('ffp-input', '<input type="text" onkeyup="{triggerInput}" placeholder=""> <button onclick="{triggerButton}">find</button>', '{ css }', '', function (opts) {
	  this.triggerInput = (function (e) {
	    this.content = e.target.value;
	  }).bind(this);
	  this.triggerButton = (function () {
	    (0, _actionCreator.find)(this.content);
	  }).bind(this);
	}, '{ }');
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(6);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "ffp-input {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-pack: justify;\n  -webkit-justify-content: space-between;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  width: auto;\n  height: 100%;\n  margin: 0;\n}\nffp-input input[type=\"text\"] {\n  -webkit-box-flex: 1;\n  -webkit-flex: 1 1 auto;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n  margin-right: 5px;\n  padding: 2px 6px;\n  border: 1px solid #ccc;\n  border-radius: 5px;\n}\nffp-input button {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 120px;\n      -ms-flex: 0 0 120px;\n          flex: 0 0 120px;\n  color: #fff;\n  border: 1px solid #4cae4c;\n  border-radius: 5px;\n  background: #5cb85c;\n}\n", ""]);

	// exports


/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.find = find;

	var _dispatcher = __webpack_require__(10);

	var _dispatcher2 = _interopRequireDefault(_dispatcher);

	var _actionTypes = __webpack_require__(15);

	var _actionTypes2 = _interopRequireDefault(_actionTypes);

	var _qwest = __webpack_require__(16);

	var _qwest2 = _interopRequireDefault(_qwest);

	var _jsBeautify = __webpack_require__(21);

	var _jsBeautify2 = _interopRequireDefault(_jsBeautify);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function find(target) {
	  var matches = undefined;
	  if (target && (matches = target.match(/(https?:\/\/.+?)(:[0-9]+)(:[0-9]+)$/))) {
	    (function () {
	      var url = matches[1];
	      var position_y = matches[2].replace(/:/, '');
	      var position_x = matches[3].replace(/:/, '');

	      _dispatcher2.default.handleViewAction({
	        type: _actionTypes2.default.FIND_START,
	        target: target,
	        url: url,
	        position_x: position_x,
	        position_y: position_y
	      });

	      _qwest2.default.get(url).then(function (res, body) {
	        var lines = [];
	        var line_stuff = body.split(/\r?\n/);
	        for (var yindex = 0; yindex < line_stuff.length; yindex++) {
	          var line = undefined;
	          if (yindex + 1 == position_y) {
	            var char_sutff = line_stuff[yindex].split('');
	            var chars = [];
	            for (var xindex = 0; xindex < char_sutff.length; xindex++) {
	              chars.push(char_sutff[xindex]);
	              if (xindex + 1 == position_x) chars.push('/* FFP_TARGET */');
	            }
	            line = chars.join('');
	          } else {
	            line = line_stuff[yindex];
	          }
	          lines.push(line);
	        }
	        var content = lines.join('\n');
	        var content_beautify = (0, _jsBeautify2.default)(content, { indent_size: 2 });
	        var lines_beautify = content_beautify.split(/\r?\n/);

	        var position_y_beautify = 0;
	        for (var index = 0; index < lines_beautify.length; index++) {
	          if (/\/\* FFP_TARGET \*\//.test(lines_beautify[index])) {
	            position_y_beautify = index + 1;
	          }
	        }

	        _dispatcher2.default.handleViewAction({
	          type: _actionTypes2.default.FIND,
	          url: url,
	          position_x: position_x,
	          position_y: position_y,
	          position_y_beautify: position_y_beautify,
	          body: content,
	          body_beautify: content_beautify
	        });
	      }).catch(function () {
	        console.error('response failed', res);
	      });
	    })();
	  } else {
	    console.error('invalid');
	  }
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _flux = __webpack_require__(11);

	var flux = _interopRequireWildcard(_flux);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var AppDispatcher = (function (_flux$Dispatcher) {
	  _inherits(AppDispatcher, _flux$Dispatcher);

	  function AppDispatcher() {
	    _classCallCheck(this, AppDispatcher);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(AppDispatcher).apply(this, arguments));
	  }

	  _createClass(AppDispatcher, [{
	    key: 'dispatch',
	    value: function dispatch(payload) {
	      console.debug('[DISPATCH]', payload.action);
	      _get(Object.getPrototypeOf(AppDispatcher.prototype), 'dispatch', this).call(this, payload);
	    }
	  }, {
	    key: 'handleViewAction',
	    value: function handleViewAction(action) {
	      this.dispatch({
	        source: 'VIEW',
	        action: action
	      });
	    }
	  }]);

	  return AppDispatcher;
	})(flux.Dispatcher);

	exports.default = new AppDispatcher();

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	module.exports.Dispatcher = __webpack_require__(12);


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Dispatcher
	 * 
	 * @preventMunge
	 */

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var invariant = __webpack_require__(14);

	var _prefix = 'ID_';

	/**
	 * Dispatcher is used to broadcast payloads to registered callbacks. This is
	 * different from generic pub-sub systems in two ways:
	 *
	 *   1) Callbacks are not subscribed to particular events. Every payload is
	 *      dispatched to every registered callback.
	 *   2) Callbacks can be deferred in whole or part until other callbacks have
	 *      been executed.
	 *
	 * For example, consider this hypothetical flight destination form, which
	 * selects a default city when a country is selected:
	 *
	 *   var flightDispatcher = new Dispatcher();
	 *
	 *   // Keeps track of which country is selected
	 *   var CountryStore = {country: null};
	 *
	 *   // Keeps track of which city is selected
	 *   var CityStore = {city: null};
	 *
	 *   // Keeps track of the base flight price of the selected city
	 *   var FlightPriceStore = {price: null}
	 *
	 * When a user changes the selected city, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'city-update',
	 *     selectedCity: 'paris'
	 *   });
	 *
	 * This payload is digested by `CityStore`:
	 *
	 *   flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'city-update') {
	 *       CityStore.city = payload.selectedCity;
	 *     }
	 *   });
	 *
	 * When the user selects a country, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'country-update',
	 *     selectedCountry: 'australia'
	 *   });
	 *
	 * This payload is digested by both stores:
	 *
	 *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       CountryStore.country = payload.selectedCountry;
	 *     }
	 *   });
	 *
	 * When the callback to update `CountryStore` is registered, we save a reference
	 * to the returned token. Using this token with `waitFor()`, we can guarantee
	 * that `CountryStore` is updated before the callback that updates `CityStore`
	 * needs to query its data.
	 *
	 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       // `CountryStore.country` may not be updated.
	 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
	 *       // `CountryStore.country` is now guaranteed to be updated.
	 *
	 *       // Select the default city for the new country
	 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
	 *     }
	 *   });
	 *
	 * The usage of `waitFor()` can be chained, for example:
	 *
	 *   FlightPriceStore.dispatchToken =
	 *     flightDispatcher.register(function(payload) {
	 *       switch (payload.actionType) {
	 *         case 'country-update':
	 *         case 'city-update':
	 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
	 *           FlightPriceStore.price =
	 *             getFlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *     }
	 *   });
	 *
	 * The `country-update` payload will be guaranteed to invoke the stores'
	 * registered callbacks in order: `CountryStore`, `CityStore`, then
	 * `FlightPriceStore`.
	 */

	var Dispatcher = (function () {
	  function Dispatcher() {
	    _classCallCheck(this, Dispatcher);

	    this._callbacks = {};
	    this._isDispatching = false;
	    this._isHandled = {};
	    this._isPending = {};
	    this._lastID = 1;
	  }

	  /**
	   * Registers a callback to be invoked with every dispatched payload. Returns
	   * a token that can be used with `waitFor()`.
	   */

	  Dispatcher.prototype.register = function register(callback) {
	    var id = _prefix + this._lastID++;
	    this._callbacks[id] = callback;
	    return id;
	  };

	  /**
	   * Removes a callback based on its token.
	   */

	  Dispatcher.prototype.unregister = function unregister(id) {
	    !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
	    delete this._callbacks[id];
	  };

	  /**
	   * Waits for the callbacks specified to be invoked before continuing execution
	   * of the current callback. This method should only be used by a callback in
	   * response to a dispatched payload.
	   */

	  Dispatcher.prototype.waitFor = function waitFor(ids) {
	    !this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
	    for (var ii = 0; ii < ids.length; ii++) {
	      var id = ids[ii];
	      if (this._isPending[id]) {
	        !this._isHandled[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
	        continue;
	      }
	      !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
	      this._invokeCallback(id);
	    }
	  };

	  /**
	   * Dispatches a payload to all registered callbacks.
	   */

	  Dispatcher.prototype.dispatch = function dispatch(payload) {
	    !!this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
	    this._startDispatching(payload);
	    try {
	      for (var id in this._callbacks) {
	        if (this._isPending[id]) {
	          continue;
	        }
	        this._invokeCallback(id);
	      }
	    } finally {
	      this._stopDispatching();
	    }
	  };

	  /**
	   * Is this Dispatcher currently dispatching.
	   */

	  Dispatcher.prototype.isDispatching = function isDispatching() {
	    return this._isDispatching;
	  };

	  /**
	   * Call the callback stored with the given id. Also do some internal
	   * bookkeeping.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
	    this._isPending[id] = true;
	    this._callbacks[id](this._pendingPayload);
	    this._isHandled[id] = true;
	  };

	  /**
	   * Set up bookkeeping needed when dispatching.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
	    for (var id in this._callbacks) {
	      this._isPending[id] = false;
	      this._isHandled[id] = false;
	    }
	    this._pendingPayload = payload;
	    this._isDispatching = true;
	  };

	  /**
	   * Clear bookkeeping used for dispatching.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._stopDispatching = function _stopDispatching() {
	    delete this._pendingPayload;
	    this._isDispatching = false;
	  };

	  return Dispatcher;
	})();

	module.exports = Dispatcher;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 13 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	"use strict";

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function (condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  'FIND_START': 'FIND_START',
	  'FIND': 'FIND'
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*! qwest 2.2.3 (https://github.com/pyrsmk/qwest) */

	module.exports = function() {

		var global = window || this,
			pinkyswear = __webpack_require__(17),
			jparam = __webpack_require__(20),
			// Default response type for XDR in auto mode
			defaultXdrResponseType = 'json',
			// Default data type
			defaultDataType = 'post',
			// Variables for limit mechanism
			limit = null,
			requests = 0,
			request_stack = [],
			// Get XMLHttpRequest object
			getXHR = function(){
				return global.XMLHttpRequest?
						new global.XMLHttpRequest():
						new ActiveXObject('Microsoft.XMLHTTP');
			},
			// Guess XHR version
			xhr2 = (getXHR().responseType===''),

		// Core function
		qwest = function(method, url, data, options, before) {

			// Format
			method = method.toUpperCase();
			data = data || null;
			options = options || {};

			// Define variables
			var nativeResponseParsing = false,
				crossOrigin,
				xhr,
				xdr = false,
				timeoutInterval,
				aborted = false,
				attempts = 0,
				headers = {},
				mimeTypes = {
					text: '*/*',
					xml: 'text/xml',
					json: 'application/json',
					post: 'application/x-www-form-urlencoded'
				},
				accept = {
					text: '*/*',
					xml: 'application/xml; q=1.0, text/xml; q=0.8, */*; q=0.1',
					json: 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1'
				},
				vars = '',
				i, j,
				serialized,
				response,
				sending = false,
				delayed = false,
				timeout_start,

			// Create the promise
			promise = pinkyswear(function(pinky) {
				pinky['catch'] = function(f) {
					return pinky.then(null, f);
				};
				pinky.complete = function(f) {
					return pinky.then(f, f);
				};
				// Override
				if('pinkyswear' in options) {
					for(i in options.pinkyswear) {
						pinky[i] = options.pinkyswear[i];
					}
				}
				pinky.send = function() {
					// Prevent further send() calls
					if(sending) {
						return;
					}
					// Reached request limit, get out!
					if(requests == limit) {
						request_stack.push(pinky);
						return;
					}
					++requests;
					sending = true;
					// Start the chrono
					timeout_start = new Date().getTime();
					// Get XHR object
					xhr = getXHR();
					if(crossOrigin) {
						if(!('withCredentials' in xhr) && global.XDomainRequest) {
							xhr = new XDomainRequest(); // CORS with IE8/9
							xdr = true;
							if(method!='GET' && method!='POST') {
								method = 'POST';
							}
						}
					}
					// Open connection
					if(xdr) {
						xhr.open(method, url);
					}
					else {
						xhr.open(method, url, options.async, options.user, options.password);
						if(xhr2 && options.async) {
							xhr.withCredentials = options.withCredentials;
						}
					}
					// Set headers
					if(!xdr) {
						for(var i in headers) {
							if(headers[i]) {
								xhr.setRequestHeader(i, headers[i]);
							}
						}
					}
					// Verify if the response type is supported by the current browser
					if(xhr2 && options.responseType!='document' && options.responseType!='auto') { // Don't verify for 'document' since we're using an internal routine
						try {
							xhr.responseType = options.responseType;
							nativeResponseParsing = (xhr.responseType==options.responseType);
						}
						catch(e){}
					}
					// Plug response handler
					if(xhr2 || xdr) {
						xhr.onload = handleResponse;
						xhr.onerror = handleError;
					}
					else {
						xhr.onreadystatechange = function() {
							if(xhr.readyState == 4) {
								handleResponse();
							}
						};
					}
					// Override mime type to ensure the response is well parsed
					if(options.responseType!='auto' && 'overrideMimeType' in xhr) {
						xhr.overrideMimeType(mimeTypes[options.responseType]);
					}
					// Run 'before' callback
					if(before) {
						before(xhr);
					}
					// Send request
					if(xdr) {
						setTimeout(function(){ // https://developer.mozilla.org/en-US/docs/Web/API/XDomainRequest
							xhr.send(method!='GET'?data:null);
						},0);
					}
					else {
						xhr.send(method!='GET'?data:null);
					}
				};
				return pinky;
			}),

			// Handle the response
			handleResponse = function() {
				// Prepare
				var i, responseType;
				--requests;
				sending = false;
				// Verify timeout state
				// --- https://stackoverflow.com/questions/7287706/ie-9-javascript-error-c00c023f
				if(new Date().getTime()-timeout_start >= options.timeout) {
					if(!options.attempts || ++attempts!=options.attempts) {
						promise.send();
					}
					else {
						promise(false, [xhr,response,new Error('Timeout ('+url+')')]);
					}
					return;
				}
				// Launch next stacked request
				if(request_stack.length) {
					request_stack.shift().send();
				}
				// Handle response
				try{
					// Process response
					if(nativeResponseParsing && 'response' in xhr && xhr.response!==null) {
						response = xhr.response;
					}
					else if(options.responseType == 'document') {
						var frame = document.createElement('iframe');
						frame.style.display = 'none';
						document.body.appendChild(frame);
						frame.contentDocument.open();
						frame.contentDocument.write(xhr.response);
						frame.contentDocument.close();
						response = frame.contentDocument;
						document.body.removeChild(frame);
					}
					else{
						// Guess response type
						responseType = options.responseType;
						if(responseType == 'auto') {
							if(xdr) {
								responseType = defaultXdrResponseType;
							}
							else {
								var ct = xhr.getResponseHeader('Content-Type') || '';
								if(ct.indexOf(mimeTypes.json)>-1) {
									responseType = 'json';
								}
								else if(ct.indexOf(mimeTypes.xml)>-1) {
									responseType = 'xml';
								}
								else {
									responseType = 'text';
								}
							}
						}
						// Handle response type
						switch(responseType) {
							case 'json':
								try {
									if('JSON' in global) {
										response = JSON.parse(xhr.responseText);
									}
									else {
										response = eval('('+xhr.responseText+')');
									}
								}
								catch(e) {
									throw "Error while parsing JSON body : "+e;
								}
								break;
							case 'xml':
								// Based on jQuery's parseXML() function
								try {
									// Standard
									if(global.DOMParser) {
										response = (new DOMParser()).parseFromString(xhr.responseText,'text/xml');
									}
									// IE<9
									else {
										response = new ActiveXObject('Microsoft.XMLDOM');
										response.async = 'false';
										response.loadXML(xhr.responseText);
									}
								}
								catch(e) {
									response = undefined;
								}
								if(!response || !response.documentElement || response.getElementsByTagName('parsererror').length) {
									throw 'Invalid XML';
								}
								break;
							default:
								response = xhr.responseText;
						}
					}
					// Late status code verification to allow passing data when, per example, a 409 is returned
					// --- https://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
					if('status' in xhr && !/^2|1223/.test(xhr.status)) {
						throw xhr.status+' ('+xhr.statusText+')';
					}
					// Fulfilled
					promise(true, [xhr,response]);
				}
				catch(e) {
					// Rejected
					promise(false, [xhr,response,e]);
				}
			},

			// Handle errors
			handleError = function(e) {
				--requests;
				promise(false, [xhr,null,new Error('Connection aborted')]);
			};

			// Normalize options
			options.async = 'async' in options?!!options.async:true;
			options.cache = 'cache' in options?!!options.cache:false;
			options.dataType = 'dataType' in options?options.dataType.toLowerCase():defaultDataType;
			options.responseType = 'responseType' in options?options.responseType.toLowerCase():'auto';
			options.user = options.user || '';
			options.password = options.password || '';
			options.withCredentials = !!options.withCredentials;
			options.timeout = 'timeout' in options?parseInt(options.timeout,10):30000;
			options.attempts = 'attempts' in options?parseInt(options.attempts,10):1;

			// Guess if we're dealing with a cross-origin request
			i = url.match(/\/\/(.+?)\//);
			crossOrigin = i && (i[1]?i[1]!=location.host:false);

			// Prepare data
			if('ArrayBuffer' in global && data instanceof ArrayBuffer) {
				options.dataType = 'arraybuffer';
			}
			else if('Blob' in global && data instanceof Blob) {
				options.dataType = 'blob';
			}
			else if('Document' in global && data instanceof Document) {
				options.dataType = 'document';
			}
			else if('FormData' in global && data instanceof FormData) {
				options.dataType = 'formdata';
			}
			switch(options.dataType) {
				case 'json':
					data = JSON.stringify(data);
					break;
				case 'post':
					data = jparam(data);
			}

			// Prepare headers
			if(options.headers) {
				var format = function(match,p1,p2) {
					return p1 + p2.toUpperCase();
				};
				for(i in options.headers) {
					headers[i.replace(/(^|-)([^-])/g,format)] = options.headers[i];
				}
			}
			if(!('Content-Type' in headers) && method!='GET') {
				if(options.dataType in mimeTypes) {
					if(mimeTypes[options.dataType]) {
						headers['Content-Type'] = mimeTypes[options.dataType];
					}
				}
			}
			if(!headers.Accept) {
				headers.Accept = (options.responseType in accept)?accept[options.responseType]:'*/*';
			}
			if(!crossOrigin && !('X-Requested-With' in headers)) { // (that header breaks in legacy browsers with CORS)
				headers['X-Requested-With'] = 'XMLHttpRequest';
			}
			if(!options.cache && !('Cache-Control' in headers)) {
				headers['Cache-Control'] = 'no-cache';
			}

			// Prepare URL
			if(method=='GET' && data) {
				vars += data;
			}
			if(vars) {
				url += (/\?/.test(url)?'&':'?')+vars;
			}

			// Start the request
			if(options.async) {
				promise.send();
			}

			// Return promise
			return promise;

		};

		// Return the external qwest object
		return {
			base: '',
			get: function(url, data, options, before) {
				return qwest('GET', this.base+url, data, options, before);
			},
			post: function(url, data, options, before) {
				return qwest('POST', this.base+url, data, options, before);
			},
			put: function(url, data, options, before) {
				return qwest('PUT', this.base+url, data, options, before);
			},
			'delete': function(url, data, options, before) {
				return qwest('DELETE', this.base+url, data, options, before);
			},
			map: function(type, url, data, options, before) {
				return qwest(type.toUpperCase(), this.base+url, data, options, before);
			},
			xhr2: xhr2,
			limit: function(by) {
				limit = by;
			},
			setDefaultXdrResponseType: function(type) {
				defaultXdrResponseType = type.toLowerCase();
			},
			setDefaultDataType: function(type) {
				defaultDataType = type.toLowerCase();
			}
		};

	}();


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, setImmediate, process) {/*
	 * PinkySwear.js 2.2.2 - Minimalistic implementation of the Promises/A+ spec
	 * 
	 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
	 *
	 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	 *
	 * PinkySwear is a very small implementation of the Promises/A+ specification. After compilation with the
	 * Google Closure Compiler and gzipping it weighs less than 500 bytes. It is based on the implementation for 
	 * Minified.js and should be perfect for embedding. 
	 *
	 *
	 * PinkySwear has just three functions.
	 *
	 * To create a new promise in pending state, call pinkySwear():
	 *         var promise = pinkySwear();
	 *
	 * The returned object has a Promises/A+ compatible then() implementation:
	 *          promise.then(function(value) { alert("Success!"); }, function(value) { alert("Failure!"); });
	 *
	 *
	 * The promise returned by pinkySwear() is a function. To fulfill the promise, call the function with true as first argument and
	 * an optional array of values to pass to the then() handler. By putting more than one value in the array, you can pass more than one
	 * value to the then() handlers. Here an example to fulfill a promsise, this time with only one argument: 
	 *         promise(true, [42]);
	 *
	 * When the promise has been rejected, call it with false. Again, there may be more than one argument for the then() handler:
	 *         promise(true, [6, 6, 6]);
	 *         
	 * You can obtain the promise's current state by calling the function without arguments. It will be true if fulfilled,
	 * false if rejected, and otherwise undefined.
	 * 		   var state = promise(); 
	 * 
	 * https://github.com/timjansen/PinkySwear.js
	 */
	(function(target) {
		var undef;

		function isFunction(f) {
			return typeof f == 'function';
		}
		function isObject(f) {
			return typeof f == 'object';
		}
		function defer(callback) {
			if (typeof setImmediate != 'undefined')
				setImmediate(callback);
			else if (typeof process != 'undefined' && process['nextTick'])
				process['nextTick'](callback);
			else
				setTimeout(callback, 0);
		}

		target[0][target[1]] = function pinkySwear(extend) {
			var state;           // undefined/null = pending, true = fulfilled, false = rejected
			var values = [];     // an array of values as arguments for the then() handlers
			var deferred = [];   // functions to call when set() is invoked

			var set = function(newState, newValues) {
				if (state == null && newState != null) {
					state = newState;
					values = newValues;
					if (deferred.length)
						defer(function() {
							for (var i = 0; i < deferred.length; i++)
								deferred[i]();
						});
				}
				return state;
			};

			set['then'] = function (onFulfilled, onRejected) {
				var promise2 = pinkySwear(extend);
				var callCallbacks = function() {
		    		try {
		    			var f = (state ? onFulfilled : onRejected);
		    			if (isFunction(f)) {
			   				function resolve(x) {
							    var then, cbCalled = 0;
			   					try {
					   				if (x && (isObject(x) || isFunction(x)) && isFunction(then = x['then'])) {
											if (x === promise2)
												throw new TypeError();
											then['call'](x,
												function() { if (!cbCalled++) resolve.apply(undef,arguments); } ,
												function(value){ if (!cbCalled++) promise2(false,[value]);});
					   				}
					   				else
					   					promise2(true, arguments);
			   					}
			   					catch(e) {
			   						if (!cbCalled++)
			   							promise2(false, [e]);
			   					}
			   				}
			   				resolve(f.apply(undef, values || []));
			   			}
			   			else
			   				promise2(state, values);
					}
					catch (e) {
						promise2(false, [e]);
					}
				};
				if (state != null)
					defer(callCallbacks);
				else
					deferred.push(callCallbacks);
				return promise2;
			};
	        if(extend){
	            set = extend(set);
	        }
			return set;
		};
	})( false ? [window, 'pinkySwear'] : [module, 'exports']);


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)(module), __webpack_require__(19).setImmediate, __webpack_require__(13)))

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(13).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19).setImmediate, __webpack_require__(19).clearImmediate))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @preserve jquery-param (c) 2015 KNOWLEDGECODE | MIT
	 */
	/*global define */
	(function (global) {
	    'use strict';

	    var param = function (a) {
	        var add = function (s, k, v) {
	            v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
	            s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
	        }, buildParams = function (prefix, obj, s) {
	            var i, len, key;

	            if (Object.prototype.toString.call(obj) === '[object Array]') {
	                for (i = 0, len = obj.length; i < len; i++) {
	                    buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i], s);
	                }
	            } else if (obj && obj.toString() === '[object Object]') {
	                for (key in obj) {
	                    if (obj.hasOwnProperty(key)) {
	                        if (prefix) {
	                            buildParams(prefix + '[' + key + ']', obj[key], s, add);
	                        } else {
	                            buildParams(key, obj[key], s, add);
	                        }
	                    }
	                }
	            } else if (prefix) {
	                add(s, prefix, obj);
	            } else {
	                for (key in obj) {
	                    add(s, key, obj[key]);
	                }
	            }
	            return s;
	        };
	        return buildParams('', a, []).join('&').replace(/%20/g, '+');
	    };

	    if (typeof module === 'object' && typeof module.exports === 'object') {
	        module.exports = param;
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return param;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        global.param = param;
	    }

	}(this));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	The following batches are equivalent:

	var beautify_js = require('js-beautify');
	var beautify_js = require('js-beautify').js;
	var beautify_js = require('js-beautify').js_beautify;

	var beautify_css = require('js-beautify').css;
	var beautify_css = require('js-beautify').css_beautify;

	var beautify_html = require('js-beautify').html;
	var beautify_html = require('js-beautify').html_beautify;

	All methods returned accept two arguments, the source string and an options object.
	**/

	function get_beautify(js_beautify, css_beautify, html_beautify) {
	    // the default is js
	    var beautify = function (src, config) {
	        return js_beautify.js_beautify(src, config);
	    };

	    // short aliases
	    beautify.js   = js_beautify.js_beautify;
	    beautify.css  = css_beautify.css_beautify;
	    beautify.html = html_beautify.html_beautify;

	    // legacy aliases
	    beautify.js_beautify   = js_beautify.js_beautify;
	    beautify.css_beautify  = css_beautify.css_beautify;
	    beautify.html_beautify = html_beautify.html_beautify;

	    return beautify;
	}

	if (true) {
	    // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	        __webpack_require__(22),
	        __webpack_require__(23),
	        __webpack_require__(24)
	    ], __WEBPACK_AMD_DEFINE_RESULT__ = function(js_beautify, css_beautify, html_beautify) {
	        return get_beautify(js_beautify, css_beautify, html_beautify);
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
	    (function(mod) {
	        var js_beautify = require('./lib/beautify');
	        var css_beautify = require('./lib/beautify-css');
	        var html_beautify = require('./lib/beautify-html');

	        mod.exports = get_beautify(js_beautify, css_beautify, html_beautify);

	    })(module);
	}



/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
	/*

	  The MIT License (MIT)

	  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

	  Permission is hereby granted, free of charge, to any person
	  obtaining a copy of this software and associated documentation files
	  (the "Software"), to deal in the Software without restriction,
	  including without limitation the rights to use, copy, modify, merge,
	  publish, distribute, sublicense, and/or sell copies of the Software,
	  and to permit persons to whom the Software is furnished to do so,
	  subject to the following conditions:

	  The above copyright notice and this permission notice shall be
	  included in all copies or substantial portions of the Software.

	  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
	  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	  SOFTWARE.

	 JS Beautifier
	---------------


	  Written by Einar Lielmanis, <einar@jsbeautifier.org>
	      http://jsbeautifier.org/

	  Originally converted to javascript by Vital, <vital76@gmail.com>
	  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>
	  Parsing improvements for brace-less statements by Liam Newman <bitwiseman@gmail.com>


	  Usage:
	    js_beautify(js_source_text);
	    js_beautify(js_source_text, options);

	  The options are:
	    indent_size (default 4)          - indentation size,
	    indent_char (default space)      - character to indent with,
	    preserve_newlines (default true) - whether existing line breaks should be preserved,
	    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

	    jslint_happy (default false) - if true, then jslint-stricter mode is enforced.

	            jslint_happy        !jslint_happy
	            ---------------------------------
	            function ()         function()

	            switch () {         switch() {
	            case 1:               case 1:
	              break;                break;
	            }                   }

	    space_after_anon_function (default false) - should the space before an anonymous function's parens be added, "function()" vs "function ()",
	          NOTE: This option is overriden by jslint_happy (i.e. if jslint_happy is true, space_after_anon_function is true by design)

	    brace_style (default "collapse") - "collapse" | "expand" | "end-expand" | "none"
	            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are.

	    space_before_conditional (default true) - should the space before conditional statement be added, "if(true)" vs "if (true)",

	    unescape_strings (default false) - should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"

	    wrap_line_length (default unlimited) - lines should wrap at next opportunity after this number of characters.
	          NOTE: This is not a hard limit. Lines will continue until a point where a newline would
	                be preserved if it were present.

	    end_with_newline (default false)  - end output with a newline


	    e.g

	    js_beautify(js_source_text, {
	      'indent_size': 1,
	      'indent_char': '\t'
	    });

	*/

	(function() {

	    var acorn = {};
	    (function (exports) {
	      // This section of code is taken from acorn.
	      //
	      // Acorn was written by Marijn Haverbeke and released under an MIT
	      // license. The Unicode regexps (for identifiers and whitespace) were
	      // taken from [Esprima](http://esprima.org) by Ariya Hidayat.
	      //
	      // Git repositories for Acorn are available at
	      //
	      //     http://marijnhaverbeke.nl/git/acorn
	      //     https://github.com/marijnh/acorn.git

	      // ## Character categories

	      // Big ugly regular expressions that match characters in the
	      // whitespace, identifier, and identifier-start categories. These
	      // are only applied when a character is found to actually have a
	      // code point above 128.

	      var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
	      var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
	      var nonASCIIidentifierChars = "\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
	      var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
	      var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

	      // Whether a single character denotes a newline.

	      var newline = exports.newline = /[\n\r\u2028\u2029]/;

	      // Matches a whole line break (where CRLF is considered a single
	      // line break). Used to count lines.

	      var lineBreak = exports.lineBreak = /\r\n|[\n\r\u2028\u2029]/g;

	      // Test whether a given character code starts an identifier.

	      var isIdentifierStart = exports.isIdentifierStart = function(code) {
	        if (code < 65) return code === 36;
	        if (code < 91) return true;
	        if (code < 97) return code === 95;
	        if (code < 123)return true;
	        return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
	      };

	      // Test whether a given character is part of an identifier.

	      var isIdentifierChar = exports.isIdentifierChar = function(code) {
	        if (code < 48) return code === 36;
	        if (code < 58) return true;
	        if (code < 65) return false;
	        if (code < 91) return true;
	        if (code < 97) return code === 95;
	        if (code < 123)return true;
	        return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
	      };
	    })(acorn);

	    function in_array(what, arr) {
	        for (var i = 0; i < arr.length; i += 1) {
	            if (arr[i] === what) {
	                return true;
	            }
	        }
	        return false;
	    }

	    function trim(s) {
	        return s.replace(/^\s+|\s+$/g, '');
	    }

	    function ltrim(s) {
	        return s.replace(/^\s+/g, '');
	    }

	    function rtrim(s) {
	        return s.replace(/\s+$/g, '');
	    }

	    function js_beautify(js_source_text, options) {
	        "use strict";
	        var beautifier = new Beautifier(js_source_text, options);
	        return beautifier.beautify();
	    }

	    var MODE = {
	            BlockStatement: 'BlockStatement', // 'BLOCK'
	            Statement: 'Statement', // 'STATEMENT'
	            ObjectLiteral: 'ObjectLiteral', // 'OBJECT',
	            ArrayLiteral: 'ArrayLiteral', //'[EXPRESSION]',
	            ForInitializer: 'ForInitializer', //'(FOR-EXPRESSION)',
	            Conditional: 'Conditional', //'(COND-EXPRESSION)',
	            Expression: 'Expression' //'(EXPRESSION)'
	        };

	    function Beautifier(js_source_text, options) {
	        "use strict";
	        var output
	        var tokens = [], token_pos;
	        var Tokenizer;
	        var current_token;
	        var last_type, last_last_text, indent_string;
	        var flags, previous_flags, flag_store;
	        var prefix;

	        var handlers, opt;
	        var baseIndentString = '';

	        handlers = {
	            'TK_START_EXPR': handle_start_expr,
	            'TK_END_EXPR': handle_end_expr,
	            'TK_START_BLOCK': handle_start_block,
	            'TK_END_BLOCK': handle_end_block,
	            'TK_WORD': handle_word,
	            'TK_RESERVED': handle_word,
	            'TK_SEMICOLON': handle_semicolon,
	            'TK_STRING': handle_string,
	            'TK_EQUALS': handle_equals,
	            'TK_OPERATOR': handle_operator,
	            'TK_COMMA': handle_comma,
	            'TK_BLOCK_COMMENT': handle_block_comment,
	            'TK_COMMENT': handle_comment,
	            'TK_DOT': handle_dot,
	            'TK_UNKNOWN': handle_unknown,
	            'TK_EOF': handle_eof
	        };

	        function create_flags(flags_base, mode) {
	            var next_indent_level = 0;
	            if (flags_base) {
	                next_indent_level = flags_base.indentation_level;
	                if (!output.just_added_newline() &&
	                    flags_base.line_indent_level > next_indent_level) {
	                    next_indent_level = flags_base.line_indent_level;
	                }
	            }

	            var next_flags = {
	                mode: mode,
	                parent: flags_base,
	                last_text: flags_base ? flags_base.last_text : '', // last token text
	                last_word: flags_base ? flags_base.last_word : '', // last 'TK_WORD' passed
	                declaration_statement: false,
	                declaration_assignment: false,
	                multiline_frame: false,
	                if_block: false,
	                else_block: false,
	                do_block: false,
	                do_while: false,
	                in_case_statement: false, // switch(..){ INSIDE HERE }
	                in_case: false, // we're on the exact line with "case 0:"
	                case_body: false, // the indented case-action block
	                indentation_level: next_indent_level,
	                line_indent_level: flags_base ? flags_base.line_indent_level : next_indent_level,
	                start_line_index: output.get_line_number(),
	                ternary_depth: 0
	            };
	            return next_flags;
	        }

	        // Some interpreters have unexpected results with foo = baz || bar;
	        options = options ? options : {};
	        opt = {};

	        // compatibility
	        if (options.braces_on_own_line !== undefined) { //graceful handling of deprecated option
	            opt.brace_style = options.braces_on_own_line ? "expand" : "collapse";
	        }
	        opt.brace_style = options.brace_style ? options.brace_style : (opt.brace_style ? opt.brace_style : "collapse");

	        // graceful handling of deprecated option
	        if (opt.brace_style === "expand-strict") {
	            opt.brace_style = "expand";
	        }


	        opt.indent_size = options.indent_size ? parseInt(options.indent_size, 10) : 4;
	        opt.indent_char = options.indent_char ? options.indent_char : ' ';
	        opt.eol = options.eol ? options.eol : '\n';
	        opt.preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
	        opt.break_chained_methods = (options.break_chained_methods === undefined) ? false : options.break_chained_methods;
	        opt.max_preserve_newlines = (options.max_preserve_newlines === undefined) ? 0 : parseInt(options.max_preserve_newlines, 10);
	        opt.space_in_paren = (options.space_in_paren === undefined) ? false : options.space_in_paren;
	        opt.space_in_empty_paren = (options.space_in_empty_paren === undefined) ? false : options.space_in_empty_paren;
	        opt.jslint_happy = (options.jslint_happy === undefined) ? false : options.jslint_happy;
	        opt.space_after_anon_function = (options.space_after_anon_function === undefined) ? false : options.space_after_anon_function;
	        opt.keep_array_indentation = (options.keep_array_indentation === undefined) ? false : options.keep_array_indentation;
	        opt.space_before_conditional = (options.space_before_conditional === undefined) ? true : options.space_before_conditional;
	        opt.unescape_strings = (options.unescape_strings === undefined) ? false : options.unescape_strings;
	        opt.wrap_line_length = (options.wrap_line_length === undefined) ? 0 : parseInt(options.wrap_line_length, 10);
	        opt.e4x = (options.e4x === undefined) ? false : options.e4x;
	        opt.end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;
	        opt.comma_first = (options.comma_first === undefined) ? false : options.comma_first;

	        // For testing of beautify ignore:start directive
	        opt.test_output_raw = (options.test_output_raw === undefined) ? false : options.test_output_raw;

	        // force opt.space_after_anon_function to true if opt.jslint_happy
	        if(opt.jslint_happy) {
	            opt.space_after_anon_function = true;
	        }

	        if(options.indent_with_tabs){
	            opt.indent_char = '\t';
	            opt.indent_size = 1;
	        }

	        opt.eol = opt.eol.replace(/\\r/, '\r').replace(/\\n/, '\n')

	        //----------------------------------
	        indent_string = '';
	        while (opt.indent_size > 0) {
	            indent_string += opt.indent_char;
	            opt.indent_size -= 1;
	        }

	        var preindent_index = 0;
	        if(js_source_text && js_source_text.length) {
	            while ( (js_source_text.charAt(preindent_index) === ' ' ||
	                    js_source_text.charAt(preindent_index) === '\t')) {
	                baseIndentString += js_source_text.charAt(preindent_index);
	                preindent_index += 1;
	            }
	            js_source_text = js_source_text.substring(preindent_index);
	        }

	        last_type = 'TK_START_BLOCK'; // last token type
	        last_last_text = ''; // pre-last token text
	        output = new Output(indent_string, baseIndentString);

	        // If testing the ignore directive, start with output disable set to true
	        output.raw = opt.test_output_raw;


	        // Stack of parsing/formatting states, including MODE.
	        // We tokenize, parse, and output in an almost purely a forward-only stream of token input
	        // and formatted output.  This makes the beautifier less accurate than full parsers
	        // but also far more tolerant of syntax errors.
	        //
	        // For example, the default mode is MODE.BlockStatement. If we see a '{' we push a new frame of type
	        // MODE.BlockStatement on the the stack, even though it could be object literal.  If we later
	        // encounter a ":", we'll switch to to MODE.ObjectLiteral.  If we then see a ";",
	        // most full parsers would die, but the beautifier gracefully falls back to
	        // MODE.BlockStatement and continues on.
	        flag_store = [];
	        set_mode(MODE.BlockStatement);

	        this.beautify = function() {

	            /*jshint onevar:true */
	            var local_token, sweet_code;
	            Tokenizer = new tokenizer(js_source_text, opt, indent_string);
	            tokens = Tokenizer.tokenize();
	            token_pos = 0;

	            while (local_token = get_token()) {
	                for(var i = 0; i < local_token.comments_before.length; i++) {
	                    // The cleanest handling of inline comments is to treat them as though they aren't there.
	                    // Just continue formatting and the behavior should be logical.
	                    // Also ignore unknown tokens.  Again, this should result in better behavior.
	                    handle_token(local_token.comments_before[i]);
	                }
	                handle_token(local_token);

	                last_last_text = flags.last_text;
	                last_type = local_token.type;
	                flags.last_text = local_token.text;

	                token_pos += 1;
	            }

	            sweet_code = output.get_code();
	            if (opt.end_with_newline) {
	                sweet_code += '\n';
	            }

	            if (opt.eol != '\n') {
	                sweet_code = sweet_code.replace(/[\n]/g, opt.eol);
	            }

	            return sweet_code;
	        };

	        function handle_token(local_token) {
	            var newlines = local_token.newlines;
	            var keep_whitespace = opt.keep_array_indentation && is_array(flags.mode);

	            if (keep_whitespace) {
	                for (i = 0; i < newlines; i += 1) {
	                    print_newline(i > 0);
	                }
	            } else {
	                if (opt.max_preserve_newlines && newlines > opt.max_preserve_newlines) {
	                    newlines = opt.max_preserve_newlines;
	                }

	                if (opt.preserve_newlines) {
	                    if (local_token.newlines > 1) {
	                        print_newline();
	                        for (var i = 1; i < newlines; i += 1) {
	                            print_newline(true);
	                        }
	                    }
	                }
	            }

	            current_token = local_token;
	            handlers[current_token.type]();
	        }

	        // we could use just string.split, but
	        // IE doesn't like returning empty strings
	        function split_newlines(s) {
	            //return s.split(/\x0d\x0a|\x0a/);

	            s = s.replace(/\x0d/g, '');
	            var out = [],
	                idx = s.indexOf("\n");
	            while (idx !== -1) {
	                out.push(s.substring(0, idx));
	                s = s.substring(idx + 1);
	                idx = s.indexOf("\n");
	            }
	            if (s.length) {
	                out.push(s);
	            }
	            return out;
	        }

	        function allow_wrap_or_preserved_newline(force_linewrap) {
	            force_linewrap = (force_linewrap === undefined) ? false : force_linewrap;

	            // Never wrap the first token on a line
	            if (output.just_added_newline()) {
	                return
	            }

	            if ((opt.preserve_newlines && current_token.wanted_newline) || force_linewrap) {
	                print_newline(false, true);
	            } else if (opt.wrap_line_length) {
	                var proposed_line_length = output.current_line.get_character_count() + current_token.text.length +
	                    (output.space_before_token ? 1 : 0);
	                if (proposed_line_length >= opt.wrap_line_length) {
	                    print_newline(false, true);
	                }
	            }
	        }

	        function print_newline(force_newline, preserve_statement_flags) {
	            if (!preserve_statement_flags) {
	                if (flags.last_text !== ';' && flags.last_text !== ',' && flags.last_text !== '=' && last_type !== 'TK_OPERATOR') {
	                    while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
	                        restore_mode();
	                    }
	                }
	            }

	            if (output.add_new_line(force_newline)) {
	                flags.multiline_frame = true;
	            }
	        }

	        function print_token_line_indentation() {
	            if (output.just_added_newline()) {
	                if (opt.keep_array_indentation && is_array(flags.mode) && current_token.wanted_newline) {
	                    output.current_line.push(current_token.whitespace_before);
	                    output.space_before_token = false;
	                } else if (output.set_indent(flags.indentation_level)) {
	                    flags.line_indent_level = flags.indentation_level;
	                }
	            }
	        }

	        function print_token(printable_token) {
	            if (output.raw) {
	                output.add_raw_token(current_token)
	                return;
	            }

	            if (opt.comma_first && last_type === 'TK_COMMA'
	                && output.just_added_newline()) {
	                if(output.previous_line.last() === ',') {
	                    output.previous_line.pop();
	                    print_token_line_indentation();
	                    output.add_token(',');
	                    output.space_before_token = true;
	                }
	            }

	            printable_token = printable_token || current_token.text;
	            print_token_line_indentation();
	            output.add_token(printable_token);
	        }

	        function indent() {
	            flags.indentation_level += 1;
	        }

	        function deindent() {
	            if (flags.indentation_level > 0 &&
	                ((!flags.parent) || flags.indentation_level > flags.parent.indentation_level))
	                flags.indentation_level -= 1;
	        }

	        function set_mode(mode) {
	            if (flags) {
	                flag_store.push(flags);
	                previous_flags = flags;
	            } else {
	                previous_flags = create_flags(null, mode);
	            }

	            flags = create_flags(previous_flags, mode);
	        }

	        function is_array(mode) {
	            return mode === MODE.ArrayLiteral;
	        }

	        function is_expression(mode) {
	            return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
	        }

	        function restore_mode() {
	            if (flag_store.length > 0) {
	                previous_flags = flags;
	                flags = flag_store.pop();
	                if (previous_flags.mode === MODE.Statement) {
	                    output.remove_redundant_indentation(previous_flags);
	                }
	            }
	        }

	        function start_of_object_property() {
	            return flags.parent.mode === MODE.ObjectLiteral && flags.mode === MODE.Statement && (
	                (flags.last_text === ':' && flags.ternary_depth === 0) || (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set'])));
	        }

	        function start_of_statement() {
	            if (
	                    (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && current_token.type === 'TK_WORD') ||
	                    (last_type === 'TK_RESERVED' && flags.last_text === 'do') ||
	                    (last_type === 'TK_RESERVED' && flags.last_text === 'return' && !current_token.wanted_newline) ||
	                    (last_type === 'TK_RESERVED' && flags.last_text === 'else' && !(current_token.type === 'TK_RESERVED' && current_token.text === 'if')) ||
	                    (last_type === 'TK_END_EXPR' && (previous_flags.mode === MODE.ForInitializer || previous_flags.mode === MODE.Conditional)) ||
	                    (last_type === 'TK_WORD' && flags.mode === MODE.BlockStatement
	                        && !flags.in_case
	                        && !(current_token.text === '--' || current_token.text === '++')
	                        && last_last_text !== 'function'
	                        && current_token.type !== 'TK_WORD' && current_token.type !== 'TK_RESERVED') ||
	                    (flags.mode === MODE.ObjectLiteral && (
	                        (flags.last_text === ':' && flags.ternary_depth === 0) || (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set']))))
	                ) {

	                set_mode(MODE.Statement);
	                indent();

	                if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && current_token.type === 'TK_WORD') {
	                    flags.declaration_statement = true;
	                }

	                // Issue #276:
	                // If starting a new statement with [if, for, while, do], push to a new line.
	                // if (a) if (b) if(c) d(); else e(); else f();
	                if (!start_of_object_property()) {
	                    allow_wrap_or_preserved_newline(
	                        current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['do', 'for', 'if', 'while']));
	                }

	                return true;
	            }
	            return false;
	        }

	        function all_lines_start_with(lines, c) {
	            for (var i = 0; i < lines.length; i++) {
	                var line = trim(lines[i]);
	                if (line.charAt(0) !== c) {
	                    return false;
	                }
	            }
	            return true;
	        }

	        function each_line_matches_indent(lines, indent) {
	            var i = 0,
	                len = lines.length,
	                line;
	            for (; i < len; i++) {
	                line = lines[i];
	                // allow empty lines to pass through
	                if (line && line.indexOf(indent) !== 0) {
	                    return false;
	                }
	            }
	            return true;
	        }

	        function is_special_word(word) {
	            return in_array(word, ['case', 'return', 'do', 'if', 'throw', 'else']);
	        }

	        function get_token(offset) {
	            var index = token_pos + (offset || 0);
	            return (index < 0 || index >= tokens.length) ? null : tokens[index];
	        }

	        function handle_start_expr() {
	            if (start_of_statement()) {
	                // The conditional starts the statement if appropriate.
	            }

	            var next_mode = MODE.Expression;
	            if (current_token.text === '[') {

	                if (last_type === 'TK_WORD' || flags.last_text === ')') {
	                    // this is array index specifier, break immediately
	                    // a[x], fn()[x]
	                    if (last_type === 'TK_RESERVED' && in_array(flags.last_text, Tokenizer.line_starters)) {
	                        output.space_before_token = true;
	                    }
	                    set_mode(next_mode);
	                    print_token();
	                    indent();
	                    if (opt.space_in_paren) {
	                        output.space_before_token = true;
	                    }
	                    return;
	                }

	                next_mode = MODE.ArrayLiteral;
	                if (is_array(flags.mode)) {
	                    if (flags.last_text === '[' ||
	                        (flags.last_text === ',' && (last_last_text === ']' || last_last_text === '}'))) {
	                        // ], [ goes to new line
	                        // }, [ goes to new line
	                        if (!opt.keep_array_indentation) {
	                            print_newline();
	                        }
	                    }
	                }

	            } else {
	                if (last_type === 'TK_RESERVED' && flags.last_text === 'for') {
	                    next_mode = MODE.ForInitializer;
	                } else if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['if', 'while'])) {
	                    next_mode = MODE.Conditional;
	                } else {
	                    // next_mode = MODE.Expression;
	                }
	            }

	            if (flags.last_text === ';' || last_type === 'TK_START_BLOCK') {
	                print_newline();
	            } else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || flags.last_text === '.') {
	                // TODO: Consider whether forcing this is required.  Review failing tests when removed.
	                allow_wrap_or_preserved_newline(current_token.wanted_newline);
	                // do nothing on (( and )( and ][ and ]( and .(
	            } else if (!(last_type === 'TK_RESERVED' && current_token.text === '(') && last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
	                output.space_before_token = true;
	            } else if ((last_type === 'TK_RESERVED' && (flags.last_word === 'function' || flags.last_word === 'typeof')) ||
	                (flags.last_text === '*' && last_last_text === 'function')) {
	                // function() vs function ()
	                if (opt.space_after_anon_function) {
	                    output.space_before_token = true;
	                }
	            } else if (last_type === 'TK_RESERVED' && (in_array(flags.last_text, Tokenizer.line_starters) || flags.last_text === 'catch')) {
	                if (opt.space_before_conditional) {
	                    output.space_before_token = true;
	                }
	            }

	            // Should be a space between await and an IIFE
	            if(current_token.text === '(' && last_type === 'TK_RESERVED' && flags.last_word === 'await'){
	                output.space_before_token = true;
	            }

	            // Support of this kind of newline preservation.
	            // a = (b &&
	            //     (c || d));
	            if (current_token.text === '(') {
	                if (last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
	                    if (!start_of_object_property()) {
	                        allow_wrap_or_preserved_newline();
	                    }
	                }
	            }

	            set_mode(next_mode);
	            print_token();
	            if (opt.space_in_paren) {
	                output.space_before_token = true;
	            }

	            // In all cases, if we newline while inside an expression it should be indented.
	            indent();
	        }

	        function handle_end_expr() {
	            // statements inside expressions are not valid syntax, but...
	            // statements must all be closed when their container closes
	            while (flags.mode === MODE.Statement) {
	                restore_mode();
	            }

	            if (flags.multiline_frame) {
	                allow_wrap_or_preserved_newline(current_token.text === ']' && is_array(flags.mode) && !opt.keep_array_indentation);
	            }

	            if (opt.space_in_paren) {
	                if (last_type === 'TK_START_EXPR' && ! opt.space_in_empty_paren) {
	                    // () [] no inner space in empty parens like these, ever, ref #320
	                    output.trim();
	                    output.space_before_token = false;
	                } else {
	                    output.space_before_token = true;
	                }
	            }
	            if (current_token.text === ']' && opt.keep_array_indentation) {
	                print_token();
	                restore_mode();
	            } else {
	                restore_mode();
	                print_token();
	            }
	            output.remove_redundant_indentation(previous_flags);

	            // do {} while () // no statement required after
	            if (flags.do_while && previous_flags.mode === MODE.Conditional) {
	                previous_flags.mode = MODE.Expression;
	                flags.do_block = false;
	                flags.do_while = false;

	            }
	        }

	        function handle_start_block() {
	            // Check if this is should be treated as a ObjectLiteral
	            var next_token = get_token(1)
	            var second_token = get_token(2)
	            if (second_token && (
	                    (second_token.text === ':' && in_array(next_token.type, ['TK_STRING', 'TK_WORD', 'TK_RESERVED']))
	                    || (in_array(next_token.text, ['get', 'set']) && in_array(second_token.type, ['TK_WORD', 'TK_RESERVED']))
	                )) {
	                // We don't support TypeScript,but we didn't break it for a very long time.
	                // We'll try to keep not breaking it.
	                if (!in_array(last_last_text, ['class','interface'])) {
	                    set_mode(MODE.ObjectLiteral);
	                } else {
	                    set_mode(MODE.BlockStatement);
	                }
	            } else {
	                set_mode(MODE.BlockStatement);
	            }

	            var empty_braces = !next_token.comments_before.length &&  next_token.text === '}';
	            var empty_anonymous_function = empty_braces && flags.last_word === 'function' &&
	                last_type === 'TK_END_EXPR';

	            if (opt.brace_style === "expand" ||
	                (opt.brace_style === "none" && current_token.wanted_newline)) {
	                if (last_type !== 'TK_OPERATOR' &&
	                    (empty_anonymous_function ||
	                        last_type === 'TK_EQUALS' ||
	                        (last_type === 'TK_RESERVED' && is_special_word(flags.last_text) && flags.last_text !== 'else'))) {
	                    output.space_before_token = true;
	                } else {
	                    print_newline(false, true);
	                }
	            } else { // collapse
	                if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
	                    if (last_type === 'TK_START_BLOCK') {
	                        print_newline();
	                    } else {
	                        output.space_before_token = true;
	                    }
	                } else {
	                    // if TK_OPERATOR or TK_START_EXPR
	                    if (is_array(previous_flags.mode) && flags.last_text === ',') {
	                        if (last_last_text === '}') {
	                            // }, { in array context
	                            output.space_before_token = true;
	                        } else {
	                            print_newline(); // [a, b, c, {
	                        }
	                    }
	                }
	            }
	            print_token();
	            indent();
	        }

	        function handle_end_block() {
	            // statements must all be closed when their container closes
	            while (flags.mode === MODE.Statement) {
	                restore_mode();
	            }
	            var empty_braces = last_type === 'TK_START_BLOCK';

	            if (opt.brace_style === "expand") {
	                if (!empty_braces) {
	                    print_newline();
	                }
	            } else {
	                // skip {}
	                if (!empty_braces) {
	                    if (is_array(flags.mode) && opt.keep_array_indentation) {
	                        // we REALLY need a newline here, but newliner would skip that
	                        opt.keep_array_indentation = false;
	                        print_newline();
	                        opt.keep_array_indentation = true;

	                    } else {
	                        print_newline();
	                    }
	                }
	            }
	            restore_mode();
	            print_token();
	        }

	        function handle_word() {
	            if (current_token.type === 'TK_RESERVED' && flags.mode !== MODE.ObjectLiteral &&
	                in_array(current_token.text, ['set', 'get'])) {
	                current_token.type = 'TK_WORD';
	            }

	            if (current_token.type === 'TK_RESERVED' && flags.mode === MODE.ObjectLiteral) {
	                var next_token = get_token(1);
	                if (next_token.text == ':') {
	                    current_token.type = 'TK_WORD';
	                }
	            }

	            if (start_of_statement()) {
	                // The conditional starts the statement if appropriate.
	            } else if (current_token.wanted_newline && !is_expression(flags.mode) &&
	                (last_type !== 'TK_OPERATOR' || (flags.last_text === '--' || flags.last_text === '++')) &&
	                last_type !== 'TK_EQUALS' &&
	                (opt.preserve_newlines || !(last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const', 'set', 'get'])))) {

	                print_newline();
	            }

	            if (flags.do_block && !flags.do_while) {
	                if (current_token.type === 'TK_RESERVED' && current_token.text === 'while') {
	                    // do {} ## while ()
	                    output.space_before_token = true;
	                    print_token();
	                    output.space_before_token = true;
	                    flags.do_while = true;
	                    return;
	                } else {
	                    // do {} should always have while as the next word.
	                    // if we don't see the expected while, recover
	                    print_newline();
	                    flags.do_block = false;
	                }
	            }

	            // if may be followed by else, or not
	            // Bare/inline ifs are tricky
	            // Need to unwind the modes correctly: if (a) if (b) c(); else d(); else e();
	            if (flags.if_block) {
	                if (!flags.else_block && (current_token.type === 'TK_RESERVED' && current_token.text === 'else')) {
	                    flags.else_block = true;
	                } else {
	                    while (flags.mode === MODE.Statement) {
	                        restore_mode();
	                    }
	                    flags.if_block = false;
	                    flags.else_block = false;
	                }
	            }

	            if (current_token.type === 'TK_RESERVED' && (current_token.text === 'case' || (current_token.text === 'default' && flags.in_case_statement))) {
	                print_newline();
	                if (flags.case_body || opt.jslint_happy) {
	                    // switch cases following one another
	                    deindent();
	                    flags.case_body = false;
	                }
	                print_token();
	                flags.in_case = true;
	                flags.in_case_statement = true;
	                return;
	            }

	            if (current_token.type === 'TK_RESERVED' && current_token.text === 'function') {
	                if (in_array(flags.last_text, ['}', ';']) || (output.just_added_newline() && ! in_array(flags.last_text, ['[', '{', ':', '=', ',']))) {
	                    // make sure there is a nice clean space of at least one blank line
	                    // before a new function definition
	                    if ( !output.just_added_blankline() && !current_token.comments_before.length) {
	                        print_newline();
	                        print_newline(true);
	                    }
	                }
	                if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
	                    if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set', 'new', 'return', 'export', 'async'])) {
	                        output.space_before_token = true;
	                    } else if (last_type === 'TK_RESERVED' && flags.last_text === 'default' && last_last_text === 'export') {
	                        output.space_before_token = true;
	                    } else {
	                        print_newline();
	                    }
	                } else if (last_type === 'TK_OPERATOR' || flags.last_text === '=') {
	                    // foo = function
	                    output.space_before_token = true;
	                } else if (!flags.multiline_frame && (is_expression(flags.mode) || is_array(flags.mode))) {
	                    // (function
	                } else {
	                    print_newline();
	                }
	            }

	            if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
	                if (!start_of_object_property()) {
	                    allow_wrap_or_preserved_newline();
	                }
	            }

	            if (current_token.type === 'TK_RESERVED' &&  in_array(current_token.text, ['function', 'get', 'set'])) {
	                print_token();
	                flags.last_word = current_token.text;
	                return;
	            }

	            prefix = 'NONE';

	            if (last_type === 'TK_END_BLOCK') {
	                if (!(current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['else', 'catch', 'finally']))) {
	                    prefix = 'NEWLINE';
	                } else {
	                    if (opt.brace_style === "expand" ||
	                        opt.brace_style === "end-expand" ||
	                        (opt.brace_style === "none" && current_token.wanted_newline)) {
	                        prefix = 'NEWLINE';
	                    } else {
	                        prefix = 'SPACE';
	                        output.space_before_token = true;
	                    }
	                }
	            } else if (last_type === 'TK_SEMICOLON' && flags.mode === MODE.BlockStatement) {
	                // TODO: Should this be for STATEMENT as well?
	                prefix = 'NEWLINE';
	            } else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
	                prefix = 'SPACE';
	            } else if (last_type === 'TK_STRING') {
	                prefix = 'NEWLINE';
	            } else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD' ||
	                (flags.last_text === '*' && last_last_text === 'function')) {
	                prefix = 'SPACE';
	            } else if (last_type === 'TK_START_BLOCK') {
	                prefix = 'NEWLINE';
	            } else if (last_type === 'TK_END_EXPR') {
	                output.space_before_token = true;
	                prefix = 'NEWLINE';
	            }

	            if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, Tokenizer.line_starters) && flags.last_text !== ')') {
	                if (flags.last_text === 'else' || flags.last_text === 'export') {
	                    prefix = 'SPACE';
	                } else {
	                    prefix = 'NEWLINE';
	                }

	            }

	            if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['else', 'catch', 'finally'])) {
	                if (last_type !== 'TK_END_BLOCK' ||
	                    opt.brace_style === "expand" ||
	                    opt.brace_style === "end-expand" ||
	                    (opt.brace_style === "none" && current_token.wanted_newline)) {
	                    print_newline();
	                } else {
	                    output.trim(true);
	                    var line = output.current_line;
	                    // If we trimmed and there's something other than a close block before us
	                    // put a newline back in.  Handles '} // comment' scenario.
	                    if (line.last() !== '}') {
	                        print_newline();
	                    }
	                    output.space_before_token = true;
	                }
	            } else if (prefix === 'NEWLINE') {
	                if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
	                    // no newline between 'return nnn'
	                    output.space_before_token = true;
	                } else if (last_type !== 'TK_END_EXPR') {
	                    if ((last_type !== 'TK_START_EXPR' || !(current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['var', 'let', 'const']))) && flags.last_text !== ':') {
	                        // no need to force newline on 'var': for (var x = 0...)
	                        if (current_token.type === 'TK_RESERVED' && current_token.text === 'if' && flags.last_text === 'else') {
	                            // no newline for } else if {
	                            output.space_before_token = true;
	                        } else {
	                            print_newline();
	                        }
	                    }
	                } else if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, Tokenizer.line_starters) && flags.last_text !== ')') {
	                    print_newline();
	                }
	            } else if (flags.multiline_frame && is_array(flags.mode) && flags.last_text === ',' && last_last_text === '}') {
	                print_newline(); // }, in lists get a newline treatment
	            } else if (prefix === 'SPACE') {
	                output.space_before_token = true;
	            }
	            print_token();
	            flags.last_word = current_token.text;

	            if (current_token.type === 'TK_RESERVED' && current_token.text === 'do') {
	                flags.do_block = true;
	            }

	            if (current_token.type === 'TK_RESERVED' && current_token.text === 'if') {
	                flags.if_block = true;
	            }
	        }

	        function handle_semicolon() {
	            if (start_of_statement()) {
	                // The conditional starts the statement if appropriate.
	                // Semicolon can be the start (and end) of a statement
	                output.space_before_token = false;
	            }
	            while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
	                restore_mode();
	            }
	            print_token();
	        }

	        function handle_string() {
	            if (start_of_statement()) {
	                // The conditional starts the statement if appropriate.
	                // One difference - strings want at least a space before
	                output.space_before_token = true;
	            } else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
	                output.space_before_token = true;
	            } else if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
	                if (!start_of_object_property()) {
	                    allow_wrap_or_preserved_newline();
	                }
	            } else {
	                print_newline();
	            }
	            print_token();
	        }

	        function handle_equals() {
	            if (start_of_statement()) {
	                // The conditional starts the statement if appropriate.
	            }

	            if (flags.declaration_statement) {
	                // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
	                flags.declaration_assignment = true;
	            }
	            output.space_before_token = true;
	            print_token();
	            output.space_before_token = true;
	        }

	        function handle_comma() {
	            if (flags.declaration_statement) {
	                if (is_expression(flags.parent.mode)) {
	                    // do not break on comma, for(var a = 1, b = 2)
	                    flags.declaration_assignment = false;
	                }

	                print_token();

	                if (flags.declaration_assignment) {
	                    flags.declaration_assignment = false;
	                    print_newline(false, true);
	                } else {
	                    output.space_before_token = true;
	                    // for comma-first, we want to allow a newline before the comma
	                    // to turn into a newline after the comma, which we will fixup later
	                    if (opt.comma_first) {
	                        allow_wrap_or_preserved_newline();
	                    }
	                }
	                return;
	            }

	            print_token();
	            if (flags.mode === MODE.ObjectLiteral ||
	                (flags.mode === MODE.Statement && flags.parent.mode === MODE.ObjectLiteral)) {
	                if (flags.mode === MODE.Statement) {
	                    restore_mode();
	                }
	                print_newline();
	            } else {
	                // EXPR or DO_BLOCK
	                output.space_before_token = true;
	                // for comma-first, we want to allow a newline before the comma
	                // to turn into a newline after the comma, which we will fixup later
	                if (opt.comma_first) {
	                    allow_wrap_or_preserved_newline();
	                }
	            }

	        }

	        function handle_operator() {
	            if (start_of_statement()) {
	                // The conditional starts the statement if appropriate.
	            }

	            if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
	                // "return" had a special handling in TK_WORD. Now we need to return the favor
	                output.space_before_token = true;
	                print_token();
	                return;
	            }

	            // hack for actionscript's import .*;
	            if (current_token.text === '*' && last_type === 'TK_DOT') {
	                print_token();
	                return;
	            }

	            if (current_token.text === ':' && flags.in_case) {
	                flags.case_body = true;
	                indent();
	                print_token();
	                print_newline();
	                flags.in_case = false;
	                return;
	            }

	            if (current_token.text === '::') {
	                // no spaces around exotic namespacing syntax operator
	                print_token();
	                return;
	            }

	            // Allow line wrapping between operators
	            if (last_type === 'TK_OPERATOR') {
	                allow_wrap_or_preserved_newline();
	            }

	            var space_before = true;
	            var space_after = true;

	            if (in_array(current_token.text, ['--', '++', '!', '~']) || (in_array(current_token.text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) || in_array(flags.last_text, Tokenizer.line_starters) || flags.last_text === ','))) {
	                // unary operators (and binary +/- pretending to be unary) special cases

	                space_before = false;
	                space_after = false;

	                // http://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
	                // if there is a newline between -- or ++ and anything else we should preserve it.
	                if (current_token.wanted_newline && (current_token.text === '--' || current_token.text === '++')) {
	                    print_newline(false, true);
	                }

	                if (flags.last_text === ';' && is_expression(flags.mode)) {
	                    // for (;; ++i)
	                    //        ^^^
	                    space_before = true;
	                }

	                if (last_type === 'TK_RESERVED') {
	                    space_before = true;
	                } else if (last_type === 'TK_END_EXPR') {
	                    space_before = !(flags.last_text === ']' && (current_token.text === '--' || current_token.text === '++'));
	                } else if (last_type === 'TK_OPERATOR') {
	                    // a++ + ++b;
	                    // a - -b
	                    space_before = in_array(current_token.text, ['--', '-', '++', '+']) && in_array(flags.last_text, ['--', '-', '++', '+']);
	                    // + and - are not unary when preceeded by -- or ++ operator
	                    // a-- + b
	                    // a * +b
	                    // a - -b
	                    if (in_array(current_token.text, ['+', '-']) && in_array(flags.last_text, ['--', '++'])) {
	                        space_after = true;
	                    }
	                }

	                if ((flags.mode === MODE.BlockStatement || flags.mode === MODE.Statement) && (flags.last_text === '{' || flags.last_text === ';')) {
	                    // { foo; --i }
	                    // foo(); --bar;
	                    print_newline();
	                }
	            } else if (current_token.text === ':') {
	                if (flags.ternary_depth === 0) {
	                    // Colon is invalid javascript outside of ternary and object, but do our best to guess what was meant.
	                    space_before = false;
	                } else {
	                    flags.ternary_depth -= 1;
	                }
	            } else if (current_token.text === '?') {
	                flags.ternary_depth += 1;
	            } else if (current_token.text === '*' && last_type === 'TK_RESERVED' && flags.last_text === 'function') {
	                space_before = false;
	                space_after = false;
	            }
	            output.space_before_token = output.space_before_token || space_before;
	            print_token();
	            output.space_before_token = space_after;
	        }

	        function handle_block_comment() {
	            if (output.raw) {
	                output.add_raw_token(current_token)
	                if (current_token.directives && current_token.directives['preserve'] === 'end') {
	                    // If we're testing the raw output behavior, do not allow a directive to turn it off.
	                    if (!opt.test_output_raw) {
	                        output.raw = false;
	                    }
	                }
	                return;
	            }

	            if (current_token.directives) {
	                print_newline(false, true);
	                print_token();
	                if (current_token.directives['preserve'] === 'start') {
	                    output.raw = true;
	                }
	                print_newline(false, true);
	                return;
	            }

	            // inline block
	            if (!acorn.newline.test(current_token.text) && !current_token.wanted_newline) {
	                output.space_before_token = true;
	                print_token();
	                output.space_before_token = true;
	                return;
	            }

	            var lines = split_newlines(current_token.text);
	            var j; // iterator for this case
	            var javadoc = false;
	            var starless = false;
	            var lastIndent = current_token.whitespace_before;
	            var lastIndentLength = lastIndent.length;

	            // block comment starts with a new line
	            print_newline(false, true);
	            if (lines.length > 1) {
	                if (all_lines_start_with(lines.slice(1), '*')) {
	                    javadoc = true;
	                }
	                else if (each_line_matches_indent(lines.slice(1), lastIndent)) {
	                    starless = true;
	                }
	            }

	            // first line always indented
	            print_token(lines[0]);
	            for (j = 1; j < lines.length; j++) {
	                print_newline(false, true);
	                if (javadoc) {
	                    // javadoc: reformat and re-indent
	                    print_token(' ' + ltrim(lines[j]));
	                } else if (starless && lines[j].length > lastIndentLength) {
	                    // starless: re-indent non-empty content, avoiding trim
	                    print_token(lines[j].substring(lastIndentLength));
	                } else {
	                    // normal comments output raw
	                    output.add_token(lines[j]);
	                }
	            }

	            // for comments of more than one line, make sure there's a new line after
	            print_newline(false, true);
	        }

	        function handle_comment() {
	            if (current_token.wanted_newline) {
	                print_newline(false, true);
	            } else {
	                output.trim(true);
	            }

	            output.space_before_token = true;
	            print_token();
	            print_newline(false, true);
	        }

	        function handle_dot() {
	            if (start_of_statement()) {
	                // The conditional starts the statement if appropriate.
	            }

	            if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
	                output.space_before_token = true;
	            } else {
	                // allow preserved newlines before dots in general
	                // force newlines on dots after close paren when break_chained - for bar().baz()
	                allow_wrap_or_preserved_newline(flags.last_text === ')' && opt.break_chained_methods);
	            }

	            print_token();
	        }

	        function handle_unknown() {
	            print_token();

	            if (current_token.text[current_token.text.length - 1] === '\n') {
	                print_newline();
	            }
	        }

	        function handle_eof() {
	            // Unwind any open statements
	            while (flags.mode === MODE.Statement) {
	                restore_mode();
	            }
	        }
	    }


	    function OutputLine(parent) {
	        var _character_count = 0;
	        // use indent_count as a marker for lines that have preserved indentation
	        var _indent_count = -1;

	        var _items = [];
	        var _empty = true;

	        this.set_indent = function(level) {
	            _character_count = parent.baseIndentLength + level * parent.indent_length
	            _indent_count = level;
	        }

	        this.get_character_count = function() {
	            return _character_count;
	        }

	        this.is_empty = function() {
	            return _empty;
	        }

	        this.last = function() {
	            if (!this._empty) {
	              return _items[_items.length - 1];
	            } else {
	              return null;
	            }
	        }

	        this.push = function(input) {
	            _items.push(input);
	            _character_count += input.length;
	            _empty = false;
	        }

	        this.pop = function() {
	            var item = null;
	            if (!_empty) {
	                item = _items.pop();
	                _character_count -= item.length;
	                _empty = _items.length === 0;
	            }
	            return item;
	        }

	        this.remove_indent = function() {
	            if (_indent_count > 0) {
	                _indent_count -= 1;
	                _character_count -= parent.indent_length
	            }
	        }

	        this.trim = function() {
	            while (this.last() === ' ') {
	                var item = _items.pop();
	                _character_count -= 1;
	            }
	            _empty = _items.length === 0;
	        }

	        this.toString = function() {
	            var result = '';
	            if (!this._empty) {
	                if (_indent_count >= 0) {
	                    result = parent.indent_cache[_indent_count];
	                }
	                result += _items.join('')
	            }
	            return result;
	        }
	    }

	    function Output(indent_string, baseIndentString) {
	        baseIndentString = baseIndentString || '';
	        this.indent_cache = [ baseIndentString ];
	        this.baseIndentLength = baseIndentString.length;
	        this.indent_length = indent_string.length;
	        this.raw = false;

	        var lines =[];
	        this.baseIndentString = baseIndentString;
	        this.indent_string = indent_string;
	        this.previous_line = null;
	        this.current_line = null;
	        this.space_before_token = false;

	        this.add_outputline = function() {
	            this.previous_line = this.current_line;
	            this.current_line = new OutputLine(this);
	            lines.push(this.current_line);
	        }

	        // initialize
	        this.add_outputline();


	        this.get_line_number = function() {
	            return lines.length;
	        }

	        // Using object instead of string to allow for later expansion of info about each line
	        this.add_new_line = function(force_newline) {
	            if (this.get_line_number() === 1 && this.just_added_newline()) {
	                return false; // no newline on start of file
	            }

	            if (force_newline || !this.just_added_newline()) {
	                if (!this.raw) {
	                    this.add_outputline();
	                }
	                return true;
	            }

	            return false;
	        }

	        this.get_code = function() {
	            var sweet_code = lines.join('\n').replace(/[\r\n\t ]+$/, '');
	            return sweet_code;
	        }

	        this.set_indent = function(level) {
	            // Never indent your first output indent at the start of the file
	            if (lines.length > 1) {
	                while(level >= this.indent_cache.length) {
	                    this.indent_cache.push(this.indent_cache[this.indent_cache.length - 1] + this.indent_string);
	                }

	                this.current_line.set_indent(level);
	                return true;
	            }
	            this.current_line.set_indent(0);
	            return false;
	        }

	        this.add_raw_token = function(token) {
	            for (var x = 0; x < token.newlines; x++) {
	                this.add_outputline();
	            }
	            this.current_line.push(token.whitespace_before);
	            this.current_line.push(token.text);
	            this.space_before_token = false;
	        }

	        this.add_token = function(printable_token) {
	            this.add_space_before_token();
	            this.current_line.push(printable_token);
	        }

	        this.add_space_before_token = function() {
	            if (this.space_before_token && !this.just_added_newline()) {
	                this.current_line.push(' ');
	            }
	            this.space_before_token = false;
	        }

	        this.remove_redundant_indentation = function (frame) {
	            // This implementation is effective but has some issues:
	            //     - can cause line wrap to happen too soon due to indent removal
	            //           after wrap points are calculated
	            // These issues are minor compared to ugly indentation.

	            if (frame.multiline_frame ||
	                frame.mode === MODE.ForInitializer ||
	                frame.mode === MODE.Conditional) {
	                return;
	            }

	            // remove one indent from each line inside this section
	            var index = frame.start_line_index;
	            var line;

	            var output_length = lines.length;
	            while (index < output_length) {
	                lines[index].remove_indent();
	                index++;
	            }
	        }

	        this.trim = function(eat_newlines) {
	            eat_newlines = (eat_newlines === undefined) ? false : eat_newlines;

	            this.current_line.trim(indent_string, baseIndentString);

	            while (eat_newlines && lines.length > 1 &&
	                this.current_line.is_empty()) {
	                lines.pop();
	                this.current_line = lines[lines.length - 1]
	                this.current_line.trim();
	            }

	            this.previous_line = lines.length > 1 ? lines[lines.length - 2] : null;
	        }

	        this.just_added_newline = function() {
	            return this.current_line.is_empty();
	        }

	        this.just_added_blankline = function() {
	            if (this.just_added_newline()) {
	                if (lines.length === 1) {
	                    return true; // start of the file and newline = blank
	                }

	                var line = lines[lines.length - 2];
	                return line.is_empty();
	            }
	            return false;
	        }
	    }


	    var Token = function(type, text, newlines, whitespace_before, mode, parent) {
	        this.type = type;
	        this.text = text;
	        this.comments_before = [];
	        this.newlines = newlines || 0;
	        this.wanted_newline = newlines > 0;
	        this.whitespace_before = whitespace_before || '';
	        this.parent = null;
	        this.directives = null;
	    }

	    function tokenizer(input, opts, indent_string) {

	        var whitespace = "\n\r\t ".split('');
	        var digit = /[0-9]/;
	        var digit_hex = /[0123456789abcdefABCDEF]/;

	        var punct = ('+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! ~ , : ? ^ ^= |= :: =>'
	                +' <%= <% %> <?= <? ?>').split(' '); // try to be a good boy and try not to break the markup language identifiers

	        // words which should always start on new line.
	        this.line_starters = 'continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,import,export'.split(',');
	        var reserved_words = this.line_starters.concat(['do', 'in', 'else', 'get', 'set', 'new', 'catch', 'finally', 'typeof', 'yield', 'async', 'await']);

	        //  /* ... */ comment ends with nearest */ or end of file
	        var block_comment_pattern = /([\s\S]*?)((?:\*\/)|$)/g;

	        // comment ends just before nearest linefeed or end of file
	        var comment_pattern = /([^\n\r\u2028\u2029]*)/g;

	        var directives_block_pattern = /\/\* beautify( \w+[:]\w+)+ \*\//g;
	        var directive_pattern = / (\w+)[:](\w+)/g;
	        var directives_end_ignore_pattern = /([\s\S]*?)((?:\/\*\sbeautify\signore:end\s\*\/)|$)/g;

	        var template_pattern = /((<\?php|<\?=)[\s\S]*?\?>)|(<%[\s\S]*?%>)/g

	        var n_newlines, whitespace_before_token, in_html_comment, tokens, parser_pos;
	        var input_length;

	        this.tokenize = function() {
	            // cache the source's length.
	            input_length = input.length
	            parser_pos = 0;
	            in_html_comment = false
	            tokens = [];

	            var next, last;
	            var token_values;
	            var open = null;
	            var open_stack = [];
	            var comments = [];

	            while (!(last && last.type === 'TK_EOF')) {
	                token_values = tokenize_next();
	                next = new Token(token_values[1], token_values[0], n_newlines, whitespace_before_token);
	                while(next.type === 'TK_COMMENT' || next.type === 'TK_BLOCK_COMMENT' || next.type === 'TK_UNKNOWN') {
	                    if (next.type === 'TK_BLOCK_COMMENT') {
	                        next.directives = token_values[2];
	                    }
	                    comments.push(next);
	                    token_values = tokenize_next();
	                    next = new Token(token_values[1], token_values[0], n_newlines, whitespace_before_token);
	                }

	                if (comments.length) {
	                    next.comments_before = comments;
	                    comments = [];
	                }

	                if (next.type === 'TK_START_BLOCK' || next.type === 'TK_START_EXPR') {
	                    next.parent = last;
	                    open_stack.push(open);
	                    open = next;
	                }  else if ((next.type === 'TK_END_BLOCK' || next.type === 'TK_END_EXPR') &&
	                    (open && (
	                        (next.text === ']' && open.text === '[') ||
	                        (next.text === ')' && open.text === '(') ||
	                        (next.text === '}' && open.text === '{')))) {
	                    next.parent = open.parent;
	                    open = open_stack.pop();
	                }

	                tokens.push(next);
	                last = next;
	            }

	            return tokens;
	        }

	        function get_directives (text) {
	            if (!text.match(directives_block_pattern)) {
	                return null;
	            }

	            var directives = {};
	            directive_pattern.lastIndex = 0;
	            var directive_match = directive_pattern.exec(text);

	            while (directive_match) {
	                directives[directive_match[1]] = directive_match[2];
	                directive_match = directive_pattern.exec(text);
	            }

	            return directives;
	        }

	        function tokenize_next() {
	            var i, resulting_string;
	            var whitespace_on_this_line = [];

	            n_newlines = 0;
	            whitespace_before_token = '';

	            if (parser_pos >= input_length) {
	                return ['', 'TK_EOF'];
	            }

	            var last_token;
	            if (tokens.length) {
	                last_token = tokens[tokens.length-1];
	            } else {
	                // For the sake of tokenizing we can pretend that there was on open brace to start
	                last_token = new Token('TK_START_BLOCK', '{');
	            }


	            var c = input.charAt(parser_pos);
	            parser_pos += 1;

	            while (in_array(c, whitespace)) {

	                if (acorn.newline.test(c)) {
	                    if (!(c === '\n' && input.charAt(parser_pos-2) === '\r')) {
	                        n_newlines += 1;
	                        whitespace_on_this_line = [];
	                    }
	                } else {
	                    whitespace_on_this_line.push(c);
	                }

	                if (parser_pos >= input_length) {
	                    return ['', 'TK_EOF'];
	                }

	                c = input.charAt(parser_pos);
	                parser_pos += 1;
	            }

	            if(whitespace_on_this_line.length) {
	                whitespace_before_token = whitespace_on_this_line.join('');
	            }

	            if (digit.test(c)) {
	                var allow_decimal = true;
	                var allow_e = true;
	                var local_digit = digit;

	                if (c === '0' && parser_pos < input_length && /[Xx]/.test(input.charAt(parser_pos))) {
	                    // switch to hex number, no decimal or e, just hex digits
	                    allow_decimal = false;
	                    allow_e = false;
	                    c += input.charAt(parser_pos);
	                    parser_pos += 1;
	                    local_digit = digit_hex
	                } else {
	                    // we know this first loop will run.  It keeps the logic simpler.
	                    c = '';
	                    parser_pos -= 1
	                }

	                // Add the digits
	                while (parser_pos < input_length && local_digit.test(input.charAt(parser_pos))) {
	                    c += input.charAt(parser_pos);
	                    parser_pos += 1;

	                    if (allow_decimal && parser_pos < input_length && input.charAt(parser_pos) === '.') {
	                        c += input.charAt(parser_pos);
	                        parser_pos += 1;
	                        allow_decimal = false;
	                    }

	                    if (allow_e && parser_pos < input_length && /[Ee]/.test(input.charAt(parser_pos))) {
	                        c += input.charAt(parser_pos);
	                        parser_pos += 1;

	                        if (parser_pos < input_length && /[+-]/.test(input.charAt(parser_pos))) {
	                            c += input.charAt(parser_pos);
	                            parser_pos += 1;
	                        }

	                        allow_e = false;
	                        allow_decimal = false;
	                    }
	                }

	                return [c, 'TK_WORD'];
	            }

	            if (acorn.isIdentifierStart(input.charCodeAt(parser_pos-1))) {
	                if (parser_pos < input_length) {
	                    while (acorn.isIdentifierChar(input.charCodeAt(parser_pos))) {
	                        c += input.charAt(parser_pos);
	                        parser_pos += 1;
	                        if (parser_pos === input_length) {
	                            break;
	                        }
	                    }
	                }

	                if (!(last_token.type === 'TK_DOT' ||
	                        (last_token.type === 'TK_RESERVED' && in_array(last_token.text, ['set', 'get'])))
	                    && in_array(c, reserved_words)) {
	                    if (c === 'in') { // hack for 'in' operator
	                        return [c, 'TK_OPERATOR'];
	                    }
	                    return [c, 'TK_RESERVED'];
	                }

	                return [c, 'TK_WORD'];
	            }

	            if (c === '(' || c === '[') {
	                return [c, 'TK_START_EXPR'];
	            }

	            if (c === ')' || c === ']') {
	                return [c, 'TK_END_EXPR'];
	            }

	            if (c === '{') {
	                return [c, 'TK_START_BLOCK'];
	            }

	            if (c === '}') {
	                return [c, 'TK_END_BLOCK'];
	            }

	            if (c === ';') {
	                return [c, 'TK_SEMICOLON'];
	            }

	            if (c === '/') {
	                var comment = '';
	                // peek for comment /* ... */
	                if (input.charAt(parser_pos) === '*') {
	                    parser_pos += 1;
	                    block_comment_pattern.lastIndex = parser_pos;
	                    var comment_match = block_comment_pattern.exec(input);
	                    comment = '/*' + comment_match[0];
	                    parser_pos += comment_match[0].length;
	                    var directives = get_directives(comment);
	                    if (directives && directives['ignore'] === 'start') {
	                        directives_end_ignore_pattern.lastIndex = parser_pos;
	                        comment_match = directives_end_ignore_pattern.exec(input)
	                        comment += comment_match[0];
	                        parser_pos += comment_match[0].length;
	                    }
	                    comment = comment.replace(acorn.lineBreak, '\n');
	                    return [comment, 'TK_BLOCK_COMMENT', directives];
	                }
	                // peek for comment // ...
	                if (input.charAt(parser_pos) === '/') {
	                    parser_pos += 1;
	                    comment_pattern.lastIndex = parser_pos;
	                    var comment_match = comment_pattern.exec(input);
	                    comment = '//' + comment_match[0];
	                    parser_pos += comment_match[0].length;
	                    return [comment, 'TK_COMMENT'];
	                }

	            }

	            if (c === '`' || c === "'" || c === '"' || // string
	                (
	                    (c === '/') || // regexp
	                    (opts.e4x && c === "<" && input.slice(parser_pos - 1).match(/^<([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])(\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{.*?}))*\s*(\/?)\s*>/)) // xml
	                ) && ( // regex and xml can only appear in specific locations during parsing
	                    (last_token.type === 'TK_RESERVED' && in_array(last_token.text , ['return', 'case', 'throw', 'else', 'do', 'typeof', 'yield'])) ||
	                    (last_token.type === 'TK_END_EXPR' && last_token.text === ')' &&
	                        last_token.parent && last_token.parent.type === 'TK_RESERVED' && in_array(last_token.parent.text, ['if', 'while', 'for'])) ||
	                    (in_array(last_token.type, ['TK_COMMENT', 'TK_START_EXPR', 'TK_START_BLOCK',
	                        'TK_END_BLOCK', 'TK_OPERATOR', 'TK_EQUALS', 'TK_EOF', 'TK_SEMICOLON', 'TK_COMMA'
	                    ]))
	                )) {

	                var sep = c,
	                    esc = false,
	                    has_char_escapes = false;

	                resulting_string = c;

	                if (sep === '/') {
	                    //
	                    // handle regexp
	                    //
	                    var in_char_class = false;
	                    while (parser_pos < input_length &&
	                            ((esc || in_char_class || input.charAt(parser_pos) !== sep) &&
	                            !acorn.newline.test(input.charAt(parser_pos)))) {
	                        resulting_string += input.charAt(parser_pos);
	                        if (!esc) {
	                            esc = input.charAt(parser_pos) === '\\';
	                            if (input.charAt(parser_pos) === '[') {
	                                in_char_class = true;
	                            } else if (input.charAt(parser_pos) === ']') {
	                                in_char_class = false;
	                            }
	                        } else {
	                            esc = false;
	                        }
	                        parser_pos += 1;
	                    }
	                } else if (opts.e4x && sep === '<') {
	                    //
	                    // handle e4x xml literals
	                    //
	                    var xmlRegExp = /<(\/?)([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])(\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{.*?}))*\s*(\/?)\s*>/g;
	                    var xmlStr = input.slice(parser_pos - 1);
	                    var match = xmlRegExp.exec(xmlStr);
	                    if (match && match.index === 0) {
	                        var rootTag = match[2];
	                        var depth = 0;
	                        while (match) {
	                            var isEndTag = !! match[1];
	                            var tagName = match[2];
	                            var isSingletonTag = ( !! match[match.length - 1]) || (tagName.slice(0, 8) === "![CDATA[");
	                            if (tagName === rootTag && !isSingletonTag) {
	                                if (isEndTag) {
	                                    --depth;
	                                } else {
	                                    ++depth;
	                                }
	                            }
	                            if (depth <= 0) {
	                                break;
	                            }
	                            match = xmlRegExp.exec(xmlStr);
	                        }
	                        var xmlLength = match ? match.index + match[0].length : xmlStr.length;
	                        xmlStr = xmlStr.slice(0, xmlLength);
	                        parser_pos += xmlLength - 1;
	                        xmlStr = xmlStr.replace(acorn.lineBreak, '\n');
	                        return [xmlStr, "TK_STRING"];
	                    }
	                } else {
	                    //
	                    // handle string
	                    //
	                    // Template strings can travers lines without escape characters.
	                    // Other strings cannot
	                    while (parser_pos < input_length &&
	                            (esc || (input.charAt(parser_pos) !== sep &&
	                            (sep === '`' || !acorn.newline.test(input.charAt(parser_pos)))))) {
	                        // Handle \r\n linebreaks after escapes or in template strings
	                        if ((esc || sep === '`') && acorn.newline.test(input.charAt(parser_pos))) {
	                            if (input.charAt(parser_pos) === '\r' && input.charAt(parser_pos + 1) === '\n') {
	                                parser_pos += 1;
	                            }
	                            resulting_string += '\n';
	                        } else {
	                            resulting_string += input.charAt(parser_pos);
	                        }
	                        if (esc) {
	                            if (input.charAt(parser_pos) === 'x' || input.charAt(parser_pos) === 'u') {
	                                has_char_escapes = true;
	                            }
	                            esc = false;
	                        } else {
	                            esc = input.charAt(parser_pos) === '\\';
	                        }
	                        parser_pos += 1;
	                    }

	                }

	                if (has_char_escapes && opts.unescape_strings) {
	                    resulting_string = unescape_string(resulting_string);
	                }

	                if (parser_pos < input_length && input.charAt(parser_pos) === sep) {
	                    resulting_string += sep;
	                    parser_pos += 1;

	                    if (sep === '/') {
	                        // regexps may have modifiers /regexp/MOD , so fetch those, too
	                        // Only [gim] are valid, but if the user puts in garbage, do what we can to take it.
	                        while (parser_pos < input_length && acorn.isIdentifierStart(input.charCodeAt(parser_pos))) {
	                            resulting_string += input.charAt(parser_pos);
	                            parser_pos += 1;
	                        }
	                    }
	                }
	                return [resulting_string, 'TK_STRING'];
	            }

	            if (c === '#') {

	                if (tokens.length === 0 && input.charAt(parser_pos) === '!') {
	                    // shebang
	                    resulting_string = c;
	                    while (parser_pos < input_length && c !== '\n') {
	                        c = input.charAt(parser_pos);
	                        resulting_string += c;
	                        parser_pos += 1;
	                    }
	                    return [trim(resulting_string) + '\n', 'TK_UNKNOWN'];
	                }



	                // Spidermonkey-specific sharp variables for circular references
	                // https://developer.mozilla.org/En/Sharp_variables_in_JavaScript
	                // http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935
	                var sharp = '#';
	                if (parser_pos < input_length && digit.test(input.charAt(parser_pos))) {
	                    do {
	                        c = input.charAt(parser_pos);
	                        sharp += c;
	                        parser_pos += 1;
	                    } while (parser_pos < input_length && c !== '#' && c !== '=');
	                    if (c === '#') {
	                        //
	                    } else if (input.charAt(parser_pos) === '[' && input.charAt(parser_pos + 1) === ']') {
	                        sharp += '[]';
	                        parser_pos += 2;
	                    } else if (input.charAt(parser_pos) === '{' && input.charAt(parser_pos + 1) === '}') {
	                        sharp += '{}';
	                        parser_pos += 2;
	                    }
	                    return [sharp, 'TK_WORD'];
	                }
	            }

	            if (c === '<' && (input.charAt(parser_pos) === '?' || input.charAt(parser_pos) === '%')) {
	                template_pattern.lastIndex = parser_pos - 1;
	                var template_match = template_pattern.exec(input);
	                if(template_match) {
	                    c = template_match[0];
	                    parser_pos += c.length - 1;
	                    c = c.replace(acorn.lineBreak, '\n');
	                    return [c, 'TK_STRING'];
	                }
	            }

	            if (c === '<' && input.substring(parser_pos - 1, parser_pos + 3) === '<!--') {
	                parser_pos += 3;
	                c = '<!--';
	                while (!acorn.newline.test(input.charAt(parser_pos)) && parser_pos < input_length) {
	                    c += input.charAt(parser_pos);
	                    parser_pos++;
	                }
	                in_html_comment = true;
	                return [c, 'TK_COMMENT'];
	            }

	            if (c === '-' && in_html_comment && input.substring(parser_pos - 1, parser_pos + 2) === '-->') {
	                in_html_comment = false;
	                parser_pos += 2;
	                return ['-->', 'TK_COMMENT'];
	            }

	            if (c === '.') {
	                return [c, 'TK_DOT'];
	            }

	            if (in_array(c, punct)) {
	                while (parser_pos < input_length && in_array(c + input.charAt(parser_pos), punct)) {
	                    c += input.charAt(parser_pos);
	                    parser_pos += 1;
	                    if (parser_pos >= input_length) {
	                        break;
	                    }
	                }

	                if (c === ',') {
	                    return [c, 'TK_COMMA'];
	                } else if (c === '=') {
	                    return [c, 'TK_EQUALS'];
	                } else {
	                    return [c, 'TK_OPERATOR'];
	                }
	            }

	            return [c, 'TK_UNKNOWN'];
	        }


	        function unescape_string(s) {
	            var esc = false,
	                out = '',
	                pos = 0,
	                s_hex = '',
	                escaped = 0,
	                c;

	            while (esc || pos < s.length) {

	                c = s.charAt(pos);
	                pos++;

	                if (esc) {
	                    esc = false;
	                    if (c === 'x') {
	                        // simple hex-escape \x24
	                        s_hex = s.substr(pos, 2);
	                        pos += 2;
	                    } else if (c === 'u') {
	                        // unicode-escape, \u2134
	                        s_hex = s.substr(pos, 4);
	                        pos += 4;
	                    } else {
	                        // some common escape, e.g \n
	                        out += '\\' + c;
	                        continue;
	                    }
	                    if (!s_hex.match(/^[0123456789abcdefABCDEF]+$/)) {
	                        // some weird escaping, bail out,
	                        // leaving whole string intact
	                        return s;
	                    }

	                    escaped = parseInt(s_hex, 16);

	                    if (escaped >= 0x00 && escaped < 0x20) {
	                        // leave 0x00...0x1f escaped
	                        if (c === 'x') {
	                            out += '\\x' + s_hex;
	                        } else {
	                            out += '\\u' + s_hex;
	                        }
	                        continue;
	                    } else if (escaped === 0x22 || escaped === 0x27 || escaped === 0x5c) {
	                        // single-quote, apostrophe, backslash - escape these
	                        out += '\\' + String.fromCharCode(escaped);
	                    } else if (c === 'x' && escaped > 0x7e && escaped <= 0xff) {
	                        // we bail out on \x7f..\xff,
	                        // leaving whole string escaped,
	                        // as it's probably completely binary
	                        return s;
	                    } else {
	                        out += String.fromCharCode(escaped);
	                    }
	                } else if (c === '\\') {
	                    esc = true;
	                } else {
	                    out += c;
	                }
	            }
	            return out;
	        }

	    }


	    if (true) {
	        // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return { js_beautify: js_beautify };
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        // Add support for CommonJS. Just put this file somewhere on your require.paths
	        // and you will be able to `var js_beautify = require("beautify").js_beautify`.
	        exports.js_beautify = js_beautify;
	    } else if (typeof window !== "undefined") {
	        // If we're running a web page and don't have either of the above, add our one global
	        window.js_beautify = js_beautify;
	    } else if (typeof global !== "undefined") {
	        // If we don't even have window, try global.
	        global.js_beautify = js_beautify;
	    }

	}());


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
	/*

	  The MIT License (MIT)

	  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

	  Permission is hereby granted, free of charge, to any person
	  obtaining a copy of this software and associated documentation files
	  (the "Software"), to deal in the Software without restriction,
	  including without limitation the rights to use, copy, modify, merge,
	  publish, distribute, sublicense, and/or sell copies of the Software,
	  and to permit persons to whom the Software is furnished to do so,
	  subject to the following conditions:

	  The above copyright notice and this permission notice shall be
	  included in all copies or substantial portions of the Software.

	  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
	  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	  SOFTWARE.


	 CSS Beautifier
	---------------

	    Written by Harutyun Amirjanyan, (amirjanyan@gmail.com)

	    Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
	        http://jsbeautifier.org/

	    Usage:
	        css_beautify(source_text);
	        css_beautify(source_text, options);

	    The options are (default in brackets):
	        indent_size (4)                   — indentation size,
	        indent_char (space)               — character to indent with,
	        selector_separator_newline (true) - separate selectors with newline or
	                                            not (e.g. "a,\nbr" or "a, br")
	        end_with_newline (false)          - end with a newline
	        newline_between_rules (true)      - add a new line after every css rule

	    e.g

	    css_beautify(css_source_text, {
	      'indent_size': 1,
	      'indent_char': '\t',
	      'selector_separator': ' ',
	      'end_with_newline': false,
	      'newline_between_rules': true
	    });
	*/

	// http://www.w3.org/TR/CSS21/syndata.html#tokenization
	// http://www.w3.org/TR/css3-syntax/

	(function() {
	    function css_beautify(source_text, options) {
	        options = options || {};
	        source_text = source_text || '';
	        // HACK: newline parsing inconsistent. This brute force normalizes the input.
	        source_text = source_text.replace(/\r\n|[\r\u2028\u2029]/g, '\n')

	        var indentSize = options.indent_size || 4;
	        var indentCharacter = options.indent_char || ' ';
	        var selectorSeparatorNewline = (options.selector_separator_newline === undefined) ? true : options.selector_separator_newline;
	        var end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;
	        var newline_between_rules = (options.newline_between_rules === undefined) ? true : options.newline_between_rules;
	        var eol = options.eol ? options.eol : '\n';

	        // compatibility
	        if (typeof indentSize === "string") {
	            indentSize = parseInt(indentSize, 10);
	        }

	        if(options.indent_with_tabs){
	            indentCharacter = '\t';
	            indentSize = 1;
	        }

	        eol = eol.replace(/\\r/, '\r').replace(/\\n/, '\n')


	        // tokenizer
	        var whiteRe = /^\s+$/;
	        var wordRe = /[\w$\-_]/;

	        var pos = -1,
	            ch;
	        var parenLevel = 0;

	        function next() {
	            ch = source_text.charAt(++pos);
	            return ch || '';
	        }

	        function peek(skipWhitespace) {
	            var result = '';
	            var prev_pos = pos;
	            if (skipWhitespace) {
	                eatWhitespace();
	            }
	            result = source_text.charAt(pos + 1) || '';
	            pos = prev_pos - 1;
	            next();
	            return result;
	        }

	        function eatString(endChars) {
	            var start = pos;
	            while (next()) {
	                if (ch === "\\") {
	                    next();
	                } else if (endChars.indexOf(ch) !== -1) {
	                    break;
	                } else if (ch === "\n") {
	                    break;
	                }
	            }
	            return source_text.substring(start, pos + 1);
	        }

	        function peekString(endChar) {
	            var prev_pos = pos;
	            var str = eatString(endChar);
	            pos = prev_pos - 1;
	            next();
	            return str;
	        }

	        function eatWhitespace() {
	            var result = '';
	            while (whiteRe.test(peek())) {
	                next();
	                result += ch;
	            }
	            return result;
	        }

	        function skipWhitespace() {
	            var result = '';
	            if (ch && whiteRe.test(ch)) {
	                result = ch;
	            }
	            while (whiteRe.test(next())) {
	                result += ch;
	            }
	            return result;
	        }

	        function eatComment(singleLine) {
	            var start = pos;
	            singleLine = peek() === "/";
	            next();
	            while (next()) {
	                if (!singleLine && ch === "*" && peek() === "/") {
	                    next();
	                    break;
	                } else if (singleLine && ch === "\n") {
	                    return source_text.substring(start, pos);
	                }
	            }

	            return source_text.substring(start, pos) + ch;
	        }


	        function lookBack(str) {
	            return source_text.substring(pos - str.length, pos).toLowerCase() ===
	                str;
	        }

	        // Nested pseudo-class if we are insideRule
	        // and the next special character found opens
	        // a new block
	        function foundNestedPseudoClass() {
	            var openParen = 0;
	            for (var i = pos + 1; i < source_text.length; i++) {
	                var ch = source_text.charAt(i);
	                if (ch === "{") {
	                    return true;
	                } else if (ch === '(') {
	                    // pseudoclasses can contain ()
	                    openParen += 1;
	                } else if (ch === ')') {
	                    if (openParen == 0) {
	                        return false;
	                    }
	                    openParen -= 1;
	                } else if (ch === ";" || ch === "}") {
	                    return false;
	                }
	            }
	            return false;
	        }

	        // printer
	        var basebaseIndentString = source_text.match(/^[\t ]*/)[0];
	        var singleIndent = new Array(indentSize + 1).join(indentCharacter);
	        var indentLevel = 0;
	        var nestedLevel = 0;

	        function indent() {
	            indentLevel++;
	            basebaseIndentString += singleIndent;
	        }

	        function outdent() {
	            indentLevel--;
	            basebaseIndentString = basebaseIndentString.slice(0, -indentSize);
	        }

	        var print = {};
	        print["{"] = function(ch) {
	            print.singleSpace();
	            output.push(ch);
	            print.newLine();
	        };
	        print["}"] = function(ch) {
	            print.newLine();
	            output.push(ch);
	            print.newLine();
	        };

	        print._lastCharWhitespace = function() {
	            return whiteRe.test(output[output.length - 1]);
	        };

	        print.newLine = function(keepWhitespace) {
	            if (output.length) {
	                if (!keepWhitespace && output[output.length - 1] !== '\n') {
	                    print.trim();
	                }

	                output.push('\n');

	                if (basebaseIndentString) {
	                    output.push(basebaseIndentString);
	                }
	            }
	        };
	        print.singleSpace = function() {
	            if (output.length && !print._lastCharWhitespace()) {
	                output.push(' ');
	            }
	        };

	        print.preserveSingleSpace = function() {
	            if (isAfterSpace) {
	                print.singleSpace();
	            }
	        };

	        print.trim = function() {
	            while (print._lastCharWhitespace()) {
	                output.pop();
	            }
	        };


	        var output = [];
	        /*_____________________--------------------_____________________*/

	        var insideRule = false;
	        var insidePropertyValue = false;
	        var enteringConditionalGroup = false;
	        var top_ch = '';
	        var last_top_ch = '';

	        while (true) {
	            var whitespace = skipWhitespace();
	            var isAfterSpace = whitespace !== '';
	            var isAfterNewline = whitespace.indexOf('\n') !== -1;
	            last_top_ch = top_ch;
	            top_ch = ch;

	            if (!ch) {
	                break;
	            } else if (ch === '/' && peek() === '*') { /* css comment */
	                var header = indentLevel === 0;

	                if (isAfterNewline || header) {
	                    print.newLine();
	                }

	                output.push(eatComment());
	                print.newLine();
	                if (header) {
	                    print.newLine(true);
	                }
	            } else if (ch === '/' && peek() === '/') { // single line comment
	                if (!isAfterNewline && last_top_ch !== '{' ) {
	                    print.trim();
	                }
	                print.singleSpace();
	                output.push(eatComment());
	                print.newLine();
	            } else if (ch === '@') {
	                print.preserveSingleSpace();
	                output.push(ch);

	                // strip trailing space, if present, for hash property checks
	                var variableOrRule = peekString(": ,;{}()[]/='\"");

	                if (variableOrRule.match(/[ :]$/)) {
	                    // we have a variable or pseudo-class, add it and insert one space before continuing
	                    next();
	                    variableOrRule = eatString(": ").replace(/\s$/, '');
	                    output.push(variableOrRule);
	                    print.singleSpace();
	                }

	                variableOrRule = variableOrRule.replace(/\s$/, '')

	                // might be a nesting at-rule
	                if (variableOrRule in css_beautify.NESTED_AT_RULE) {
	                    nestedLevel += 1;
	                    if (variableOrRule in css_beautify.CONDITIONAL_GROUP_RULE) {
	                        enteringConditionalGroup = true;
	                    }
	                }
	            } else if (ch === '#' && peek() === '{') {
	              print.preserveSingleSpace();
	              output.push(eatString('}'));
	            } else if (ch === '{') {
	                if (peek(true) === '}') {
	                    eatWhitespace();
	                    next();
	                    print.singleSpace();
	                    output.push("{}");
	                    print.newLine();
	                    if (newline_between_rules && indentLevel === 0) {
	                        print.newLine(true);
	                    }
	                } else {
	                    indent();
	                    print["{"](ch);
	                    // when entering conditional groups, only rulesets are allowed
	                    if (enteringConditionalGroup) {
	                        enteringConditionalGroup = false;
	                        insideRule = (indentLevel > nestedLevel);
	                    } else {
	                        // otherwise, declarations are also allowed
	                        insideRule = (indentLevel >= nestedLevel);
	                    }
	                }
	            } else if (ch === '}') {
	                outdent();
	                print["}"](ch);
	                insideRule = false;
	                insidePropertyValue = false;
	                if (nestedLevel) {
	                    nestedLevel--;
	                }
	                if (newline_between_rules && indentLevel === 0) {
	                    print.newLine(true);
	                }
	            } else if (ch === ":") {
	                eatWhitespace();
	                if ((insideRule || enteringConditionalGroup) &&
	                    !(lookBack("&") || foundNestedPseudoClass())) {
	                    // 'property: value' delimiter
	                    // which could be in a conditional group query
	                    insidePropertyValue = true;
	                    output.push(':');
	                    print.singleSpace();
	                } else {
	                    // sass/less parent reference don't use a space
	                    // sass nested pseudo-class don't use a space
	                    if (peek() === ":") {
	                        // pseudo-element
	                        next();
	                        output.push("::");
	                    } else {
	                        // pseudo-class
	                        output.push(':');
	                    }
	                }
	            } else if (ch === '"' || ch === '\'') {
	                print.preserveSingleSpace();
	                output.push(eatString(ch));
	            } else if (ch === ';') {
	                insidePropertyValue = false;
	                output.push(ch);
	                print.newLine();
	            } else if (ch === '(') { // may be a url
	                if (lookBack("url")) {
	                    output.push(ch);
	                    eatWhitespace();
	                    if (next()) {
	                        if (ch !== ')' && ch !== '"' && ch !== '\'') {
	                            output.push(eatString(')'));
	                        } else {
	                            pos--;
	                        }
	                    }
	                } else {
	                    parenLevel++;
	                    print.preserveSingleSpace();
	                    output.push(ch);
	                    eatWhitespace();
	                }
	            } else if (ch === ')') {
	                output.push(ch);
	                parenLevel--;
	            } else if (ch === ',') {
	                output.push(ch);
	                eatWhitespace();
	                if (selectorSeparatorNewline && !insidePropertyValue && parenLevel < 1) {
	                    print.newLine();
	                } else {
	                    print.singleSpace();
	                }
	            } else if (ch === ']') {
	                output.push(ch);
	            } else if (ch === '[') {
	                print.preserveSingleSpace();
	                output.push(ch);
	            } else if (ch === '=') { // no whitespace before or after
	                eatWhitespace()
	                ch = '=';
	                output.push(ch);
	            } else {
	                print.preserveSingleSpace();
	                output.push(ch);
	            }
	        }


	        var sweetCode = '';
	        if (basebaseIndentString) {
	            sweetCode += basebaseIndentString;
	        }

	        sweetCode += output.join('').replace(/[\r\n\t ]+$/, '');

	        // establish end_with_newline
	        if (end_with_newline) {
	            sweetCode += '\n';
	        }

	        if (eol != '\n') {
	            sweetCode = sweetCode.replace(/[\n]/g, eol);
	        }

	        return sweetCode;
	    }

	    // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
	    css_beautify.NESTED_AT_RULE = {
	        "@page": true,
	        "@font-face": true,
	        "@keyframes": true,
	        // also in CONDITIONAL_GROUP_RULE below
	        "@media": true,
	        "@supports": true,
	        "@document": true
	    };
	    css_beautify.CONDITIONAL_GROUP_RULE = {
	        "@media": true,
	        "@supports": true,
	        "@document": true
	    };

	    /*global define */
	    if (true) {
	        // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return {
	                css_beautify: css_beautify
	            };
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        // Add support for CommonJS. Just put this file somewhere on your require.paths
	        // and you will be able to `var html_beautify = require("beautify").html_beautify`.
	        exports.css_beautify = css_beautify;
	    } else if (typeof window !== "undefined") {
	        // If we're running a web page and don't have either of the above, add our one global
	        window.css_beautify = css_beautify;
	    } else if (typeof global !== "undefined") {
	        // If we don't even have window, try global.
	        global.css_beautify = css_beautify;
	    }

	}());


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
	/*

	  The MIT License (MIT)

	  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

	  Permission is hereby granted, free of charge, to any person
	  obtaining a copy of this software and associated documentation files
	  (the "Software"), to deal in the Software without restriction,
	  including without limitation the rights to use, copy, modify, merge,
	  publish, distribute, sublicense, and/or sell copies of the Software,
	  and to permit persons to whom the Software is furnished to do so,
	  subject to the following conditions:

	  The above copyright notice and this permission notice shall be
	  included in all copies or substantial portions of the Software.

	  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
	  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	  SOFTWARE.


	 Style HTML
	---------------

	  Written by Nochum Sossonko, (nsossonko@hotmail.com)

	  Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
	    http://jsbeautifier.org/

	  Usage:
	    style_html(html_source);

	    style_html(html_source, options);

	  The options are:
	    indent_inner_html (default false)  — indent <head> and <body> sections,
	    indent_size (default 4)          — indentation size,
	    indent_char (default space)      — character to indent with,
	    wrap_line_length (default 250)            -  maximum amount of characters per line (0 = disable)
	    brace_style (default "collapse") - "collapse" | "expand" | "end-expand" | "none"
	            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are.
	    unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
	    indent_scripts (default normal)  - "keep"|"separate"|"normal"
	    preserve_newlines (default true) - whether existing line breaks before elements should be preserved
	                                        Only works before elements, not inside tags or for text.
	    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk
	    indent_handlebars (default false) - format and indent {{#foo}} and {{/foo}}
	    end_with_newline (false)          - end with a newline
	    extra_liners (default [head,body,/html]) -List of tags that should have an extra newline before them.

	    e.g.

	    style_html(html_source, {
	      'indent_inner_html': false,
	      'indent_size': 2,
	      'indent_char': ' ',
	      'wrap_line_length': 78,
	      'brace_style': 'expand',
	      'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u'],
	      'preserve_newlines': true,
	      'max_preserve_newlines': 5,
	      'indent_handlebars': false,
	      'extra_liners': ['/html']
	    });
	*/

	(function() {

	    function trim(s) {
	        return s.replace(/^\s+|\s+$/g, '');
	    }

	    function ltrim(s) {
	        return s.replace(/^\s+/g, '');
	    }

	    function rtrim(s) {
	        return s.replace(/\s+$/g,'');
	    }

	    function style_html(html_source, options, js_beautify, css_beautify) {
	        //Wrapper function to invoke all the necessary constructors and deal with the output.

	        var multi_parser,
	            indent_inner_html,
	            indent_size,
	            indent_character,
	            wrap_line_length,
	            brace_style,
	            unformatted,
	            preserve_newlines,
	            max_preserve_newlines,
	            indent_handlebars,
	            wrap_attributes,
	            wrap_attributes_indent_size,
	            end_with_newline,
	            extra_liners,
	            eol;

	        options = options || {};

	        // backwards compatibility to 1.3.4
	        if ((options.wrap_line_length === undefined || parseInt(options.wrap_line_length, 10) === 0) &&
	                (options.max_char !== undefined && parseInt(options.max_char, 10) !== 0)) {
	            options.wrap_line_length = options.max_char;
	        }

	        indent_inner_html = (options.indent_inner_html === undefined) ? false : options.indent_inner_html;
	        indent_size = (options.indent_size === undefined) ? 4 : parseInt(options.indent_size, 10);
	        indent_character = (options.indent_char === undefined) ? ' ' : options.indent_char;
	        brace_style = (options.brace_style === undefined) ? 'collapse' : options.brace_style;
	        wrap_line_length =  parseInt(options.wrap_line_length, 10) === 0 ? 32786 : parseInt(options.wrap_line_length || 250, 10);
	        unformatted = options.unformatted || ['a', 'span', 'img', 'bdo', 'em', 'strong', 'dfn', 'code', 'samp', 'kbd',
	            'var', 'cite', 'abbr', 'acronym', 'q', 'sub', 'sup', 'tt', 'i', 'b', 'big', 'small', 'u', 's', 'strike',
	            'font', 'ins', 'del', 'pre', 'address', 'dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
	        preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
	        max_preserve_newlines = preserve_newlines ?
	            (isNaN(parseInt(options.max_preserve_newlines, 10)) ? 32786 : parseInt(options.max_preserve_newlines, 10))
	            : 0;
	        indent_handlebars = (options.indent_handlebars === undefined) ? false : options.indent_handlebars;
	        wrap_attributes = (options.wrap_attributes === undefined) ? 'auto' : options.wrap_attributes;
	        wrap_attributes_indent_size = (options.wrap_attributes_indent_size === undefined) ? indent_size : parseInt(options.wrap_attributes_indent_size, 10) || indent_size;
	        end_with_newline = (options.end_with_newline === undefined) ? false : options.end_with_newline;
	        extra_liners = (typeof options.extra_liners == 'object') && options.extra_liners ?
	            options.extra_liners.concat() : (typeof options.extra_liners === 'string') ?
	            options.extra_liners.split(',') : 'head,body,/html'.split(',');
	        eol = options.eol ? options.eol : '\n';

	        if(options.indent_with_tabs){
	            indent_character = '\t';
	            indent_size = 1;
	        }

	        eol = eol.replace(/\\r/, '\r').replace(/\\n/, '\n')

	        function Parser() {

	            this.pos = 0; //Parser position
	            this.token = '';
	            this.current_mode = 'CONTENT'; //reflects the current Parser mode: TAG/CONTENT
	            this.tags = { //An object to hold tags, their position, and their parent-tags, initiated with default values
	                parent: 'parent1',
	                parentcount: 1,
	                parent1: ''
	            };
	            this.tag_type = '';
	            this.token_text = this.last_token = this.last_text = this.token_type = '';
	            this.newlines = 0;
	            this.indent_content = indent_inner_html;

	            this.Utils = { //Uilities made available to the various functions
	                whitespace: "\n\r\t ".split(''),
	                single_token: 'br,input,link,meta,source,!doctype,basefont,base,area,hr,wbr,param,img,isindex,embed'.split(','), //all the single tags for HTML
	                extra_liners: extra_liners, //for tags that need a line of whitespace before them
	                in_array: function(what, arr) {
	                    for (var i = 0; i < arr.length; i++) {
	                        if (what === arr[i]) {
	                            return true;
	                        }
	                    }
	                    return false;
	                }
	            };

	            // Return true if the given text is composed entirely of whitespace.
	            this.is_whitespace = function(text) {
	                for (var n = 0; n < text.length; text++) {
	                    if (!this.Utils.in_array(text.charAt(n), this.Utils.whitespace)) {
	                        return false;
	                    }
	                }
	                return true;
	            };

	            this.traverse_whitespace = function() {
	                var input_char = '';

	                input_char = this.input.charAt(this.pos);
	                if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
	                    this.newlines = 0;
	                    while (this.Utils.in_array(input_char, this.Utils.whitespace)) {
	                        if (preserve_newlines && input_char === '\n' && this.newlines <= max_preserve_newlines) {
	                            this.newlines += 1;
	                        }

	                        this.pos++;
	                        input_char = this.input.charAt(this.pos);
	                    }
	                    return true;
	                }
	                return false;
	            };

	            // Append a space to the given content (string array) or, if we are
	            // at the wrap_line_length, append a newline/indentation.
	            this.space_or_wrap = function(content) {
	                if (this.line_char_count >= this.wrap_line_length) { //insert a line when the wrap_line_length is reached
	                    this.print_newline(false, content);
	                    this.print_indentation(content);
	                } else {
	                    this.line_char_count++;
	                    content.push(' ');
	                }
	            };

	            this.get_content = function() { //function to capture regular content between tags
	                var input_char = '',
	                    content = [],
	                    space = false; //if a space is needed

	                while (this.input.charAt(this.pos) !== '<') {
	                    if (this.pos >= this.input.length) {
	                        return content.length ? content.join('') : ['', 'TK_EOF'];
	                    }

	                    if (this.traverse_whitespace()) {
	                        this.space_or_wrap(content);
	                        continue;
	                    }

	                    if (indent_handlebars) {
	                        // Handlebars parsing is complicated.
	                        // {{#foo}} and {{/foo}} are formatted tags.
	                        // {{something}} should get treated as content, except:
	                        // {{else}} specifically behaves like {{#if}} and {{/if}}
	                        var peek3 = this.input.substr(this.pos, 3);
	                        if (peek3 === '{{#' || peek3 === '{{/') {
	                            // These are tags and not content.
	                            break;
	                        } else if (peek3 === '{{!') {
	                            return [this.get_tag(), 'TK_TAG_HANDLEBARS_COMMENT'];
	                        } else if (this.input.substr(this.pos, 2) === '{{') {
	                            if (this.get_tag(true) === '{{else}}') {
	                                break;
	                            }
	                        }
	                    }

	                    input_char = this.input.charAt(this.pos);
	                    this.pos++;
	                    this.line_char_count++;
	                    content.push(input_char); //letter at-a-time (or string) inserted to an array
	                }
	                return content.length ? content.join('') : '';
	            };

	            this.get_contents_to = function(name) { //get the full content of a script or style to pass to js_beautify
	                if (this.pos === this.input.length) {
	                    return ['', 'TK_EOF'];
	                }
	                var input_char = '';
	                var content = '';
	                var reg_match = new RegExp('</' + name + '\\s*>', 'igm');
	                reg_match.lastIndex = this.pos;
	                var reg_array = reg_match.exec(this.input);
	                var end_script = reg_array ? reg_array.index : this.input.length; //absolute end of script
	                if (this.pos < end_script) { //get everything in between the script tags
	                    content = this.input.substring(this.pos, end_script);
	                    this.pos = end_script;
	                }
	                return content;
	            };

	            this.record_tag = function(tag) { //function to record a tag and its parent in this.tags Object
	                if (this.tags[tag + 'count']) { //check for the existence of this tag type
	                    this.tags[tag + 'count']++;
	                    this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
	                } else { //otherwise initialize this tag type
	                    this.tags[tag + 'count'] = 1;
	                    this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
	                }
	                this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
	                this.tags.parent = tag + this.tags[tag + 'count']; //and make this the current parent (i.e. in the case of a div 'div1')
	            };

	            this.retrieve_tag = function(tag) { //function to retrieve the opening tag to the corresponding closer
	                if (this.tags[tag + 'count']) { //if the openener is not in the Object we ignore it
	                    var temp_parent = this.tags.parent; //check to see if it's a closable tag.
	                    while (temp_parent) { //till we reach '' (the initial value);
	                        if (tag + this.tags[tag + 'count'] === temp_parent) { //if this is it use it
	                            break;
	                        }
	                        temp_parent = this.tags[temp_parent + 'parent']; //otherwise keep on climbing up the DOM Tree
	                    }
	                    if (temp_parent) { //if we caught something
	                        this.indent_level = this.tags[tag + this.tags[tag + 'count']]; //set the indent_level accordingly
	                        this.tags.parent = this.tags[temp_parent + 'parent']; //and set the current parent
	                    }
	                    delete this.tags[tag + this.tags[tag + 'count'] + 'parent']; //delete the closed tags parent reference...
	                    delete this.tags[tag + this.tags[tag + 'count']]; //...and the tag itself
	                    if (this.tags[tag + 'count'] === 1) {
	                        delete this.tags[tag + 'count'];
	                    } else {
	                        this.tags[tag + 'count']--;
	                    }
	                }
	            };

	            this.indent_to_tag = function(tag) {
	                // Match the indentation level to the last use of this tag, but don't remove it.
	                if (!this.tags[tag + 'count']) {
	                    return;
	                }
	                var temp_parent = this.tags.parent;
	                while (temp_parent) {
	                    if (tag + this.tags[tag + 'count'] === temp_parent) {
	                        break;
	                    }
	                    temp_parent = this.tags[temp_parent + 'parent'];
	                }
	                if (temp_parent) {
	                    this.indent_level = this.tags[tag + this.tags[tag + 'count']];
	                }
	            };

	            this.get_tag = function(peek) { //function to get a full tag and parse its type
	                var input_char = '',
	                    content = [],
	                    comment = '',
	                    space = false,
	                    first_attr = true,
	                    tag_start, tag_end,
	                    tag_start_char,
	                    orig_pos = this.pos,
	                    orig_line_char_count = this.line_char_count;

	                peek = peek !== undefined ? peek : false;

	                do {
	                    if (this.pos >= this.input.length) {
	                        if (peek) {
	                            this.pos = orig_pos;
	                            this.line_char_count = orig_line_char_count;
	                        }
	                        return content.length ? content.join('') : ['', 'TK_EOF'];
	                    }

	                    input_char = this.input.charAt(this.pos);
	                    this.pos++;

	                    if (this.Utils.in_array(input_char, this.Utils.whitespace)) { //don't want to insert unnecessary space
	                        space = true;
	                        continue;
	                    }

	                    if (input_char === "'" || input_char === '"') {
	                        input_char += this.get_unformatted(input_char);
	                        space = true;

	                    }

	                    if (input_char === '=') { //no space before =
	                        space = false;
	                    }

	                    if (content.length && content[content.length - 1] !== '=' && input_char !== '>' && space) {
	                        //no space after = or before >
	                        this.space_or_wrap(content);
	                        space = false;
	                        if (!first_attr && wrap_attributes === 'force' &&  input_char !== '/') {
	                            this.print_newline(true, content);
	                            this.print_indentation(content);
	                            for (var count = 0; count < wrap_attributes_indent_size; count++) {
	                                content.push(indent_character);
	                            }
	                        }
	                        for (var i = 0; i < content.length; i++) {
	                          if (content[i] === ' ') {
	                            first_attr = false;
	                            break;
	                          }
	                        }
	                    }

	                    if (indent_handlebars && tag_start_char === '<') {
	                        // When inside an angle-bracket tag, put spaces around
	                        // handlebars not inside of strings.
	                        if ((input_char + this.input.charAt(this.pos)) === '{{') {
	                            input_char += this.get_unformatted('}}');
	                            if (content.length && content[content.length - 1] !== ' ' && content[content.length - 1] !== '<') {
	                                input_char = ' ' + input_char;
	                            }
	                            space = true;
	                        }
	                    }

	                    if (input_char === '<' && !tag_start_char) {
	                        tag_start = this.pos - 1;
	                        tag_start_char = '<';
	                    }

	                    if (indent_handlebars && !tag_start_char) {
	                        if (content.length >= 2 && content[content.length - 1] === '{' && content[content.length - 2] === '{') {
	                            if (input_char === '#' || input_char === '/' || input_char === '!') {
	                                tag_start = this.pos - 3;
	                            } else {
	                                tag_start = this.pos - 2;
	                            }
	                            tag_start_char = '{';
	                        }
	                    }

	                    this.line_char_count++;
	                    content.push(input_char); //inserts character at-a-time (or string)

	                    if (content[1] && (content[1] === '!' || content[1] === '?' || content[1] === '%')) { //if we're in a comment, do something special
	                        // We treat all comments as literals, even more than preformatted tags
	                        // we just look for the appropriate close tag
	                        content = [this.get_comment(tag_start)];
	                        break;
	                    }

	                    if (indent_handlebars && content[1] && content[1] === '{' && content[2] && content[2] === '!') { //if we're in a comment, do something special
	                        // We treat all comments as literals, even more than preformatted tags
	                        // we just look for the appropriate close tag
	                        content = [this.get_comment(tag_start)];
	                        break;
	                    }

	                    if (indent_handlebars && tag_start_char === '{' && content.length > 2 && content[content.length - 2] === '}' && content[content.length - 1] === '}') {
	                        break;
	                    }
	                } while (input_char !== '>');

	                var tag_complete = content.join('');
	                var tag_index;
	                var tag_offset;

	                if (tag_complete.indexOf(' ') !== -1) { //if there's whitespace, thats where the tag name ends
	                    tag_index = tag_complete.indexOf(' ');
	                } else if (tag_complete.charAt(0) === '{') {
	                    tag_index = tag_complete.indexOf('}');
	                } else { //otherwise go with the tag ending
	                    tag_index = tag_complete.indexOf('>');
	                }
	                if (tag_complete.charAt(0) === '<' || !indent_handlebars) {
	                    tag_offset = 1;
	                } else {
	                    tag_offset = tag_complete.charAt(2) === '#' ? 3 : 2;
	                }
	                var tag_check = tag_complete.substring(tag_offset, tag_index).toLowerCase();
	                if (tag_complete.charAt(tag_complete.length - 2) === '/' ||
	                    this.Utils.in_array(tag_check, this.Utils.single_token)) { //if this tag name is a single tag type (either in the list or has a closing /)
	                    if (!peek) {
	                        this.tag_type = 'SINGLE';
	                    }
	                } else if (indent_handlebars && tag_complete.charAt(0) === '{' && tag_check === 'else') {
	                    if (!peek) {
	                        this.indent_to_tag('if');
	                        this.tag_type = 'HANDLEBARS_ELSE';
	                        this.indent_content = true;
	                        this.traverse_whitespace();
	                    }
	                } else if (this.is_unformatted(tag_check, unformatted)) { // do not reformat the "unformatted" tags
	                    comment = this.get_unformatted('</' + tag_check + '>', tag_complete); //...delegate to get_unformatted function
	                    content.push(comment);
	                    tag_end = this.pos - 1;
	                    this.tag_type = 'SINGLE';
	                } else if (tag_check === 'script' &&
	                    (tag_complete.search('type') === -1 ||
	                    (tag_complete.search('type') > -1 &&
	                    tag_complete.search(/\b(text|application)\/(x-)?(javascript|ecmascript|jscript|livescript)/) > -1))) {
	                    if (!peek) {
	                        this.record_tag(tag_check);
	                        this.tag_type = 'SCRIPT';
	                    }
	                } else if (tag_check === 'style' &&
	                    (tag_complete.search('type') === -1 ||
	                    (tag_complete.search('type') > -1 && tag_complete.search('text/css') > -1))) {
	                    if (!peek) {
	                        this.record_tag(tag_check);
	                        this.tag_type = 'STYLE';
	                    }
	                } else if (tag_check.charAt(0) === '!') { //peek for <! comment
	                    // for comments content is already correct.
	                    if (!peek) {
	                        this.tag_type = 'SINGLE';
	                        this.traverse_whitespace();
	                    }
	                } else if (!peek) {
	                    if (tag_check.charAt(0) === '/') { //this tag is a double tag so check for tag-ending
	                        this.retrieve_tag(tag_check.substring(1)); //remove it and all ancestors
	                        this.tag_type = 'END';
	                    } else { //otherwise it's a start-tag
	                        this.record_tag(tag_check); //push it on the tag stack
	                        if (tag_check.toLowerCase() !== 'html') {
	                            this.indent_content = true;
	                        }
	                        this.tag_type = 'START';
	                    }

	                    // Allow preserving of newlines after a start or end tag
	                    if (this.traverse_whitespace()) {
	                        this.space_or_wrap(content);
	                    }

	                    if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) { //check if this double needs an extra line
	                        this.print_newline(false, this.output);
	                        if (this.output.length && this.output[this.output.length - 2] !== '\n') {
	                            this.print_newline(true, this.output);
	                        }
	                    }
	                }

	                if (peek) {
	                    this.pos = orig_pos;
	                    this.line_char_count = orig_line_char_count;
	                }

	                return content.join(''); //returns fully formatted tag
	            };

	            this.get_comment = function(start_pos) { //function to return comment content in its entirety
	                // this is will have very poor perf, but will work for now.
	                var comment = '',
	                    delimiter = '>',
	                    matched = false;

	                this.pos = start_pos;
	                input_char = this.input.charAt(this.pos);
	                this.pos++;

	                while (this.pos <= this.input.length) {
	                    comment += input_char;

	                    // only need to check for the delimiter if the last chars match
	                    if (comment.charAt(comment.length - 1) === delimiter.charAt(delimiter.length - 1) &&
	                        comment.indexOf(delimiter) !== -1) {
	                        break;
	                    }

	                    // only need to search for custom delimiter for the first few characters
	                    if (!matched && comment.length < 10) {
	                        if (comment.indexOf('<![if') === 0) { //peek for <![if conditional comment
	                            delimiter = '<![endif]>';
	                            matched = true;
	                        } else if (comment.indexOf('<![cdata[') === 0) { //if it's a <[cdata[ comment...
	                            delimiter = ']]>';
	                            matched = true;
	                        } else if (comment.indexOf('<![') === 0) { // some other ![ comment? ...
	                            delimiter = ']>';
	                            matched = true;
	                        } else if (comment.indexOf('<!--') === 0) { // <!-- comment ...
	                            delimiter = '-->';
	                            matched = true;
	                        } else if (comment.indexOf('{{!') === 0) { // {{! handlebars comment
	                            delimiter = '}}';
	                            matched = true;
	                        } else if (comment.indexOf('<?') === 0) { // {{! handlebars comment
	                            delimiter = '?>';
	                            matched = true;
	                        } else if (comment.indexOf('<%') === 0) { // {{! handlebars comment
	                            delimiter = '%>';
	                            matched = true;
	                        }
	                    }

	                    input_char = this.input.charAt(this.pos);
	                    this.pos++;
	                }

	                return comment;
	            };

	            this.get_unformatted = function(delimiter, orig_tag) { //function to return unformatted content in its entirety

	                if (orig_tag && orig_tag.toLowerCase().indexOf(delimiter) !== -1) {
	                    return '';
	                }
	                var input_char = '';
	                var content = '';
	                var min_index = 0;
	                var space = true;
	                do {

	                    if (this.pos >= this.input.length) {
	                        return content;
	                    }

	                    input_char = this.input.charAt(this.pos);
	                    this.pos++;

	                    if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
	                        if (!space) {
	                            this.line_char_count--;
	                            continue;
	                        }
	                        if (input_char === '\n' || input_char === '\r') {
	                            content += '\n';
	                            /*  Don't change tab indention for unformatted blocks.  If using code for html editing, this will greatly affect <pre> tags if they are specified in the 'unformatted array'
	                for (var i=0; i<this.indent_level; i++) {
	                  content += this.indent_string;
	                }
	                space = false; //...and make sure other indentation is erased
	                */
	                            this.line_char_count = 0;
	                            continue;
	                        }
	                    }
	                    content += input_char;
	                    this.line_char_count++;
	                    space = true;

	                    if (indent_handlebars && input_char === '{' && content.length && content.charAt(content.length - 2) === '{') {
	                        // Handlebars expressions in strings should also be unformatted.
	                        content += this.get_unformatted('}}');
	                        // These expressions are opaque.  Ignore delimiters found in them.
	                        min_index = content.length;
	                    }
	                } while (content.toLowerCase().indexOf(delimiter, min_index) === -1);
	                return content;
	            };

	            this.get_token = function() { //initial handler for token-retrieval
	                var token;

	                if (this.last_token === 'TK_TAG_SCRIPT' || this.last_token === 'TK_TAG_STYLE') { //check if we need to format javascript
	                    var type = this.last_token.substr(7);
	                    token = this.get_contents_to(type);
	                    if (typeof token !== 'string') {
	                        return token;
	                    }
	                    return [token, 'TK_' + type];
	                }
	                if (this.current_mode === 'CONTENT') {
	                    token = this.get_content();
	                    if (typeof token !== 'string') {
	                        return token;
	                    } else {
	                        return [token, 'TK_CONTENT'];
	                    }
	                }

	                if (this.current_mode === 'TAG') {
	                    token = this.get_tag();
	                    if (typeof token !== 'string') {
	                        return token;
	                    } else {
	                        var tag_name_type = 'TK_TAG_' + this.tag_type;
	                        return [token, tag_name_type];
	                    }
	                }
	            };

	            this.get_full_indent = function(level) {
	                level = this.indent_level + level || 0;
	                if (level < 1) {
	                    return '';
	                }

	                return Array(level + 1).join(this.indent_string);
	            };

	            this.is_unformatted = function(tag_check, unformatted) {
	                //is this an HTML5 block-level link?
	                if (!this.Utils.in_array(tag_check, unformatted)) {
	                    return false;
	                }

	                if (tag_check.toLowerCase() !== 'a' || !this.Utils.in_array('a', unformatted)) {
	                    return true;
	                }

	                //at this point we have an  tag; is its first child something we want to remain
	                //unformatted?
	                var next_tag = this.get_tag(true /* peek. */ );

	                // test next_tag to see if it is just html tag (no external content)
	                var tag = (next_tag || "").match(/^\s*<\s*\/?([a-z]*)\s*[^>]*>\s*$/);

	                // if next_tag comes back but is not an isolated tag, then
	                // let's treat the 'a' tag as having content
	                // and respect the unformatted option
	                if (!tag || this.Utils.in_array(tag, unformatted)) {
	                    return true;
	                } else {
	                    return false;
	                }
	            };

	            this.printer = function(js_source, indent_character, indent_size, wrap_line_length, brace_style) { //handles input/output and some other printing functions

	                this.input = js_source || ''; //gets the input for the Parser

	                // HACK: newline parsing inconsistent. This brute force normalizes the input.
	                this.input = this.input.replace(/\r\n|[\r\u2028\u2029]/g, '\n')

	                this.output = [];
	                this.indent_character = indent_character;
	                this.indent_string = '';
	                this.indent_size = indent_size;
	                this.brace_style = brace_style;
	                this.indent_level = 0;
	                this.wrap_line_length = wrap_line_length;
	                this.line_char_count = 0; //count to see if wrap_line_length was exceeded

	                for (var i = 0; i < this.indent_size; i++) {
	                    this.indent_string += this.indent_character;
	                }

	                this.print_newline = function(force, arr) {
	                    this.line_char_count = 0;
	                    if (!arr || !arr.length) {
	                        return;
	                    }
	                    if (force || (arr[arr.length - 1] !== '\n')) { //we might want the extra line
	                        if ((arr[arr.length - 1] !== '\n')) {
	                            arr[arr.length - 1] = rtrim(arr[arr.length - 1]);
	                        }
	                        arr.push('\n');
	                    }
	                };

	                this.print_indentation = function(arr) {
	                    for (var i = 0; i < this.indent_level; i++) {
	                        arr.push(this.indent_string);
	                        this.line_char_count += this.indent_string.length;
	                    }
	                };

	                this.print_token = function(text) {
	                    // Avoid printing initial whitespace.
	                    if (this.is_whitespace(text) && !this.output.length) {
	                        return;
	                    }
	                    if (text || text !== '') {
	                        if (this.output.length && this.output[this.output.length - 1] === '\n') {
	                            this.print_indentation(this.output);
	                            text = ltrim(text);
	                        }
	                    }
	                    this.print_token_raw(text);
	                };

	                this.print_token_raw = function(text) {
	                    // If we are going to print newlines, truncate trailing
	                    // whitespace, as the newlines will represent the space.
	                    if (this.newlines > 0) {
	                        text = rtrim(text);
	                    }

	                    if (text && text !== '') {
	                        if (text.length > 1 && text.charAt(text.length - 1) === '\n') {
	                            // unformatted tags can grab newlines as their last character
	                            this.output.push(text.slice(0, -1));
	                            this.print_newline(false, this.output);
	                        } else {
	                            this.output.push(text);
	                        }
	                    }

	                    for (var n = 0; n < this.newlines; n++) {
	                        this.print_newline(n > 0, this.output);
	                    }
	                    this.newlines = 0;
	                };

	                this.indent = function() {
	                    this.indent_level++;
	                };

	                this.unindent = function() {
	                    if (this.indent_level > 0) {
	                        this.indent_level--;
	                    }
	                };
	            };
	            return this;
	        }

	        /*_____________________--------------------_____________________*/

	        multi_parser = new Parser(); //wrapping functions Parser
	        multi_parser.printer(html_source, indent_character, indent_size, wrap_line_length, brace_style); //initialize starting values

	        while (true) {
	            var t = multi_parser.get_token();
	            multi_parser.token_text = t[0];
	            multi_parser.token_type = t[1];

	            if (multi_parser.token_type === 'TK_EOF') {
	                break;
	            }

	            switch (multi_parser.token_type) {
	                case 'TK_TAG_START':
	                    multi_parser.print_newline(false, multi_parser.output);
	                    multi_parser.print_token(multi_parser.token_text);
	                    if (multi_parser.indent_content) {
	                        multi_parser.indent();
	                        multi_parser.indent_content = false;
	                    }
	                    multi_parser.current_mode = 'CONTENT';
	                    break;
	                case 'TK_TAG_STYLE':
	                case 'TK_TAG_SCRIPT':
	                    multi_parser.print_newline(false, multi_parser.output);
	                    multi_parser.print_token(multi_parser.token_text);
	                    multi_parser.current_mode = 'CONTENT';
	                    break;
	                case 'TK_TAG_END':
	                    //Print new line only if the tag has no content and has child
	                    if (multi_parser.last_token === 'TK_CONTENT' && multi_parser.last_text === '') {
	                        var tag_name = multi_parser.token_text.match(/\w+/)[0];
	                        var tag_extracted_from_last_output = null;
	                        if (multi_parser.output.length) {
	                            tag_extracted_from_last_output = multi_parser.output[multi_parser.output.length - 1].match(/(?:<|{{#)\s*(\w+)/);
	                        }
	                        if (tag_extracted_from_last_output === null ||
	                            (tag_extracted_from_last_output[1] !== tag_name && !multi_parser.Utils.in_array(tag_extracted_from_last_output[1], unformatted))) {
	                            multi_parser.print_newline(false, multi_parser.output);
	                        }
	                    }
	                    multi_parser.print_token(multi_parser.token_text);
	                    multi_parser.current_mode = 'CONTENT';
	                    break;
	                case 'TK_TAG_SINGLE':
	                    // Don't add a newline before elements that should remain unformatted.
	                    var tag_check = multi_parser.token_text.match(/^\s*<([a-z-]+)/i);
	                    if (!tag_check || !multi_parser.Utils.in_array(tag_check[1], unformatted)) {
	                        multi_parser.print_newline(false, multi_parser.output);
	                    }
	                    multi_parser.print_token(multi_parser.token_text);
	                    multi_parser.current_mode = 'CONTENT';
	                    break;
	                case 'TK_TAG_HANDLEBARS_ELSE':
	                    multi_parser.print_token(multi_parser.token_text);
	                    if (multi_parser.indent_content) {
	                        multi_parser.indent();
	                        multi_parser.indent_content = false;
	                    }
	                    multi_parser.current_mode = 'CONTENT';
	                    break;
	                case 'TK_TAG_HANDLEBARS_COMMENT':
	                    multi_parser.print_token(multi_parser.token_text);
	                    multi_parser.current_mode = 'TAG';
	                    break;
	                case 'TK_CONTENT':
	                    multi_parser.print_token(multi_parser.token_text);
	                    multi_parser.current_mode = 'TAG';
	                    break;
	                case 'TK_STYLE':
	                case 'TK_SCRIPT':
	                    if (multi_parser.token_text !== '') {
	                        multi_parser.print_newline(false, multi_parser.output);
	                        var text = multi_parser.token_text,
	                            _beautifier,
	                            script_indent_level = 1;
	                        if (multi_parser.token_type === 'TK_SCRIPT') {
	                            _beautifier = typeof js_beautify === 'function' && js_beautify;
	                        } else if (multi_parser.token_type === 'TK_STYLE') {
	                            _beautifier = typeof css_beautify === 'function' && css_beautify;
	                        }

	                        if (options.indent_scripts === "keep") {
	                            script_indent_level = 0;
	                        } else if (options.indent_scripts === "separate") {
	                            script_indent_level = -multi_parser.indent_level;
	                        }

	                        var indentation = multi_parser.get_full_indent(script_indent_level);
	                        if (_beautifier) {

	                            // call the Beautifier if avaliable
	                            var Child_options = function() {
	                                this.eol = '\n';
	                            };
	                            Child_options.prototype = options;
	                            var child_options = new Child_options();
	                            text = _beautifier(text.replace(/^\s*/, indentation), child_options);
	                        } else {
	                            // simply indent the string otherwise
	                            var white = text.match(/^\s*/)[0];
	                            var _level = white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length - 1;
	                            var reindent = multi_parser.get_full_indent(script_indent_level - _level);
	                            text = text.replace(/^\s*/, indentation)
	                                .replace(/\r\n|\r|\n/g, '\n' + reindent)
	                                .replace(/\s+$/, '');
	                        }
	                        if (text) {
	                            multi_parser.print_token_raw(text);
	                            multi_parser.print_newline(true, multi_parser.output);
	                        }
	                    }
	                    multi_parser.current_mode = 'TAG';
	                    break;
	                default:
	                    // We should not be getting here but we don't want to drop input on the floor
	                    // Just output the text and move on
	                    if (multi_parser.token_text !== '') {
	                        multi_parser.print_token(multi_parser.token_text);
	                    }
	                    break;
	            }
	            multi_parser.last_token = multi_parser.token_type;
	            multi_parser.last_text = multi_parser.token_text;
	        }
	        var sweet_code = multi_parser.output.join('').replace(/[\r\n\t ]+$/, '');

	        // establish end_with_newline
	        if (end_with_newline) {
	            sweet_code += '\n';
	        }

	        if (eol != '\n') {
	            sweet_code = sweet_code.replace(/[\n]/g, eol);
	        }

	        return sweet_code;
	    }

	    if (true) {
	        // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, __webpack_require__(22), __webpack_require__(23)], __WEBPACK_AMD_DEFINE_RESULT__ = function(requireamd) {
	            var js_beautify =  __webpack_require__(22);
	            var css_beautify =  __webpack_require__(23);

	            return {
	              html_beautify: function(html_source, options) {
	                return style_html(html_source, options, js_beautify.js_beautify, css_beautify.css_beautify);
	              }
	            };
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== "undefined") {
	        // Add support for CommonJS. Just put this file somewhere on your require.paths
	        // and you will be able to `var html_beautify = require("beautify").html_beautify`.
	        var js_beautify = require('./beautify.js');
	        var css_beautify = require('./beautify-css.js');

	        exports.html_beautify = function(html_source, options) {
	            return style_html(html_source, options, js_beautify.js_beautify, css_beautify.css_beautify);
	        };
	    } else if (typeof window !== "undefined") {
	        // If we're running a web page and don't have either of the above, add our one global
	        window.html_beautify = function(html_source, options) {
	            return style_html(html_source, options, window.js_beautify, window.css_beautify);
	        };
	    } else if (typeof global !== "undefined") {
	        // If we don't even have window, try global.
	        global.html_beautify = function(html_source, options) {
	            return style_html(html_source, options, global.js_beautify, global.css_beautify);
	        };
	    }

	}());


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(26);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "ffp-header {\n  position: absolute;\n  top:   0;\n  left:  0;\n  right: 0;\n  width: 100%;\n  height: 40px;\n  margin: 0;\n  padding: 5px 10px;\n}\n\n", ""]);

	// exports


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(28);

	__webpack_require__(35);

	__webpack_require__(40);

	var _style = __webpack_require__(44);

	var _style2 = _interopRequireDefault(_style);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	riot.tag2('ffp-body', '<ffp-result></ffp-result> <ffp-code-pretty></ffp-code-pretty> <ffp-loading></ffp-loading>', '{ css }', '', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var _store = __webpack_require__(29);

	var _store2 = _interopRequireDefault(_store);

	var _style = __webpack_require__(33);

	var _style2 = _interopRequireDefault(_style);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	riot.tag2('ffp-result', '<dl show="{this.url}"> <dt class="label">URL</dt> <dd class="data type-url">{url}</dd> <dt class="label">行番号</dt> <dd class="data">{position_y}</dd> <dt class="label">文字番号</dt> <dd class="data">{position_x}</dd> </dl>', '{ css }', '', function (opts) {
	  this.onFindStart = (function (state) {
	    this.update(state);
	  }).bind(this);

	  this.on('mount', function () {
	    _store2.default.addFindStartListener(this.onFindStart);
	  });
	  this.on('unmount', function () {
	    _store2.default.removeFindStartListener(this.onFindStart);
	  });
	}, '{ }');
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _findStart = __webpack_require__(30);

	var _findStart2 = _interopRequireDefault(_findStart);

	var _storeFactory = __webpack_require__(32);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = (0, _storeFactory.createStore)({
	  listeners: [{ name: 'findStart', resolver: _findStart2.default }]
	});

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _resolverFactory = __webpack_require__(31);

	var _actionTypes = __webpack_require__(15);

	var _actionTypes2 = _interopRequireDefault(_actionTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = (0, _resolverFactory.createResolver)(function (action, state) {
	  switch (action.type) {
	    case _actionTypes2.default.FIND_START:
	      return Object.assign({}, state, {
	        target: action.target,
	        url: action.url,
	        position_x: action.position_x,
	        position_y: action.position_y,
	        position_y_beautify: action.position_y_beautify
	      });
	      break;
	  }
	});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Resolver = undefined;
	exports.createResolver = createResolver;

	var _dispatcher = __webpack_require__(10);

	var _dispatcher2 = _interopRequireDefault(_dispatcher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Resolver = exports.Resolver = (function () {
	  function Resolver(handler) {
	    _classCallCheck(this, Resolver);

	    this.__handler = handler;
	    this.__dispatcher = _dispatcher2.default;
	    this.__token = this.__dispatcher.register(this.handle.bind(this));
	    this.__listeners = [];
	  }

	  _createClass(Resolver, [{
	    key: 'subscribe',
	    value: function subscribe(fn) {
	      this.__listeners.push(fn);
	    }
	  }, {
	    key: 'unsubscribe',
	    value: function unsubscribe(fn) {
	      var _this = this;

	      this.__listeners.some(function (listener, index) {
	        if (listener === fn) _this.__listeners.splice(index, 1);
	      });
	    }
	  }, {
	    key: 'update',
	    value: function update(state) {
	      this.state = state;

	      for (var i = 0; i < this.__listeners.length; i++) {
	        this.__listeners[i].call(null, this.state);
	      }
	    }
	  }, {
	    key: 'handle',
	    value: function handle(payload) {
	      var state = this.__handler.call(this, payload.action, this.state);
	      if (state && state !== this.state) {
	        this.update(state);
	      }
	    }
	  }]);

	  return Resolver;
	})();

	function createResolver(handler) {
	  return new Resolver(handler);
	}

/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createStore = createStore;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Store = function Store() {
	  _classCallCheck(this, Store);
	};

	function createStore(stuff) {
	  var store = Object.assign(new Store(), stuff);
	  stuff.listeners.some(function (listener) {
	    var name = listener.name;
	    var method_name_base = name.replace(/^[a-z]{1}/, function (fragment) {
	      return fragment.toUpperCase();
	    });
	    var method_name_add = "add" + method_name_base + "Listener";
	    var method_name_remove = "remove" + method_name_base + "Listener";
	    store[method_name_add] = function (fn) {
	      listener.resolver.subscribe(fn);
	    };
	    store[method_name_remove] = function (fn) {
	      listener.resolver.unsubscribe(fn);
	    };
	  });
	  return store;
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(34);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "ffp-result {\n  display: block;\n  margin: 0;\n  height: 35px;\n  padding: 5px 0;\n}\nffp-result > dl {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-pack: justify;\n  -webkit-justify-content: space-between;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n}\nffp-result > dl .label {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 80px;\n      -ms-flex: 0 0 80px;\n          flex: 0 0 80px;\n  padding: 2px 5px;\n  text-align: center;\n  border: 1px solid #2e6da4;\n  border-radius: 3px;\n  background: #337ab7;\n  color: #fff;\n}\nffp-result > dl .data {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 80px;\n      -ms-flex: 0 0 80px;\n          flex: 0 0 80px;\n  padding: 3px 5px;\n}\nffp-result > dl .data.type-url {\n  -webkit-box-flex: 1;\n  -webkit-flex: 1 1 120px;\n      -ms-flex: 1 1 120px;\n          flex: 1 1 120px;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n", ""]);

	// exports


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var _store = __webpack_require__(36);

	var _store2 = _interopRequireDefault(_store);

	var _style = __webpack_require__(38);

	var _style2 = _interopRequireDefault(_style);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	riot.tag2('ffp-code-pretty', '<pre> <code> <ol> <li each="{line in body_beautify.split(/\\r?\\n/)}" class="{\'is-highlight\': line.match(/FFP_TARGET/)}" riot-style="line-height: {line_height}; font-size: {font_size}px;">{line}</li> </ol> </code> </pre>', '{ css }', '', function (opts) {
	  this.font_size = 13;
	  this.line_height = 1.5;
	  this.height = this.root.clientHeight;
	  this.scroller = null;

	  this.onFind = (function (state) {
	    this.update(state);
	  }).bind(this);

	  this.on('mount', function () {
	    this.height = this.root.clientHeight;
	    _store2.default.addFindListener(this.onFind);
	  });

	  this.on('unmount', function () {
	    _store2.default.removeFindListener(this.onFind);
	  });

	  this.on('update', function () {
	    var _this = this;

	    if (this.body_beautify) {
	      if (!this.scroller) this.scroller = this.root.getElementsByTagName('pre')[0];
	      setTimeout(function () {
	        _this.scroller.scrollTop = Math.floor(_this.font_size * _this.line_height) * (_this.position_y_beautify - 1) - _this.height / 2;
	      }, 1);
	    }
	  });
	}, '{ }');
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _find = __webpack_require__(37);

	var _find2 = _interopRequireDefault(_find);

	var _storeFactory = __webpack_require__(32);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = (0, _storeFactory.createStore)({
	  listeners: [{ name: 'find', resolver: _find2.default }]
	});

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _resolverFactory = __webpack_require__(31);

	var _actionTypes = __webpack_require__(15);

	var _actionTypes2 = _interopRequireDefault(_actionTypes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = (0, _resolverFactory.createResolver)(function (action, state) {
	  switch (action.type) {
	    case _actionTypes2.default.FIND:
	      return Object.assign({}, state, {
	        url: action.url,
	        body: action.body,
	        body_beautify: action.body_beautify,
	        position_x: action.position_x,
	        position_y: action.position_y,
	        position_y_beautify: action.position_y_beautify
	      });
	      break;
	  }
	});

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(39);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "ffp-code-pretty {\n  display: block;\n  position: absolute;\n  top:    45px;\n  left:   0;\n  bottom: 0;\n  right:  0;\n  margin: 0;\n  width:  100%;\n  margin: 0;\n  border-top: 1px solid #ccc;\n  background: #f5f5f5;\n}\nffp-code-pretty pre {\n  display: block;\n  overflow: scroll;\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  margin: 0;\n  padding: 10px;\n}\nffp-code-pretty ol {\n  list-style: none;\n}\nffp-code-pretty ol li {\n  color: #333;\n  counter-increment: line;\n  letter-spacing: 1px;\n}\nffp-code-pretty ol li:before {\n  content: counter( line ) '.';\n  display: inline-block;\n  width: 50px;\n  text-align: right;\n  color: #afafaf;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\nffp-code-pretty .is-highlight {\n  background: #f8eec7;\n}\n\n", ""]);

	// exports


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var _store = __webpack_require__(41);

	var _store2 = _interopRequireDefault(_store);

	var _style = __webpack_require__(42);

	var _style2 = _interopRequireDefault(_style);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	riot.tag2('ffp-loading', '<div class="loading" show="{loading_fg}"> <p>now loading ...</p> </div>', '{ css }', '', function (opts) {
	  this.loading_fg = false;

	  this.onFindStart = (function () {
	    this.update({ loading_fg: true });
	  }).bind(this);

	  this.onFindEnd = (function () {
	    this.update({ loading_fg: false });
	  }).bind(this);

	  this.on('mount', function () {
	    _store2.default.addFindStartListener(this.onFindStart);
	    _store2.default.addFindListener(this.onFindEnd);
	  });
	  this.on('unmount', function () {
	    _store2.default.removeFindStartListener(this.onFindStart);
	    _store2.default.removeFindListener(this.onFindEnd);
	  });
	}, '{ }');
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _findStart = __webpack_require__(30);

	var _findStart2 = _interopRequireDefault(_findStart);

	var _find = __webpack_require__(37);

	var _find2 = _interopRequireDefault(_find);

	var _storeFactory = __webpack_require__(32);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = (0, _storeFactory.createStore)({
	  listeners: [{ name: 'findStart', resolver: _findStart2.default }, { name: 'find', resolver: _find2.default }]
	});

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(43);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "ffp-loading .loading {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    margin: 0;\n    background: rgba(0, 0, 0, .3);\n}\nffp-loading .loading > p {\n    position: absolute;\n    top: 50%;\n    margin: auto;\n    width: 100%;\n    text-align: center;\n    font-size: 22px;\n    font-weight: bold;\n    color: #fff;\n}\n", ""]);

	// exports


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(45);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "ffp-body {\n  position: absolute;\n  top:    40px;\n  bottom: 0;\n  left:   0;\n  right:  0;\n  margin: 0;\n  padding: 10px;\n}\n", ""]);

	// exports


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(47);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/postcss-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "* {\n  box-sizing: border-box;\n  margin:  0;\n  padding: 0;\n  line-height: 1;\n  font-size: 14px;\n  font-family: \"\\30D2\\30E9\\30AE\\30CE\\89D2\\30B4   Pro W3\",\n               \"Hiragino Kaku Gothic Pro\",\n               \"\\30E1\\30A4\\30EA\\30AA\",\n               Meiryo,\n               sans-serif;\n  color: #666;\n}\n\nffp {\n}\n", ""]);

	// exports


/***/ }
/******/ ]);