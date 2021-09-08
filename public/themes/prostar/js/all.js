/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1||b[0]>3)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){if(a(b.target).is(this))return b.handleObj.handler.apply(this,arguments)}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.7",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a("#"===f?[]:f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.7",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c).prop(c,!0)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c).prop(c,!1))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")?(c.prop("checked")&&(a=!1),b.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==c.prop("type")&&(c.prop("checked")!==this.$element.hasClass("active")&&(a=!1),this.$element.toggleClass("active")),c.prop("checked",this.$element.hasClass("active")),a&&c.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target).closest(".btn");b.call(d,"toggle"),a(c.target).is('input[type="radio"], input[type="checkbox"]')||(c.preventDefault(),d.is("input,button")?d.trigger("focus"):d.find("input:visible,button:visible").first().trigger("focus"))}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.7",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));if(!(a>this.$items.length-1||a<0))return this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){if(!this.sliding)return this.slide("next")},c.prototype.prev=function(){if(!this.sliding)return this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.7",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function c(c){c&&3===c.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=b(d),f={relatedTarget:this};e.hasClass("open")&&(c&&"click"==c.type&&/input|textarea/i.test(c.target.tagName)&&a.contains(e[0],c.target)||(e.trigger(c=a.Event("hide.bs.dropdown",f)),c.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger(a.Event("hidden.bs.dropdown",f)))))}))}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.7",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=b(e),g=f.hasClass("open");if(c(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",c);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger(a.Event("shown.bs.dropdown",h))}return!1}},g.prototype.keydown=function(c){if(/(38|40|27|32)/.test(c.which)&&!/input|textarea/i.test(c.target.tagName)){var d=a(this);if(c.preventDefault(),c.stopPropagation(),!d.is(".disabled, :disabled")){var e=b(d),g=e.hasClass("open");if(!g&&27!=c.which||g&&27==c.which)return 27==c.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find(".dropdown-menu"+h);if(i.length){var j=i.index(c.target);38==c.which&&j>0&&j--,40==c.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",c).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.7",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in"),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){document===a.target||this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+e).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;!e&&/destroy|hide/.test(b)||(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",a,b)};c.VERSION="3.3.7",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(a.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusin"==b.type?"focus":"hover"]=!0),c.tip().hasClass("in")||"in"==c.hoverState?void(c.hoverState="in"):(clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.isInStateTrue=function(){for(var a in this.inState)if(this.inState[a])return!0;return!1},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);if(c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusout"==b.type?"focus":"hover"]=!1),!c.isInStateTrue())return clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.getPosition(this.$viewport);h="bottom"==h&&k.bottom+m>o.bottom?"top":"top"==h&&k.top-m<o.top?"bottom":"right"==h&&k.right+l>o.width?"left":"left"==h&&k.left-l<o.left?"right":h,f.removeClass(n).addClass(h)}var p=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(p,h);var q=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",q).emulateTransitionEnd(c.TRANSITION_DURATION):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top+=g,b.left+=h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element&&e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);if(this.$element.trigger(g),!g.isDefaultPrevented())return f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=window.SVGElement&&c instanceof window.SVGElement,g=d?{top:0,left:0}:f?null:b.offset(),h={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},i=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,h,i,g)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.right&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){if(!this.$tip&&(this.$tip=a(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),b?(c.inState.click=!c.inState.click,c.isInStateTrue()?c.enter(c):c.leave(c)):c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type),a.$tip&&a.$tip.detach(),a.$tip=null,a.$arrow=null,a.$viewport=null,a.$element=null})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;!e&&/destroy|hide/.test(b)||(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.7",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.7",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){
this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.7",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.7",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return e<c&&"top";if("bottom"==this.affixed)return null!=c?!(e+this.unpin<=f.top)&&"bottom":!(e+g<=a-d)&&"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&e<=c?"top":null!=d&&i+j>=a-d&&"bottom"},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=Math.max(a(document).height(),a(document.body).height());"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);

/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					// Check for existence for IE8
					return o.map && o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || document.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		// Set language on the parent, for styling
		parent = element.parentNode;

		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				env.element.textContent = env.code;
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	tokenize: function(text, grammar, language) {
		var Token = _.Token;

		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i=0, pos = 0; i<strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						break tokenloop;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && p < to; ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						/*
						 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
						 */
						if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					}

					if (!match) {
						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}
 	// In worker
	_self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code,
		    immediateClose = message.immediateClose;

		_self.postMessage(_.highlight(code, _.languages[lang], lang));
		if (immediateClose) {
			_self.close();
		}
	}, false);

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/i,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		if(Array.prototype.forEach) { // Check to prevent error in IE8
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');

				var language, parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
						}
						else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						}
						else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
		}

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();

!function(){function t(t){var n=t.split(/\n/);n.shift(),n.splice(-1,1);var o=n[0].length-n[0].trim().length,e=new RegExp(" {"+o+"}");return n=n.map(function(t){return t.match(e)&&(t=t.substring(o)),t}),n=n.join("\n")}var n=$("<div id='source-button' class='btn btn-primary btn-xs'>&lt; &gt;</div>").click(function(){var n=$(this).parent().html();n=t(n),$("#source-modal pre").text(n),$("#source-modal").modal()});$('.bs-component [data-toggle="popover"]').popover(),$('.bs-component [data-toggle="tooltip"]').tooltip(),$(".bs-component").hover(function(){$(this).append(n),n.show()},function(){n.hide()})}();
/*!
   Copyright 2008-2021 SpryMedia Ltd.

 This source file is free software, available under the following license:
   MIT license - http://datatables.net/license

 This source file is distributed in the hope that it will be useful, but
 WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.

 For details please refer to: http://www.datatables.net
 DataTables 1.11.1
 ©2008-2021 SpryMedia Ltd - datatables.net/license
*/
var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.findInternal=function(l,z,A){l instanceof String&&(l=String(l));for(var q=l.length,E=0;E<q;E++){var P=l[E];if(z.call(A,P,E,l))return{i:E,v:P}}return{i:-1,v:void 0}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.ISOLATE_POLYFILLS=!1;
$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(l,z,A){if(l==Array.prototype||l==Object.prototype)return l;l[z]=A.value;return l};$jscomp.getGlobal=function(l){l=["object"==typeof globalThis&&globalThis,l,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var z=0;z<l.length;++z){var A=l[z];if(A&&A.Math==Math)return A}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE="function"===typeof Symbol&&"symbol"===typeof Symbol("x");$jscomp.TRUST_ES6_POLYFILLS=!$jscomp.ISOLATE_POLYFILLS||$jscomp.IS_SYMBOL_NATIVE;$jscomp.polyfills={};$jscomp.propertyToPolyfillSymbol={};$jscomp.POLYFILL_PREFIX="$jscp$";var $jscomp$lookupPolyfilledValue=function(l,z){var A=$jscomp.propertyToPolyfillSymbol[z];if(null==A)return l[z];A=l[A];return void 0!==A?A:l[z]};
$jscomp.polyfill=function(l,z,A,q){z&&($jscomp.ISOLATE_POLYFILLS?$jscomp.polyfillIsolated(l,z,A,q):$jscomp.polyfillUnisolated(l,z,A,q))};$jscomp.polyfillUnisolated=function(l,z,A,q){A=$jscomp.global;l=l.split(".");for(q=0;q<l.length-1;q++){var E=l[q];if(!(E in A))return;A=A[E]}l=l[l.length-1];q=A[l];z=z(q);z!=q&&null!=z&&$jscomp.defineProperty(A,l,{configurable:!0,writable:!0,value:z})};
$jscomp.polyfillIsolated=function(l,z,A,q){var E=l.split(".");l=1===E.length;q=E[0];q=!l&&q in $jscomp.polyfills?$jscomp.polyfills:$jscomp.global;for(var P=0;P<E.length-1;P++){var ma=E[P];if(!(ma in q))return;q=q[ma]}E=E[E.length-1];A=$jscomp.IS_SYMBOL_NATIVE&&"es6"===A?q[E]:null;z=z(A);null!=z&&(l?$jscomp.defineProperty($jscomp.polyfills,E,{configurable:!0,writable:!0,value:z}):z!==A&&($jscomp.propertyToPolyfillSymbol[E]=$jscomp.IS_SYMBOL_NATIVE?$jscomp.global.Symbol(E):$jscomp.POLYFILL_PREFIX+E,
E=$jscomp.propertyToPolyfillSymbol[E],$jscomp.defineProperty(q,E,{configurable:!0,writable:!0,value:z})))};$jscomp.polyfill("Array.prototype.find",function(l){return l?l:function(z,A){return $jscomp.findInternal(this,z,A).v}},"es6","es3");
(function(l){"function"===typeof define&&define.amd?define(["jquery"],function(z){return l(z,window,document)}):"object"===typeof exports?module.exports=function(z,A){z||(z=window);A||(A="undefined"!==typeof window?require("jquery"):require("jquery")(z));return l(A,z,z.document)}:window.DataTable=l(jQuery,window,document)})(function(l,z,A,q){function E(a){var b,c,d={};l.each(a,function(e,h){(b=e.match(/^([^A-Z]+?)([A-Z])/))&&-1!=="a aa ai ao as b fn i m o s ".indexOf(b[1]+" ")&&(c=e.replace(b[0],
b[2].toLowerCase()),d[c]=e,"o"===b[1]&&E(a[e]))});a._hungarianMap=d}function P(a,b,c){a._hungarianMap||E(a);var d;l.each(b,function(e,h){d=a._hungarianMap[e];d===q||!c&&b[d]!==q||("o"===d.charAt(0)?(b[d]||(b[d]={}),l.extend(!0,b[d],b[e]),P(a[d],b[d],c)):b[d]=b[e])})}function ma(a){var b=u.defaults.oLanguage,c=b.sDecimal;c&&Wa(c);if(a){var d=a.sZeroRecords;!a.sEmptyTable&&d&&"No data available in table"===b.sEmptyTable&&X(a,a,"sZeroRecords","sEmptyTable");!a.sLoadingRecords&&d&&"Loading..."===b.sLoadingRecords&&
X(a,a,"sZeroRecords","sLoadingRecords");a.sInfoThousands&&(a.sThousands=a.sInfoThousands);(a=a.sDecimal)&&c!==a&&Wa(a)}}function yb(a){S(a,"ordering","bSort");S(a,"orderMulti","bSortMulti");S(a,"orderClasses","bSortClasses");S(a,"orderCellsTop","bSortCellsTop");S(a,"order","aaSorting");S(a,"orderFixed","aaSortingFixed");S(a,"paging","bPaginate");S(a,"pagingType","sPaginationType");S(a,"pageLength","iDisplayLength");S(a,"searching","bFilter");"boolean"===typeof a.sScrollX&&(a.sScrollX=a.sScrollX?"100%":
"");"boolean"===typeof a.scrollX&&(a.scrollX=a.scrollX?"100%":"");if(a=a.aoSearchCols)for(var b=0,c=a.length;b<c;b++)a[b]&&P(u.models.oSearch,a[b])}function zb(a){S(a,"orderable","bSortable");S(a,"orderData","aDataSort");S(a,"orderSequence","asSorting");S(a,"orderDataType","sortDataType");var b=a.aDataSort;"number"!==typeof b||Array.isArray(b)||(a.aDataSort=[b])}function Ab(a){if(!u.__browser){var b={};u.__browser=b;var c=l("<div/>").css({position:"fixed",top:0,left:-1*l(z).scrollLeft(),height:1,
width:1,overflow:"hidden"}).append(l("<div/>").css({position:"absolute",top:1,left:1,width:100,overflow:"scroll"}).append(l("<div/>").css({width:"100%",height:10}))).appendTo("body"),d=c.children(),e=d.children();b.barWidth=d[0].offsetWidth-d[0].clientWidth;b.bScrollOversize=100===e[0].offsetWidth&&100!==d[0].clientWidth;b.bScrollbarLeft=1!==Math.round(e.offset().left);b.bBounding=c[0].getBoundingClientRect().width?!0:!1;c.remove()}l.extend(a.oBrowser,u.__browser);a.oScroll.iBarWidth=u.__browser.barWidth}
function Bb(a,b,c,d,e,h){var g=!1;if(c!==q){var f=c;g=!0}for(;d!==e;)a.hasOwnProperty(d)&&(f=g?b(f,a[d],d,a):a[d],g=!0,d+=h);return f}function Xa(a,b){var c=u.defaults.column,d=a.aoColumns.length;c=l.extend({},u.models.oColumn,c,{nTh:b?b:A.createElement("th"),sTitle:c.sTitle?c.sTitle:b?b.innerHTML:"",aDataSort:c.aDataSort?c.aDataSort:[d],mData:c.mData?c.mData:d,idx:d});a.aoColumns.push(c);c=a.aoPreSearchCols;c[d]=l.extend({},u.models.oSearch,c[d]);Ga(a,d,l(b).data())}function Ga(a,b,c){b=a.aoColumns[b];
var d=a.oClasses,e=l(b.nTh);if(!b.sWidthOrig){b.sWidthOrig=e.attr("width")||null;var h=(e.attr("style")||"").match(/width:\s*(\d+[pxem%]+)/);h&&(b.sWidthOrig=h[1])}c!==q&&null!==c&&(zb(c),P(u.defaults.column,c,!0),c.mDataProp===q||c.mData||(c.mData=c.mDataProp),c.sType&&(b._sManualType=c.sType),c.className&&!c.sClass&&(c.sClass=c.className),c.sClass&&e.addClass(c.sClass),l.extend(b,c),X(b,c,"sWidth","sWidthOrig"),c.iDataSort!==q&&(b.aDataSort=[c.iDataSort]),X(b,c,"aDataSort"));var g=b.mData,f=na(g),
k=b.mRender?na(b.mRender):null;c=function(n){return"string"===typeof n&&-1!==n.indexOf("@")};b._bAttrSrc=l.isPlainObject(g)&&(c(g.sort)||c(g.type)||c(g.filter));b._setter=null;b.fnGetData=function(n,m,p){var t=f(n,m,q,p);return k&&m?k(t,m,n,p):t};b.fnSetData=function(n,m,p){return ha(g)(n,m,p)};"number"!==typeof g&&(a._rowReadObject=!0);a.oFeatures.bSort||(b.bSortable=!1,e.addClass(d.sSortableNone));a=-1!==l.inArray("asc",b.asSorting);c=-1!==l.inArray("desc",b.asSorting);b.bSortable&&(a||c)?a&&!c?
(b.sSortingClass=d.sSortableAsc,b.sSortingClassJUI=d.sSortJUIAscAllowed):!a&&c?(b.sSortingClass=d.sSortableDesc,b.sSortingClassJUI=d.sSortJUIDescAllowed):(b.sSortingClass=d.sSortable,b.sSortingClassJUI=d.sSortJUI):(b.sSortingClass=d.sSortableNone,b.sSortingClassJUI="")}function ta(a){if(!1!==a.oFeatures.bAutoWidth){var b=a.aoColumns;Ya(a);for(var c=0,d=b.length;c<d;c++)b[c].nTh.style.width=b[c].sWidth}b=a.oScroll;""===b.sY&&""===b.sX||Ha(a);F(a,null,"column-sizing",[a])}function ua(a,b){a=Ia(a,"bVisible");
return"number"===typeof a[b]?a[b]:null}function va(a,b){a=Ia(a,"bVisible");b=l.inArray(b,a);return-1!==b?b:null}function oa(a){var b=0;l.each(a.aoColumns,function(c,d){d.bVisible&&"none"!==l(d.nTh).css("display")&&b++});return b}function Ia(a,b){var c=[];l.map(a.aoColumns,function(d,e){d[b]&&c.push(e)});return c}function Za(a){var b=a.aoColumns,c=a.aoData,d=u.ext.type.detect,e,h,g;var f=0;for(e=b.length;f<e;f++){var k=b[f];var n=[];if(!k.sType&&k._sManualType)k.sType=k._sManualType;else if(!k.sType){var m=
0;for(h=d.length;m<h;m++){var p=0;for(g=c.length;p<g;p++){n[p]===q&&(n[p]=T(a,p,f,"type"));var t=d[m](n[p],a);if(!t&&m!==d.length-1)break;if("html"===t&&!Z(n[p]))break}if(t){k.sType=t;break}}k.sType||(k.sType="string")}}}function Cb(a,b,c,d){var e,h,g,f=a.aoColumns;if(b)for(e=b.length-1;0<=e;e--){var k=b[e];var n=k.targets!==q?k.targets:k.aTargets;Array.isArray(n)||(n=[n]);var m=0;for(h=n.length;m<h;m++)if("number"===typeof n[m]&&0<=n[m]){for(;f.length<=n[m];)Xa(a);d(n[m],k)}else if("number"===typeof n[m]&&
0>n[m])d(f.length+n[m],k);else if("string"===typeof n[m]){var p=0;for(g=f.length;p<g;p++)("_all"==n[m]||l(f[p].nTh).hasClass(n[m]))&&d(p,k)}}if(c)for(e=0,a=c.length;e<a;e++)d(e,c[e])}function ia(a,b,c,d){var e=a.aoData.length,h=l.extend(!0,{},u.models.oRow,{src:c?"dom":"data",idx:e});h._aData=b;a.aoData.push(h);for(var g=a.aoColumns,f=0,k=g.length;f<k;f++)g[f].sType=null;a.aiDisplayMaster.push(e);b=a.rowIdFn(b);b!==q&&(a.aIds[b]=h);!c&&a.oFeatures.bDeferRender||$a(a,e,c,d);return e}function Ja(a,
b){var c;b instanceof l||(b=l(b));return b.map(function(d,e){c=ab(a,e);return ia(a,c.data,e,c.cells)})}function T(a,b,c,d){"search"===d?d="filter":"order"===d&&(d="sort");var e=a.iDraw,h=a.aoColumns[c],g=a.aoData[b]._aData,f=h.sDefaultContent,k=h.fnGetData(g,d,{settings:a,row:b,col:c});if(k===q)return a.iDrawError!=e&&null===f&&(da(a,0,"Requested unknown parameter "+("function"==typeof h.mData?"{function}":"'"+h.mData+"'")+" for row "+b+", column "+c,4),a.iDrawError=e),f;if((k===g||null===k)&&null!==
f&&d!==q)k=f;else if("function"===typeof k)return k.call(g);return null===k&&"display"==d?"":k}function Db(a,b,c,d){a.aoColumns[c].fnSetData(a.aoData[b]._aData,d,{settings:a,row:b,col:c})}function bb(a){return l.map(a.match(/(\\.|[^\.])+/g)||[""],function(b){return b.replace(/\\\./g,".")})}function cb(a){return U(a.aoData,"_aData")}function Ka(a){a.aoData.length=0;a.aiDisplayMaster.length=0;a.aiDisplay.length=0;a.aIds={}}function La(a,b,c){for(var d=-1,e=0,h=a.length;e<h;e++)a[e]==b?d=e:a[e]>b&&a[e]--;
 -1!=d&&c===q&&a.splice(d,1)}function wa(a,b,c,d){var e=a.aoData[b],h,g=function(k,n){for(;k.childNodes.length;)k.removeChild(k.firstChild);k.innerHTML=T(a,b,n,"display")};if("dom"!==c&&(c&&"auto"!==c||"dom"!==e.src)){var f=e.anCells;if(f)if(d!==q)g(f[d],d);else for(c=0,h=f.length;c<h;c++)g(f[c],c)}else e._aData=ab(a,e,d,d===q?q:e._aData).data;e._aSortData=null;e._aFilterData=null;g=a.aoColumns;if(d!==q)g[d].sType=null;else{c=0;for(h=g.length;c<h;c++)g[c].sType=null;db(a,e)}}function ab(a,b,c,d){var e=
[],h=b.firstChild,g,f=0,k,n=a.aoColumns,m=a._rowReadObject;d=d!==q?d:m?{}:[];var p=function(x,w){if("string"===typeof x){var r=x.indexOf("@");-1!==r&&(r=x.substring(r+1),ha(x)(d,w.getAttribute(r)))}},t=function(x){if(c===q||c===f)g=n[f],k=x.innerHTML.trim(),g&&g._bAttrSrc?(ha(g.mData._)(d,k),p(g.mData.sort,x),p(g.mData.type,x),p(g.mData.filter,x)):m?(g._setter||(g._setter=ha(g.mData)),g._setter(d,k)):d[f]=k;f++};if(h)for(;h;){var v=h.nodeName.toUpperCase();if("TD"==v||"TH"==v)t(h),e.push(h);h=h.nextSibling}else for(e=
b.anCells,h=0,v=e.length;h<v;h++)t(e[h]);(b=b.firstChild?b:b.nTr)&&(b=b.getAttribute("id"))&&ha(a.rowId)(d,b);return{data:d,cells:e}}function $a(a,b,c,d){var e=a.aoData[b],h=e._aData,g=[],f,k;if(null===e.nTr){var n=c||A.createElement("tr");e.nTr=n;e.anCells=g;n._DT_RowIndex=b;db(a,e);var m=0;for(f=a.aoColumns.length;m<f;m++){var p=a.aoColumns[m];e=(k=c?!1:!0)?A.createElement(p.sCellType):d[m];e._DT_CellIndex={row:b,column:m};g.push(e);if(k||!(!p.mRender&&p.mData===m||l.isPlainObject(p.mData)&&p.mData._===
m+".display"))e.innerHTML=T(a,b,m,"display");p.sClass&&(e.className+=" "+p.sClass);p.bVisible&&!c?n.appendChild(e):!p.bVisible&&c&&e.parentNode.removeChild(e);p.fnCreatedCell&&p.fnCreatedCell.call(a.oInstance,e,T(a,b,m),h,b,m)}F(a,"aoRowCreatedCallback",null,[n,h,b,g])}}function db(a,b){var c=b.nTr,d=b._aData;if(c){if(a=a.rowIdFn(d))c.id=a;d.DT_RowClass&&(a=d.DT_RowClass.split(" "),b.__rowc=b.__rowc?Ma(b.__rowc.concat(a)):a,l(c).removeClass(b.__rowc.join(" ")).addClass(d.DT_RowClass));d.DT_RowAttr&&
l(c).attr(d.DT_RowAttr);d.DT_RowData&&l(c).data(d.DT_RowData)}}function Eb(a){var b,c,d=a.nTHead,e=a.nTFoot,h=0===l("th, td",d).length,g=a.oClasses,f=a.aoColumns;h&&(c=l("<tr/>").appendTo(d));var k=0;for(b=f.length;k<b;k++){var n=f[k];var m=l(n.nTh).addClass(n.sClass);h&&m.appendTo(c);a.oFeatures.bSort&&(m.addClass(n.sSortingClass),!1!==n.bSortable&&(m.attr("tabindex",a.iTabIndex).attr("aria-controls",a.sTableId),eb(a,n.nTh,k)));n.sTitle!=m[0].innerHTML&&m.html(n.sTitle);fb(a,"header")(a,m,n,g)}h&&
xa(a.aoHeader,d);l(d).children("tr").children("th, td").addClass(g.sHeaderTH);l(e).children("tr").children("th, td").addClass(g.sFooterTH);if(null!==e)for(a=a.aoFooter[0],k=0,b=a.length;k<b;k++)n=f[k],n.nTf=a[k].cell,n.sClass&&l(n.nTf).addClass(n.sClass)}function ya(a,b,c){var d,e,h=[],g=[],f=a.aoColumns.length;if(b){c===q&&(c=!1);var k=0;for(d=b.length;k<d;k++){h[k]=b[k].slice();h[k].nTr=b[k].nTr;for(e=f-1;0<=e;e--)a.aoColumns[e].bVisible||c||h[k].splice(e,1);g.push([])}k=0;for(d=h.length;k<d;k++){if(a=
h[k].nTr)for(;e=a.firstChild;)a.removeChild(e);e=0;for(b=h[k].length;e<b;e++){var n=f=1;if(g[k][e]===q){a.appendChild(h[k][e].cell);for(g[k][e]=1;h[k+f]!==q&&h[k][e].cell==h[k+f][e].cell;)g[k+f][e]=1,f++;for(;h[k][e+n]!==q&&h[k][e].cell==h[k][e+n].cell;){for(c=0;c<f;c++)g[k+c][e+n]=1;n++}l(h[k][e].cell).attr("rowspan",f).attr("colspan",n)}}}}}function ja(a,b){var c=F(a,"aoPreDrawCallback","preDraw",[a]);if(-1!==l.inArray(!1,c))V(a,!1);else{c=[];var d=0,e=a.asStripeClasses,h=e.length,g=a.oLanguage,
f=a.iInitDisplayStart,k="ssp"==Q(a),n=a.aiDisplay;a.bDrawing=!0;f!==q&&-1!==f&&(a._iDisplayStart=k?f:f>=a.fnRecordsDisplay()?0:f,a.iInitDisplayStart=-1);f=a._iDisplayStart;var m=a.fnDisplayEnd();if(a.bDeferLoading)a.bDeferLoading=!1,a.iDraw++,V(a,!1);else if(!k)a.iDraw++;else if(!a.bDestroying&&!b){Fb(a);return}if(0!==n.length)for(b=k?a.aoData.length:m,g=k?0:f;g<b;g++){k=n[g];var p=a.aoData[k];null===p.nTr&&$a(a,k);var t=p.nTr;if(0!==h){var v=e[d%h];p._sRowStripe!=v&&(l(t).removeClass(p._sRowStripe).addClass(v),
p._sRowStripe=v)}F(a,"aoRowCallback",null,[t,p._aData,d,g,k]);c.push(t);d++}else d=g.sZeroRecords,1==a.iDraw&&"ajax"==Q(a)?d=g.sLoadingRecords:g.sEmptyTable&&0===a.fnRecordsTotal()&&(d=g.sEmptyTable),c[0]=l("<tr/>",{"class":h?e[0]:""}).append(l("<td />",{valign:"top",colSpan:oa(a),"class":a.oClasses.sRowEmpty}).html(d))[0];F(a,"aoHeaderCallback","header",[l(a.nTHead).children("tr")[0],cb(a),f,m,n]);F(a,"aoFooterCallback","footer",[l(a.nTFoot).children("tr")[0],cb(a),f,m,n]);e=l(a.nTBody);e.children().detach();
e.append(l(c));F(a,"aoDrawCallback","draw",[a]);a.bSorted=!1;a.bFiltered=!1;a.bDrawing=!1}}function ka(a,b){var c=a.oFeatures,d=c.bFilter;c.bSort&&Gb(a);d?za(a,a.oPreviousSearch):a.aiDisplay=a.aiDisplayMaster.slice();!0!==b&&(a._iDisplayStart=0);a._drawHold=b;ja(a);a._drawHold=!1}function Hb(a){var b=a.oClasses,c=l(a.nTable);c=l("<div/>").insertBefore(c);var d=a.oFeatures,e=l("<div/>",{id:a.sTableId+"_wrapper","class":b.sWrapper+(a.nTFoot?"":" "+b.sNoFooter)});a.nHolding=c[0];a.nTableWrapper=e[0];
a.nTableReinsertBefore=a.nTable.nextSibling;for(var h=a.sDom.split(""),g,f,k,n,m,p,t=0;t<h.length;t++){g=null;f=h[t];if("<"==f){k=l("<div/>")[0];n=h[t+1];if("'"==n||'"'==n){m="";for(p=2;h[t+p]!=n;)m+=h[t+p],p++;"H"==m?m=b.sJUIHeader:"F"==m&&(m=b.sJUIFooter);-1!=m.indexOf(".")?(n=m.split("."),k.id=n[0].substr(1,n[0].length-1),k.className=n[1]):"#"==m.charAt(0)?k.id=m.substr(1,m.length-1):k.className=m;t+=p}e.append(k);e=l(k)}else if(">"==f)e=e.parent();else if("l"==f&&d.bPaginate&&d.bLengthChange)g=
Ib(a);else if("f"==f&&d.bFilter)g=Jb(a);else if("r"==f&&d.bProcessing)g=Kb(a);else if("t"==f)g=Lb(a);else if("i"==f&&d.bInfo)g=Mb(a);else if("p"==f&&d.bPaginate)g=Nb(a);else if(0!==u.ext.feature.length)for(k=u.ext.feature,p=0,n=k.length;p<n;p++)if(f==k[p].cFeature){g=k[p].fnInit(a);break}g&&(k=a.aanFeatures,k[f]||(k[f]=[]),k[f].push(g),e.append(g))}c.replaceWith(e);a.nHolding=null}function xa(a,b){b=l(b).children("tr");var c,d,e;a.splice(0,a.length);var h=0;for(e=b.length;h<e;h++)a.push([]);h=0;for(e=
b.length;h<e;h++){var g=b[h];for(c=g.firstChild;c;){if("TD"==c.nodeName.toUpperCase()||"TH"==c.nodeName.toUpperCase()){var f=1*c.getAttribute("colspan");var k=1*c.getAttribute("rowspan");f=f&&0!==f&&1!==f?f:1;k=k&&0!==k&&1!==k?k:1;var n=0;for(d=a[h];d[n];)n++;var m=n;var p=1===f?!0:!1;for(d=0;d<f;d++)for(n=0;n<k;n++)a[h+n][m+d]={cell:c,unique:p},a[h+n].nTr=g}c=c.nextSibling}}}function Na(a,b,c){var d=[];c||(c=a.aoHeader,b&&(c=[],xa(c,b)));b=0;for(var e=c.length;b<e;b++)for(var h=0,g=c[b].length;h<
g;h++)!c[b][h].unique||d[h]&&a.bSortCellsTop||(d[h]=c[b][h].cell);return d}function Oa(a,b,c){F(a,"aoServerParams","serverParams",[b]);if(b&&Array.isArray(b)){var d={},e=/(.*?)\[\]$/;l.each(b,function(m,p){(m=p.name.match(e))?(m=m[0],d[m]||(d[m]=[]),d[m].push(p.value)):d[p.name]=p.value});b=d}var h=a.ajax,g=a.oInstance,f=function(m){var p=a.jqXhr?a.jqXhr.status:null;if(null===m||"number"===typeof p&&204==p)m={},Aa(a,m,[]);(p=m.error||m.sError)&&da(a,0,p);a.json=m;F(a,null,"xhr",[a,m,a.jqXHR]);c(m)};
if(l.isPlainObject(h)&&h.data){var k=h.data;var n="function"===typeof k?k(b,a):k;b="function"===typeof k&&n?n:l.extend(!0,b,n);delete h.data}n={data:b,success:f,dataType:"json",cache:!1,type:a.sServerMethod,error:function(m,p,t){t=F(a,null,"xhr",[a,null,a.jqXHR]);-1===l.inArray(!0,t)&&("parsererror"==p?da(a,0,"Invalid JSON response",1):4===m.readyState&&da(a,0,"Ajax error",7));V(a,!1)}};a.oAjaxData=b;F(a,null,"preXhr",[a,b]);a.fnServerData?a.fnServerData.call(g,a.sAjaxSource,l.map(b,function(m,p){return{name:p,
value:m}}),f,a):a.sAjaxSource||"string"===typeof h?a.jqXHR=l.ajax(l.extend(n,{url:h||a.sAjaxSource})):"function"===typeof h?a.jqXHR=h.call(g,b,f,a):(a.jqXHR=l.ajax(l.extend(n,h)),h.data=k)}function Fb(a){a.iDraw++;V(a,!0);Oa(a,Ob(a),function(b){Pb(a,b)})}function Ob(a){var b=a.aoColumns,c=b.length,d=a.oFeatures,e=a.oPreviousSearch,h=a.aoPreSearchCols,g=[],f=pa(a);var k=a._iDisplayStart;var n=!1!==d.bPaginate?a._iDisplayLength:-1;var m=function(x,w){g.push({name:x,value:w})};m("sEcho",a.iDraw);m("iColumns",
c);m("sColumns",U(b,"sName").join(","));m("iDisplayStart",k);m("iDisplayLength",n);var p={draw:a.iDraw,columns:[],order:[],start:k,length:n,search:{value:e.sSearch,regex:e.bRegex}};for(k=0;k<c;k++){var t=b[k];var v=h[k];n="function"==typeof t.mData?"function":t.mData;p.columns.push({data:n,name:t.sName,searchable:t.bSearchable,orderable:t.bSortable,search:{value:v.sSearch,regex:v.bRegex}});m("mDataProp_"+k,n);d.bFilter&&(m("sSearch_"+k,v.sSearch),m("bRegex_"+k,v.bRegex),m("bSearchable_"+k,t.bSearchable));
d.bSort&&m("bSortable_"+k,t.bSortable)}d.bFilter&&(m("sSearch",e.sSearch),m("bRegex",e.bRegex));d.bSort&&(l.each(f,function(x,w){p.order.push({column:w.col,dir:w.dir});m("iSortCol_"+x,w.col);m("sSortDir_"+x,w.dir)}),m("iSortingCols",f.length));b=u.ext.legacy.ajax;return null===b?a.sAjaxSource?g:p:b?g:p}function Pb(a,b){var c=function(g,f){return b[g]!==q?b[g]:b[f]},d=Aa(a,b),e=c("sEcho","draw"),h=c("iTotalRecords","recordsTotal");c=c("iTotalDisplayRecords","recordsFiltered");if(e!==q){if(1*e<a.iDraw)return;
a.iDraw=1*e}d||(d=[]);Ka(a);a._iRecordsTotal=parseInt(h,10);a._iRecordsDisplay=parseInt(c,10);e=0;for(h=d.length;e<h;e++)ia(a,d[e]);a.aiDisplay=a.aiDisplayMaster.slice();ja(a,!0);a._bInitComplete||Pa(a,b);V(a,!1)}function Aa(a,b,c){a=l.isPlainObject(a.ajax)&&a.ajax.dataSrc!==q?a.ajax.dataSrc:a.sAjaxDataProp;if(!c)return"data"===a?b.aaData||b[a]:""!==a?na(a)(b):b;ha(a)(b,c)}function Jb(a){var b=a.oClasses,c=a.sTableId,d=a.oLanguage,e=a.oPreviousSearch,h=a.aanFeatures,g='<input type="search" class="'+
b.sFilterInput+'"/>',f=d.sSearch;f=f.match(/_INPUT_/)?f.replace("_INPUT_",g):f+g;b=l("<div/>",{id:h.f?null:c+"_filter","class":b.sFilter}).append(l("<label/>").append(f));var k=function(m){var p=this.value?this.value:"";e.return&&"Enter"!==m.key||p==e.sSearch||(za(a,{sSearch:p,bRegex:e.bRegex,bSmart:e.bSmart,bCaseInsensitive:e.bCaseInsensitive,"return":e.return}),a._iDisplayStart=0,ja(a))};h=null!==a.searchDelay?a.searchDelay:"ssp"===Q(a)?400:0;var n=l("input",b).val(e.sSearch).attr("placeholder",
d.sSearchPlaceholder).on("keyup.DT search.DT input.DT paste.DT cut.DT",h?gb(k,h):k).on("mouseup",function(m){setTimeout(function(){k.call(n[0],m)},10)}).on("keypress.DT",function(m){if(13==m.keyCode)return!1}).attr("aria-controls",c);l(a.nTable).on("search.dt.DT",function(m,p){if(a===p)try{n[0]!==A.activeElement&&n.val(e.sSearch)}catch(t){}});return b[0]}function za(a,b,c){var d=a.oPreviousSearch,e=a.aoPreSearchCols,h=function(f){d.sSearch=f.sSearch;d.bRegex=f.bRegex;d.bSmart=f.bSmart;d.bCaseInsensitive=
f.bCaseInsensitive;d.return=f.return},g=function(f){return f.bEscapeRegex!==q?!f.bEscapeRegex:f.bRegex};Za(a);if("ssp"!=Q(a)){Qb(a,b.sSearch,c,g(b),b.bSmart,b.bCaseInsensitive,b.return);h(b);for(b=0;b<e.length;b++)Rb(a,e[b].sSearch,b,g(e[b]),e[b].bSmart,e[b].bCaseInsensitive);Sb(a)}else h(b);a.bFiltered=!0;F(a,null,"search",[a])}function Sb(a){for(var b=u.ext.search,c=a.aiDisplay,d,e,h=0,g=b.length;h<g;h++){for(var f=[],k=0,n=c.length;k<n;k++)e=c[k],d=a.aoData[e],b[h](a,d._aFilterData,e,d._aData,
k)&&f.push(e);c.length=0;l.merge(c,f)}}function Rb(a,b,c,d,e,h){if(""!==b){var g=[],f=a.aiDisplay;d=hb(b,d,e,h);for(e=0;e<f.length;e++)b=a.aoData[f[e]]._aFilterData[c],d.test(b)&&g.push(f[e]);a.aiDisplay=g}}function Qb(a,b,c,d,e,h){e=hb(b,d,e,h);var g=a.oPreviousSearch.sSearch,f=a.aiDisplayMaster;h=[];0!==u.ext.search.length&&(c=!0);var k=Tb(a);if(0>=b.length)a.aiDisplay=f.slice();else{if(k||c||d||g.length>b.length||0!==b.indexOf(g)||a.bSorted)a.aiDisplay=f.slice();b=a.aiDisplay;for(c=0;c<b.length;c++)e.test(a.aoData[b[c]]._sFilterRow)&&
h.push(b[c]);a.aiDisplay=h}}function hb(a,b,c,d){a=b?a:ib(a);c&&(a="^(?=.*?"+l.map(a.match(/"[^"]+"|[^ ]+/g)||[""],function(e){if('"'===e.charAt(0)){var h=e.match(/^"(.*)"$/);e=h?h[1]:e}return e.replace('"',"")}).join(")(?=.*?")+").*$");return new RegExp(a,d?"i":"")}function Tb(a){var b=a.aoColumns,c,d,e=u.ext.type.search;var h=!1;var g=0;for(c=a.aoData.length;g<c;g++){var f=a.aoData[g];if(!f._aFilterData){var k=[];var n=0;for(d=b.length;n<d;n++){h=b[n];if(h.bSearchable){var m=T(a,g,n,"filter");e[h.sType]&&
(m=e[h.sType](m));null===m&&(m="");"string"!==typeof m&&m.toString&&(m=m.toString())}else m="";m.indexOf&&-1!==m.indexOf("&")&&(Qa.innerHTML=m,m=qc?Qa.textContent:Qa.innerText);m.replace&&(m=m.replace(/[\r\n\u2028]/g,""));k.push(m)}f._aFilterData=k;f._sFilterRow=k.join("  ");h=!0}}return h}function Ub(a){return{search:a.sSearch,smart:a.bSmart,regex:a.bRegex,caseInsensitive:a.bCaseInsensitive}}function Vb(a){return{sSearch:a.search,bSmart:a.smart,bRegex:a.regex,bCaseInsensitive:a.caseInsensitive}}
function Mb(a){var b=a.sTableId,c=a.aanFeatures.i,d=l("<div/>",{"class":a.oClasses.sInfo,id:c?null:b+"_info"});c||(a.aoDrawCallback.push({fn:Wb,sName:"information"}),d.attr("role","status").attr("aria-live","polite"),l(a.nTable).attr("aria-describedby",b+"_info"));return d[0]}function Wb(a){var b=a.aanFeatures.i;if(0!==b.length){var c=a.oLanguage,d=a._iDisplayStart+1,e=a.fnDisplayEnd(),h=a.fnRecordsTotal(),g=a.fnRecordsDisplay(),f=g?c.sInfo:c.sInfoEmpty;g!==h&&(f+=" "+c.sInfoFiltered);f+=c.sInfoPostFix;
f=Xb(a,f);c=c.fnInfoCallback;null!==c&&(f=c.call(a.oInstance,a,d,e,h,g,f));l(b).html(f)}}function Xb(a,b){var c=a.fnFormatNumber,d=a._iDisplayStart+1,e=a._iDisplayLength,h=a.fnRecordsDisplay(),g=-1===e;return b.replace(/_START_/g,c.call(a,d)).replace(/_END_/g,c.call(a,a.fnDisplayEnd())).replace(/_MAX_/g,c.call(a,a.fnRecordsTotal())).replace(/_TOTAL_/g,c.call(a,h)).replace(/_PAGE_/g,c.call(a,g?1:Math.ceil(d/e))).replace(/_PAGES_/g,c.call(a,g?1:Math.ceil(h/e)))}function Ba(a){var b=a.iInitDisplayStart,
c=a.aoColumns;var d=a.oFeatures;var e=a.bDeferLoading;if(a.bInitialised){Hb(a);Eb(a);ya(a,a.aoHeader);ya(a,a.aoFooter);V(a,!0);d.bAutoWidth&&Ya(a);var h=0;for(d=c.length;h<d;h++){var g=c[h];g.sWidth&&(g.nTh.style.width=K(g.sWidth))}F(a,null,"preInit",[a]);ka(a);c=Q(a);if("ssp"!=c||e)"ajax"==c?Oa(a,[],function(f){var k=Aa(a,f);for(h=0;h<k.length;h++)ia(a,k[h]);a.iInitDisplayStart=b;ka(a);V(a,!1);Pa(a,f)},a):(V(a,!1),Pa(a))}else setTimeout(function(){Ba(a)},200)}function Pa(a,b){a._bInitComplete=!0;
(b||a.oInit.aaData)&&ta(a);F(a,null,"plugin-init",[a,b]);F(a,"aoInitComplete","init",[a,b])}function jb(a,b){b=parseInt(b,10);a._iDisplayLength=b;kb(a);F(a,null,"length",[a,b])}function Ib(a){var b=a.oClasses,c=a.sTableId,d=a.aLengthMenu,e=Array.isArray(d[0]),h=e?d[0]:d;d=e?d[1]:d;e=l("<select/>",{name:c+"_length","aria-controls":c,"class":b.sLengthSelect});for(var g=0,f=h.length;g<f;g++)e[0][g]=new Option("number"===typeof d[g]?a.fnFormatNumber(d[g]):d[g],h[g]);var k=l("<div><label/></div>").addClass(b.sLength);
a.aanFeatures.l||(k[0].id=c+"_length");k.children().append(a.oLanguage.sLengthMenu.replace("_MENU_",e[0].outerHTML));l("select",k).val(a._iDisplayLength).on("change.DT",function(n){jb(a,l(this).val());ja(a)});l(a.nTable).on("length.dt.DT",function(n,m,p){a===m&&l("select",k).val(p)});return k[0]}function Nb(a){var b=a.sPaginationType,c=u.ext.pager[b],d="function"===typeof c,e=function(g){ja(g)};b=l("<div/>").addClass(a.oClasses.sPaging+b)[0];var h=a.aanFeatures;d||c.fnInit(a,b,e);h.p||(b.id=a.sTableId+
"_paginate",a.aoDrawCallback.push({fn:function(g){if(d){var f=g._iDisplayStart,k=g._iDisplayLength,n=g.fnRecordsDisplay(),m=-1===k;f=m?0:Math.ceil(f/k);k=m?1:Math.ceil(n/k);n=c(f,k);var p;m=0;for(p=h.p.length;m<p;m++)fb(g,"pageButton")(g,h.p[m],m,n,f,k)}else c.fnUpdate(g,e)},sName:"pagination"}));return b}function lb(a,b,c){var d=a._iDisplayStart,e=a._iDisplayLength,h=a.fnRecordsDisplay();0===h||-1===e?d=0:"number"===typeof b?(d=b*e,d>h&&(d=0)):"first"==b?d=0:"previous"==b?(d=0<=e?d-e:0,0>d&&(d=0)):
"next"==b?d+e<h&&(d+=e):"last"==b?d=Math.floor((h-1)/e)*e:da(a,0,"Unknown paging action: "+b,5);b=a._iDisplayStart!==d;a._iDisplayStart=d;b&&(F(a,null,"page",[a]),c&&ja(a));return b}function Kb(a){return l("<div/>",{id:a.aanFeatures.r?null:a.sTableId+"_processing","class":a.oClasses.sProcessing}).html(a.oLanguage.sProcessing).insertBefore(a.nTable)[0]}function V(a,b){a.oFeatures.bProcessing&&l(a.aanFeatures.r).css("display",b?"block":"none");F(a,null,"processing",[a,b])}function Lb(a){var b=l(a.nTable),
c=a.oScroll;if(""===c.sX&&""===c.sY)return a.nTable;var d=c.sX,e=c.sY,h=a.oClasses,g=b.children("caption"),f=g.length?g[0]._captionSide:null,k=l(b[0].cloneNode(!1)),n=l(b[0].cloneNode(!1)),m=b.children("tfoot");m.length||(m=null);k=l("<div/>",{"class":h.sScrollWrapper}).append(l("<div/>",{"class":h.sScrollHead}).css({overflow:"hidden",position:"relative",border:0,width:d?d?K(d):null:"100%"}).append(l("<div/>",{"class":h.sScrollHeadInner}).css({"box-sizing":"content-box",width:c.sXInner||"100%"}).append(k.removeAttr("id").css("margin-left",
0).append("top"===f?g:null).append(b.children("thead"))))).append(l("<div/>",{"class":h.sScrollBody}).css({position:"relative",overflow:"auto",width:d?K(d):null}).append(b));m&&k.append(l("<div/>",{"class":h.sScrollFoot}).css({overflow:"hidden",border:0,width:d?d?K(d):null:"100%"}).append(l("<div/>",{"class":h.sScrollFootInner}).append(n.removeAttr("id").css("margin-left",0).append("bottom"===f?g:null).append(b.children("tfoot")))));b=k.children();var p=b[0];h=b[1];var t=m?b[2]:null;if(d)l(h).on("scroll.DT",
function(v){v=this.scrollLeft;p.scrollLeft=v;m&&(t.scrollLeft=v)});l(h).css("max-height",e);c.bCollapse||l(h).css("height",e);a.nScrollHead=p;a.nScrollBody=h;a.nScrollFoot=t;a.aoDrawCallback.push({fn:Ha,sName:"scrolling"});return k[0]}function Ha(a){var b=a.oScroll,c=b.sX,d=b.sXInner,e=b.sY;b=b.iBarWidth;var h=l(a.nScrollHead),g=h[0].style,f=h.children("div"),k=f[0].style,n=f.children("table");f=a.nScrollBody;var m=l(f),p=f.style,t=l(a.nScrollFoot).children("div"),v=t.children("table"),x=l(a.nTHead),
w=l(a.nTable),r=w[0],C=r.style,G=a.nTFoot?l(a.nTFoot):null,aa=a.oBrowser,L=aa.bScrollOversize;U(a.aoColumns,"nTh");var O=[],I=[],H=[],ea=[],Y,Ca=function(D){D=D.style;D.paddingTop="0";D.paddingBottom="0";D.borderTopWidth="0";D.borderBottomWidth="0";D.height=0};var fa=f.scrollHeight>f.clientHeight;if(a.scrollBarVis!==fa&&a.scrollBarVis!==q)a.scrollBarVis=fa,ta(a);else{a.scrollBarVis=fa;w.children("thead, tfoot").remove();if(G){var ba=G.clone().prependTo(w);var la=G.find("tr");ba=ba.find("tr")}var mb=
x.clone().prependTo(w);x=x.find("tr");fa=mb.find("tr");mb.find("th, td").removeAttr("tabindex");c||(p.width="100%",h[0].style.width="100%");l.each(Na(a,mb),function(D,W){Y=ua(a,D);W.style.width=a.aoColumns[Y].sWidth});G&&ca(function(D){D.style.width=""},ba);h=w.outerWidth();""===c?(C.width="100%",L&&(w.find("tbody").height()>f.offsetHeight||"scroll"==m.css("overflow-y"))&&(C.width=K(w.outerWidth()-b)),h=w.outerWidth()):""!==d&&(C.width=K(d),h=w.outerWidth());ca(Ca,fa);ca(function(D){var W=z.getComputedStyle?
z.getComputedStyle(D).width:K(l(D).width());H.push(D.innerHTML);O.push(W)},fa);ca(function(D,W){D.style.width=O[W]},x);l(fa).height(0);G&&(ca(Ca,ba),ca(function(D){ea.push(D.innerHTML);I.push(K(l(D).css("width")))},ba),ca(function(D,W){D.style.width=I[W]},la),l(ba).height(0));ca(function(D,W){D.innerHTML='<div class="dataTables_sizing">'+H[W]+"</div>";D.childNodes[0].style.height="0";D.childNodes[0].style.overflow="hidden";D.style.width=O[W]},fa);G&&ca(function(D,W){D.innerHTML='<div class="dataTables_sizing">'+
ea[W]+"</div>";D.childNodes[0].style.height="0";D.childNodes[0].style.overflow="hidden";D.style.width=I[W]},ba);w.outerWidth()<h?(la=f.scrollHeight>f.offsetHeight||"scroll"==m.css("overflow-y")?h+b:h,L&&(f.scrollHeight>f.offsetHeight||"scroll"==m.css("overflow-y"))&&(C.width=K(la-b)),""!==c&&""===d||da(a,1,"Possible column misalignment",6)):la="100%";p.width=K(la);g.width=K(la);G&&(a.nScrollFoot.style.width=K(la));!e&&L&&(p.height=K(r.offsetHeight+b));c=w.outerWidth();n[0].style.width=K(c);k.width=
K(c);d=w.height()>f.clientHeight||"scroll"==m.css("overflow-y");e="padding"+(aa.bScrollbarLeft?"Left":"Right");k[e]=d?b+"px":"0px";G&&(v[0].style.width=K(c),t[0].style.width=K(c),t[0].style[e]=d?b+"px":"0px");w.children("colgroup").insertBefore(w.children("thead"));m.trigger("scroll");!a.bSorted&&!a.bFiltered||a._drawHold||(f.scrollTop=0)}}function ca(a,b,c){for(var d=0,e=0,h=b.length,g,f;e<h;){g=b[e].firstChild;for(f=c?c[e].firstChild:null;g;)1===g.nodeType&&(c?a(g,f,d):a(g,d),d++),g=g.nextSibling,
f=c?f.nextSibling:null;e++}}function Ya(a){var b=a.nTable,c=a.aoColumns,d=a.oScroll,e=d.sY,h=d.sX,g=d.sXInner,f=c.length,k=Ia(a,"bVisible"),n=l("th",a.nTHead),m=b.getAttribute("width"),p=b.parentNode,t=!1,v,x=a.oBrowser;d=x.bScrollOversize;(v=b.style.width)&&-1!==v.indexOf("%")&&(m=v);for(v=0;v<k.length;v++){var w=c[k[v]];null!==w.sWidth&&(w.sWidth=Yb(w.sWidthOrig,p),t=!0)}if(d||!t&&!h&&!e&&f==oa(a)&&f==n.length)for(v=0;v<f;v++)k=ua(a,v),null!==k&&(c[k].sWidth=K(n.eq(v).width()));else{f=l(b).clone().css("visibility",
"hidden").removeAttr("id");f.find("tbody tr").remove();var r=l("<tr/>").appendTo(f.find("tbody"));f.find("thead, tfoot").remove();f.append(l(a.nTHead).clone()).append(l(a.nTFoot).clone());f.find("tfoot th, tfoot td").css("width","");n=Na(a,f.find("thead")[0]);for(v=0;v<k.length;v++)w=c[k[v]],n[v].style.width=null!==w.sWidthOrig&&""!==w.sWidthOrig?K(w.sWidthOrig):"",w.sWidthOrig&&h&&l(n[v]).append(l("<div/>").css({width:w.sWidthOrig,margin:0,padding:0,border:0,height:1}));if(a.aoData.length)for(v=
0;v<k.length;v++)t=k[v],w=c[t],l(Zb(a,t)).clone(!1).append(w.sContentPadding).appendTo(r);l("[name]",f).removeAttr("name");w=l("<div/>").css(h||e?{position:"absolute",top:0,left:0,height:1,right:0,overflow:"hidden"}:{}).append(f).appendTo(p);h&&g?f.width(g):h?(f.css("width","auto"),f.removeAttr("width"),f.width()<p.clientWidth&&m&&f.width(p.clientWidth)):e?f.width(p.clientWidth):m&&f.width(m);for(v=e=0;v<k.length;v++)p=l(n[v]),g=p.outerWidth()-p.width(),p=x.bBounding?Math.ceil(n[v].getBoundingClientRect().width):
p.outerWidth(),e+=p,c[k[v]].sWidth=K(p-g);b.style.width=K(e);w.remove()}m&&(b.style.width=K(m));!m&&!h||a._reszEvt||(b=function(){l(z).on("resize.DT-"+a.sInstance,gb(function(){ta(a)}))},d?setTimeout(b,1E3):b(),a._reszEvt=!0)}function Yb(a,b){if(!a)return 0;a=l("<div/>").css("width",K(a)).appendTo(b||A.body);b=a[0].offsetWidth;a.remove();return b}function Zb(a,b){var c=$b(a,b);if(0>c)return null;var d=a.aoData[c];return d.nTr?d.anCells[b]:l("<td/>").html(T(a,c,b,"display"))[0]}function $b(a,b){for(var c,
d=-1,e=-1,h=0,g=a.aoData.length;h<g;h++)c=T(a,h,b,"display")+"",c=c.replace(rc,""),c=c.replace(/&nbsp;/g," "),c.length>d&&(d=c.length,e=h);return e}function K(a){return null===a?"0px":"number"==typeof a?0>a?"0px":a+"px":a.match(/\d$/)?a+"px":a}function pa(a){var b=[],c=a.aoColumns;var d=a.aaSortingFixed;var e=l.isPlainObject(d);var h=[];var g=function(m){m.length&&!Array.isArray(m[0])?h.push(m):l.merge(h,m)};Array.isArray(d)&&g(d);e&&d.pre&&g(d.pre);g(a.aaSorting);e&&d.post&&g(d.post);for(a=0;a<h.length;a++){var f=
h[a][0];g=c[f].aDataSort;d=0;for(e=g.length;d<e;d++){var k=g[d];var n=c[k].sType||"string";h[a]._idx===q&&(h[a]._idx=l.inArray(h[a][1],c[k].asSorting));b.push({src:f,col:k,dir:h[a][1],index:h[a]._idx,type:n,formatter:u.ext.type.order[n+"-pre"]})}}return b}function Gb(a){var b,c=[],d=u.ext.type.order,e=a.aoData,h=0,g=a.aiDisplayMaster;Za(a);var f=pa(a);var k=0;for(b=f.length;k<b;k++){var n=f[k];n.formatter&&h++;ac(a,n.col)}if("ssp"!=Q(a)&&0!==f.length){k=0;for(b=g.length;k<b;k++)c[g[k]]=k;h===f.length?
g.sort(function(m,p){var t,v=f.length,x=e[m]._aSortData,w=e[p]._aSortData;for(t=0;t<v;t++){var r=f[t];var C=x[r.col];var G=w[r.col];C=C<G?-1:C>G?1:0;if(0!==C)return"asc"===r.dir?C:-C}C=c[m];G=c[p];return C<G?-1:C>G?1:0}):g.sort(function(m,p){var t,v=f.length,x=e[m]._aSortData,w=e[p]._aSortData;for(t=0;t<v;t++){var r=f[t];var C=x[r.col];var G=w[r.col];r=d[r.type+"-"+r.dir]||d["string-"+r.dir];C=r(C,G);if(0!==C)return C}C=c[m];G=c[p];return C<G?-1:C>G?1:0})}a.bSorted=!0}function bc(a){var b=a.aoColumns,
c=pa(a);a=a.oLanguage.oAria;for(var d=0,e=b.length;d<e;d++){var h=b[d];var g=h.asSorting;var f=h.ariaTitle||h.sTitle.replace(/<.*?>/g,"");var k=h.nTh;k.removeAttribute("aria-sort");h.bSortable&&(0<c.length&&c[0].col==d?(k.setAttribute("aria-sort","asc"==c[0].dir?"ascending":"descending"),h=g[c[0].index+1]||g[0]):h=g[0],f+="asc"===h?a.sSortAscending:a.sSortDescending);k.setAttribute("aria-label",f)}}function nb(a,b,c,d){var e=a.aaSorting,h=a.aoColumns[b].asSorting,g=function(f,k){var n=f._idx;n===
q&&(n=l.inArray(f[1],h));return n+1<h.length?n+1:k?null:0};"number"===typeof e[0]&&(e=a.aaSorting=[e]);c&&a.oFeatures.bSortMulti?(c=l.inArray(b,U(e,"0")),-1!==c?(b=g(e[c],!0),null===b&&1===e.length&&(b=0),null===b?e.splice(c,1):(e[c][1]=h[b],e[c]._idx=b)):(e.push([b,h[0],0]),e[e.length-1]._idx=0)):e.length&&e[0][0]==b?(b=g(e[0]),e.length=1,e[0][1]=h[b],e[0]._idx=b):(e.length=0,e.push([b,h[0]]),e[0]._idx=0);ka(a);"function"==typeof d&&d(a)}function eb(a,b,c,d){var e=a.aoColumns[c];ob(b,{},function(h){!1!==
e.bSortable&&(a.oFeatures.bProcessing?(V(a,!0),setTimeout(function(){nb(a,c,h.shiftKey,d);"ssp"!==Q(a)&&V(a,!1)},0)):nb(a,c,h.shiftKey,d))})}function Ra(a){var b=a.aLastSort,c=a.oClasses.sSortColumn,d=pa(a),e=a.oFeatures,h;if(e.bSort&&e.bSortClasses){e=0;for(h=b.length;e<h;e++){var g=b[e].src;l(U(a.aoData,"anCells",g)).removeClass(c+(2>e?e+1:3))}e=0;for(h=d.length;e<h;e++)g=d[e].src,l(U(a.aoData,"anCells",g)).addClass(c+(2>e?e+1:3))}a.aLastSort=d}function ac(a,b){var c=a.aoColumns[b],d=u.ext.order[c.sSortDataType],
e;d&&(e=d.call(a.oInstance,a,b,va(a,b)));for(var h,g=u.ext.type.order[c.sType+"-pre"],f=0,k=a.aoData.length;f<k;f++)if(c=a.aoData[f],c._aSortData||(c._aSortData=[]),!c._aSortData[b]||d)h=d?e[f]:T(a,f,b,"sort"),c._aSortData[b]=g?g(h):h}function qa(a){var b={time:+new Date,start:a._iDisplayStart,length:a._iDisplayLength,order:l.extend(!0,[],a.aaSorting),search:Ub(a.oPreviousSearch),columns:l.map(a.aoColumns,function(c,d){return{visible:c.bVisible,search:Ub(a.aoPreSearchCols[d])}})};a.oSavedState=b;
F(a,"aoStateSaveParams","stateSaveParams",[a,b]);a.oFeatures.bStateSave&&!a.bDestroying&&a.fnStateSaveCallback.call(a.oInstance,a,b)}function cc(a,b,c){var d,e,h=a.aoColumns;b=function(f){if(f&&f.time){var k=F(a,"aoStateLoadParams","stateLoadParams",[a,f]);if(-1===l.inArray(!1,k)&&(k=a.iStateDuration,!(0<k&&f.time<+new Date-1E3*k||f.columns&&h.length!==f.columns.length))){a.oLoadedState=l.extend(!0,{},f);f.start!==q&&(a._iDisplayStart=f.start,a.iInitDisplayStart=f.start);f.length!==q&&(a._iDisplayLength=
f.length);f.order!==q&&(a.aaSorting=[],l.each(f.order,function(n,m){a.aaSorting.push(m[0]>=h.length?[0,m[1]]:m)}));f.search!==q&&l.extend(a.oPreviousSearch,Vb(f.search));if(f.columns)for(d=0,e=f.columns.length;d<e;d++)k=f.columns[d],k.visible!==q&&(h[d].bVisible=k.visible),k.search!==q&&l.extend(a.aoPreSearchCols[d],Vb(k.search));F(a,"aoStateLoaded","stateLoaded",[a,f])}}c()};if(a.oFeatures.bStateSave){var g=a.fnStateLoadCallback.call(a.oInstance,a,b);g!==q&&b(g)}else c()}function Sa(a){var b=u.settings;
a=l.inArray(a,U(b,"nTable"));return-1!==a?b[a]:null}function da(a,b,c,d){c="DataTables warning: "+(a?"table id="+a.sTableId+" - ":"")+c;d&&(c+=". For more information about this error, please see http://datatables.net/tn/"+d);if(b)z.console&&console.log&&console.log(c);else if(b=u.ext,b=b.sErrMode||b.errMode,a&&F(a,null,"error",[a,d,c]),"alert"==b)alert(c);else{if("throw"==b)throw Error(c);"function"==typeof b&&b(a,d,c)}}function X(a,b,c,d){Array.isArray(c)?l.each(c,function(e,h){Array.isArray(h)?
X(a,b,h[0],h[1]):X(a,b,h)}):(d===q&&(d=c),b[c]!==q&&(a[d]=b[c]))}function pb(a,b,c){var d;for(d in b)if(b.hasOwnProperty(d)){var e=b[d];l.isPlainObject(e)?(l.isPlainObject(a[d])||(a[d]={}),l.extend(!0,a[d],e)):c&&"data"!==d&&"aaData"!==d&&Array.isArray(e)?a[d]=e.slice():a[d]=e}return a}function ob(a,b,c){l(a).on("click.DT",b,function(d){l(a).trigger("blur");c(d)}).on("keypress.DT",b,function(d){13===d.which&&(d.preventDefault(),c(d))}).on("selectstart.DT",function(){return!1})}function R(a,b,c,d){c&&
a[b].push({fn:c,sName:d})}function F(a,b,c,d){var e=[];b&&(e=l.map(a[b].slice().reverse(),function(h,g){return h.fn.apply(a.oInstance,d)}));null!==c&&(b=l.Event(c+".dt"),l(a.nTable).trigger(b,d),e.push(b.result));return e}function kb(a){var b=a._iDisplayStart,c=a.fnDisplayEnd(),d=a._iDisplayLength;b>=c&&(b=c-d);b-=b%d;if(-1===d||0>b)b=0;a._iDisplayStart=b}function fb(a,b){a=a.renderer;var c=u.ext.renderer[b];return l.isPlainObject(a)&&a[b]?c[a[b]]||c._:"string"===typeof a?c[a]||c._:c._}function Q(a){return a.oFeatures.bServerSide?
"ssp":a.ajax||a.sAjaxSource?"ajax":"dom"}function Da(a,b){var c=dc.numbers_length,d=Math.floor(c/2);b<=c?a=ra(0,b):a<=d?(a=ra(0,c-2),a.push("ellipsis"),a.push(b-1)):(a>=b-1-d?a=ra(b-(c-2),b):(a=ra(a-d+2,a+d-1),a.push("ellipsis"),a.push(b-1)),a.splice(0,0,"ellipsis"),a.splice(0,0,0));a.DT_el="span";return a}function Wa(a){l.each({num:function(b){return Ta(b,a)},"num-fmt":function(b){return Ta(b,a,qb)},"html-num":function(b){return Ta(b,a,Ua)},"html-num-fmt":function(b){return Ta(b,a,Ua,qb)}},function(b,
c){M.type.order[b+a+"-pre"]=c;b.match(/^html\-/)&&(M.type.search[b+a]=M.type.search.html)})}function ec(a){return function(){var b=[Sa(this[u.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return u.ext.internal[a].apply(this,b)}}var u=function(a,b){if(this instanceof u)return l(a).DataTable(b);b=a;this.$=function(g,f){return this.api(!0).$(g,f)};this._=function(g,f){return this.api(!0).rows(g,f).data()};this.api=function(g){return g?new B(Sa(this[M.iApiIndex])):new B(this)};this.fnAddData=
function(g,f){var k=this.api(!0);g=Array.isArray(g)&&(Array.isArray(g[0])||l.isPlainObject(g[0]))?k.rows.add(g):k.row.add(g);(f===q||f)&&k.draw();return g.flatten().toArray()};this.fnAdjustColumnSizing=function(g){var f=this.api(!0).columns.adjust(),k=f.settings()[0],n=k.oScroll;g===q||g?f.draw(!1):(""!==n.sX||""!==n.sY)&&Ha(k)};this.fnClearTable=function(g){var f=this.api(!0).clear();(g===q||g)&&f.draw()};this.fnClose=function(g){this.api(!0).row(g).child.hide()};this.fnDeleteRow=function(g,f,k){var n=
this.api(!0);g=n.rows(g);var m=g.settings()[0],p=m.aoData[g[0][0]];g.remove();f&&f.call(this,m,p);(k===q||k)&&n.draw();return p};this.fnDestroy=function(g){this.api(!0).destroy(g)};this.fnDraw=function(g){this.api(!0).draw(g)};this.fnFilter=function(g,f,k,n,m,p){m=this.api(!0);null===f||f===q?m.search(g,k,n,p):m.column(f).search(g,k,n,p);m.draw()};this.fnGetData=function(g,f){var k=this.api(!0);if(g!==q){var n=g.nodeName?g.nodeName.toLowerCase():"";return f!==q||"td"==n||"th"==n?k.cell(g,f).data():
k.row(g).data()||null}return k.data().toArray()};this.fnGetNodes=function(g){var f=this.api(!0);return g!==q?f.row(g).node():f.rows().nodes().flatten().toArray()};this.fnGetPosition=function(g){var f=this.api(!0),k=g.nodeName.toUpperCase();return"TR"==k?f.row(g).index():"TD"==k||"TH"==k?(g=f.cell(g).index(),[g.row,g.columnVisible,g.column]):null};this.fnIsOpen=function(g){return this.api(!0).row(g).child.isShown()};this.fnOpen=function(g,f,k){return this.api(!0).row(g).child(f,k).show().child()[0]};
this.fnPageChange=function(g,f){g=this.api(!0).page(g);(f===q||f)&&g.draw(!1)};this.fnSetColumnVis=function(g,f,k){g=this.api(!0).column(g).visible(f);(k===q||k)&&g.columns.adjust().draw()};this.fnSettings=function(){return Sa(this[M.iApiIndex])};this.fnSort=function(g){this.api(!0).order(g).draw()};this.fnSortListener=function(g,f,k){this.api(!0).order.listener(g,f,k)};this.fnUpdate=function(g,f,k,n,m){var p=this.api(!0);k===q||null===k?p.row(f).data(g):p.cell(f,k).data(g);(m===q||m)&&p.columns.adjust();
(n===q||n)&&p.draw();return 0};this.fnVersionCheck=M.fnVersionCheck;var c=this,d=b===q,e=this.length;d&&(b={});this.oApi=this.internal=M.internal;for(var h in u.ext.internal)h&&(this[h]=ec(h));this.each(function(){var g={},f=1<e?pb(g,b,!0):b,k=0,n;g=this.getAttribute("id");var m=!1,p=u.defaults,t=l(this);if("table"!=this.nodeName.toLowerCase())da(null,0,"Non-table node initialisation ("+this.nodeName+")",2);else{yb(p);zb(p.column);P(p,p,!0);P(p.column,p.column,!0);P(p,l.extend(f,t.data()),!0);var v=
u.settings;k=0;for(n=v.length;k<n;k++){var x=v[k];if(x.nTable==this||x.nTHead&&x.nTHead.parentNode==this||x.nTFoot&&x.nTFoot.parentNode==this){var w=f.bRetrieve!==q?f.bRetrieve:p.bRetrieve;if(d||w)return x.oInstance;if(f.bDestroy!==q?f.bDestroy:p.bDestroy){x.oInstance.fnDestroy();break}else{da(x,0,"Cannot reinitialise DataTable",3);return}}if(x.sTableId==this.id){v.splice(k,1);break}}if(null===g||""===g)this.id=g="DataTables_Table_"+u.ext._unique++;var r=l.extend(!0,{},u.models.oSettings,{sDestroyWidth:t[0].style.width,
sInstance:g,sTableId:g});r.nTable=this;r.oApi=c.internal;r.oInit=f;v.push(r);r.oInstance=1===c.length?c:t.dataTable();yb(f);ma(f.oLanguage);f.aLengthMenu&&!f.iDisplayLength&&(f.iDisplayLength=Array.isArray(f.aLengthMenu[0])?f.aLengthMenu[0][0]:f.aLengthMenu[0]);f=pb(l.extend(!0,{},p),f);X(r.oFeatures,f,"bPaginate bLengthChange bFilter bSort bSortMulti bInfo bProcessing bAutoWidth bSortClasses bServerSide bDeferRender".split(" "));X(r,f,["asStripeClasses","ajax","fnServerData","fnFormatNumber","sServerMethod",
"aaSorting","aaSortingFixed","aLengthMenu","sPaginationType","sAjaxSource","sAjaxDataProp","iStateDuration","sDom","bSortCellsTop","iTabIndex","fnStateLoadCallback","fnStateSaveCallback","renderer","searchDelay","rowId",["iCookieDuration","iStateDuration"],["oSearch","oPreviousSearch"],["aoSearchCols","aoPreSearchCols"],["iDisplayLength","_iDisplayLength"]]);X(r.oScroll,f,[["sScrollX","sX"],["sScrollXInner","sXInner"],["sScrollY","sY"],["bScrollCollapse","bCollapse"]]);X(r.oLanguage,f,"fnInfoCallback");
R(r,"aoDrawCallback",f.fnDrawCallback,"user");R(r,"aoServerParams",f.fnServerParams,"user");R(r,"aoStateSaveParams",f.fnStateSaveParams,"user");R(r,"aoStateLoadParams",f.fnStateLoadParams,"user");R(r,"aoStateLoaded",f.fnStateLoaded,"user");R(r,"aoRowCallback",f.fnRowCallback,"user");R(r,"aoRowCreatedCallback",f.fnCreatedRow,"user");R(r,"aoHeaderCallback",f.fnHeaderCallback,"user");R(r,"aoFooterCallback",f.fnFooterCallback,"user");R(r,"aoInitComplete",f.fnInitComplete,"user");R(r,"aoPreDrawCallback",
f.fnPreDrawCallback,"user");r.rowIdFn=na(f.rowId);Ab(r);var C=r.oClasses;l.extend(C,u.ext.classes,f.oClasses);t.addClass(C.sTable);r.iInitDisplayStart===q&&(r.iInitDisplayStart=f.iDisplayStart,r._iDisplayStart=f.iDisplayStart);null!==f.iDeferLoading&&(r.bDeferLoading=!0,g=Array.isArray(f.iDeferLoading),r._iRecordsDisplay=g?f.iDeferLoading[0]:f.iDeferLoading,r._iRecordsTotal=g?f.iDeferLoading[1]:f.iDeferLoading);var G=r.oLanguage;l.extend(!0,G,f.oLanguage);G.sUrl?(l.ajax({dataType:"json",url:G.sUrl,
success:function(I){P(p.oLanguage,I);ma(I);l.extend(!0,G,I);F(r,null,"i18n",[r]);Ba(r)},error:function(){Ba(r)}}),m=!0):F(r,null,"i18n",[r]);null===f.asStripeClasses&&(r.asStripeClasses=[C.sStripeOdd,C.sStripeEven]);g=r.asStripeClasses;var aa=t.children("tbody").find("tr").eq(0);-1!==l.inArray(!0,l.map(g,function(I,H){return aa.hasClass(I)}))&&(l("tbody tr",this).removeClass(g.join(" ")),r.asDestroyStripes=g.slice());g=[];v=this.getElementsByTagName("thead");0!==v.length&&(xa(r.aoHeader,v[0]),g=Na(r));
if(null===f.aoColumns)for(v=[],k=0,n=g.length;k<n;k++)v.push(null);else v=f.aoColumns;k=0;for(n=v.length;k<n;k++)Xa(r,g?g[k]:null);Cb(r,f.aoColumnDefs,v,function(I,H){Ga(r,I,H)});if(aa.length){var L=function(I,H){return null!==I.getAttribute("data-"+H)?H:null};l(aa[0]).children("th, td").each(function(I,H){var ea=r.aoColumns[I];if(ea.mData===I){var Y=L(H,"sort")||L(H,"order");H=L(H,"filter")||L(H,"search");if(null!==Y||null!==H)ea.mData={_:I+".display",sort:null!==Y?I+".@data-"+Y:q,type:null!==Y?
I+".@data-"+Y:q,filter:null!==H?I+".@data-"+H:q},Ga(r,I)}})}var O=r.oFeatures;g=function(){if(f.aaSorting===q){var I=r.aaSorting;k=0;for(n=I.length;k<n;k++)I[k][1]=r.aoColumns[k].asSorting[0]}Ra(r);O.bSort&&R(r,"aoDrawCallback",function(){if(r.bSorted){var Y=pa(r),Ca={};l.each(Y,function(fa,ba){Ca[ba.src]=ba.dir});F(r,null,"order",[r,Y,Ca]);bc(r)}});R(r,"aoDrawCallback",function(){(r.bSorted||"ssp"===Q(r)||O.bDeferRender)&&Ra(r)},"sc");I=t.children("caption").each(function(){this._captionSide=l(this).css("caption-side")});
var H=t.children("thead");0===H.length&&(H=l("<thead/>").appendTo(t));r.nTHead=H[0];var ea=t.children("tbody");0===ea.length&&(ea=l("<tbody/>").insertAfter(H));r.nTBody=ea[0];H=t.children("tfoot");0===H.length&&0<I.length&&(""!==r.oScroll.sX||""!==r.oScroll.sY)&&(H=l("<tfoot/>").appendTo(t));0===H.length||0===H.children().length?t.addClass(C.sNoFooter):0<H.length&&(r.nTFoot=H[0],xa(r.aoFooter,r.nTFoot));if(f.aaData)for(k=0;k<f.aaData.length;k++)ia(r,f.aaData[k]);else(r.bDeferLoading||"dom"==Q(r))&&
Ja(r,l(r.nTBody).children("tr"));r.aiDisplay=r.aiDisplayMaster.slice();r.bInitialised=!0;!1===m&&Ba(r)};R(r,"aoDrawCallback",qa,"state_save");f.bStateSave?(O.bStateSave=!0,cc(r,f,g)):g()}});c=null;return this},M,y,J,rb={},fc=/[\r\n\u2028]/g,Ua=/<.*?>/g,sc=/^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/,tc=/(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\|\$|\^|\-)/g,qb=/['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi,Z=function(a){return a&&!0!==a&&"-"!==a?!1:!0},gc=
function(a){var b=parseInt(a,10);return!isNaN(b)&&isFinite(a)?b:null},hc=function(a,b){rb[b]||(rb[b]=new RegExp(ib(b),"g"));return"string"===typeof a&&"."!==b?a.replace(/\./g,"").replace(rb[b],"."):a},sb=function(a,b,c){var d="string"===typeof a;if(Z(a))return!0;b&&d&&(a=hc(a,b));c&&d&&(a=a.replace(qb,""));return!isNaN(parseFloat(a))&&isFinite(a)},ic=function(a,b,c){return Z(a)?!0:Z(a)||"string"===typeof a?sb(a.replace(Ua,""),b,c)?!0:null:null},U=function(a,b,c){var d=[],e=0,h=a.length;if(c!==q)for(;e<
h;e++)a[e]&&a[e][b]&&d.push(a[e][b][c]);else for(;e<h;e++)a[e]&&d.push(a[e][b]);return d},Ea=function(a,b,c,d){var e=[],h=0,g=b.length;if(d!==q)for(;h<g;h++)a[b[h]][c]&&e.push(a[b[h]][c][d]);else for(;h<g;h++)e.push(a[b[h]][c]);return e},ra=function(a,b){var c=[];if(b===q){b=0;var d=a}else d=b,b=a;for(a=b;a<d;a++)c.push(a);return c},jc=function(a){for(var b=[],c=0,d=a.length;c<d;c++)a[c]&&b.push(a[c]);return b},Ma=function(a){a:{if(!(2>a.length)){var b=a.slice().sort();for(var c=b[0],d=1,e=b.length;d<
e;d++){if(b[d]===c){b=!1;break a}c=b[d]}}b=!0}if(b)return a.slice();b=[];e=a.length;var h,g=0;d=0;a:for(;d<e;d++){c=a[d];for(h=0;h<g;h++)if(b[h]===c)continue a;b.push(c);g++}return b},kc=function(a,b){if(Array.isArray(b))for(var c=0;c<b.length;c++)kc(a,b[c]);else a.push(b);return a};Array.isArray||(Array.isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)});String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
"")});u.util={throttle:function(a,b){var c=b!==q?b:200,d,e;return function(){var h=this,g=+new Date,f=arguments;d&&g<d+c?(clearTimeout(e),e=setTimeout(function(){d=q;a.apply(h,f)},c)):(d=g,a.apply(h,f))}},escapeRegex:function(a){return a.replace(tc,"\\$1")},set:function(a){if(l.isPlainObject(a))return u.util.set(a._);if(null===a)return function(){};if("function"===typeof a)return function(c,d,e){a(c,"set",d,e)};if("string"!==typeof a||-1===a.indexOf(".")&&-1===a.indexOf("[")&&-1===a.indexOf("("))return function(c,
d){c[a]=d};var b=function(c,d,e){e=bb(e);var h=e[e.length-1];for(var g,f,k=0,n=e.length-1;k<n;k++){if("__proto__"===e[k]||"constructor"===e[k])throw Error("Cannot set prototype values");g=e[k].match(Fa);f=e[k].match(sa);if(g){e[k]=e[k].replace(Fa,"");c[e[k]]=[];h=e.slice();h.splice(0,k+1);g=h.join(".");if(Array.isArray(d))for(f=0,n=d.length;f<n;f++)h={},b(h,d[f],g),c[e[k]].push(h);else c[e[k]]=d;return}f&&(e[k]=e[k].replace(sa,""),c=c[e[k]](d));if(null===c[e[k]]||c[e[k]]===q)c[e[k]]={};c=c[e[k]]}if(h.match(sa))c[h.replace(sa,
"")](d);else c[h.replace(Fa,"")]=d};return function(c,d){return b(c,d,a)}},get:function(a){if(l.isPlainObject(a)){var b={};l.each(a,function(d,e){e&&(b[d]=u.util.get(e))});return function(d,e,h,g){var f=b[e]||b._;return f!==q?f(d,e,h,g):d}}if(null===a)return function(d){return d};if("function"===typeof a)return function(d,e,h,g){return a(d,e,h,g)};if("string"!==typeof a||-1===a.indexOf(".")&&-1===a.indexOf("[")&&-1===a.indexOf("("))return function(d,e){return d[a]};var c=function(d,e,h){if(""!==h){var g=
bb(h);for(var f=0,k=g.length;f<k;f++){h=g[f].match(Fa);var n=g[f].match(sa);if(h){g[f]=g[f].replace(Fa,"");""!==g[f]&&(d=d[g[f]]);n=[];g.splice(0,f+1);g=g.join(".");if(Array.isArray(d))for(f=0,k=d.length;f<k;f++)n.push(c(d[f],e,g));d=h[0].substring(1,h[0].length-1);d=""===d?n:n.join(d);break}else if(n){g[f]=g[f].replace(sa,"");d=d[g[f]]();continue}if(null===d||d[g[f]]===q)return q;d=d[g[f]]}}return d};return function(d,e){return c(d,e,a)}}};var S=function(a,b,c){a[b]!==q&&(a[c]=a[b])},Fa=/\[.*?\]$/,
sa=/\(\)$/,na=u.util.get,ha=u.util.set,ib=u.util.escapeRegex,Qa=l("<div>")[0],qc=Qa.textContent!==q,rc=/<.*?>/g,gb=u.util.throttle,lc=[],N=Array.prototype,uc=function(a){var b,c=u.settings,d=l.map(c,function(h,g){return h.nTable});if(a){if(a.nTable&&a.oApi)return[a];if(a.nodeName&&"table"===a.nodeName.toLowerCase()){var e=l.inArray(a,d);return-1!==e?[c[e]]:null}if(a&&"function"===typeof a.settings)return a.settings().toArray();"string"===typeof a?b=l(a):a instanceof l&&(b=a)}else return[];if(b)return b.map(function(h){e=
l.inArray(this,d);return-1!==e?c[e]:null}).toArray()};var B=function(a,b){if(!(this instanceof B))return new B(a,b);var c=[],d=function(g){(g=uc(g))&&c.push.apply(c,g)};if(Array.isArray(a))for(var e=0,h=a.length;e<h;e++)d(a[e]);else d(a);this.context=Ma(c);b&&l.merge(this,b);this.selector={rows:null,cols:null,opts:null};B.extend(this,this,lc)};u.Api=B;l.extend(B.prototype,{any:function(){return 0!==this.count()},concat:N.concat,context:[],count:function(){return this.flatten().length},each:function(a){for(var b=
0,c=this.length;b<c;b++)a.call(this,this[b],b,this);return this},eq:function(a){var b=this.context;return b.length>a?new B(b[a],this[a]):null},filter:function(a){var b=[];if(N.filter)b=N.filter.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)a.call(this,this[c],c,this)&&b.push(this[c]);return new B(this.context,b)},flatten:function(){var a=[];return new B(this.context,a.concat.apply(a,this.toArray()))},join:N.join,indexOf:N.indexOf||function(a,b){b=b||0;for(var c=this.length;b<c;b++)if(this[b]===
a)return b;return-1},iterator:function(a,b,c,d){var e=[],h,g,f=this.context,k,n=this.selector;"string"===typeof a&&(d=c,c=b,b=a,a=!1);var m=0;for(h=f.length;m<h;m++){var p=new B(f[m]);if("table"===b){var t=c.call(p,f[m],m);t!==q&&e.push(t)}else if("columns"===b||"rows"===b)t=c.call(p,f[m],this[m],m),t!==q&&e.push(t);else if("column"===b||"column-rows"===b||"row"===b||"cell"===b){var v=this[m];"column-rows"===b&&(k=Va(f[m],n.opts));var x=0;for(g=v.length;x<g;x++)t=v[x],t="cell"===b?c.call(p,f[m],t.row,
t.column,m,x):c.call(p,f[m],t,m,x,k),t!==q&&e.push(t)}}return e.length||d?(a=new B(f,a?e.concat.apply([],e):e),b=a.selector,b.rows=n.rows,b.cols=n.cols,b.opts=n.opts,a):this},lastIndexOf:N.lastIndexOf||function(a,b){return this.indexOf.apply(this.toArray.reverse(),arguments)},length:0,map:function(a){var b=[];if(N.map)b=N.map.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)b.push(a.call(this,this[c],c));return new B(this.context,b)},pluck:function(a){return this.map(function(b){return b[a]})},
pop:N.pop,push:N.push,reduce:N.reduce||function(a,b){return Bb(this,a,b,0,this.length,1)},reduceRight:N.reduceRight||function(a,b){return Bb(this,a,b,this.length-1,-1,-1)},reverse:N.reverse,selector:null,shift:N.shift,slice:function(){return new B(this.context,this)},sort:N.sort,splice:N.splice,toArray:function(){return N.slice.call(this)},to$:function(){return l(this)},toJQuery:function(){return l(this)},unique:function(){return new B(this.context,Ma(this))},unshift:N.unshift});B.extend=function(a,
b,c){if(c.length&&b&&(b instanceof B||b.__dt_wrapper)){var d,e=function(f,k,n){return function(){var m=k.apply(f,arguments);B.extend(m,m,n.methodExt);return m}};var h=0;for(d=c.length;h<d;h++){var g=c[h];b[g.name]="function"===g.type?e(a,g.val,g):"object"===g.type?{}:g.val;b[g.name].__dt_wrapper=!0;B.extend(a,b[g.name],g.propExt)}}};B.register=y=function(a,b){if(Array.isArray(a))for(var c=0,d=a.length;c<d;c++)B.register(a[c],b);else{d=a.split(".");var e=lc,h;a=0;for(c=d.length;a<c;a++){var g=(h=-1!==
d[a].indexOf("()"))?d[a].replace("()",""):d[a];a:{var f=0;for(var k=e.length;f<k;f++)if(e[f].name===g){f=e[f];break a}f=null}f||(f={name:g,val:{},methodExt:[],propExt:[],type:"object"},e.push(f));a===c-1?(f.val=b,f.type="function"===typeof b?"function":l.isPlainObject(b)?"object":"other"):e=h?f.methodExt:f.propExt}}};B.registerPlural=J=function(a,b,c){B.register(a,c);B.register(b,function(){var d=c.apply(this,arguments);return d===this?this:d instanceof B?d.length?Array.isArray(d[0])?new B(d.context,
d[0]):d[0]:q:d})};var mc=function(a,b){if(Array.isArray(a))return l.map(a,function(d){return mc(d,b)});if("number"===typeof a)return[b[a]];var c=l.map(b,function(d,e){return d.nTable});return l(c).filter(a).map(function(d){d=l.inArray(this,c);return b[d]}).toArray()};y("tables()",function(a){return a!==q&&null!==a?new B(mc(a,this.context)):this});y("table()",function(a){a=this.tables(a);var b=a.context;return b.length?new B(b[0]):a});J("tables().nodes()","table().node()",function(){return this.iterator("table",
function(a){return a.nTable},1)});J("tables().body()","table().body()",function(){return this.iterator("table",function(a){return a.nTBody},1)});J("tables().header()","table().header()",function(){return this.iterator("table",function(a){return a.nTHead},1)});J("tables().footer()","table().footer()",function(){return this.iterator("table",function(a){return a.nTFoot},1)});J("tables().containers()","table().container()",function(){return this.iterator("table",function(a){return a.nTableWrapper},1)});
y("draw()",function(a){return this.iterator("table",function(b){"page"===a?ja(b):("string"===typeof a&&(a="full-hold"===a?!1:!0),ka(b,!1===a))})});y("page()",function(a){return a===q?this.page.info().page:this.iterator("table",function(b){lb(b,a)})});y("page.info()",function(a){if(0===this.context.length)return q;a=this.context[0];var b=a._iDisplayStart,c=a.oFeatures.bPaginate?a._iDisplayLength:-1,d=a.fnRecordsDisplay(),e=-1===c;return{page:e?0:Math.floor(b/c),pages:e?1:Math.ceil(d/c),start:b,end:a.fnDisplayEnd(),
length:c,recordsTotal:a.fnRecordsTotal(),recordsDisplay:d,serverSide:"ssp"===Q(a)}});y("page.len()",function(a){return a===q?0!==this.context.length?this.context[0]._iDisplayLength:q:this.iterator("table",function(b){jb(b,a)})});var nc=function(a,b,c){if(c){var d=new B(a);d.one("draw",function(){c(d.ajax.json())})}if("ssp"==Q(a))ka(a,b);else{V(a,!0);var e=a.jqXHR;e&&4!==e.readyState&&e.abort();Oa(a,[],function(h){Ka(a);h=Aa(a,h);for(var g=0,f=h.length;g<f;g++)ia(a,h[g]);ka(a,b);V(a,!1)})}};y("ajax.json()",
function(){var a=this.context;if(0<a.length)return a[0].json});y("ajax.params()",function(){var a=this.context;if(0<a.length)return a[0].oAjaxData});y("ajax.reload()",function(a,b){return this.iterator("table",function(c){nc(c,!1===b,a)})});y("ajax.url()",function(a){var b=this.context;if(a===q){if(0===b.length)return q;b=b[0];return b.ajax?l.isPlainObject(b.ajax)?b.ajax.url:b.ajax:b.sAjaxSource}return this.iterator("table",function(c){l.isPlainObject(c.ajax)?c.ajax.url=a:c.ajax=a})});y("ajax.url().load()",
function(a,b){return this.iterator("table",function(c){nc(c,!1===b,a)})});var tb=function(a,b,c,d,e){var h=[],g,f,k;var n=typeof b;b&&"string"!==n&&"function"!==n&&b.length!==q||(b=[b]);n=0;for(f=b.length;n<f;n++){var m=b[n]&&b[n].split&&!b[n].match(/[\[\(:]/)?b[n].split(","):[b[n]];var p=0;for(k=m.length;p<k;p++)(g=c("string"===typeof m[p]?m[p].trim():m[p]))&&g.length&&(h=h.concat(g))}a=M.selector[a];if(a.length)for(n=0,f=a.length;n<f;n++)h=a[n](d,e,h);return Ma(h)},ub=function(a){a||(a={});a.filter&&
a.search===q&&(a.search=a.filter);return l.extend({search:"none",order:"current",page:"all"},a)},vb=function(a){for(var b=0,c=a.length;b<c;b++)if(0<a[b].length)return a[0]=a[b],a[0].length=1,a.length=1,a.context=[a.context[b]],a;a.length=0;return a},Va=function(a,b){var c=[],d=a.aiDisplay;var e=a.aiDisplayMaster;var h=b.search;var g=b.order;b=b.page;if("ssp"==Q(a))return"removed"===h?[]:ra(0,e.length);if("current"==b)for(g=a._iDisplayStart,a=a.fnDisplayEnd();g<a;g++)c.push(d[g]);else if("current"==
g||"applied"==g)if("none"==h)c=e.slice();else if("applied"==h)c=d.slice();else{if("removed"==h){var f={};g=0;for(a=d.length;g<a;g++)f[d[g]]=null;c=l.map(e,function(k){return f.hasOwnProperty(k)?null:k})}}else if("index"==g||"original"==g)for(g=0,a=a.aoData.length;g<a;g++)"none"==h?c.push(g):(e=l.inArray(g,d),(-1===e&&"removed"==h||0<=e&&"applied"==h)&&c.push(g));return c},vc=function(a,b,c){var d;return tb("row",b,function(e){var h=gc(e),g=a.aoData;if(null!==h&&!c)return[h];d||(d=Va(a,c));if(null!==
h&&-1!==l.inArray(h,d))return[h];if(null===e||e===q||""===e)return d;if("function"===typeof e)return l.map(d,function(k){var n=g[k];return e(k,n._aData,n.nTr)?k:null});if(e.nodeName){h=e._DT_RowIndex;var f=e._DT_CellIndex;if(h!==q)return g[h]&&g[h].nTr===e?[h]:[];if(f)return g[f.row]&&g[f.row].nTr===e.parentNode?[f.row]:[];h=l(e).closest("*[data-dt-row]");return h.length?[h.data("dt-row")]:[]}if("string"===typeof e&&"#"===e.charAt(0)&&(h=a.aIds[e.replace(/^#/,"")],h!==q))return[h.idx];h=jc(Ea(a.aoData,
d,"nTr"));return l(h).filter(e).map(function(){return this._DT_RowIndex}).toArray()},a,c)};y("rows()",function(a,b){a===q?a="":l.isPlainObject(a)&&(b=a,a="");b=ub(b);var c=this.iterator("table",function(d){return vc(d,a,b)},1);c.selector.rows=a;c.selector.opts=b;return c});y("rows().nodes()",function(){return this.iterator("row",function(a,b){return a.aoData[b].nTr||q},1)});y("rows().data()",function(){return this.iterator(!0,"rows",function(a,b){return Ea(a.aoData,b,"_aData")},1)});J("rows().cache()",
"row().cache()",function(a){return this.iterator("row",function(b,c){b=b.aoData[c];return"search"===a?b._aFilterData:b._aSortData},1)});J("rows().invalidate()","row().invalidate()",function(a){return this.iterator("row",function(b,c){wa(b,c,a)})});J("rows().indexes()","row().index()",function(){return this.iterator("row",function(a,b){return b},1)});J("rows().ids()","row().id()",function(a){for(var b=[],c=this.context,d=0,e=c.length;d<e;d++)for(var h=0,g=this[d].length;h<g;h++){var f=c[d].rowIdFn(c[d].aoData[this[d][h]]._aData);
b.push((!0===a?"#":"")+f)}return new B(c,b)});J("rows().remove()","row().remove()",function(){var a=this;this.iterator("row",function(b,c,d){var e=b.aoData,h=e[c],g,f;e.splice(c,1);var k=0;for(g=e.length;k<g;k++){var n=e[k];var m=n.anCells;null!==n.nTr&&(n.nTr._DT_RowIndex=k);if(null!==m)for(n=0,f=m.length;n<f;n++)m[n]._DT_CellIndex.row=k}La(b.aiDisplayMaster,c);La(b.aiDisplay,c);La(a[d],c,!1);0<b._iRecordsDisplay&&b._iRecordsDisplay--;kb(b);c=b.rowIdFn(h._aData);c!==q&&delete b.aIds[c]});this.iterator("table",
function(b){for(var c=0,d=b.aoData.length;c<d;c++)b.aoData[c].idx=c});return this});y("rows.add()",function(a){var b=this.iterator("table",function(d){var e,h=[];var g=0;for(e=a.length;g<e;g++){var f=a[g];f.nodeName&&"TR"===f.nodeName.toUpperCase()?h.push(Ja(d,f)[0]):h.push(ia(d,f))}return h},1),c=this.rows(-1);c.pop();l.merge(c,b);return c});y("row()",function(a,b){return vb(this.rows(a,b))});y("row().data()",function(a){var b=this.context;if(a===q)return b.length&&this.length?b[0].aoData[this[0]]._aData:
q;var c=b[0].aoData[this[0]];c._aData=a;Array.isArray(a)&&c.nTr&&c.nTr.id&&ha(b[0].rowId)(a,c.nTr.id);wa(b[0],this[0],"data");return this});y("row().node()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]].nTr||null:null});y("row.add()",function(a){a instanceof l&&a.length&&(a=a[0]);var b=this.iterator("table",function(c){return a.nodeName&&"TR"===a.nodeName.toUpperCase()?Ja(c,a)[0]:ia(c,a)});return this.row(b[0])});l(A).on("plugin-init.dt",function(a,b){var c=new B(b);
c.on("stateSaveParams",function(d,e,h){d=c.rows().iterator("row",function(g,f){return g.aoData[f]._detailsShow?f:q});h.childRows=c.rows(d).ids(!0).toArray()});(a=c.state.loaded())&&a.childRows&&c.rows(a.childRows).every(function(){F(b,null,"requestChild",[this])})});var wc=function(a,b,c,d){var e=[],h=function(g,f){if(Array.isArray(g)||g instanceof l)for(var k=0,n=g.length;k<n;k++)h(g[k],f);else g.nodeName&&"tr"===g.nodeName.toLowerCase()?e.push(g):(k=l("<tr><td></td></tr>").addClass(f),l("td",k).addClass(f).html(g)[0].colSpan=
oa(a),e.push(k[0]))};h(c,d);b._details&&b._details.detach();b._details=l(e);b._detailsShow&&b._details.insertAfter(b.nTr)},wb=function(a,b){var c=a.context;c.length&&(a=c[0].aoData[b!==q?b:a[0]])&&a._details&&(a._details.remove(),a._detailsShow=q,a._details=q,l(a.nTr).removeClass("dt-hasChild"),qa(c[0]))},oc=function(a,b){var c=a.context;if(c.length&&a.length){var d=c[0].aoData[a[0]];d._details&&((d._detailsShow=b)?(d._details.insertAfter(d.nTr),l(d.nTr).addClass("dt-hasChild")):(d._details.detach(),
l(d.nTr).removeClass("dt-hasChild")),F(c[0],null,"childRow",[b,a.row(a[0])]),xc(c[0]),qa(c[0]))}},xc=function(a){var b=new B(a),c=a.aoData;b.off("draw.dt.DT_details column-visibility.dt.DT_details destroy.dt.DT_details");0<U(c,"_details").length&&(b.on("draw.dt.DT_details",function(d,e){a===e&&b.rows({page:"current"}).eq(0).each(function(h){h=c[h];h._detailsShow&&h._details.insertAfter(h.nTr)})}),b.on("column-visibility.dt.DT_details",function(d,e,h,g){if(a===e)for(e=oa(e),h=0,g=c.length;h<g;h++)d=
c[h],d._details&&d._details.children("td[colspan]").attr("colspan",e)}),b.on("destroy.dt.DT_details",function(d,e){if(a===e)for(d=0,e=c.length;d<e;d++)c[d]._details&&wb(b,d)}))};y("row().child()",function(a,b){var c=this.context;if(a===q)return c.length&&this.length?c[0].aoData[this[0]]._details:q;!0===a?this.child.show():!1===a?wb(this):c.length&&this.length&&wc(c[0],c[0].aoData[this[0]],a,b);return this});y(["row().child.show()","row().child().show()"],function(a){oc(this,!0);return this});y(["row().child.hide()",
"row().child().hide()"],function(){oc(this,!1);return this});y(["row().child.remove()","row().child().remove()"],function(){wb(this);return this});y("row().child.isShown()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]]._detailsShow||!1:!1});var yc=/^([^:]+):(name|visIdx|visible)$/,pc=function(a,b,c,d,e){c=[];d=0;for(var h=e.length;d<h;d++)c.push(T(a,e[d],b));return c},zc=function(a,b,c){var d=a.aoColumns,e=U(d,"sName"),h=U(d,"nTh");return tb("column",b,function(g){var f=
gc(g);if(""===g)return ra(d.length);if(null!==f)return[0<=f?f:d.length+f];if("function"===typeof g){var k=Va(a,c);return l.map(d,function(p,t){return g(t,pc(a,t,0,0,k),h[t])?t:null})}var n="string"===typeof g?g.match(yc):"";if(n)switch(n[2]){case "visIdx":case "visible":f=parseInt(n[1],10);if(0>f){var m=l.map(d,function(p,t){return p.bVisible?t:null});return[m[m.length+f]]}return[ua(a,f)];case "name":return l.map(e,function(p,t){return p===n[1]?t:null});default:return[]}if(g.nodeName&&g._DT_CellIndex)return[g._DT_CellIndex.column];
f=l(h).filter(g).map(function(){return l.inArray(this,h)}).toArray();if(f.length||!g.nodeName)return f;f=l(g).closest("*[data-dt-column]");return f.length?[f.data("dt-column")]:[]},a,c)};y("columns()",function(a,b){a===q?a="":l.isPlainObject(a)&&(b=a,a="");b=ub(b);var c=this.iterator("table",function(d){return zc(d,a,b)},1);c.selector.cols=a;c.selector.opts=b;return c});J("columns().header()","column().header()",function(a,b){return this.iterator("column",function(c,d){return c.aoColumns[d].nTh},
1)});J("columns().footer()","column().footer()",function(a,b){return this.iterator("column",function(c,d){return c.aoColumns[d].nTf},1)});J("columns().data()","column().data()",function(){return this.iterator("column-rows",pc,1)});J("columns().dataSrc()","column().dataSrc()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].mData},1)});J("columns().cache()","column().cache()",function(a){return this.iterator("column-rows",function(b,c,d,e,h){return Ea(b.aoData,h,"search"===
a?"_aFilterData":"_aSortData",c)},1)});J("columns().nodes()","column().nodes()",function(){return this.iterator("column-rows",function(a,b,c,d,e){return Ea(a.aoData,e,"anCells",b)},1)});J("columns().visible()","column().visible()",function(a,b){var c=this,d=this.iterator("column",function(e,h){if(a===q)return e.aoColumns[h].bVisible;var g=e.aoColumns,f=g[h],k=e.aoData,n;if(a!==q&&f.bVisible!==a){if(a){var m=l.inArray(!0,U(g,"bVisible"),h+1);g=0;for(n=k.length;g<n;g++){var p=k[g].nTr;e=k[g].anCells;
p&&p.insertBefore(e[h],e[m]||null)}}else l(U(e.aoData,"anCells",h)).detach();f.bVisible=a}});a!==q&&this.iterator("table",function(e){ya(e,e.aoHeader);ya(e,e.aoFooter);e.aiDisplay.length||l(e.nTBody).find("td[colspan]").attr("colspan",oa(e));qa(e);c.iterator("column",function(h,g){F(h,null,"column-visibility",[h,g,a,b])});(b===q||b)&&c.columns.adjust()});return d});J("columns().indexes()","column().index()",function(a){return this.iterator("column",function(b,c){return"visible"===a?va(b,c):c},1)});
y("columns.adjust()",function(){return this.iterator("table",function(a){ta(a)},1)});y("column.index()",function(a,b){if(0!==this.context.length){var c=this.context[0];if("fromVisible"===a||"toData"===a)return ua(c,b);if("fromData"===a||"toVisible"===a)return va(c,b)}});y("column()",function(a,b){return vb(this.columns(a,b))});var Ac=function(a,b,c){var d=a.aoData,e=Va(a,c),h=jc(Ea(d,e,"anCells")),g=l(kc([],h)),f,k=a.aoColumns.length,n,m,p,t,v,x;return tb("cell",b,function(w){var r="function"===typeof w;
if(null===w||w===q||r){n=[];m=0;for(p=e.length;m<p;m++)for(f=e[m],t=0;t<k;t++)v={row:f,column:t},r?(x=d[f],w(v,T(a,f,t),x.anCells?x.anCells[t]:null)&&n.push(v)):n.push(v);return n}if(l.isPlainObject(w))return w.column!==q&&w.row!==q&&-1!==l.inArray(w.row,e)?[w]:[];r=g.filter(w).map(function(C,G){return{row:G._DT_CellIndex.row,column:G._DT_CellIndex.column}}).toArray();if(r.length||!w.nodeName)return r;x=l(w).closest("*[data-dt-row]");return x.length?[{row:x.data("dt-row"),column:x.data("dt-column")}]:
[]},a,c)};y("cells()",function(a,b,c){l.isPlainObject(a)&&(a.row===q?(c=a,a=null):(c=b,b=null));l.isPlainObject(b)&&(c=b,b=null);if(null===b||b===q)return this.iterator("table",function(m){return Ac(m,a,ub(c))});var d=c?{page:c.page,order:c.order,search:c.search}:{},e=this.columns(b,d),h=this.rows(a,d),g,f,k,n;d=this.iterator("table",function(m,p){m=[];g=0;for(f=h[p].length;g<f;g++)for(k=0,n=e[p].length;k<n;k++)m.push({row:h[p][g],column:e[p][k]});return m},1);d=c&&c.selected?this.cells(d,c):d;l.extend(d.selector,
{cols:b,rows:a,opts:c});return d});J("cells().nodes()","cell().node()",function(){return this.iterator("cell",function(a,b,c){return(a=a.aoData[b])&&a.anCells?a.anCells[c]:q},1)});y("cells().data()",function(){return this.iterator("cell",function(a,b,c){return T(a,b,c)},1)});J("cells().cache()","cell().cache()",function(a){a="search"===a?"_aFilterData":"_aSortData";return this.iterator("cell",function(b,c,d){return b.aoData[c][a][d]},1)});J("cells().render()","cell().render()",function(a){return this.iterator("cell",
function(b,c,d){return T(b,c,d,a)},1)});J("cells().indexes()","cell().index()",function(){return this.iterator("cell",function(a,b,c){return{row:b,column:c,columnVisible:va(a,c)}},1)});J("cells().invalidate()","cell().invalidate()",function(a){return this.iterator("cell",function(b,c,d){wa(b,c,a,d)})});y("cell()",function(a,b,c){return vb(this.cells(a,b,c))});y("cell().data()",function(a){var b=this.context,c=this[0];if(a===q)return b.length&&c.length?T(b[0],c[0].row,c[0].column):q;Db(b[0],c[0].row,
c[0].column,a);wa(b[0],c[0].row,"data",c[0].column);return this});y("order()",function(a,b){var c=this.context;if(a===q)return 0!==c.length?c[0].aaSorting:q;"number"===typeof a?a=[[a,b]]:a.length&&!Array.isArray(a[0])&&(a=Array.prototype.slice.call(arguments));return this.iterator("table",function(d){d.aaSorting=a.slice()})});y("order.listener()",function(a,b,c){return this.iterator("table",function(d){eb(d,a,b,c)})});y("order.fixed()",function(a){if(!a){var b=this.context;b=b.length?b[0].aaSortingFixed:
q;return Array.isArray(b)?{pre:b}:b}return this.iterator("table",function(c){c.aaSortingFixed=l.extend(!0,{},a)})});y(["columns().order()","column().order()"],function(a){var b=this;return this.iterator("table",function(c,d){var e=[];l.each(b[d],function(h,g){e.push([g,a])});c.aaSorting=e})});y("search()",function(a,b,c,d){var e=this.context;return a===q?0!==e.length?e[0].oPreviousSearch.sSearch:q:this.iterator("table",function(h){h.oFeatures.bFilter&&za(h,l.extend({},h.oPreviousSearch,{sSearch:a+
"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),1)})});J("columns().search()","column().search()",function(a,b,c,d){return this.iterator("column",function(e,h){var g=e.aoPreSearchCols;if(a===q)return g[h].sSearch;e.oFeatures.bFilter&&(l.extend(g[h],{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),za(e,e.oPreviousSearch,1))})});y("state()",function(){return this.context.length?this.context[0].oSavedState:null});y("state.clear()",
function(){return this.iterator("table",function(a){a.fnStateSaveCallback.call(a.oInstance,a,{})})});y("state.loaded()",function(){return this.context.length?this.context[0].oLoadedState:null});y("state.save()",function(){return this.iterator("table",function(a){qa(a)})});u.versionCheck=u.fnVersionCheck=function(a){var b=u.version.split(".");a=a.split(".");for(var c,d,e=0,h=a.length;e<h;e++)if(c=parseInt(b[e],10)||0,d=parseInt(a[e],10)||0,c!==d)return c>d;return!0};u.isDataTable=u.fnIsDataTable=function(a){var b=
l(a).get(0),c=!1;if(a instanceof u.Api)return!0;l.each(u.settings,function(d,e){d=e.nScrollHead?l("table",e.nScrollHead)[0]:null;var h=e.nScrollFoot?l("table",e.nScrollFoot)[0]:null;if(e.nTable===b||d===b||h===b)c=!0});return c};u.tables=u.fnTables=function(a){var b=!1;l.isPlainObject(a)&&(b=a.api,a=a.visible);var c=l.map(u.settings,function(d){if(!a||a&&l(d.nTable).is(":visible"))return d.nTable});return b?new B(c):c};u.camelToHungarian=P;y("$()",function(a,b){b=this.rows(b).nodes();b=l(b);return l([].concat(b.filter(a).toArray(),
b.find(a).toArray()))});l.each(["on","one","off"],function(a,b){y(b+"()",function(){var c=Array.prototype.slice.call(arguments);c[0]=l.map(c[0].split(/\s/),function(e){return e.match(/\.dt\b/)?e:e+".dt"}).join(" ");var d=l(this.tables().nodes());d[b].apply(d,c);return this})});y("clear()",function(){return this.iterator("table",function(a){Ka(a)})});y("settings()",function(){return new B(this.context,this.context)});y("init()",function(){var a=this.context;return a.length?a[0].oInit:null});y("data()",
function(){return this.iterator("table",function(a){return U(a.aoData,"_aData")}).flatten()});y("destroy()",function(a){a=a||!1;return this.iterator("table",function(b){var c=b.nTableWrapper.parentNode,d=b.oClasses,e=b.nTable,h=b.nTBody,g=b.nTHead,f=b.nTFoot,k=l(e);h=l(h);var n=l(b.nTableWrapper),m=l.map(b.aoData,function(t){return t.nTr}),p;b.bDestroying=!0;F(b,"aoDestroyCallback","destroy",[b]);a||(new B(b)).columns().visible(!0);n.off(".DT").find(":not(tbody *)").off(".DT");l(z).off(".DT-"+b.sInstance);
e!=g.parentNode&&(k.children("thead").detach(),k.append(g));f&&e!=f.parentNode&&(k.children("tfoot").detach(),k.append(f));b.aaSorting=[];b.aaSortingFixed=[];Ra(b);l(m).removeClass(b.asStripeClasses.join(" "));l("th, td",g).removeClass(d.sSortable+" "+d.sSortableAsc+" "+d.sSortableDesc+" "+d.sSortableNone);h.children().detach();h.append(m);g=a?"remove":"detach";k[g]();n[g]();!a&&c&&(c.insertBefore(e,b.nTableReinsertBefore),k.css("width",b.sDestroyWidth).removeClass(d.sTable),(p=b.asDestroyStripes.length)&&
h.children().each(function(t){l(this).addClass(b.asDestroyStripes[t%p])}));c=l.inArray(b,u.settings);-1!==c&&u.settings.splice(c,1)})});l.each(["column","row","cell"],function(a,b){y(b+"s().every()",function(c){var d=this.selector.opts,e=this;return this.iterator(b,function(h,g,f,k,n){c.call(e[b](g,"cell"===b?f:d,"cell"===b?d:q),g,f,k,n)})})});y("i18n()",function(a,b,c){var d=this.context[0];a=na(a)(d.oLanguage);a===q&&(a=b);c!==q&&l.isPlainObject(a)&&(a=a[c]!==q?a[c]:a._);return a.replace("%d",c)});
u.version="1.11.1";u.settings=[];u.models={};u.models.oSearch={bCaseInsensitive:!0,sSearch:"",bRegex:!1,bSmart:!0,"return":!1};u.models.oRow={nTr:null,anCells:null,_aData:[],_aSortData:null,_aFilterData:null,_sFilterRow:null,_sRowStripe:"",src:null,idx:-1};u.models.oColumn={idx:null,aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bVisible:null,_sManualType:null,_bAttrSrc:!1,fnCreatedCell:null,fnGetData:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,
sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null};u.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:[],ajax:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollCollapse:!1,bServerSide:!1,bSort:!0,bSortMulti:!0,bSortCellsTop:!1,
bSortClasses:!0,bStateSave:!1,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(a){return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,this.oLanguage.sThousands)},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:null,fnServerParams:null,fnStateLoadCallback:function(a){try{return JSON.parse((-1===a.iStateDuration?sessionStorage:localStorage).getItem("DataTables_"+a.sInstance+"_"+location.pathname))}catch(b){return{}}},
fnStateLoadParams:null,fnStateLoaded:null,fnStateSaveCallback:function(a,b){try{(-1===a.iStateDuration?sessionStorage:localStorage).setItem("DataTables_"+a.sInstance+"_"+location.pathname,JSON.stringify(b))}catch(c){}},fnStateSaveParams:null,iStateDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iTabIndex:0,oClasses:{},oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},oPaginate:{sFirst:"First",sLast:"Last",
sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sDecimal:"",sThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sSearchPlaceholder:"",sUrl:"",sZeroRecords:"No matching records found"},oSearch:l.extend({},u.models.oSearch),sAjaxDataProp:"data",
sAjaxSource:null,sDom:"lfrtip",searchDelay:null,sPaginationType:"simple_numbers",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET",renderer:null,rowId:"DT_RowId"};E(u.defaults);u.defaults.column={aDataSort:null,iDataSort:-1,asSorting:["asc","desc"],bSearchable:!0,bSortable:!0,bVisible:!0,fnCreatedCell:null,mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null};E(u.defaults.column);u.models.oSettings=
{oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortMulti:null,bSortClasses:null,bStateSave:null},oScroll:{bCollapse:null,iBarWidth:0,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:!1,bScrollbarLeft:!1,bBounding:!1,barWidth:0},ajax:null,aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aIds:{},aoColumns:[],aoHeader:[],aoFooter:[],oPreviousSearch:{},
aoPreSearchCols:[],aaSorting:null,aaSortingFixed:[],asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,searchDelay:null,sPaginationType:"two_button",iStateDuration:0,
aoStateSave:[],aoStateLoad:[],oSavedState:null,oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,jqXHR:null,json:q,oAjaxData:q,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iRecordsTotal:0,_iRecordsDisplay:0,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return"ssp"==Q(this)?1*this._iRecordsTotal:this.aiDisplayMaster.length},
fnRecordsDisplay:function(){return"ssp"==Q(this)?1*this._iRecordsDisplay:this.aiDisplay.length},fnDisplayEnd:function(){var a=this._iDisplayLength,b=this._iDisplayStart,c=b+a,d=this.aiDisplay.length,e=this.oFeatures,h=e.bPaginate;return e.bServerSide?!1===h||-1===a?b+d:Math.min(b+a,this._iRecordsDisplay):!h||c>d||-1===a?d:c},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null,aLastSort:[],oPlugins:{},rowIdFn:null,rowId:null};u.ext=M={buttons:{},classes:{},builder:"-source-",
errMode:"alert",feature:[],search:[],selector:{cell:[],column:[],row:[]},internal:{},legacy:{ajax:null},pager:{},renderer:{pageButton:{},header:{}},order:{},type:{detect:[],search:{},order:{}},_unique:0,fnVersionCheck:u.fnVersionCheck,iApiIndex:0,oJUIClasses:{},sVersion:u.version};l.extend(M,{afnFiltering:M.search,aTypes:M.type.detect,ofnSearch:M.type.search,oSort:M.type.order,afnSortData:M.order,aoFeatures:M.feature,oApi:M.internal,oStdClasses:M.classes,oPagination:M.pager});l.extend(u.ext.classes,
{sTable:"dataTable",sNoFooter:"no-footer",sPageButton:"paginate_button",sPageButtonActive:"current",sPageButtonDisabled:"disabled",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_desc_disabled",sSortableDesc:"sorting_asc_disabled",
sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sFilterInput:"",sLengthSelect:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sHeaderTH:"",sFooterTH:"",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",sJUIHeader:"",sJUIFooter:""});var dc=
u.ext.pager;l.extend(dc,{simple:function(a,b){return["previous","next"]},full:function(a,b){return["first","previous","next","last"]},numbers:function(a,b){return[Da(a,b)]},simple_numbers:function(a,b){return["previous",Da(a,b),"next"]},full_numbers:function(a,b){return["first","previous",Da(a,b),"next","last"]},first_last_numbers:function(a,b){return["first",Da(a,b),"last"]},_numbers:Da,numbers_length:7});l.extend(!0,u.ext.renderer,{pageButton:{_:function(a,b,c,d,e,h){var g=a.oClasses,f=a.oLanguage.oPaginate,
k=a.oLanguage.oAria.paginate||{},n,m,p=0,t=function(x,w){var r,C=g.sPageButtonDisabled,G=function(I){lb(a,I.data.action,!0)};var aa=0;for(r=w.length;aa<r;aa++){var L=w[aa];if(Array.isArray(L)){var O=l("<"+(L.DT_el||"div")+"/>").appendTo(x);t(O,L)}else{n=null;m=L;O=a.iTabIndex;switch(L){case "ellipsis":x.append('<span class="ellipsis">&#x2026;</span>');break;case "first":n=f.sFirst;0===e&&(O=-1,m+=" "+C);break;case "previous":n=f.sPrevious;0===e&&(O=-1,m+=" "+C);break;case "next":n=f.sNext;if(0===
h||e===h-1)O=-1,m+=" "+C;break;case "last":n=f.sLast;if(0===h||e===h-1)O=-1,m+=" "+C;break;default:n=a.fnFormatNumber(L+1),m=e===L?g.sPageButtonActive:""}null!==n&&(O=l("<a>",{"class":g.sPageButton+" "+m,"aria-controls":a.sTableId,"aria-label":k[L],"data-dt-idx":p,tabindex:O,id:0===c&&"string"===typeof L?a.sTableId+"_"+L:null}).html(n).appendTo(x),ob(O,{action:L},G),p++)}}};try{var v=l(b).find(A.activeElement).data("dt-idx")}catch(x){}t(l(b).empty(),d);v!==q&&l(b).find("[data-dt-idx="+v+"]").trigger("focus")}}});
l.extend(u.ext.type.detect,[function(a,b){b=b.oLanguage.sDecimal;return sb(a,b)?"num"+b:null},function(a,b){if(a&&!(a instanceof Date)&&!sc.test(a))return null;b=Date.parse(a);return null!==b&&!isNaN(b)||Z(a)?"date":null},function(a,b){b=b.oLanguage.sDecimal;return sb(a,b,!0)?"num-fmt"+b:null},function(a,b){b=b.oLanguage.sDecimal;return ic(a,b)?"html-num"+b:null},function(a,b){b=b.oLanguage.sDecimal;return ic(a,b,!0)?"html-num-fmt"+b:null},function(a,b){return Z(a)||"string"===typeof a&&-1!==a.indexOf("<")?
"html":null}]);l.extend(u.ext.type.search,{html:function(a){return Z(a)?a:"string"===typeof a?a.replace(fc," ").replace(Ua,""):""},string:function(a){return Z(a)?a:"string"===typeof a?a.replace(fc," "):a}});var Ta=function(a,b,c,d){if(0!==a&&(!a||"-"===a))return-Infinity;b&&(a=hc(a,b));a.replace&&(c&&(a=a.replace(c,"")),d&&(a=a.replace(d,"")));return 1*a};l.extend(M.type.order,{"date-pre":function(a){a=Date.parse(a);return isNaN(a)?-Infinity:a},"html-pre":function(a){return Z(a)?"":a.replace?a.replace(/<.*?>/g,
"").toLowerCase():a+""},"string-pre":function(a){return Z(a)?"":"string"===typeof a?a.toLowerCase():a.toString?a.toString():""},"string-asc":function(a,b){return a<b?-1:a>b?1:0},"string-desc":function(a,b){return a<b?1:a>b?-1:0}});Wa("");l.extend(!0,u.ext.renderer,{header:{_:function(a,b,c,d){l(a.nTable).on("order.dt.DT",function(e,h,g,f){a===h&&(e=c.idx,b.removeClass(d.sSortAsc+" "+d.sSortDesc).addClass("asc"==f[e]?d.sSortAsc:"desc"==f[e]?d.sSortDesc:c.sSortingClass))})},jqueryui:function(a,b,c,
d){l("<div/>").addClass(d.sSortJUIWrapper).append(b.contents()).append(l("<span/>").addClass(d.sSortIcon+" "+c.sSortingClassJUI)).appendTo(b);l(a.nTable).on("order.dt.DT",function(e,h,g,f){a===h&&(e=c.idx,b.removeClass(d.sSortAsc+" "+d.sSortDesc).addClass("asc"==f[e]?d.sSortAsc:"desc"==f[e]?d.sSortDesc:c.sSortingClass),b.find("span."+d.sSortIcon).removeClass(d.sSortJUIAsc+" "+d.sSortJUIDesc+" "+d.sSortJUI+" "+d.sSortJUIAscAllowed+" "+d.sSortJUIDescAllowed).addClass("asc"==f[e]?d.sSortJUIAsc:"desc"==
f[e]?d.sSortJUIDesc:c.sSortingClassJUI))})}}});var xb=function(a){return"string"===typeof a?a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):a};u.render={number:function(a,b,c,d,e){return{display:function(h){if("number"!==typeof h&&"string"!==typeof h)return h;var g=0>h?"-":"",f=parseFloat(h);if(isNaN(f))return xb(h);f=f.toFixed(c);h=Math.abs(f);f=parseInt(h,10);h=c?b+(h-f).toFixed(c).substring(2):"";0===f&&0===parseFloat(h)&&(g="");return g+(d||"")+f.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
a)+h+(e||"")}}},text:function(){return{display:xb,filter:xb}}};l.extend(u.ext.internal,{_fnExternApiFunc:ec,_fnBuildAjax:Oa,_fnAjaxUpdate:Fb,_fnAjaxParameters:Ob,_fnAjaxUpdateDraw:Pb,_fnAjaxDataSrc:Aa,_fnAddColumn:Xa,_fnColumnOptions:Ga,_fnAdjustColumnSizing:ta,_fnVisibleToColumnIndex:ua,_fnColumnIndexToVisible:va,_fnVisbleColumns:oa,_fnGetColumns:Ia,_fnColumnTypes:Za,_fnApplyColumnDefs:Cb,_fnHungarianMap:E,_fnCamelToHungarian:P,_fnLanguageCompat:ma,_fnBrowserDetect:Ab,_fnAddData:ia,_fnAddTr:Ja,_fnNodeToDataIndex:function(a,
b){return b._DT_RowIndex!==q?b._DT_RowIndex:null},_fnNodeToColumnIndex:function(a,b,c){return l.inArray(c,a.aoData[b].anCells)},_fnGetCellData:T,_fnSetCellData:Db,_fnSplitObjNotation:bb,_fnGetObjectDataFn:na,_fnSetObjectDataFn:ha,_fnGetDataMaster:cb,_fnClearTable:Ka,_fnDeleteIndex:La,_fnInvalidate:wa,_fnGetRowElements:ab,_fnCreateTr:$a,_fnBuildHead:Eb,_fnDrawHead:ya,_fnDraw:ja,_fnReDraw:ka,_fnAddOptionsHtml:Hb,_fnDetectHeader:xa,_fnGetUniqueThs:Na,_fnFeatureHtmlFilter:Jb,_fnFilterComplete:za,_fnFilterCustom:Sb,
_fnFilterColumn:Rb,_fnFilter:Qb,_fnFilterCreateSearch:hb,_fnEscapeRegex:ib,_fnFilterData:Tb,_fnFeatureHtmlInfo:Mb,_fnUpdateInfo:Wb,_fnInfoMacros:Xb,_fnInitialise:Ba,_fnInitComplete:Pa,_fnLengthChange:jb,_fnFeatureHtmlLength:Ib,_fnFeatureHtmlPaginate:Nb,_fnPageChange:lb,_fnFeatureHtmlProcessing:Kb,_fnProcessingDisplay:V,_fnFeatureHtmlTable:Lb,_fnScrollDraw:Ha,_fnApplyToChildren:ca,_fnCalculateColumnWidths:Ya,_fnThrottle:gb,_fnConvertToWidth:Yb,_fnGetWidestNode:Zb,_fnGetMaxLenString:$b,_fnStringToCss:K,
_fnSortFlatten:pa,_fnSort:Gb,_fnSortAria:bc,_fnSortListener:nb,_fnSortAttachListener:eb,_fnSortingClasses:Ra,_fnSortData:ac,_fnSaveState:qa,_fnLoadState:cc,_fnSettingsFromNode:Sa,_fnLog:da,_fnMap:X,_fnBindAction:ob,_fnCallbackReg:R,_fnCallbackFire:F,_fnLengthOverflow:kb,_fnRenderer:fb,_fnDataSource:Q,_fnRowAttributes:db,_fnExtend:pb,_fnCalculateEnd:function(){}});l.fn.dataTable=u;u.$=l;l.fn.dataTableSettings=u.settings;l.fn.dataTableExt=u.ext;l.fn.DataTable=function(a){return l(this).dataTable(a).api()};
l.each(u,function(a,b){l.fn.DataTable[a]=b});return u});

/*!
 * Chart.js v3.5.1
 * https://www.chartjs.org
 * (c) 2021 Chart.js Contributors
 * Released under the MIT License
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).Chart=e()}(this,(function(){"use strict";const t="undefined"==typeof window?function(t){return t()}:window.requestAnimationFrame;function e(e,i,n){const o=n||(t=>Array.prototype.slice.call(t));let s=!1,a=[];return function(...n){a=o(n),s||(s=!0,t.call(window,(()=>{s=!1,e.apply(i,a)})))}}function i(t,e){let i;return function(){return e?(clearTimeout(i),i=setTimeout(t,e)):t(),e}}const n=t=>"start"===t?"left":"end"===t?"right":"center",o=(t,e,i)=>"start"===t?e:"end"===t?i:(e+i)/2,s=(t,e,i,n)=>t===(n?"left":"right")?i:"center"===t?(e+i)/2:e;var a=new class{constructor(){this._request=null,this._charts=new Map,this._running=!1,this._lastDate=void 0}_notify(t,e,i,n){const o=e.listeners[n],s=e.duration;o.forEach((n=>n({chart:t,initial:e.initial,numSteps:s,currentStep:Math.min(i-e.start,s)})))}_refresh(){const e=this;e._request||(e._running=!0,e._request=t.call(window,(()=>{e._update(),e._request=null,e._running&&e._refresh()})))}_update(t=Date.now()){const e=this;let i=0;e._charts.forEach(((n,o)=>{if(!n.running||!n.items.length)return;const s=n.items;let a,r=s.length-1,l=!1;for(;r>=0;--r)a=s[r],a._active?(a._total>n.duration&&(n.duration=a._total),a.tick(t),l=!0):(s[r]=s[s.length-1],s.pop());l&&(o.draw(),e._notify(o,n,t,"progress")),s.length||(n.running=!1,e._notify(o,n,t,"complete"),n.initial=!1),i+=s.length})),e._lastDate=t,0===i&&(e._running=!1)}_getAnims(t){const e=this._charts;let i=e.get(t);return i||(i={running:!1,initial:!0,items:[],listeners:{complete:[],progress:[]}},e.set(t,i)),i}listen(t,e,i){this._getAnims(t).listeners[e].push(i)}add(t,e){e&&e.length&&this._getAnims(t).items.push(...e)}has(t){return this._getAnims(t).items.length>0}start(t){const e=this._charts.get(t);e&&(e.running=!0,e.start=Date.now(),e.duration=e.items.reduce(((t,e)=>Math.max(t,e._duration)),0),this._refresh())}running(t){if(!this._running)return!1;const e=this._charts.get(t);return!!(e&&e.running&&e.items.length)}stop(t){const e=this._charts.get(t);if(!e||!e.items.length)return;const i=e.items;let n=i.length-1;for(;n>=0;--n)i[n].cancel();e.items=[],this._notify(t,e,Date.now(),"complete")}remove(t){return this._charts.delete(t)}};
/*!
 * @kurkle/color v0.1.9
 * https://github.com/kurkle/color#readme
 * (c) 2020 Jukka Kurkela
 * Released under the MIT License
 */const r={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,A:10,B:11,C:12,D:13,E:14,F:15,a:10,b:11,c:12,d:13,e:14,f:15},l="0123456789ABCDEF",c=t=>l[15&t],h=t=>l[(240&t)>>4]+l[15&t],d=t=>(240&t)>>4==(15&t);function u(t){var e=function(t){return d(t.r)&&d(t.g)&&d(t.b)&&d(t.a)}(t)?c:h;return t?"#"+e(t.r)+e(t.g)+e(t.b)+(t.a<255?e(t.a):""):t}function f(t){return t+.5|0}const g=(t,e,i)=>Math.max(Math.min(t,i),e);function p(t){return g(f(2.55*t),0,255)}function m(t){return g(f(255*t),0,255)}function x(t){return g(f(t/2.55)/100,0,1)}function b(t){return g(f(100*t),0,100)}const _=/^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;const y=/^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;function v(t,e,i){const n=e*Math.min(i,1-i),o=(e,o=(e+t/30)%12)=>i-n*Math.max(Math.min(o-3,9-o,1),-1);return[o(0),o(8),o(4)]}function w(t,e,i){const n=(n,o=(n+t/60)%6)=>i-i*e*Math.max(Math.min(o,4-o,1),0);return[n(5),n(3),n(1)]}function M(t,e,i){const n=v(t,1,.5);let o;for(e+i>1&&(o=1/(e+i),e*=o,i*=o),o=0;o<3;o++)n[o]*=1-e-i,n[o]+=e;return n}function k(t){const e=t.r/255,i=t.g/255,n=t.b/255,o=Math.max(e,i,n),s=Math.min(e,i,n),a=(o+s)/2;let r,l,c;return o!==s&&(c=o-s,l=a>.5?c/(2-o-s):c/(o+s),r=o===e?(i-n)/c+(i<n?6:0):o===i?(n-e)/c+2:(e-i)/c+4,r=60*r+.5),[0|r,l||0,a]}function S(t,e,i,n){return(Array.isArray(e)?t(e[0],e[1],e[2]):t(e,i,n)).map(m)}function P(t,e,i){return S(v,t,e,i)}function D(t){return(t%360+360)%360}function C(t){const e=y.exec(t);let i,n=255;if(!e)return;e[5]!==i&&(n=e[6]?p(+e[5]):m(+e[5]));const o=D(+e[2]),s=+e[3]/100,a=+e[4]/100;return i="hwb"===e[1]?function(t,e,i){return S(M,t,e,i)}(o,s,a):"hsv"===e[1]?function(t,e,i){return S(w,t,e,i)}(o,s,a):P(o,s,a),{r:i[0],g:i[1],b:i[2],a:n}}const O={x:"dark",Z:"light",Y:"re",X:"blu",W:"gr",V:"medium",U:"slate",A:"ee",T:"ol",S:"or",B:"ra",C:"lateg",D:"ights",R:"in",Q:"turquois",E:"hi",P:"ro",O:"al",N:"le",M:"de",L:"yello",F:"en",K:"ch",G:"arks",H:"ea",I:"ightg",J:"wh"},T={OiceXe:"f0f8ff",antiquewEte:"faebd7",aqua:"ffff",aquamarRe:"7fffd4",azuY:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"0",blanKedOmond:"ffebcd",Xe:"ff",XeviTet:"8a2be2",bPwn:"a52a2a",burlywood:"deb887",caMtXe:"5f9ea0",KartYuse:"7fff00",KocTate:"d2691e",cSO:"ff7f50",cSnflowerXe:"6495ed",cSnsilk:"fff8dc",crimson:"dc143c",cyan:"ffff",xXe:"8b",xcyan:"8b8b",xgTMnPd:"b8860b",xWay:"a9a9a9",xgYF:"6400",xgYy:"a9a9a9",xkhaki:"bdb76b",xmagFta:"8b008b",xTivegYF:"556b2f",xSange:"ff8c00",xScEd:"9932cc",xYd:"8b0000",xsOmon:"e9967a",xsHgYF:"8fbc8f",xUXe:"483d8b",xUWay:"2f4f4f",xUgYy:"2f4f4f",xQe:"ced1",xviTet:"9400d3",dAppRk:"ff1493",dApskyXe:"bfff",dimWay:"696969",dimgYy:"696969",dodgerXe:"1e90ff",fiYbrick:"b22222",flSOwEte:"fffaf0",foYstWAn:"228b22",fuKsia:"ff00ff",gaRsbSo:"dcdcdc",ghostwEte:"f8f8ff",gTd:"ffd700",gTMnPd:"daa520",Way:"808080",gYF:"8000",gYFLw:"adff2f",gYy:"808080",honeyMw:"f0fff0",hotpRk:"ff69b4",RdianYd:"cd5c5c",Rdigo:"4b0082",ivSy:"fffff0",khaki:"f0e68c",lavFMr:"e6e6fa",lavFMrXsh:"fff0f5",lawngYF:"7cfc00",NmoncEffon:"fffacd",ZXe:"add8e6",ZcSO:"f08080",Zcyan:"e0ffff",ZgTMnPdLw:"fafad2",ZWay:"d3d3d3",ZgYF:"90ee90",ZgYy:"d3d3d3",ZpRk:"ffb6c1",ZsOmon:"ffa07a",ZsHgYF:"20b2aa",ZskyXe:"87cefa",ZUWay:"778899",ZUgYy:"778899",ZstAlXe:"b0c4de",ZLw:"ffffe0",lime:"ff00",limegYF:"32cd32",lRF:"faf0e6",magFta:"ff00ff",maPon:"800000",VaquamarRe:"66cdaa",VXe:"cd",VScEd:"ba55d3",VpurpN:"9370db",VsHgYF:"3cb371",VUXe:"7b68ee",VsprRggYF:"fa9a",VQe:"48d1cc",VviTetYd:"c71585",midnightXe:"191970",mRtcYam:"f5fffa",mistyPse:"ffe4e1",moccasR:"ffe4b5",navajowEte:"ffdead",navy:"80",Tdlace:"fdf5e6",Tive:"808000",TivedBb:"6b8e23",Sange:"ffa500",SangeYd:"ff4500",ScEd:"da70d6",pOegTMnPd:"eee8aa",pOegYF:"98fb98",pOeQe:"afeeee",pOeviTetYd:"db7093",papayawEp:"ffefd5",pHKpuff:"ffdab9",peru:"cd853f",pRk:"ffc0cb",plum:"dda0dd",powMrXe:"b0e0e6",purpN:"800080",YbeccapurpN:"663399",Yd:"ff0000",Psybrown:"bc8f8f",PyOXe:"4169e1",saddNbPwn:"8b4513",sOmon:"fa8072",sandybPwn:"f4a460",sHgYF:"2e8b57",sHshell:"fff5ee",siFna:"a0522d",silver:"c0c0c0",skyXe:"87ceeb",UXe:"6a5acd",UWay:"708090",UgYy:"708090",snow:"fffafa",sprRggYF:"ff7f",stAlXe:"4682b4",tan:"d2b48c",teO:"8080",tEstN:"d8bfd8",tomato:"ff6347",Qe:"40e0d0",viTet:"ee82ee",JHt:"f5deb3",wEte:"ffffff",wEtesmoke:"f5f5f5",Lw:"ffff00",LwgYF:"9acd32"};let A;function L(t){A||(A=function(){const t={},e=Object.keys(T),i=Object.keys(O);let n,o,s,a,r;for(n=0;n<e.length;n++){for(a=r=e[n],o=0;o<i.length;o++)s=i[o],r=r.replace(s,O[s]);s=parseInt(T[a],16),t[r]=[s>>16&255,s>>8&255,255&s]}return t}(),A.transparent=[0,0,0,0]);const e=A[t.toLowerCase()];return e&&{r:e[0],g:e[1],b:e[2],a:4===e.length?e[3]:255}}function R(t,e,i){if(t){let n=k(t);n[e]=Math.max(0,Math.min(n[e]+n[e]*i,0===e?360:1)),n=P(n),t.r=n[0],t.g=n[1],t.b=n[2]}}function E(t,e){return t?Object.assign(e||{},t):t}function I(t){var e={r:0,g:0,b:0,a:255};return Array.isArray(t)?t.length>=3&&(e={r:t[0],g:t[1],b:t[2],a:255},t.length>3&&(e.a=m(t[3]))):(e=E(t,{r:0,g:0,b:0,a:1})).a=m(e.a),e}function z(t){return"r"===t.charAt(0)?function(t){const e=_.exec(t);let i,n,o,s=255;if(e){if(e[7]!==i){const t=+e[7];s=255&(e[8]?p(t):255*t)}return i=+e[1],n=+e[3],o=+e[5],i=255&(e[2]?p(i):i),n=255&(e[4]?p(n):n),o=255&(e[6]?p(o):o),{r:i,g:n,b:o,a:s}}}(t):C(t)}class F{constructor(t){if(t instanceof F)return t;const e=typeof t;let i;var n,o,s;"object"===e?i=I(t):"string"===e&&(s=(n=t).length,"#"===n[0]&&(4===s||5===s?o={r:255&17*r[n[1]],g:255&17*r[n[2]],b:255&17*r[n[3]],a:5===s?17*r[n[4]]:255}:7!==s&&9!==s||(o={r:r[n[1]]<<4|r[n[2]],g:r[n[3]]<<4|r[n[4]],b:r[n[5]]<<4|r[n[6]],a:9===s?r[n[7]]<<4|r[n[8]]:255})),i=o||L(t)||z(t)),this._rgb=i,this._valid=!!i}get valid(){return this._valid}get rgb(){var t=E(this._rgb);return t&&(t.a=x(t.a)),t}set rgb(t){this._rgb=I(t)}rgbString(){return this._valid?(t=this._rgb)&&(t.a<255?`rgba(${t.r}, ${t.g}, ${t.b}, ${x(t.a)})`:`rgb(${t.r}, ${t.g}, ${t.b})`):this._rgb;var t}hexString(){return this._valid?u(this._rgb):this._rgb}hslString(){return this._valid?function(t){if(!t)return;const e=k(t),i=e[0],n=b(e[1]),o=b(e[2]);return t.a<255?`hsla(${i}, ${n}%, ${o}%, ${x(t.a)})`:`hsl(${i}, ${n}%, ${o}%)`}(this._rgb):this._rgb}mix(t,e){const i=this;if(t){const n=i.rgb,o=t.rgb;let s;const a=e===s?.5:e,r=2*a-1,l=n.a-o.a,c=((r*l==-1?r:(r+l)/(1+r*l))+1)/2;s=1-c,n.r=255&c*n.r+s*o.r+.5,n.g=255&c*n.g+s*o.g+.5,n.b=255&c*n.b+s*o.b+.5,n.a=a*n.a+(1-a)*o.a,i.rgb=n}return i}clone(){return new F(this.rgb)}alpha(t){return this._rgb.a=m(t),this}clearer(t){return this._rgb.a*=1-t,this}greyscale(){const t=this._rgb,e=f(.3*t.r+.59*t.g+.11*t.b);return t.r=t.g=t.b=e,this}opaquer(t){return this._rgb.a*=1+t,this}negate(){const t=this._rgb;return t.r=255-t.r,t.g=255-t.g,t.b=255-t.b,this}lighten(t){return R(this._rgb,2,t),this}darken(t){return R(this._rgb,2,-t),this}saturate(t){return R(this._rgb,1,t),this}desaturate(t){return R(this._rgb,1,-t),this}rotate(t){return function(t,e){var i=k(t);i[0]=D(i[0]+e),i=P(i),t.r=i[0],t.g=i[1],t.b=i[2]}(this._rgb,t),this}}function B(t){return new F(t)}const V=t=>t instanceof CanvasGradient||t instanceof CanvasPattern;function W(t){return V(t)?t:B(t)}function N(t){return V(t)?t:B(t).saturate(.5).darken(.1).hexString()}function H(){}const j=function(){let t=0;return function(){return t++}}();function $(t){return null==t}function Y(t){if(Array.isArray&&Array.isArray(t))return!0;const e=Object.prototype.toString.call(t);return"[object"===e.substr(0,7)&&"Array]"===e.substr(-6)}function U(t){return null!==t&&"[object Object]"===Object.prototype.toString.call(t)}const X=t=>("number"==typeof t||t instanceof Number)&&isFinite(+t);function q(t,e){return X(t)?t:e}function K(t,e){return void 0===t?e:t}const G=(t,e)=>"string"==typeof t&&t.endsWith("%")?parseFloat(t)/100:t/e,Z=(t,e)=>"string"==typeof t&&t.endsWith("%")?parseFloat(t)/100*e:+t;function Q(t,e,i){if(t&&"function"==typeof t.call)return t.apply(i,e)}function J(t,e,i,n){let o,s,a;if(Y(t))if(s=t.length,n)for(o=s-1;o>=0;o--)e.call(i,t[o],o);else for(o=0;o<s;o++)e.call(i,t[o],o);else if(U(t))for(a=Object.keys(t),s=a.length,o=0;o<s;o++)e.call(i,t[a[o]],a[o])}function tt(t,e){let i,n,o,s;if(!t||!e||t.length!==e.length)return!1;for(i=0,n=t.length;i<n;++i)if(o=t[i],s=e[i],o.datasetIndex!==s.datasetIndex||o.index!==s.index)return!1;return!0}function et(t){if(Y(t))return t.map(et);if(U(t)){const e=Object.create(null),i=Object.keys(t),n=i.length;let o=0;for(;o<n;++o)e[i[o]]=et(t[i[o]]);return e}return t}function it(t){return-1===["__proto__","prototype","constructor"].indexOf(t)}function nt(t,e,i,n){if(!it(t))return;const o=e[t],s=i[t];U(o)&&U(s)?ot(o,s,n):e[t]=et(s)}function ot(t,e,i){const n=Y(e)?e:[e],o=n.length;if(!U(t))return t;const s=(i=i||{}).merger||nt;for(let a=0;a<o;++a){if(!U(e=n[a]))continue;const o=Object.keys(e);for(let n=0,a=o.length;n<a;++n)s(o[n],t,e,i)}return t}function st(t,e){return ot(t,e,{merger:at})}function at(t,e,i){if(!it(t))return;const n=e[t],o=i[t];U(n)&&U(o)?st(n,o):Object.prototype.hasOwnProperty.call(e,t)||(e[t]=et(o))}function rt(t,e){const i=t.indexOf(".",e);return-1===i?t.length:i}function lt(t,e){if(""===e)return t;let i=0,n=rt(e,i);for(;t&&n>i;)t=t[e.substr(i,n-i)],i=n+1,n=rt(e,i);return t}function ct(t){return t.charAt(0).toUpperCase()+t.slice(1)}const ht=t=>void 0!==t,dt=t=>"function"==typeof t,ut=(t,e)=>{if(t.size!==e.size)return!1;for(const i of t)if(!e.has(i))return!1;return!0},ft=Object.create(null),gt=Object.create(null);function pt(t,e){if(!e)return t;const i=e.split(".");for(let e=0,n=i.length;e<n;++e){const n=i[e];t=t[n]||(t[n]=Object.create(null))}return t}function mt(t,e,i){return"string"==typeof e?ot(pt(t,e),i):ot(pt(t,""),e)}var xt=new class{constructor(t){this.animation=void 0,this.backgroundColor="rgba(0,0,0,0.1)",this.borderColor="rgba(0,0,0,0.1)",this.color="#666",this.datasets={},this.devicePixelRatio=t=>t.chart.platform.getDevicePixelRatio(),this.elements={},this.events=["mousemove","mouseout","click","touchstart","touchmove"],this.font={family:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",size:12,style:"normal",lineHeight:1.2,weight:null},this.hover={},this.hoverBackgroundColor=(t,e)=>N(e.backgroundColor),this.hoverBorderColor=(t,e)=>N(e.borderColor),this.hoverColor=(t,e)=>N(e.color),this.indexAxis="x",this.interaction={mode:"nearest",intersect:!0},this.maintainAspectRatio=!0,this.onHover=null,this.onClick=null,this.parsing=!0,this.plugins={},this.responsive=!0,this.scale=void 0,this.scales={},this.showLine=!0,this.describe(t)}set(t,e){return mt(this,t,e)}get(t){return pt(this,t)}describe(t,e){return mt(gt,t,e)}override(t,e){return mt(ft,t,e)}route(t,e,i,n){const o=pt(this,t),s=pt(this,i),a="_"+e;Object.defineProperties(o,{[a]:{value:o[e],writable:!0},[e]:{enumerable:!0,get(){const t=this[a],e=s[n];return U(t)?Object.assign({},e,t):K(t,e)},set(t){this[a]=t}}})}}({_scriptable:t=>!t.startsWith("on"),_indexable:t=>"events"!==t,hover:{_fallback:"interaction"},interaction:{_scriptable:!1,_indexable:!1}});const bt=Math.PI,_t=2*bt,yt=_t+bt,vt=Number.POSITIVE_INFINITY,wt=bt/180,Mt=bt/2,kt=bt/4,St=2*bt/3,Pt=Math.log10,Dt=Math.sign;function Ct(t){const e=Math.round(t);t=At(t,e,t/1e3)?e:t;const i=Math.pow(10,Math.floor(Pt(t))),n=t/i;return(n<=1?1:n<=2?2:n<=5?5:10)*i}function Ot(t){const e=[],i=Math.sqrt(t);let n;for(n=1;n<i;n++)t%n==0&&(e.push(n),e.push(t/n));return i===(0|i)&&e.push(i),e.sort(((t,e)=>t-e)).pop(),e}function Tt(t){return!isNaN(parseFloat(t))&&isFinite(t)}function At(t,e,i){return Math.abs(t-e)<i}function Lt(t,e){const i=Math.round(t);return i-e<=t&&i+e>=t}function Rt(t,e,i){let n,o,s;for(n=0,o=t.length;n<o;n++)s=t[n][i],isNaN(s)||(e.min=Math.min(e.min,s),e.max=Math.max(e.max,s))}function Et(t){return t*(bt/180)}function It(t){return t*(180/bt)}function zt(t){if(!X(t))return;let e=1,i=0;for(;Math.round(t*e)/e!==t;)e*=10,i++;return i}function Ft(t,e){const i=e.x-t.x,n=e.y-t.y,o=Math.sqrt(i*i+n*n);let s=Math.atan2(n,i);return s<-.5*bt&&(s+=_t),{angle:s,distance:o}}function Bt(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function Vt(t,e){return(t-e+yt)%_t-bt}function Wt(t){return(t%_t+_t)%_t}function Nt(t,e,i,n){const o=Wt(t),s=Wt(e),a=Wt(i),r=Wt(s-o),l=Wt(a-o),c=Wt(o-s),h=Wt(o-a);return o===s||o===a||n&&s===a||r>l&&c<h}function Ht(t,e,i){return Math.max(e,Math.min(i,t))}function jt(t){return Ht(t,-32768,32767)}function $t(t){return!t||$(t.size)||$(t.family)?null:(t.style?t.style+" ":"")+(t.weight?t.weight+" ":"")+t.size+"px "+t.family}function Yt(t,e,i,n,o){let s=e[o];return s||(s=e[o]=t.measureText(o).width,i.push(o)),s>n&&(n=s),n}function Ut(t,e,i,n){let o=(n=n||{}).data=n.data||{},s=n.garbageCollect=n.garbageCollect||[];n.font!==e&&(o=n.data={},s=n.garbageCollect=[],n.font=e),t.save(),t.font=e;let a=0;const r=i.length;let l,c,h,d,u;for(l=0;l<r;l++)if(d=i[l],null!=d&&!0!==Y(d))a=Yt(t,o,s,a,d);else if(Y(d))for(c=0,h=d.length;c<h;c++)u=d[c],null==u||Y(u)||(a=Yt(t,o,s,a,u));t.restore();const f=s.length/2;if(f>i.length){for(l=0;l<f;l++)delete o[s[l]];s.splice(0,f)}return a}function Xt(t,e,i){const n=t.currentDevicePixelRatio,o=0!==i?Math.max(i/2,.5):0;return Math.round((e-o)*n)/n+o}function qt(t,e){(e=e||t.getContext("2d")).save(),e.resetTransform(),e.clearRect(0,0,t.width,t.height),e.restore()}function Kt(t,e,i,n){let o,s,a,r,l;const c=e.pointStyle,h=e.rotation,d=e.radius;let u=(h||0)*wt;if(c&&"object"==typeof c&&(o=c.toString(),"[object HTMLImageElement]"===o||"[object HTMLCanvasElement]"===o))return t.save(),t.translate(i,n),t.rotate(u),t.drawImage(c,-c.width/2,-c.height/2,c.width,c.height),void t.restore();if(!(isNaN(d)||d<=0)){switch(t.beginPath(),c){default:t.arc(i,n,d,0,_t),t.closePath();break;case"triangle":t.moveTo(i+Math.sin(u)*d,n-Math.cos(u)*d),u+=St,t.lineTo(i+Math.sin(u)*d,n-Math.cos(u)*d),u+=St,t.lineTo(i+Math.sin(u)*d,n-Math.cos(u)*d),t.closePath();break;case"rectRounded":l=.516*d,r=d-l,s=Math.cos(u+kt)*r,a=Math.sin(u+kt)*r,t.arc(i-s,n-a,l,u-bt,u-Mt),t.arc(i+a,n-s,l,u-Mt,u),t.arc(i+s,n+a,l,u,u+Mt),t.arc(i-a,n+s,l,u+Mt,u+bt),t.closePath();break;case"rect":if(!h){r=Math.SQRT1_2*d,t.rect(i-r,n-r,2*r,2*r);break}u+=kt;case"rectRot":s=Math.cos(u)*d,a=Math.sin(u)*d,t.moveTo(i-s,n-a),t.lineTo(i+a,n-s),t.lineTo(i+s,n+a),t.lineTo(i-a,n+s),t.closePath();break;case"crossRot":u+=kt;case"cross":s=Math.cos(u)*d,a=Math.sin(u)*d,t.moveTo(i-s,n-a),t.lineTo(i+s,n+a),t.moveTo(i+a,n-s),t.lineTo(i-a,n+s);break;case"star":s=Math.cos(u)*d,a=Math.sin(u)*d,t.moveTo(i-s,n-a),t.lineTo(i+s,n+a),t.moveTo(i+a,n-s),t.lineTo(i-a,n+s),u+=kt,s=Math.cos(u)*d,a=Math.sin(u)*d,t.moveTo(i-s,n-a),t.lineTo(i+s,n+a),t.moveTo(i+a,n-s),t.lineTo(i-a,n+s);break;case"line":s=Math.cos(u)*d,a=Math.sin(u)*d,t.moveTo(i-s,n-a),t.lineTo(i+s,n+a);break;case"dash":t.moveTo(i,n),t.lineTo(i+Math.cos(u)*d,n+Math.sin(u)*d)}t.fill(),e.borderWidth>0&&t.stroke()}}function Gt(t,e,i){return i=i||.5,!e||t&&t.x>e.left-i&&t.x<e.right+i&&t.y>e.top-i&&t.y<e.bottom+i}function Zt(t,e){t.save(),t.beginPath(),t.rect(e.left,e.top,e.right-e.left,e.bottom-e.top),t.clip()}function Qt(t){t.restore()}function Jt(t,e,i,n,o){if(!e)return t.lineTo(i.x,i.y);if("middle"===o){const n=(e.x+i.x)/2;t.lineTo(n,e.y),t.lineTo(n,i.y)}else"after"===o!=!!n?t.lineTo(e.x,i.y):t.lineTo(i.x,e.y);t.lineTo(i.x,i.y)}function te(t,e,i,n){if(!e)return t.lineTo(i.x,i.y);t.bezierCurveTo(n?e.cp1x:e.cp2x,n?e.cp1y:e.cp2y,n?i.cp2x:i.cp1x,n?i.cp2y:i.cp1y,i.x,i.y)}function ee(t,e,i,n,o,s={}){const a=Y(e)?e:[e],r=s.strokeWidth>0&&""!==s.strokeColor;let l,c;for(t.save(),t.font=o.string,function(t,e){e.translation&&t.translate(e.translation[0],e.translation[1]);$(e.rotation)||t.rotate(e.rotation);e.color&&(t.fillStyle=e.color);e.textAlign&&(t.textAlign=e.textAlign);e.textBaseline&&(t.textBaseline=e.textBaseline)}(t,s),l=0;l<a.length;++l)c=a[l],r&&(s.strokeColor&&(t.strokeStyle=s.strokeColor),$(s.strokeWidth)||(t.lineWidth=s.strokeWidth),t.strokeText(c,i,n,s.maxWidth)),t.fillText(c,i,n,s.maxWidth),ie(t,i,n,c,s),n+=o.lineHeight;t.restore()}function ie(t,e,i,n,o){if(o.strikethrough||o.underline){const s=t.measureText(n),a=e-s.actualBoundingBoxLeft,r=e+s.actualBoundingBoxRight,l=i-s.actualBoundingBoxAscent,c=i+s.actualBoundingBoxDescent,h=o.strikethrough?(l+c)/2:c;t.strokeStyle=t.fillStyle,t.beginPath(),t.lineWidth=o.decorationWidth||2,t.moveTo(a,h),t.lineTo(r,h),t.stroke()}}function ne(t,e){const{x:i,y:n,w:o,h:s,radius:a}=e;t.arc(i+a.topLeft,n+a.topLeft,a.topLeft,-Mt,bt,!0),t.lineTo(i,n+s-a.bottomLeft),t.arc(i+a.bottomLeft,n+s-a.bottomLeft,a.bottomLeft,bt,Mt,!0),t.lineTo(i+o-a.bottomRight,n+s),t.arc(i+o-a.bottomRight,n+s-a.bottomRight,a.bottomRight,Mt,0,!0),t.lineTo(i+o,n+a.topRight),t.arc(i+o-a.topRight,n+a.topRight,a.topRight,0,-Mt,!0),t.lineTo(i+a.topLeft,n)}function oe(t,e,i){i=i||(i=>t[i]<e);let n,o=t.length-1,s=0;for(;o-s>1;)n=s+o>>1,i(n)?s=n:o=n;return{lo:s,hi:o}}const se=(t,e,i)=>oe(t,i,(n=>t[n][e]<i)),ae=(t,e,i)=>oe(t,i,(n=>t[n][e]>=i));function re(t,e,i){let n=0,o=t.length;for(;n<o&&t[n]<e;)n++;for(;o>n&&t[o-1]>i;)o--;return n>0||o<t.length?t.slice(n,o):t}const le=["push","pop","shift","splice","unshift"];function ce(t,e){t._chartjs?t._chartjs.listeners.push(e):(Object.defineProperty(t,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[e]}}),le.forEach((e=>{const i="_onData"+ct(e),n=t[e];Object.defineProperty(t,e,{configurable:!0,enumerable:!1,value(...e){const o=n.apply(this,e);return t._chartjs.listeners.forEach((t=>{"function"==typeof t[i]&&t[i](...e)})),o}})})))}function he(t,e){const i=t._chartjs;if(!i)return;const n=i.listeners,o=n.indexOf(e);-1!==o&&n.splice(o,1),n.length>0||(le.forEach((e=>{delete t[e]})),delete t._chartjs)}function de(t){const e=new Set;let i,n;for(i=0,n=t.length;i<n;++i)e.add(t[i]);return e.size===n?t:Array.from(e)}function ue(){return"undefined"!=typeof window&&"undefined"!=typeof document}function fe(t){let e=t.parentNode;return e&&"[object ShadowRoot]"===e.toString()&&(e=e.host),e}function ge(t,e,i){let n;return"string"==typeof t?(n=parseInt(t,10),-1!==t.indexOf("%")&&(n=n/100*e.parentNode[i])):n=t,n}const pe=t=>window.getComputedStyle(t,null);function me(t,e){return pe(t).getPropertyValue(e)}const xe=["top","right","bottom","left"];function be(t,e,i){const n={};i=i?"-"+i:"";for(let o=0;o<4;o++){const s=xe[o];n[s]=parseFloat(t[e+"-"+s+i])||0}return n.width=n.left+n.right,n.height=n.top+n.bottom,n}function _e(t,e){const{canvas:i,currentDevicePixelRatio:n}=e,o=pe(i),s="border-box"===o.boxSizing,a=be(o,"padding"),r=be(o,"border","width"),{x:l,y:c,box:h}=function(t,e){const i=t.native||t,n=i.touches,o=n&&n.length?n[0]:i,{offsetX:s,offsetY:a}=o;let r,l,c=!1;if(((t,e,i)=>(t>0||e>0)&&(!i||!i.shadowRoot))(s,a,i.target))r=s,l=a;else{const t=e.getBoundingClientRect();r=o.clientX-t.left,l=o.clientY-t.top,c=!0}return{x:r,y:l,box:c}}(t,i),d=a.left+(h&&r.left),u=a.top+(h&&r.top);let{width:f,height:g}=e;return s&&(f-=a.width+r.width,g-=a.height+r.height),{x:Math.round((l-d)/f*i.width/n),y:Math.round((c-u)/g*i.height/n)}}const ye=t=>Math.round(10*t)/10;function ve(t,e,i,n){const o=pe(t),s=be(o,"margin"),a=ge(o.maxWidth,t,"clientWidth")||vt,r=ge(o.maxHeight,t,"clientHeight")||vt,l=function(t,e,i){let n,o;if(void 0===e||void 0===i){const s=fe(t);if(s){const t=s.getBoundingClientRect(),a=pe(s),r=be(a,"border","width"),l=be(a,"padding");e=t.width-l.width-r.width,i=t.height-l.height-r.height,n=ge(a.maxWidth,s,"clientWidth"),o=ge(a.maxHeight,s,"clientHeight")}else e=t.clientWidth,i=t.clientHeight}return{width:e,height:i,maxWidth:n||vt,maxHeight:o||vt}}(t,e,i);let{width:c,height:h}=l;if("content-box"===o.boxSizing){const t=be(o,"border","width"),e=be(o,"padding");c-=e.width+t.width,h-=e.height+t.height}return c=Math.max(0,c-s.width),h=Math.max(0,n?Math.floor(c/n):h-s.height),c=ye(Math.min(c,a,l.maxWidth)),h=ye(Math.min(h,r,l.maxHeight)),c&&!h&&(h=ye(c/2)),{width:c,height:h}}function we(t,e,i){const n=e||1,o=Math.floor(t.height*n),s=Math.floor(t.width*n);t.height=o/n,t.width=s/n;const a=t.canvas;return a.style&&(i||!a.style.height&&!a.style.width)&&(a.style.height=`${t.height}px`,a.style.width=`${t.width}px`),(t.currentDevicePixelRatio!==n||a.height!==o||a.width!==s)&&(t.currentDevicePixelRatio=n,a.height=o,a.width=s,t.ctx.setTransform(n,0,0,n,0,0),!0)}const Me=function(){let t=!1;try{const e={get passive(){return t=!0,!1}};window.addEventListener("test",null,e),window.removeEventListener("test",null,e)}catch(t){}return t}();function ke(t,e){const i=me(t,e),n=i&&i.match(/^(\d+)(\.\d+)?px$/);return n?+n[1]:void 0}function Se(t,e){return"native"in t?{x:t.x,y:t.y}:_e(t,e)}function Pe(t,e,i,n){const{controller:o,data:s,_sorted:a}=t,r=o._cachedMeta.iScale;if(r&&e===r.axis&&a&&s.length){const t=r._reversePixels?ae:se;if(!n)return t(s,e,i);if(o._sharedOptions){const n=s[0],o="function"==typeof n.getRange&&n.getRange(e);if(o){const n=t(s,e,i-o),a=t(s,e,i+o);return{lo:n.lo,hi:a.hi}}}}return{lo:0,hi:s.length-1}}function De(t,e,i,n,o){const s=t.getSortedVisibleDatasetMetas(),a=i[e];for(let t=0,i=s.length;t<i;++t){const{index:i,data:r}=s[t],{lo:l,hi:c}=Pe(s[t],e,a,o);for(let t=l;t<=c;++t){const e=r[t];e.skip||n(e,i,t)}}}function Ce(t,e,i,n){const o=[];if(!Gt(e,t.chartArea,t._minPadding))return o;return De(t,i,e,(function(t,i,s){t.inRange(e.x,e.y,n)&&o.push({element:t,datasetIndex:i,index:s})}),!0),o}function Oe(t,e,i,n,o){const s=function(t){const e=-1!==t.indexOf("x"),i=-1!==t.indexOf("y");return function(t,n){const o=e?Math.abs(t.x-n.x):0,s=i?Math.abs(t.y-n.y):0;return Math.sqrt(Math.pow(o,2)+Math.pow(s,2))}}(i);let a=Number.POSITIVE_INFINITY,r=[];if(!Gt(e,t.chartArea,t._minPadding))return r;return De(t,i,e,(function(i,l,c){if(n&&!i.inRange(e.x,e.y,o))return;const h=i.getCenterPoint(o);if(!Gt(h,t.chartArea,t._minPadding)&&!i.inRange(e.x,e.y,o))return;const d=s(e,h);d<a?(r=[{element:i,datasetIndex:l,index:c}],a=d):d===a&&r.push({element:i,datasetIndex:l,index:c})})),r}function Te(t,e,i,n){const o=Se(e,t),s=[],a=i.axis,r="x"===a?"inXRange":"inYRange";let l=!1;return function(t,e){const i=t.getSortedVisibleDatasetMetas();let n,o,s;for(let t=0,a=i.length;t<a;++t){({index:n,data:o}=i[t]);for(let t=0,i=o.length;t<i;++t)s=o[t],s.skip||e(s,n,t)}}(t,((t,e,i)=>{t[r](o[a],n)&&s.push({element:t,datasetIndex:e,index:i}),t.inRange(o.x,o.y,n)&&(l=!0)})),i.intersect&&!l?[]:s}var Ae={modes:{index(t,e,i,n){const o=Se(e,t),s=i.axis||"x",a=i.intersect?Ce(t,o,s,n):Oe(t,o,s,!1,n),r=[];return a.length?(t.getSortedVisibleDatasetMetas().forEach((t=>{const e=a[0].index,i=t.data[e];i&&!i.skip&&r.push({element:i,datasetIndex:t.index,index:e})})),r):[]},dataset(t,e,i,n){const o=Se(e,t),s=i.axis||"xy";let a=i.intersect?Ce(t,o,s,n):Oe(t,o,s,!1,n);if(a.length>0){const e=a[0].datasetIndex,i=t.getDatasetMeta(e).data;a=[];for(let t=0;t<i.length;++t)a.push({element:i[t],datasetIndex:e,index:t})}return a},point:(t,e,i,n)=>Ce(t,Se(e,t),i.axis||"xy",n),nearest:(t,e,i,n)=>Oe(t,Se(e,t),i.axis||"xy",i.intersect,n),x:(t,e,i,n)=>(i.axis="x",Te(t,e,i,n)),y:(t,e,i,n)=>(i.axis="y",Te(t,e,i,n))}};const Le=new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/),Re=new RegExp(/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/);function Ee(t,e){const i=(""+t).match(Le);if(!i||"normal"===i[1])return 1.2*e;switch(t=+i[2],i[3]){case"px":return t;case"%":t/=100}return e*t}function Ie(t,e){const i={},n=U(e),o=n?Object.keys(e):e,s=U(t)?n?i=>K(t[i],t[e[i]]):e=>t[e]:()=>t;for(const t of o)i[t]=+s(t)||0;return i}function ze(t){return Ie(t,{top:"y",right:"x",bottom:"y",left:"x"})}function Fe(t){return Ie(t,["topLeft","topRight","bottomLeft","bottomRight"])}function Be(t){const e=ze(t);return e.width=e.left+e.right,e.height=e.top+e.bottom,e}function Ve(t,e){t=t||{},e=e||xt.font;let i=K(t.size,e.size);"string"==typeof i&&(i=parseInt(i,10));let n=K(t.style,e.style);n&&!(""+n).match(Re)&&(console.warn('Invalid font style specified: "'+n+'"'),n="");const o={family:K(t.family,e.family),lineHeight:Ee(K(t.lineHeight,e.lineHeight),i),size:i,style:n,weight:K(t.weight,e.weight),string:""};return o.string=$t(o),o}function We(t,e,i,n){let o,s,a,r=!0;for(o=0,s=t.length;o<s;++o)if(a=t[o],void 0!==a&&(void 0!==e&&"function"==typeof a&&(a=a(e),r=!1),void 0!==i&&Y(a)&&(a=a[i%a.length],r=!1),void 0!==a))return n&&!r&&(n.cacheable=!1),a}function Ne(t,e){const{min:i,max:n}=t;return{min:i-Math.abs(Z(e,i)),max:n+Z(e,n)}}const He=["left","top","right","bottom"];function je(t,e){return t.filter((t=>t.pos===e))}function $e(t,e){return t.filter((t=>-1===He.indexOf(t.pos)&&t.box.axis===e))}function Ye(t,e){return t.sort(((t,i)=>{const n=e?i:t,o=e?t:i;return n.weight===o.weight?n.index-o.index:n.weight-o.weight}))}function Ue(t,e){const i=function(t){const e={};for(const i of t){const{stack:t,pos:n,stackWeight:o}=i;if(!t||!He.includes(n))continue;const s=e[t]||(e[t]={count:0,placed:0,weight:0,size:0});s.count++,s.weight+=o}return e}(t),{vBoxMaxWidth:n,hBoxMaxHeight:o}=e;let s,a,r;for(s=0,a=t.length;s<a;++s){r=t[s];const{fullSize:a}=r.box,l=i[r.stack],c=l&&r.stackWeight/l.weight;r.horizontal?(r.width=c?c*n:a&&e.availableWidth,r.height=o):(r.width=n,r.height=c?c*o:a&&e.availableHeight)}return i}function Xe(t,e,i,n){return Math.max(t[i],e[i])+Math.max(t[n],e[n])}function qe(t,e){t.top=Math.max(t.top,e.top),t.left=Math.max(t.left,e.left),t.bottom=Math.max(t.bottom,e.bottom),t.right=Math.max(t.right,e.right)}function Ke(t,e,i,n){const{pos:o,box:s}=i,a=t.maxPadding;if(!U(o)){i.size&&(t[o]-=i.size);const e=n[i.stack]||{size:0,count:1};e.size=Math.max(e.size,i.horizontal?s.height:s.width),i.size=e.size/e.count,t[o]+=i.size}s.getPadding&&qe(a,s.getPadding());const r=Math.max(0,e.outerWidth-Xe(a,t,"left","right")),l=Math.max(0,e.outerHeight-Xe(a,t,"top","bottom")),c=r!==t.w,h=l!==t.h;return t.w=r,t.h=l,i.horizontal?{same:c,other:h}:{same:h,other:c}}function Ge(t,e){const i=e.maxPadding;function n(t){const n={left:0,top:0,right:0,bottom:0};return t.forEach((t=>{n[t]=Math.max(e[t],i[t])})),n}return n(t?["left","right"]:["top","bottom"])}function Ze(t,e,i,n){const o=[];let s,a,r,l,c,h;for(s=0,a=t.length,c=0;s<a;++s){r=t[s],l=r.box,l.update(r.width||e.w,r.height||e.h,Ge(r.horizontal,e));const{same:a,other:d}=Ke(e,i,r,n);c|=a&&o.length,h=h||d,l.fullSize||o.push(r)}return c&&Ze(o,e,i,n)||h}function Qe(t,e,i,n,o){t.top=i,t.left=e,t.right=e+n,t.bottom=i+o,t.width=n,t.height=o}function Je(t,e,i,n){const o=i.padding;let{x:s,y:a}=e;for(const r of t){const t=r.box,l=n[r.stack]||{count:1,placed:0,weight:1},c=r.stackWeight/l.weight||1;if(r.horizontal){const n=e.w*c,s=l.size||t.height;ht(l.start)&&(a=l.start),t.fullSize?Qe(t,o.left,a,i.outerWidth-o.right-o.left,s):Qe(t,e.left+l.placed,a,n,s),l.start=a,l.placed+=n,a=t.bottom}else{const n=e.h*c,a=l.size||t.width;ht(l.start)&&(s=l.start),t.fullSize?Qe(t,s,o.top,a,i.outerHeight-o.bottom-o.top):Qe(t,s,e.top+l.placed,a,n),l.start=s,l.placed+=n,s=t.right}}e.x=s,e.y=a}xt.set("layout",{padding:{top:0,right:0,bottom:0,left:0}});var ti={addBox(t,e){t.boxes||(t.boxes=[]),e.fullSize=e.fullSize||!1,e.position=e.position||"top",e.weight=e.weight||0,e._layers=e._layers||function(){return[{z:0,draw(t){e.draw(t)}}]},t.boxes.push(e)},removeBox(t,e){const i=t.boxes?t.boxes.indexOf(e):-1;-1!==i&&t.boxes.splice(i,1)},configure(t,e,i){e.fullSize=i.fullSize,e.position=i.position,e.weight=i.weight},update(t,e,i,n){if(!t)return;const o=Be(t.options.layout.padding),s=Math.max(e-o.width,0),a=Math.max(i-o.height,0),r=function(t){const e=function(t){const e=[];let i,n,o,s,a,r;for(i=0,n=(t||[]).length;i<n;++i)o=t[i],({position:s,options:{stack:a,stackWeight:r=1}}=o),e.push({index:i,box:o,pos:s,horizontal:o.isHorizontal(),weight:o.weight,stack:a&&s+a,stackWeight:r});return e}(t),i=Ye(e.filter((t=>t.box.fullSize)),!0),n=Ye(je(e,"left"),!0),o=Ye(je(e,"right")),s=Ye(je(e,"top"),!0),a=Ye(je(e,"bottom")),r=$e(e,"x"),l=$e(e,"y");return{fullSize:i,leftAndTop:n.concat(s),rightAndBottom:o.concat(l).concat(a).concat(r),chartArea:je(e,"chartArea"),vertical:n.concat(o).concat(l),horizontal:s.concat(a).concat(r)}}(t.boxes),l=r.vertical,c=r.horizontal;J(t.boxes,(t=>{"function"==typeof t.beforeLayout&&t.beforeLayout()}));const h=l.reduce(((t,e)=>e.box.options&&!1===e.box.options.display?t:t+1),0)||1,d=Object.freeze({outerWidth:e,outerHeight:i,padding:o,availableWidth:s,availableHeight:a,vBoxMaxWidth:s/2/h,hBoxMaxHeight:a/2}),u=Object.assign({},o);qe(u,Be(n));const f=Object.assign({maxPadding:u,w:s,h:a,x:o.left,y:o.top},o),g=Ue(l.concat(c),d);Ze(r.fullSize,f,d,g),Ze(l,f,d,g),Ze(c,f,d,g)&&Ze(l,f,d,g),function(t){const e=t.maxPadding;function i(i){const n=Math.max(e[i]-t[i],0);return t[i]+=n,n}t.y+=i("top"),t.x+=i("left"),i("right"),i("bottom")}(f),Je(r.leftAndTop,f,d,g),f.x+=f.w,f.y+=f.h,Je(r.rightAndBottom,f,d,g),t.chartArea={left:f.left,top:f.top,right:f.left+f.w,bottom:f.top+f.h,height:f.h,width:f.w},J(r.chartArea,(e=>{const i=e.box;Object.assign(i,t.chartArea),i.update(f.w,f.h)}))}};function ei(t,e=[""],i=t,n,o=(()=>t[0])){ht(n)||(n=ui("_fallback",t));const s={[Symbol.toStringTag]:"Object",_cacheable:!0,_scopes:t,_rootScopes:i,_fallback:n,_getTarget:o,override:o=>ei([o,...t],e,i,n)};return new Proxy(s,{deleteProperty:(e,i)=>(delete e[i],delete e._keys,delete t[0][i],!0),get:(i,n)=>ai(i,n,(()=>function(t,e,i,n){let o;for(const s of e)if(o=ui(oi(s,t),i),ht(o))return si(t,o)?hi(i,n,t,o):o}(n,e,t,i))),getOwnPropertyDescriptor:(t,e)=>Reflect.getOwnPropertyDescriptor(t._scopes[0],e),getPrototypeOf:()=>Reflect.getPrototypeOf(t[0]),has:(t,e)=>fi(t).includes(e),ownKeys:t=>fi(t),set:(t,e,i)=>((t._storage||(t._storage=o()))[e]=i,delete t[e],delete t._keys,!0)})}function ii(t,e,i,n){const o={_cacheable:!1,_proxy:t,_context:e,_subProxy:i,_stack:new Set,_descriptors:ni(t,n),setContext:e=>ii(t,e,i,n),override:o=>ii(t.override(o),e,i,n)};return new Proxy(o,{deleteProperty:(e,i)=>(delete e[i],delete t[i],!0),get:(t,e,i)=>ai(t,e,(()=>function(t,e,i){const{_proxy:n,_context:o,_subProxy:s,_descriptors:a}=t;let r=n[e];dt(r)&&a.isScriptable(e)&&(r=function(t,e,i,n){const{_proxy:o,_context:s,_subProxy:a,_stack:r}=i;if(r.has(t))throw new Error("Recursion detected: "+Array.from(r).join("->")+"->"+t);r.add(t),e=e(s,a||n),r.delete(t),U(e)&&(e=hi(o._scopes,o,t,e));return e}(e,r,t,i));Y(r)&&r.length&&(r=function(t,e,i,n){const{_proxy:o,_context:s,_subProxy:a,_descriptors:r}=i;if(ht(s.index)&&n(t))e=e[s.index%e.length];else if(U(e[0])){const i=e,n=o._scopes.filter((t=>t!==i));e=[];for(const l of i){const i=hi(n,o,t,l);e.push(ii(i,s,a&&a[t],r))}}return e}(e,r,t,a.isIndexable));si(e,r)&&(r=ii(r,o,s&&s[e],a));return r}(t,e,i))),getOwnPropertyDescriptor:(e,i)=>e._descriptors.allKeys?Reflect.has(t,i)?{enumerable:!0,configurable:!0}:void 0:Reflect.getOwnPropertyDescriptor(t,i),getPrototypeOf:()=>Reflect.getPrototypeOf(t),has:(e,i)=>Reflect.has(t,i),ownKeys:()=>Reflect.ownKeys(t),set:(e,i,n)=>(t[i]=n,delete e[i],!0)})}function ni(t,e={scriptable:!0,indexable:!0}){const{_scriptable:i=e.scriptable,_indexable:n=e.indexable,_allKeys:o=e.allKeys}=t;return{allKeys:o,scriptable:i,indexable:n,isScriptable:dt(i)?i:()=>i,isIndexable:dt(n)?n:()=>n}}const oi=(t,e)=>t?t+ct(e):e,si=(t,e)=>U(e)&&"adapters"!==t;function ai(t,e,i){let n=t[e];return ht(n)||(n=i(),ht(n)&&(t[e]=n)),n}function ri(t,e,i){return dt(t)?t(e,i):t}const li=(t,e)=>!0===t?e:"string"==typeof t?lt(e,t):void 0;function ci(t,e,i,n){for(const o of e){const e=li(i,o);if(e){t.add(e);const o=ri(e._fallback,i,e);if(ht(o)&&o!==i&&o!==n)return o}else if(!1===e&&ht(n)&&i!==n)return null}return!1}function hi(t,e,i,n){const o=e._rootScopes,s=ri(e._fallback,i,n),a=[...t,...o],r=new Set;r.add(n);let l=di(r,a,i,s||i);return null!==l&&((!ht(s)||s===i||(l=di(r,a,s,l),null!==l))&&ei(Array.from(r),[""],o,s,(()=>function(t,e,i){const n=t._getTarget();e in n||(n[e]={});const o=n[e];if(Y(o)&&U(i))return i;return o}(e,i,n))))}function di(t,e,i,n){for(;i;)i=ci(t,e,i,n);return i}function ui(t,e){for(const i of e){if(!i)continue;const e=i[t];if(ht(e))return e}}function fi(t){let e=t._keys;return e||(e=t._keys=function(t){const e=new Set;for(const i of t)for(const t of Object.keys(i).filter((t=>!t.startsWith("_"))))e.add(t);return Array.from(e)}(t._scopes)),e}const gi=Number.EPSILON||1e-14,pi=(t,e)=>e<t.length&&!t[e].skip&&t[e],mi=t=>"x"===t?"y":"x";function xi(t,e,i,n){const o=t.skip?e:t,s=e,a=i.skip?e:i,r=Bt(s,o),l=Bt(a,s);let c=r/(r+l),h=l/(r+l);c=isNaN(c)?0:c,h=isNaN(h)?0:h;const d=n*c,u=n*h;return{previous:{x:s.x-d*(a.x-o.x),y:s.y-d*(a.y-o.y)},next:{x:s.x+u*(a.x-o.x),y:s.y+u*(a.y-o.y)}}}function bi(t,e="x"){const i=mi(e),n=t.length,o=Array(n).fill(0),s=Array(n);let a,r,l,c=pi(t,0);for(a=0;a<n;++a)if(r=l,l=c,c=pi(t,a+1),l){if(c){const t=c[e]-l[e];o[a]=0!==t?(c[i]-l[i])/t:0}s[a]=r?c?Dt(o[a-1])!==Dt(o[a])?0:(o[a-1]+o[a])/2:o[a-1]:o[a]}!function(t,e,i){const n=t.length;let o,s,a,r,l,c=pi(t,0);for(let h=0;h<n-1;++h)l=c,c=pi(t,h+1),l&&c&&(At(e[h],0,gi)?i[h]=i[h+1]=0:(o=i[h]/e[h],s=i[h+1]/e[h],r=Math.pow(o,2)+Math.pow(s,2),r<=9||(a=3/Math.sqrt(r),i[h]=o*a*e[h],i[h+1]=s*a*e[h])))}(t,o,s),function(t,e,i="x"){const n=mi(i),o=t.length;let s,a,r,l=pi(t,0);for(let c=0;c<o;++c){if(a=r,r=l,l=pi(t,c+1),!r)continue;const o=r[i],h=r[n];a&&(s=(o-a[i])/3,r[`cp1${i}`]=o-s,r[`cp1${n}`]=h-s*e[c]),l&&(s=(l[i]-o)/3,r[`cp2${i}`]=o+s,r[`cp2${n}`]=h+s*e[c])}}(t,s,e)}function _i(t,e,i){return Math.max(Math.min(t,i),e)}function yi(t,e,i,n,o){let s,a,r,l;if(e.spanGaps&&(t=t.filter((t=>!t.skip))),"monotone"===e.cubicInterpolationMode)bi(t,o);else{let i=n?t[t.length-1]:t[0];for(s=0,a=t.length;s<a;++s)r=t[s],l=xi(i,r,t[Math.min(s+1,a-(n?0:1))%a],e.tension),r.cp1x=l.previous.x,r.cp1y=l.previous.y,r.cp2x=l.next.x,r.cp2y=l.next.y,i=r}e.capBezierPoints&&function(t,e){let i,n,o,s,a,r=Gt(t[0],e);for(i=0,n=t.length;i<n;++i)a=s,s=r,r=i<n-1&&Gt(t[i+1],e),s&&(o=t[i],a&&(o.cp1x=_i(o.cp1x,e.left,e.right),o.cp1y=_i(o.cp1y,e.top,e.bottom)),r&&(o.cp2x=_i(o.cp2x,e.left,e.right),o.cp2y=_i(o.cp2y,e.top,e.bottom)))}(t,i)}const vi=t=>0===t||1===t,wi=(t,e,i)=>-Math.pow(2,10*(t-=1))*Math.sin((t-e)*_t/i),Mi=(t,e,i)=>Math.pow(2,-10*t)*Math.sin((t-e)*_t/i)+1,ki={linear:t=>t,easeInQuad:t=>t*t,easeOutQuad:t=>-t*(t-2),easeInOutQuad:t=>(t/=.5)<1?.5*t*t:-.5*(--t*(t-2)-1),easeInCubic:t=>t*t*t,easeOutCubic:t=>(t-=1)*t*t+1,easeInOutCubic:t=>(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2),easeInQuart:t=>t*t*t*t,easeOutQuart:t=>-((t-=1)*t*t*t-1),easeInOutQuart:t=>(t/=.5)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2),easeInQuint:t=>t*t*t*t*t,easeOutQuint:t=>(t-=1)*t*t*t*t+1,easeInOutQuint:t=>(t/=.5)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2),easeInSine:t=>1-Math.cos(t*Mt),easeOutSine:t=>Math.sin(t*Mt),easeInOutSine:t=>-.5*(Math.cos(bt*t)-1),easeInExpo:t=>0===t?0:Math.pow(2,10*(t-1)),easeOutExpo:t=>1===t?1:1-Math.pow(2,-10*t),easeInOutExpo:t=>vi(t)?t:t<.5?.5*Math.pow(2,10*(2*t-1)):.5*(2-Math.pow(2,-10*(2*t-1))),easeInCirc:t=>t>=1?t:-(Math.sqrt(1-t*t)-1),easeOutCirc:t=>Math.sqrt(1-(t-=1)*t),easeInOutCirc:t=>(t/=.5)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1),easeInElastic:t=>vi(t)?t:wi(t,.075,.3),easeOutElastic:t=>vi(t)?t:Mi(t,.075,.3),easeInOutElastic(t){const e=.1125;return vi(t)?t:t<.5?.5*wi(2*t,e,.45):.5+.5*Mi(2*t-1,e,.45)},easeInBack(t){const e=1.70158;return t*t*((e+1)*t-e)},easeOutBack(t){const e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},easeInOutBack(t){let e=1.70158;return(t/=.5)<1?t*t*((1+(e*=1.525))*t-e)*.5:.5*((t-=2)*t*((1+(e*=1.525))*t+e)+2)},easeInBounce:t=>1-ki.easeOutBounce(1-t),easeOutBounce(t){const e=7.5625,i=2.75;return t<1/i?e*t*t:t<2/i?e*(t-=1.5/i)*t+.75:t<2.5/i?e*(t-=2.25/i)*t+.9375:e*(t-=2.625/i)*t+.984375},easeInOutBounce:t=>t<.5?.5*ki.easeInBounce(2*t):.5*ki.easeOutBounce(2*t-1)+.5};function Si(t,e,i,n){return{x:t.x+i*(e.x-t.x),y:t.y+i*(e.y-t.y)}}function Pi(t,e,i,n){return{x:t.x+i*(e.x-t.x),y:"middle"===n?i<.5?t.y:e.y:"after"===n?i<1?t.y:e.y:i>0?e.y:t.y}}function Di(t,e,i,n){const o={x:t.cp2x,y:t.cp2y},s={x:e.cp1x,y:e.cp1y},a=Si(t,o,i),r=Si(o,s,i),l=Si(s,e,i),c=Si(a,r,i),h=Si(r,l,i);return Si(c,h,i)}const Ci=new Map;function Oi(t,e,i){return function(t,e){e=e||{};const i=t+JSON.stringify(e);let n=Ci.get(i);return n||(n=new Intl.NumberFormat(t,e),Ci.set(i,n)),n}(e,i).format(t)}function Ti(t,e,i){return t?function(t,e){return{x:i=>t+t+e-i,setWidth(t){e=t},textAlign:t=>"center"===t?t:"right"===t?"left":"right",xPlus:(t,e)=>t-e,leftForLtr:(t,e)=>t-e}}(e,i):{x:t=>t,setWidth(t){},textAlign:t=>t,xPlus:(t,e)=>t+e,leftForLtr:(t,e)=>t}}function Ai(t,e){let i,n;"ltr"!==e&&"rtl"!==e||(i=t.canvas.style,n=[i.getPropertyValue("direction"),i.getPropertyPriority("direction")],i.setProperty("direction",e,"important"),t.prevTextDirection=n)}function Li(t,e){void 0!==e&&(delete t.prevTextDirection,t.canvas.style.setProperty("direction",e[0],e[1]))}function Ri(t){return"angle"===t?{between:Nt,compare:Vt,normalize:Wt}:{between:(t,e,i)=>t>=Math.min(e,i)&&t<=Math.max(i,e),compare:(t,e)=>t-e,normalize:t=>t}}function Ei({start:t,end:e,count:i,loop:n,style:o}){return{start:t%i,end:e%i,loop:n&&(e-t+1)%i==0,style:o}}function Ii(t,e,i){if(!i)return[t];const{property:n,start:o,end:s}=i,a=e.length,{compare:r,between:l,normalize:c}=Ri(n),{start:h,end:d,loop:u,style:f}=function(t,e,i){const{property:n,start:o,end:s}=i,{between:a,normalize:r}=Ri(n),l=e.length;let c,h,{start:d,end:u,loop:f}=t;if(f){for(d+=l,u+=l,c=0,h=l;c<h&&a(r(e[d%l][n]),o,s);++c)d--,u--;d%=l,u%=l}return u<d&&(u+=l),{start:d,end:u,loop:f,style:t.style}}(t,e,i),g=[];let p,m,x,b=!1,_=null;const y=()=>b||l(o,x,p)&&0!==r(o,x),v=()=>!b||0===r(s,p)||l(s,x,p);for(let t=h,i=h;t<=d;++t)m=e[t%a],m.skip||(p=c(m[n]),p!==x&&(b=l(p,o,s),null===_&&y()&&(_=0===r(p,o)?t:i),null!==_&&v()&&(g.push(Ei({start:_,end:t,loop:u,count:a,style:f})),_=null),i=t,x=p));return null!==_&&g.push(Ei({start:_,end:d,loop:u,count:a,style:f})),g}function zi(t,e){const i=[],n=t.segments;for(let o=0;o<n.length;o++){const s=Ii(n[o],t.points,e);s.length&&i.push(...s)}return i}function Fi(t,e){const i=t.points,n=t.options.spanGaps,o=i.length;if(!o)return[];const s=!!t._loop,{start:a,end:r}=function(t,e,i,n){let o=0,s=e-1;if(i&&!n)for(;o<e&&!t[o].skip;)o++;for(;o<e&&t[o].skip;)o++;for(o%=e,i&&(s+=o);s>o&&t[s%e].skip;)s--;return s%=e,{start:o,end:s}}(i,o,s,n);if(!0===n)return Bi(t,[{start:a,end:r,loop:s}],i,e);return Bi(t,function(t,e,i,n){const o=t.length,s=[];let a,r=e,l=t[e];for(a=e+1;a<=i;++a){const i=t[a%o];i.skip||i.stop?l.skip||(n=!1,s.push({start:e%o,end:(a-1)%o,loop:n}),e=r=i.stop?a:null):(r=a,l.skip&&(e=a)),l=i}return null!==r&&s.push({start:e%o,end:r%o,loop:n}),s}(i,a,r<a?r+o:r,!!t._fullLoop&&0===a&&r===o-1),i,e)}function Bi(t,e,i,n){return n&&n.setContext&&i?function(t,e,i,n){const o=Vi(t.options),s=i.length,a=[];let r=e[0].start,l=r;for(const c of e){let e,h=o,d=i[r%s];for(l=r+1;l<=c.end;l++){const o=i[l%s];e=Vi(n.setContext({type:"segment",p0:d,p1:o,p0DataIndex:(l-1)%s,p1DataIndex:l%s,datasetIndex:t._datasetIndex})),Wi(e,h)&&(a.push({start:r,end:l-1,loop:c.loop,style:h}),h=e,r=l-1),d=o,h=e}r<l-1&&(a.push({start:r,end:l-1,loop:c.loop,style:e}),r=l-1)}return a}(t,e,i,n):e}function Vi(t){return{backgroundColor:t.backgroundColor,borderCapStyle:t.borderCapStyle,borderDash:t.borderDash,borderDashOffset:t.borderDashOffset,borderJoinStyle:t.borderJoinStyle,borderWidth:t.borderWidth,borderColor:t.borderColor}}function Wi(t,e){return e&&JSON.stringify(t)!==JSON.stringify(e)}var Ni=Object.freeze({__proto__:null,easingEffects:ki,color:W,getHoverColor:N,noop:H,uid:j,isNullOrUndef:$,isArray:Y,isObject:U,isFinite:X,finiteOrDefault:q,valueOrDefault:K,toPercentage:G,toDimension:Z,callback:Q,each:J,_elementsEqual:tt,clone:et,_merger:nt,merge:ot,mergeIf:st,_mergerIf:at,_deprecated:function(t,e,i,n){void 0!==e&&console.warn(t+': "'+i+'" is deprecated. Please use "'+n+'" instead')},resolveObjectKey:lt,_capitalize:ct,defined:ht,isFunction:dt,setsEqual:ut,toFontString:$t,_measureText:Yt,_longestText:Ut,_alignPixel:Xt,clearCanvas:qt,drawPoint:Kt,_isPointInArea:Gt,clipArea:Zt,unclipArea:Qt,_steppedLineTo:Jt,_bezierCurveTo:te,renderText:ee,addRoundedRectPath:ne,_lookup:oe,_lookupByKey:se,_rlookupByKey:ae,_filterBetween:re,listenArrayEvents:ce,unlistenArrayEvents:he,_arrayUnique:de,_createResolver:ei,_attachContext:ii,_descriptors:ni,splineCurve:xi,splineCurveMonotone:bi,_updateBezierControlPoints:yi,_isDomSupported:ue,_getParentNode:fe,getStyle:me,getRelativePosition:_e,getMaximumSize:ve,retinaScale:we,supportsEventListenerOptions:Me,readUsedSize:ke,fontString:function(t,e,i){return e+" "+t+"px "+i},requestAnimFrame:t,throttled:e,debounce:i,_toLeftRightCenter:n,_alignStartEnd:o,_textX:s,_pointInLine:Si,_steppedInterpolation:Pi,_bezierInterpolation:Di,formatNumber:Oi,toLineHeight:Ee,_readValueToProps:Ie,toTRBL:ze,toTRBLCorners:Fe,toPadding:Be,toFont:Ve,resolve:We,_addGrace:Ne,PI:bt,TAU:_t,PITAU:yt,INFINITY:vt,RAD_PER_DEG:wt,HALF_PI:Mt,QUARTER_PI:kt,TWO_THIRDS_PI:St,log10:Pt,sign:Dt,niceNum:Ct,_factorize:Ot,isNumber:Tt,almostEquals:At,almostWhole:Lt,_setMinAndMaxByKey:Rt,toRadians:Et,toDegrees:It,_decimalPlaces:zt,getAngleFromPoint:Ft,distanceBetweenPoints:Bt,_angleDiff:Vt,_normalizeAngle:Wt,_angleBetween:Nt,_limitValue:Ht,_int16Range:jt,getRtlAdapter:Ti,overrideTextDirection:Ai,restoreTextDirection:Li,_boundSegment:Ii,_boundSegments:zi,_computeSegments:Fi});class Hi{acquireContext(t,e){}releaseContext(t){return!1}addEventListener(t,e,i){}removeEventListener(t,e,i){}getDevicePixelRatio(){return 1}getMaximumSize(t,e,i,n){return e=Math.max(0,e||t.width),i=i||t.height,{width:e,height:Math.max(0,n?Math.floor(e/n):i)}}isAttached(t){return!0}}class ji extends Hi{acquireContext(t){return t&&t.getContext&&t.getContext("2d")||null}}const $i={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"},Yi=t=>null===t||""===t;const Ui=!!Me&&{passive:!0};function Xi(t,e,i){t.canvas.removeEventListener(e,i,Ui)}function qi(t,e,i){const n=t.canvas,o=n&&fe(n)||n,s=new MutationObserver((t=>{const e=fe(o);t.forEach((t=>{for(let n=0;n<t.addedNodes.length;n++){const s=t.addedNodes[n];s!==o&&s!==e||i(t.target)}}))}));return s.observe(document,{childList:!0,subtree:!0}),s}function Ki(t,e,i){const n=t.canvas,o=n&&fe(n);if(!o)return;const s=new MutationObserver((t=>{t.forEach((t=>{for(let e=0;e<t.removedNodes.length;e++)if(t.removedNodes[e]===n){i();break}}))}));return s.observe(o,{childList:!0}),s}const Gi=new Map;let Zi=0;function Qi(){const t=window.devicePixelRatio;t!==Zi&&(Zi=t,Gi.forEach(((e,i)=>{i.currentDevicePixelRatio!==t&&e()})))}function Ji(t,i,n){const o=t.canvas,s=o&&fe(o);if(!s)return;const a=e(((t,e)=>{const i=s.clientWidth;n(t,e),i<s.clientWidth&&n()}),window),r=new ResizeObserver((t=>{const e=t[0],i=e.contentRect.width,n=e.contentRect.height;0===i&&0===n||a(i,n)}));return r.observe(s),function(t,e){Gi.size||window.addEventListener("resize",Qi),Gi.set(t,e)}(t,a),r}function tn(t,e,i){i&&i.disconnect(),"resize"===e&&function(t){Gi.delete(t),Gi.size||window.removeEventListener("resize",Qi)}(t)}function en(t,i,n){const o=t.canvas,s=e((e=>{null!==t.ctx&&n(function(t,e){const i=$i[t.type]||t.type,{x:n,y:o}=_e(t,e);return{type:i,chart:e,native:t,x:void 0!==n?n:null,y:void 0!==o?o:null}}(e,t))}),t,(t=>{const e=t[0];return[e,e.offsetX,e.offsetY]}));return function(t,e,i){t.addEventListener(e,i,Ui)}(o,i,s),s}class nn extends Hi{acquireContext(t,e){const i=t&&t.getContext&&t.getContext("2d");return i&&i.canvas===t?(function(t,e){const i=t.style,n=t.getAttribute("height"),o=t.getAttribute("width");if(t.$chartjs={initial:{height:n,width:o,style:{display:i.display,height:i.height,width:i.width}}},i.display=i.display||"block",i.boxSizing=i.boxSizing||"border-box",Yi(o)){const e=ke(t,"width");void 0!==e&&(t.width=e)}if(Yi(n))if(""===t.style.height)t.height=t.width/(e||2);else{const e=ke(t,"height");void 0!==e&&(t.height=e)}}(t,e),i):null}releaseContext(t){const e=t.canvas;if(!e.$chartjs)return!1;const i=e.$chartjs.initial;["height","width"].forEach((t=>{const n=i[t];$(n)?e.removeAttribute(t):e.setAttribute(t,n)}));const n=i.style||{};return Object.keys(n).forEach((t=>{e.style[t]=n[t]})),e.width=e.width,delete e.$chartjs,!0}addEventListener(t,e,i){this.removeEventListener(t,e);const n=t.$proxies||(t.$proxies={}),o={attach:qi,detach:Ki,resize:Ji}[e]||en;n[e]=o(t,e,i)}removeEventListener(t,e){const i=t.$proxies||(t.$proxies={}),n=i[e];if(!n)return;({attach:tn,detach:tn,resize:tn}[e]||Xi)(t,e,n),i[e]=void 0}getDevicePixelRatio(){return window.devicePixelRatio}getMaximumSize(t,e,i,n){return ve(t,e,i,n)}isAttached(t){const e=fe(t);return!(!e||!e.isConnected)}}function on(t){return!ue()||"undefined"!=typeof OffscreenCanvas&&t instanceof OffscreenCanvas?ji:nn}var sn=Object.freeze({__proto__:null,_detectPlatform:on,BasePlatform:Hi,BasicPlatform:ji,DomPlatform:nn});const an="transparent",rn={boolean:(t,e,i)=>i>.5?e:t,color(t,e,i){const n=W(t||an),o=n.valid&&W(e||an);return o&&o.valid?o.mix(n,i).hexString():e},number:(t,e,i)=>t+(e-t)*i};class ln{constructor(t,e,i,n){const o=e[i];n=We([t.to,n,o,t.from]);const s=We([t.from,o,n]);this._active=!0,this._fn=t.fn||rn[t.type||typeof s],this._easing=ki[t.easing]||ki.linear,this._start=Math.floor(Date.now()+(t.delay||0)),this._duration=this._total=Math.floor(t.duration),this._loop=!!t.loop,this._target=e,this._prop=i,this._from=s,this._to=n,this._promises=void 0}active(){return this._active}update(t,e,i){const n=this;if(n._active){n._notify(!1);const o=n._target[n._prop],s=i-n._start,a=n._duration-s;n._start=i,n._duration=Math.floor(Math.max(a,t.duration)),n._total+=s,n._loop=!!t.loop,n._to=We([t.to,e,o,t.from]),n._from=We([t.from,o,e])}}cancel(){const t=this;t._active&&(t.tick(Date.now()),t._active=!1,t._notify(!1))}tick(t){const e=this,i=t-e._start,n=e._duration,o=e._prop,s=e._from,a=e._loop,r=e._to;let l;if(e._active=s!==r&&(a||i<n),!e._active)return e._target[o]=r,void e._notify(!0);i<0?e._target[o]=s:(l=i/n%2,l=a&&l>1?2-l:l,l=e._easing(Math.min(1,Math.max(0,l))),e._target[o]=e._fn(s,r,l))}wait(){const t=this._promises||(this._promises=[]);return new Promise(((e,i)=>{t.push({res:e,rej:i})}))}_notify(t){const e=t?"res":"rej",i=this._promises||[];for(let t=0;t<i.length;t++)i[t][e]()}}xt.set("animation",{delay:void 0,duration:1e3,easing:"easeOutQuart",fn:void 0,from:void 0,loop:void 0,to:void 0,type:void 0});const cn=Object.keys(xt.animation);xt.describe("animation",{_fallback:!1,_indexable:!1,_scriptable:t=>"onProgress"!==t&&"onComplete"!==t&&"fn"!==t}),xt.set("animations",{colors:{type:"color",properties:["color","borderColor","backgroundColor"]},numbers:{type:"number",properties:["x","y","borderWidth","radius","tension"]}}),xt.describe("animations",{_fallback:"animation"}),xt.set("transitions",{active:{animation:{duration:400}},resize:{animation:{duration:0}},show:{animations:{colors:{from:"transparent"},visible:{type:"boolean",duration:0}}},hide:{animations:{colors:{to:"transparent"},visible:{type:"boolean",easing:"linear",fn:t=>0|t}}}});class hn{constructor(t,e){this._chart=t,this._properties=new Map,this.configure(e)}configure(t){if(!U(t))return;const e=this._properties;Object.getOwnPropertyNames(t).forEach((i=>{const n=t[i];if(!U(n))return;const o={};for(const t of cn)o[t]=n[t];(Y(n.properties)&&n.properties||[i]).forEach((t=>{t!==i&&e.has(t)||e.set(t,o)}))}))}_animateOptions(t,e){const i=e.options,n=function(t,e){if(!e)return;let i=t.options;if(!i)return void(t.options=e);i.$shared&&(t.options=i=Object.assign({},i,{$shared:!1,$animations:{}}));return i}(t,i);if(!n)return[];const o=this._createAnimations(n,i);return i.$shared&&function(t,e){const i=[],n=Object.keys(e);for(let e=0;e<n.length;e++){const o=t[n[e]];o&&o.active()&&i.push(o.wait())}return Promise.all(i)}(t.options.$animations,i).then((()=>{t.options=i}),(()=>{})),o}_createAnimations(t,e){const i=this._properties,n=[],o=t.$animations||(t.$animations={}),s=Object.keys(e),a=Date.now();let r;for(r=s.length-1;r>=0;--r){const l=s[r];if("$"===l.charAt(0))continue;if("options"===l){n.push(...this._animateOptions(t,e));continue}const c=e[l];let h=o[l];const d=i.get(l);if(h){if(d&&h.active()){h.update(d,c,a);continue}h.cancel()}d&&d.duration?(o[l]=h=new ln(d,t,l,c),n.push(h)):t[l]=c}return n}update(t,e){if(0===this._properties.size)return void Object.assign(t,e);const i=this._createAnimations(t,e);return i.length?(a.add(this._chart,i),!0):void 0}}function dn(t,e){const i=t&&t.options||{},n=i.reverse,o=void 0===i.min?e:0,s=void 0===i.max?e:0;return{start:n?s:o,end:n?o:s}}function un(t,e){const i=[],n=t._getSortedDatasetMetas(e);let o,s;for(o=0,s=n.length;o<s;++o)i.push(n[o].index);return i}function fn(t,e,i,n){const o=t.keys,s="single"===n.mode;let a,r,l,c;if(null!==e){for(a=0,r=o.length;a<r;++a){if(l=+o[a],l===i){if(n.all)continue;break}c=t.values[l],X(c)&&(s||0===e||Dt(e)===Dt(c))&&(e+=c)}return e}}function gn(t,e){const i=t&&t.options.stacked;return i||void 0===i&&void 0!==e.stack}function pn(t,e,i){const n=t[e]||(t[e]={});return n[i]||(n[i]={})}function mn(t,e,i){for(const n of e.getMatchingVisibleMetas("bar").reverse()){const e=t[n.index];if(i&&e>0||!i&&e<0)return n.index}return null}function xn(t,e){const{chart:i,_cachedMeta:n}=t,o=i._stacks||(i._stacks={}),{iScale:s,vScale:a,index:r}=n,l=s.axis,c=a.axis,h=function(t,e,i){return`${t.id}.${e.id}.${i.stack||i.type}`}(s,a,n),d=e.length;let u;for(let t=0;t<d;++t){const i=e[t],{[l]:n,[c]:s}=i;u=(i._stacks||(i._stacks={}))[c]=pn(o,h,n),u[r]=s,u._top=mn(u,a,!0),u._bottom=mn(u,a,!1)}}function bn(t,e){const i=t.scales;return Object.keys(i).filter((t=>i[t].axis===e)).shift()}function _n(t,e){const i=t.controller.index,n=t.vScale&&t.vScale.axis;if(n){e=e||t._parsed;for(const t of e){const e=t._stacks;if(!e||void 0===e[n]||void 0===e[n][i])return;delete e[n][i]}}}const yn=t=>"reset"===t||"none"===t,vn=(t,e)=>e?t:Object.assign({},t);class wn{constructor(t,e){this.chart=t,this._ctx=t.ctx,this.index=e,this._cachedDataOpts={},this._cachedMeta=this.getMeta(),this._type=this._cachedMeta.type,this.options=void 0,this._parsing=!1,this._data=void 0,this._objectData=void 0,this._sharedOptions=void 0,this._drawStart=void 0,this._drawCount=void 0,this.enableOptionSharing=!1,this.$context=void 0,this._syncList=[],this.initialize()}initialize(){const t=this,e=t._cachedMeta;t.configure(),t.linkScales(),e._stacked=gn(e.vScale,e),t.addElements()}updateIndex(t){this.index!==t&&_n(this._cachedMeta),this.index=t}linkScales(){const t=this,e=t.chart,i=t._cachedMeta,n=t.getDataset(),o=(t,e,i,n)=>"x"===t?e:"r"===t?n:i,s=i.xAxisID=K(n.xAxisID,bn(e,"x")),a=i.yAxisID=K(n.yAxisID,bn(e,"y")),r=i.rAxisID=K(n.rAxisID,bn(e,"r")),l=i.indexAxis,c=i.iAxisID=o(l,s,a,r),h=i.vAxisID=o(l,a,s,r);i.xScale=t.getScaleForId(s),i.yScale=t.getScaleForId(a),i.rScale=t.getScaleForId(r),i.iScale=t.getScaleForId(c),i.vScale=t.getScaleForId(h)}getDataset(){return this.chart.data.datasets[this.index]}getMeta(){return this.chart.getDatasetMeta(this.index)}getScaleForId(t){return this.chart.scales[t]}_getOtherScale(t){const e=this._cachedMeta;return t===e.iScale?e.vScale:e.iScale}reset(){this._update("reset")}_destroy(){const t=this._cachedMeta;this._data&&he(this._data,this),t._stacked&&_n(t)}_dataCheck(){const t=this,e=t.getDataset(),i=e.data||(e.data=[]),n=t._data;if(U(i))t._data=function(t){const e=Object.keys(t),i=new Array(e.length);let n,o,s;for(n=0,o=e.length;n<o;++n)s=e[n],i[n]={x:s,y:t[s]};return i}(i);else if(n!==i){if(n){he(n,t);const e=t._cachedMeta;_n(e),e._parsed=[]}i&&Object.isExtensible(i)&&ce(i,t),t._syncList=[],t._data=i}}addElements(){const t=this,e=t._cachedMeta;t._dataCheck(),t.datasetElementType&&(e.dataset=new t.datasetElementType)}buildOrUpdateElements(t){const e=this,i=e._cachedMeta,n=e.getDataset();let o=!1;e._dataCheck();const s=i._stacked;i._stacked=gn(i.vScale,i),i.stack!==n.stack&&(o=!0,_n(i),i.stack=n.stack),e._resyncElements(t),(o||s!==i._stacked)&&xn(e,i._parsed)}configure(){const t=this,e=t.chart.config,i=e.datasetScopeKeys(t._type),n=e.getOptionScopes(t.getDataset(),i,!0);t.options=e.createResolver(n,t.getContext()),t._parsing=t.options.parsing}parse(t,e){const i=this,{_cachedMeta:n,_data:o}=i,{iScale:s,_stacked:a}=n,r=s.axis;let l,c,h,d=0===t&&e===o.length||n._sorted,u=t>0&&n._parsed[t-1];if(!1===i._parsing)n._parsed=o,n._sorted=!0,h=o;else{h=Y(o[t])?i.parseArrayData(n,o,t,e):U(o[t])?i.parseObjectData(n,o,t,e):i.parsePrimitiveData(n,o,t,e);const s=()=>null===c[r]||u&&c[r]<u[r];for(l=0;l<e;++l)n._parsed[l+t]=c=h[l],d&&(s()&&(d=!1),u=c);n._sorted=d}a&&xn(i,h)}parsePrimitiveData(t,e,i,n){const{iScale:o,vScale:s}=t,a=o.axis,r=s.axis,l=o.getLabels(),c=o===s,h=new Array(n);let d,u,f;for(d=0,u=n;d<u;++d)f=d+i,h[d]={[a]:c||o.parse(l[f],f),[r]:s.parse(e[f],f)};return h}parseArrayData(t,e,i,n){const{xScale:o,yScale:s}=t,a=new Array(n);let r,l,c,h;for(r=0,l=n;r<l;++r)c=r+i,h=e[c],a[r]={x:o.parse(h[0],c),y:s.parse(h[1],c)};return a}parseObjectData(t,e,i,n){const{xScale:o,yScale:s}=t,{xAxisKey:a="x",yAxisKey:r="y"}=this._parsing,l=new Array(n);let c,h,d,u;for(c=0,h=n;c<h;++c)d=c+i,u=e[d],l[c]={x:o.parse(lt(u,a),d),y:s.parse(lt(u,r),d)};return l}getParsed(t){return this._cachedMeta._parsed[t]}getDataElement(t){return this._cachedMeta.data[t]}applyStack(t,e,i){const n=this.chart,o=this._cachedMeta,s=e[t.axis];return fn({keys:un(n,!0),values:e._stacks[t.axis]},s,o.index,{mode:i})}updateRangeFromParsed(t,e,i,n){const o=i[e.axis];let s=null===o?NaN:o;const a=n&&i._stacks[e.axis];n&&a&&(n.values=a,t.min=Math.min(t.min,s),t.max=Math.max(t.max,s),s=fn(n,o,this._cachedMeta.index,{all:!0})),t.min=Math.min(t.min,s),t.max=Math.max(t.max,s)}getMinMax(t,e){const i=this,n=i._cachedMeta,o=n._parsed,s=n._sorted&&t===n.iScale,a=o.length,r=i._getOtherScale(t),l=e&&n._stacked&&{keys:un(i.chart,!0),values:null},c={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY},{min:h,max:d}=function(t){const{min:e,max:i,minDefined:n,maxDefined:o}=t.getUserBounds();return{min:n?e:Number.NEGATIVE_INFINITY,max:o?i:Number.POSITIVE_INFINITY}}(r);let u,f,g,p;function m(){return g=o[u],f=g[t.axis],p=g[r.axis],!X(f)||h>p||d<p}for(u=0;u<a&&(m()||(i.updateRangeFromParsed(c,t,g,l),!s));++u);if(s)for(u=a-1;u>=0;--u)if(!m()){i.updateRangeFromParsed(c,t,g,l);break}return c}getAllParsedValues(t){const e=this._cachedMeta._parsed,i=[];let n,o,s;for(n=0,o=e.length;n<o;++n)s=e[n][t.axis],X(s)&&i.push(s);return i}getMaxOverflow(){return!1}getLabelAndValue(t){const e=this._cachedMeta,i=e.iScale,n=e.vScale,o=this.getParsed(t);return{label:i?""+i.getLabelForValue(o[i.axis]):"",value:n?""+n.getLabelForValue(o[n.axis]):""}}_update(t){const e=this,i=e._cachedMeta;e.configure(),e._cachedDataOpts={},e.update(t||"default"),i._clip=function(t){let e,i,n,o;return U(t)?(e=t.top,i=t.right,n=t.bottom,o=t.left):e=i=n=o=t,{top:e,right:i,bottom:n,left:o,disabled:!1===t}}(K(e.options.clip,function(t,e,i){if(!1===i)return!1;const n=dn(t,i),o=dn(e,i);return{top:o.end,right:n.end,bottom:o.start,left:n.start}}(i.xScale,i.yScale,e.getMaxOverflow())))}update(t){}draw(){const t=this,e=t._ctx,i=t.chart,n=t._cachedMeta,o=n.data||[],s=i.chartArea,a=[],r=t._drawStart||0,l=t._drawCount||o.length-r;let c;for(n.dataset&&n.dataset.draw(e,s,r,l),c=r;c<r+l;++c){const t=o[c];t.hidden||(t.active?a.push(t):t.draw(e,s))}for(c=0;c<a.length;++c)a[c].draw(e,s)}getStyle(t,e){const i=e?"active":"default";return void 0===t&&this._cachedMeta.dataset?this.resolveDatasetElementOptions(i):this.resolveDataElementOptions(t||0,i)}getContext(t,e,i){const n=this,o=n.getDataset();let s;if(t>=0&&t<n._cachedMeta.data.length){const e=n._cachedMeta.data[t];s=e.$context||(e.$context=function(t,e,i){return Object.assign(Object.create(t),{active:!1,dataIndex:e,parsed:void 0,raw:void 0,element:i,index:e,mode:"default",type:"data"})}(n.getContext(),t,e)),s.parsed=n.getParsed(t),s.raw=o.data[t],s.index=s.dataIndex=t}else s=n.$context||(n.$context=function(t,e){return Object.assign(Object.create(t),{active:!1,dataset:void 0,datasetIndex:e,index:e,mode:"default",type:"dataset"})}(n.chart.getContext(),n.index)),s.dataset=o,s.index=s.datasetIndex=n.index;return s.active=!!e,s.mode=i,s}resolveDatasetElementOptions(t){return this._resolveElementOptions(this.datasetElementType.id,t)}resolveDataElementOptions(t,e){return this._resolveElementOptions(this.dataElementType.id,e,t)}_resolveElementOptions(t,e="default",i){const n=this,o="active"===e,s=n._cachedDataOpts,a=t+"-"+e,r=s[a],l=n.enableOptionSharing&&ht(i);if(r)return vn(r,l);const c=n.chart.config,h=c.datasetElementScopeKeys(n._type,t),d=o?[`${t}Hover`,"hover",t,""]:[t,""],u=c.getOptionScopes(n.getDataset(),h),f=Object.keys(xt.elements[t]),g=c.resolveNamedOptions(u,f,(()=>n.getContext(i,o)),d);return g.$shared&&(g.$shared=l,s[a]=Object.freeze(vn(g,l))),g}_resolveAnimations(t,e,i){const n=this,o=n.chart,s=n._cachedDataOpts,a=`animation-${e}`,r=s[a];if(r)return r;let l;if(!1!==o.options.animation){const o=n.chart.config,s=o.datasetAnimationScopeKeys(n._type,e),a=o.getOptionScopes(n.getDataset(),s);l=o.createResolver(a,n.getContext(t,i,e))}const c=new hn(o,l&&l.animations);return l&&l._cacheable&&(s[a]=Object.freeze(c)),c}getSharedOptions(t){if(t.$shared)return this._sharedOptions||(this._sharedOptions=Object.assign({},t))}includeOptions(t,e){return!e||yn(t)||this.chart._animationsDisabled}updateElement(t,e,i,n){yn(n)?Object.assign(t,i):this._resolveAnimations(e,n).update(t,i)}updateSharedOptions(t,e,i){t&&!yn(e)&&this._resolveAnimations(void 0,e).update(t,i)}_setStyle(t,e,i,n){t.active=n;const o=this.getStyle(e,n);this._resolveAnimations(e,i,n).update(t,{options:!n&&this.getSharedOptions(o)||o})}removeHoverStyle(t,e,i){this._setStyle(t,i,"active",!1)}setHoverStyle(t,e,i){this._setStyle(t,i,"active",!0)}_removeDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!1)}_setDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!0)}_resyncElements(t){const e=this,i=e._data,n=e._cachedMeta.data;for(const[t,i,n]of e._syncList)e[t](i,n);e._syncList=[];const o=n.length,s=i.length,a=Math.min(s,o);a&&e.parse(0,a),s>o?e._insertElements(o,s-o,t):s<o&&e._removeElements(s,o-s)}_insertElements(t,e,i=!0){const n=this,o=n._cachedMeta,s=o.data,a=t+e;let r;const l=t=>{for(t.length+=e,r=t.length-1;r>=a;r--)t[r]=t[r-e]};for(l(s),r=t;r<a;++r)s[r]=new n.dataElementType;n._parsing&&l(o._parsed),n.parse(t,e),i&&n.updateElements(s,t,e,"reset")}updateElements(t,e,i,n){}_removeElements(t,e){const i=this._cachedMeta;if(this._parsing){const n=i._parsed.splice(t,e);i._stacked&&_n(i,n)}i.data.splice(t,e)}_sync(t){if(this._parsing)this._syncList.push(t);else{const[e,i,n]=t;this[e](i,n)}}_onDataPush(){const t=arguments.length;this._sync(["_insertElements",this.getDataset().data.length-t,t])}_onDataPop(){this._sync(["_removeElements",this._cachedMeta.data.length-1,1])}_onDataShift(){this._sync(["_removeElements",0,1])}_onDataSplice(t,e){this._sync(["_removeElements",t,e]),this._sync(["_insertElements",t,arguments.length-2])}_onDataUnshift(){this._sync(["_insertElements",0,arguments.length])}}wn.defaults={},wn.prototype.datasetElementType=null,wn.prototype.dataElementType=null;class Mn{constructor(){this.x=void 0,this.y=void 0,this.active=!1,this.options=void 0,this.$animations=void 0}tooltipPosition(t){const{x:e,y:i}=this.getProps(["x","y"],t);return{x:e,y:i}}hasValue(){return Tt(this.x)&&Tt(this.y)}getProps(t,e){const i=this,n=this.$animations;if(!e||!n)return i;const o={};return t.forEach((t=>{o[t]=n[t]&&n[t].active()?n[t]._to:i[t]})),o}}Mn.defaults={},Mn.defaultRoutes=void 0;const kn={values:t=>Y(t)?t:""+t,numeric(t,e,i){if(0===t)return"0";const n=this.chart.options.locale;let o,s=t;if(i.length>1){const e=Math.max(Math.abs(i[0].value),Math.abs(i[i.length-1].value));(e<1e-4||e>1e15)&&(o="scientific"),s=function(t,e){let i=e.length>3?e[2].value-e[1].value:e[1].value-e[0].value;Math.abs(i)>=1&&t!==Math.floor(t)&&(i=t-Math.floor(t));return i}(t,i)}const a=Pt(Math.abs(s)),r=Math.max(Math.min(-1*Math.floor(a),20),0),l={notation:o,minimumFractionDigits:r,maximumFractionDigits:r};return Object.assign(l,this.options.ticks.format),Oi(t,n,l)},logarithmic(t,e,i){if(0===t)return"0";const n=t/Math.pow(10,Math.floor(Pt(t)));return 1===n||2===n||5===n?kn.numeric.call(this,t,e,i):""}};var Sn={formatters:kn};function Pn(t,e){const i=t.options.ticks,n=i.maxTicksLimit||function(t){const e=t.options.offset,i=t._tickSize(),n=t._length/i+(e?0:1),o=t._maxLength/i;return Math.floor(Math.min(n,o))}(t),o=i.major.enabled?function(t){const e=[];let i,n;for(i=0,n=t.length;i<n;i++)t[i].major&&e.push(i);return e}(e):[],s=o.length,a=o[0],r=o[s-1],l=[];if(s>n)return function(t,e,i,n){let o,s=0,a=i[0];for(n=Math.ceil(n),o=0;o<t.length;o++)o===a&&(e.push(t[o]),s++,a=i[s*n])}(e,l,o,s/n),l;const c=function(t,e,i){const n=function(t){const e=t.length;let i,n;if(e<2)return!1;for(n=t[0],i=1;i<e;++i)if(t[i]-t[i-1]!==n)return!1;return n}(t),o=e.length/i;if(!n)return Math.max(o,1);const s=Ot(n);for(let t=0,e=s.length-1;t<e;t++){const e=s[t];if(e>o)return e}return Math.max(o,1)}(o,e,n);if(s>0){let t,i;const n=s>1?Math.round((r-a)/(s-1)):null;for(Dn(e,l,c,$(n)?0:a-n,a),t=0,i=s-1;t<i;t++)Dn(e,l,c,o[t],o[t+1]);return Dn(e,l,c,r,$(n)?e.length:r+n),l}return Dn(e,l,c),l}function Dn(t,e,i,n,o){const s=K(n,0),a=Math.min(K(o,t.length),t.length);let r,l,c,h=0;for(i=Math.ceil(i),o&&(r=o-n,i=r/Math.floor(r/i)),c=s;c<0;)h++,c=Math.round(s+h*i);for(l=Math.max(s,0);l<a;l++)l===c&&(e.push(t[l]),h++,c=Math.round(s+h*i))}xt.set("scale",{display:!0,offset:!1,reverse:!1,beginAtZero:!1,bounds:"ticks",grace:0,grid:{display:!0,lineWidth:1,drawBorder:!0,drawOnChartArea:!0,drawTicks:!0,tickLength:8,tickWidth:(t,e)=>e.lineWidth,tickColor:(t,e)=>e.color,offset:!1,borderDash:[],borderDashOffset:0,borderWidth:1},title:{display:!1,text:"",padding:{top:4,bottom:4}},ticks:{minRotation:0,maxRotation:50,mirror:!1,textStrokeWidth:0,textStrokeColor:"",padding:3,display:!0,autoSkip:!0,autoSkipPadding:3,labelOffset:0,callback:Sn.formatters.values,minor:{},major:{},align:"center",crossAlign:"near",showLabelBackdrop:!1,backdropColor:"rgba(255, 255, 255, 0.75)",backdropPadding:2}}),xt.route("scale.ticks","color","","color"),xt.route("scale.grid","color","","borderColor"),xt.route("scale.grid","borderColor","","borderColor"),xt.route("scale.title","color","","color"),xt.describe("scale",{_fallback:!1,_scriptable:t=>!t.startsWith("before")&&!t.startsWith("after")&&"callback"!==t&&"parser"!==t,_indexable:t=>"borderDash"!==t&&"tickBorderDash"!==t}),xt.describe("scales",{_fallback:"scale"}),xt.describe("scale.ticks",{_scriptable:t=>"backdropPadding"!==t&&"callback"!==t,_indexable:t=>"backdropPadding"!==t});const Cn=(t,e,i)=>"top"===e||"left"===e?t[e]+i:t[e]-i;function On(t,e){const i=[],n=t.length/e,o=t.length;let s=0;for(;s<o;s+=n)i.push(t[Math.floor(s)]);return i}function Tn(t,e,i){const n=t.ticks.length,o=Math.min(e,n-1),s=t._startPixel,a=t._endPixel,r=1e-6;let l,c=t.getPixelForTick(o);if(!(i&&(l=1===n?Math.max(c-s,a-c):0===e?(t.getPixelForTick(1)-c)/2:(c-t.getPixelForTick(o-1))/2,c+=o<e?l:-l,c<s-r||c>a+r)))return c}function An(t){return t.drawTicks?t.tickLength:0}function Ln(t,e){if(!t.display)return 0;const i=Ve(t.font,e),n=Be(t.padding);return(Y(t.text)?t.text.length:1)*i.lineHeight+n.height}function Rn(t,e,i){let o=n(t);return(i&&"right"!==e||!i&&"right"===e)&&(o=(t=>"left"===t?"right":"right"===t?"left":t)(o)),o}class En extends Mn{constructor(t){super(),this.id=t.id,this.type=t.type,this.options=void 0,this.ctx=t.ctx,this.chart=t.chart,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this._margins={left:0,right:0,top:0,bottom:0},this.maxWidth=void 0,this.maxHeight=void 0,this.paddingTop=void 0,this.paddingBottom=void 0,this.paddingLeft=void 0,this.paddingRight=void 0,this.axis=void 0,this.labelRotation=void 0,this.min=void 0,this.max=void 0,this._range=void 0,this.ticks=[],this._gridLineItems=null,this._labelItems=null,this._labelSizes=null,this._length=0,this._maxLength=0,this._longestTextCache={},this._startPixel=void 0,this._endPixel=void 0,this._reversePixels=!1,this._userMax=void 0,this._userMin=void 0,this._suggestedMax=void 0,this._suggestedMin=void 0,this._ticksLength=0,this._borderValue=0,this._cache={},this._dataLimitsCached=!1,this.$context=void 0}init(t){const e=this;e.options=t.setContext(e.getContext()),e.axis=t.axis,e._userMin=e.parse(t.min),e._userMax=e.parse(t.max),e._suggestedMin=e.parse(t.suggestedMin),e._suggestedMax=e.parse(t.suggestedMax)}parse(t,e){return t}getUserBounds(){let{_userMin:t,_userMax:e,_suggestedMin:i,_suggestedMax:n}=this;return t=q(t,Number.POSITIVE_INFINITY),e=q(e,Number.NEGATIVE_INFINITY),i=q(i,Number.POSITIVE_INFINITY),n=q(n,Number.NEGATIVE_INFINITY),{min:q(t,i),max:q(e,n),minDefined:X(t),maxDefined:X(e)}}getMinMax(t){const e=this;let i,{min:n,max:o,minDefined:s,maxDefined:a}=e.getUserBounds();if(s&&a)return{min:n,max:o};const r=e.getMatchingVisibleMetas();for(let l=0,c=r.length;l<c;++l)i=r[l].controller.getMinMax(e,t),s||(n=Math.min(n,i.min)),a||(o=Math.max(o,i.max));return{min:q(n,q(o,n)),max:q(o,q(n,o))}}getPadding(){const t=this;return{left:t.paddingLeft||0,top:t.paddingTop||0,right:t.paddingRight||0,bottom:t.paddingBottom||0}}getTicks(){return this.ticks}getLabels(){const t=this.chart.data;return this.options.labels||(this.isHorizontal()?t.xLabels:t.yLabels)||t.labels||[]}beforeLayout(){this._cache={},this._dataLimitsCached=!1}beforeUpdate(){Q(this.options.beforeUpdate,[this])}update(t,e,i){const n=this,o=n.options.ticks,s=o.sampleSize;n.beforeUpdate(),n.maxWidth=t,n.maxHeight=e,n._margins=i=Object.assign({left:0,right:0,top:0,bottom:0},i),n.ticks=null,n._labelSizes=null,n._gridLineItems=null,n._labelItems=null,n.beforeSetDimensions(),n.setDimensions(),n.afterSetDimensions(),n._maxLength=n.isHorizontal()?n.width+i.left+i.right:n.height+i.top+i.bottom,n._dataLimitsCached||(n.beforeDataLimits(),n.determineDataLimits(),n.afterDataLimits(),n._range=Ne(n,n.options.grace),n._dataLimitsCached=!0),n.beforeBuildTicks(),n.ticks=n.buildTicks()||[],n.afterBuildTicks();const a=s<n.ticks.length;n._convertTicksToLabels(a?On(n.ticks,s):n.ticks),n.configure(),n.beforeCalculateLabelRotation(),n.calculateLabelRotation(),n.afterCalculateLabelRotation(),o.display&&(o.autoSkip||"auto"===o.source)&&(n.ticks=Pn(n,n.ticks),n._labelSizes=null),a&&n._convertTicksToLabels(n.ticks),n.beforeFit(),n.fit(),n.afterFit(),n.afterUpdate()}configure(){const t=this;let e,i,n=t.options.reverse;t.isHorizontal()?(e=t.left,i=t.right):(e=t.top,i=t.bottom,n=!n),t._startPixel=e,t._endPixel=i,t._reversePixels=n,t._length=i-e,t._alignToPixels=t.options.alignToPixels}afterUpdate(){Q(this.options.afterUpdate,[this])}beforeSetDimensions(){Q(this.options.beforeSetDimensions,[this])}setDimensions(){const t=this;t.isHorizontal()?(t.width=t.maxWidth,t.left=0,t.right=t.width):(t.height=t.maxHeight,t.top=0,t.bottom=t.height),t.paddingLeft=0,t.paddingTop=0,t.paddingRight=0,t.paddingBottom=0}afterSetDimensions(){Q(this.options.afterSetDimensions,[this])}_callHooks(t){const e=this;e.chart.notifyPlugins(t,e.getContext()),Q(e.options[t],[e])}beforeDataLimits(){this._callHooks("beforeDataLimits")}determineDataLimits(){}afterDataLimits(){this._callHooks("afterDataLimits")}beforeBuildTicks(){this._callHooks("beforeBuildTicks")}buildTicks(){return[]}afterBuildTicks(){this._callHooks("afterBuildTicks")}beforeTickToLabelConversion(){Q(this.options.beforeTickToLabelConversion,[this])}generateTickLabels(t){const e=this,i=e.options.ticks;let n,o,s;for(n=0,o=t.length;n<o;n++)s=t[n],s.label=Q(i.callback,[s.value,n,t],e)}afterTickToLabelConversion(){Q(this.options.afterTickToLabelConversion,[this])}beforeCalculateLabelRotation(){Q(this.options.beforeCalculateLabelRotation,[this])}calculateLabelRotation(){const t=this,e=t.options,i=e.ticks,n=t.ticks.length,o=i.minRotation||0,s=i.maxRotation;let a,r,l,c=o;if(!t._isVisible()||!i.display||o>=s||n<=1||!t.isHorizontal())return void(t.labelRotation=o);const h=t._getLabelSizes(),d=h.widest.width,u=h.highest.height,f=Ht(t.chart.width-d,0,t.maxWidth);a=e.offset?t.maxWidth/n:f/(n-1),d+6>a&&(a=f/(n-(e.offset?.5:1)),r=t.maxHeight-An(e.grid)-i.padding-Ln(e.title,t.chart.options.font),l=Math.sqrt(d*d+u*u),c=It(Math.min(Math.asin(Ht((h.highest.height+6)/a,-1,1)),Math.asin(Ht(r/l,-1,1))-Math.asin(Ht(u/l,-1,1)))),c=Math.max(o,Math.min(s,c))),t.labelRotation=c}afterCalculateLabelRotation(){Q(this.options.afterCalculateLabelRotation,[this])}beforeFit(){Q(this.options.beforeFit,[this])}fit(){const t=this,e={width:0,height:0},{chart:i,options:{ticks:n,title:o,grid:s}}=t,a=t._isVisible(),r=t.isHorizontal();if(a){const a=Ln(o,i.options.font);if(r?(e.width=t.maxWidth,e.height=An(s)+a):(e.height=t.maxHeight,e.width=An(s)+a),n.display&&t.ticks.length){const{first:i,last:o,widest:s,highest:a}=t._getLabelSizes(),l=2*n.padding,c=Et(t.labelRotation),h=Math.cos(c),d=Math.sin(c);if(r){const i=n.mirror?0:d*s.width+h*a.height;e.height=Math.min(t.maxHeight,e.height+i+l)}else{const i=n.mirror?0:h*s.width+d*a.height;e.width=Math.min(t.maxWidth,e.width+i+l)}t._calculatePadding(i,o,d,h)}}t._handleMargins(),r?(t.width=t._length=i.width-t._margins.left-t._margins.right,t.height=e.height):(t.width=e.width,t.height=t._length=i.height-t._margins.top-t._margins.bottom)}_calculatePadding(t,e,i,n){const o=this,{ticks:{align:s,padding:a},position:r}=o.options,l=0!==o.labelRotation,c="top"!==r&&"x"===o.axis;if(o.isHorizontal()){const r=o.getPixelForTick(0)-o.left,h=o.right-o.getPixelForTick(o.ticks.length-1);let d=0,u=0;l?c?(d=n*t.width,u=i*e.height):(d=i*t.height,u=n*e.width):"start"===s?u=e.width:"end"===s?d=t.width:(d=t.width/2,u=e.width/2),o.paddingLeft=Math.max((d-r+a)*o.width/(o.width-r),0),o.paddingRight=Math.max((u-h+a)*o.width/(o.width-h),0)}else{let i=e.height/2,n=t.height/2;"start"===s?(i=0,n=t.height):"end"===s&&(i=e.height,n=0),o.paddingTop=i+a,o.paddingBottom=n+a}}_handleMargins(){const t=this;t._margins&&(t._margins.left=Math.max(t.paddingLeft,t._margins.left),t._margins.top=Math.max(t.paddingTop,t._margins.top),t._margins.right=Math.max(t.paddingRight,t._margins.right),t._margins.bottom=Math.max(t.paddingBottom,t._margins.bottom))}afterFit(){Q(this.options.afterFit,[this])}isHorizontal(){const{axis:t,position:e}=this.options;return"top"===e||"bottom"===e||"x"===t}isFullSize(){return this.options.fullSize}_convertTicksToLabels(t){const e=this;let i,n;for(e.beforeTickToLabelConversion(),e.generateTickLabels(t),i=0,n=t.length;i<n;i++)$(t[i].label)&&(t.splice(i,1),n--,i--);e.afterTickToLabelConversion()}_getLabelSizes(){const t=this;let e=t._labelSizes;if(!e){const i=t.options.ticks.sampleSize;let n=t.ticks;i<n.length&&(n=On(n,i)),t._labelSizes=e=t._computeLabelSizes(n,n.length)}return e}_computeLabelSizes(t,e){const{ctx:i,_longestTextCache:n}=this,o=[],s=[];let a,r,l,c,h,d,u,f,g,p,m,x=0,b=0;for(a=0;a<e;++a){if(c=t[a].label,h=this._resolveTickFontOptions(a),i.font=d=h.string,u=n[d]=n[d]||{data:{},gc:[]},f=h.lineHeight,g=p=0,$(c)||Y(c)){if(Y(c))for(r=0,l=c.length;r<l;++r)m=c[r],$(m)||Y(m)||(g=Yt(i,u.data,u.gc,g,m),p+=f)}else g=Yt(i,u.data,u.gc,g,c),p=f;o.push(g),s.push(p),x=Math.max(g,x),b=Math.max(p,b)}!function(t,e){J(t,(t=>{const i=t.gc,n=i.length/2;let o;if(n>e){for(o=0;o<n;++o)delete t.data[i[o]];i.splice(0,n)}}))}(n,e);const _=o.indexOf(x),y=s.indexOf(b),v=t=>({width:o[t]||0,height:s[t]||0});return{first:v(0),last:v(e-1),widest:v(_),highest:v(y),widths:o,heights:s}}getLabelForValue(t){return t}getPixelForValue(t,e){return NaN}getValueForPixel(t){}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getPixelForDecimal(t){const e=this;e._reversePixels&&(t=1-t);const i=e._startPixel+t*e._length;return jt(e._alignToPixels?Xt(e.chart,i,0):i)}getDecimalForPixel(t){const e=(t-this._startPixel)/this._length;return this._reversePixels?1-e:e}getBasePixel(){return this.getPixelForValue(this.getBaseValue())}getBaseValue(){const{min:t,max:e}=this;return t<0&&e<0?e:t>0&&e>0?t:0}getContext(t){const e=this,i=e.ticks||[];if(t>=0&&t<i.length){const n=i[t];return n.$context||(n.$context=function(t,e,i){return Object.assign(Object.create(t),{tick:i,index:e,type:"tick"})}(e.getContext(),t,n))}return e.$context||(e.$context=(n=e.chart.getContext(),o=e,Object.assign(Object.create(n),{scale:o,type:"scale"})));var n,o}_tickSize(){const t=this,e=t.options.ticks,i=Et(t.labelRotation),n=Math.abs(Math.cos(i)),o=Math.abs(Math.sin(i)),s=t._getLabelSizes(),a=e.autoSkipPadding||0,r=s?s.widest.width+a:0,l=s?s.highest.height+a:0;return t.isHorizontal()?l*n>r*o?r/n:l/o:l*o<r*n?l/n:r/o}_isVisible(){const t=this.options.display;return"auto"!==t?!!t:this.getMatchingVisibleMetas().length>0}_computeGridLineItems(t){const e=this,i=e.axis,n=e.chart,o=e.options,{grid:s,position:a}=o,r=s.offset,l=e.isHorizontal(),c=e.ticks.length+(r?1:0),h=An(s),d=[],u=s.setContext(e.getContext()),f=u.drawBorder?u.borderWidth:0,g=f/2,p=function(t){return Xt(n,t,f)};let m,x,b,_,y,v,w,M,k,S,P,D;if("top"===a)m=p(e.bottom),v=e.bottom-h,M=m-g,S=p(t.top)+g,D=t.bottom;else if("bottom"===a)m=p(e.top),S=t.top,D=p(t.bottom)-g,v=m+g,M=e.top+h;else if("left"===a)m=p(e.right),y=e.right-h,w=m-g,k=p(t.left)+g,P=t.right;else if("right"===a)m=p(e.left),k=t.left,P=p(t.right)-g,y=m+g,w=e.left+h;else if("x"===i){if("center"===a)m=p((t.top+t.bottom)/2+.5);else if(U(a)){const t=Object.keys(a)[0],i=a[t];m=p(e.chart.scales[t].getPixelForValue(i))}S=t.top,D=t.bottom,v=m+g,M=v+h}else if("y"===i){if("center"===a)m=p((t.left+t.right)/2);else if(U(a)){const t=Object.keys(a)[0],i=a[t];m=p(e.chart.scales[t].getPixelForValue(i))}y=m-g,w=y-h,k=t.left,P=t.right}const C=K(o.ticks.maxTicksLimit,c),O=Math.max(1,Math.ceil(c/C));for(x=0;x<c;x+=O){const t=s.setContext(e.getContext(x)),i=t.lineWidth,o=t.color,a=s.borderDash||[],c=t.borderDashOffset,h=t.tickWidth,u=t.tickColor,f=t.tickBorderDash||[],g=t.tickBorderDashOffset;b=Tn(e,x,r),void 0!==b&&(_=Xt(n,b,i),l?y=w=k=P=_:v=M=S=D=_,d.push({tx1:y,ty1:v,tx2:w,ty2:M,x1:k,y1:S,x2:P,y2:D,width:i,color:o,borderDash:a,borderDashOffset:c,tickWidth:h,tickColor:u,tickBorderDash:f,tickBorderDashOffset:g}))}return e._ticksLength=c,e._borderValue=m,d}_computeLabelItems(t){const e=this,i=e.axis,n=e.options,{position:o,ticks:s}=n,a=e.isHorizontal(),r=e.ticks,{align:l,crossAlign:c,padding:h,mirror:d}=s,u=An(n.grid),f=u+h,g=d?-h:f,p=-Et(e.labelRotation),m=[];let x,b,_,y,v,w,M,k,S,P,D,C,O="middle";if("top"===o)w=e.bottom-g,M=e._getXAxisLabelAlignment();else if("bottom"===o)w=e.top+g,M=e._getXAxisLabelAlignment();else if("left"===o){const t=e._getYAxisLabelAlignment(u);M=t.textAlign,v=t.x}else if("right"===o){const t=e._getYAxisLabelAlignment(u);M=t.textAlign,v=t.x}else if("x"===i){if("center"===o)w=(t.top+t.bottom)/2+f;else if(U(o)){const t=Object.keys(o)[0],i=o[t];w=e.chart.scales[t].getPixelForValue(i)+f}M=e._getXAxisLabelAlignment()}else if("y"===i){if("center"===o)v=(t.left+t.right)/2-f;else if(U(o)){const t=Object.keys(o)[0],i=o[t];v=e.chart.scales[t].getPixelForValue(i)}M=e._getYAxisLabelAlignment(u).textAlign}"y"===i&&("start"===l?O="top":"end"===l&&(O="bottom"));const T=e._getLabelSizes();for(x=0,b=r.length;x<b;++x){_=r[x],y=_.label;const t=s.setContext(e.getContext(x));k=e.getPixelForTick(x)+s.labelOffset,S=e._resolveTickFontOptions(x),P=S.lineHeight,D=Y(y)?y.length:1;const i=D/2,n=t.color,l=t.textStrokeColor,h=t.textStrokeWidth;let u;if(a?(v=k,C="top"===o?"near"===c||0!==p?-D*P+P/2:"center"===c?-T.highest.height/2-i*P+P:-T.highest.height+P/2:"near"===c||0!==p?P/2:"center"===c?T.highest.height/2-i*P:T.highest.height-D*P,d&&(C*=-1)):(w=k,C=(1-D)*P/2),t.showLabelBackdrop){const e=Be(t.backdropPadding),i=T.heights[x],n=T.widths[x];let o=w+C-e.top,s=v-e.left;switch(O){case"middle":o-=i/2;break;case"bottom":o-=i}switch(M){case"center":s-=n/2;break;case"right":s-=n}u={left:s,top:o,width:n+e.width,height:i+e.height,color:t.backdropColor}}m.push({rotation:p,label:y,font:S,color:n,strokeColor:l,strokeWidth:h,textOffset:C,textAlign:M,textBaseline:O,translation:[v,w],backdrop:u})}return m}_getXAxisLabelAlignment(){const{position:t,ticks:e}=this.options;if(-Et(this.labelRotation))return"top"===t?"left":"right";let i="center";return"start"===e.align?i="left":"end"===e.align&&(i="right"),i}_getYAxisLabelAlignment(t){const e=this,{position:i,ticks:{crossAlign:n,mirror:o,padding:s}}=e.options,a=t+s,r=e._getLabelSizes().widest.width;let l,c;return"left"===i?o?(c=e.right+s,"near"===n?l="left":"center"===n?(l="center",c+=r/2):(l="right",c+=r)):(c=e.right-a,"near"===n?l="right":"center"===n?(l="center",c-=r/2):(l="left",c=e.left)):"right"===i?o?(c=e.left+s,"near"===n?l="right":"center"===n?(l="center",c-=r/2):(l="left",c-=r)):(c=e.left+a,"near"===n?l="left":"center"===n?(l="center",c+=r/2):(l="right",c=e.right)):l="right",{textAlign:l,x:c}}_computeLabelArea(){const t=this;if(t.options.ticks.mirror)return;const e=t.chart,i=t.options.position;return"left"===i||"right"===i?{top:0,left:t.left,bottom:e.height,right:t.right}:"top"===i||"bottom"===i?{top:t.top,left:0,bottom:t.bottom,right:e.width}:void 0}drawBackground(){const{ctx:t,options:{backgroundColor:e},left:i,top:n,width:o,height:s}=this;e&&(t.save(),t.fillStyle=e,t.fillRect(i,n,o,s),t.restore())}getLineWidthForValue(t){const e=this,i=e.options.grid;if(!e._isVisible()||!i.display)return 0;const n=e.ticks.findIndex((e=>e.value===t));if(n>=0){return i.setContext(e.getContext(n)).lineWidth}return 0}drawGrid(t){const e=this,i=e.options.grid,n=e.ctx,o=e._gridLineItems||(e._gridLineItems=e._computeGridLineItems(t));let s,a;const r=(t,e,i)=>{i.width&&i.color&&(n.save(),n.lineWidth=i.width,n.strokeStyle=i.color,n.setLineDash(i.borderDash||[]),n.lineDashOffset=i.borderDashOffset,n.beginPath(),n.moveTo(t.x,t.y),n.lineTo(e.x,e.y),n.stroke(),n.restore())};if(i.display)for(s=0,a=o.length;s<a;++s){const t=o[s];i.drawOnChartArea&&r({x:t.x1,y:t.y1},{x:t.x2,y:t.y2},t),i.drawTicks&&r({x:t.tx1,y:t.ty1},{x:t.tx2,y:t.ty2},{color:t.tickColor,width:t.tickWidth,borderDash:t.tickBorderDash,borderDashOffset:t.tickBorderDashOffset})}}drawBorder(){const t=this,{chart:e,ctx:i,options:{grid:n}}=t,o=n.setContext(t.getContext()),s=n.drawBorder?o.borderWidth:0;if(!s)return;const a=n.setContext(t.getContext(0)).lineWidth,r=t._borderValue;let l,c,h,d;t.isHorizontal()?(l=Xt(e,t.left,s)-s/2,c=Xt(e,t.right,a)+a/2,h=d=r):(h=Xt(e,t.top,s)-s/2,d=Xt(e,t.bottom,a)+a/2,l=c=r),i.save(),i.lineWidth=o.borderWidth,i.strokeStyle=o.borderColor,i.beginPath(),i.moveTo(l,h),i.lineTo(c,d),i.stroke(),i.restore()}drawLabels(t){const e=this;if(!e.options.ticks.display)return;const i=e.ctx,n=e._computeLabelArea();n&&Zt(i,n);const o=e._labelItems||(e._labelItems=e._computeLabelItems(t));let s,a;for(s=0,a=o.length;s<a;++s){const t=o[s],e=t.font,n=t.label;t.backdrop&&(i.fillStyle=t.backdrop.color,i.fillRect(t.backdrop.left,t.backdrop.top,t.backdrop.width,t.backdrop.height)),ee(i,n,0,t.textOffset,e,t)}n&&Qt(i)}drawTitle(){const{ctx:t,options:{position:e,title:i,reverse:n}}=this;if(!i.display)return;const s=Ve(i.font),a=Be(i.padding),r=i.align;let l=s.lineHeight/2;"bottom"===e||"center"===e||U(e)?(l+=a.bottom,Y(i.text)&&(l+=s.lineHeight*(i.text.length-1))):l+=a.top;const{titleX:c,titleY:h,maxWidth:d,rotation:u}=function(t,e,i,n){const{top:s,left:a,bottom:r,right:l,chart:c}=t,{chartArea:h,scales:d}=c;let u,f,g,p=0;const m=r-s,x=l-a;if(t.isHorizontal()){if(f=o(n,a,l),U(i)){const t=Object.keys(i)[0],n=i[t];g=d[t].getPixelForValue(n)+m-e}else g="center"===i?(h.bottom+h.top)/2+m-e:Cn(t,i,e);u=l-a}else{if(U(i)){const t=Object.keys(i)[0],n=i[t];f=d[t].getPixelForValue(n)-x+e}else f="center"===i?(h.left+h.right)/2-x+e:Cn(t,i,e);g=o(n,r,s),p="left"===i?-Mt:Mt}return{titleX:f,titleY:g,maxWidth:u,rotation:p}}(this,l,e,r);ee(t,i.text,0,0,s,{color:i.color,maxWidth:d,rotation:u,textAlign:Rn(r,e,n),textBaseline:"middle",translation:[c,h]})}draw(t){const e=this;e._isVisible()&&(e.drawBackground(),e.drawGrid(t),e.drawBorder(),e.drawTitle(),e.drawLabels(t))}_layers(){const t=this,e=t.options,i=e.ticks&&e.ticks.z||0,n=K(e.grid&&e.grid.z,-1);return t._isVisible()&&t.draw===En.prototype.draw?[{z:n,draw(e){t.drawBackground(),t.drawGrid(e),t.drawTitle()}},{z:n+1,draw(){t.drawBorder()}},{z:i,draw(e){t.drawLabels(e)}}]:[{z:i,draw(e){t.draw(e)}}]}getMatchingVisibleMetas(t){const e=this,i=e.chart.getSortedVisibleDatasetMetas(),n=e.axis+"AxisID",o=[];let s,a;for(s=0,a=i.length;s<a;++s){const a=i[s];a[n]!==e.id||t&&a.type!==t||o.push(a)}return o}_resolveTickFontOptions(t){return Ve(this.options.ticks.setContext(this.getContext(t)).font)}_maxDigits(){const t=this,e=t._resolveTickFontOptions(0).lineHeight;return(t.isHorizontal()?t.width:t.height)/e}}class In{constructor(t,e,i){this.type=t,this.scope=e,this.override=i,this.items=Object.create(null)}isForType(t){return Object.prototype.isPrototypeOf.call(this.type.prototype,t.prototype)}register(t){const e=this,i=Object.getPrototypeOf(t);let n;(function(t){return"id"in t&&"defaults"in t})(i)&&(n=e.register(i));const o=e.items,s=t.id,a=e.scope+"."+s;if(!s)throw new Error("class does not have id: "+t);return s in o||(o[s]=t,function(t,e,i){const n=ot(Object.create(null),[i?xt.get(i):{},xt.get(e),t.defaults]);xt.set(e,n),t.defaultRoutes&&function(t,e){Object.keys(e).forEach((i=>{const n=i.split("."),o=n.pop(),s=[t].concat(n).join("."),a=e[i].split("."),r=a.pop(),l=a.join(".");xt.route(s,o,l,r)}))}(e,t.defaultRoutes);t.descriptors&&xt.describe(e,t.descriptors)}(t,a,n),e.override&&xt.override(t.id,t.overrides)),a}get(t){return this.items[t]}unregister(t){const e=this.items,i=t.id,n=this.scope;i in e&&delete e[i],n&&i in xt[n]&&(delete xt[n][i],this.override&&delete ft[i])}}var zn=new class{constructor(){this.controllers=new In(wn,"datasets",!0),this.elements=new In(Mn,"elements"),this.plugins=new In(Object,"plugins"),this.scales=new In(En,"scales"),this._typedRegistries=[this.controllers,this.scales,this.elements]}add(...t){this._each("register",t)}remove(...t){this._each("unregister",t)}addControllers(...t){this._each("register",t,this.controllers)}addElements(...t){this._each("register",t,this.elements)}addPlugins(...t){this._each("register",t,this.plugins)}addScales(...t){this._each("register",t,this.scales)}getController(t){return this._get(t,this.controllers,"controller")}getElement(t){return this._get(t,this.elements,"element")}getPlugin(t){return this._get(t,this.plugins,"plugin")}getScale(t){return this._get(t,this.scales,"scale")}removeControllers(...t){this._each("unregister",t,this.controllers)}removeElements(...t){this._each("unregister",t,this.elements)}removePlugins(...t){this._each("unregister",t,this.plugins)}removeScales(...t){this._each("unregister",t,this.scales)}_each(t,e,i){const n=this;[...e].forEach((e=>{const o=i||n._getRegistryForType(e);i||o.isForType(e)||o===n.plugins&&e.id?n._exec(t,o,e):J(e,(e=>{const o=i||n._getRegistryForType(e);n._exec(t,o,e)}))}))}_exec(t,e,i){const n=ct(t);Q(i["before"+n],[],i),e[t](i),Q(i["after"+n],[],i)}_getRegistryForType(t){for(let e=0;e<this._typedRegistries.length;e++){const i=this._typedRegistries[e];if(i.isForType(t))return i}return this.plugins}_get(t,e,i){const n=e.get(t);if(void 0===n)throw new Error('"'+t+'" is not a registered '+i+".");return n}};class Fn{constructor(){this._init=[]}notify(t,e,i,n){const o=this;"beforeInit"===e&&(o._init=o._createDescriptors(t,!0),o._notify(o._init,t,"install"));const s=n?o._descriptors(t).filter(n):o._descriptors(t),a=o._notify(s,t,e,i);return"destroy"===e&&(o._notify(s,t,"stop"),o._notify(o._init,t,"uninstall")),a}_notify(t,e,i,n){n=n||{};for(const o of t){const t=o.plugin;if(!1===Q(t[i],[e,n,o.options],t)&&n.cancelable)return!1}return!0}invalidate(){$(this._cache)||(this._oldCache=this._cache,this._cache=void 0)}_descriptors(t){if(this._cache)return this._cache;const e=this._cache=this._createDescriptors(t);return this._notifyStateChanges(t),e}_createDescriptors(t,e){const i=t&&t.config,n=K(i.options&&i.options.plugins,{}),o=function(t){const e=[],i=Object.keys(zn.plugins.items);for(let t=0;t<i.length;t++)e.push(zn.getPlugin(i[t]));const n=t.plugins||[];for(let t=0;t<n.length;t++){const i=n[t];-1===e.indexOf(i)&&e.push(i)}return e}(i);return!1!==n||e?function(t,e,i,n){const o=[],s=t.getContext();for(let a=0;a<e.length;a++){const r=e[a],l=Bn(i[r.id],n);null!==l&&o.push({plugin:r,options:Vn(t.config,r,l,s)})}return o}(t,o,n,e):[]}_notifyStateChanges(t){const e=this._oldCache||[],i=this._cache,n=(t,e)=>t.filter((t=>!e.some((e=>t.plugin.id===e.plugin.id))));this._notify(n(e,i),t,"stop"),this._notify(n(i,e),t,"start")}}function Bn(t,e){return e||!1!==t?!0===t?{}:t:null}function Vn(t,e,i,n){const o=t.pluginScopeKeys(e),s=t.getOptionScopes(i,o);return t.createResolver(s,n,[""],{scriptable:!1,indexable:!1,allKeys:!0})}function Wn(t,e){const i=xt.datasets[t]||{};return((e.datasets||{})[t]||{}).indexAxis||e.indexAxis||i.indexAxis||"x"}function Nn(t,e){return"x"===t||"y"===t?t:e.axis||("top"===(i=e.position)||"bottom"===i?"x":"left"===i||"right"===i?"y":void 0)||t.charAt(0).toLowerCase();var i}function Hn(t){const e=t.options||(t.options={});e.plugins=K(e.plugins,{}),e.scales=function(t,e){const i=ft[t.type]||{scales:{}},n=e.scales||{},o=Wn(t.type,e),s=Object.create(null),a=Object.create(null);return Object.keys(n).forEach((t=>{const e=n[t],r=Nn(t,e),l=function(t,e){return t===e?"_index_":"_value_"}(r,o),c=i.scales||{};s[r]=s[r]||t,a[t]=st(Object.create(null),[{axis:r},e,c[r],c[l]])})),t.data.datasets.forEach((i=>{const o=i.type||t.type,r=i.indexAxis||Wn(o,e),l=(ft[o]||{}).scales||{};Object.keys(l).forEach((t=>{const e=function(t,e){let i=t;return"_index_"===t?i=e:"_value_"===t&&(i="x"===e?"y":"x"),i}(t,r),o=i[e+"AxisID"]||s[e]||e;a[o]=a[o]||Object.create(null),st(a[o],[{axis:e},n[o],l[t]])}))})),Object.keys(a).forEach((t=>{const e=a[t];st(e,[xt.scales[e.type],xt.scale])})),a}(t,e)}function jn(t){return(t=t||{}).datasets=t.datasets||[],t.labels=t.labels||[],t}const $n=new Map,Yn=new Set;function Un(t,e){let i=$n.get(t);return i||(i=e(),$n.set(t,i),Yn.add(i)),i}const Xn=(t,e,i)=>{const n=lt(e,i);void 0!==n&&t.add(n)};class qn{constructor(t){this._config=function(t){return(t=t||{}).data=jn(t.data),Hn(t),t}(t),this._scopeCache=new Map,this._resolverCache=new Map}get platform(){return this._config.platform}get type(){return this._config.type}set type(t){this._config.type=t}get data(){return this._config.data}set data(t){this._config.data=jn(t)}get options(){return this._config.options}set options(t){this._config.options=t}get plugins(){return this._config.plugins}update(){const t=this._config;this.clearCache(),Hn(t)}clearCache(){this._scopeCache.clear(),this._resolverCache.clear()}datasetScopeKeys(t){return Un(t,(()=>[[`datasets.${t}`,""]]))}datasetAnimationScopeKeys(t,e){return Un(`${t}.transition.${e}`,(()=>[[`datasets.${t}.transitions.${e}`,`transitions.${e}`],[`datasets.${t}`,""]]))}datasetElementScopeKeys(t,e){return Un(`${t}-${e}`,(()=>[[`datasets.${t}.elements.${e}`,`datasets.${t}`,`elements.${e}`,""]]))}pluginScopeKeys(t){const e=t.id;return Un(`${this.type}-plugin-${e}`,(()=>[[`plugins.${e}`,...t.additionalOptionScopes||[]]]))}_cachedScopes(t,e){const i=this._scopeCache;let n=i.get(t);return n&&!e||(n=new Map,i.set(t,n)),n}getOptionScopes(t,e,i){const{options:n,type:o}=this,s=this._cachedScopes(t,i),a=s.get(e);if(a)return a;const r=new Set;e.forEach((e=>{t&&(r.add(t),e.forEach((e=>Xn(r,t,e)))),e.forEach((t=>Xn(r,n,t))),e.forEach((t=>Xn(r,ft[o]||{},t))),e.forEach((t=>Xn(r,xt,t))),e.forEach((t=>Xn(r,gt,t)))}));const l=Array.from(r);return 0===l.length&&l.push(Object.create(null)),Yn.has(e)&&s.set(e,l),l}chartOptionScopes(){const{options:t,type:e}=this;return[t,ft[e]||{},xt.datasets[e]||{},{type:e},xt,gt]}resolveNamedOptions(t,e,i,n=[""]){const o={$shared:!0},{resolver:s,subPrefixes:a}=Kn(this._resolverCache,t,n);let r=s;if(function(t,e){const{isScriptable:i,isIndexable:n}=ni(t);for(const o of e)if(i(o)&&dt(t[o])||n(o)&&Y(t[o]))return!0;return!1}(s,e)){o.$shared=!1;r=ii(s,i=dt(i)?i():i,this.createResolver(t,i,a))}for(const t of e)o[t]=r[t];return o}createResolver(t,e,i=[""],n){const{resolver:o}=Kn(this._resolverCache,t,i);return U(e)?ii(o,e,void 0,n):o}}function Kn(t,e,i){let n=t.get(e);n||(n=new Map,t.set(e,n));const o=i.join();let s=n.get(o);if(!s){s={resolver:ei(e,i),subPrefixes:i.filter((t=>!t.toLowerCase().includes("hover")))},n.set(o,s)}return s}const Gn=["top","bottom","left","right","chartArea"];function Zn(t,e){return"top"===t||"bottom"===t||-1===Gn.indexOf(t)&&"x"===e}function Qn(t,e){return function(i,n){return i[t]===n[t]?i[e]-n[e]:i[t]-n[t]}}function Jn(t){const e=t.chart,i=e.options.animation;e.notifyPlugins("afterRender"),Q(i&&i.onComplete,[t],e)}function to(t){const e=t.chart,i=e.options.animation;Q(i&&i.onProgress,[t],e)}function eo(t){return ue()&&"string"==typeof t?t=document.getElementById(t):t&&t.length&&(t=t[0]),t&&t.canvas&&(t=t.canvas),t}const io={},no=t=>{const e=eo(t);return Object.values(io).filter((t=>t.canvas===e)).pop()};class oo{constructor(t,e){const n=this,o=this.config=new qn(e),s=eo(t),r=no(s);if(r)throw new Error("Canvas is already in use. Chart with ID '"+r.id+"' must be destroyed before the canvas can be reused.");const l=o.createResolver(o.chartOptionScopes(),n.getContext());this.platform=new(o.platform||on(s));const c=n.platform.acquireContext(s,l.aspectRatio),h=c&&c.canvas,d=h&&h.height,u=h&&h.width;this.id=j(),this.ctx=c,this.canvas=h,this.width=u,this.height=d,this._options=l,this._aspectRatio=this.aspectRatio,this._layers=[],this._metasets=[],this._stacks=void 0,this.boxes=[],this.currentDevicePixelRatio=void 0,this.chartArea=void 0,this._active=[],this._lastEvent=void 0,this._listeners={},this._responsiveListeners=void 0,this._sortedMetasets=[],this.scales={},this._plugins=new Fn,this.$proxies={},this._hiddenIndices={},this.attached=!1,this._animationsDisabled=void 0,this.$context=void 0,this._doResize=i((()=>this.update("resize")),l.resizeDelay||0),io[n.id]=n,c&&h?(a.listen(n,"complete",Jn),a.listen(n,"progress",to),n._initialize(),n.attached&&n.update()):console.error("Failed to create chart: can't acquire context from the given item")}get aspectRatio(){const{options:{aspectRatio:t,maintainAspectRatio:e},width:i,height:n,_aspectRatio:o}=this;return $(t)?e&&o?o:n?i/n:null:t}get data(){return this.config.data}set data(t){this.config.data=t}get options(){return this._options}set options(t){this.config.options=t}_initialize(){const t=this;return t.notifyPlugins("beforeInit"),t.options.responsive?t.resize():we(t,t.options.devicePixelRatio),t.bindEvents(),t.notifyPlugins("afterInit"),t}clear(){return qt(this.canvas,this.ctx),this}stop(){return a.stop(this),this}resize(t,e){a.running(this)?this._resizeBeforeDraw={width:t,height:e}:this._resize(t,e)}_resize(t,e){const i=this,n=i.options,o=i.canvas,s=n.maintainAspectRatio&&i.aspectRatio,a=i.platform.getMaximumSize(o,t,e,s),r=n.devicePixelRatio||i.platform.getDevicePixelRatio();i.width=a.width,i.height=a.height,i._aspectRatio=i.aspectRatio,we(i,r,!0)&&(i.notifyPlugins("resize",{size:a}),Q(n.onResize,[i,a],i),i.attached&&i._doResize()&&i.render())}ensureScalesHaveIDs(){J(this.options.scales||{},((t,e)=>{t.id=e}))}buildOrUpdateScales(){const t=this,e=t.options,i=e.scales,n=t.scales,o=Object.keys(n).reduce(((t,e)=>(t[e]=!1,t)),{});let s=[];i&&(s=s.concat(Object.keys(i).map((t=>{const e=i[t],n=Nn(t,e),o="r"===n,s="x"===n;return{options:e,dposition:o?"chartArea":s?"bottom":"left",dtype:o?"radialLinear":s?"category":"linear"}})))),J(s,(i=>{const s=i.options,a=s.id,r=Nn(a,s),l=K(s.type,i.dtype);void 0!==s.position&&Zn(s.position,r)===Zn(i.dposition)||(s.position=i.dposition),o[a]=!0;let c=null;if(a in n&&n[a].type===l)c=n[a];else{c=new(zn.getScale(l))({id:a,type:l,ctx:t.ctx,chart:t}),n[c.id]=c}c.init(s,e)})),J(o,((t,e)=>{t||delete n[e]})),J(n,(e=>{ti.configure(t,e,e.options),ti.addBox(t,e)}))}_updateMetasets(){const t=this,e=t._metasets,i=t.data.datasets.length,n=e.length;if(e.sort(((t,e)=>t.index-e.index)),n>i){for(let e=i;e<n;++e)t._destroyDatasetMeta(e);e.splice(i,n-i)}t._sortedMetasets=e.slice(0).sort(Qn("order","index"))}_removeUnreferencedMetasets(){const t=this,{_metasets:e,data:{datasets:i}}=t;e.length>i.length&&delete t._stacks,e.forEach(((e,n)=>{0===i.filter((t=>t===e._dataset)).length&&t._destroyDatasetMeta(n)}))}buildOrUpdateControllers(){const t=this,e=[],i=t.data.datasets;let n,o;for(t._removeUnreferencedMetasets(),n=0,o=i.length;n<o;n++){const o=i[n];let s=t.getDatasetMeta(n);const a=o.type||t.config.type;if(s.type&&s.type!==a&&(t._destroyDatasetMeta(n),s=t.getDatasetMeta(n)),s.type=a,s.indexAxis=o.indexAxis||Wn(a,t.options),s.order=o.order||0,s.index=n,s.label=""+o.label,s.visible=t.isDatasetVisible(n),s.controller)s.controller.updateIndex(n),s.controller.linkScales();else{const i=zn.getController(a),{datasetElementType:o,dataElementType:r}=xt.datasets[a];Object.assign(i.prototype,{dataElementType:zn.getElement(r),datasetElementType:o&&zn.getElement(o)}),s.controller=new i(t,n),e.push(s.controller)}}return t._updateMetasets(),e}_resetElements(){const t=this;J(t.data.datasets,((e,i)=>{t.getDatasetMeta(i).controller.reset()}),t)}reset(){this._resetElements(),this.notifyPlugins("reset")}update(t){const e=this,i=e.config;i.update(),e._options=i.createResolver(i.chartOptionScopes(),e.getContext()),J(e.scales,(t=>{ti.removeBox(e,t)}));const n=e._animationsDisabled=!e.options.animation;e.ensureScalesHaveIDs(),e.buildOrUpdateScales();const o=new Set(Object.keys(e._listeners)),s=new Set(e.options.events);if(ut(o,s)&&!!this._responsiveListeners===e.options.responsive||(e.unbindEvents(),e.bindEvents()),e._plugins.invalidate(),!1===e.notifyPlugins("beforeUpdate",{mode:t,cancelable:!0}))return;const a=e.buildOrUpdateControllers();e.notifyPlugins("beforeElementsUpdate");let r=0;for(let t=0,i=e.data.datasets.length;t<i;t++){const{controller:i}=e.getDatasetMeta(t),o=!n&&-1===a.indexOf(i);i.buildOrUpdateElements(o),r=Math.max(+i.getMaxOverflow(),r)}e._minPadding=r,e._updateLayout(r),n||J(a,(t=>{t.reset()})),e._updateDatasets(t),e.notifyPlugins("afterUpdate",{mode:t}),e._layers.sort(Qn("z","_idx")),e._lastEvent&&e._eventHandler(e._lastEvent,!0),e.render()}_updateLayout(t){const e=this;if(!1===e.notifyPlugins("beforeLayout",{cancelable:!0}))return;ti.update(e,e.width,e.height,t);const i=e.chartArea,n=i.width<=0||i.height<=0;e._layers=[],J(e.boxes,(t=>{n&&"chartArea"===t.position||(t.configure&&t.configure(),e._layers.push(...t._layers()))}),e),e._layers.forEach(((t,e)=>{t._idx=e})),e.notifyPlugins("afterLayout")}_updateDatasets(t){const e=this,i="function"==typeof t;if(!1!==e.notifyPlugins("beforeDatasetsUpdate",{mode:t,cancelable:!0})){for(let n=0,o=e.data.datasets.length;n<o;++n)e._updateDataset(n,i?t({datasetIndex:n}):t);e.notifyPlugins("afterDatasetsUpdate",{mode:t})}}_updateDataset(t,e){const i=this,n=i.getDatasetMeta(t),o={meta:n,index:t,mode:e,cancelable:!0};!1!==i.notifyPlugins("beforeDatasetUpdate",o)&&(n.controller._update(e),o.cancelable=!1,i.notifyPlugins("afterDatasetUpdate",o))}render(){const t=this;!1!==t.notifyPlugins("beforeRender",{cancelable:!0})&&(a.has(t)?t.attached&&!a.running(t)&&a.start(t):(t.draw(),Jn({chart:t})))}draw(){const t=this;let e;if(t._resizeBeforeDraw){const{width:e,height:i}=t._resizeBeforeDraw;t._resize(e,i),t._resizeBeforeDraw=null}if(t.clear(),t.width<=0||t.height<=0)return;if(!1===t.notifyPlugins("beforeDraw",{cancelable:!0}))return;const i=t._layers;for(e=0;e<i.length&&i[e].z<=0;++e)i[e].draw(t.chartArea);for(t._drawDatasets();e<i.length;++e)i[e].draw(t.chartArea);t.notifyPlugins("afterDraw")}_getSortedDatasetMetas(t){const e=this._sortedMetasets,i=[];let n,o;for(n=0,o=e.length;n<o;++n){const o=e[n];t&&!o.visible||i.push(o)}return i}getSortedVisibleDatasetMetas(){return this._getSortedDatasetMetas(!0)}_drawDatasets(){const t=this;if(!1===t.notifyPlugins("beforeDatasetsDraw",{cancelable:!0}))return;const e=t.getSortedVisibleDatasetMetas();for(let i=e.length-1;i>=0;--i)t._drawDataset(e[i]);t.notifyPlugins("afterDatasetsDraw")}_drawDataset(t){const e=this,i=e.ctx,n=t._clip,o=!n.disabled,s=e.chartArea,a={meta:t,index:t.index,cancelable:!0};!1!==e.notifyPlugins("beforeDatasetDraw",a)&&(o&&Zt(i,{left:!1===n.left?0:s.left-n.left,right:!1===n.right?e.width:s.right+n.right,top:!1===n.top?0:s.top-n.top,bottom:!1===n.bottom?e.height:s.bottom+n.bottom}),t.controller.draw(),o&&Qt(i),a.cancelable=!1,e.notifyPlugins("afterDatasetDraw",a))}getElementsAtEventForMode(t,e,i,n){const o=Ae.modes[e];return"function"==typeof o?o(this,t,i,n):[]}getDatasetMeta(t){const e=this.data.datasets[t],i=this._metasets;let n=i.filter((t=>t&&t._dataset===e)).pop();return n||(n={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null,order:e&&e.order||0,index:t,_dataset:e,_parsed:[],_sorted:!1},i.push(n)),n}getContext(){return this.$context||(this.$context={chart:this,type:"chart"})}getVisibleDatasetCount(){return this.getSortedVisibleDatasetMetas().length}isDatasetVisible(t){const e=this.data.datasets[t];if(!e)return!1;const i=this.getDatasetMeta(t);return"boolean"==typeof i.hidden?!i.hidden:!e.hidden}setDatasetVisibility(t,e){this.getDatasetMeta(t).hidden=!e}toggleDataVisibility(t){this._hiddenIndices[t]=!this._hiddenIndices[t]}getDataVisibility(t){return!this._hiddenIndices[t]}_updateVisibility(t,e,i){const n=this,o=i?"show":"hide",s=n.getDatasetMeta(t),a=s.controller._resolveAnimations(void 0,o);ht(e)?(s.data[e].hidden=!i,n.update()):(n.setDatasetVisibility(t,i),a.update(s,{visible:i}),n.update((e=>e.datasetIndex===t?o:void 0)))}hide(t,e){this._updateVisibility(t,e,!1)}show(t,e){this._updateVisibility(t,e,!0)}_destroyDatasetMeta(t){const e=this,i=e._metasets&&e._metasets[t];i&&i.controller&&(i.controller._destroy(),delete e._metasets[t])}destroy(){const t=this,{canvas:e,ctx:i}=t;let n,o;for(t.stop(),a.remove(t),n=0,o=t.data.datasets.length;n<o;++n)t._destroyDatasetMeta(n);t.config.clearCache(),e&&(t.unbindEvents(),qt(e,i),t.platform.releaseContext(i),t.canvas=null,t.ctx=null),t.notifyPlugins("destroy"),delete io[t.id]}toBase64Image(...t){return this.canvas.toDataURL(...t)}bindEvents(){this.bindUserEvents(),this.options.responsive?this.bindResponsiveEvents():this.attached=!0}bindUserEvents(){const t=this,e=t._listeners,i=t.platform,n=function(e,i,n){e.offsetX=i,e.offsetY=n,t._eventHandler(e)};J(t.options.events,(o=>((n,o)=>{i.addEventListener(t,n,o),e[n]=o})(o,n)))}bindResponsiveEvents(){const t=this;t._responsiveListeners||(t._responsiveListeners={});const e=t._responsiveListeners,i=t.platform,n=(n,o)=>{i.addEventListener(t,n,o),e[n]=o},o=(n,o)=>{e[n]&&(i.removeEventListener(t,n,o),delete e[n])},s=(e,i)=>{t.canvas&&t.resize(e,i)};let a;const r=()=>{o("attach",r),t.attached=!0,t.resize(),n("resize",s),n("detach",a)};a=()=>{t.attached=!1,o("resize",s),n("attach",r)},i.isAttached(t.canvas)?r():a()}unbindEvents(){const t=this;J(t._listeners,((e,i)=>{t.platform.removeEventListener(t,i,e)})),t._listeners={},J(t._responsiveListeners,((e,i)=>{t.platform.removeEventListener(t,i,e)})),t._responsiveListeners=void 0}updateHoverStyle(t,e,i){const n=i?"set":"remove";let o,s,a,r;for("dataset"===e&&(o=this.getDatasetMeta(t[0].datasetIndex),o.controller["_"+n+"DatasetHoverStyle"]()),a=0,r=t.length;a<r;++a){s=t[a];const e=s&&this.getDatasetMeta(s.datasetIndex).controller;e&&e[n+"HoverStyle"](s.element,s.datasetIndex,s.index)}}getActiveElements(){return this._active||[]}setActiveElements(t){const e=this,i=e._active||[],n=t.map((({datasetIndex:t,index:i})=>{const n=e.getDatasetMeta(t);if(!n)throw new Error("No dataset found at index "+t);return{datasetIndex:t,element:n.data[i],index:i}}));!tt(n,i)&&(e._active=n,e._updateHoverStyles(n,i))}notifyPlugins(t,e,i){return this._plugins.notify(this,t,e,i)}_updateHoverStyles(t,e,i){const n=this,o=n.options.hover,s=(t,e)=>t.filter((t=>!e.some((e=>t.datasetIndex===e.datasetIndex&&t.index===e.index)))),a=s(e,t),r=i?t:s(t,e);a.length&&n.updateHoverStyle(a,o.mode,!1),r.length&&o.mode&&n.updateHoverStyle(r,o.mode,!0)}_eventHandler(t,e){const i=this,n={event:t,replay:e,cancelable:!0},o=e=>(e.options.events||this.options.events).includes(t.type);if(!1===i.notifyPlugins("beforeEvent",n,o))return;const s=i._handleEvent(t,e);return n.cancelable=!1,i.notifyPlugins("afterEvent",n,o),(s||n.changed)&&i.render(),i}_handleEvent(t,e){const i=this,{_active:n=[],options:o}=i,s=o.hover,a=e;let r=[],l=!1,c=null;return"mouseout"!==t.type&&(r=i.getElementsAtEventForMode(t,s.mode,s,a),c="click"===t.type?i._lastEvent:t),i._lastEvent=null,Gt(t,i.chartArea,i._minPadding)&&(Q(o.onHover,[t,r,i],i),"mouseup"!==t.type&&"click"!==t.type&&"contextmenu"!==t.type||Q(o.onClick,[t,r,i],i)),l=!tt(r,n),(l||e)&&(i._active=r,i._updateHoverStyles(r,n,e)),i._lastEvent=c,l}}const so=()=>J(oo.instances,(t=>t._plugins.invalidate())),ao=!0;function ro(){throw new Error("This method is not implemented: Check that a complete date adapter is provided.")}Object.defineProperties(oo,{defaults:{enumerable:ao,value:xt},instances:{enumerable:ao,value:io},overrides:{enumerable:ao,value:ft},registry:{enumerable:ao,value:zn},version:{enumerable:ao,value:"3.5.1"},getChart:{enumerable:ao,value:no},register:{enumerable:ao,value:(...t)=>{zn.add(...t),so()}},unregister:{enumerable:ao,value:(...t)=>{zn.remove(...t),so()}}});class lo{constructor(t){this.options=t||{}}formats(){return ro()}parse(t,e){return ro()}format(t,e){return ro()}add(t,e,i){return ro()}diff(t,e,i){return ro()}startOf(t,e,i){return ro()}endOf(t,e){return ro()}}lo.override=function(t){Object.assign(lo.prototype,t)};var co={_date:lo};function ho(t){const e=function(t){if(!t._cache.$bar){const e=t.getMatchingVisibleMetas("bar");let i=[];for(let n=0,o=e.length;n<o;n++)i=i.concat(e[n].controller.getAllParsedValues(t));t._cache.$bar=de(i.sort(((t,e)=>t-e)))}return t._cache.$bar}(t);let i,n,o,s,a=t._length;const r=()=>{32767!==o&&-32768!==o&&(ht(s)&&(a=Math.min(a,Math.abs(o-s)||a)),s=o)};for(i=0,n=e.length;i<n;++i)o=t.getPixelForValue(e[i]),r();for(s=void 0,i=0,n=t.ticks.length;i<n;++i)o=t.getPixelForTick(i),r();return a}function uo(t,e,i,n){return Y(t)?function(t,e,i,n){const o=i.parse(t[0],n),s=i.parse(t[1],n),a=Math.min(o,s),r=Math.max(o,s);let l=a,c=r;Math.abs(a)>Math.abs(r)&&(l=r,c=a),e[i.axis]=c,e._custom={barStart:l,barEnd:c,start:o,end:s,min:a,max:r}}(t,e,i,n):e[i.axis]=i.parse(t,n),e}function fo(t,e,i,n){const o=t.iScale,s=t.vScale,a=o.getLabels(),r=o===s,l=[];let c,h,d,u;for(c=i,h=i+n;c<h;++c)u=e[c],d={},d[o.axis]=r||o.parse(a[c],c),l.push(uo(u,d,s,c));return l}function go(t){return t&&void 0!==t.barStart&&void 0!==t.barEnd}function po(t,e,i,n){let o=e.borderSkipped;const s={};if(!o)return void(t.borderSkipped=s);const{start:a,end:r,reverse:l,top:c,bottom:h}=function(t){let e,i,n,o,s;return t.horizontal?(e=t.base>t.x,i="left",n="right"):(e=t.base<t.y,i="bottom",n="top"),e?(o="end",s="start"):(o="start",s="end"),{start:i,end:n,reverse:e,top:o,bottom:s}}(t);"middle"===o&&i&&(t.enableBorderRadius=!0,(i._top||0)===n?o=c:(i._bottom||0)===n?o=h:(s[mo(h,a,r,l)]=!0,o=c)),s[mo(o,a,r,l)]=!0,t.borderSkipped=s}function mo(t,e,i,n){var o,s,a;return n?(a=i,t=xo(t=(o=t)===(s=e)?a:o===a?s:o,i,e)):t=xo(t,e,i),t}function xo(t,e,i){return"start"===t?e:"end"===t?i:t}class bo extends wn{parsePrimitiveData(t,e,i,n){return fo(t,e,i,n)}parseArrayData(t,e,i,n){return fo(t,e,i,n)}parseObjectData(t,e,i,n){const{iScale:o,vScale:s}=t,{xAxisKey:a="x",yAxisKey:r="y"}=this._parsing,l="x"===o.axis?a:r,c="x"===s.axis?a:r,h=[];let d,u,f,g;for(d=i,u=i+n;d<u;++d)g=e[d],f={},f[o.axis]=o.parse(lt(g,l),d),h.push(uo(lt(g,c),f,s,d));return h}updateRangeFromParsed(t,e,i,n){super.updateRangeFromParsed(t,e,i,n);const o=i._custom;o&&e===this._cachedMeta.vScale&&(t.min=Math.min(t.min,o.min),t.max=Math.max(t.max,o.max))}getMaxOverflow(){return 0}getLabelAndValue(t){const e=this._cachedMeta,{iScale:i,vScale:n}=e,o=this.getParsed(t),s=o._custom,a=go(s)?"["+s.start+", "+s.end+"]":""+n.getLabelForValue(o[n.axis]);return{label:""+i.getLabelForValue(o[i.axis]),value:a}}initialize(){const t=this;t.enableOptionSharing=!0,super.initialize();t._cachedMeta.stack=t.getDataset().stack}update(t){const e=this._cachedMeta;this.updateElements(e.data,0,e.data.length,t)}updateElements(t,e,i,n){const o=this,s="reset"===n,{index:a,_cachedMeta:{vScale:r}}=o,l=r.getBasePixel(),c=r.isHorizontal(),h=o._getRuler(),d=o.resolveDataElementOptions(e,n),u=o.getSharedOptions(d),f=o.includeOptions(n,u);o.updateSharedOptions(u,n,d);for(let d=e;d<e+i;d++){const e=o.getParsed(d),i=s||$(e[r.axis])?{base:l,head:l}:o._calculateBarValuePixels(d),g=o._calculateBarIndexPixels(d,h),p=(e._stacks||{})[r.axis],m={horizontal:c,base:i.base,enableBorderRadius:!p||go(e._custom)||a===p._top||a===p._bottom,x:c?i.head:g.center,y:c?g.center:i.head,height:c?g.size:Math.abs(i.size),width:c?Math.abs(i.size):g.size};f&&(m.options=u||o.resolveDataElementOptions(d,t[d].active?"active":n)),po(m,m.options||t[d].options,p,a),o.updateElement(t[d],d,m,n)}}_getStacks(t,e){const i=this._cachedMeta.iScale,n=i.getMatchingVisibleMetas(this._type),o=i.options.stacked,s=n.length,a=[];let r,l;for(r=0;r<s;++r)if(l=n[r],l.controller.options.grouped){if(void 0!==e){const t=l.controller.getParsed(e)[l.controller._cachedMeta.vScale.axis];if($(t)||isNaN(t))continue}if((!1===o||-1===a.indexOf(l.stack)||void 0===o&&void 0===l.stack)&&a.push(l.stack),l.index===t)break}return a.length||a.push(void 0),a}_getStackCount(t){return this._getStacks(void 0,t).length}_getStackIndex(t,e,i){const n=this._getStacks(t,i),o=void 0!==e?n.indexOf(e):-1;return-1===o?n.length-1:o}_getRuler(){const t=this,e=t.options,i=t._cachedMeta,n=i.iScale,o=[];let s,a;for(s=0,a=i.data.length;s<a;++s)o.push(n.getPixelForValue(t.getParsed(s)[n.axis],s));const r=e.barThickness;return{min:r||ho(n),pixels:o,start:n._startPixel,end:n._endPixel,stackCount:t._getStackCount(),scale:n,grouped:e.grouped,ratio:r?1:e.categoryPercentage*e.barPercentage}}_calculateBarValuePixels(t){const e=this,{_cachedMeta:{vScale:i,_stacked:n},options:{base:o,minBarLength:s}}=e,a=o||0,r=e.getParsed(t),l=r._custom,c=go(l);let h,d,u=r[i.axis],f=0,g=n?e.applyStack(i,r,n):u;g!==u&&(f=g-u,g=u),c&&(u=l.barStart,g=l.barEnd-l.barStart,0!==u&&Dt(u)!==Dt(l.barEnd)&&(f=0),f+=u);const p=$(o)||c?f:o;let m=i.getPixelForValue(p);if(h=e.chart.getDataVisibility(t)?i.getPixelForValue(f+g):m,d=h-m,Math.abs(d)<s&&(d=function(t,e,i){return 0!==t?Dt(t):(e.isHorizontal()?1:-1)*(e.min>=i?1:-1)}(d,i,a)*s,u===a&&(m-=d/2),h=m+d),m===i.getPixelForValue(a)){const t=Dt(d)*i.getLineWidthForValue(a)/2;m+=t,d-=t}return{size:d,base:m,head:h,center:h+d/2}}_calculateBarIndexPixels(t,e){const i=this,n=e.scale,o=i.options,s=o.skipNull,a=K(o.maxBarThickness,1/0);let r,l;if(e.grouped){const n=s?i._getStackCount(t):e.stackCount,c="flex"===o.barThickness?function(t,e,i,n){const o=e.pixels,s=o[t];let a=t>0?o[t-1]:null,r=t<o.length-1?o[t+1]:null;const l=i.categoryPercentage;null===a&&(a=s-(null===r?e.end-e.start:r-s)),null===r&&(r=s+s-a);const c=s-(s-Math.min(a,r))/2*l;return{chunk:Math.abs(r-a)/2*l/n,ratio:i.barPercentage,start:c}}(t,e,o,n):function(t,e,i,n){const o=i.barThickness;let s,a;return $(o)?(s=e.min*i.categoryPercentage,a=i.barPercentage):(s=o*n,a=1),{chunk:s/n,ratio:a,start:e.pixels[t]-s/2}}(t,e,o,n),h=i._getStackIndex(i.index,i._cachedMeta.stack,s?t:void 0);r=c.start+c.chunk*h+c.chunk/2,l=Math.min(a,c.chunk*c.ratio)}else r=n.getPixelForValue(i.getParsed(t)[n.axis],t),l=Math.min(a,e.min*e.ratio);return{base:r-l/2,head:r+l/2,center:r,size:l}}draw(){const t=this,e=t._cachedMeta,i=e.vScale,n=e.data,o=n.length;let s=0;for(;s<o;++s)null!==t.getParsed(s)[i.axis]&&n[s].draw(t._ctx)}}bo.id="bar",bo.defaults={datasetElementType:!1,dataElementType:"bar",categoryPercentage:.8,barPercentage:.9,grouped:!0,animations:{numbers:{type:"number",properties:["x","y","base","width","height"]}}},bo.overrides={scales:{_index_:{type:"category",offset:!0,grid:{offset:!0}},_value_:{type:"linear",beginAtZero:!0}}};class _o extends wn{initialize(){this.enableOptionSharing=!0,super.initialize()}parseObjectData(t,e,i,n){const{xScale:o,yScale:s}=t,{xAxisKey:a="x",yAxisKey:r="y"}=this._parsing,l=[];let c,h,d;for(c=i,h=i+n;c<h;++c)d=e[c],l.push({x:o.parse(lt(d,a),c),y:s.parse(lt(d,r),c),_custom:d&&d.r&&+d.r});return l}getMaxOverflow(){const{data:t,_parsed:e}=this._cachedMeta;let i=0;for(let n=t.length-1;n>=0;--n)i=Math.max(i,t[n].size()/2,e[n]._custom);return i>0&&i}getLabelAndValue(t){const e=this._cachedMeta,{xScale:i,yScale:n}=e,o=this.getParsed(t),s=i.getLabelForValue(o.x),a=n.getLabelForValue(o.y),r=o._custom;return{label:e.label,value:"("+s+", "+a+(r?", "+r:"")+")"}}update(t){const e=this._cachedMeta.data;this.updateElements(e,0,e.length,t)}updateElements(t,e,i,n){const o=this,s="reset"===n,{iScale:a,vScale:r}=o._cachedMeta,l=o.resolveDataElementOptions(e,n),c=o.getSharedOptions(l),h=o.includeOptions(n,c),d=a.axis,u=r.axis;for(let l=e;l<e+i;l++){const e=t[l],i=!s&&o.getParsed(l),c={},f=c[d]=s?a.getPixelForDecimal(.5):a.getPixelForValue(i[d]),g=c[u]=s?r.getBasePixel():r.getPixelForValue(i[u]);c.skip=isNaN(f)||isNaN(g),h&&(c.options=o.resolveDataElementOptions(l,e.active?"active":n),s&&(c.options.radius=0)),o.updateElement(e,l,c,n)}o.updateSharedOptions(c,n,l)}resolveDataElementOptions(t,e){const i=this.getParsed(t);let n=super.resolveDataElementOptions(t,e);n.$shared&&(n=Object.assign({},n,{$shared:!1}));const o=n.radius;return"active"!==e&&(n.radius=0),n.radius+=K(i&&i._custom,o),n}}_o.id="bubble",_o.defaults={datasetElementType:!1,dataElementType:"point",animations:{numbers:{type:"number",properties:["x","y","borderWidth","radius"]}}},_o.overrides={scales:{x:{type:"linear"},y:{type:"linear"}},plugins:{tooltip:{callbacks:{title:()=>""}}}};class yo extends wn{constructor(t,e){super(t,e),this.enableOptionSharing=!0,this.innerRadius=void 0,this.outerRadius=void 0,this.offsetX=void 0,this.offsetY=void 0}linkScales(){}parse(t,e){const i=this.getDataset().data,n=this._cachedMeta;let o,s;for(o=t,s=t+e;o<s;++o)n._parsed[o]=+i[o]}_getRotation(){return Et(this.options.rotation-90)}_getCircumference(){return Et(this.options.circumference)}_getRotationExtents(){let t=_t,e=-_t;const i=this;for(let n=0;n<i.chart.data.datasets.length;++n)if(i.chart.isDatasetVisible(n)){const o=i.chart.getDatasetMeta(n).controller,s=o._getRotation(),a=o._getCircumference();t=Math.min(t,s),e=Math.max(e,s+a)}return{rotation:t,circumference:e-t}}update(t){const e=this,i=e.chart,{chartArea:n}=i,o=e._cachedMeta,s=o.data,a=e.getMaxBorderWidth()+e.getMaxOffset(s)+e.options.spacing,r=Math.max((Math.min(n.width,n.height)-a)/2,0),l=Math.min(G(e.options.cutout,r),1),c=e._getRingWeight(e.index),{circumference:h,rotation:d}=e._getRotationExtents(),{ratioX:u,ratioY:f,offsetX:g,offsetY:p}=function(t,e,i){let n=1,o=1,s=0,a=0;if(e<_t){const r=t,l=r+e,c=Math.cos(r),h=Math.sin(r),d=Math.cos(l),u=Math.sin(l),f=(t,e,n)=>Nt(t,r,l,!0)?1:Math.max(e,e*i,n,n*i),g=(t,e,n)=>Nt(t,r,l,!0)?-1:Math.min(e,e*i,n,n*i),p=f(0,c,d),m=f(Mt,h,u),x=g(bt,c,d),b=g(bt+Mt,h,u);n=(p-x)/2,o=(m-b)/2,s=-(p+x)/2,a=-(m+b)/2}return{ratioX:n,ratioY:o,offsetX:s,offsetY:a}}(d,h,l),m=(n.width-a)/u,x=(n.height-a)/f,b=Math.max(Math.min(m,x)/2,0),_=Z(e.options.radius,b),y=(_-Math.max(_*l,0))/e._getVisibleDatasetWeightTotal();e.offsetX=g*_,e.offsetY=p*_,o.total=e.calculateTotal(),e.outerRadius=_-y*e._getRingWeightOffset(e.index),e.innerRadius=Math.max(e.outerRadius-y*c,0),e.updateElements(s,0,s.length,t)}_circumference(t,e){const i=this,n=i.options,o=i._cachedMeta,s=i._getCircumference();return e&&n.animation.animateRotate||!this.chart.getDataVisibility(t)||null===o._parsed[t]||o.data[t].hidden?0:i.calculateCircumference(o._parsed[t]*s/_t)}updateElements(t,e,i,n){const o=this,s="reset"===n,a=o.chart,r=a.chartArea,l=a.options.animation,c=(r.left+r.right)/2,h=(r.top+r.bottom)/2,d=s&&l.animateScale,u=d?0:o.innerRadius,f=d?0:o.outerRadius,g=o.resolveDataElementOptions(e,n),p=o.getSharedOptions(g),m=o.includeOptions(n,p);let x,b=o._getRotation();for(x=0;x<e;++x)b+=o._circumference(x,s);for(x=e;x<e+i;++x){const e=o._circumference(x,s),i=t[x],a={x:c+o.offsetX,y:h+o.offsetY,startAngle:b,endAngle:b+e,circumference:e,outerRadius:f,innerRadius:u};m&&(a.options=p||o.resolveDataElementOptions(x,i.active?"active":n)),b+=e,o.updateElement(i,x,a,n)}o.updateSharedOptions(p,n,g)}calculateTotal(){const t=this._cachedMeta,e=t.data;let i,n=0;for(i=0;i<e.length;i++){const o=t._parsed[i];null===o||isNaN(o)||!this.chart.getDataVisibility(i)||e[i].hidden||(n+=Math.abs(o))}return n}calculateCircumference(t){const e=this._cachedMeta.total;return e>0&&!isNaN(t)?_t*(Math.abs(t)/e):0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,n=i.data.labels||[],o=Oi(e._parsed[t],i.options.locale);return{label:n[t]||"",value:o}}getMaxBorderWidth(t){const e=this;let i=0;const n=e.chart;let o,s,a,r,l;if(!t)for(o=0,s=n.data.datasets.length;o<s;++o)if(n.isDatasetVisible(o)){a=n.getDatasetMeta(o),t=a.data,r=a.controller,r!==e&&r.configure();break}if(!t)return 0;for(o=0,s=t.length;o<s;++o)l=r.resolveDataElementOptions(o),"inner"!==l.borderAlign&&(i=Math.max(i,l.borderWidth||0,l.hoverBorderWidth||0));return i}getMaxOffset(t){let e=0;for(let i=0,n=t.length;i<n;++i){const t=this.resolveDataElementOptions(i);e=Math.max(e,t.offset||0,t.hoverOffset||0)}return e}_getRingWeightOffset(t){let e=0;for(let i=0;i<t;++i)this.chart.isDatasetVisible(i)&&(e+=this._getRingWeight(i));return e}_getRingWeight(t){return Math.max(K(this.chart.data.datasets[t].weight,1),0)}_getVisibleDatasetWeightTotal(){return this._getRingWeightOffset(this.chart.data.datasets.length)||1}}yo.id="doughnut",yo.defaults={datasetElementType:!1,dataElementType:"arc",animation:{animateRotate:!0,animateScale:!1},animations:{numbers:{type:"number",properties:["circumference","endAngle","innerRadius","outerRadius","startAngle","x","y","offset","borderWidth","spacing"]}},cutout:"50%",rotation:0,circumference:360,radius:"100%",spacing:0,indexAxis:"r"},yo.descriptors={_scriptable:t=>"spacing"!==t,_indexable:t=>"spacing"!==t},yo.overrides={aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:i}}=t.legend.options;return e.labels.map(((e,n)=>{const o=t.getDatasetMeta(0).controller.getStyle(n);return{text:e,fillStyle:o.backgroundColor,strokeStyle:o.borderColor,lineWidth:o.borderWidth,pointStyle:i,hidden:!t.getDataVisibility(n),index:n}}))}return[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}},tooltip:{callbacks:{title:()=>"",label(t){let e=t.label;const i=": "+t.formattedValue;return Y(e)?(e=e.slice(),e[0]+=i):e+=i,e}}}}};class vo extends wn{initialize(){this.enableOptionSharing=!0,super.initialize()}update(t){const e=this,i=e._cachedMeta,{dataset:n,data:o=[],_dataset:s}=i,a=e.chart._animationsDisabled;let{start:r,count:l}=function(t,e,i){const n=e.length;let o=0,s=n;if(t._sorted){const{iScale:a,_parsed:r}=t,l=a.axis,{min:c,max:h,minDefined:d,maxDefined:u}=a.getUserBounds();d&&(o=Ht(Math.min(se(r,a.axis,c).lo,i?n:se(e,l,a.getPixelForValue(c)).lo),0,n-1)),s=u?Ht(Math.max(se(r,a.axis,h).hi+1,i?0:se(e,l,a.getPixelForValue(h)).hi+1),o,n)-o:n-o}return{start:o,count:s}}(i,o,a);e._drawStart=r,e._drawCount=l,function(t){const{xScale:e,yScale:i,_scaleRanges:n}=t,o={xmin:e.min,xmax:e.max,ymin:i.min,ymax:i.max};if(!n)return t._scaleRanges=o,!0;const s=n.xmin!==e.min||n.xmax!==e.max||n.ymin!==i.min||n.ymax!==i.max;return Object.assign(n,o),s}(i)&&(r=0,l=o.length),n._datasetIndex=e.index,n._decimated=!!s._decimated,n.points=o;const c=e.resolveDatasetElementOptions(t);e.options.showLine||(c.borderWidth=0),c.segment=e.options.segment,e.updateElement(n,void 0,{animated:!a,options:c},t),e.updateElements(o,r,l,t)}updateElements(t,e,i,n){const o=this,s="reset"===n,{iScale:a,vScale:r,_stacked:l}=o._cachedMeta,c=o.resolveDataElementOptions(e,n),h=o.getSharedOptions(c),d=o.includeOptions(n,h),u=a.axis,f=r.axis,g=o.options.spanGaps,p=Tt(g)?g:Number.POSITIVE_INFINITY,m=o.chart._animationsDisabled||s||"none"===n;let x=e>0&&o.getParsed(e-1);for(let c=e;c<e+i;++c){const e=t[c],i=o.getParsed(c),g=m?e:{},b=$(i[f]),_=g[u]=a.getPixelForValue(i[u],c),y=g[f]=s||b?r.getBasePixel():r.getPixelForValue(l?o.applyStack(r,i,l):i[f],c);g.skip=isNaN(_)||isNaN(y)||b,g.stop=c>0&&i[u]-x[u]>p,g.parsed=i,d&&(g.options=h||o.resolveDataElementOptions(c,e.active?"active":n)),m||o.updateElement(e,c,g,n),x=i}o.updateSharedOptions(h,n,c)}getMaxOverflow(){const t=this,e=t._cachedMeta,i=e.dataset,n=i.options&&i.options.borderWidth||0,o=e.data||[];if(!o.length)return n;const s=o[0].size(t.resolveDataElementOptions(0)),a=o[o.length-1].size(t.resolveDataElementOptions(o.length-1));return Math.max(n,s,a)/2}draw(){const t=this._cachedMeta;t.dataset.updateControlPoints(this.chart.chartArea,t.iScale.axis),super.draw()}}vo.id="line",vo.defaults={datasetElementType:"line",dataElementType:"point",showLine:!0,spanGaps:!1},vo.overrides={scales:{_index_:{type:"category"},_value_:{type:"linear"}}};class wo extends wn{constructor(t,e){super(t,e),this.innerRadius=void 0,this.outerRadius=void 0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,n=i.data.labels||[],o=Oi(e._parsed[t].r,i.options.locale);return{label:n[t]||"",value:o}}update(t){const e=this._cachedMeta.data;this._updateRadius(),this.updateElements(e,0,e.length,t)}_updateRadius(){const t=this,e=t.chart,i=e.chartArea,n=e.options,o=Math.min(i.right-i.left,i.bottom-i.top),s=Math.max(o/2,0),a=(s-Math.max(n.cutoutPercentage?s/100*n.cutoutPercentage:1,0))/e.getVisibleDatasetCount();t.outerRadius=s-a*t.index,t.innerRadius=t.outerRadius-a}updateElements(t,e,i,n){const o=this,s="reset"===n,a=o.chart,r=o.getDataset(),l=a.options.animation,c=o._cachedMeta.rScale,h=c.xCenter,d=c.yCenter,u=c.getIndexAngle(0)-.5*bt;let f,g=u;const p=360/o.countVisibleElements();for(f=0;f<e;++f)g+=o._computeAngle(f,n,p);for(f=e;f<e+i;f++){const e=t[f];let i=g,m=g+o._computeAngle(f,n,p),x=a.getDataVisibility(f)?c.getDistanceFromCenterForValue(r.data[f]):0;g=m,s&&(l.animateScale&&(x=0),l.animateRotate&&(i=m=u));const b={x:h,y:d,innerRadius:0,outerRadius:x,startAngle:i,endAngle:m,options:o.resolveDataElementOptions(f,e.active?"active":n)};o.updateElement(e,f,b,n)}}countVisibleElements(){const t=this.getDataset(),e=this._cachedMeta;let i=0;return e.data.forEach(((e,n)=>{!isNaN(t.data[n])&&this.chart.getDataVisibility(n)&&i++})),i}_computeAngle(t,e,i){return this.chart.getDataVisibility(t)?Et(this.resolveDataElementOptions(t,e).angle||i):0}}wo.id="polarArea",wo.defaults={dataElementType:"arc",animation:{animateRotate:!0,animateScale:!0},animations:{numbers:{type:"number",properties:["x","y","startAngle","endAngle","innerRadius","outerRadius"]}},indexAxis:"r",startAngle:0},wo.overrides={aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:i}}=t.legend.options;return e.labels.map(((e,n)=>{const o=t.getDatasetMeta(0).controller.getStyle(n);return{text:e,fillStyle:o.backgroundColor,strokeStyle:o.borderColor,lineWidth:o.borderWidth,pointStyle:i,hidden:!t.getDataVisibility(n),index:n}}))}return[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}},tooltip:{callbacks:{title:()=>"",label:t=>t.chart.data.labels[t.dataIndex]+": "+t.formattedValue}}},scales:{r:{type:"radialLinear",angleLines:{display:!1},beginAtZero:!0,grid:{circular:!0},pointLabels:{display:!1},startAngle:0}}};class Mo extends yo{}Mo.id="pie",Mo.defaults={cutout:0,rotation:0,circumference:360,radius:"100%"};class ko extends wn{getLabelAndValue(t){const e=this._cachedMeta.vScale,i=this.getParsed(t);return{label:e.getLabels()[t],value:""+e.getLabelForValue(i[e.axis])}}update(t){const e=this,i=e._cachedMeta,n=i.dataset,o=i.data||[],s=i.iScale.getLabels();if(n.points=o,"resize"!==t){const i=e.resolveDatasetElementOptions(t);e.options.showLine||(i.borderWidth=0);const a={_loop:!0,_fullLoop:s.length===o.length,options:i};e.updateElement(n,void 0,a,t)}e.updateElements(o,0,o.length,t)}updateElements(t,e,i,n){const o=this,s=o.getDataset(),a=o._cachedMeta.rScale,r="reset"===n;for(let l=e;l<e+i;l++){const e=t[l],i=o.resolveDataElementOptions(l,e.active?"active":n),c=a.getPointPositionForValue(l,s.data[l]),h=r?a.xCenter:c.x,d=r?a.yCenter:c.y,u={x:h,y:d,angle:c.angle,skip:isNaN(h)||isNaN(d),options:i};o.updateElement(e,l,u,n)}}}ko.id="radar",ko.defaults={datasetElementType:"line",dataElementType:"point",indexAxis:"r",showLine:!0,elements:{line:{fill:"start"}}},ko.overrides={aspectRatio:1,scales:{r:{type:"radialLinear"}}};class So extends vo{}So.id="scatter",So.defaults={showLine:!1,fill:!1},So.overrides={interaction:{mode:"point"},plugins:{tooltip:{callbacks:{title:()=>"",label:t=>"("+t.label+", "+t.formattedValue+")"}}},scales:{x:{type:"linear"},y:{type:"linear"}}};var Po=Object.freeze({__proto__:null,BarController:bo,BubbleController:_o,DoughnutController:yo,LineController:vo,PolarAreaController:wo,PieController:Mo,RadarController:ko,ScatterController:So});function Do(t,e,i){const{startAngle:n,pixelMargin:o,x:s,y:a,outerRadius:r,innerRadius:l}=e;let c=o/r;t.beginPath(),t.arc(s,a,r,n-c,i+c),l>o?(c=o/l,t.arc(s,a,l,i+c,n-c,!0)):t.arc(s,a,o,i+Mt,n-Mt),t.closePath(),t.clip()}function Co(t,e,i,n){const o=Ie(t.options.borderRadius,["outerStart","outerEnd","innerStart","innerEnd"]);const s=(i-e)/2,a=Math.min(s,n*e/2),r=t=>{const e=(i-Math.min(s,t))*n/2;return Ht(t,0,Math.min(s,e))};return{outerStart:r(o.outerStart),outerEnd:r(o.outerEnd),innerStart:Ht(o.innerStart,0,a),innerEnd:Ht(o.innerEnd,0,a)}}function Oo(t,e,i,n){return{x:i+t*Math.cos(e),y:n+t*Math.sin(e)}}function To(t,e,i,n,o){const{x:s,y:a,startAngle:r,pixelMargin:l,innerRadius:c}=e,h=Math.max(e.outerRadius+n+i-l,0),d=c>0?c+n+i+l:0;let u=0;const f=o-r;if(n){const t=((c>0?c-n:0)+(h>0?h-n:0))/2;u=(f-(0!==t?f*t/(t+n):f))/2}const g=(f-Math.max(.001,f*h-i/bt)/h)/2,p=r+g+u,m=o-g-u,{outerStart:x,outerEnd:b,innerStart:_,innerEnd:y}=Co(e,d,h,m-p),v=h-x,w=h-b,M=p+x/v,k=m-b/w,S=d+_,P=d+y,D=p+_/S,C=m-y/P;if(t.beginPath(),t.arc(s,a,h,M,k),b>0){const e=Oo(w,k,s,a);t.arc(e.x,e.y,b,k,m+Mt)}const O=Oo(P,m,s,a);if(t.lineTo(O.x,O.y),y>0){const e=Oo(P,C,s,a);t.arc(e.x,e.y,y,m+Mt,C+Math.PI)}if(t.arc(s,a,d,m-y/d,p+_/d,!0),_>0){const e=Oo(S,D,s,a);t.arc(e.x,e.y,_,D+Math.PI,p-Mt)}const T=Oo(v,p,s,a);if(t.lineTo(T.x,T.y),x>0){const e=Oo(v,M,s,a);t.arc(e.x,e.y,x,p-Mt,M)}t.closePath()}function Ao(t,e,i,n,o){const{options:s}=e,a="inner"===s.borderAlign;s.borderWidth&&(a?(t.lineWidth=2*s.borderWidth,t.lineJoin="round"):(t.lineWidth=s.borderWidth,t.lineJoin="bevel"),e.fullCircles&&function(t,e,i){const{x:n,y:o,startAngle:s,pixelMargin:a,fullCircles:r}=e,l=Math.max(e.outerRadius-a,0),c=e.innerRadius+a;let h;for(i&&Do(t,e,s+_t),t.beginPath(),t.arc(n,o,c,s+_t,s,!0),h=0;h<r;++h)t.stroke();for(t.beginPath(),t.arc(n,o,l,s,s+_t),h=0;h<r;++h)t.stroke()}(t,e,a),a&&Do(t,e,o),To(t,e,i,n,o),t.stroke())}class Lo extends Mn{constructor(t){super(),this.options=void 0,this.circumference=void 0,this.startAngle=void 0,this.endAngle=void 0,this.innerRadius=void 0,this.outerRadius=void 0,this.pixelMargin=0,this.fullCircles=0,t&&Object.assign(this,t)}inRange(t,e,i){const n=this.getProps(["x","y"],i),{angle:o,distance:s}=Ft(n,{x:t,y:e}),{startAngle:a,endAngle:r,innerRadius:l,outerRadius:c,circumference:h}=this.getProps(["startAngle","endAngle","innerRadius","outerRadius","circumference"],i),d=this.options.spacing/2;return(h>=_t||Nt(o,a,r))&&(s>=l+d&&s<=c+d)}getCenterPoint(t){const{x:e,y:i,startAngle:n,endAngle:o,innerRadius:s,outerRadius:a}=this.getProps(["x","y","startAngle","endAngle","innerRadius","outerRadius","circumference"],t),{offset:r,spacing:l}=this.options,c=(n+o)/2,h=(s+a+l+r)/2;return{x:e+Math.cos(c)*h,y:i+Math.sin(c)*h}}tooltipPosition(t){return this.getCenterPoint(t)}draw(t){const e=this,{options:i,circumference:n}=e,o=(i.offset||0)/2,s=(i.spacing||0)/2;if(e.pixelMargin="inner"===i.borderAlign?.33:0,e.fullCircles=n>_t?Math.floor(n/_t):0,0===n||e.innerRadius<0||e.outerRadius<0)return;t.save();let a=0;if(o){a=o/2;const i=(e.startAngle+e.endAngle)/2;t.translate(Math.cos(i)*a,Math.sin(i)*a),e.circumference>=bt&&(a=o)}t.fillStyle=i.backgroundColor,t.strokeStyle=i.borderColor;const r=function(t,e,i,n){const{fullCircles:o,startAngle:s,circumference:a}=e;let r=e.endAngle;if(o){To(t,e,i,n,s+_t);for(let e=0;e<o;++e)t.fill();isNaN(a)||(r=s+a%_t,a%_t==0&&(r+=_t))}return To(t,e,i,n,r),t.fill(),r}(t,e,a,s);Ao(t,e,a,s,r),t.restore()}}function Ro(t,e,i=e){t.lineCap=K(i.borderCapStyle,e.borderCapStyle),t.setLineDash(K(i.borderDash,e.borderDash)),t.lineDashOffset=K(i.borderDashOffset,e.borderDashOffset),t.lineJoin=K(i.borderJoinStyle,e.borderJoinStyle),t.lineWidth=K(i.borderWidth,e.borderWidth),t.strokeStyle=K(i.borderColor,e.borderColor)}function Eo(t,e,i){t.lineTo(i.x,i.y)}function Io(t,e,i={}){const n=t.length,{start:o=0,end:s=n-1}=i,{start:a,end:r}=e,l=Math.max(o,a),c=Math.min(s,r),h=o<a&&s<a||o>r&&s>r;return{count:n,start:l,loop:e.loop,ilen:c<l&&!h?n+c-l:c-l}}function zo(t,e,i,n){const{points:o,options:s}=e,{count:a,start:r,loop:l,ilen:c}=Io(o,i,n),h=function(t){return t.stepped?Jt:t.tension||"monotone"===t.cubicInterpolationMode?te:Eo}(s);let d,u,f,{move:g=!0,reverse:p}=n||{};for(d=0;d<=c;++d)u=o[(r+(p?c-d:d))%a],u.skip||(g?(t.moveTo(u.x,u.y),g=!1):h(t,f,u,p,s.stepped),f=u);return l&&(u=o[(r+(p?c:0))%a],h(t,f,u,p,s.stepped)),!!l}function Fo(t,e,i,n){const o=e.points,{count:s,start:a,ilen:r}=Io(o,i,n),{move:l=!0,reverse:c}=n||{};let h,d,u,f,g,p,m=0,x=0;const b=t=>(a+(c?r-t:t))%s,_=()=>{f!==g&&(t.lineTo(m,g),t.lineTo(m,f),t.lineTo(m,p))};for(l&&(d=o[b(0)],t.moveTo(d.x,d.y)),h=0;h<=r;++h){if(d=o[b(h)],d.skip)continue;const e=d.x,i=d.y,n=0|e;n===u?(i<f?f=i:i>g&&(g=i),m=(x*m+e)/++x):(_(),t.lineTo(e,i),u=n,x=0,f=g=i),p=i}_()}function Bo(t){const e=t.options,i=e.borderDash&&e.borderDash.length;return!(t._decimated||t._loop||e.tension||"monotone"===e.cubicInterpolationMode||e.stepped||i)?Fo:zo}Lo.id="arc",Lo.defaults={borderAlign:"center",borderColor:"#fff",borderRadius:0,borderWidth:2,offset:0,spacing:0,angle:void 0},Lo.defaultRoutes={backgroundColor:"backgroundColor"};const Vo="function"==typeof Path2D;function Wo(t,e,i,n){Vo&&1===e.segments.length?function(t,e,i,n){let o=e._path;o||(o=e._path=new Path2D,e.path(o,i,n)&&o.closePath()),Ro(t,e.options),t.stroke(o)}(t,e,i,n):function(t,e,i,n){const{segments:o,options:s}=e,a=Bo(e);for(const r of o)Ro(t,s,r.style),t.beginPath(),a(t,e,r,{start:i,end:i+n-1})&&t.closePath(),t.stroke()}(t,e,i,n)}class No extends Mn{constructor(t){super(),this.animated=!0,this.options=void 0,this._loop=void 0,this._fullLoop=void 0,this._path=void 0,this._points=void 0,this._segments=void 0,this._decimated=!1,this._pointsUpdated=!1,this._datasetIndex=void 0,t&&Object.assign(this,t)}updateControlPoints(t,e){const i=this,n=i.options;if((n.tension||"monotone"===n.cubicInterpolationMode)&&!n.stepped&&!i._pointsUpdated){const o=n.spanGaps?i._loop:i._fullLoop;yi(i._points,n,t,o,e),i._pointsUpdated=!0}}set points(t){const e=this;e._points=t,delete e._segments,delete e._path,e._pointsUpdated=!1}get points(){return this._points}get segments(){return this._segments||(this._segments=Fi(this,this.options.segment))}first(){const t=this.segments,e=this.points;return t.length&&e[t[0].start]}last(){const t=this.segments,e=this.points,i=t.length;return i&&e[t[i-1].end]}interpolate(t,e){const i=this,n=i.options,o=t[e],s=i.points,a=zi(i,{property:e,start:o,end:o});if(!a.length)return;const r=[],l=function(t){return t.stepped?Pi:t.tension||"monotone"===t.cubicInterpolationMode?Di:Si}(n);let c,h;for(c=0,h=a.length;c<h;++c){const{start:i,end:h}=a[c],d=s[i],u=s[h];if(d===u){r.push(d);continue}const f=l(d,u,Math.abs((o-d[e])/(u[e]-d[e])),n.stepped);f[e]=t[e],r.push(f)}return 1===r.length?r[0]:r}pathSegment(t,e,i){return Bo(this)(t,this,e,i)}path(t,e,i){const n=this,o=n.segments,s=Bo(n);let a=n._loop;e=e||0,i=i||n.points.length-e;for(const r of o)a&=s(t,n,r,{start:e,end:e+i-1});return!!a}draw(t,e,i,n){const o=this,s=o.options||{};(o.points||[]).length&&s.borderWidth&&(t.save(),Wo(t,o,i,n),t.restore(),o.animated&&(o._pointsUpdated=!1,o._path=void 0))}}function Ho(t,e,i,n){const o=t.options,{[i]:s}=t.getProps([i],n);return Math.abs(e-s)<o.radius+o.hitRadius}No.id="line",No.defaults={borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",borderWidth:3,capBezierPoints:!0,cubicInterpolationMode:"default",fill:!1,spanGaps:!1,stepped:!1,tension:0},No.defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"},No.descriptors={_scriptable:!0,_indexable:t=>"borderDash"!==t&&"fill"!==t};class jo extends Mn{constructor(t){super(),this.options=void 0,this.parsed=void 0,this.skip=void 0,this.stop=void 0,t&&Object.assign(this,t)}inRange(t,e,i){const n=this.options,{x:o,y:s}=this.getProps(["x","y"],i);return Math.pow(t-o,2)+Math.pow(e-s,2)<Math.pow(n.hitRadius+n.radius,2)}inXRange(t,e){return Ho(this,t,"x",e)}inYRange(t,e){return Ho(this,t,"y",e)}getCenterPoint(t){const{x:e,y:i}=this.getProps(["x","y"],t);return{x:e,y:i}}size(t){let e=(t=t||this.options||{}).radius||0;e=Math.max(e,e&&t.hoverRadius||0);return 2*(e+(e&&t.borderWidth||0))}draw(t,e){const i=this,n=i.options;i.skip||n.radius<.1||!Gt(i,e,i.size(n)/2)||(t.strokeStyle=n.borderColor,t.lineWidth=n.borderWidth,t.fillStyle=n.backgroundColor,Kt(t,n,i.x,i.y))}getRange(){const t=this.options||{};return t.radius+t.hitRadius}}function $o(t,e){const{x:i,y:n,base:o,width:s,height:a}=t.getProps(["x","y","base","width","height"],e);let r,l,c,h,d;return t.horizontal?(d=a/2,r=Math.min(i,o),l=Math.max(i,o),c=n-d,h=n+d):(d=s/2,r=i-d,l=i+d,c=Math.min(n,o),h=Math.max(n,o)),{left:r,top:c,right:l,bottom:h}}function Yo(t,e,i,n){return t?0:Ht(e,i,n)}function Uo(t){const e=$o(t),i=e.right-e.left,n=e.bottom-e.top,o=function(t,e,i){const n=t.options.borderWidth,o=t.borderSkipped,s=ze(n);return{t:Yo(o.top,s.top,0,i),r:Yo(o.right,s.right,0,e),b:Yo(o.bottom,s.bottom,0,i),l:Yo(o.left,s.left,0,e)}}(t,i/2,n/2),s=function(t,e,i){const{enableBorderRadius:n}=t.getProps(["enableBorderRadius"]),o=t.options.borderRadius,s=Fe(o),a=Math.min(e,i),r=t.borderSkipped,l=n||U(o);return{topLeft:Yo(!l||r.top||r.left,s.topLeft,0,a),topRight:Yo(!l||r.top||r.right,s.topRight,0,a),bottomLeft:Yo(!l||r.bottom||r.left,s.bottomLeft,0,a),bottomRight:Yo(!l||r.bottom||r.right,s.bottomRight,0,a)}}(t,i/2,n/2);return{outer:{x:e.left,y:e.top,w:i,h:n,radius:s},inner:{x:e.left+o.l,y:e.top+o.t,w:i-o.l-o.r,h:n-o.t-o.b,radius:{topLeft:Math.max(0,s.topLeft-Math.max(o.t,o.l)),topRight:Math.max(0,s.topRight-Math.max(o.t,o.r)),bottomLeft:Math.max(0,s.bottomLeft-Math.max(o.b,o.l)),bottomRight:Math.max(0,s.bottomRight-Math.max(o.b,o.r))}}}}function Xo(t,e,i,n){const o=null===e,s=null===i,a=t&&!(o&&s)&&$o(t,n);return a&&(o||e>=a.left&&e<=a.right)&&(s||i>=a.top&&i<=a.bottom)}function qo(t,e){t.rect(e.x,e.y,e.w,e.h)}function Ko(t,e,i={}){const n=t.x!==i.x?-e:0,o=t.y!==i.y?-e:0,s=(t.x+t.w!==i.x+i.w?e:0)-n,a=(t.y+t.h!==i.y+i.h?e:0)-o;return{x:t.x+n,y:t.y+o,w:t.w+s,h:t.h+a,radius:t.radius}}jo.id="point",jo.defaults={borderWidth:1,hitRadius:1,hoverBorderWidth:1,hoverRadius:4,pointStyle:"circle",radius:3,rotation:0},jo.defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"};class Go extends Mn{constructor(t){super(),this.options=void 0,this.horizontal=void 0,this.base=void 0,this.width=void 0,this.height=void 0,t&&Object.assign(this,t)}draw(t){const e=this.options,{inner:i,outer:n}=Uo(this),o=(s=n.radius).topLeft||s.topRight||s.bottomLeft||s.bottomRight?ne:qo;var s;const a=.33;t.save(),n.w===i.w&&n.h===i.h||(t.beginPath(),o(t,Ko(n,a,i)),t.clip(),o(t,Ko(i,-.33,n)),t.fillStyle=e.borderColor,t.fill("evenodd")),t.beginPath(),o(t,Ko(i,a,n)),t.fillStyle=e.backgroundColor,t.fill(),t.restore()}inRange(t,e,i){return Xo(this,t,e,i)}inXRange(t,e){return Xo(this,t,null,e)}inYRange(t,e){return Xo(this,null,t,e)}getCenterPoint(t){const{x:e,y:i,base:n,horizontal:o}=this.getProps(["x","y","base","horizontal"],t);return{x:o?(e+n)/2:e,y:o?i:(i+n)/2}}getRange(t){return"x"===t?this.width/2:this.height/2}}Go.id="bar",Go.defaults={borderSkipped:"start",borderWidth:0,borderRadius:0,enableBorderRadius:!0,pointStyle:void 0},Go.defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"};var Zo=Object.freeze({__proto__:null,ArcElement:Lo,LineElement:No,PointElement:jo,BarElement:Go});function Qo(t){if(t._decimated){const e=t._data;delete t._decimated,delete t._data,Object.defineProperty(t,"data",{value:e})}}function Jo(t){t.data.datasets.forEach((t=>{Qo(t)}))}var ts={id:"decimation",defaults:{algorithm:"min-max",enabled:!1},beforeElementsUpdate:(t,e,i)=>{if(!i.enabled)return void Jo(t);const n=t.width;t.data.datasets.forEach(((e,o)=>{const{_data:s,indexAxis:a}=e,r=t.getDatasetMeta(o),l=s||e.data;if("y"===We([a,t.options.indexAxis]))return;if("line"!==r.type)return;const c=t.scales[r.xAxisID];if("linear"!==c.type&&"time"!==c.type)return;if(t.options.parsing)return;let{start:h,count:d}=function(t,e){const i=e.length;let n,o=0;const{iScale:s}=t,{min:a,max:r,minDefined:l,maxDefined:c}=s.getUserBounds();return l&&(o=Ht(se(e,s.axis,a).lo,0,i-1)),n=c?Ht(se(e,s.axis,r).hi+1,o,i)-o:i-o,{start:o,count:n}}(r,l);if(d<=(i.threshold||4*n))return void Qo(e);let u;switch($(s)&&(e._data=l,delete e.data,Object.defineProperty(e,"data",{configurable:!0,enumerable:!0,get:function(){return this._decimated},set:function(t){this._data=t}})),i.algorithm){case"lttb":u=function(t,e,i,n,o){const s=o.samples||n;if(s>=i)return t.slice(e,e+i);const a=[],r=(i-2)/(s-2);let l=0;const c=e+i-1;let h,d,u,f,g,p=e;for(a[l++]=t[p],h=0;h<s-2;h++){let n,o=0,s=0;const c=Math.floor((h+1)*r)+1+e,m=Math.min(Math.floor((h+2)*r)+1,i)+e,x=m-c;for(n=c;n<m;n++)o+=t[n].x,s+=t[n].y;o/=x,s/=x;const b=Math.floor(h*r)+1+e,_=Math.min(Math.floor((h+1)*r)+1,i)+e,{x:y,y:v}=t[p];for(u=f=-1,n=b;n<_;n++)f=.5*Math.abs((y-o)*(t[n].y-v)-(y-t[n].x)*(s-v)),f>u&&(u=f,d=t[n],g=n);a[l++]=d,p=g}return a[l++]=t[c],a}(l,h,d,n,i);break;case"min-max":u=function(t,e,i,n){let o,s,a,r,l,c,h,d,u,f,g=0,p=0;const m=[],x=e+i-1,b=t[e].x,_=t[x].x-b;for(o=e;o<e+i;++o){s=t[o],a=(s.x-b)/_*n,r=s.y;const e=0|a;if(e===l)r<u?(u=r,c=o):r>f&&(f=r,h=o),g=(p*g+s.x)/++p;else{const i=o-1;if(!$(c)&&!$(h)){const e=Math.min(c,h),n=Math.max(c,h);e!==d&&e!==i&&m.push({...t[e],x:g}),n!==d&&n!==i&&m.push({...t[n],x:g})}o>0&&i!==d&&m.push(t[i]),m.push(s),l=e,p=0,u=f=r,c=h=d=o}}return m}(l,h,d,n);break;default:throw new Error(`Unsupported decimation algorithm '${i.algorithm}'`)}e._decimated=u}))},destroy(t){Jo(t)}};function es(t,e,i){const n=function(t){const e=t.options,i=e.fill;let n=K(i&&i.target,i);return void 0===n&&(n=!!e.backgroundColor),!1!==n&&null!==n&&(!0===n?"origin":n)}(t);if(U(n))return!isNaN(n.value)&&n;let o=parseFloat(n);return X(o)&&Math.floor(o)===o?("-"!==n[0]&&"+"!==n[0]||(o=e+o),!(o===e||o<0||o>=i)&&o):["origin","start","end","stack","shape"].indexOf(n)>=0&&n}class is{constructor(t){this.x=t.x,this.y=t.y,this.radius=t.radius}pathSegment(t,e,i){const{x:n,y:o,radius:s}=this;return e=e||{start:0,end:_t},t.arc(n,o,s,e.end,e.start,!0),!i.bounds}interpolate(t){const{x:e,y:i,radius:n}=this,o=t.angle;return{x:e+Math.cos(o)*n,y:i+Math.sin(o)*n,angle:o}}}function ns(t){return(t.scale||{}).getPointPositionForValue?function(t){const{scale:e,fill:i}=t,n=e.options,o=e.getLabels().length,s=[],a=n.reverse?e.max:e.min,r=n.reverse?e.min:e.max;let l,c,h;if(h="start"===i?a:"end"===i?r:U(i)?i.value:e.getBaseValue(),n.grid.circular)return c=e.getPointPositionForValue(0,a),new is({x:c.x,y:c.y,radius:e.getDistanceFromCenterForValue(h)});for(l=0;l<o;++l)s.push(e.getPointPositionForValue(l,h));return s}(t):function(t){const{scale:e={},fill:i}=t;let n,o=null;return"start"===i?o=e.bottom:"end"===i?o=e.top:U(i)?o=e.getPixelForValue(i.value):e.getBasePixel&&(o=e.getBasePixel()),X(o)?(n=e.isHorizontal(),{x:n?o:null,y:n?null:o}):null}(t)}function os(t,e,i){for(;e>t;e--){const t=i[e];if(!isNaN(t.x)&&!isNaN(t.y))break}return e}function ss(t){const{chart:e,scale:i,index:n,line:o}=t,s=[],a=o.segments,r=o.points,l=function(t,e){const i=[],n=t.getSortedVisibleDatasetMetas();for(let t=0;t<n.length;t++){const o=n[t];if(o.index===e)break;as(o)&&i.unshift(o.dataset)}return i}(e,n);l.push(cs({x:null,y:i.bottom},o));for(let t=0;t<a.length;t++){const e=a[t];for(let t=e.start;t<=e.end;t++)rs(s,r[t],l)}return new No({points:s,options:{}})}const as=t=>"line"===t.type&&!t.hidden;function rs(t,e,i){const n=[];for(let o=0;o<i.length;o++){const s=i[o],{first:a,last:r,point:l}=ls(s,e,"x");if(!(!l||a&&r))if(a)n.unshift(l);else if(t.push(l),!r)break}t.push(...n)}function ls(t,e,i){const n=t.interpolate(e,i);if(!n)return{};const o=n[i],s=t.segments,a=t.points;let r=!1,l=!1;for(let t=0;t<s.length;t++){const e=s[t],n=a[e.start][i],c=a[e.end][i];if(o>=n&&o<=c){r=o===n,l=o===c;break}}return{first:r,last:l,point:n}}function cs(t,e){let i=[],n=!1;return Y(t)?(n=!0,i=t):i=function(t,e){const{x:i=null,y:n=null}=t||{},o=e.points,s=[];return e.segments.forEach((({start:t,end:e})=>{e=os(t,e,o);const a=o[t],r=o[e];null!==n?(s.push({x:a.x,y:n}),s.push({x:r.x,y:n})):null!==i&&(s.push({x:i,y:a.y}),s.push({x:i,y:r.y}))})),s}(t,e),i.length?new No({points:i,options:{tension:0},_loop:n,_fullLoop:n}):null}function hs(t,e,i){let n=t[e].fill;const o=[e];let s;if(!i)return n;for(;!1!==n&&-1===o.indexOf(n);){if(!X(n))return n;if(s=t[n],!s)return!1;if(s.visible)return n;o.push(n),n=s.fill}return!1}function ds(t,e,i){t.beginPath(),e.path(t),t.lineTo(e.last().x,i),t.lineTo(e.first().x,i),t.closePath(),t.clip()}function us(t,e,i,n){if(n)return;let o=e[t],s=i[t];return"angle"===t&&(o=Wt(o),s=Wt(s)),{property:t,start:o,end:s}}function fs(t,e,i,n){return t&&e?n(t[i],e[i]):t?t[i]:e?e[i]:0}function gs(t,e,i){const{top:n,bottom:o}=e.chart.chartArea,{property:s,start:a,end:r}=i||{};"x"===s&&(t.beginPath(),t.rect(a,n,r-a,o-n),t.clip())}function ps(t,e,i,n){const o=e.interpolate(i,n);o&&t.lineTo(o.x,o.y)}function ms(t,e){const{line:i,target:n,property:o,color:s,scale:a}=e,r=function(t,e,i){const n=t.segments,o=t.points,s=e.points,a=[];for(const t of n){let{start:n,end:r}=t;r=os(n,r,o);const l=us(i,o[n],o[r],t.loop);if(!e.segments){a.push({source:t,target:l,start:o[n],end:o[r]});continue}const c=zi(e,l);for(const e of c){const n=us(i,s[e.start],s[e.end],e.loop),r=Ii(t,o,n);for(const t of r)a.push({source:t,target:e,start:{[i]:fs(l,n,"start",Math.max)},end:{[i]:fs(l,n,"end",Math.min)}})}}return a}(i,n,o);for(const{source:e,target:l,start:c,end:h}of r){const{style:{backgroundColor:r=s}={}}=e,d=!0!==n;t.save(),t.fillStyle=r,gs(t,a,d&&us(o,c,h)),t.beginPath();const u=!!i.pathSegment(t,e);let f;if(d){u?t.closePath():ps(t,n,h,o);const e=!!n.pathSegment(t,l,{move:u,reverse:!0});f=u&&e,f||ps(t,n,c,o)}t.closePath(),t.fill(f?"evenodd":"nonzero"),t.restore()}}function xs(t,e,i){const n=function(t){const{chart:e,fill:i,line:n}=t;if(X(i))return function(t,e){const i=t.getDatasetMeta(e);return i&&t.isDatasetVisible(e)?i.dataset:null}(e,i);if("stack"===i)return ss(t);if("shape"===i)return!0;const o=ns(t);return o instanceof is?o:cs(o,n)}(e),{line:o,scale:s,axis:a}=e,r=o.options,l=r.fill,c=r.backgroundColor,{above:h=c,below:d=c}=l||{};n&&o.points.length&&(Zt(t,i),function(t,e){const{line:i,target:n,above:o,below:s,area:a,scale:r}=e,l=i._loop?"angle":e.axis;t.save(),"x"===l&&s!==o&&(ds(t,n,a.top),ms(t,{line:i,target:n,color:o,scale:r,property:l}),t.restore(),t.save(),ds(t,n,a.bottom)),ms(t,{line:i,target:n,color:s,scale:r,property:l}),t.restore()}(t,{line:o,target:n,above:h,below:d,area:i,scale:s,axis:a}),Qt(t))}var bs={id:"filler",afterDatasetsUpdate(t,e,i){const n=(t.data.datasets||[]).length,o=[];let s,a,r,l;for(a=0;a<n;++a)s=t.getDatasetMeta(a),r=s.dataset,l=null,r&&r.options&&r instanceof No&&(l={visible:t.isDatasetVisible(a),index:a,fill:es(r,a,n),chart:t,axis:s.controller.options.indexAxis,scale:s.vScale,line:r}),s.$filler=l,o.push(l);for(a=0;a<n;++a)l=o[a],l&&!1!==l.fill&&(l.fill=hs(o,a,i.propagate))},beforeDraw(t,e,i){const n="beforeDraw"===i.drawTime,o=t.getSortedVisibleDatasetMetas(),s=t.chartArea;for(let e=o.length-1;e>=0;--e){const i=o[e].$filler;i&&(i.line.updateControlPoints(s,i.axis),n&&xs(t.ctx,i,s))}},beforeDatasetsDraw(t,e,i){if("beforeDatasetsDraw"!==i.drawTime)return;const n=t.getSortedVisibleDatasetMetas();for(let e=n.length-1;e>=0;--e){const i=n[e].$filler;i&&xs(t.ctx,i,t.chartArea)}},beforeDatasetDraw(t,e,i){const n=e.meta.$filler;n&&!1!==n.fill&&"beforeDatasetDraw"===i.drawTime&&xs(t.ctx,n,t.chartArea)},defaults:{propagate:!0,drawTime:"beforeDatasetDraw"}};const _s=(t,e)=>{let{boxHeight:i=e,boxWidth:n=e}=t;return t.usePointStyle&&(i=Math.min(i,e),n=Math.min(n,e)),{boxWidth:n,boxHeight:i,itemHeight:Math.max(e,i)}};class ys extends Mn{constructor(t){super(),this._added=!1,this.legendHitBoxes=[],this._hoveredItem=null,this.doughnutMode=!1,this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this.legendItems=void 0,this.columnSizes=void 0,this.lineWidths=void 0,this.maxHeight=void 0,this.maxWidth=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.height=void 0,this.width=void 0,this._margins=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e,i){const n=this;n.maxWidth=t,n.maxHeight=e,n._margins=i,n.setDimensions(),n.buildLabels(),n.fit()}setDimensions(){const t=this;t.isHorizontal()?(t.width=t.maxWidth,t.left=t._margins.left,t.right=t.width):(t.height=t.maxHeight,t.top=t._margins.top,t.bottom=t.height)}buildLabels(){const t=this,e=t.options.labels||{};let i=Q(e.generateLabels,[t.chart],t)||[];e.filter&&(i=i.filter((i=>e.filter(i,t.chart.data)))),e.sort&&(i=i.sort(((i,n)=>e.sort(i,n,t.chart.data)))),t.options.reverse&&i.reverse(),t.legendItems=i}fit(){const t=this,{options:e,ctx:i}=t;if(!e.display)return void(t.width=t.height=0);const n=e.labels,o=Ve(n.font),s=o.size,a=t._computeTitleHeight(),{boxWidth:r,itemHeight:l}=_s(n,s);let c,h;i.font=o.string,t.isHorizontal()?(c=t.maxWidth,h=t._fitRows(a,s,r,l)+10):(h=t.maxHeight,c=t._fitCols(a,s,r,l)+10),t.width=Math.min(c,e.maxWidth||t.maxWidth),t.height=Math.min(h,e.maxHeight||t.maxHeight)}_fitRows(t,e,i,n){const o=this,{ctx:s,maxWidth:a,options:{labels:{padding:r}}}=o,l=o.legendHitBoxes=[],c=o.lineWidths=[0],h=n+r;let d=t;s.textAlign="left",s.textBaseline="middle";let u=-1,f=-h;return o.legendItems.forEach(((t,o)=>{const g=i+e/2+s.measureText(t.text).width;(0===o||c[c.length-1]+g+2*r>a)&&(d+=h,c[c.length-(o>0?0:1)]=0,f+=h,u++),l[o]={left:0,top:f,row:u,width:g,height:n},c[c.length-1]+=g+r})),d}_fitCols(t,e,i,n){const o=this,{ctx:s,maxHeight:a,options:{labels:{padding:r}}}=o,l=o.legendHitBoxes=[],c=o.columnSizes=[],h=a-t;let d=r,u=0,f=0,g=0,p=0;return o.legendItems.forEach(((t,o)=>{const a=i+e/2+s.measureText(t.text).width;o>0&&f+n+2*r>h&&(d+=u+r,c.push({width:u,height:f}),g+=u+r,p++,u=f=0),l[o]={left:g,top:f,col:p,width:a,height:n},u=Math.max(u,a),f+=n+r})),d+=u,c.push({width:u,height:f}),d}adjustHitBoxes(){const t=this;if(!t.options.display)return;const e=t._computeTitleHeight(),{legendHitBoxes:i,options:{align:n,labels:{padding:s},rtl:a}}=t,r=Ti(a,t.left,t.width);if(this.isHorizontal()){let a=0,l=o(n,t.left+s,t.right-t.lineWidths[a]);for(const c of i)a!==c.row&&(a=c.row,l=o(n,t.left+s,t.right-t.lineWidths[a])),c.top+=t.top+e+s,c.left=r.leftForLtr(r.x(l),c.width),l+=c.width+s}else{let a=0,l=o(n,t.top+e+s,t.bottom-t.columnSizes[a].height);for(const c of i)c.col!==a&&(a=c.col,l=o(n,t.top+e+s,t.bottom-t.columnSizes[a].height)),c.top=l,c.left+=t.left+s,c.left=r.leftForLtr(r.x(c.left),c.width),l+=c.height+s}}isHorizontal(){return"top"===this.options.position||"bottom"===this.options.position}draw(){const t=this;if(t.options.display){const e=t.ctx;Zt(e,t),t._draw(),Qt(e)}}_draw(){const t=this,{options:e,columnSizes:i,lineWidths:n,ctx:a}=t,{align:r,labels:l}=e,c=xt.color,h=Ti(e.rtl,t.left,t.width),d=Ve(l.font),{color:u,padding:f}=l,g=d.size,p=g/2;let m;t.drawTitle(),a.textAlign=h.textAlign("left"),a.textBaseline="middle",a.lineWidth=.5,a.font=d.string;const{boxWidth:x,boxHeight:b,itemHeight:_}=_s(l,g),y=t.isHorizontal(),v=this._computeTitleHeight();m=y?{x:o(r,t.left+f,t.right-n[0]),y:t.top+f+v,line:0}:{x:t.left+f,y:o(r,t.top+v+f,t.bottom-i[0].height),line:0},Ai(t.ctx,e.textDirection);const w=_+f;t.legendItems.forEach(((M,k)=>{a.strokeStyle=M.fontColor||u,a.fillStyle=M.fontColor||u;const S=a.measureText(M.text).width,P=h.textAlign(M.textAlign||(M.textAlign=l.textAlign)),D=x+p+S;let C=m.x,O=m.y;h.setWidth(t.width),y?k>0&&C+D+f>t.right&&(O=m.y+=w,m.line++,C=m.x=o(r,t.left+f,t.right-n[m.line])):k>0&&O+w>t.bottom&&(C=m.x=C+i[m.line].width+f,m.line++,O=m.y=o(r,t.top+v+f,t.bottom-i[m.line].height));!function(t,e,i){if(isNaN(x)||x<=0||isNaN(b)||b<0)return;a.save();const n=K(i.lineWidth,1);if(a.fillStyle=K(i.fillStyle,c),a.lineCap=K(i.lineCap,"butt"),a.lineDashOffset=K(i.lineDashOffset,0),a.lineJoin=K(i.lineJoin,"miter"),a.lineWidth=n,a.strokeStyle=K(i.strokeStyle,c),a.setLineDash(K(i.lineDash,[])),l.usePointStyle){const o={radius:x*Math.SQRT2/2,pointStyle:i.pointStyle,rotation:i.rotation,borderWidth:n},s=h.xPlus(t,x/2);Kt(a,o,s,e+p)}else{const o=e+Math.max((g-b)/2,0),s=h.leftForLtr(t,x),r=Fe(i.borderRadius);a.beginPath(),Object.values(r).some((t=>0!==t))?ne(a,{x:s,y:o,w:x,h:b,radius:r}):a.rect(s,o,x,b),a.fill(),0!==n&&a.stroke()}a.restore()}(h.x(C),O,M),C=s(P,C+x+p,y?C+D:t.right,e.rtl),function(t,e,i){ee(a,i.text,t,e+_/2,d,{strikethrough:i.hidden,textAlign:h.textAlign(i.textAlign)})}(h.x(C),O,M),y?m.x+=D+f:m.y+=w})),Li(t.ctx,e.textDirection)}drawTitle(){const t=this,e=t.options,i=e.title,s=Ve(i.font),a=Be(i.padding);if(!i.display)return;const r=Ti(e.rtl,t.left,t.width),l=t.ctx,c=i.position,h=s.size/2,d=a.top+h;let u,f=t.left,g=t.width;if(this.isHorizontal())g=Math.max(...t.lineWidths),u=t.top+d,f=o(e.align,f,t.right-g);else{const i=t.columnSizes.reduce(((t,e)=>Math.max(t,e.height)),0);u=d+o(e.align,t.top,t.bottom-i-e.labels.padding-t._computeTitleHeight())}const p=o(c,f,f+g);l.textAlign=r.textAlign(n(c)),l.textBaseline="middle",l.strokeStyle=i.color,l.fillStyle=i.color,l.font=s.string,ee(l,i.text,p,u,s)}_computeTitleHeight(){const t=this.options.title,e=Ve(t.font),i=Be(t.padding);return t.display?e.lineHeight+i.height:0}_getLegendItemAt(t,e){const i=this;let n,o,s;if(t>=i.left&&t<=i.right&&e>=i.top&&e<=i.bottom)for(s=i.legendHitBoxes,n=0;n<s.length;++n)if(o=s[n],t>=o.left&&t<=o.left+o.width&&e>=o.top&&e<=o.top+o.height)return i.legendItems[n];return null}handleEvent(t){const e=this,i=e.options;if(!function(t,e){if("mousemove"===t&&(e.onHover||e.onLeave))return!0;if(e.onClick&&("click"===t||"mouseup"===t))return!0;return!1}(t.type,i))return;const n=e._getLegendItemAt(t.x,t.y);if("mousemove"===t.type){const a=e._hoveredItem,r=(s=n,null!==(o=a)&&null!==s&&o.datasetIndex===s.datasetIndex&&o.index===s.index);a&&!r&&Q(i.onLeave,[t,a,e],e),e._hoveredItem=n,n&&!r&&Q(i.onHover,[t,n,e],e)}else n&&Q(i.onClick,[t,n,e],e);var o,s}}var vs={id:"legend",_element:ys,start(t,e,i){const n=t.legend=new ys({ctx:t.ctx,options:i,chart:t});ti.configure(t,n,i),ti.addBox(t,n)},stop(t){ti.removeBox(t,t.legend),delete t.legend},beforeUpdate(t,e,i){const n=t.legend;ti.configure(t,n,i),n.options=i},afterUpdate(t){const e=t.legend;e.buildLabels(),e.adjustHitBoxes()},afterEvent(t,e){e.replay||t.legend.handleEvent(e.event)},defaults:{display:!0,position:"top",align:"center",fullSize:!0,reverse:!1,weight:1e3,onClick(t,e,i){const n=e.datasetIndex,o=i.chart;o.isDatasetVisible(n)?(o.hide(n),e.hidden=!0):(o.show(n),e.hidden=!1)},onHover:null,onLeave:null,labels:{color:t=>t.chart.options.color,boxWidth:40,padding:10,generateLabels(t){const e=t.data.datasets,{labels:{usePointStyle:i,pointStyle:n,textAlign:o,color:s}}=t.legend.options;return t._getSortedDatasetMetas().map((t=>{const a=t.controller.getStyle(i?0:void 0),r=Be(a.borderWidth);return{text:e[t.index].label,fillStyle:a.backgroundColor,fontColor:s,hidden:!t.visible,lineCap:a.borderCapStyle,lineDash:a.borderDash,lineDashOffset:a.borderDashOffset,lineJoin:a.borderJoinStyle,lineWidth:(r.width+r.height)/4,strokeStyle:a.borderColor,pointStyle:n||a.pointStyle,rotation:a.rotation,textAlign:o||a.textAlign,borderRadius:0,datasetIndex:t.index}}),this)}},title:{color:t=>t.chart.options.color,display:!1,position:"center",text:""}},descriptors:{_scriptable:t=>!t.startsWith("on"),labels:{_scriptable:t=>!["generateLabels","filter","sort"].includes(t)}}};class ws extends Mn{constructor(t){super(),this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this._padding=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e){const i=this,n=i.options;if(i.left=0,i.top=0,!n.display)return void(i.width=i.height=i.right=i.bottom=0);i.width=i.right=t,i.height=i.bottom=e;const o=Y(n.text)?n.text.length:1;i._padding=Be(n.padding);const s=o*Ve(n.font).lineHeight+i._padding.height;i.isHorizontal()?i.height=s:i.width=s}isHorizontal(){const t=this.options.position;return"top"===t||"bottom"===t}_drawArgs(t){const{top:e,left:i,bottom:n,right:s,options:a}=this,r=a.align;let l,c,h,d=0;return this.isHorizontal()?(c=o(r,i,s),h=e+t,l=s-i):("left"===a.position?(c=i+t,h=o(r,n,e),d=-.5*bt):(c=s-t,h=o(r,e,n),d=.5*bt),l=n-e),{titleX:c,titleY:h,maxWidth:l,rotation:d}}draw(){const t=this,e=t.ctx,i=t.options;if(!i.display)return;const o=Ve(i.font),s=o.lineHeight/2+t._padding.top,{titleX:a,titleY:r,maxWidth:l,rotation:c}=t._drawArgs(s);ee(e,i.text,0,0,o,{color:i.color,maxWidth:l,rotation:c,textAlign:n(i.align),textBaseline:"middle",translation:[a,r]})}}var Ms={id:"title",_element:ws,start(t,e,i){!function(t,e){const i=new ws({ctx:t.ctx,options:e,chart:t});ti.configure(t,i,e),ti.addBox(t,i),t.titleBlock=i}(t,i)},stop(t){const e=t.titleBlock;ti.removeBox(t,e),delete t.titleBlock},beforeUpdate(t,e,i){const n=t.titleBlock;ti.configure(t,n,i),n.options=i},defaults:{align:"center",display:!1,font:{weight:"bold"},fullSize:!0,padding:10,position:"top",text:"",weight:2e3},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const ks=new WeakMap;var Ss={id:"subtitle",start(t,e,i){const n=new ws({ctx:t.ctx,options:i,chart:t});ti.configure(t,n,i),ti.addBox(t,n),ks.set(t,n)},stop(t){ti.removeBox(t,ks.get(t)),ks.delete(t)},beforeUpdate(t,e,i){const n=ks.get(t);ti.configure(t,n,i),n.options=i},defaults:{align:"center",display:!1,font:{weight:"normal"},fullSize:!0,padding:0,position:"top",text:"",weight:1500},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const Ps={average(t){if(!t.length)return!1;let e,i,n=0,o=0,s=0;for(e=0,i=t.length;e<i;++e){const i=t[e].element;if(i&&i.hasValue()){const t=i.tooltipPosition();n+=t.x,o+=t.y,++s}}return{x:n/s,y:o/s}},nearest(t,e){if(!t.length)return!1;let i,n,o,s=e.x,a=e.y,r=Number.POSITIVE_INFINITY;for(i=0,n=t.length;i<n;++i){const n=t[i].element;if(n&&n.hasValue()){const t=Bt(e,n.getCenterPoint());t<r&&(r=t,o=n)}}if(o){const t=o.tooltipPosition();s=t.x,a=t.y}return{x:s,y:a}}};function Ds(t,e){return e&&(Y(e)?Array.prototype.push.apply(t,e):t.push(e)),t}function Cs(t){return("string"==typeof t||t instanceof String)&&t.indexOf("\n")>-1?t.split("\n"):t}function Os(t,e){const{element:i,datasetIndex:n,index:o}=e,s=t.getDatasetMeta(n).controller,{label:a,value:r}=s.getLabelAndValue(o);return{chart:t,label:a,parsed:s.getParsed(o),raw:t.data.datasets[n].data[o],formattedValue:r,dataset:s.getDataset(),dataIndex:o,datasetIndex:n,element:i}}function Ts(t,e){const i=t._chart.ctx,{body:n,footer:o,title:s}=t,{boxWidth:a,boxHeight:r}=e,l=Ve(e.bodyFont),c=Ve(e.titleFont),h=Ve(e.footerFont),d=s.length,u=o.length,f=n.length,g=Be(e.padding);let p=g.height,m=0,x=n.reduce(((t,e)=>t+e.before.length+e.lines.length+e.after.length),0);if(x+=t.beforeBody.length+t.afterBody.length,d&&(p+=d*c.lineHeight+(d-1)*e.titleSpacing+e.titleMarginBottom),x){p+=f*(e.displayColors?Math.max(r,l.lineHeight):l.lineHeight)+(x-f)*l.lineHeight+(x-1)*e.bodySpacing}u&&(p+=e.footerMarginTop+u*h.lineHeight+(u-1)*e.footerSpacing);let b=0;const _=function(t){m=Math.max(m,i.measureText(t).width+b)};return i.save(),i.font=c.string,J(t.title,_),i.font=l.string,J(t.beforeBody.concat(t.afterBody),_),b=e.displayColors?a+2:0,J(n,(t=>{J(t.before,_),J(t.lines,_),J(t.after,_)})),b=0,i.font=h.string,J(t.footer,_),i.restore(),m+=g.width,{width:m,height:p}}function As(t,e,i,n){const{x:o,width:s}=i,{width:a,chartArea:{left:r,right:l}}=t;let c="center";return"center"===n?c=o<=(r+l)/2?"left":"right":o<=s/2?c="left":o>=a-s/2&&(c="right"),function(t,e,i,n){const{x:o,width:s}=n,a=i.caretSize+i.caretPadding;return"left"===t&&o+s+a>e.width||"right"===t&&o-s-a<0||void 0}(c,t,e,i)&&(c="center"),c}function Ls(t,e,i){const n=e.yAlign||function(t,e){const{y:i,height:n}=e;return i<n/2?"top":i>t.height-n/2?"bottom":"center"}(t,i);return{xAlign:e.xAlign||As(t,e,i,n),yAlign:n}}function Rs(t,e,i,n){const{caretSize:o,caretPadding:s,cornerRadius:a}=t,{xAlign:r,yAlign:l}=i,c=o+s,h=a+s;let d=function(t,e){let{x:i,width:n}=t;return"right"===e?i-=n:"center"===e&&(i-=n/2),i}(e,r);const u=function(t,e,i){let{y:n,height:o}=t;return"top"===e?n+=i:n-="bottom"===e?o+i:o/2,n}(e,l,c);return"center"===l?"left"===r?d+=c:"right"===r&&(d-=c):"left"===r?d-=h:"right"===r&&(d+=h),{x:Ht(d,0,n.width-e.width),y:Ht(u,0,n.height-e.height)}}function Es(t,e,i){const n=Be(i.padding);return"center"===e?t.x+t.width/2:"right"===e?t.x+t.width-n.right:t.x+n.left}function Is(t){return Ds([],Cs(t))}function zs(t,e){const i=e&&e.dataset&&e.dataset.tooltip&&e.dataset.tooltip.callbacks;return i?t.override(i):t}class Fs extends Mn{constructor(t){super(),this.opacity=0,this._active=[],this._chart=t._chart,this._eventPosition=void 0,this._size=void 0,this._cachedAnimations=void 0,this._tooltipItems=[],this.$animations=void 0,this.$context=void 0,this.options=t.options,this.dataPoints=void 0,this.title=void 0,this.beforeBody=void 0,this.body=void 0,this.afterBody=void 0,this.footer=void 0,this.xAlign=void 0,this.yAlign=void 0,this.x=void 0,this.y=void 0,this.height=void 0,this.width=void 0,this.caretX=void 0,this.caretY=void 0,this.labelColors=void 0,this.labelPointStyles=void 0,this.labelTextColors=void 0}initialize(t){this.options=t,this._cachedAnimations=void 0,this.$context=void 0}_resolveAnimations(){const t=this,e=t._cachedAnimations;if(e)return e;const i=t._chart,n=t.options.setContext(t.getContext()),o=n.enabled&&i.options.animation&&n.animations,s=new hn(t._chart,o);return o._cacheable&&(t._cachedAnimations=Object.freeze(s)),s}getContext(){const t=this;return t.$context||(t.$context=(e=t._chart.getContext(),i=t,n=t._tooltipItems,Object.assign(Object.create(e),{tooltip:i,tooltipItems:n,type:"tooltip"})));var e,i,n}getTitle(t,e){const i=this,{callbacks:n}=e,o=n.beforeTitle.apply(i,[t]),s=n.title.apply(i,[t]),a=n.afterTitle.apply(i,[t]);let r=[];return r=Ds(r,Cs(o)),r=Ds(r,Cs(s)),r=Ds(r,Cs(a)),r}getBeforeBody(t,e){return Is(e.callbacks.beforeBody.apply(this,[t]))}getBody(t,e){const i=this,{callbacks:n}=e,o=[];return J(t,(t=>{const e={before:[],lines:[],after:[]},s=zs(n,t);Ds(e.before,Cs(s.beforeLabel.call(i,t))),Ds(e.lines,s.label.call(i,t)),Ds(e.after,Cs(s.afterLabel.call(i,t))),o.push(e)})),o}getAfterBody(t,e){return Is(e.callbacks.afterBody.apply(this,[t]))}getFooter(t,e){const i=this,{callbacks:n}=e,o=n.beforeFooter.apply(i,[t]),s=n.footer.apply(i,[t]),a=n.afterFooter.apply(i,[t]);let r=[];return r=Ds(r,Cs(o)),r=Ds(r,Cs(s)),r=Ds(r,Cs(a)),r}_createItems(t){const e=this,i=e._active,n=e._chart.data,o=[],s=[],a=[];let r,l,c=[];for(r=0,l=i.length;r<l;++r)c.push(Os(e._chart,i[r]));return t.filter&&(c=c.filter(((e,i,o)=>t.filter(e,i,o,n)))),t.itemSort&&(c=c.sort(((e,i)=>t.itemSort(e,i,n)))),J(c,(i=>{const n=zs(t.callbacks,i);o.push(n.labelColor.call(e,i)),s.push(n.labelPointStyle.call(e,i)),a.push(n.labelTextColor.call(e,i))})),e.labelColors=o,e.labelPointStyles=s,e.labelTextColors=a,e.dataPoints=c,c}update(t,e){const i=this,n=i.options.setContext(i.getContext()),o=i._active;let s,a=[];if(o.length){const t=Ps[n.position].call(i,o,i._eventPosition);a=i._createItems(n),i.title=i.getTitle(a,n),i.beforeBody=i.getBeforeBody(a,n),i.body=i.getBody(a,n),i.afterBody=i.getAfterBody(a,n),i.footer=i.getFooter(a,n);const e=i._size=Ts(i,n),r=Object.assign({},t,e),l=Ls(i._chart,n,r),c=Rs(n,r,l,i._chart);i.xAlign=l.xAlign,i.yAlign=l.yAlign,s={opacity:1,x:c.x,y:c.y,width:e.width,height:e.height,caretX:t.x,caretY:t.y}}else 0!==i.opacity&&(s={opacity:0});i._tooltipItems=a,i.$context=void 0,s&&i._resolveAnimations().update(i,s),t&&n.external&&n.external.call(i,{chart:i._chart,tooltip:i,replay:e})}drawCaret(t,e,i,n){const o=this.getCaretPosition(t,i,n);e.lineTo(o.x1,o.y1),e.lineTo(o.x2,o.y2),e.lineTo(o.x3,o.y3)}getCaretPosition(t,e,i){const{xAlign:n,yAlign:o}=this,{cornerRadius:s,caretSize:a}=i,{x:r,y:l}=t,{width:c,height:h}=e;let d,u,f,g,p,m;return"center"===o?(p=l+h/2,"left"===n?(d=r,u=d-a,g=p+a,m=p-a):(d=r+c,u=d+a,g=p-a,m=p+a),f=d):(u="left"===n?r+s+a:"right"===n?r+c-s-a:this.caretX,"top"===o?(g=l,p=g-a,d=u-a,f=u+a):(g=l+h,p=g+a,d=u+a,f=u-a),m=g),{x1:d,x2:u,x3:f,y1:g,y2:p,y3:m}}drawTitle(t,e,i){const n=this,o=n.title,s=o.length;let a,r,l;if(s){const c=Ti(i.rtl,n.x,n.width);for(t.x=Es(n,i.titleAlign,i),e.textAlign=c.textAlign(i.titleAlign),e.textBaseline="middle",a=Ve(i.titleFont),r=i.titleSpacing,e.fillStyle=i.titleColor,e.font=a.string,l=0;l<s;++l)e.fillText(o[l],c.x(t.x),t.y+a.lineHeight/2),t.y+=a.lineHeight+r,l+1===s&&(t.y+=i.titleMarginBottom-r)}}_drawColorBox(t,e,i,n,o){const s=this,a=s.labelColors[i],r=s.labelPointStyles[i],{boxHeight:l,boxWidth:c}=o,h=Ve(o.bodyFont),d=Es(s,"left",o),u=n.x(d),f=l<h.lineHeight?(h.lineHeight-l)/2:0,g=e.y+f;if(o.usePointStyle){const e={radius:Math.min(c,l)/2,pointStyle:r.pointStyle,rotation:r.rotation,borderWidth:1},i=n.leftForLtr(u,c)+c/2,s=g+l/2;t.strokeStyle=o.multiKeyBackground,t.fillStyle=o.multiKeyBackground,Kt(t,e,i,s),t.strokeStyle=a.borderColor,t.fillStyle=a.backgroundColor,Kt(t,e,i,s)}else{t.lineWidth=a.borderWidth||1,t.strokeStyle=a.borderColor,t.setLineDash(a.borderDash||[]),t.lineDashOffset=a.borderDashOffset||0;const e=n.leftForLtr(u,c),i=n.leftForLtr(n.xPlus(u,1),c-2),s=Fe(a.borderRadius);Object.values(s).some((t=>0!==t))?(t.beginPath(),t.fillStyle=o.multiKeyBackground,ne(t,{x:e,y:g,w:c,h:l,radius:s}),t.fill(),t.stroke(),t.fillStyle=a.backgroundColor,t.beginPath(),ne(t,{x:i,y:g+1,w:c-2,h:l-2,radius:s}),t.fill()):(t.fillStyle=o.multiKeyBackground,t.fillRect(e,g,c,l),t.strokeRect(e,g,c,l),t.fillStyle=a.backgroundColor,t.fillRect(i,g+1,c-2,l-2))}t.fillStyle=s.labelTextColors[i]}drawBody(t,e,i){const n=this,{body:o}=n,{bodySpacing:s,bodyAlign:a,displayColors:r,boxHeight:l,boxWidth:c}=i,h=Ve(i.bodyFont);let d=h.lineHeight,u=0;const f=Ti(i.rtl,n.x,n.width),g=function(i){e.fillText(i,f.x(t.x+u),t.y+d/2),t.y+=d+s},p=f.textAlign(a);let m,x,b,_,y,v,w;for(e.textAlign=a,e.textBaseline="middle",e.font=h.string,t.x=Es(n,p,i),e.fillStyle=i.bodyColor,J(n.beforeBody,g),u=r&&"right"!==p?"center"===a?c/2+1:c+2:0,_=0,v=o.length;_<v;++_){for(m=o[_],x=n.labelTextColors[_],e.fillStyle=x,J(m.before,g),b=m.lines,r&&b.length&&(n._drawColorBox(e,t,_,f,i),d=Math.max(h.lineHeight,l)),y=0,w=b.length;y<w;++y)g(b[y]),d=h.lineHeight;J(m.after,g)}u=0,d=h.lineHeight,J(n.afterBody,g),t.y-=s}drawFooter(t,e,i){const n=this,o=n.footer,s=o.length;let a,r;if(s){const l=Ti(i.rtl,n.x,n.width);for(t.x=Es(n,i.footerAlign,i),t.y+=i.footerMarginTop,e.textAlign=l.textAlign(i.footerAlign),e.textBaseline="middle",a=Ve(i.footerFont),e.fillStyle=i.footerColor,e.font=a.string,r=0;r<s;++r)e.fillText(o[r],l.x(t.x),t.y+a.lineHeight/2),t.y+=a.lineHeight+i.footerSpacing}}drawBackground(t,e,i,n){const{xAlign:o,yAlign:s}=this,{x:a,y:r}=t,{width:l,height:c}=i,h=n.cornerRadius;e.fillStyle=n.backgroundColor,e.strokeStyle=n.borderColor,e.lineWidth=n.borderWidth,e.beginPath(),e.moveTo(a+h,r),"top"===s&&this.drawCaret(t,e,i,n),e.lineTo(a+l-h,r),e.quadraticCurveTo(a+l,r,a+l,r+h),"center"===s&&"right"===o&&this.drawCaret(t,e,i,n),e.lineTo(a+l,r+c-h),e.quadraticCurveTo(a+l,r+c,a+l-h,r+c),"bottom"===s&&this.drawCaret(t,e,i,n),e.lineTo(a+h,r+c),e.quadraticCurveTo(a,r+c,a,r+c-h),"center"===s&&"left"===o&&this.drawCaret(t,e,i,n),e.lineTo(a,r+h),e.quadraticCurveTo(a,r,a+h,r),e.closePath(),e.fill(),n.borderWidth>0&&e.stroke()}_updateAnimationTarget(t){const e=this,i=e._chart,n=e.$animations,o=n&&n.x,s=n&&n.y;if(o||s){const n=Ps[t.position].call(e,e._active,e._eventPosition);if(!n)return;const a=e._size=Ts(e,t),r=Object.assign({},n,e._size),l=Ls(i,t,r),c=Rs(t,r,l,i);o._to===c.x&&s._to===c.y||(e.xAlign=l.xAlign,e.yAlign=l.yAlign,e.width=a.width,e.height=a.height,e.caretX=n.x,e.caretY=n.y,e._resolveAnimations().update(e,c))}}draw(t){const e=this,i=e.options.setContext(e.getContext());let n=e.opacity;if(!n)return;e._updateAnimationTarget(i);const o={width:e.width,height:e.height},s={x:e.x,y:e.y};n=Math.abs(n)<.001?0:n;const a=Be(i.padding),r=e.title.length||e.beforeBody.length||e.body.length||e.afterBody.length||e.footer.length;i.enabled&&r&&(t.save(),t.globalAlpha=n,e.drawBackground(s,t,o,i),Ai(t,i.textDirection),s.y+=a.top,e.drawTitle(s,t,i),e.drawBody(s,t,i),e.drawFooter(s,t,i),Li(t,i.textDirection),t.restore())}getActiveElements(){return this._active||[]}setActiveElements(t,e){const i=this,n=i._active,o=t.map((({datasetIndex:t,index:e})=>{const n=i._chart.getDatasetMeta(t);if(!n)throw new Error("Cannot find a dataset at index "+t);return{datasetIndex:t,element:n.data[e],index:e}})),s=!tt(n,o),a=i._positionChanged(o,e);(s||a)&&(i._active=o,i._eventPosition=e,i.update(!0))}handleEvent(t,e){const i=this,n=i.options,o=i._active||[];let s=!1,a=[];"mouseout"!==t.type&&(a=i._chart.getElementsAtEventForMode(t,n.mode,n,e),n.reverse&&a.reverse());const r=i._positionChanged(a,t);return s=e||!tt(a,o)||r,s&&(i._active=a,(n.enabled||n.external)&&(i._eventPosition={x:t.x,y:t.y},i.update(!0,e))),s}_positionChanged(t,e){const{caretX:i,caretY:n,options:o}=this,s=Ps[o.position].call(this,t,e);return!1!==s&&(i!==s.x||n!==s.y)}}Fs.positioners=Ps;var Bs={id:"tooltip",_element:Fs,positioners:Ps,afterInit(t,e,i){i&&(t.tooltip=new Fs({_chart:t,options:i}))},beforeUpdate(t,e,i){t.tooltip&&t.tooltip.initialize(i)},reset(t,e,i){t.tooltip&&t.tooltip.initialize(i)},afterDraw(t){const e=t.tooltip,i={tooltip:e};!1!==t.notifyPlugins("beforeTooltipDraw",i)&&(e&&e.draw(t.ctx),t.notifyPlugins("afterTooltipDraw",i))},afterEvent(t,e){if(t.tooltip){const i=e.replay;t.tooltip.handleEvent(e.event,i)&&(e.changed=!0)}},defaults:{enabled:!0,external:null,position:"average",backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",titleFont:{weight:"bold"},titleSpacing:2,titleMarginBottom:6,titleAlign:"left",bodyColor:"#fff",bodySpacing:2,bodyFont:{},bodyAlign:"left",footerColor:"#fff",footerSpacing:2,footerMarginTop:6,footerFont:{weight:"bold"},footerAlign:"left",padding:6,caretPadding:2,caretSize:5,cornerRadius:6,boxHeight:(t,e)=>e.bodyFont.size,boxWidth:(t,e)=>e.bodyFont.size,multiKeyBackground:"#fff",displayColors:!0,borderColor:"rgba(0,0,0,0)",borderWidth:0,animation:{duration:400,easing:"easeOutQuart"},animations:{numbers:{type:"number",properties:["x","y","width","height","caretX","caretY"]},opacity:{easing:"linear",duration:200}},callbacks:{beforeTitle:H,title(t){if(t.length>0){const e=t[0],i=e.chart.data.labels,n=i?i.length:0;if(this&&this.options&&"dataset"===this.options.mode)return e.dataset.label||"";if(e.label)return e.label;if(n>0&&e.dataIndex<n)return i[e.dataIndex]}return""},afterTitle:H,beforeBody:H,beforeLabel:H,label(t){if(this&&this.options&&"dataset"===this.options.mode)return t.label+": "+t.formattedValue||t.formattedValue;let e=t.dataset.label||"";e&&(e+=": ");const i=t.formattedValue;return $(i)||(e+=i),e},labelColor(t){const e=t.chart.getDatasetMeta(t.datasetIndex).controller.getStyle(t.dataIndex);return{borderColor:e.borderColor,backgroundColor:e.backgroundColor,borderWidth:e.borderWidth,borderDash:e.borderDash,borderDashOffset:e.borderDashOffset,borderRadius:0}},labelTextColor(){return this.options.bodyColor},labelPointStyle(t){const e=t.chart.getDatasetMeta(t.datasetIndex).controller.getStyle(t.dataIndex);return{pointStyle:e.pointStyle,rotation:e.rotation}},afterLabel:H,afterBody:H,beforeFooter:H,footer:H,afterFooter:H}},defaultRoutes:{bodyFont:"font",footerFont:"font",titleFont:"font"},descriptors:{_scriptable:t=>"filter"!==t&&"itemSort"!==t&&"external"!==t,_indexable:!1,callbacks:{_scriptable:!1,_indexable:!1},animation:{_fallback:!1},animations:{_fallback:"animation"}},additionalOptionScopes:["interaction"]},Vs=Object.freeze({__proto__:null,Decimation:ts,Filler:bs,Legend:vs,SubTitle:Ss,Title:Ms,Tooltip:Bs});function Ws(t,e,i){const n=t.indexOf(e);if(-1===n)return((t,e,i)=>"string"==typeof e?t.push(e)-1:isNaN(e)?null:i)(t,e,i);return n!==t.lastIndexOf(e)?i:n}class Ns extends En{constructor(t){super(t),this._startValue=void 0,this._valueRange=0}parse(t,e){if($(t))return null;const i=this.getLabels();return((t,e)=>null===t?null:Ht(Math.round(t),0,e))(e=isFinite(e)&&i[e]===t?e:Ws(i,t,K(e,t)),i.length-1)}determineDataLimits(){const t=this,{minDefined:e,maxDefined:i}=t.getUserBounds();let{min:n,max:o}=t.getMinMax(!0);"ticks"===t.options.bounds&&(e||(n=0),i||(o=t.getLabels().length-1)),t.min=n,t.max=o}buildTicks(){const t=this,e=t.min,i=t.max,n=t.options.offset,o=[];let s=t.getLabels();s=0===e&&i===s.length-1?s:s.slice(e,i+1),t._valueRange=Math.max(s.length-(n?0:1),1),t._startValue=t.min-(n?.5:0);for(let t=e;t<=i;t++)o.push({value:t});return o}getLabelForValue(t){const e=this.getLabels();return t>=0&&t<e.length?e[t]:t}configure(){const t=this;super.configure(),t.isHorizontal()||(t._reversePixels=!t._reversePixels)}getPixelForValue(t){const e=this;return"number"!=typeof t&&(t=e.parse(t)),null===t?NaN:e.getPixelForDecimal((t-e._startValue)/e._valueRange)}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getValueForPixel(t){const e=this;return Math.round(e._startValue+e.getDecimalForPixel(t)*e._valueRange)}getBasePixel(){return this.bottom}}function Hs(t,e,{horizontal:i,minRotation:n}){const o=Et(n),s=(i?Math.sin(o):Math.cos(o))||.001,a=.75*e*(""+t).length;return Math.min(e/s,a)}Ns.id="category",Ns.defaults={ticks:{callback:Ns.prototype.getLabelForValue}};class js extends En{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._endValue=void 0,this._valueRange=0}parse(t,e){return $(t)||("number"==typeof t||t instanceof Number)&&!isFinite(+t)?null:+t}handleTickRangeOptions(){const t=this,{beginAtZero:e}=t.options,{minDefined:i,maxDefined:n}=t.getUserBounds();let{min:o,max:s}=t;const a=t=>o=i?o:t,r=t=>s=n?s:t;if(e){const t=Dt(o),e=Dt(s);t<0&&e<0?r(0):t>0&&e>0&&a(0)}if(o===s){let t=1;(s>=Number.MAX_SAFE_INTEGER||o<=Number.MIN_SAFE_INTEGER)&&(t=Math.abs(.05*s)),r(s+t),e||a(o-t)}t.min=o,t.max=s}getTickLimit(){const t=this,e=t.options.ticks;let i,{maxTicksLimit:n,stepSize:o}=e;return o?i=Math.ceil(t.max/o)-Math.floor(t.min/o)+1:(i=t.computeTickLimit(),n=n||11),n&&(i=Math.min(n,i)),i}computeTickLimit(){return Number.POSITIVE_INFINITY}buildTicks(){const t=this,e=t.options,i=e.ticks;let n=t.getTickLimit();n=Math.max(2,n);const o=function(t,e){const i=[],{bounds:n,step:o,min:s,max:a,precision:r,count:l,maxTicks:c,maxDigits:h,includeBounds:d}=t,u=o||1,f=c-1,{min:g,max:p}=e,m=!$(s),x=!$(a),b=!$(l),_=(p-g)/(h+1);let y,v,w,M,k=Ct((p-g)/f/u)*u;if(k<1e-14&&!m&&!x)return[{value:g},{value:p}];M=Math.ceil(p/k)-Math.floor(g/k),M>f&&(k=Ct(M*k/f/u)*u),$(r)||(y=Math.pow(10,r),k=Math.ceil(k*y)/y),"ticks"===n?(v=Math.floor(g/k)*k,w=Math.ceil(p/k)*k):(v=g,w=p),m&&x&&o&&Lt((a-s)/o,k/1e3)?(M=Math.round(Math.min((a-s)/k,c)),k=(a-s)/M,v=s,w=a):b?(v=m?s:v,w=x?a:w,M=l-1,k=(w-v)/M):(M=(w-v)/k,M=At(M,Math.round(M),k/1e3)?Math.round(M):Math.ceil(M));const S=Math.max(zt(k),zt(v));y=Math.pow(10,$(r)?S:r),v=Math.round(v*y)/y,w=Math.round(w*y)/y;let P=0;for(m&&(d&&v!==s?(i.push({value:s}),v<s&&P++,At(Math.round((v+P*k)*y)/y,s,Hs(s,_,t))&&P++):v<s&&P++);P<M;++P)i.push({value:Math.round((v+P*k)*y)/y});return x&&d&&w!==a?At(i[i.length-1].value,a,Hs(a,_,t))?i[i.length-1].value=a:i.push({value:a}):x&&w!==a||i.push({value:w}),i}({maxTicks:n,bounds:e.bounds,min:e.min,max:e.max,precision:i.precision,step:i.stepSize,count:i.count,maxDigits:t._maxDigits(),horizontal:t.isHorizontal(),minRotation:i.minRotation||0,includeBounds:!1!==i.includeBounds},t._range||t);return"ticks"===e.bounds&&Rt(o,t,"value"),e.reverse?(o.reverse(),t.start=t.max,t.end=t.min):(t.start=t.min,t.end=t.max),o}configure(){const t=this,e=t.ticks;let i=t.min,n=t.max;if(super.configure(),t.options.offset&&e.length){const t=(n-i)/Math.max(e.length-1,1)/2;i-=t,n+=t}t._startValue=i,t._endValue=n,t._valueRange=n-i}getLabelForValue(t){return Oi(t,this.chart.options.locale)}}class $s extends js{determineDataLimits(){const t=this,{min:e,max:i}=t.getMinMax(!0);t.min=X(e)?e:0,t.max=X(i)?i:1,t.handleTickRangeOptions()}computeTickLimit(){const t=this,e=t.isHorizontal(),i=e?t.width:t.height,n=Et(t.options.ticks.minRotation),o=(e?Math.sin(n):Math.cos(n))||.001,s=t._resolveTickFontOptions(0);return Math.ceil(i/Math.min(40,s.lineHeight/o))}getPixelForValue(t){return null===t?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getValueForPixel(t){return this._startValue+this.getDecimalForPixel(t)*this._valueRange}}function Ys(t){return 1===t/Math.pow(10,Math.floor(Pt(t)))}$s.id="linear",$s.defaults={ticks:{callback:Sn.formatters.numeric}};class Us extends En{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._valueRange=0}parse(t,e){const i=js.prototype.parse.apply(this,[t,e]);if(0!==i)return X(i)&&i>0?i:null;this._zero=!0}determineDataLimits(){const t=this,{min:e,max:i}=t.getMinMax(!0);t.min=X(e)?Math.max(0,e):null,t.max=X(i)?Math.max(0,i):null,t.options.beginAtZero&&(t._zero=!0),t.handleTickRangeOptions()}handleTickRangeOptions(){const t=this,{minDefined:e,maxDefined:i}=t.getUserBounds();let n=t.min,o=t.max;const s=t=>n=e?n:t,a=t=>o=i?o:t,r=(t,e)=>Math.pow(10,Math.floor(Pt(t))+e);n===o&&(n<=0?(s(1),a(10)):(s(r(n,-1)),a(r(o,1)))),n<=0&&s(r(o,-1)),o<=0&&a(r(n,1)),t._zero&&t.min!==t._suggestedMin&&n===r(t.min,0)&&s(r(n,-1)),t.min=n,t.max=o}buildTicks(){const t=this,e=t.options,i=function(t,e){const i=Math.floor(Pt(e.max)),n=Math.ceil(e.max/Math.pow(10,i)),o=[];let s=q(t.min,Math.pow(10,Math.floor(Pt(e.min)))),a=Math.floor(Pt(s)),r=Math.floor(s/Math.pow(10,a)),l=a<0?Math.pow(10,Math.abs(a)):1;do{o.push({value:s,major:Ys(s)}),++r,10===r&&(r=1,++a,l=a>=0?1:l),s=Math.round(r*Math.pow(10,a)*l)/l}while(a<i||a===i&&r<n);const c=q(t.max,s);return o.push({value:c,major:Ys(s)}),o}({min:t._userMin,max:t._userMax},t);return"ticks"===e.bounds&&Rt(i,t,"value"),e.reverse?(i.reverse(),t.start=t.max,t.end=t.min):(t.start=t.min,t.end=t.max),i}getLabelForValue(t){return void 0===t?"0":Oi(t,this.chart.options.locale)}configure(){const t=this,e=t.min;super.configure(),t._startValue=Pt(e),t._valueRange=Pt(t.max)-Pt(e)}getPixelForValue(t){const e=this;return void 0!==t&&0!==t||(t=e.min),null===t||isNaN(t)?NaN:e.getPixelForDecimal(t===e.min?0:(Pt(t)-e._startValue)/e._valueRange)}getValueForPixel(t){const e=this,i=e.getDecimalForPixel(t);return Math.pow(10,e._startValue+i*e._valueRange)}}function Xs(t){const e=t.ticks;if(e.display&&t.display){const t=Be(e.backdropPadding);return K(e.font&&e.font.size,xt.font.size)+t.height}return 0}function qs(t,e,i,n,o){return t===n||t===o?{start:e-i/2,end:e+i/2}:t<n||t>o?{start:e-i,end:e}:{start:e,end:e+i}}function Ks(t){const e={l:0,r:t.width,t:0,b:t.height-t.paddingTop},i={},n=[],o=[],s=t.getLabels().length;for(let c=0;c<s;c++){const s=t.options.pointLabels.setContext(t.getPointLabelContext(c));o[c]=s.padding;const h=t.getPointPosition(c,t.drawingArea+o[c]),d=Ve(s.font),u=(a=t.ctx,r=d,l=Y(l=t._pointLabels[c])?l:[l],{w:Ut(a,r.string,l),h:l.length*r.lineHeight});n[c]=u;const f=t.getIndexAngle(c),g=It(f),p=qs(g,h.x,u.w,0,180),m=qs(g,h.y,u.h,90,270);p.start<e.l&&(e.l=p.start,i.l=f),p.end>e.r&&(e.r=p.end,i.r=f),m.start<e.t&&(e.t=m.start,i.t=f),m.end>e.b&&(e.b=m.end,i.b=f)}var a,r,l;t._setReductions(t.drawingArea,e,i),t._pointLabelItems=function(t,e,i){const n=[],o=t.getLabels().length,s=t.options,a=Xs(s),r=t.getDistanceFromCenterForValue(s.ticks.reverse?t.min:t.max);for(let s=0;s<o;s++){const o=0===s?a/2:0,l=t.getPointPosition(s,r+o+i[s]),c=It(t.getIndexAngle(s)),h=e[s],d=Qs(l.y,h.h,c),u=Gs(c),f=Zs(l.x,h.w,u);n.push({x:l.x,y:d,textAlign:u,left:f,top:d,right:f+h.w,bottom:d+h.h})}return n}(t,n,o)}function Gs(t){return 0===t||180===t?"center":t<180?"left":"right"}function Zs(t,e,i){return"right"===i?t-=e:"center"===i&&(t-=e/2),t}function Qs(t,e,i){return 90===i||270===i?t-=e/2:(i>270||i<90)&&(t-=e),t}function Js(t,e,i,n){const{ctx:o}=t;if(i)o.arc(t.xCenter,t.yCenter,e,0,_t);else{let i=t.getPointPosition(0,e);o.moveTo(i.x,i.y);for(let s=1;s<n;s++)i=t.getPointPosition(s,e),o.lineTo(i.x,i.y)}}function ta(t){return Tt(t)?t:0}Us.id="logarithmic",Us.defaults={ticks:{callback:Sn.formatters.logarithmic,major:{enabled:!0}}};class ea extends js{constructor(t){super(t),this.xCenter=void 0,this.yCenter=void 0,this.drawingArea=void 0,this._pointLabels=[],this._pointLabelItems=[]}setDimensions(){const t=this;t.width=t.maxWidth,t.height=t.maxHeight,t.paddingTop=Xs(t.options)/2,t.xCenter=Math.floor(t.width/2),t.yCenter=Math.floor((t.height-t.paddingTop)/2),t.drawingArea=Math.min(t.height-t.paddingTop,t.width)/2}determineDataLimits(){const t=this,{min:e,max:i}=t.getMinMax(!1);t.min=X(e)&&!isNaN(e)?e:0,t.max=X(i)&&!isNaN(i)?i:0,t.handleTickRangeOptions()}computeTickLimit(){return Math.ceil(this.drawingArea/Xs(this.options))}generateTickLabels(t){const e=this;js.prototype.generateTickLabels.call(e,t),e._pointLabels=e.getLabels().map(((t,i)=>{const n=Q(e.options.pointLabels.callback,[t,i],e);return n||0===n?n:""}))}fit(){const t=this,e=t.options;e.display&&e.pointLabels.display?Ks(t):t.setCenterPoint(0,0,0,0)}_setReductions(t,e,i){const n=this;let o=e.l/Math.sin(i.l),s=Math.max(e.r-n.width,0)/Math.sin(i.r),a=-e.t/Math.cos(i.t),r=-Math.max(e.b-(n.height-n.paddingTop),0)/Math.cos(i.b);o=ta(o),s=ta(s),a=ta(a),r=ta(r),n.drawingArea=Math.max(t/2,Math.min(Math.floor(t-(o+s)/2),Math.floor(t-(a+r)/2))),n.setCenterPoint(o,s,a,r)}setCenterPoint(t,e,i,n){const o=this,s=o.width-e-o.drawingArea,a=t+o.drawingArea,r=i+o.drawingArea,l=o.height-o.paddingTop-n-o.drawingArea;o.xCenter=Math.floor((a+s)/2+o.left),o.yCenter=Math.floor((r+l)/2+o.top+o.paddingTop)}getIndexAngle(t){return Wt(t*(_t/this.getLabels().length)+Et(this.options.startAngle||0))}getDistanceFromCenterForValue(t){const e=this;if($(t))return NaN;const i=e.drawingArea/(e.max-e.min);return e.options.reverse?(e.max-t)*i:(t-e.min)*i}getValueForDistanceFromCenter(t){if($(t))return NaN;const e=this,i=t/(e.drawingArea/(e.max-e.min));return e.options.reverse?e.max-i:e.min+i}getPointLabelContext(t){const e=this,i=e._pointLabels||[];if(t>=0&&t<i.length){const n=i[t];return function(t,e,i){return Object.assign(Object.create(t),{label:i,index:e,type:"pointLabel"})}(e.getContext(),t,n)}}getPointPosition(t,e){const i=this,n=i.getIndexAngle(t)-Mt;return{x:Math.cos(n)*e+i.xCenter,y:Math.sin(n)*e+i.yCenter,angle:n}}getPointPositionForValue(t,e){return this.getPointPosition(t,this.getDistanceFromCenterForValue(e))}getBasePosition(t){return this.getPointPositionForValue(t||0,this.getBaseValue())}getPointLabelPosition(t){const{left:e,top:i,right:n,bottom:o}=this._pointLabelItems[t];return{left:e,top:i,right:n,bottom:o}}drawBackground(){const t=this,{backgroundColor:e,grid:{circular:i}}=t.options;if(e){const n=t.ctx;n.save(),n.beginPath(),Js(t,t.getDistanceFromCenterForValue(t._endValue),i,t.getLabels().length),n.closePath(),n.fillStyle=e,n.fill(),n.restore()}}drawGrid(){const t=this,e=t.ctx,i=t.options,{angleLines:n,grid:o}=i,s=t.getLabels().length;let a,r,l;if(i.pointLabels.display&&function(t,e){const{ctx:i,options:{pointLabels:n}}=t;for(let o=e-1;o>=0;o--){const e=n.setContext(t.getPointLabelContext(o)),s=Ve(e.font),{x:a,y:r,textAlign:l,left:c,top:h,right:d,bottom:u}=t._pointLabelItems[o],{backdropColor:f}=e;if(!$(f)){const t=Be(e.backdropPadding);i.fillStyle=f,i.fillRect(c-t.left,h-t.top,d-c+t.width,u-h+t.height)}ee(i,t._pointLabels[o],a,r+s.lineHeight/2,s,{color:e.color,textAlign:l,textBaseline:"middle"})}}(t,s),o.display&&t.ticks.forEach(((e,i)=>{if(0!==i){r=t.getDistanceFromCenterForValue(e.value);const n=o.setContext(t.getContext(i-1));!function(t,e,i,n){const o=t.ctx,s=e.circular,{color:a,lineWidth:r}=e;!s&&!n||!a||!r||i<0||(o.save(),o.strokeStyle=a,o.lineWidth=r,o.setLineDash(e.borderDash),o.lineDashOffset=e.borderDashOffset,o.beginPath(),Js(t,i,s,n),o.closePath(),o.stroke(),o.restore())}(t,n,r,s)}})),n.display){for(e.save(),a=t.getLabels().length-1;a>=0;a--){const o=n.setContext(t.getPointLabelContext(a)),{color:s,lineWidth:c}=o;c&&s&&(e.lineWidth=c,e.strokeStyle=s,e.setLineDash(o.borderDash),e.lineDashOffset=o.borderDashOffset,r=t.getDistanceFromCenterForValue(i.ticks.reverse?t.min:t.max),l=t.getPointPosition(a,r),e.beginPath(),e.moveTo(t.xCenter,t.yCenter),e.lineTo(l.x,l.y),e.stroke())}e.restore()}}drawBorder(){}drawLabels(){const t=this,e=t.ctx,i=t.options,n=i.ticks;if(!n.display)return;const o=t.getIndexAngle(0);let s,a;e.save(),e.translate(t.xCenter,t.yCenter),e.rotate(o),e.textAlign="center",e.textBaseline="middle",t.ticks.forEach(((o,r)=>{if(0===r&&!i.reverse)return;const l=n.setContext(t.getContext(r)),c=Ve(l.font);if(s=t.getDistanceFromCenterForValue(t.ticks[r].value),l.showLabelBackdrop){e.font=c.string,a=e.measureText(o.label).width,e.fillStyle=l.backdropColor;const t=Be(l.backdropPadding);e.fillRect(-a/2-t.left,-s-c.size/2-t.top,a+t.width,c.size+t.height)}ee(e,o.label,0,-s,c,{color:l.color})})),e.restore()}drawTitle(){}}ea.id="radialLinear",ea.defaults={display:!0,animate:!0,position:"chartArea",angleLines:{display:!0,lineWidth:1,borderDash:[],borderDashOffset:0},grid:{circular:!1},startAngle:0,ticks:{showLabelBackdrop:!0,callback:Sn.formatters.numeric},pointLabels:{backdropColor:void 0,backdropPadding:2,display:!0,font:{size:10},callback:t=>t,padding:5}},ea.defaultRoutes={"angleLines.color":"borderColor","pointLabels.color":"color","ticks.color":"color"},ea.descriptors={angleLines:{_fallback:"grid"}};const ia={millisecond:{common:!0,size:1,steps:1e3},second:{common:!0,size:1e3,steps:60},minute:{common:!0,size:6e4,steps:60},hour:{common:!0,size:36e5,steps:24},day:{common:!0,size:864e5,steps:30},week:{common:!1,size:6048e5,steps:4},month:{common:!0,size:2628e6,steps:12},quarter:{common:!1,size:7884e6,steps:4},year:{common:!0,size:3154e7}},na=Object.keys(ia);function oa(t,e){return t-e}function sa(t,e){if($(e))return null;const i=t._adapter,{parser:n,round:o,isoWeekday:s}=t._parseOpts;let a=e;return"function"==typeof n&&(a=n(a)),X(a)||(a="string"==typeof n?i.parse(a,n):i.parse(a)),null===a?null:(o&&(a="week"!==o||!Tt(s)&&!0!==s?i.startOf(a,o):i.startOf(a,"isoWeek",s)),+a)}function aa(t,e,i,n){const o=na.length;for(let s=na.indexOf(t);s<o-1;++s){const t=ia[na[s]],o=t.steps?t.steps:Number.MAX_SAFE_INTEGER;if(t.common&&Math.ceil((i-e)/(o*t.size))<=n)return na[s]}return na[o-1]}function ra(t,e,i){if(i){if(i.length){const{lo:n,hi:o}=oe(i,e);t[i[n]>=e?i[n]:i[o]]=!0}}else t[e]=!0}function la(t,e,i){const n=[],o={},s=e.length;let a,r;for(a=0;a<s;++a)r=e[a],o[r]=a,n.push({value:r,major:!1});return 0!==s&&i?function(t,e,i,n){const o=t._adapter,s=+o.startOf(e[0].value,n),a=e[e.length-1].value;let r,l;for(r=s;r<=a;r=+o.add(r,1,n))l=i[r],l>=0&&(e[l].major=!0);return e}(t,n,o,i):n}class ca extends En{constructor(t){super(t),this._cache={data:[],labels:[],all:[]},this._unit="day",this._majorUnit=void 0,this._offsets={},this._normalized=!1,this._parseOpts=void 0}init(t,e){const i=t.time||(t.time={}),n=this._adapter=new co._date(t.adapters.date);st(i.displayFormats,n.formats()),this._parseOpts={parser:i.parser,round:i.round,isoWeekday:i.isoWeekday},super.init(t),this._normalized=e.normalized}parse(t,e){return void 0===t?null:sa(this,t)}beforeLayout(){super.beforeLayout(),this._cache={data:[],labels:[],all:[]}}determineDataLimits(){const t=this,e=t.options,i=t._adapter,n=e.time.unit||"day";let{min:o,max:s,minDefined:a,maxDefined:r}=t.getUserBounds();function l(t){a||isNaN(t.min)||(o=Math.min(o,t.min)),r||isNaN(t.max)||(s=Math.max(s,t.max))}a&&r||(l(t._getLabelBounds()),"ticks"===e.bounds&&"labels"===e.ticks.source||l(t.getMinMax(!1))),o=X(o)&&!isNaN(o)?o:+i.startOf(Date.now(),n),s=X(s)&&!isNaN(s)?s:+i.endOf(Date.now(),n)+1,t.min=Math.min(o,s-1),t.max=Math.max(o+1,s)}_getLabelBounds(){const t=this.getLabelTimestamps();let e=Number.POSITIVE_INFINITY,i=Number.NEGATIVE_INFINITY;return t.length&&(e=t[0],i=t[t.length-1]),{min:e,max:i}}buildTicks(){const t=this,e=t.options,i=e.time,n=e.ticks,o="labels"===n.source?t.getLabelTimestamps():t._generate();"ticks"===e.bounds&&o.length&&(t.min=t._userMin||o[0],t.max=t._userMax||o[o.length-1]);const s=t.min,a=re(o,s,t.max);return t._unit=i.unit||(n.autoSkip?aa(i.minUnit,t.min,t.max,t._getLabelCapacity(s)):function(t,e,i,n,o){for(let s=na.length-1;s>=na.indexOf(i);s--){const i=na[s];if(ia[i].common&&t._adapter.diff(o,n,i)>=e-1)return i}return na[i?na.indexOf(i):0]}(t,a.length,i.minUnit,t.min,t.max)),t._majorUnit=n.major.enabled&&"year"!==t._unit?function(t){for(let e=na.indexOf(t)+1,i=na.length;e<i;++e)if(ia[na[e]].common)return na[e]}(t._unit):void 0,t.initOffsets(o),e.reverse&&a.reverse(),la(t,a,t._majorUnit)}initOffsets(t){const e=this;let i,n,o=0,s=0;e.options.offset&&t.length&&(i=e.getDecimalForValue(t[0]),o=1===t.length?1-i:(e.getDecimalForValue(t[1])-i)/2,n=e.getDecimalForValue(t[t.length-1]),s=1===t.length?n:(n-e.getDecimalForValue(t[t.length-2]))/2);const a=t.length<3?.5:.25;o=Ht(o,0,a),s=Ht(s,0,a),e._offsets={start:o,end:s,factor:1/(o+1+s)}}_generate(){const t=this,e=t._adapter,i=t.min,n=t.max,o=t.options,s=o.time,a=s.unit||aa(s.minUnit,i,n,t._getLabelCapacity(i)),r=K(s.stepSize,1),l="week"===a&&s.isoWeekday,c=Tt(l)||!0===l,h={};let d,u,f=i;if(c&&(f=+e.startOf(f,"isoWeek",l)),f=+e.startOf(f,c?"day":a),e.diff(n,i,a)>1e5*r)throw new Error(i+" and "+n+" are too far apart with stepSize of "+r+" "+a);const g="data"===o.ticks.source&&t.getDataTimestamps();for(d=f,u=0;d<n;d=+e.add(d,r,a),u++)ra(h,d,g);return d!==n&&"ticks"!==o.bounds&&1!==u||ra(h,d,g),Object.keys(h).sort(((t,e)=>t-e)).map((t=>+t))}getLabelForValue(t){const e=this._adapter,i=this.options.time;return i.tooltipFormat?e.format(t,i.tooltipFormat):e.format(t,i.displayFormats.datetime)}_tickFormatFunction(t,e,i,n){const o=this,s=o.options,a=s.time.displayFormats,r=o._unit,l=o._majorUnit,c=r&&a[r],h=l&&a[l],d=i[e],u=l&&h&&d&&d.major,f=o._adapter.format(t,n||(u?h:c)),g=s.ticks.callback;return g?Q(g,[f,e,i],o):f}generateTickLabels(t){let e,i,n;for(e=0,i=t.length;e<i;++e)n=t[e],n.label=this._tickFormatFunction(n.value,e,t)}getDecimalForValue(t){const e=this;return null===t?NaN:(t-e.min)/(e.max-e.min)}getPixelForValue(t){const e=this,i=e._offsets,n=e.getDecimalForValue(t);return e.getPixelForDecimal((i.start+n)*i.factor)}getValueForPixel(t){const e=this,i=e._offsets,n=e.getDecimalForPixel(t)/i.factor-i.end;return e.min+n*(e.max-e.min)}_getLabelSize(t){const e=this,i=e.options.ticks,n=e.ctx.measureText(t).width,o=Et(e.isHorizontal()?i.maxRotation:i.minRotation),s=Math.cos(o),a=Math.sin(o),r=e._resolveTickFontOptions(0).size;return{w:n*s+r*a,h:n*a+r*s}}_getLabelCapacity(t){const e=this,i=e.options.time,n=i.displayFormats,o=n[i.unit]||n.millisecond,s=e._tickFormatFunction(t,0,la(e,[t],e._majorUnit),o),a=e._getLabelSize(s),r=Math.floor(e.isHorizontal()?e.width/a.w:e.height/a.h)-1;return r>0?r:1}getDataTimestamps(){const t=this;let e,i,n=t._cache.data||[];if(n.length)return n;const o=t.getMatchingVisibleMetas();if(t._normalized&&o.length)return t._cache.data=o[0].controller.getAllParsedValues(t);for(e=0,i=o.length;e<i;++e)n=n.concat(o[e].controller.getAllParsedValues(t));return t._cache.data=t.normalize(n)}getLabelTimestamps(){const t=this,e=t._cache.labels||[];let i,n;if(e.length)return e;const o=t.getLabels();for(i=0,n=o.length;i<n;++i)e.push(sa(t,o[i]));return t._cache.labels=t._normalized?e:t.normalize(e)}normalize(t){return de(t.sort(oa))}}function ha(t,e,i){let n,o,s,a,r=0,l=t.length-1;i?(e>=t[r].pos&&e<=t[l].pos&&({lo:r,hi:l}=se(t,"pos",e)),({pos:n,time:s}=t[r]),({pos:o,time:a}=t[l])):(e>=t[r].time&&e<=t[l].time&&({lo:r,hi:l}=se(t,"time",e)),({time:n,pos:s}=t[r]),({time:o,pos:a}=t[l]));const c=o-n;return c?s+(a-s)*(e-n)/c:s}ca.id="time",ca.defaults={bounds:"data",adapters:{},time:{parser:!1,unit:!1,round:!1,isoWeekday:!1,minUnit:"millisecond",displayFormats:{}},ticks:{source:"auto",major:{enabled:!1}}};class da extends ca{constructor(t){super(t),this._table=[],this._minPos=void 0,this._tableRange=void 0}initOffsets(){const t=this,e=t._getTimestampsForTable(),i=t._table=t.buildLookupTable(e);t._minPos=ha(i,t.min),t._tableRange=ha(i,t.max)-t._minPos,super.initOffsets(e)}buildLookupTable(t){const{min:e,max:i}=this,n=[],o=[];let s,a,r,l,c;for(s=0,a=t.length;s<a;++s)l=t[s],l>=e&&l<=i&&n.push(l);if(n.length<2)return[{time:e,pos:0},{time:i,pos:1}];for(s=0,a=n.length;s<a;++s)c=n[s+1],r=n[s-1],l=n[s],Math.round((c+r)/2)!==l&&o.push({time:l,pos:s/(a-1)});return o}_getTimestampsForTable(){const t=this;let e=t._cache.all||[];if(e.length)return e;const i=t.getDataTimestamps(),n=t.getLabelTimestamps();return e=i.length&&n.length?t.normalize(i.concat(n)):i.length?i:n,e=t._cache.all=e,e}getDecimalForValue(t){return(ha(this._table,t)-this._minPos)/this._tableRange}getValueForPixel(t){const e=this,i=e._offsets,n=e.getDecimalForPixel(t)/i.factor-i.end;return ha(e._table,n*e._tableRange+e._minPos,!0)}}da.id="timeseries",da.defaults=ca.defaults;var ua=Object.freeze({__proto__:null,CategoryScale:Ns,LinearScale:$s,LogarithmicScale:Us,RadialLinearScale:ea,TimeScale:ca,TimeSeriesScale:da});return oo.register(Po,ua,Zo,Vs),oo.helpers={...Ni},oo._adapters=co,oo.Animation=ln,oo.Animations=hn,oo.animator=a,oo.controllers=zn.controllers.items,oo.DatasetController=wn,oo.Element=Mn,oo.elements=Zo,oo.Interaction=Ae,oo.layouts=ti,oo.platforms=sn,oo.Scale=En,oo.Ticks=Sn,Object.assign(oo,Po,ua,Zo,Vs,sn),oo.Chart=oo,"undefined"!=typeof window&&(window.Chart=oo),oo}));
