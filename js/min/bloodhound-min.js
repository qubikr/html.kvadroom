!function($){var t=function(){"use strict";return{isMsie:function(){return/(msie|trident)/i.test(navigator.userAgent)?navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]:!1},isBlankString:function(t){return!t||/^\s*$/.test(t)},escapeRegExChars:function(t){return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},isString:function(t){return"string"==typeof t},isNumber:function(t){return"number"==typeof t},isArray:$.isArray,isFunction:$.isFunction,isObject:$.isPlainObject,isUndefined:function(t){return"undefined"==typeof t},toStr:function e(i){return t.isUndefined(i)||null===i?"":i+""},bind:$.proxy,each:function(t,e){function i(t,i){return e(i,t)}$.each(t,i)},map:$.map,filter:$.grep,every:function(t,e){var i=!0;return t?($.each(t,function(n,r){return(i=e.call(null,r,n,t))?void 0:!1}),!!i):i},some:function(t,e){var i=!1;return t?($.each(t,function(n,r){return(i=e.call(null,r,n,t))?!1:void 0}),!!i):i},mixin:$.extend,getUniqueId:function(){var t=0;return function(){return t++}}(),templatify:function i(t){function e(){return String(t)}return $.isFunction(t)?t:e},defer:function(t){setTimeout(t,0)},debounce:function(t,e,i){var n,r;return function(){var o=this,s=arguments,u,a;return u=function(){n=null,i||(r=t.apply(o,s))},a=i&&!n,clearTimeout(n),n=setTimeout(u,e),a&&(r=t.apply(o,s)),r}},throttle:function(t,e){var i,n,r,o,s,u;return s=0,u=function(){s=new Date,r=null,o=t.apply(i,n)},function(){var a=new Date,c=e-(a-s);return i=this,n=arguments,0>=c?(clearTimeout(r),r=null,s=a,o=t.apply(i,n)):r||(r=setTimeout(u,c)),o}},noop:function(){}}}(),e="0.10.5",i=function(){"use strict";function e(e){return e=t.toStr(e),e?e.split(/\s+/):[]}function i(e){return e=t.toStr(e),e?e.split(/\W+/):[]}function n(e){return function i(){var i=[].slice.call(arguments,0);return function n(r){var o=[];return t.each(i,function(i){o=o.concat(e(t.toStr(r[i])))}),o}}}return{nonword:i,whitespace:e,obj:{nonword:n(i),whitespace:n(e)}}}(),n=function(){"use strict";function e(e){this.maxSize=t.isNumber(e)?e:100,this.reset(),this.maxSize<=0&&(this.set=this.get=$.noop)}function i(){this.head=this.tail=null}function n(t,e){this.key=t,this.val=e,this.prev=this.next=null}return t.mixin(e.prototype,{set:function r(t,e){var i=this.list.tail,r;this.size>=this.maxSize&&(this.list.remove(i),delete this.hash[i.key]),(r=this.hash[t])?(r.val=e,this.list.moveToFront(r)):(r=new n(t,e),this.list.add(r),this.hash[t]=r,this.size++)},get:function o(t){var e=this.hash[t];return e?(this.list.moveToFront(e),e.val):void 0},reset:function s(){this.size=0,this.hash={},this.list=new i}}),t.mixin(i.prototype,{add:function u(t){this.head&&(t.next=this.head,this.head.prev=t),this.head=t,this.tail=this.tail||t},remove:function a(t){t.prev?t.prev.next=t.next:this.head=t.next,t.next?t.next.prev=t.prev:this.tail=t.prev},moveToFront:function(t){this.remove(t),this.add(t)}}),e}(),r=function(){"use strict";function e(e){this.prefix=["__",e,"__"].join(""),this.ttlKey="__ttl__",this.keyMatcher=new RegExp("^"+t.escapeRegExChars(this.prefix))}function i(){return(new Date).getTime()}function n(e){return JSON.stringify(t.isUndefined(e)?null:e)}function r(t){return JSON.parse(t)}var o,s;try{o=window.localStorage,o.setItem("~~~","!"),o.removeItem("~~~")}catch(u){o=null}return s=o&&window.JSON?{_prefix:function(t){return this.prefix+t},_ttlKey:function(t){return this._prefix(t)+this.ttlKey},get:function(t){return this.isExpired(t)&&this.remove(t),r(o.getItem(this._prefix(t)))},set:function(e,r,s){return t.isNumber(s)?o.setItem(this._ttlKey(e),n(i()+s)):o.removeItem(this._ttlKey(e)),o.setItem(this._prefix(e),n(r))},remove:function(t){return o.removeItem(this._ttlKey(t)),o.removeItem(this._prefix(t)),this},clear:function(){var t,e,i=[],n=o.length;for(t=0;n>t;t++)(e=o.key(t)).match(this.keyMatcher)&&i.push(e.replace(this.keyMatcher,""));for(t=i.length;t--;)this.remove(i[t]);return this},isExpired:function(e){var n=r(o.getItem(this._ttlKey(e)));return t.isNumber(n)&&i()>n?!0:!1}}:{get:t.noop,set:t.noop,remove:t.noop,clear:t.noop,isExpired:t.noop},t.mixin(e.prototype,s),e}(),o=function(){"use strict";function e(t){t=t||{},this.cancelled=!1,this.lastUrl=null,this._send=t.transport?i(t.transport):$.ajax,this._get=t.rateLimiter?t.rateLimiter(this._get):this._get,this._cache=t.cache===!1?new n(0):u}function i(e){return function i(n,r){function o(e){t.defer(function(){u.resolve(e)})}function s(e){t.defer(function(){u.reject(e)})}var u=$.Deferred();return e(n,r,o,s),u}}var r=0,o={},s=6,u=new n(10);return e.setMaxPendingRequests=function a(t){s=t},e.resetCache=function c(){u.reset()},t.mixin(e.prototype,{_get:function(t,e,i){function n(e){i&&i(null,e),c._cache.set(t,e)}function u(){i&&i(!0)}function a(){r--,delete o[t],c.onDeckRequestArgs&&(c._get.apply(c,c.onDeckRequestArgs),c.onDeckRequestArgs=null)}var c=this,h;this.cancelled||t!==this.lastUrl||((h=o[t])?h.done(n).fail(u):s>r?(r++,o[t]=this._send(t,e).done(n).fail(u).always(a)):this.onDeckRequestArgs=[].slice.call(arguments,0))},get:function(e,i,n){var r;return t.isFunction(i)&&(n=i,i={}),this.cancelled=!1,this.lastUrl=e,(r=this._cache.get(e))?t.defer(function(){n&&n(null,r)}):this._get(e,i,n),!!r},cancel:function(){this.cancelled=!0}}),e}(),s=function(){"use strict";function e(t){t=t||{},t.datumTokenizer&&t.queryTokenizer||$.error("datumTokenizer and queryTokenizer are both required"),this.datumTokenizer=t.datumTokenizer,this.queryTokenizer=t.queryTokenizer,this.reset()}function i(e){return e=t.filter(e,function(t){return!!t}),e=t.map(e,function(t){return t.toLowerCase()})}function n(){return{ids:[],children:{}}}function r(t){for(var e={},i=[],n=0,r=t.length;r>n;n++)e[t[n]]||(e[t[n]]=!0,i.push(t[n]));return i}function o(t,e){function i(t,e){return t-e}var n=0,r=0,o=[];t=t.sort(i),e=e.sort(i);for(var s=t.length,u=e.length;s>n&&u>r;)t[n]<e[r]?n++:t[n]>e[r]?r++:(o.push(t[n]),n++,r++);return o}return t.mixin(e.prototype,{bootstrap:function s(t){this.datums=t.datums,this.trie=t.trie},add:function(e){var r=this;e=t.isArray(e)?e:[e],t.each(e,function(e){var o,s;o=r.datums.push(e)-1,s=i(r.datumTokenizer(e)),t.each(s,function(t){var e,i,s;for(e=r.trie,i=t.split("");s=i.shift();)e=e.children[s]||(e.children[s]=n()),e.ids.push(o)})})},get:function u(e){var n=this,s,u;return s=i(this.queryTokenizer(e)),t.each(s,function(t){var e,i,r,s;if(u&&0===u.length)return!1;for(e=n.trie,i=t.split("");e&&(r=i.shift());)e=e.children[r];return e&&0===i.length?(s=e.ids.slice(0),void(u=u?o(u,s):s)):(u=[],!1)}),u?t.map(r(u),function(t){return n.datums[t]}):[]},reset:function a(){this.datums=[],this.trie=n()},serialize:function c(){return{datums:this.datums,trie:this.trie}}}),e}(),u=function(){"use strict";function i(t){return t.local||null}function n(i){var n,r;return r={url:null,thumbprint:"",ttl:864e5,filter:null,ajax:{}},(n=i.prefetch||null)&&(n=t.isString(n)?{url:n}:n,n=t.mixin(r,n),n.thumbprint=e+n.thumbprint,n.ajax.type=n.ajax.type||"GET",n.ajax.dataType=n.ajax.dataType||"json",!n.url&&$.error("prefetch requires url to be set")),n}function r(e){function i(e){return function(i){return t.debounce(i,e)}}function n(e){return function(i){return t.throttle(i,e)}}var r,o;return o={url:null,cache:!0,wildcard:"%QUERY",replace:null,rateLimitBy:"debounce",rateLimitWait:300,send:null,filter:null,ajax:{}},(r=e.remote||null)&&(r=t.isString(r)?{url:r}:r,r=t.mixin(o,r),r.rateLimiter=/^throttle$/i.test(r.rateLimitBy)?n(r.rateLimitWait):i(r.rateLimitWait),r.ajax.type=r.ajax.type||"GET",r.ajax.dataType=r.ajax.dataType||"json",delete r.rateLimitBy,delete r.rateLimitWait,!r.url&&$.error("remote requires url to be set")),r}return{local:i,prefetch:n,remote:r}}();!function(e){"use strict";function n(t){t&&(t.local||t.prefetch||t.remote)||$.error("one of local, prefetch, or remote is required"),this.limit=t.limit||5,this.sorter=a(t.sorter),this.dupDetector=t.dupDetector||c,this.local=u.local(t),this.prefetch=u.prefetch(t),this.remote=u.remote(t),this.cacheKey=this.prefetch?this.prefetch.cacheKey||this.prefetch.url:null,this.index=new s({datumTokenizer:t.datumTokenizer,queryTokenizer:t.queryTokenizer}),this.storage=this.cacheKey?new r(this.cacheKey):null}function a(e){function i(t){return t.sort(e)}function n(t){return t}return t.isFunction(e)?i:n}function c(){return!1}var h,l;return h=e.Bloodhound,l={data:"data",protocol:"protocol",thumbprint:"thumbprint"},e.Bloodhound=n,n.noConflict=function f(){return e.Bloodhound=h,n},n.tokenizers=i,t.mixin(n.prototype,{_loadPrefetch:function d(t){function e(e){i.clear(),i.add(t.filter?t.filter(e):e),i._saveToStorage(i.index.serialize(),t.thumbprint,t.ttl)}var i=this,n,r;return(n=this._readFromStorage(t.thumbprint))?(this.index.bootstrap(n),r=$.Deferred().resolve()):r=$.ajax(t.url,t.ajax).done(e),r},_getFromRemote:function p(t,e){function i(t,i){e(t?[]:n.remote.filter?n.remote.filter(i):i)}var n=this,r,o;if(this.transport)return t=t||"",o=encodeURIComponent(t),r=this.remote.replace?this.remote.replace(this.remote.url,t):this.remote.url.replace(this.remote.wildcard,o),this.transport.get(r,this.remote.ajax,i)},_cancelLastRemoteRequest:function m(){this.transport&&this.transport.cancel()},_saveToStorage:function g(t,e,i){this.storage&&(this.storage.set(l.data,t,i),this.storage.set(l.protocol,location.protocol,i),this.storage.set(l.thumbprint,e,i))},_readFromStorage:function v(t){var e={},i;return this.storage&&(e.data=this.storage.get(l.data),e.protocol=this.storage.get(l.protocol),e.thumbprint=this.storage.get(l.thumbprint)),i=e.thumbprint!==t||e.protocol!==location.protocol,e.data&&!i?e.data:null},_initialize:function y(){function e(){i.add(t.isFunction(n)?n():n)}var i=this,n=this.local,r;return r=this.prefetch?this._loadPrefetch(this.prefetch):$.Deferred().resolve(),n&&r.done(e),this.transport=this.remote?new o(this.remote):null,this.initPromise=r.promise()},initialize:function x(t){return!this.initPromise||t?this._initialize():this.initPromise},add:function _(t){this.index.add(t)},get:function T(e,i){function n(e){var n=o.slice(0);t.each(e,function(e){var i;return i=t.some(n,function(t){return r.dupDetector(e,t)}),!i&&n.push(e),n.length<r.limit}),i&&i(r.sorter(n))}var r=this,o=[],s=!1;o=this.index.get(e),o=this.sorter(o).slice(0,this.limit),o.length<this.limit?s=this._getFromRemote(e,n):this._cancelLastRemoteRequest(),s||(o.length>0||!this.transport)&&i&&i(o)},clear:function b(){this.index.reset()},clearPrefetchCache:function k(){this.storage&&this.storage.clear()},clearRemoteCache:function z(){this.transport&&o.resetCache()},ttAdapter:function w(){return t.bind(this.get,this)}}),n}(this)}(window.jQuery);