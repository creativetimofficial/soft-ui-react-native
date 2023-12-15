(function (f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.htmlparser2 = f()
    }
})(function () {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a)return a(o, !0);
                    if (i)return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {exports: {}};
                t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }

        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++)s(r[o]);
        return s
    })({
        1: [function (_dereq_, module, exports) {
            module.exports = CollectingHandler;

            function CollectingHandler(cbs) {
                this._cbs = cbs || {};
                this.events = [];
            }

            var EVENTS = _dereq_("./").EVENTS;
            Object.keys(EVENTS).forEach(function (name) {
                if (EVENTS[name] === 0) {
                    name = "on" + name;
                    CollectingHandler.prototype[name] = function () {
                        this.events.push([name]);
                        if (this._cbs[name]) this._cbs[name]();
                    };
                } else if (EVENTS[name] === 1) {
                    name = "on" + name;
                    CollectingHandler.prototype[name] = function (a) {
                        this.events.push([name, a]);
                        if (this._cbs[name]) this._cbs[name](a);
                    };
                } else if (EVENTS[name] === 2) {
                    name = "on" + name;
                    CollectingHandler.prototype[name] = function (a, b) {
                        this.events.push([name, a, b]);
                        if (this._cbs[name]) this._cbs[name](a, b);
                    };
                } else {
                    throw Error("wrong number of arguments");
                }
            });

            CollectingHandler.prototype.onreset = function () {
                this.events = [];
                if (this._cbs.onreset) this._cbs.onreset();
            };

            CollectingHandler.prototype.restart = function () {
                if (this._cbs.onreset) this._cbs.onreset();

                for (var i = 0, len = this.events.length; i < len; i++) {
                    if (this._cbs[this.events[i][0]]) {

                        var num = this.events[i].length;

                        if (num === 1) {
                            this._cbs[this.events[i][0]]();
                        } else if (num === 2) {
                            this._cbs[this.events[i][0]](this.events[i][1]);
                        } else {
                            this._cbs[this.events[i][0]](this.events[i][1], this.events[i][2]);
                        }
                    }
                }
            };

        }, {"./": "htmlparser2"}],
        2: [function (_dereq_, module, exports) {
            var index = _dereq_("./index.js"),
                DomHandler = index.DomHandler,
                DomUtils = index.DomUtils;

//TODO: make this a streamable handler
            function FeedHandler(callback, options) {
                this.init(callback, options);
            }

            _dereq_("util").inherits(FeedHandler, DomHandler);

            FeedHandler.prototype.init = DomHandler;

            function getElements(what, where) {
                return DomUtils.getElementsByTagName(what, where, true);
            }

            function getOneElement(what, where) {
                return DomUtils.getElementsByTagName(what, where, true, 1)[0];
            }

            function fetch(what, where, recurse) {
                return DomUtils.getText(
                    DomUtils.getElementsByTagName(what, where, recurse, 1)
                ).trim();
            }

            function addConditionally(obj, prop, what, where, recurse) {
                var tmp = fetch(what, where, recurse);
                if (tmp) obj[prop] = tmp;
            }

            var isValidFeed = function (value) {
                return value === "rss" || value === "feed" || value === "rdf:RDF";
            };

            FeedHandler.prototype.onend = function () {
                var feed = {},
                    feedRoot = getOneElement(isValidFeed, this.dom),
                    tmp, childs;

                if (feedRoot) {
                    if (feedRoot.name === "feed") {
                        childs = feedRoot.children;

                        feed.type = "atom";
                        addConditionally(feed, "id", "id", childs);
                        addConditionally(feed, "title", "title", childs);
                        if ((tmp = getOneElement("link", childs)) && (tmp = tmp.attribs) && (tmp = tmp.href)) feed.link = tmp;
                        addConditionally(feed, "description", "subtitle", childs);
                        if ((tmp = fetch("updated", childs))) feed.updated = new Date(tmp);
                        addConditionally(feed, "author", "email", childs, true);

                        feed.items = getElements("entry", childs).map(function (item) {
                            var entry = {}, tmp;

                            item = item.children;

                            addConditionally(entry, "id", "id", item);
                            addConditionally(entry, "title", "title", item);
                            if ((tmp = getOneElement("link", item)) && (tmp = tmp.attribs) && (tmp = tmp.href)) entry.link = tmp;
                            if ((tmp = fetch("summary", item) || fetch("content", item))) entry.description = tmp;
                            if ((tmp = fetch("updated", item))) entry.pubDate = new Date(tmp);
                            return entry;
                        });
                    } else {
                        childs = getOneElement("channel", feedRoot.children).children;

                        feed.type = feedRoot.name.substr(0, 3);
                        feed.id = "";
                        addConditionally(feed, "title", "title", childs);
                        addConditionally(feed, "link", "link", childs);
                        addConditionally(feed, "description", "description", childs);
                        if ((tmp = fetch("lastBuildDate", childs))) feed.updated = new Date(tmp);
                        addConditionally(feed, "author", "managingEditor", childs, true);

                        feed.items = getElements("item", feedRoot.children).map(function (item) {
                            var entry = {}, tmp;

                            item = item.children;

                            addConditionally(entry, "id", "guid", item);
                            addConditionally(entry, "title", "title", item);
                            addConditionally(entry, "link", "link", item);
                            addConditionally(entry, "description", "description", item);
                            if ((tmp = fetch("pubDate", item))) entry.pubDate = new Date(tmp);
                            return entry;
                        });
                    }
                }
                this.dom = feed;
                DomHandler.prototype._handleCallback.call(
                    this, feedRoot ? null : Error("couldn't find root of feed")
                );
            };

            module.exports = FeedHandler;

        }, {"./index.js": "htmlparser2", "util": 57}],
        3: [function (_dereq_, module, exports) {
            var Tokenizer = _dereq_("./Tokenizer.js");

            /*
             Options:

             xmlMode: Special behavior for script/style tags (true by default)
             lowerCaseAttributeNames: call .toLowerCase for each attribute name (true if xmlMode is `false`)
             lowerCaseTags: call .toLowerCase for each tag name (true if xmlMode is `false`)
             */

            /*
             Callbacks:

             oncdataend,
             oncdatastart,
             onclosetag,
             oncomment,
             oncommentend,
             onerror,
             onopentag,
             onprocessinginstruction,
             onreset,
             ontext
             */

            var formTags = {
                input: true,
                option: true,
                optgroup: true,
                select: true,
                button: true,
                datalist: true,
                textarea: true
            };

            var openImpliesClose = {
                tr: {tr: true, th: true, td: true},
                th: {th: true},
                td: {thead: true, td: true},
                body: {head: true, link: true, script: true},
                li: {li: true},
                p: {p: true},
                h1: {p: true},
                h2: {p: true},
                h3: {p: true},
                h4: {p: true},
                h5: {p: true},
                h6: {p: true},
                select: formTags,
                input: formTags,
                output: formTags,
                button: formTags,
                datalist: formTags,
                textarea: formTags,
                option: {option: true},
                optgroup: {optgroup: true}
            };

            var voidElements = {
                __proto__: null,
                area: true,
                base: true,
                basefont: true,
                br: true,
                col: true,
                command: true,
                embed: true,
                frame: true,
                hr: true,
                img: true,
                input: true,
                isindex: true,
                keygen: true,
                link: true,
                meta: true,
                param: true,
                source: true,
                track: true,
                wbr: true,

                //common self closing svg elements
                path: true,
                circle: true,
                ellipse: true,
                line: true,
                rect: true,
                use: true,
                stop: true,
                polyline: true,
                polygone: true
            };

            var re_nameEnd = /\s|\//;

            function Parser(cbs, options) {
                this._options = options || {};
                this._cbs = cbs || {};

                this._tagname = "";
                this._attribname = "";
                this._attribvalue = "";
                this._attribs = null;
                this._stack = [];

                this.startIndex = 0;
                this.endIndex = null;

                this._lowerCaseTagNames = "lowerCaseTags" in this._options ?
                    !!this._options.lowerCaseTags :
                    !this._options.xmlMode;
                this._lowerCaseAttributeNames = "lowerCaseAttributeNames" in this._options ?
                    !!this._options.lowerCaseAttributeNames :
                    !this._options.xmlMode;

                this._tokenizer = new Tokenizer(this._options, this);

                if (this._cbs.onparserinit) this._cbs.onparserinit(this);
            }

            _dereq_("util").inherits(Parser, _dereq_("events").EventEmitter);

            Parser.prototype._updatePosition = function (initialOffset) {
                if (this.endIndex === null) {
                    if (this._tokenizer._sectionStart <= initialOffset) {
                        this.startIndex = 0;
                    } else {
                        this.startIndex = this._tokenizer._sectionStart - initialOffset;
                    }
                }
                else this.startIndex = this.endIndex + 1;
                this.endIndex = this._tokenizer.getAbsoluteIndex();
            };

//Tokenizer event handlers
            Parser.prototype.ontext = function (data) {
                this._updatePosition(1);
                this.endIndex--;

                if (this._cbs.ontext) this._cbs.ontext(data);
            };

            Parser.prototype.onopentagname = function (name) {
                if (this._lowerCaseTagNames) {
                    name = name.toLowerCase();
                }

                this._tagname = name;

                if (!this._options.xmlMode && name in openImpliesClose) {
                    for (
                        var el;
                        (el = this._stack[this._stack.length - 1]) in openImpliesClose[name];
                        this.onclosetag(el)
                    );
                }

                if (this._options.xmlMode || !(name in voidElements)) {
                    this._stack.push(name);
                }

                if (this._cbs.onopentagname) this._cbs.onopentagname(name);
                if (this._cbs.onopentag) this._attribs = {};
            };

            Parser.prototype.onopentagend = function () {
                this._updatePosition(1);

                if (this._attribs) {
                    if (this._cbs.onopentag) this._cbs.onopentag(this._tagname, this._attribs);
                    this._attribs = null;
                }

                if (!this._options.xmlMode && this._cbs.onclosetag && this._tagname in voidElements) {
                    this._cbs.onclosetag(this._tagname);
                }

                this._tagname = "";
            };

            Parser.prototype.onclosetag = function (name) {
                this._updatePosition(1);

                if (this._lowerCaseTagNames) {
                    name = name.toLowerCase();
                }

                if (this._stack.length && (!(name in voidElements) || this._options.xmlMode)) {
                    var pos = this._stack.lastIndexOf(name);
                    if (pos !== -1) {
                        if (this._cbs.onclosetag) {
                            pos = this._stack.length - pos;
                            while (pos--) this._cbs.onclosetag(this._stack.pop());
                        }
                        else this._stack.length = pos;
                    } else if (name === "p" && !this._options.xmlMode) {
                        this.onopentagname(name);
                        this._closeCurrentTag();
                    }
                } else if (!this._options.xmlMode && (name === "br" || name === "p")) {
                    this.onopentagname(name);
                    this._closeCurrentTag();
                }
            };

            Parser.prototype.onselfclosingtag = function () {
                if (this._options.xmlMode || this._options.recognizeSelfClosing) {
                    this._closeCurrentTag();
                } else {
                    this.onopentagend();
                }
            };

            Parser.prototype._closeCurrentTag = function () {
                var name = this._tagname;

                this.onopentagend();

                //self-closing tags will be on the top of the stack
                //(cheaper check than in onclosetag)
                if (this._stack[this._stack.length - 1] === name) {
                    if (this._cbs.onclosetag) {
                        this._cbs.onclosetag(name);
                    }
                    this._stack.pop();
                }
            };

            Parser.prototype.onattribname = function (name) {
                if (this._lowerCaseAttributeNames) {
                    name = name.toLowerCase();
                }
                this._attribname = name;
            };

            Parser.prototype.onattribdata = function (value) {
                this._attribvalue += value;
            };

            Parser.prototype.onattribend = function () {
                if (this._cbs.onattribute) this._cbs.onattribute(this._attribname, this._attribvalue);
                if (
                    this._attribs && !Object.prototype.hasOwnProperty.call(this._attribs, this._attribname)
                ) {
                    this._attribs[this._attribname] = this._attribvalue;
                }
                this._attribname = "";
                this._attribvalue = "";
            };

            Parser.prototype._getInstructionName = function (value) {
                var idx = value.search(re_nameEnd),
                    name = idx < 0 ? value : value.substr(0, idx);

                if (this._lowerCaseTagNames) {
                    name = name.toLowerCase();
                }

                return name;
            };

            Parser.prototype.ondeclaration = function (value) {
                if (this._cbs.onprocessinginstruction) {
                    var name = this._getInstructionName(value);
                    this._cbs.onprocessinginstruction("!" + name, "!" + value);
                }
            };

            Parser.prototype.onprocessinginstruction = function (value) {
                if (this._cbs.onprocessinginstruction) {
                    var name = this._getInstructionName(value);
                    this._cbs.onprocessinginstruction("?" + name, "?" + value);
                }
            };

            Parser.prototype.oncomment = function (value) {
                this._updatePosition(4);

                if (this._cbs.oncomment) this._cbs.oncomment(value);
                if (this._cbs.oncommentend) this._cbs.oncommentend();
            };

            Parser.prototype.oncdata = function (value) {
                this._updatePosition(1);

                if (this._options.xmlMode || this._options.recognizeCDATA) {
                    if (this._cbs.oncdatastart) this._cbs.oncdatastart();
                    if (this._cbs.ontext) this._cbs.ontext(value);
                    if (this._cbs.oncdataend) this._cbs.oncdataend();
                } else {
                    this.oncomment("[CDATA[" + value + "]]");
                }
            };

            Parser.prototype.onerror = function (err) {
                if (this._cbs.onerror) this._cbs.onerror(err);
            };

            Parser.prototype.onend = function () {
                if (this._cbs.onclosetag) {
                    for (
                        var i = this._stack.length;
                        i > 0;
                        this._cbs.onclosetag(this._stack[--i])
                    );
                }
                if (this._cbs.onend) this._cbs.onend();
            };

//Resets the parser to a blank state, ready to parse a new HTML document
            Parser.prototype.reset = function () {
                if (this._cbs.onreset) this._cbs.onreset();
                this._tokenizer.reset();

                this._tagname = "";
                this._attribname = "";
                this._attribs = null;
                this._stack = [];

                if (this._cbs.onparserinit) this._cbs.onparserinit(this);
            };

//Parses a complete HTML document and pushes it to the handler
            Parser.prototype.parseComplete = function (data) {
                this.reset();
                this.end(data);
            };

            Parser.prototype.write = function (chunk) {
                this._tokenizer.write(chunk);
            };

            Parser.prototype.end = function (chunk) {
                this._tokenizer.end(chunk);
            };

            Parser.prototype.pause = function () {
                this._tokenizer.pause();
            };

            Parser.prototype.resume = function () {
                this._tokenizer.resume();
            };

//alias for backwards compat
            Parser.prototype.parseChunk = Parser.prototype.write;
            Parser.prototype.done = Parser.prototype.end;

            module.exports = Parser;

        }, {"./Tokenizer.js": 6, "events": 39, "util": 57}],
        4: [function (_dereq_, module, exports) {
            module.exports = ProxyHandler;

            function ProxyHandler(cbs) {
                this._cbs = cbs || {};
            }

            var EVENTS = _dereq_("./").EVENTS;
            Object.keys(EVENTS).forEach(function (name) {
                if (EVENTS[name] === 0) {
                    name = "on" + name;
                    ProxyHandler.prototype[name] = function () {
                        if (this._cbs[name]) this._cbs[name]();
                    };
                } else if (EVENTS[name] === 1) {
                    name = "on" + name;
                    ProxyHandler.prototype[name] = function (a) {
                        if (this._cbs[name]) this._cbs[name](a);
                    };
                } else if (EVENTS[name] === 2) {
                    name = "on" + name;
                    ProxyHandler.prototype[name] = function (a, b) {
                        if (this._cbs[name]) this._cbs[name](a, b);
                    };
                } else {
                    throw Error("wrong number of arguments");
                }
            });
        }, {"./": "htmlparser2"}],
        5: [function (_dereq_, module, exports) {
            module.exports = Stream;

            var Parser = _dereq_("./WritableStream.js");

            function Stream(options) {
                Parser.call(this, new Cbs(this), options);
            }

            _dereq_("util").inherits(Stream, Parser);

            Stream.prototype.readable = true;

            function Cbs(scope) {
                this.scope = scope;
            }

            var EVENTS = _dereq_("../").EVENTS;

            Object.keys(EVENTS).forEach(function (name) {
                if (EVENTS[name] === 0) {
                    Cbs.prototype["on" + name] = function () {
                        this.scope.emit(name);
                    };
                } else if (EVENTS[name] === 1) {
                    Cbs.prototype["on" + name] = function (a) {
                        this.scope.emit(name, a);
                    };
                } else if (EVENTS[name] === 2) {
                    Cbs.prototype["on" + name] = function (a, b) {
                        this.scope.emit(name, a, b);
                    };
                } else {
                    throw Error("wrong number of arguments!");
                }
            });
        }, {"../": "htmlparser2", "./WritableStream.js": 7, "util": 57}],
        6: [function (_dereq_, module, exports) {
            module.exports = Tokenizer;

            var decodeCodePoint = _dereq_("entities/lib/decode_codepoint.js"),
                entityMap = _dereq_("entities/maps/entities.json"),
                legacyMap = _dereq_("entities/maps/legacy.json"),
                xmlMap = _dereq_("entities/maps/xml.json"),

                i = 0,

                TEXT = i++,
                BEFORE_TAG_NAME = i++, //after <
                IN_TAG_NAME = i++,
                IN_SELF_CLOSING_TAG = i++,
                BEFORE_CLOSING_TAG_NAME = i++,
                IN_CLOSING_TAG_NAME = i++,
                AFTER_CLOSING_TAG_NAME = i++,

                //attributes
                BEFORE_ATTRIBUTE_NAME = i++,
                IN_ATTRIBUTE_NAME = i++,
                AFTER_ATTRIBUTE_NAME = i++,
                BEFORE_ATTRIBUTE_VALUE = i++,
                IN_ATTRIBUTE_VALUE_DQ = i++, // "
                IN_ATTRIBUTE_VALUE_SQ = i++, // '
                IN_ATTRIBUTE_VALUE_NQ = i++,

                //declarations
                BEFORE_DECLARATION = i++, // !
                IN_DECLARATION = i++,

                //processing instructions
                IN_PROCESSING_INSTRUCTION = i++, // ?

                //comments
                BEFORE_COMMENT = i++,
                IN_COMMENT = i++,
                AFTER_COMMENT_1 = i++,
                AFTER_COMMENT_2 = i++,

                //cdata
                BEFORE_CDATA_1 = i++, // [
                BEFORE_CDATA_2 = i++, // C
                BEFORE_CDATA_3 = i++, // D
                BEFORE_CDATA_4 = i++, // A
                BEFORE_CDATA_5 = i++, // T
                BEFORE_CDATA_6 = i++, // A
                IN_CDATA = i++, // [
                AFTER_CDATA_1 = i++, // ]
                AFTER_CDATA_2 = i++, // ]

                //special tags
                BEFORE_SPECIAL = i++, //S
                BEFORE_SPECIAL_END = i++,   //S

                BEFORE_SCRIPT_1 = i++, //C
                BEFORE_SCRIPT_2 = i++, //R
                BEFORE_SCRIPT_3 = i++, //I
                BEFORE_SCRIPT_4 = i++, //P
                BEFORE_SCRIPT_5 = i++, //T
                AFTER_SCRIPT_1 = i++, //C
                AFTER_SCRIPT_2 = i++, //R
                AFTER_SCRIPT_3 = i++, //I
                AFTER_SCRIPT_4 = i++, //P
                AFTER_SCRIPT_5 = i++, //T

                BEFORE_STYLE_1 = i++, //T
                BEFORE_STYLE_2 = i++, //Y
                BEFORE_STYLE_3 = i++, //L
                BEFORE_STYLE_4 = i++, //E
                AFTER_STYLE_1 = i++, //T
                AFTER_STYLE_2 = i++, //Y
                AFTER_STYLE_3 = i++, //L
                AFTER_STYLE_4 = i++, //E

                BEFORE_ENTITY = i++, //&
                BEFORE_NUMERIC_ENTITY = i++, //#
                IN_NAMED_ENTITY = i++,
                IN_NUMERIC_ENTITY = i++,
                IN_HEX_ENTITY = i++, //X

                j = 0,

                SPECIAL_NONE = j++,
                SPECIAL_SCRIPT = j++,
                SPECIAL_STYLE = j++;

            function whitespace(c) {
                return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
            }

            function characterState(char, SUCCESS) {
                return function (c) {
                    if (c === char) this._state = SUCCESS;
                };
            }

            function ifElseState(upper, SUCCESS, FAILURE) {
                var lower = upper.toLowerCase();

                if (upper === lower) {
                    return function (c) {
                        if (c === lower) {
                            this._state = SUCCESS;
                        } else {
                            this._state = FAILURE;
                            this._index--;
                        }
                    };
                } else {
                    return function (c) {
                        if (c === lower || c === upper) {
                            this._state = SUCCESS;
                        } else {
                            this._state = FAILURE;
                            this._index--;
                        }
                    };
                }
            }

            function consumeSpecialNameChar(upper, NEXT_STATE) {
                var lower = upper.toLowerCase();

                return function (c) {
                    if (c === lower || c === upper) {
                        this._state = NEXT_STATE;
                    } else {
                        this._state = IN_TAG_NAME;
                        this._index--; //consume the token again
                    }
                };
            }

            function Tokenizer(options, cbs) {
                this._state = TEXT;
                this._buffer = "";
                this._sectionStart = 0;
                this._index = 0;
                this._bufferOffset = 0; //chars removed from _buffer
                this._baseState = TEXT;
                this._special = SPECIAL_NONE;
                this._cbs = cbs;
                this._running = true;
                this._ended = false;
                this._xmlMode = !!(options && options.xmlMode);
                this._decodeEntities = !!(options && options.decodeEntities);
            }

            Tokenizer.prototype._stateText = function (c) {
                if (c === "<") {
                    if (this._index > this._sectionStart) {
                        this._cbs.ontext(this._getSection());
                    }
                    this._state = BEFORE_TAG_NAME;
                    this._sectionStart = this._index;
                } else if (this._decodeEntities && this._special === SPECIAL_NONE && c === "&") {
                    if (this._index > this._sectionStart) {
                        this._cbs.ontext(this._getSection());
                    }
                    this._baseState = TEXT;
                    this._state = BEFORE_ENTITY;
                    this._sectionStart = this._index;
                }
            };

            Tokenizer.prototype._stateBeforeTagName = function (c) {
                if (c === "/") {
                    this._state = BEFORE_CLOSING_TAG_NAME;
                } else if (c === ">" || this._special !== SPECIAL_NONE || whitespace(c)) {
                    this._state = TEXT;
                } else if (c === "!") {
                    this._state = BEFORE_DECLARATION;
                    this._sectionStart = this._index + 1;
                } else if (c === "?") {
                    this._state = IN_PROCESSING_INSTRUCTION;
                    this._sectionStart = this._index + 1;
                } else if (c === "<") {
                    this._cbs.ontext(this._getSection());
                    this._sectionStart = this._index;
                } else {
                    this._state = (!this._xmlMode && (c === "s" || c === "S")) ?
                        BEFORE_SPECIAL : IN_TAG_NAME;
                    this._sectionStart = this._index;
                }
            };

            Tokenizer.prototype._stateInTagName = function (c) {
                if (c === "/" || c === ">" || whitespace(c)) {
                    this._emitToken("onopentagname");
                    this._state = BEFORE_ATTRIBUTE_NAME;
                    this._index--;
                }
            };

            Tokenizer.prototype._stateBeforeCloseingTagName = function (c) {
                if (whitespace(c));
                else if (c === ">") {
                    this._state = TEXT;
                } else if (this._special !== SPECIAL_NONE) {
                    if (c === "s" || c === "S") {
                        this._state = BEFORE_SPECIAL_END;
                    } else {
                        this._state = TEXT;
                        this._index--;
                    }
                } else {
                    this._state = IN_CLOSING_TAG_NAME;
                    this._sectionStart = this._index;
                }
            };

            Tokenizer.prototype._stateInCloseingTagName = function (c) {
                if (c === ">" || whitespace(c)) {
                    this._emitToken("onclosetag");
                    this._state = AFTER_CLOSING_TAG_NAME;
                    this._index--;
                }
            };

            Tokenizer.prototype._stateAfterCloseingTagName = function (c) {
                //skip everything until ">"
                if (c === ">") {
                    this._state = TEXT;
                    this._sectionStart = this._index + 1;
                }
            };

            Tokenizer.prototype._stateBeforeAttributeName = function (c) {
                if (c === ">") {
                    this._cbs.onopentagend();
                    this._state = TEXT;
                    this._sectionStart = this._index + 1;
                } else if (c === "/") {
                    this._state = IN_SELF_CLOSING_TAG;
                } else if (!whitespace(c)) {
                    this._state = IN_ATTRIBUTE_NAME;
                    this._sectionStart = this._index;
                }
            };

            Tokenizer.prototype._stateInSelfClosingTag = function (c) {
                if (c === ">") {
                    this._cbs.onselfclosingtag();
                    this._state = TEXT;
                    this._sectionStart = this._index + 1;
                } else if (!whitespace(c)) {
                    this._state = BEFORE_ATTRIBUTE_NAME;
                    this._index--;
                }
            };

            Tokenizer.prototype._stateInAttributeName = function (c) {
                if (c === "=" || c === "/" || c === ">" || whitespace(c)) {
                    this._cbs.onattribname(this._getSection());
                    this._sectionStart = -1;
                    this._state = AFTER_ATTRIBUTE_NAME;
                    this._index--;
                }
            };

            Tokenizer.prototype._stateAfterAttributeName = function (c) {
                if (c === "=") {
                    this._state = BEFORE_ATTRIBUTE_VALUE;
                } else if (c === "/" || c === ">") {
                    this._cbs.onattribend();
                    this._state = BEFORE_ATTRIBUTE_NAME;
                    this._index--;
                } else if (!whitespace(c)) {
                    this._cbs.onattribend();
                    this._state = IN_ATTRIBUTE_NAME;
                    this._sectionStart = this._index;
                }
            };

            Tokenizer.prototype._stateBeforeAttributeValue = function (c) {
                if (c === "\"") {
                    this._state = IN_ATTRIBUTE_VALUE_DQ;
                    this._sectionStart = this._index + 1;
                } else if (c === "'") {
                    this._state = IN_ATTRIBUTE_VALUE_SQ;
                    this._sectionStart = this._index + 1;
                } else if (!whitespace(c)) {
                    this._state = IN_ATTRIBUTE_VALUE_NQ;
                    this._sectionStart = this._index;
                    this._index--; //reconsume token
                }
            };

            Tokenizer.prototype._stateInAttributeValueDoubleQuotes = function (c) {
                if (c === "\"") {
                    this._emitToken("onattribdata");
                    this._cbs.onattribend();
                    this._state = BEFORE_ATTRIBUTE_NAME;
                } else if (this._decodeEntities && c === "&") {
                    this._emitToken("onattribdata");
                    this._baseState = this._state;
                    this._state = BEFORE_ENTITY;
                    this._sectionStart = this._index;
                }
            };

            Tokenizer.prototype._stateInAttributeValueSingleQuotes = function (c) {
                if (c === "'") {
                    this._emitToken("onattribdata");
                    this._cbs.onattribend();
                    this._state = BEFORE_ATTRIBUTE_NAME;
                } else if (this._decodeEntities && c === "&") {
                    this._emitToken("onattribdata");
                    this._baseState = this._state;
                    this._state = BEFORE_ENTITY;
                    this._sectionStart = this._index;
                }
            };

            Tokenizer.prototype._stateInAttributeValueNoQuotes = function (c) {
                if (whitespace(c) || c === ">") {
                    this._emitToken("onattribdata");
                    this._cbs.onattribend();
                    this._state = BEFORE_ATTRIBUTE_NAME;
                    this._index--;
                } else if (this._decodeEntities && c === "&") {
                    this._emitToken("onattribdata");
                    this._baseState = this._state;
                    this._state = BEFORE_ENTITY;
                    this._sectionStart = this._index;
                }
            };

            Tokenizer.prototype._stateBeforeDeclaration = function (c) {
                this._state = c === "[" ? BEFORE_CDATA_1 :
                    c === "-" ? BEFORE_COMMENT :
                        IN_DECLARATION;
            };

            Tokenizer.prototype._stateInDeclaration = function (c) {
                if (c === ">") {
                    this._cbs.ondeclaration(this._getSection());
                    this._state = TEXT;
                    this._sectionStart = this._index + 1;
                }
            };

            Tokenizer.prototype._stateInProcessingInstruction = function (c) {
                if (c === ">") {
                    this._cbs.onprocessinginstruction(this._getSection());
                    this._state = TEXT;
                    this._sectionStart = this._index + 1;
                }
            };

            Tokenizer.prototype._stateBeforeComment = function (c) {
                if (c === "-") {
                    this._state = IN_COMMENT;
                    this._sectionStart = this._index + 1;
                } else {
                    this._state = IN_DECLARATION;
                }
            };

            Tokenizer.prototype._stateInComment = function (c) {
                if (c === "-") this._state = AFTER_COMMENT_1;
            };

            Tokenizer.prototype._stateAfterComment1 = function (c) {
                if (c === "-") {
                    this._state = AFTER_COMMENT_2;
                } else {
                    this._state = IN_COMMENT;
                }
            };

            Tokenizer.prototype._stateAfterComment2 = function (c) {
                if (c === ">") {
                    //remove 2 trailing chars
                    this._cbs.oncomment(this._buffer.substring(this._sectionStart, this._index - 2));
                    this._state = TEXT;
                    this._sectionStart = this._index + 1;
                } else if (c !== "-") {
                    this._state = IN_COMMENT;
                }
                // else: stay in AFTER_COMMENT_2 (`--->`)
            };

            Tokenizer.prototype._stateBeforeCdata1 = ifElseState("C", BEFORE_CDATA_2, IN_DECLARATION);
            Tokenizer.prototype._stateBeforeCdata2 = ifElseState("D", BEFORE_CDATA_3, IN_DECLARATION);
            Tokenizer.prototype._stateBeforeCdata3 = ifElseState("A", BEFORE_CDATA_4, IN_DECLARATION);
            Tokenizer.prototype._stateBeforeCdata4 = ifElseState("T", BEFORE_CDATA_5, IN_DECLARATION);
            Tokenizer.prototype._stateBeforeCdata5 = ifElseState("A", BEFORE_CDATA_6, IN_DECLARATION);

            Tokenizer.prototype._stateBeforeCdata6 = function (c) {
                if (c === "[") {
                    this._state = IN_CDATA;
                    this._sectionStart = this._index + 1;
                } else {
                    this._state = IN_DECLARATION;
                    this._index--;
                }
            };

            Tokenizer.prototype._stateInCdata = function (c) {
                if (c === "]") this._state = AFTER_CDATA_1;
            };

            Tokenizer.prototype._stateAfterCdata1 = characterState("]", AFTER_CDATA_2);

            Tokenizer.prototype._stateAfterCdata2 = function (c) {
                if (c === ">") {
                    //remove 2 trailing chars
                    this._cbs.oncdata(this._buffer.substring(this._sectionStart, this._index - 2));
                    this._state = TEXT;
                    this._sectionStart = this._index + 1;
                } else if (c !== "]") {
                    this._state = IN_CDATA;
                }
                //else: stay in AFTER_CDATA_2 (`]]]>`)
            };

            Tokenizer.prototype._stateBeforeSpecial = function (c) {
                if (c === "c" || c === "C") {
                    this._state = BEFORE_SCRIPT_1;
                } else if (c === "t" || c === "T") {
                    this._state = BEFORE_STYLE_1;
                } else {
                    this._state = IN_TAG_NAME;
                    this._index--; //consume the token again
                }
            };

            Tokenizer.prototype._stateBeforeSpecialEnd = function (c) {
                if (this._special === SPECIAL_SCRIPT && (c === "c" || c === "C")) {
                    this._state = AFTER_SCRIPT_1;
                } else if (this._special === SPECIAL_STYLE && (c === "t" || c === "T")) {
                    this._state = AFTER_STYLE_1;
                }
                else this._state = TEXT;
            };

            Tokenizer.prototype._stateBeforeScript1 = consumeSpecialNameChar("R", BEFORE_SCRIPT_2);
            Tokenizer.prototype._stateBeforeScript2 = consumeSpecialNameChar("I", BEFORE_SCRIPT_3);
            Tokenizer.prototype._stateBeforeScript3 = consumeSpecialNameChar("P", BEFORE_SCRIPT_4);
            Tokenizer.prototype._stateBeforeScript4 = consumeSpecialNameChar("T", BEFORE_SCRIPT_5);

            Tokenizer.prototype._stateBeforeScript5 = function (c) {
                if (c === "/" || c === ">" || whitespace(c)) {
                    this._special = SPECIAL_SCRIPT;
                }
                this._state = IN_TAG_NAME;
                this._index--; //consume the token again
            };

            Tokenizer.prototype._stateAfterScript1 = ifElseState("R", AFTER_SCRIPT_2, TEXT);
            Tokenizer.prototype._stateAfterScript2 = ifElseState("I", AFTER_SCRIPT_3, TEXT);
            Tokenizer.prototype._stateAfterScript3 = ifElseState("P", AFTER_SCRIPT_4, TEXT);
            Tokenizer.prototype._stateAfterScript4 = ifElseState("T", AFTER_SCRIPT_5, TEXT);

            Tokenizer.prototype._stateAfterScript5 = function (c) {
                if (c === ">" || whitespace(c)) {
                    this._special = SPECIAL_NONE;
                    this._state = IN_CLOSING_TAG_NAME;
                    this._sectionStart = this._index - 6;
                    this._index--; //reconsume the token
                }
                else this._state = TEXT;
            };

            Tokenizer.prototype._stateBeforeStyle1 = consumeSpecialNameChar("Y", BEFORE_STYLE_2);
            Tokenizer.prototype._stateBeforeStyle2 = consumeSpecialNameChar("L", BEFORE_STYLE_3);
            Tokenizer.prototype._stateBeforeStyle3 = consumeSpecialNameChar("E", BEFORE_STYLE_4);

            Tokenizer.prototype._stateBeforeStyle4 = function (c) {
                if (c === "/" || c === ">" || whitespace(c)) {
                    this._special = SPECIAL_STYLE;
                }
                this._state = IN_TAG_NAME;
                this._index--; //consume the token again
            };

            Tokenizer.prototype._stateAfterStyle1 = ifElseState("Y", AFTER_STYLE_2, TEXT);
            Tokenizer.prototype._stateAfterStyle2 = ifElseState("L", AFTER_STYLE_3, TEXT);
            Tokenizer.prototype._stateAfterStyle3 = ifElseState("E", AFTER_STYLE_4, TEXT);

            Tokenizer.prototype._stateAfterStyle4 = function (c) {
                if (c === ">" || whitespace(c)) {
                    this._special = SPECIAL_NONE;
                    this._state = IN_CLOSING_TAG_NAME;
                    this._sectionStart = this._index - 5;
                    this._index--; //reconsume the token
                }
                else this._state = TEXT;
            };

            Tokenizer.prototype._stateBeforeEntity = ifElseState("#", BEFORE_NUMERIC_ENTITY, IN_NAMED_ENTITY);
            Tokenizer.prototype._stateBeforeNumericEntity = ifElseState("X", IN_HEX_ENTITY, IN_NUMERIC_ENTITY);

//for entities terminated with a semicolon
            Tokenizer.prototype._parseNamedEntityStrict = function () {
                //offset = 1
                if (this._sectionStart + 1 < this._index) {
                    var entity = this._buffer.substring(this._sectionStart + 1, this._index),
                        map = this._xmlMode ? xmlMap : entityMap;

                    if (map.hasOwnProperty(entity)) {
                        this._emitPartial(map[entity]);
                        this._sectionStart = this._index + 1;
                    }
                }
            };

//parses legacy entities (without trailing semicolon)
            Tokenizer.prototype._parseLegacyEntity = function () {
                var start = this._sectionStart + 1,
                    limit = this._index - start;

                if (limit > 6) limit = 6; //the max length of legacy entities is 6

                while (limit >= 2) { //the min length of legacy entities is 2
                    var entity = this._buffer.substr(start, limit);

                    if (legacyMap.hasOwnProperty(entity)) {
                        this._emitPartial(legacyMap[entity]);
                        this._sectionStart += limit + 1;
                        return;
                    } else {
                        limit--;
                    }
                }
            };

            Tokenizer.prototype._stateInNamedEntity = function (c) {
                if (c === ";") {
                    this._parseNamedEntityStrict();
                    if (this._sectionStart + 1 < this._index && !this._xmlMode) {
                        this._parseLegacyEntity();
                    }
                    this._state = this._baseState;
                } else if ((c < "a" || c > "z") && (c < "A" || c > "Z") && (c < "0" || c > "9")) {
                    if (this._xmlMode);
                    else if (this._sectionStart + 1 === this._index);
                    else if (this._baseState !== TEXT) {
                        if (c !== "=") {
                            this._parseNamedEntityStrict();
                        }
                    } else {
                        this._parseLegacyEntity();
                    }

                    this._state = this._baseState;
                    this._index--;
                }
            };

            Tokenizer.prototype._decodeNumericEntity = function (offset, base) {
                var sectionStart = this._sectionStart + offset;

                if (sectionStart !== this._index) {
                    //parse entity
                    var entity = this._buffer.substring(sectionStart, this._index);
                    var parsed = parseInt(entity, base);

                    this._emitPartial(decodeCodePoint(parsed));
                    this._sectionStart = this._index;
                } else {
                    this._sectionStart--;
                }

                this._state = this._baseState;
            };

            Tokenizer.prototype._stateInNumericEntity = function (c) {
                if (c === ";") {
                    this._decodeNumericEntity(2, 10);
                    this._sectionStart++;
                } else if (c < "0" || c > "9") {
                    if (!this._xmlMode) {
                        this._decodeNumericEntity(2, 10);
                    } else {
                        this._state = this._baseState;
                    }
                    this._index--;
                }
            };

            Tokenizer.prototype._stateInHexEntity = function (c) {
                if (c === ";") {
                    this._decodeNumericEntity(3, 16);
                    this._sectionStart++;
                } else if ((c < "a" || c > "f") && (c < "A" || c > "F") && (c < "0" || c > "9")) {
                    if (!this._xmlMode) {
                        this._decodeNumericEntity(3, 16);
                    } else {
                        this._state = this._baseState;
                    }
                    this._index--;
                }
            };

            Tokenizer.prototype._cleanup = function () {
                if (this._sectionStart < 0) {
                    this._buffer = "";
                    this._index = 0;
                    this._bufferOffset += this._index;
                } else if (this._running) {
                    if (this._state === TEXT) {
                        if (this._sectionStart !== this._index) {
                            this._cbs.ontext(this._buffer.substr(this._sectionStart));
                        }
                        this._buffer = "";
                        this._index = 0;
                        this._bufferOffset += this._index;
                    } else if (this._sectionStart === this._index) {
                        //the section just started
                        this._buffer = "";
                        this._index = 0;
                        this._bufferOffset += this._index;
                    } else {
                        //remove everything unnecessary
                        this._buffer = this._buffer.substr(this._sectionStart);
                        this._index -= this._sectionStart;
                        this._bufferOffset += this._sectionStart;
                    }

                    this._sectionStart = 0;
                }
            };

//TODO make events conditional
            Tokenizer.prototype.write = function (chunk) {
                if (this._ended) this._cbs.onerror(Error(".write() after done!"));

                this._buffer += chunk;
                this._parse();
            };

            Tokenizer.prototype._parse = function () {
                while (this._index < this._buffer.length && this._running) {
                    var c = this._buffer.charAt(this._index);
                    if (this._state === TEXT) {
                        this._stateText(c);
                    } else if (this._state === BEFORE_TAG_NAME) {
                        this._stateBeforeTagName(c);
                    } else if (this._state === IN_TAG_NAME) {
                        this._stateInTagName(c);
                    } else if (this._state === BEFORE_CLOSING_TAG_NAME) {
                        this._stateBeforeCloseingTagName(c);
                    } else if (this._state === IN_CLOSING_TAG_NAME) {
                        this._stateInCloseingTagName(c);
                    } else if (this._state === AFTER_CLOSING_TAG_NAME) {
                        this._stateAfterCloseingTagName(c);
                    } else if (this._state === IN_SELF_CLOSING_TAG) {
                        this._stateInSelfClosingTag(c);
                    }

                    /*
                     *	attributes
                     */
                    else if (this._state === BEFORE_ATTRIBUTE_NAME) {
                        this._stateBeforeAttributeName(c);
                    } else if (this._state === IN_ATTRIBUTE_NAME) {
                        this._stateInAttributeName(c);
                    } else if (this._state === AFTER_ATTRIBUTE_NAME) {
                        this._stateAfterAttributeName(c);
                    } else if (this._state === BEFORE_ATTRIBUTE_VALUE) {
                        this._stateBeforeAttributeValue(c);
                    } else if (this._state === IN_ATTRIBUTE_VALUE_DQ) {
                        this._stateInAttributeValueDoubleQuotes(c);
                    } else if (this._state === IN_ATTRIBUTE_VALUE_SQ) {
                        this._stateInAttributeValueSingleQuotes(c);
                    } else if (this._state === IN_ATTRIBUTE_VALUE_NQ) {
                        this._stateInAttributeValueNoQuotes(c);
                    }

                    /*
                     *	declarations
                     */
                    else if (this._state === BEFORE_DECLARATION) {
                        this._stateBeforeDeclaration(c);
                    } else if (this._state === IN_DECLARATION) {
                        this._stateInDeclaration(c);
                    }

                    /*
                     *	processing instructions
                     */
                    else if (this._state === IN_PROCESSING_INSTRUCTION) {
                        this._stateInProcessingInstruction(c);
                    }

                    /*
                     *	comments
                     */
                    else if (this._state === BEFORE_COMMENT) {
                        this._stateBeforeComment(c);
                    } else if (this._state === IN_COMMENT) {
                        this._stateInComment(c);
                    } else if (this._state === AFTER_COMMENT_1) {
                        this._stateAfterComment1(c);
                    } else if (this._state === AFTER_COMMENT_2) {
                        this._stateAfterComment2(c);
                    }

                    /*
                     *	cdata
                     */
                    else if (this._state === BEFORE_CDATA_1) {
                        this._stateBeforeCdata1(c);
                    } else if (this._state === BEFORE_CDATA_2) {
                        this._stateBeforeCdata2(c);
                    } else if (this._state === BEFORE_CDATA_3) {
                        this._stateBeforeCdata3(c);
                    } else if (this._state === BEFORE_CDATA_4) {
                        this._stateBeforeCdata4(c);
                    } else if (this._state === BEFORE_CDATA_5) {
                        this._stateBeforeCdata5(c);
                    } else if (this._state === BEFORE_CDATA_6) {
                        this._stateBeforeCdata6(c);
                    } else if (this._state === IN_CDATA) {
                        this._stateInCdata(c);
                    } else if (this._state === AFTER_CDATA_1) {
                        this._stateAfterCdata1(c);
                    } else if (this._state === AFTER_CDATA_2) {
                        this._stateAfterCdata2(c);
                    }

                    /*
                     * special tags
                     */
                    else if (this._state === BEFORE_SPECIAL) {
                        this._stateBeforeSpecial(c);
                    } else if (this._state === BEFORE_SPECIAL_END) {
                        this._stateBeforeSpecialEnd(c);
                    }

                    /*
                     * script
                     */
                    else if (this._state === BEFORE_SCRIPT_1) {
                        this._stateBeforeScript1(c);
                    } else if (this._state === BEFORE_SCRIPT_2) {
                        this._stateBeforeScript2(c);
                    } else if (this._state === BEFORE_SCRIPT_3) {
                        this._stateBeforeScript3(c);
                    } else if (this._state === BEFORE_SCRIPT_4) {
                        this._stateBeforeScript4(c);
                    } else if (this._state === BEFORE_SCRIPT_5) {
                        this._stateBeforeScript5(c);
                    }

                    else if (this._state === AFTER_SCRIPT_1) {
                        this._stateAfterScript1(c);
                    } else if (this._state === AFTER_SCRIPT_2) {
                        this._stateAfterScript2(c);
                    } else if (this._state === AFTER_SCRIPT_3) {
                        this._stateAfterScript3(c);
                    } else if (this._state === AFTER_SCRIPT_4) {
                        this._stateAfterScript4(c);
                    } else if (this._state === AFTER_SCRIPT_5) {
                        this._stateAfterScript5(c);
                    }

                    /*
                     * style
                     */
                    else if (this._state === BEFORE_STYLE_1) {
                        this._stateBeforeStyle1(c);
                    } else if (this._state === BEFORE_STYLE_2) {
                        this._stateBeforeStyle2(c);
                    } else if (this._state === BEFORE_STYLE_3) {
                        this._stateBeforeStyle3(c);
                    } else if (this._state === BEFORE_STYLE_4) {
                        this._stateBeforeStyle4(c);
                    }

                    else if (this._state === AFTER_STYLE_1) {
                        this._stateAfterStyle1(c);
                    } else if (this._state === AFTER_STYLE_2) {
                        this._stateAfterStyle2(c);
                    } else if (this._state === AFTER_STYLE_3) {
                        this._stateAfterStyle3(c);
                    } else if (this._state === AFTER_STYLE_4) {
                        this._stateAfterStyle4(c);
                    }

                    /*
                     * entities
                     */
                    else if (this._state === BEFORE_ENTITY) {
                        this._stateBeforeEntity(c);
                    } else if (this._state === BEFORE_NUMERIC_ENTITY) {
                        this._stateBeforeNumericEntity(c);
                    } else if (this._state === IN_NAMED_ENTITY) {
                        this._stateInNamedEntity(c);
                    } else if (this._state === IN_NUMERIC_ENTITY) {
                        this._stateInNumericEntity(c);
                    } else if (this._state === IN_HEX_ENTITY) {
                        this._stateInHexEntity(c);
                    }

                    else {
                        this._cbs.onerror(Error("unknown _state"), this._state);
                    }

                    this._index++;
                }

                this._cleanup();
            };

            Tokenizer.prototype.pause = function () {
                this._running = false;
            };
            Tokenizer.prototype.resume = function () {
                this._running = true;

                if (this._index < this._buffer.length) {
                    this._parse();
                }
                if (this._ended) {
                    this._finish();
                }
            };

            Tokenizer.prototype.end = function (chunk) {
                if (this._ended) this._cbs.onerror(Error(".end() after done!"));
                if (chunk) this.write(chunk);

                this._ended = true;

                if (this._running) this._finish();
            };

            Tokenizer.prototype._finish = function () {
                //if there is remaining data, emit it in a reasonable way
                if (this._sectionStart < this._index) {
                    this._handleTrailingData();
                }

                this._cbs.onend();
            };

            Tokenizer.prototype._handleTrailingData = function () {
                var data = this._buffer.substr(this._sectionStart);

                if (this._state === IN_CDATA || this._state === AFTER_CDATA_1 || this._state === AFTER_CDATA_2) {
                    this._cbs.oncdata(data);
                } else if (this._state === IN_COMMENT || this._state === AFTER_COMMENT_1 || this._state === AFTER_COMMENT_2) {
                    this._cbs.oncomment(data);
                } else if (this._state === IN_NAMED_ENTITY && !this._xmlMode) {
                    this._parseLegacyEntity();
                    if (this._sectionStart < this._index) {
                        this._state = this._baseState;
                        this._handleTrailingData();
                    }
                } else if (this._state === IN_NUMERIC_ENTITY && !this._xmlMode) {
                    this._decodeNumericEntity(2, 10);
                    if (this._sectionStart < this._index) {
                        this._state = this._baseState;
                        this._handleTrailingData();
                    }
                } else if (this._state === IN_HEX_ENTITY && !this._xmlMode) {
                    this._decodeNumericEntity(3, 16);
                    if (this._sectionStart < this._index) {
                        this._state = this._baseState;
                        this._handleTrailingData();
                    }
                } else if (
                    this._state !== IN_TAG_NAME &&
                    this._state !== BEFORE_ATTRIBUTE_NAME &&
                    this._state !== BEFORE_ATTRIBUTE_VALUE &&
                    this._state !== AFTER_ATTRIBUTE_NAME &&
                    this._state !== IN_ATTRIBUTE_NAME &&
                    this._state !== IN_ATTRIBUTE_VALUE_SQ &&
                    this._state !== IN_ATTRIBUTE_VALUE_DQ &&
                    this._state !== IN_ATTRIBUTE_VALUE_NQ &&
                    this._state !== IN_CLOSING_TAG_NAME
                ) {
                    this._cbs.ontext(data);
                }
                //else, ignore remaining data
                //TODO add a way to remove current tag
            };

            Tokenizer.prototype.reset = function () {
                Tokenizer.call(this, {xmlMode: this._xmlMode, decodeEntities: this._decodeEntities}, this._cbs);
            };

            Tokenizer.prototype.getAbsoluteIndex = function () {
                return this._bufferOffset + this._index;
            };

            Tokenizer.prototype._getSection = function () {
                return this._buffer.substring(this._sectionStart, this._index);
            };

            Tokenizer.prototype._emitToken = function (name) {
                this._cbs[name](this._getSection());
                this._sectionStart = -1;
            };

            Tokenizer.prototype._emitPartial = function (value) {
                if (this._baseState !== TEXT) {
                    this._cbs.onattribdata(value); //TODO implement the new event
                } else {
                    this._cbs.ontext(value);
                }
            };

        }, {
            "entities/lib/decode_codepoint.js": 29,
            "entities/maps/entities.json": 31,
            "entities/maps/legacy.json": 32,
            "entities/maps/xml.json": 33
        }],
        7: [function (_dereq_, module, exports) {
            module.exports = Stream;

            var Parser = _dereq_("./Parser.js"),
                WritableStream = _dereq_("stream").Writable || _dereq_("readable-stream").Writable;

            function Stream(cbs, options) {
                var parser = this._parser = new Parser(cbs, options);

                WritableStream.call(this, {decodeStrings: false});

                this.once("finish", function () {
                    parser.end();
                });
            }

            _dereq_("util").inherits(Stream, WritableStream);

            WritableStream.prototype._write = function (chunk, encoding, cb) {
                this._parser.write(chunk);
                cb();
            };
        }, {"./Parser.js": 3, "readable-stream": 34, "stream": 54, "util": 57}],
        8: [function (_dereq_, module, exports) {
//Types of elements found in the DOM
            module.exports = {
                Text: "text", //Text
                Directive: "directive", //<? ... ?>
                Comment: "comment", //<!-- ... -->
                Script: "script", //<script> tags
                Style: "style", //<style> tags
                Tag: "tag", //Any tag
                CDATA: "cdata", //<![CDATA[ ... ]]>
                Doctype: "doctype",

                isTag: function (elem) {
                    return elem.type === "tag" || elem.type === "script" || elem.type === "style";
                }
            };

        }, {}],
        9: [function (_dereq_, module, exports) {
            var ElementType = _dereq_("domelementtype");

            var re_whitespace = /\s+/g;
            var NodePrototype = _dereq_("./lib/node");
            var ElementPrototype = _dereq_("./lib/element");

            function DomHandler(callback, options, elementCB) {
                if (typeof callback === "object") {
                    elementCB = options;
                    options = callback;
                    callback = null;
                } else if (typeof options === "function") {
                    elementCB = options;
                    options = defaultOpts;
                }
                this._callback = callback;
                this._options = options || defaultOpts;
                this._elementCB = elementCB;
                this.dom = [];
                this._done = false;
                this._tagStack = [];
                this._parser = this._parser || null;
            }

//default options
            var defaultOpts = {
                normalizeWhitespace: false, //Replace all whitespace with single spaces
                withStartIndices: false, //Add startIndex properties to nodes
            };

            DomHandler.prototype.onparserinit = function (parser) {
                this._parser = parser;
            };

//Resets the handler back to starting state
            DomHandler.prototype.onreset = function () {
                DomHandler.call(this, this._callback, this._options, this._elementCB);
            };

//Signals the handler that parsing is done
            DomHandler.prototype.onend = function () {
                if (this._done) return;
                this._done = true;
                this._parser = null;
                this._handleCallback(null);
            };

            DomHandler.prototype._handleCallback =
                DomHandler.prototype.onerror = function (error) {
                    if (typeof this._callback === "function") {
                        this._callback(error, this.dom);
                    } else {
                        if (error) throw error;
                    }
                };

            DomHandler.prototype.onclosetag = function () {
                //if(this._tagStack.pop().name !== name) this._handleCallback(Error("Tagname didn't match!"));
                var elem = this._tagStack.pop();
                if (this._elementCB) this._elementCB(elem);
            };

            DomHandler.prototype._addDomElement = function (element) {
                var parent = this._tagStack[this._tagStack.length - 1];
                var siblings = parent ? parent.children : this.dom;
                var previousSibling = siblings[siblings.length - 1];

                element.next = null;

                if (this._options.withStartIndices) {
                    element.startIndex = this._parser.startIndex;
                }

                if (this._options.withDomLvl1) {
                    element.__proto__ = element.type === "tag" ? ElementPrototype : NodePrototype;
                }

                if (previousSibling) {
                    element.prev = previousSibling;
                    previousSibling.next = element;
                } else {
                    element.prev = null;
                }

                siblings.push(element);
                element.parent = parent || null;
            };

            DomHandler.prototype.onopentag = function (name, attribs) {
                var element = {
                    type: name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag,
                    name: name,
                    attribs: attribs,
                    children: []
                };

                this._addDomElement(element);

                this._tagStack.push(element);
            };

            DomHandler.prototype.ontext = function (data) {
                //the ignoreWhitespace is officially dropped, but for now,
                //it's an alias for normalizeWhitespace
                var normalize = this._options.normalizeWhitespace || this._options.ignoreWhitespace;

                var lastTag;

                if (!this._tagStack.length && this.dom.length && (lastTag = this.dom[this.dom.length - 1]).type === ElementType.Text) {
                    if (normalize) {
                        lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
                    } else {
                        lastTag.data += data;
                    }
                } else {
                    if (
                        this._tagStack.length &&
                        (lastTag = this._tagStack[this._tagStack.length - 1]) &&
                        (lastTag = lastTag.children[lastTag.children.length - 1]) &&
                        lastTag.type === ElementType.Text
                    ) {
                        if (normalize) {
                            lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
                        } else {
                            lastTag.data += data;
                        }
                    } else {
                        if (normalize) {
                            data = data.replace(re_whitespace, " ");
                        }

                        this._addDomElement({
                            data: data,
                            type: ElementType.Text
                        });
                    }
                }
            };

            DomHandler.prototype.oncomment = function (data) {
                var lastTag = this._tagStack[this._tagStack.length - 1];

                if (lastTag && lastTag.type === ElementType.Comment) {
                    lastTag.data += data;
                    return;
                }

                var element = {
                    data: data,
                    type: ElementType.Comment
                };

                this._addDomElement(element);
                this._tagStack.push(element);
            };

            DomHandler.prototype.oncdatastart = function () {
                var element = {
                    children: [{
                        data: "",
                        type: ElementType.Text
                    }],
                    type: ElementType.CDATA
                };

                this._addDomElement(element);
                this._tagStack.push(element);
            };

            DomHandler.prototype.oncommentend = DomHandler.prototype.oncdataend = function () {
                this._tagStack.pop();
            };

            DomHandler.prototype.onprocessinginstruction = function (name, data) {
                this._addDomElement({
                    name: name,
                    data: data,
                    type: ElementType.Directive
                });
            };

            module.exports = DomHandler;

        }, {"./lib/element": 10, "./lib/node": 11, "domelementtype": 8}],
        10: [function (_dereq_, module, exports) {
// DOM-Level-1-compliant structure
            var NodePrototype = _dereq_('./node');
            var ElementPrototype = module.exports = Object.create(NodePrototype);

            var domLvl1 = {
                tagName: "name"
            };

            Object.keys(domLvl1).forEach(function (key) {
                var shorthand = domLvl1[key];
                Object.defineProperty(ElementPrototype, key, {
                    get: function () {
                        return this[shorthand] || null;
                    },
                    set: function (val) {
                        this[shorthand] = val;
                        return val;
                    }
                });
            });

        }, {"./node": 11}],
        11: [function (_dereq_, module, exports) {
// This object will be used as the prototype for Nodes when creating a
// DOM-Level-1-compliant structure.
            var NodePrototype = module.exports = {
                get firstChild() {
                    var children = this.children;
                    return children && children[0] || null;
                },
                get lastChild() {
                    var children = this.children;
                    return children && children[children.length - 1] || null;
                },
                get nodeType() {
                    return nodeTypes[this.type] || nodeTypes.element;
                }
            };

            var domLvl1 = {
                tagName: "name",
                childNodes: "children",
                parentNode: "parent",
                previousSibling: "prev",
                nextSibling: "next",
                nodeValue: "data"
            };

            var nodeTypes = {
                element: 1,
                text: 3,
                cdata: 4,
                comment: 8
            };

            Object.keys(domLvl1).forEach(function (key) {
                var shorthand = domLvl1[key];
                Object.defineProperty(NodePrototype, key, {
                    get: function () {
                        return this[shorthand] || null;
                    },
                    set: function (val) {
                        this[shorthand] = val;
                        return val;
                    }
                });
            });

        }, {}],
        12: [function (_dereq_, module, exports) {
            var DomUtils = module.exports;

            [
                _dereq_("./lib/stringify"),
                _dereq_("./lib/traversal"),
                _dereq_("./lib/manipulation"),
                _dereq_("./lib/querying"),
                _dereq_("./lib/legacy"),
                _dereq_("./lib/helpers")
            ].forEach(function (ext) {
                Object.keys(ext).forEach(function (key) {
                    DomUtils[key] = ext[key].bind(DomUtils);
                });
            });

        }, {
            "./lib/helpers": 13,
            "./lib/legacy": 14,
            "./lib/manipulation": 15,
            "./lib/querying": 16,
            "./lib/stringify": 17,
            "./lib/traversal": 18
        }],
        13: [function (_dereq_, module, exports) {
// removeSubsets
// Given an array of nodes, remove any member that is contained by another.
            exports.removeSubsets = function (nodes) {
                var idx = nodes.length, node, ancestor, replace;

                // Check if each node (or one of its ancestors) is already contained in the
                // array.
                while (--idx > -1) {
                    node = ancestor = nodes[idx];

                    // Temporarily remove the node under consideration
                    nodes[idx] = null;
                    replace = true;

                    while (ancestor) {
                        if (nodes.indexOf(ancestor) > -1) {
                            replace = false;
                            nodes.splice(idx, 1);
                            break;
                        }
                        ancestor = ancestor.parent;
                    }

                    // If the node has been found to be unique, re-insert it.
                    if (replace) {
                        nodes[idx] = node;
                    }
                }

                return nodes;
            };

// Source: http://dom.spec.whatwg.org/#dom-node-comparedocumentposition
            var POSITION = {
                DISCONNECTED: 1,
                PRECEDING: 2,
                FOLLOWING: 4,
                CONTAINS: 8,
                CONTAINED_BY: 16
            };

// Compare the position of one node against another node in any other document.
// The return value is a bitmask with the following values:
//
// document order:
// > There is an ordering, document order, defined on all the nodes in the
// > document corresponding to the order in which the first character of the
// > XML representation of each node occurs in the XML representation of the
// > document after expansion of general entities. Thus, the document element
// > node will be the first node. Element nodes occur before their children.
// > Thus, document order orders element nodes in order of the occurrence of
// > their start-tag in the XML (after expansion of entities). The attribute
// > nodes of an element occur after the element and before its children. The
// > relative order of attribute nodes is implementation-dependent./
// Source:
// http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
//
// @argument {Node} nodaA The first node to use in the comparison
// @argument {Node} nodeB The second node to use in the comparison
//
// @return {Number} A bitmask describing the input nodes' relative position.
//         See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
//         a description of these values.
            var comparePos = exports.compareDocumentPosition = function (nodeA, nodeB) {
                var aParents = [];
                var bParents = [];
                var current, sharedParent, siblings, aSibling, bSibling, idx;

                if (nodeA === nodeB) {
                    return 0;
                }

                current = nodeA;
                while (current) {
                    aParents.unshift(current);
                    current = current.parent;
                }
                current = nodeB;
                while (current) {
                    bParents.unshift(current);
                    current = current.parent;
                }

                idx = 0;
                while (aParents[idx] === bParents[idx]) {
                    idx++;
                }

                if (idx === 0) {
                    return POSITION.DISCONNECTED;
                }

                sharedParent = aParents[idx - 1];
                siblings = sharedParent.children;
                aSibling = aParents[idx];
                bSibling = bParents[idx];

                if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
                    if (sharedParent === nodeB) {
                        return POSITION.FOLLOWING | POSITION.CONTAINED_BY;
                    }
                    return POSITION.FOLLOWING;
                } else {
                    if (sharedParent === nodeA) {
                        return POSITION.PRECEDING | POSITION.CONTAINS;
                    }
                    return POSITION.PRECEDING;
                }
            };

// Sort an array of nodes based on their relative position in the document and
// remove any duplicate nodes. If the array contains nodes that do not belong
// to the same document, sort order is unspecified.
//
// @argument {Array} nodes Array of DOM nodes
//
// @returns {Array} collection of unique nodes, sorted in document order
            exports.uniqueSort = function (nodes) {
                var idx = nodes.length, node, position;

                nodes = nodes.slice();

                while (--idx > -1) {
                    node = nodes[idx];
                    position = nodes.indexOf(node);
                    if (position > -1 && position < idx) {
                        nodes.splice(idx, 1);
                    }
                }
                nodes.sort(function (a, b) {
                    var relative = comparePos(a, b);
                    if (relative & POSITION.PRECEDING) {
                        return -1;
                    } else if (relative & POSITION.FOLLOWING) {
                        return 1;
                    }
                    return 0;
                });

                return nodes;
            };

        }, {}],
        14: [function (_dereq_, module, exports) {
            var ElementType = _dereq_("domelementtype");
            var isTag = exports.isTag = ElementType.isTag;

            exports.testElement = function (options, element) {
                for (var key in options) {
                    if (!options.hasOwnProperty(key));
                    else if (key === "tag_name") {
                        if (!isTag(element) || !options.tag_name(element.name)) {
                            return false;
                        }
                    } else if (key === "tag_type") {
                        if (!options.tag_type(element.type)) return false;
                    } else if (key === "tag_contains") {
                        if (isTag(element) || !options.tag_contains(element.data)) {
                            return false;
                        }
                    } else if (!element.attribs || !options[key](element.attribs[key])) {
                        return false;
                    }
                }
                return true;
            };

            var Checks = {
                tag_name: function (name) {
                    if (typeof name === "function") {
                        return function (elem) {
                            return isTag(elem) && name(elem.name);
                        };
                    } else if (name === "*") {
                        return isTag;
                    } else {
                        return function (elem) {
                            return isTag(elem) && elem.name === name;
                        };
                    }
                },
                tag_type: function (type) {
                    if (typeof type === "function") {
                        return function (elem) {
                            return type(elem.type);
                        };
                    } else {
                        return function (elem) {
                            return elem.type === type;
                        };
                    }
                },
                tag_contains: function (data) {
                    if (typeof data === "function") {
                        return function (elem) {
                            return !isTag(elem) && data(elem.data);
                        };
                    } else {
                        return function (elem) {
                            return !isTag(elem) && elem.data === data;
                        };
                    }
                }
            };

            function getAttribCheck(attrib, value) {
                if (typeof value === "function") {
                    return function (elem) {
                        return elem.attribs && value(elem.attribs[attrib]);
                    };
                } else {
                    return function (elem) {
                        return elem.attribs && elem.attribs[attrib] === value;
                    };
                }
            }

            function combineFuncs(a, b) {
                return function (elem) {
                    return a(elem) || b(elem);
                };
            }

            exports.getElements = function (options, element, recurse, limit) {
                var funcs = Object.keys(options).map(function (key) {
                    var value = options[key];
                    return key in Checks ? Checks[key](value) : getAttribCheck(key, value);
                });

                return funcs.length === 0 ? [] : this.filter(
                        funcs.reduce(combineFuncs),
                        element, recurse, limit
                    );
            };

            exports.getElementById = function (id, element, recurse) {
                if (!Array.isArray(element)) element = [element];
                return this.findOne(getAttribCheck("id", id), element, recurse !== false);
            };

            exports.getElementsByTagName = function (name, element, recurse, limit) {
                return this.filter(Checks.tag_name(name), element, recurse, limit);
            };

            exports.getElementsByTagType = function (type, element, recurse, limit) {
                return this.filter(Checks.tag_type(type), element, recurse, limit);
            };

        }, {"domelementtype": 8}],
        15: [function (_dereq_, module, exports) {
            exports.removeElement = function (elem) {
                if (elem.prev) elem.prev.next = elem.next;
                if (elem.next) elem.next.prev = elem.prev;

                if (elem.parent) {
                    var childs = elem.parent.children;
                    childs.splice(childs.lastIndexOf(elem), 1);
                }
            };

            exports.replaceElement = function (elem, replacement) {
                var prev = replacement.prev = elem.prev;
                if (prev) {
                    prev.next = replacement;
                }

                var next = replacement.next = elem.next;
                if (next) {
                    next.prev = replacement;
                }

                var parent = replacement.parent = elem.parent;
                if (parent) {
                    var childs = parent.children;
                    childs[childs.lastIndexOf(elem)] = replacement;
                }
            };

            exports.appendChild = function (elem, child) {
                child.parent = elem;

                if (elem.children.push(child) !== 1) {
                    var sibling = elem.children[elem.children.length - 2];
                    sibling.next = child;
                    child.prev = sibling;
                    child.next = null;
                }
            };

            exports.append = function (elem, next) {
                var parent = elem.parent,
                    currNext = elem.next;

                next.next = currNext;
                next.prev = elem;
                elem.next = next;
                next.parent = parent;

                if (currNext) {
                    currNext.prev = next;
                    if (parent) {
                        var childs = parent.children;
                        childs.splice(childs.lastIndexOf(currNext), 0, next);
                    }
                } else if (parent) {
                    parent.children.push(next);
                }
            };

            exports.prepend = function (elem, prev) {
                var parent = elem.parent;
                if (parent) {
                    var childs = parent.children;
                    childs.splice(childs.lastIndexOf(elem), 0, prev);
                }

                if (elem.prev) {
                    elem.prev.next = prev;
                }

                prev.parent = parent;
                prev.prev = elem.prev;
                prev.next = elem;
                elem.prev = prev;
            };

        }, {}],
        16: [function (_dereq_, module, exports) {
            var isTag = _dereq_("domelementtype").isTag;

            module.exports = {
                filter: filter,
                find: find,
                findOneChild: findOneChild,
                findOne: findOne,
                existsOne: existsOne,
                findAll: findAll
            };

            function filter(test, element, recurse, limit) {
                if (!Array.isArray(element)) element = [element];

                if (typeof limit !== "number" || !isFinite(limit)) {
                    limit = Infinity;
                }
                return find(test, element, recurse !== false, limit);
            }

            function find(test, elems, recurse, limit) {
                var result = [], childs;

                for (var i = 0, j = elems.length; i < j; i++) {
                    if (test(elems[i])) {
                        result.push(elems[i]);
                        if (--limit <= 0) break;
                    }

                    childs = elems[i].children;
                    if (recurse && childs && childs.length > 0) {
                        childs = find(test, childs, recurse, limit);
                        result = result.concat(childs);
                        limit -= childs.length;
                        if (limit <= 0) break;
                    }
                }

                return result;
            }

            function findOneChild(test, elems) {
                for (var i = 0, l = elems.length; i < l; i++) {
                    if (test(elems[i])) return elems[i];
                }

                return null;
            }

            function findOne(test, elems) {
                var elem = null;

                for (var i = 0, l = elems.length; i < l && !elem; i++) {
                    if (!isTag(elems[i])) {
                        continue;
                    } else if (test(elems[i])) {
                        elem = elems[i];
                    } else if (elems[i].children.length > 0) {
                        elem = findOne(test, elems[i].children);
                    }
                }

                return elem;
            }

            function existsOne(test, elems) {
                for (var i = 0, l = elems.length; i < l; i++) {
                    if (
                        isTag(elems[i]) && (
                            test(elems[i]) || (
                                elems[i].children.length > 0 &&
                                existsOne(test, elems[i].children)
                            )
                        )
                    ) {
                        return true;
                    }
                }

                return false;
            }

            function findAll(test, elems) {
                var result = [];
                for (var i = 0, j = elems.length; i < j; i++) {
                    if (!isTag(elems[i])) continue;
                    if (test(elems[i])) result.push(elems[i]);

                    if (elems[i].children.length > 0) {
                        result = result.concat(findAll(test, elems[i].children));
                    }
                }
                return result;
            }

        }, {"domelementtype": 8}],
        17: [function (_dereq_, module, exports) {
            var ElementType = _dereq_("domelementtype"),
                getOuterHTML = _dereq_("dom-serializer"),
                isTag = ElementType.isTag;

            module.exports = {
                getInnerHTML: getInnerHTML,
                getOuterHTML: getOuterHTML,
                getText: getText
            };

            function getInnerHTML(elem, opts) {
                return elem.children ? elem.children.map(function (elem) {
                        return getOuterHTML(elem, opts);
                    }).join("") : "";
            }

            function getText(elem) {
                if (Array.isArray(elem)) return elem.map(getText).join("");
                if (isTag(elem) || elem.type === ElementType.CDATA) return getText(elem.children);
                if (elem.type === ElementType.Text) return elem.data;
                return "";
            }

        }, {"dom-serializer": 19, "domelementtype": 8}],
        18: [function (_dereq_, module, exports) {
            var getChildren = exports.getChildren = function (elem) {
                return elem.children;
            };

            var getParent = exports.getParent = function (elem) {
                return elem.parent;
            };

            exports.getSiblings = function (elem) {
                var parent = getParent(elem);
                return parent ? getChildren(parent) : [elem];
            };

            exports.getAttributeValue = function (elem, name) {
                return elem.attribs && elem.attribs[name];
            };

            exports.hasAttrib = function (elem, name) {
                return !!elem.attribs && hasOwnProperty.call(elem.attribs, name);
            };

            exports.getName = function (elem) {
                return elem.name;
            };

        }, {}],
        19: [function (_dereq_, module, exports) {
            /*
             Module dependencies
             */
            var ElementType = _dereq_('domelementtype');
            var entities = _dereq_('entities');

            /*
             Boolean Attributes
             */
            var booleanAttributes = {
                __proto__: null,
                allowfullscreen: true,
                async: true,
                autofocus: true,
                autoplay: true,
                checked: true,
                controls: true,
                default: true,
                defer: true,
                disabled: true,
                hidden: true,
                ismap: true,
                loop: true,
                multiple: true,
                muted: true,
                open: true,
                readonly: true,
                required: true,
                reversed: true,
                scoped: true,
                seamless: true,
                selected: true,
                typemustmatch: true
            };

            var unencodedElements = {
                __proto__: null,
                style: true,
                script: true,
                xmp: true,
                iframe: true,
                noembed: true,
                noframes: true,
                plaintext: true,
                noscript: true
            };

            /*
             Format attributes
             */
            function formatAttrs(attributes, opts) {
                if (!attributes) return;

                var output = '',
                    value;

                // Loop through the attributes
                for (var key in attributes) {
                    value = attributes[key];
                    if (output) {
                        output += ' ';
                    }

                    if (!value && booleanAttributes[key]) {
                        output += key;
                    } else {
                        output += key + '="' + (opts.decodeEntities ? entities.encodeXML(value) : value) + '"';
                    }
                }

                return output;
            }

            /*
             Self-enclosing tags (stolen from node-htmlparser)
             */
            var singleTag = {
                __proto__: null,
                area: true,
                base: true,
                basefont: true,
                br: true,
                col: true,
                command: true,
                embed: true,
                frame: true,
                hr: true,
                img: true,
                input: true,
                isindex: true,
                keygen: true,
                link: true,
                meta: true,
                param: true,
                source: true,
                track: true,
                wbr: true,
            };

            var render = module.exports = function (dom, opts) {
                if (!Array.isArray(dom) && !dom.cheerio) dom = [dom];
                opts = opts || {};

                var output = '';

                for (var i = 0; i < dom.length; i++) {
                    var elem = dom[i];

                    if (elem.type === 'root')
                        output += render(elem.children, opts);
                    else if (ElementType.isTag(elem))
                        output += renderTag(elem, opts);
                    else if (elem.type === ElementType.Directive)
                        output += renderDirective(elem);
                    else if (elem.type === ElementType.Comment)
                        output += renderComment(elem);
                    else if (elem.type === ElementType.CDATA)
                        output += renderCdata(elem);
                    else
                        output += renderText(elem, opts);
                }

                return output;
            };

            function renderTag(elem, opts) {
                // Handle SVG
                if (elem.name === "svg") opts = {decodeEntities: opts.decodeEntities, xmlMode: true};

                var tag = '<' + elem.name,
                    attribs = formatAttrs(elem.attribs, opts);

                if (attribs) {
                    tag += ' ' + attribs;
                }

                if (
                    opts.xmlMode
                    && (!elem.children || elem.children.length === 0)
                ) {
                    tag += '/>';
                } else {
                    tag += '>';
                    if (elem.children) {
                        tag += render(elem.children, opts);
                    }

                    if (!singleTag[elem.name] || opts.xmlMode) {
                        tag += '</' + elem.name + '>';
                    }
                }

                return tag;
            }

            function renderDirective(elem) {
                return '<' + elem.data + '>';
            }

            function renderText(elem, opts) {
                var data = elem.data || '';

                // if entities weren't decoded, no need to encode them back
                if (opts.decodeEntities && !(elem.parent && elem.parent.name in unencodedElements)) {
                    data = entities.encodeXML(data);
                }

                return data;
            }

            function renderCdata(elem) {
                return '<![CDATA[' + elem.children[0].data + ']]>';
            }

            function renderComment(elem) {
                return '<!--' + elem.data + '-->';
            }

        }, {"domelementtype": 20, "entities": 21}],
        20: [function (_dereq_, module, exports) {
//Types of elements found in the DOM
            module.exports = {
                Text: "text", //Text
                Directive: "directive", //<? ... ?>
                Comment: "comment", //<!-- ... -->
                Script: "script", //<script> tags
                Style: "style", //<style> tags
                Tag: "tag", //Any tag
                CDATA: "cdata", //<![CDATA[ ... ]]>

                isTag: function (elem) {
                    return elem.type === "tag" || elem.type === "script" || elem.type === "style";
                }
            };
        }, {}],
        21: [function (_dereq_, module, exports) {
            var encode = _dereq_("./lib/encode.js"),
                decode = _dereq_("./lib/decode.js");

            exports.decode = function (data, level) {
                return (!level || level <= 0 ? decode.XML : decode.HTML)(data);
            };

            exports.decodeStrict = function (data, level) {
                return (!level || level <= 0 ? decode.XML : decode.HTMLStrict)(data);
            };

            exports.encode = function (data, level) {
                return (!level || level <= 0 ? encode.XML : encode.HTML)(data);
            };

            exports.encodeXML = encode.XML;

            exports.encodeHTML4 =
                exports.encodeHTML5 =
                    exports.encodeHTML = encode.HTML;

            exports.decodeXML =
                exports.decodeXMLStrict = decode.XML;

            exports.decodeHTML4 =
                exports.decodeHTML5 =
                    exports.decodeHTML = decode.HTML;

            exports.decodeHTML4Strict =
                exports.decodeHTML5Strict =
                    exports.decodeHTMLStrict = decode.HTMLStrict;

            exports.escape = encode.escape;

        }, {"./lib/decode.js": 22, "./lib/encode.js": 24}],
        22: [function (_dereq_, module, exports) {
            var entityMap = _dereq_("../maps/entities.json"),
                legacyMap = _dereq_("../maps/legacy.json"),
                xmlMap = _dereq_("../maps/xml.json"),
                decodeCodePoint = _dereq_("./decode_codepoint.js");

            var decodeXMLStrict = getStrictDecoder(xmlMap),
                decodeHTMLStrict = getStrictDecoder(entityMap);

            function getStrictDecoder(map) {
                var keys = Object.keys(map).join("|"),
                    replace = getReplacer(map);

                keys += "|#[xX][\\da-fA-F]+|#\\d+";

                var re = new RegExp("&(?:" + keys + ");", "g");

                return function (str) {
                    return String(str).replace(re, replace);
                };
            }

            var decodeHTML = (function () {
                var legacy = Object.keys(legacyMap)
                    .sort(sorter);

                var keys = Object.keys(entityMap)
                    .sort(sorter);

                for (var i = 0, j = 0; i < keys.length; i++) {
                    if (legacy[j] === keys[i]) {
                        keys[i] += ";?";
                        j++;
                    } else {
                        keys[i] += ";";
                    }
                }

                var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g"),
                    replace = getReplacer(entityMap);

                function replacer(str) {
                    if (str.substr(-1) !== ";") str += ";";
                    return replace(str);
                }

                //TODO consider creating a merged map
                return function (str) {
                    return String(str).replace(re, replacer);
                };
            }());

            function sorter(a, b) {
                return a < b ? 1 : -1;
            }

            function getReplacer(map) {
                return function replace(str) {
                    if (str.charAt(1) === "#") {
                        if (str.charAt(2) === "X" || str.charAt(2) === "x") {
                            return decodeCodePoint(parseInt(str.substr(3), 16));
                        }
                        return decodeCodePoint(parseInt(str.substr(2), 10));
                    }
                    return map[str.slice(1, -1)];
                };
            }

            module.exports = {
                XML: decodeXMLStrict,
                HTML: decodeHTML,
                HTMLStrict: decodeHTMLStrict
            };
        }, {
            "../maps/entities.json": 26,
            "../maps/legacy.json": 27,
            "../maps/xml.json": 28,
            "./decode_codepoint.js": 23
        }],
        23: [function (_dereq_, module, exports) {
            var decodeMap = _dereq_("../maps/decode.json");

            module.exports = decodeCodePoint;

// modified version of https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
            function decodeCodePoint(codePoint) {

                if ((codePoint >= 0xD800 && codePoint <= 0xDFFF) || codePoint > 0x10FFFF) {
                    return "\uFFFD";
                }

                if (codePoint in decodeMap) {
                    codePoint = decodeMap[codePoint];
                }

                var output = "";

                if (codePoint > 0xFFFF) {
                    codePoint -= 0x10000;
                    output += String.fromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
                    codePoint = 0xDC00 | codePoint & 0x3FF;
                }

                output += String.fromCharCode(codePoint);
                return output;
            }

        }, {"../maps/decode.json": 25}],
        24: [function (_dereq_, module, exports) {
            var inverseXML = getInverseObj(_dereq_("../maps/xml.json")),
                xmlReplacer = getInverseReplacer(inverseXML);

            exports.XML = getInverse(inverseXML, xmlReplacer);

            var inverseHTML = getInverseObj(_dereq_("../maps/entities.json")),
                htmlReplacer = getInverseReplacer(inverseHTML);

            exports.HTML = getInverse(inverseHTML, htmlReplacer);

            function getInverseObj(obj) {
                return Object.keys(obj).sort().reduce(function (inverse, name) {
                    inverse[obj[name]] = "&" + name + ";";
                    return inverse;
                }, {});
            }

            function getInverseReplacer(inverse) {
                var single = [],
                    multiple = [];

                Object.keys(inverse).forEach(function (k) {
                    if (k.length === 1) {
                        single.push("\\" + k);
                    } else {
                        multiple.push(k);
                    }
                });

                //TODO add ranges
                multiple.unshift("[" + single.join("") + "]");

                return new RegExp(multiple.join("|"), "g");
            }

            var re_nonASCII = /[^\0-\x7F]/g,
                re_astralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

            function singleCharReplacer(c) {
                return "&#x" + c.charCodeAt(0).toString(16).toUpperCase() + ";";
            }

            function astralReplacer(c) {
                // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                var high = c.charCodeAt(0);
                var low = c.charCodeAt(1);
                var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
                return "&#x" + codePoint.toString(16).toUpperCase() + ";";
            }

            function getInverse(inverse, re) {
                function func(name) {
                    return inverse[name];
                }

                return function (data) {
                    return data
                        .replace(re, func)
                        .replace(re_astralSymbols, astralReplacer)
                        .replace(re_nonASCII, singleCharReplacer);
                };
            }

            var re_xmlChars = getInverseReplacer(inverseXML);

            function escapeXML(data) {
                return data
                    .replace(re_xmlChars, singleCharReplacer)
                    .replace(re_astralSymbols, astralReplacer)
                    .replace(re_nonASCII, singleCharReplacer);
            }

            exports.escape = escapeXML;

        }, {"../maps/entities.json": 26, "../maps/xml.json": 28}],
        25: [function (_dereq_, module, exports) {
            module.exports = {
                "0": 65533,
                "128": 8364,
                "130": 8218,
                "131": 402,
                "132": 8222,
                "133": 8230,
                "134": 8224,
                "135": 8225,
                "136": 710,
                "137": 8240,
                "138": 352,
                "139": 8249,
                "140": 338,
                "142": 381,
                "145": 8216,
                "146": 8217,
                "147": 8220,
                "148": 8221,
                "149": 8226,
                "150": 8211,
                "151": 8212,
                "152": 732,
                "153": 8482,
                "154": 353,
                "155": 8250,
                "156": 339,
                "158": 382,
                "159": 376
            }
        }, {}],
        26: [function (_dereq_, module, exports) {
            module.exports = {
                "Aacute": "\u00C1",
                "aacute": "\u00E1",
                "Abreve": "\u0102",
                "abreve": "\u0103",
                "ac": "\u223E",
                "acd": "\u223F",
                "acE": "\u223E\u0333",
                "Acirc": "\u00C2",
                "acirc": "\u00E2",
                "acute": "\u00B4",
                "Acy": "\u0410",
                "acy": "\u0430",
                "AElig": "\u00C6",
                "aelig": "\u00E6",
                "af": "\u2061",
                "Afr": "\uD835\uDD04",
                "afr": "\uD835\uDD1E",
                "Agrave": "\u00C0",
                "agrave": "\u00E0",
                "alefsym": "\u2135",
                "aleph": "\u2135",
                "Alpha": "\u0391",
                "alpha": "\u03B1",
                "Amacr": "\u0100",
                "amacr": "\u0101",
                "amalg": "\u2A3F",
                "amp": "&",
                "AMP": "&",
                "andand": "\u2A55",
                "And": "\u2A53",
                "and": "\u2227",
                "andd": "\u2A5C",
                "andslope": "\u2A58",
                "andv": "\u2A5A",
                "ang": "\u2220",
                "ange": "\u29A4",
                "angle": "\u2220",
                "angmsdaa": "\u29A8",
                "angmsdab": "\u29A9",
                "angmsdac": "\u29AA",
                "angmsdad": "\u29AB",
                "angmsdae": "\u29AC",
                "angmsdaf": "\u29AD",
                "angmsdag": "\u29AE",
                "angmsdah": "\u29AF",
                "angmsd": "\u2221",
                "angrt": "\u221F",
                "angrtvb": "\u22BE",
                "angrtvbd": "\u299D",
                "angsph": "\u2222",
                "angst": "\u00C5",
                "angzarr": "\u237C",
                "Aogon": "\u0104",
                "aogon": "\u0105",
                "Aopf": "\uD835\uDD38",
                "aopf": "\uD835\uDD52",
                "apacir": "\u2A6F",
                "ap": "\u2248",
                "apE": "\u2A70",
                "ape": "\u224A",
                "apid": "\u224B",
                "apos": "'",
                "ApplyFunction": "\u2061",
                "approx": "\u2248",
                "approxeq": "\u224A",
                "Aring": "\u00C5",
                "aring": "\u00E5",
                "Ascr": "\uD835\uDC9C",
                "ascr": "\uD835\uDCB6",
                "Assign": "\u2254",
                "ast": "*",
                "asymp": "\u2248",
                "asympeq": "\u224D",
                "Atilde": "\u00C3",
                "atilde": "\u00E3",
                "Auml": "\u00C4",
                "auml": "\u00E4",
                "awconint": "\u2233",
                "awint": "\u2A11",
                "backcong": "\u224C",
                "backepsilon": "\u03F6",
                "backprime": "\u2035",
                "backsim": "\u223D",
                "backsimeq": "\u22CD",
                "Backslash": "\u2216",
                "Barv": "\u2AE7",
                "barvee": "\u22BD",
                "barwed": "\u2305",
                "Barwed": "\u2306",
                "barwedge": "\u2305",
                "bbrk": "\u23B5",
                "bbrktbrk": "\u23B6",
                "bcong": "\u224C",
                "Bcy": "\u0411",
                "bcy": "\u0431",
                "bdquo": "\u201E",
                "becaus": "\u2235",
                "because": "\u2235",
                "Because": "\u2235",
                "bemptyv": "\u29B0",
                "bepsi": "\u03F6",
                "bernou": "\u212C",
                "Bernoullis": "\u212C",
                "Beta": "\u0392",
                "beta": "\u03B2",
                "beth": "\u2136",
                "between": "\u226C",
                "Bfr": "\uD835\uDD05",
                "bfr": "\uD835\uDD1F",
                "bigcap": "\u22C2",
                "bigcirc": "\u25EF",
                "bigcup": "\u22C3",
                "bigodot": "\u2A00",
                "bigoplus": "\u2A01",
                "bigotimes": "\u2A02",
                "bigsqcup": "\u2A06",
                "bigstar": "\u2605",
                "bigtriangledown": "\u25BD",
                "bigtriangleup": "\u25B3",
                "biguplus": "\u2A04",
                "bigvee": "\u22C1",
                "bigwedge": "\u22C0",
                "bkarow": "\u290D",
                "blacklozenge": "\u29EB",
                "blacksquare": "\u25AA",
                "blacktriangle": "\u25B4",
                "blacktriangledown": "\u25BE",
                "blacktriangleleft": "\u25C2",
                "blacktriangleright": "\u25B8",
                "blank": "\u2423",
                "blk12": "\u2592",
                "blk14": "\u2591",
                "blk34": "\u2593",
                "block": "\u2588",
                "bne": "=\u20E5",
                "bnequiv": "\u2261\u20E5",
                "bNot": "\u2AED",
                "bnot": "\u2310",
                "Bopf": "\uD835\uDD39",
                "bopf": "\uD835\uDD53",
                "bot": "\u22A5",
                "bottom": "\u22A5",
                "bowtie": "\u22C8",
                "boxbox": "\u29C9",
                "boxdl": "\u2510",
                "boxdL": "\u2555",
                "boxDl": "\u2556",
                "boxDL": "\u2557",
                "boxdr": "\u250C",
                "boxdR": "\u2552",
                "boxDr": "\u2553",
                "boxDR": "\u2554",
                "boxh": "\u2500",
                "boxH": "\u2550",
                "boxhd": "\u252C",
                "boxHd": "\u2564",
                "boxhD": "\u2565",
                "boxHD": "\u2566",
                "boxhu": "\u2534",
                "boxHu": "\u2567",
                "boxhU": "\u2568",
                "boxHU": "\u2569",
                "boxminus": "\u229F",
                "boxplus": "\u229E",
                "boxtimes": "\u22A0",
                "boxul": "\u2518",
                "boxuL": "\u255B",
                "boxUl": "\u255C",
                "boxUL": "\u255D",
                "boxur": "\u2514",
                "boxuR": "\u2558",
                "boxUr": "\u2559",
                "boxUR": "\u255A",
                "boxv": "\u2502",
                "boxV": "\u2551",
                "boxvh": "\u253C",
                "boxvH": "\u256A",
                "boxVh": "\u256B",
                "boxVH": "\u256C",
                "boxvl": "\u2524",
                "boxvL": "\u2561",
                "boxVl": "\u2562",
                "boxVL": "\u2563",
                "boxvr": "\u251C",
                "boxvR": "\u255E",
                "boxVr": "\u255F",
                "boxVR": "\u2560",
                "bprime": "\u2035",
                "breve": "\u02D8",
                "Breve": "\u02D8",
                "brvbar": "\u00A6",
                "bscr": "\uD835\uDCB7",
                "Bscr": "\u212C",
                "bsemi": "\u204F",
                "bsim": "\u223D",
                "bsime": "\u22CD",
                "bsolb": "\u29C5",
                "bsol": "\\",
                "bsolhsub": "\u27C8",
                "bull": "\u2022",
                "bullet": "\u2022",
                "bump": "\u224E",
                "bumpE": "\u2AAE",
                "bumpe": "\u224F",
                "Bumpeq": "\u224E",
                "bumpeq": "\u224F",
                "Cacute": "\u0106",
                "cacute": "\u0107",
                "capand": "\u2A44",
                "capbrcup": "\u2A49",
                "capcap": "\u2A4B",
                "cap": "\u2229",
                "Cap": "\u22D2",
                "capcup": "\u2A47",
                "capdot": "\u2A40",
                "CapitalDifferentialD": "\u2145",
                "caps": "\u2229\uFE00",
                "caret": "\u2041",
                "caron": "\u02C7",
                "Cayleys": "\u212D",
                "ccaps": "\u2A4D",
                "Ccaron": "\u010C",
                "ccaron": "\u010D",
                "Ccedil": "\u00C7",
                "ccedil": "\u00E7",
                "Ccirc": "\u0108",
                "ccirc": "\u0109",
                "Cconint": "\u2230",
                "ccups": "\u2A4C",
                "ccupssm": "\u2A50",
                "Cdot": "\u010A",
                "cdot": "\u010B",
                "cedil": "\u00B8",
                "Cedilla": "\u00B8",
                "cemptyv": "\u29B2",
                "cent": "\u00A2",
                "centerdot": "\u00B7",
                "CenterDot": "\u00B7",
                "cfr": "\uD835\uDD20",
                "Cfr": "\u212D",
                "CHcy": "\u0427",
                "chcy": "\u0447",
                "check": "\u2713",
                "checkmark": "\u2713",
                "Chi": "\u03A7",
                "chi": "\u03C7",
                "circ": "\u02C6",
                "circeq": "\u2257",
                "circlearrowleft": "\u21BA",
                "circlearrowright": "\u21BB",
                "circledast": "\u229B",
                "circledcirc": "\u229A",
                "circleddash": "\u229D",
                "CircleDot": "\u2299",
                "circledR": "\u00AE",
                "circledS": "\u24C8",
                "CircleMinus": "\u2296",
                "CirclePlus": "\u2295",
                "CircleTimes": "\u2297",
                "cir": "\u25CB",
                "cirE": "\u29C3",
                "cire": "\u2257",
                "cirfnint": "\u2A10",
                "cirmid": "\u2AEF",
                "cirscir": "\u29C2",
                "ClockwiseContourIntegral": "\u2232",
                "CloseCurlyDoubleQuote": "\u201D",
                "CloseCurlyQuote": "\u2019",
                "clubs": "\u2663",
                "clubsuit": "\u2663",
                "colon": ":",
                "Colon": "\u2237",
                "Colone": "\u2A74",
                "colone": "\u2254",
                "coloneq": "\u2254",
                "comma": ",",
                "commat": "@",
                "comp": "\u2201",
                "compfn": "\u2218",
                "complement": "\u2201",
                "complexes": "\u2102",
                "cong": "\u2245",
                "congdot": "\u2A6D",
                "Congruent": "\u2261",
                "conint": "\u222E",
                "Conint": "\u222F",
                "ContourIntegral": "\u222E",
                "copf": "\uD835\uDD54",
                "Copf": "\u2102",
                "coprod": "\u2210",
                "Coproduct": "\u2210",
                "copy": "\u00A9",
                "COPY": "\u00A9",
                "copysr": "\u2117",
                "CounterClockwiseContourIntegral": "\u2233",
                "crarr": "\u21B5",
                "cross": "\u2717",
                "Cross": "\u2A2F",
                "Cscr": "\uD835\uDC9E",
                "cscr": "\uD835\uDCB8",
                "csub": "\u2ACF",
                "csube": "\u2AD1",
                "csup": "\u2AD0",
                "csupe": "\u2AD2",
                "ctdot": "\u22EF",
                "cudarrl": "\u2938",
                "cudarrr": "\u2935",
                "cuepr": "\u22DE",
                "cuesc": "\u22DF",
                "cularr": "\u21B6",
                "cularrp": "\u293D",
                "cupbrcap": "\u2A48",
                "cupcap": "\u2A46",
                "CupCap": "\u224D",
                "cup": "\u222A",
                "Cup": "\u22D3",
                "cupcup": "\u2A4A",
                "cupdot": "\u228D",
                "cupor": "\u2A45",
                "cups": "\u222A\uFE00",
                "curarr": "\u21B7",
                "curarrm": "\u293C",
                "curlyeqprec": "\u22DE",
                "curlyeqsucc": "\u22DF",
                "curlyvee": "\u22CE",
                "curlywedge": "\u22CF",
                "curren": "\u00A4",
                "curvearrowleft": "\u21B6",
                "curvearrowright": "\u21B7",
                "cuvee": "\u22CE",
                "cuwed": "\u22CF",
                "cwconint": "\u2232",
                "cwint": "\u2231",
                "cylcty": "\u232D",
                "dagger": "\u2020",
                "Dagger": "\u2021",
                "daleth": "\u2138",
                "darr": "\u2193",
                "Darr": "\u21A1",
                "dArr": "\u21D3",
                "dash": "\u2010",
                "Dashv": "\u2AE4",
                "dashv": "\u22A3",
                "dbkarow": "\u290F",
                "dblac": "\u02DD",
                "Dcaron": "\u010E",
                "dcaron": "\u010F",
                "Dcy": "\u0414",
                "dcy": "\u0434",
                "ddagger": "\u2021",
                "ddarr": "\u21CA",
                "DD": "\u2145",
                "dd": "\u2146",
                "DDotrahd": "\u2911",
                "ddotseq": "\u2A77",
                "deg": "\u00B0",
                "Del": "\u2207",
                "Delta": "\u0394",
                "delta": "\u03B4",
                "demptyv": "\u29B1",
                "dfisht": "\u297F",
                "Dfr": "\uD835\uDD07",
                "dfr": "\uD835\uDD21",
                "dHar": "\u2965",
                "dharl": "\u21C3",
                "dharr": "\u21C2",
                "DiacriticalAcute": "\u00B4",
                "DiacriticalDot": "\u02D9",
                "DiacriticalDoubleAcute": "\u02DD",
                "DiacriticalGrave": "`",
                "DiacriticalTilde": "\u02DC",
                "diam": "\u22C4",
                "diamond": "\u22C4",
                "Diamond": "\u22C4",
                "diamondsuit": "\u2666",
                "diams": "\u2666",
                "die": "\u00A8",
                "DifferentialD": "\u2146",
                "digamma": "\u03DD",
                "disin": "\u22F2",
                "div": "\u00F7",
                "divide": "\u00F7",
                "divideontimes": "\u22C7",
                "divonx": "\u22C7",
                "DJcy": "\u0402",
                "djcy": "\u0452",
                "dlcorn": "\u231E",
                "dlcrop": "\u230D",
                "dollar": "$",
                "Dopf": "\uD835\uDD3B",
                "dopf": "\uD835\uDD55",
                "Dot": "\u00A8",
                "dot": "\u02D9",
                "DotDot": "\u20DC",
                "doteq": "\u2250",
                "doteqdot": "\u2251",
                "DotEqual": "\u2250",
                "dotminus": "\u2238",
                "dotplus": "\u2214",
                "dotsquare": "\u22A1",
                "doublebarwedge": "\u2306",
                "DoubleContourIntegral": "\u222F",
                "DoubleDot": "\u00A8",
                "DoubleDownArrow": "\u21D3",
                "DoubleLeftArrow": "\u21D0",
                "DoubleLeftRightArrow": "\u21D4",
                "DoubleLeftTee": "\u2AE4",
                "DoubleLongLeftArrow": "\u27F8",
                "DoubleLongLeftRightArrow": "\u27FA",
                "DoubleLongRightArrow": "\u27F9",
                "DoubleRightArrow": "\u21D2",
                "DoubleRightTee": "\u22A8",
                "DoubleUpArrow": "\u21D1",
                "DoubleUpDownArrow": "\u21D5",
                "DoubleVerticalBar": "\u2225",
                "DownArrowBar": "\u2913",
                "downarrow": "\u2193",
                "DownArrow": "\u2193",
                "Downarrow": "\u21D3",
                "DownArrowUpArrow": "\u21F5",
                "DownBreve": "\u0311",
                "downdownarrows": "\u21CA",
                "downharpoonleft": "\u21C3",
                "downharpoonright": "\u21C2",
                "DownLeftRightVector": "\u2950",
                "DownLeftTeeVector": "\u295E",
                "DownLeftVectorBar": "\u2956",
                "DownLeftVector": "\u21BD",
                "DownRightTeeVector": "\u295F",
                "DownRightVectorBar": "\u2957",
                "DownRightVector": "\u21C1",
                "DownTeeArrow": "\u21A7",
                "DownTee": "\u22A4",
                "drbkarow": "\u2910",
                "drcorn": "\u231F",
                "drcrop": "\u230C",
                "Dscr": "\uD835\uDC9F",
                "dscr": "\uD835\uDCB9",
                "DScy": "\u0405",
                "dscy": "\u0455",
                "dsol": "\u29F6",
                "Dstrok": "\u0110",
                "dstrok": "\u0111",
                "dtdot": "\u22F1",
                "dtri": "\u25BF",
                "dtrif": "\u25BE",
                "duarr": "\u21F5",
                "duhar": "\u296F",
                "dwangle": "\u29A6",
                "DZcy": "\u040F",
                "dzcy": "\u045F",
                "dzigrarr": "\u27FF",
                "Eacute": "\u00C9",
                "eacute": "\u00E9",
                "easter": "\u2A6E",
                "Ecaron": "\u011A",
                "ecaron": "\u011B",
                "Ecirc": "\u00CA",
                "ecirc": "\u00EA",
                "ecir": "\u2256",
                "ecolon": "\u2255",
                "Ecy": "\u042D",
                "ecy": "\u044D",
                "eDDot": "\u2A77",
                "Edot": "\u0116",
                "edot": "\u0117",
                "eDot": "\u2251",
                "ee": "\u2147",
                "efDot": "\u2252",
                "Efr": "\uD835\uDD08",
                "efr": "\uD835\uDD22",
                "eg": "\u2A9A",
                "Egrave": "\u00C8",
                "egrave": "\u00E8",
                "egs": "\u2A96",
                "egsdot": "\u2A98",
                "el": "\u2A99",
                "Element": "\u2208",
                "elinters": "\u23E7",
                "ell": "\u2113",
                "els": "\u2A95",
                "elsdot": "\u2A97",
                "Emacr": "\u0112",
                "emacr": "\u0113",
                "empty": "\u2205",
                "emptyset": "\u2205",
                "EmptySmallSquare": "\u25FB",
                "emptyv": "\u2205",
                "EmptyVerySmallSquare": "\u25AB",
                "emsp13": "\u2004",
                "emsp14": "\u2005",
                "emsp": "\u2003",
                "ENG": "\u014A",
                "eng": "\u014B",
                "ensp": "\u2002",
                "Eogon": "\u0118",
                "eogon": "\u0119",
                "Eopf": "\uD835\uDD3C",
                "eopf": "\uD835\uDD56",
                "epar": "\u22D5",
                "eparsl": "\u29E3",
                "eplus": "\u2A71",
                "epsi": "\u03B5",
                "Epsilon": "\u0395",
                "epsilon": "\u03B5",
                "epsiv": "\u03F5",
                "eqcirc": "\u2256",
                "eqcolon": "\u2255",
                "eqsim": "\u2242",
                "eqslantgtr": "\u2A96",
                "eqslantless": "\u2A95",
                "Equal": "\u2A75",
                "equals": "=",
                "EqualTilde": "\u2242",
                "equest": "\u225F",
                "Equilibrium": "\u21CC",
                "equiv": "\u2261",
                "equivDD": "\u2A78",
                "eqvparsl": "\u29E5",
                "erarr": "\u2971",
                "erDot": "\u2253",
                "escr": "\u212F",
                "Escr": "\u2130",
                "esdot": "\u2250",
                "Esim": "\u2A73",
                "esim": "\u2242",
                "Eta": "\u0397",
                "eta": "\u03B7",
                "ETH": "\u00D0",
                "eth": "\u00F0",
                "Euml": "\u00CB",
                "euml": "\u00EB",
                "euro": "\u20AC",
                "excl": "!",
                "exist": "\u2203",
                "Exists": "\u2203",
                "expectation": "\u2130",
                "exponentiale": "\u2147",
                "ExponentialE": "\u2147",
                "fallingdotseq": "\u2252",
                "Fcy": "\u0424",
                "fcy": "\u0444",
                "female": "\u2640",
                "ffilig": "\uFB03",
                "fflig": "\uFB00",
                "ffllig": "\uFB04",
                "Ffr": "\uD835\uDD09",
                "ffr": "\uD835\uDD23",
                "filig": "\uFB01",
                "FilledSmallSquare": "\u25FC",
                "FilledVerySmallSquare": "\u25AA",
                "fjlig": "fj",
                "flat": "\u266D",
                "fllig": "\uFB02",
                "fltns": "\u25B1",
                "fnof": "\u0192",
                "Fopf": "\uD835\uDD3D",
                "fopf": "\uD835\uDD57",
                "forall": "\u2200",
                "ForAll": "\u2200",
                "fork": "\u22D4",
                "forkv": "\u2AD9",
                "Fouriertrf": "\u2131",
                "fpartint": "\u2A0D",
                "frac12": "\u00BD",
                "frac13": "\u2153",
                "frac14": "\u00BC",
                "frac15": "\u2155",
                "frac16": "\u2159",
                "frac18": "\u215B",
                "frac23": "\u2154",
                "frac25": "\u2156",
                "frac34": "\u00BE",
                "frac35": "\u2157",
                "frac38": "\u215C",
                "frac45": "\u2158",
                "frac56": "\u215A",
                "frac58": "\u215D",
                "frac78": "\u215E",
                "frasl": "\u2044",
                "frown": "\u2322",
                "fscr": "\uD835\uDCBB",
                "Fscr": "\u2131",
                "gacute": "\u01F5",
                "Gamma": "\u0393",
                "gamma": "\u03B3",
                "Gammad": "\u03DC",
                "gammad": "\u03DD",
                "gap": "\u2A86",
                "Gbreve": "\u011E",
                "gbreve": "\u011F",
                "Gcedil": "\u0122",
                "Gcirc": "\u011C",
                "gcirc": "\u011D",
                "Gcy": "\u0413",
                "gcy": "\u0433",
                "Gdot": "\u0120",
                "gdot": "\u0121",
                "ge": "\u2265",
                "gE": "\u2267",
                "gEl": "\u2A8C",
                "gel": "\u22DB",
                "geq": "\u2265",
                "geqq": "\u2267",
                "geqslant": "\u2A7E",
                "gescc": "\u2AA9",
                "ges": "\u2A7E",
                "gesdot": "\u2A80",
                "gesdoto": "\u2A82",
                "gesdotol": "\u2A84",
                "gesl": "\u22DB\uFE00",
                "gesles": "\u2A94",
                "Gfr": "\uD835\uDD0A",
                "gfr": "\uD835\uDD24",
                "gg": "\u226B",
                "Gg": "\u22D9",
                "ggg": "\u22D9",
                "gimel": "\u2137",
                "GJcy": "\u0403",
                "gjcy": "\u0453",
                "gla": "\u2AA5",
                "gl": "\u2277",
                "glE": "\u2A92",
                "glj": "\u2AA4",
                "gnap": "\u2A8A",
                "gnapprox": "\u2A8A",
                "gne": "\u2A88",
                "gnE": "\u2269",
                "gneq": "\u2A88",
                "gneqq": "\u2269",
                "gnsim": "\u22E7",
                "Gopf": "\uD835\uDD3E",
                "gopf": "\uD835\uDD58",
                "grave": "`",
                "GreaterEqual": "\u2265",
                "GreaterEqualLess": "\u22DB",
                "GreaterFullEqual": "\u2267",
                "GreaterGreater": "\u2AA2",
                "GreaterLess": "\u2277",
                "GreaterSlantEqual": "\u2A7E",
                "GreaterTilde": "\u2273",
                "Gscr": "\uD835\uDCA2",
                "gscr": "\u210A",
                "gsim": "\u2273",
                "gsime": "\u2A8E",
                "gsiml": "\u2A90",
                "gtcc": "\u2AA7",
                "gtcir": "\u2A7A",
                "gt": ">",
                "GT": ">",
                "Gt": "\u226B",
                "gtdot": "\u22D7",
                "gtlPar": "\u2995",
                "gtquest": "\u2A7C",
                "gtrapprox": "\u2A86",
                "gtrarr": "\u2978",
                "gtrdot": "\u22D7",
                "gtreqless": "\u22DB",
                "gtreqqless": "\u2A8C",
                "gtrless": "\u2277",
                "gtrsim": "\u2273",
                "gvertneqq": "\u2269\uFE00",
                "gvnE": "\u2269\uFE00",
                "Hacek": "\u02C7",
                "hairsp": "\u200A",
                "half": "\u00BD",
                "hamilt": "\u210B",
                "HARDcy": "\u042A",
                "hardcy": "\u044A",
                "harrcir": "\u2948",
                "harr": "\u2194",
                "hArr": "\u21D4",
                "harrw": "\u21AD",
                "Hat": "^",
                "hbar": "\u210F",
                "Hcirc": "\u0124",
                "hcirc": "\u0125",
                "hearts": "\u2665",
                "heartsuit": "\u2665",
                "hellip": "\u2026",
                "hercon": "\u22B9",
                "hfr": "\uD835\uDD25",
                "Hfr": "\u210C",
                "HilbertSpace": "\u210B",
                "hksearow": "\u2925",
                "hkswarow": "\u2926",
                "hoarr": "\u21FF",
                "homtht": "\u223B",
                "hookleftarrow": "\u21A9",
                "hookrightarrow": "\u21AA",
                "hopf": "\uD835\uDD59",
                "Hopf": "\u210D",
                "horbar": "\u2015",
                "HorizontalLine": "\u2500",
                "hscr": "\uD835\uDCBD",
                "Hscr": "\u210B",
                "hslash": "\u210F",
                "Hstrok": "\u0126",
                "hstrok": "\u0127",
                "HumpDownHump": "\u224E",
                "HumpEqual": "\u224F",
                "hybull": "\u2043",
                "hyphen": "\u2010",
                "Iacute": "\u00CD",
                "iacute": "\u00ED",
                "ic": "\u2063",
                "Icirc": "\u00CE",
                "icirc": "\u00EE",
                "Icy": "\u0418",
                "icy": "\u0438",
                "Idot": "\u0130",
                "IEcy": "\u0415",
                "iecy": "\u0435",
                "iexcl": "\u00A1",
                "iff": "\u21D4",
                "ifr": "\uD835\uDD26",
                "Ifr": "\u2111",
                "Igrave": "\u00CC",
                "igrave": "\u00EC",
                "ii": "\u2148",
                "iiiint": "\u2A0C",
                "iiint": "\u222D",
                "iinfin": "\u29DC",
                "iiota": "\u2129",
                "IJlig": "\u0132",
                "ijlig": "\u0133",
                "Imacr": "\u012A",
                "imacr": "\u012B",
                "image": "\u2111",
                "ImaginaryI": "\u2148",
                "imagline": "\u2110",
                "imagpart": "\u2111",
                "imath": "\u0131",
                "Im": "\u2111",
                "imof": "\u22B7",
                "imped": "\u01B5",
                "Implies": "\u21D2",
                "incare": "\u2105",
                "in": "\u2208",
                "infin": "\u221E",
                "infintie": "\u29DD",
                "inodot": "\u0131",
                "intcal": "\u22BA",
                "int": "\u222B",
                "Int": "\u222C",
                "integers": "\u2124",
                "Integral": "\u222B",
                "intercal": "\u22BA",
                "Intersection": "\u22C2",
                "intlarhk": "\u2A17",
                "intprod": "\u2A3C",
                "InvisibleComma": "\u2063",
                "InvisibleTimes": "\u2062",
                "IOcy": "\u0401",
                "iocy": "\u0451",
                "Iogon": "\u012E",
                "iogon": "\u012F",
                "Iopf": "\uD835\uDD40",
                "iopf": "\uD835\uDD5A",
                "Iota": "\u0399",
                "iota": "\u03B9",
                "iprod": "\u2A3C",
                "iquest": "\u00BF",
                "iscr": "\uD835\uDCBE",
                "Iscr": "\u2110",
                "isin": "\u2208",
                "isindot": "\u22F5",
                "isinE": "\u22F9",
                "isins": "\u22F4",
                "isinsv": "\u22F3",
                "isinv": "\u2208",
                "it": "\u2062",
                "Itilde": "\u0128",
                "itilde": "\u0129",
                "Iukcy": "\u0406",
                "iukcy": "\u0456",
                "Iuml": "\u00CF",
                "iuml": "\u00EF",
                "Jcirc": "\u0134",
                "jcirc": "\u0135",
                "Jcy": "\u0419",
                "jcy": "\u0439",
                "Jfr": "\uD835\uDD0D",
                "jfr": "\uD835\uDD27",
                "jmath": "\u0237",
                "Jopf": "\uD835\uDD41",
                "jopf": "\uD835\uDD5B",
                "Jscr": "\uD835\uDCA5",
                "jscr": "\uD835\uDCBF",
                "Jsercy": "\u0408",
                "jsercy": "\u0458",
                "Jukcy": "\u0404",
                "jukcy": "\u0454",
                "Kappa": "\u039A",
                "kappa": "\u03BA",
                "kappav": "\u03F0",
                "Kcedil": "\u0136",
                "kcedil": "\u0137",
                "Kcy": "\u041A",
                "kcy": "\u043A",
                "Kfr": "\uD835\uDD0E",
                "kfr": "\uD835\uDD28",
                "kgreen": "\u0138",
                "KHcy": "\u0425",
                "khcy": "\u0445",
                "KJcy": "\u040C",
                "kjcy": "\u045C",
                "Kopf": "\uD835\uDD42",
                "kopf": "\uD835\uDD5C",
                "Kscr": "\uD835\uDCA6",
                "kscr": "\uD835\uDCC0",
                "lAarr": "\u21DA",
                "Lacute": "\u0139",
                "lacute": "\u013A",
                "laemptyv": "\u29B4",
                "lagran": "\u2112",
                "Lambda": "\u039B",
                "lambda": "\u03BB",
                "lang": "\u27E8",
                "Lang": "\u27EA",
                "langd": "\u2991",
                "langle": "\u27E8",
                "lap": "\u2A85",
                "Laplacetrf": "\u2112",
                "laquo": "\u00AB",
                "larrb": "\u21E4",
                "larrbfs": "\u291F",
                "larr": "\u2190",
                "Larr": "\u219E",
                "lArr": "\u21D0",
                "larrfs": "\u291D",
                "larrhk": "\u21A9",
                "larrlp": "\u21AB",
                "larrpl": "\u2939",
                "larrsim": "\u2973",
                "larrtl": "\u21A2",
                "latail": "\u2919",
                "lAtail": "\u291B",
                "lat": "\u2AAB",
                "late": "\u2AAD",
                "lates": "\u2AAD\uFE00",
                "lbarr": "\u290C",
                "lBarr": "\u290E",
                "lbbrk": "\u2772",
                "lbrace": "{",
                "lbrack": "[",
                "lbrke": "\u298B",
                "lbrksld": "\u298F",
                "lbrkslu": "\u298D",
                "Lcaron": "\u013D",
                "lcaron": "\u013E",
                "Lcedil": "\u013B",
                "lcedil": "\u013C",
                "lceil": "\u2308",
                "lcub": "{",
                "Lcy": "\u041B",
                "lcy": "\u043B",
                "ldca": "\u2936",
                "ldquo": "\u201C",
                "ldquor": "\u201E",
                "ldrdhar": "\u2967",
                "ldrushar": "\u294B",
                "ldsh": "\u21B2",
                "le": "\u2264",
                "lE": "\u2266",
                "LeftAngleBracket": "\u27E8",
                "LeftArrowBar": "\u21E4",
                "leftarrow": "\u2190",
                "LeftArrow": "\u2190",
                "Leftarrow": "\u21D0",
                "LeftArrowRightArrow": "\u21C6",
                "leftarrowtail": "\u21A2",
                "LeftCeiling": "\u2308",
                "LeftDoubleBracket": "\u27E6",
                "LeftDownTeeVector": "\u2961",
                "LeftDownVectorBar": "\u2959",
                "LeftDownVector": "\u21C3",
                "LeftFloor": "\u230A",
                "leftharpoondown": "\u21BD",
                "leftharpoonup": "\u21BC",
                "leftleftarrows": "\u21C7",
                "leftrightarrow": "\u2194",
                "LeftRightArrow": "\u2194",
                "Leftrightarrow": "\u21D4",
                "leftrightarrows": "\u21C6",
                "leftrightharpoons": "\u21CB",
                "leftrightsquigarrow": "\u21AD",
                "LeftRightVector": "\u294E",
                "LeftTeeArrow": "\u21A4",
                "LeftTee": "\u22A3",
                "LeftTeeVector": "\u295A",
                "leftthreetimes": "\u22CB",
                "LeftTriangleBar": "\u29CF",
                "LeftTriangle": "\u22B2",
                "LeftTriangleEqual": "\u22B4",
                "LeftUpDownVector": "\u2951",
                "LeftUpTeeVector": "\u2960",
                "LeftUpVectorBar": "\u2958",
                "LeftUpVector": "\u21BF",
                "LeftVectorBar": "\u2952",
                "LeftVector": "\u21BC",
                "lEg": "\u2A8B",
                "leg": "\u22DA",
                "leq": "\u2264",
                "leqq": "\u2266",
                "leqslant": "\u2A7D",
                "lescc": "\u2AA8",
                "les": "\u2A7D",
                "lesdot": "\u2A7F",
                "lesdoto": "\u2A81",
                "lesdotor": "\u2A83",
                "lesg": "\u22DA\uFE00",
                "lesges": "\u2A93",
                "lessapprox": "\u2A85",
                "lessdot": "\u22D6",
                "lesseqgtr": "\u22DA",
                "lesseqqgtr": "\u2A8B",
                "LessEqualGreater": "\u22DA",
                "LessFullEqual": "\u2266",
                "LessGreater": "\u2276",
                "lessgtr": "\u2276",
                "LessLess": "\u2AA1",
                "lesssim": "\u2272",
                "LessSlantEqual": "\u2A7D",
                "LessTilde": "\u2272",
                "lfisht": "\u297C",
                "lfloor": "\u230A",
                "Lfr": "\uD835\uDD0F",
                "lfr": "\uD835\uDD29",
                "lg": "\u2276",
                "lgE": "\u2A91",
                "lHar": "\u2962",
                "lhard": "\u21BD",
                "lharu": "\u21BC",
                "lharul": "\u296A",
                "lhblk": "\u2584",
                "LJcy": "\u0409",
                "ljcy": "\u0459",
                "llarr": "\u21C7",
                "ll": "\u226A",
                "Ll": "\u22D8",
                "llcorner": "\u231E",
                "Lleftarrow": "\u21DA",
                "llhard": "\u296B",
                "lltri": "\u25FA",
                "Lmidot": "\u013F",
                "lmidot": "\u0140",
                "lmoustache": "\u23B0",
                "lmoust": "\u23B0",
                "lnap": "\u2A89",
                "lnapprox": "\u2A89",
                "lne": "\u2A87",
                "lnE": "\u2268",
                "lneq": "\u2A87",
                "lneqq": "\u2268",
                "lnsim": "\u22E6",
                "loang": "\u27EC",
                "loarr": "\u21FD",
                "lobrk": "\u27E6",
                "longleftarrow": "\u27F5",
                "LongLeftArrow": "\u27F5",
                "Longleftarrow": "\u27F8",
                "longleftrightarrow": "\u27F7",
                "LongLeftRightArrow": "\u27F7",
                "Longleftrightarrow": "\u27FA",
                "longmapsto": "\u27FC",
                "longrightarrow": "\u27F6",
                "LongRightArrow": "\u27F6",
                "Longrightarrow": "\u27F9",
                "looparrowleft": "\u21AB",
                "looparrowright": "\u21AC",
                "lopar": "\u2985",
                "Lopf": "\uD835\uDD43",
                "lopf": "\uD835\uDD5D",
                "loplus": "\u2A2D",
                "lotimes": "\u2A34",
                "lowast": "\u2217",
                "lowbar": "_",
                "LowerLeftArrow": "\u2199",
                "LowerRightArrow": "\u2198",
                "loz": "\u25CA",
                "lozenge": "\u25CA",
                "lozf": "\u29EB",
                "lpar": "(",
                "lparlt": "\u2993",
                "lrarr": "\u21C6",
                "lrcorner": "\u231F",
                "lrhar": "\u21CB",
                "lrhard": "\u296D",
                "lrm": "\u200E",
                "lrtri": "\u22BF",
                "lsaquo": "\u2039",
                "lscr": "\uD835\uDCC1",
                "Lscr": "\u2112",
                "lsh": "\u21B0",
                "Lsh": "\u21B0",
                "lsim": "\u2272",
                "lsime": "\u2A8D",
                "lsimg": "\u2A8F",
                "lsqb": "[",
                "lsquo": "\u2018",
                "lsquor": "\u201A",
                "Lstrok": "\u0141",
                "lstrok": "\u0142",
                "ltcc": "\u2AA6",
                "ltcir": "\u2A79",
                "lt": "<",
                "LT": "<",
                "Lt": "\u226A",
                "ltdot": "\u22D6",
                "lthree": "\u22CB",
                "ltimes": "\u22C9",
                "ltlarr": "\u2976",
                "ltquest": "\u2A7B",
                "ltri": "\u25C3",
                "ltrie": "\u22B4",
                "ltrif": "\u25C2",
                "ltrPar": "\u2996",
                "lurdshar": "\u294A",
                "luruhar": "\u2966",
                "lvertneqq": "\u2268\uFE00",
                "lvnE": "\u2268\uFE00",
                "macr": "\u00AF",
                "male": "\u2642",
                "malt": "\u2720",
                "maltese": "\u2720",
                "Map": "\u2905",
                "map": "\u21A6",
                "mapsto": "\u21A6",
                "mapstodown": "\u21A7",
                "mapstoleft": "\u21A4",
                "mapstoup": "\u21A5",
                "marker": "\u25AE",
                "mcomma": "\u2A29",
                "Mcy": "\u041C",
                "mcy": "\u043C",
                "mdash": "\u2014",
                "mDDot": "\u223A",
                "measuredangle": "\u2221",
                "MediumSpace": "\u205F",
                "Mellintrf": "\u2133",
                "Mfr": "\uD835\uDD10",
                "mfr": "\uD835\uDD2A",
                "mho": "\u2127",
                "micro": "\u00B5",
                "midast": "*",
                "midcir": "\u2AF0",
                "mid": "\u2223",
                "middot": "\u00B7",
                "minusb": "\u229F",
                "minus": "\u2212",
                "minusd": "\u2238",
                "minusdu": "\u2A2A",
                "MinusPlus": "\u2213",
                "mlcp": "\u2ADB",
                "mldr": "\u2026",
                "mnplus": "\u2213",
                "models": "\u22A7",
                "Mopf": "\uD835\uDD44",
                "mopf": "\uD835\uDD5E",
                "mp": "\u2213",
                "mscr": "\uD835\uDCC2",
                "Mscr": "\u2133",
                "mstpos": "\u223E",
                "Mu": "\u039C",
                "mu": "\u03BC",
                "multimap": "\u22B8",
                "mumap": "\u22B8",
                "nabla": "\u2207",
                "Nacute": "\u0143",
                "nacute": "\u0144",
                "nang": "\u2220\u20D2",
                "nap": "\u2249",
                "napE": "\u2A70\u0338",
                "napid": "\u224B\u0338",
                "napos": "\u0149",
                "napprox": "\u2249",
                "natural": "\u266E",
                "naturals": "\u2115",
                "natur": "\u266E",
                "nbsp": "\u00A0",
                "nbump": "\u224E\u0338",
                "nbumpe": "\u224F\u0338",
                "ncap": "\u2A43",
                "Ncaron": "\u0147",
                "ncaron": "\u0148",
                "Ncedil": "\u0145",
                "ncedil": "\u0146",
                "ncong": "\u2247",
                "ncongdot": "\u2A6D\u0338",
                "ncup": "\u2A42",
                "Ncy": "\u041D",
                "ncy": "\u043D",
                "ndash": "\u2013",
                "nearhk": "\u2924",
                "nearr": "\u2197",
                "neArr": "\u21D7",
                "nearrow": "\u2197",
                "ne": "\u2260",
                "nedot": "\u2250\u0338",
                "NegativeMediumSpace": "\u200B",
                "NegativeThickSpace": "\u200B",
                "NegativeThinSpace": "\u200B",
                "NegativeVeryThinSpace": "\u200B",
                "nequiv": "\u2262",
                "nesear": "\u2928",
                "nesim": "\u2242\u0338",
                "NestedGreaterGreater": "\u226B",
                "NestedLessLess": "\u226A",
                "NewLine": "\n",
                "nexist": "\u2204",
                "nexists": "\u2204",
                "Nfr": "\uD835\uDD11",
                "nfr": "\uD835\uDD2B",
                "ngE": "\u2267\u0338",
                "nge": "\u2271",
                "ngeq": "\u2271",
                "ngeqq": "\u2267\u0338",
                "ngeqslant": "\u2A7E\u0338",
                "nges": "\u2A7E\u0338",
                "nGg": "\u22D9\u0338",
                "ngsim": "\u2275",
                "nGt": "\u226B\u20D2",
                "ngt": "\u226F",
                "ngtr": "\u226F",
                "nGtv": "\u226B\u0338",
                "nharr": "\u21AE",
                "nhArr": "\u21CE",
                "nhpar": "\u2AF2",
                "ni": "\u220B",
                "nis": "\u22FC",
                "nisd": "\u22FA",
                "niv": "\u220B",
                "NJcy": "\u040A",
                "njcy": "\u045A",
                "nlarr": "\u219A",
                "nlArr": "\u21CD",
                "nldr": "\u2025",
                "nlE": "\u2266\u0338",
                "nle": "\u2270",
                "nleftarrow": "\u219A",
                "nLeftarrow": "\u21CD",
                "nleftrightarrow": "\u21AE",
                "nLeftrightarrow": "\u21CE",
                "nleq": "\u2270",
                "nleqq": "\u2266\u0338",
                "nleqslant": "\u2A7D\u0338",
                "nles": "\u2A7D\u0338",
                "nless": "\u226E",
                "nLl": "\u22D8\u0338",
                "nlsim": "\u2274",
                "nLt": "\u226A\u20D2",
                "nlt": "\u226E",
                "nltri": "\u22EA",
                "nltrie": "\u22EC",
                "nLtv": "\u226A\u0338",
                "nmid": "\u2224",
                "NoBreak": "\u2060",
                "NonBreakingSpace": "\u00A0",
                "nopf": "\uD835\uDD5F",
                "Nopf": "\u2115",
                "Not": "\u2AEC",
                "not": "\u00AC",
                "NotCongruent": "\u2262",
                "NotCupCap": "\u226D",
                "NotDoubleVerticalBar": "\u2226",
                "NotElement": "\u2209",
                "NotEqual": "\u2260",
                "NotEqualTilde": "\u2242\u0338",
                "NotExists": "\u2204",
                "NotGreater": "\u226F",
                "NotGreaterEqual": "\u2271",
                "NotGreaterFullEqual": "\u2267\u0338",
                "NotGreaterGreater": "\u226B\u0338",
                "NotGreaterLess": "\u2279",
                "NotGreaterSlantEqual": "\u2A7E\u0338",
                "NotGreaterTilde": "\u2275",
                "NotHumpDownHump": "\u224E\u0338",
                "NotHumpEqual": "\u224F\u0338",
                "notin": "\u2209",
                "notindot": "\u22F5\u0338",
                "notinE": "\u22F9\u0338",
                "notinva": "\u2209",
                "notinvb": "\u22F7",
                "notinvc": "\u22F6",
                "NotLeftTriangleBar": "\u29CF\u0338",
                "NotLeftTriangle": "\u22EA",
                "NotLeftTriangleEqual": "\u22EC",
                "NotLess": "\u226E",
                "NotLessEqual": "\u2270",
                "NotLessGreater": "\u2278",
                "NotLessLess": "\u226A\u0338",
                "NotLessSlantEqual": "\u2A7D\u0338",
                "NotLessTilde": "\u2274",
                "NotNestedGreaterGreater": "\u2AA2\u0338",
                "NotNestedLessLess": "\u2AA1\u0338",
                "notni": "\u220C",
                "notniva": "\u220C",
                "notnivb": "\u22FE",
                "notnivc": "\u22FD",
                "NotPrecedes": "\u2280",
                "NotPrecedesEqual": "\u2AAF\u0338",
                "NotPrecedesSlantEqual": "\u22E0",
                "NotReverseElement": "\u220C",
                "NotRightTriangleBar": "\u29D0\u0338",
                "NotRightTriangle": "\u22EB",
                "NotRightTriangleEqual": "\u22ED",
                "NotSquareSubset": "\u228F\u0338",
                "NotSquareSubsetEqual": "\u22E2",
                "NotSquareSuperset": "\u2290\u0338",
                "NotSquareSupersetEqual": "\u22E3",
                "NotSubset": "\u2282\u20D2",
                "NotSubsetEqual": "\u2288",
                "NotSucceeds": "\u2281",
                "NotSucceedsEqual": "\u2AB0\u0338",
                "NotSucceedsSlantEqual": "\u22E1",
                "NotSucceedsTilde": "\u227F\u0338",
                "NotSuperset": "\u2283\u20D2",
                "NotSupersetEqual": "\u2289",
                "NotTilde": "\u2241",
                "NotTildeEqual": "\u2244",
                "NotTildeFullEqual": "\u2247",
                "NotTildeTilde": "\u2249",
                "NotVerticalBar": "\u2224",
                "nparallel": "\u2226",
                "npar": "\u2226",
                "nparsl": "\u2AFD\u20E5",
                "npart": "\u2202\u0338",
                "npolint": "\u2A14",
                "npr": "\u2280",
                "nprcue": "\u22E0",
                "nprec": "\u2280",
                "npreceq": "\u2AAF\u0338",
                "npre": "\u2AAF\u0338",
                "nrarrc": "\u2933\u0338",
                "nrarr": "\u219B",
                "nrArr": "\u21CF",
                "nrarrw": "\u219D\u0338",
                "nrightarrow": "\u219B",
                "nRightarrow": "\u21CF",
                "nrtri": "\u22EB",
                "nrtrie": "\u22ED",
                "nsc": "\u2281",
                "nsccue": "\u22E1",
                "nsce": "\u2AB0\u0338",
                "Nscr": "\uD835\uDCA9",
                "nscr": "\uD835\uDCC3",
                "nshortmid": "\u2224",
                "nshortparallel": "\u2226",
                "nsim": "\u2241",
                "nsime": "\u2244",
                "nsimeq": "\u2244",
                "nsmid": "\u2224",
                "nspar": "\u2226",
                "nsqsube": "\u22E2",
                "nsqsupe": "\u22E3",
                "nsub": "\u2284",
                "nsubE": "\u2AC5\u0338",
                "nsube": "\u2288",
                "nsubset": "\u2282\u20D2",
                "nsubseteq": "\u2288",
                "nsubseteqq": "\u2AC5\u0338",
                "nsucc": "\u2281",
                "nsucceq": "\u2AB0\u0338",
                "nsup": "\u2285",
                "nsupE": "\u2AC6\u0338",
                "nsupe": "\u2289",
                "nsupset": "\u2283\u20D2",
                "nsupseteq": "\u2289",
                "nsupseteqq": "\u2AC6\u0338",
                "ntgl": "\u2279",
                "Ntilde": "\u00D1",
                "ntilde": "\u00F1",
                "ntlg": "\u2278",
                "ntriangleleft": "\u22EA",
                "ntrianglelefteq": "\u22EC",
                "ntriangleright": "\u22EB",
                "ntrianglerighteq": "\u22ED",
                "Nu": "\u039D",
                "nu": "\u03BD",
                "num": "#",
                "numero": "\u2116",
                "numsp": "\u2007",
                "nvap": "\u224D\u20D2",
                "nvdash": "\u22AC",
                "nvDash": "\u22AD",
                "nVdash": "\u22AE",
                "nVDash": "\u22AF",
                "nvge": "\u2265\u20D2",
                "nvgt": ">\u20D2",
                "nvHarr": "\u2904",
                "nvinfin": "\u29DE",
                "nvlArr": "\u2902",
                "nvle": "\u2264\u20D2",
                "nvlt": "<\u20D2",
                "nvltrie": "\u22B4\u20D2",
                "nvrArr": "\u2903",
                "nvrtrie": "\u22B5\u20D2",
                "nvsim": "\u223C\u20D2",
                "nwarhk": "\u2923",
                "nwarr": "\u2196",
                "nwArr": "\u21D6",
                "nwarrow": "\u2196",
                "nwnear": "\u2927",
                "Oacute": "\u00D3",
                "oacute": "\u00F3",
                "oast": "\u229B",
                "Ocirc": "\u00D4",
                "ocirc": "\u00F4",
                "ocir": "\u229A",
                "Ocy": "\u041E",
                "ocy": "\u043E",
                "odash": "\u229D",
                "Odblac": "\u0150",
                "odblac": "\u0151",
                "odiv": "\u2A38",
                "odot": "\u2299",
                "odsold": "\u29BC",
                "OElig": "\u0152",
                "oelig": "\u0153",
                "ofcir": "\u29BF",
                "Ofr": "\uD835\uDD12",
                "ofr": "\uD835\uDD2C",
                "ogon": "\u02DB",
                "Ograve": "\u00D2",
                "ograve": "\u00F2",
                "ogt": "\u29C1",
                "ohbar": "\u29B5",
                "ohm": "\u03A9",
                "oint": "\u222E",
                "olarr": "\u21BA",
                "olcir": "\u29BE",
                "olcross": "\u29BB",
                "oline": "\u203E",
                "olt": "\u29C0",
                "Omacr": "\u014C",
                "omacr": "\u014D",
                "Omega": "\u03A9",
                "omega": "\u03C9",
                "Omicron": "\u039F",
                "omicron": "\u03BF",
                "omid": "\u29B6",
                "ominus": "\u2296",
                "Oopf": "\uD835\uDD46",
                "oopf": "\uD835\uDD60",
                "opar": "\u29B7",
                "OpenCurlyDoubleQuote": "\u201C",
                "OpenCurlyQuote": "\u2018",
                "operp": "\u29B9",
                "oplus": "\u2295",
                "orarr": "\u21BB",
                "Or": "\u2A54",
                "or": "\u2228",
                "ord": "\u2A5D",
                "order": "\u2134",
                "orderof": "\u2134",
                "ordf": "\u00AA",
                "ordm": "\u00BA",
                "origof": "\u22B6",
                "oror": "\u2A56",
                "orslope": "\u2A57",
                "orv": "\u2A5B",
                "oS": "\u24C8",
                "Oscr": "\uD835\uDCAA",
                "oscr": "\u2134",
                "Oslash": "\u00D8",
                "oslash": "\u00F8",
                "osol": "\u2298",
                "Otilde": "\u00D5",
                "otilde": "\u00F5",
                "otimesas": "\u2A36",
                "Otimes": "\u2A37",
                "otimes": "\u2297",
                "Ouml": "\u00D6",
                "ouml": "\u00F6",
                "ovbar": "\u233D",
                "OverBar": "\u203E",
                "OverBrace": "\u23DE",
                "OverBracket": "\u23B4",
                "OverParenthesis": "\u23DC",
                "para": "\u00B6",
                "parallel": "\u2225",
                "par": "\u2225",
                "parsim": "\u2AF3",
                "parsl": "\u2AFD",
                "part": "\u2202",
                "PartialD": "\u2202",
                "Pcy": "\u041F",
                "pcy": "\u043F",
                "percnt": "%",
                "period": ".",
                "permil": "\u2030",
                "perp": "\u22A5",
                "pertenk": "\u2031",
                "Pfr": "\uD835\uDD13",
                "pfr": "\uD835\uDD2D",
                "Phi": "\u03A6",
                "phi": "\u03C6",
                "phiv": "\u03D5",
                "phmmat": "\u2133",
                "phone": "\u260E",
                "Pi": "\u03A0",
                "pi": "\u03C0",
                "pitchfork": "\u22D4",
                "piv": "\u03D6",
                "planck": "\u210F",
                "planckh": "\u210E",
                "plankv": "\u210F",
                "plusacir": "\u2A23",
                "plusb": "\u229E",
                "pluscir": "\u2A22",
                "plus": "+",
                "plusdo": "\u2214",
                "plusdu": "\u2A25",
                "pluse": "\u2A72",
                "PlusMinus": "\u00B1",
                "plusmn": "\u00B1",
                "plussim": "\u2A26",
                "plustwo": "\u2A27",
                "pm": "\u00B1",
                "Poincareplane": "\u210C",
                "pointint": "\u2A15",
                "popf": "\uD835\uDD61",
                "Popf": "\u2119",
                "pound": "\u00A3",
                "prap": "\u2AB7",
                "Pr": "\u2ABB",
                "pr": "\u227A",
                "prcue": "\u227C",
                "precapprox": "\u2AB7",
                "prec": "\u227A",
                "preccurlyeq": "\u227C",
                "Precedes": "\u227A",
                "PrecedesEqual": "\u2AAF",
                "PrecedesSlantEqual": "\u227C",
                "PrecedesTilde": "\u227E",
                "preceq": "\u2AAF",
                "precnapprox": "\u2AB9",
                "precneqq": "\u2AB5",
                "precnsim": "\u22E8",
                "pre": "\u2AAF",
                "prE": "\u2AB3",
                "precsim": "\u227E",
                "prime": "\u2032",
                "Prime": "\u2033",
                "primes": "\u2119",
                "prnap": "\u2AB9",
                "prnE": "\u2AB5",
                "prnsim": "\u22E8",
                "prod": "\u220F",
                "Product": "\u220F",
                "profalar": "\u232E",
                "profline": "\u2312",
                "profsurf": "\u2313",
                "prop": "\u221D",
                "Proportional": "\u221D",
                "Proportion": "\u2237",
                "propto": "\u221D",
                "prsim": "\u227E",
                "prurel": "\u22B0",
                "Pscr": "\uD835\uDCAB",
                "pscr": "\uD835\uDCC5",
                "Psi": "\u03A8",
                "psi": "\u03C8",
                "puncsp": "\u2008",
                "Qfr": "\uD835\uDD14",
                "qfr": "\uD835\uDD2E",
                "qint": "\u2A0C",
                "qopf": "\uD835\uDD62",
                "Qopf": "\u211A",
                "qprime": "\u2057",
                "Qscr": "\uD835\uDCAC",
                "qscr": "\uD835\uDCC6",
                "quaternions": "\u210D",
                "quatint": "\u2A16",
                "quest": "?",
                "questeq": "\u225F",
                "quot": "\"",
                "QUOT": "\"",
                "rAarr": "\u21DB",
                "race": "\u223D\u0331",
                "Racute": "\u0154",
                "racute": "\u0155",
                "radic": "\u221A",
                "raemptyv": "\u29B3",
                "rang": "\u27E9",
                "Rang": "\u27EB",
                "rangd": "\u2992",
                "range": "\u29A5",
                "rangle": "\u27E9",
                "raquo": "\u00BB",
                "rarrap": "\u2975",
                "rarrb": "\u21E5",
                "rarrbfs": "\u2920",
                "rarrc": "\u2933",
                "rarr": "\u2192",
                "Rarr": "\u21A0",
                "rArr": "\u21D2",
                "rarrfs": "\u291E",
                "rarrhk": "\u21AA",
                "rarrlp": "\u21AC",
                "rarrpl": "\u2945",
                "rarrsim": "\u2974",
                "Rarrtl": "\u2916",
                "rarrtl": "\u21A3",
                "rarrw": "\u219D",
                "ratail": "\u291A",
                "rAtail": "\u291C",
                "ratio": "\u2236",
                "rationals": "\u211A",
                "rbarr": "\u290D",
                "rBarr": "\u290F",
                "RBarr": "\u2910",
                "rbbrk": "\u2773",
                "rbrace": "}",
                "rbrack": "]",
                "rbrke": "\u298C",
                "rbrksld": "\u298E",
                "rbrkslu": "\u2990",
                "Rcaron": "\u0158",
                "rcaron": "\u0159",
                "Rcedil": "\u0156",
                "rcedil": "\u0157",
                "rceil": "\u2309",
                "rcub": "}",
                "Rcy": "\u0420",
                "rcy": "\u0440",
                "rdca": "\u2937",
                "rdldhar": "\u2969",
                "rdquo": "\u201D",
                "rdquor": "\u201D",
                "rdsh": "\u21B3",
                "real": "\u211C",
                "realine": "\u211B",
                "realpart": "\u211C",
                "reals": "\u211D",
                "Re": "\u211C",
                "rect": "\u25AD",
                "reg": "\u00AE",
                "REG": "\u00AE",
                "ReverseElement": "\u220B",
                "ReverseEquilibrium": "\u21CB",
                "ReverseUpEquilibrium": "\u296F",
                "rfisht": "\u297D",
                "rfloor": "\u230B",
                "rfr": "\uD835\uDD2F",
                "Rfr": "\u211C",
                "rHar": "\u2964",
                "rhard": "\u21C1",
                "rharu": "\u21C0",
                "rharul": "\u296C",
                "Rho": "\u03A1",
                "rho": "\u03C1",
                "rhov": "\u03F1",
                "RightAngleBracket": "\u27E9",
                "RightArrowBar": "\u21E5",
                "rightarrow": "\u2192",
                "RightArrow": "\u2192",
                "Rightarrow": "\u21D2",
                "RightArrowLeftArrow": "\u21C4",
                "rightarrowtail": "\u21A3",
                "RightCeiling": "\u2309",
                "RightDoubleBracket": "\u27E7",
                "RightDownTeeVector": "\u295D",
                "RightDownVectorBar": "\u2955",
                "RightDownVector": "\u21C2",
                "RightFloor": "\u230B",
                "rightharpoondown": "\u21C1",
                "rightharpoonup": "\u21C0",
                "rightleftarrows": "\u21C4",
                "rightleftharpoons": "\u21CC",
                "rightrightarrows": "\u21C9",
                "rightsquigarrow": "\u219D",
                "RightTeeArrow": "\u21A6",
                "RightTee": "\u22A2",
                "RightTeeVector": "\u295B",
                "rightthreetimes": "\u22CC",
                "RightTriangleBar": "\u29D0",
                "RightTriangle": "\u22B3",
                "RightTriangleEqual": "\u22B5",
                "RightUpDownVector": "\u294F",
                "RightUpTeeVector": "\u295C",
                "RightUpVectorBar": "\u2954",
                "RightUpVector": "\u21BE",
                "RightVectorBar": "\u2953",
                "RightVector": "\u21C0",
                "ring": "\u02DA",
                "risingdotseq": "\u2253",
                "rlarr": "\u21C4",
                "rlhar": "\u21CC",
                "rlm": "\u200F",
                "rmoustache": "\u23B1",
                "rmoust": "\u23B1",
                "rnmid": "\u2AEE",
                "roang": "\u27ED",
                "roarr": "\u21FE",
                "robrk": "\u27E7",
                "ropar": "\u2986",
                "ropf": "\uD835\uDD63",
                "Ropf": "\u211D",
                "roplus": "\u2A2E",
                "rotimes": "\u2A35",
                "RoundImplies": "\u2970",
                "rpar": ")",
                "rpargt": "\u2994",
                "rppolint": "\u2A12",
                "rrarr": "\u21C9",
                "Rrightarrow": "\u21DB",
                "rsaquo": "\u203A",
                "rscr": "\uD835\uDCC7",
                "Rscr": "\u211B",
                "rsh": "\u21B1",
                "Rsh": "\u21B1",
                "rsqb": "]",
                "rsquo": "\u2019",
                "rsquor": "\u2019",
                "rthree": "\u22CC",
                "rtimes": "\u22CA",
                "rtri": "\u25B9",
                "rtrie": "\u22B5",
                "rtrif": "\u25B8",
                "rtriltri": "\u29CE",
                "RuleDelayed": "\u29F4",
                "ruluhar": "\u2968",
                "rx": "\u211E",
                "Sacute": "\u015A",
                "sacute": "\u015B",
                "sbquo": "\u201A",
                "scap": "\u2AB8",
                "Scaron": "\u0160",
                "scaron": "\u0161",
                "Sc": "\u2ABC",
                "sc": "\u227B",
                "sccue": "\u227D",
                "sce": "\u2AB0",
                "scE": "\u2AB4",
                "Scedil": "\u015E",
                "scedil": "\u015F",
                "Scirc": "\u015C",
                "scirc": "\u015D",
                "scnap": "\u2ABA",
                "scnE": "\u2AB6",
                "scnsim": "\u22E9",
                "scpolint": "\u2A13",
                "scsim": "\u227F",
                "Scy": "\u0421",
                "scy": "\u0441",
                "sdotb": "\u22A1",
                "sdot": "\u22C5",
                "sdote": "\u2A66",
                "searhk": "\u2925",
                "searr": "\u2198",
                "seArr": "\u21D8",
                "searrow": "\u2198",
                "sect": "\u00A7",
                "semi": ";",
                "seswar": "\u2929",
                "setminus": "\u2216",
                "setmn": "\u2216",
                "sext": "\u2736",
                "Sfr": "\uD835\uDD16",
                "sfr": "\uD835\uDD30",
                "sfrown": "\u2322",
                "sharp": "\u266F",
                "SHCHcy": "\u0429",
                "shchcy": "\u0449",
                "SHcy": "\u0428",
                "shcy": "\u0448",
                "ShortDownArrow": "\u2193",
                "ShortLeftArrow": "\u2190",
                "shortmid": "\u2223",
                "shortparallel": "\u2225",
                "ShortRightArrow": "\u2192",
                "ShortUpArrow": "\u2191",
                "shy": "\u00AD",
                "Sigma": "\u03A3",
                "sigma": "\u03C3",
                "sigmaf": "\u03C2",
                "sigmav": "\u03C2",
                "sim": "\u223C",
                "simdot": "\u2A6A",
                "sime": "\u2243",
                "simeq": "\u2243",
                "simg": "\u2A9E",
                "simgE": "\u2AA0",
                "siml": "\u2A9D",
                "simlE": "\u2A9F",
                "simne": "\u2246",
                "simplus": "\u2A24",
                "simrarr": "\u2972",
                "slarr": "\u2190",
                "SmallCircle": "\u2218",
                "smallsetminus": "\u2216",
                "smashp": "\u2A33",
                "smeparsl": "\u29E4",
                "smid": "\u2223",
                "smile": "\u2323",
                "smt": "\u2AAA",
                "smte": "\u2AAC",
                "smtes": "\u2AAC\uFE00",
                "SOFTcy": "\u042C",
                "softcy": "\u044C",
                "solbar": "\u233F",
                "solb": "\u29C4",
                "sol": "/",
                "Sopf": "\uD835\uDD4A",
                "sopf": "\uD835\uDD64",
                "spades": "\u2660",
                "spadesuit": "\u2660",
                "spar": "\u2225",
                "sqcap": "\u2293",
                "sqcaps": "\u2293\uFE00",
                "sqcup": "\u2294",
                "sqcups": "\u2294\uFE00",
                "Sqrt": "\u221A",
                "sqsub": "\u228F",
                "sqsube": "\u2291",
                "sqsubset": "\u228F",
                "sqsubseteq": "\u2291",
                "sqsup": "\u2290",
                "sqsupe": "\u2292",
                "sqsupset": "\u2290",
                "sqsupseteq": "\u2292",
                "square": "\u25A1",
                "Square": "\u25A1",
                "SquareIntersection": "\u2293",
                "SquareSubset": "\u228F",
                "SquareSubsetEqual": "\u2291",
                "SquareSuperset": "\u2290",
                "SquareSupersetEqual": "\u2292",
                "SquareUnion": "\u2294",
                "squarf": "\u25AA",
                "squ": "\u25A1",
                "squf": "\u25AA",
                "srarr": "\u2192",
                "Sscr": "\uD835\uDCAE",
                "sscr": "\uD835\uDCC8",
                "ssetmn": "\u2216",
                "ssmile": "\u2323",
                "sstarf": "\u22C6",
                "Star": "\u22C6",
                "star": "\u2606",
                "starf": "\u2605",
                "straightepsilon": "\u03F5",
                "straightphi": "\u03D5",
                "strns": "\u00AF",
                "sub": "\u2282",
                "Sub": "\u22D0",
                "subdot": "\u2ABD",
                "subE": "\u2AC5",
                "sube": "\u2286",
                "subedot": "\u2AC3",
                "submult": "\u2AC1",
                "subnE": "\u2ACB",
                "subne": "\u228A",
                "subplus": "\u2ABF",
                "subrarr": "\u2979",
                "subset": "\u2282",
                "Subset": "\u22D0",
                "subseteq": "\u2286",
                "subseteqq": "\u2AC5",
                "SubsetEqual": "\u2286",
                "subsetneq": "\u228A",
                "subsetneqq": "\u2ACB",
                "subsim": "\u2AC7",
                "subsub": "\u2AD5",
                "subsup": "\u2AD3",
                "succapprox": "\u2AB8",
                "succ": "\u227B",
                "succcurlyeq": "\u227D",
                "Succeeds": "\u227B",
                "SucceedsEqual": "\u2AB0",
                "SucceedsSlantEqual": "\u227D",
                "SucceedsTilde": "\u227F",
                "succeq": "\u2AB0",
                "succnapprox": "\u2ABA",
                "succneqq": "\u2AB6",
                "succnsim": "\u22E9",
                "succsim": "\u227F",
                "SuchThat": "\u220B",
                "sum": "\u2211",
                "Sum": "\u2211",
                "sung": "\u266A",
                "sup1": "\u00B9",
                "sup2": "\u00B2",
                "sup3": "\u00B3",
                "sup": "\u2283",
                "Sup": "\u22D1",
                "supdot": "\u2ABE",
                "supdsub": "\u2AD8",
                "supE": "\u2AC6",
                "supe": "\u2287",
                "supedot": "\u2AC4",
                "Superset": "\u2283",
                "SupersetEqual": "\u2287",
                "suphsol": "\u27C9",
                "suphsub": "\u2AD7",
                "suplarr": "\u297B",
                "supmult": "\u2AC2",
                "supnE": "\u2ACC",
                "supne": "\u228B",
                "supplus": "\u2AC0",
                "supset": "\u2283",
                "Supset": "\u22D1",
                "supseteq": "\u2287",
                "supseteqq": "\u2AC6",
                "supsetneq": "\u228B",
                "supsetneqq": "\u2ACC",
                "supsim": "\u2AC8",
                "supsub": "\u2AD4",
                "supsup": "\u2AD6",
                "swarhk": "\u2926",
                "swarr": "\u2199",
                "swArr": "\u21D9",
                "swarrow": "\u2199",
                "swnwar": "\u292A",
                "szlig": "\u00DF",
                "Tab": "\t",
                "target": "\u2316",
                "Tau": "\u03A4",
                "tau": "\u03C4",
                "tbrk": "\u23B4",
                "Tcaron": "\u0164",
                "tcaron": "\u0165",
                "Tcedil": "\u0162",
                "tcedil": "\u0163",
                "Tcy": "\u0422",
                "tcy": "\u0442",
                "tdot": "\u20DB",
                "telrec": "\u2315",
                "Tfr": "\uD835\uDD17",
                "tfr": "\uD835\uDD31",
                "there4": "\u2234",
                "therefore": "\u2234",
                "Therefore": "\u2234",
                "Theta": "\u0398",
                "theta": "\u03B8",
                "thetasym": "\u03D1",
                "thetav": "\u03D1",
                "thickapprox": "\u2248",
                "thicksim": "\u223C",
                "ThickSpace": "\u205F\u200A",
                "ThinSpace": "\u2009",
                "thinsp": "\u2009",
                "thkap": "\u2248",
                "thksim": "\u223C",
                "THORN": "\u00DE",
                "thorn": "\u00FE",
                "tilde": "\u02DC",
                "Tilde": "\u223C",
                "TildeEqual": "\u2243",
                "TildeFullEqual": "\u2245",
                "TildeTilde": "\u2248",
                "timesbar": "\u2A31",
                "timesb": "\u22A0",
                "times": "\u00D7",
                "timesd": "\u2A30",
                "tint": "\u222D",
                "toea": "\u2928",
                "topbot": "\u2336",
                "topcir": "\u2AF1",
                "top": "\u22A4",
                "Topf": "\uD835\uDD4B",
                "topf": "\uD835\uDD65",
                "topfork": "\u2ADA",
                "tosa": "\u2929",
                "tprime": "\u2034",
                "trade": "\u2122",
                "TRADE": "\u2122",
                "triangle": "\u25B5",
                "triangledown": "\u25BF",
                "triangleleft": "\u25C3",
                "trianglelefteq": "\u22B4",
                "triangleq": "\u225C",
                "triangleright": "\u25B9",
                "trianglerighteq": "\u22B5",
                "tridot": "\u25EC",
                "trie": "\u225C",
                "triminus": "\u2A3A",
                "TripleDot": "\u20DB",
                "triplus": "\u2A39",
                "trisb": "\u29CD",
                "tritime": "\u2A3B",
                "trpezium": "\u23E2",
                "Tscr": "\uD835\uDCAF",
                "tscr": "\uD835\uDCC9",
                "TScy": "\u0426",
                "tscy": "\u0446",
                "TSHcy": "\u040B",
                "tshcy": "\u045B",
                "Tstrok": "\u0166",
                "tstrok": "\u0167",
                "twixt": "\u226C",
                "twoheadleftarrow": "\u219E",
                "twoheadrightarrow": "\u21A0",
                "Uacute": "\u00DA",
                "uacute": "\u00FA",
                "uarr": "\u2191",
                "Uarr": "\u219F",
                "uArr": "\u21D1",
                "Uarrocir": "\u2949",
                "Ubrcy": "\u040E",
                "ubrcy": "\u045E",
                "Ubreve": "\u016C",
                "ubreve": "\u016D",
                "Ucirc": "\u00DB",
                "ucirc": "\u00FB",
                "Ucy": "\u0423",
                "ucy": "\u0443",
                "udarr": "\u21C5",
                "Udblac": "\u0170",
                "udblac": "\u0171",
                "udhar": "\u296E",
                "ufisht": "\u297E",
                "Ufr": "\uD835\uDD18",
                "ufr": "\uD835\uDD32",
                "Ugrave": "\u00D9",
                "ugrave": "\u00F9",
                "uHar": "\u2963",
                "uharl": "\u21BF",
                "uharr": "\u21BE",
                "uhblk": "\u2580",
                "ulcorn": "\u231C",
                "ulcorner": "\u231C",
                "ulcrop": "\u230F",
                "ultri": "\u25F8",
                "Umacr": "\u016A",
                "umacr": "\u016B",
                "uml": "\u00A8",
                "UnderBar": "_",
                "UnderBrace": "\u23DF",
                "UnderBracket": "\u23B5",
                "UnderParenthesis": "\u23DD",
                "Union": "\u22C3",
                "UnionPlus": "\u228E",
                "Uogon": "\u0172",
                "uogon": "\u0173",
                "Uopf": "\uD835\uDD4C",
                "uopf": "\uD835\uDD66",
                "UpArrowBar": "\u2912",
                "uparrow": "\u2191",
                "UpArrow": "\u2191",
                "Uparrow": "\u21D1",
                "UpArrowDownArrow": "\u21C5",
                "updownarrow": "\u2195",
                "UpDownArrow": "\u2195",
                "Updownarrow": "\u21D5",
                "UpEquilibrium": "\u296E",
                "upharpoonleft": "\u21BF",
                "upharpoonright": "\u21BE",
                "uplus": "\u228E",
                "UpperLeftArrow": "\u2196",
                "UpperRightArrow": "\u2197",
                "upsi": "\u03C5",
                "Upsi": "\u03D2",
                "upsih": "\u03D2",
                "Upsilon": "\u03A5",
                "upsilon": "\u03C5",
                "UpTeeArrow": "\u21A5",
                "UpTee": "\u22A5",
                "upuparrows": "\u21C8",
                "urcorn": "\u231D",
                "urcorner": "\u231D",
                "urcrop": "\u230E",
                "Uring": "\u016E",
                "uring": "\u016F",
                "urtri": "\u25F9",
                "Uscr": "\uD835\uDCB0",
                "uscr": "\uD835\uDCCA",
                "utdot": "\u22F0",
                "Utilde": "\u0168",
                "utilde": "\u0169",
                "utri": "\u25B5",
                "utrif": "\u25B4",
                "uuarr": "\u21C8",
                "Uuml": "\u00DC",
                "uuml": "\u00FC",
                "uwangle": "\u29A7",
                "vangrt": "\u299C",
                "varepsilon": "\u03F5",
                "varkappa": "\u03F0",
                "varnothing": "\u2205",
                "varphi": "\u03D5",
                "varpi": "\u03D6",
                "varpropto": "\u221D",
                "varr": "\u2195",
                "vArr": "\u21D5",
                "varrho": "\u03F1",
                "varsigma": "\u03C2",
                "varsubsetneq": "\u228A\uFE00",
                "varsubsetneqq": "\u2ACB\uFE00",
                "varsupsetneq": "\u228B\uFE00",
                "varsupsetneqq": "\u2ACC\uFE00",
                "vartheta": "\u03D1",
                "vartriangleleft": "\u22B2",
                "vartriangleright": "\u22B3",
                "vBar": "\u2AE8",
                "Vbar": "\u2AEB",
                "vBarv": "\u2AE9",
                "Vcy": "\u0412",
                "vcy": "\u0432",
                "vdash": "\u22A2",
                "vDash": "\u22A8",
                "Vdash": "\u22A9",
                "VDash": "\u22AB",
                "Vdashl": "\u2AE6",
                "veebar": "\u22BB",
                "vee": "\u2228",
                "Vee": "\u22C1",
                "veeeq": "\u225A",
                "vellip": "\u22EE",
                "verbar": "|",
                "Verbar": "\u2016",
                "vert": "|",
                "Vert": "\u2016",
                "VerticalBar": "\u2223",
                "VerticalLine": "|",
                "VerticalSeparator": "\u2758",
                "VerticalTilde": "\u2240",
                "VeryThinSpace": "\u200A",
                "Vfr": "\uD835\uDD19",
                "vfr": "\uD835\uDD33",
                "vltri": "\u22B2",
                "vnsub": "\u2282\u20D2",
                "vnsup": "\u2283\u20D2",
                "Vopf": "\uD835\uDD4D",
                "vopf": "\uD835\uDD67",
                "vprop": "\u221D",
                "vrtri": "\u22B3",
                "Vscr": "\uD835\uDCB1",
                "vscr": "\uD835\uDCCB",
                "vsubnE": "\u2ACB\uFE00",
                "vsubne": "\u228A\uFE00",
                "vsupnE": "\u2ACC\uFE00",
                "vsupne": "\u228B\uFE00",
                "Vvdash": "\u22AA",
                "vzigzag": "\u299A",
                "Wcirc": "\u0174",
                "wcirc": "\u0175",
                "wedbar": "\u2A5F",
                "wedge": "\u2227",
                "Wedge": "\u22C0",
                "wedgeq": "\u2259",
                "weierp": "\u2118",
                "Wfr": "\uD835\uDD1A",
                "wfr": "\uD835\uDD34",
                "Wopf": "\uD835\uDD4E",
                "wopf": "\uD835\uDD68",
                "wp": "\u2118",
                "wr": "\u2240",
                "wreath": "\u2240",
                "Wscr": "\uD835\uDCB2",
                "wscr": "\uD835\uDCCC",
                "xcap": "\u22C2",
                "xcirc": "\u25EF",
                "xcup": "\u22C3",
                "xdtri": "\u25BD",
                "Xfr": "\uD835\uDD1B",
                "xfr": "\uD835\uDD35",
                "xharr": "\u27F7",
                "xhArr": "\u27FA",
                "Xi": "\u039E",
                "xi": "\u03BE",
                "xlarr": "\u27F5",
                "xlArr": "\u27F8",
                "xmap": "\u27FC",
                "xnis": "\u22FB",
                "xodot": "\u2A00",
                "Xopf": "\uD835\uDD4F",
                "xopf": "\uD835\uDD69",
                "xoplus": "\u2A01",
                "xotime": "\u2A02",
                "xrarr": "\u27F6",
                "xrArr": "\u27F9",
                "Xscr": "\uD835\uDCB3",
                "xscr": "\uD835\uDCCD",
                "xsqcup": "\u2A06",
                "xuplus": "\u2A04",
                "xutri": "\u25B3",
                "xvee": "\u22C1",
                "xwedge": "\u22C0",
                "Yacute": "\u00DD",
                "yacute": "\u00FD",
                "YAcy": "\u042F",
                "yacy": "\u044F",
                "Ycirc": "\u0176",
                "ycirc": "\u0177",
                "Ycy": "\u042B",
                "ycy": "\u044B",
                "yen": "\u00A5",
                "Yfr": "\uD835\uDD1C",
                "yfr": "\uD835\uDD36",
                "YIcy": "\u0407",
                "yicy": "\u0457",
                "Yopf": "\uD835\uDD50",
                "yopf": "\uD835\uDD6A",
                "Yscr": "\uD835\uDCB4",
                "yscr": "\uD835\uDCCE",
                "YUcy": "\u042E",
                "yucy": "\u044E",
                "yuml": "\u00FF",
                "Yuml": "\u0178",
                "Zacute": "\u0179",
                "zacute": "\u017A",
                "Zcaron": "\u017D",
                "zcaron": "\u017E",
                "Zcy": "\u0417",
                "zcy": "\u0437",
                "Zdot": "\u017B",
                "zdot": "\u017C",
                "zeetrf": "\u2128",
                "ZeroWidthSpace": "\u200B",
                "Zeta": "\u0396",
                "zeta": "\u03B6",
                "zfr": "\uD835\uDD37",
                "Zfr": "\u2128",
                "ZHcy": "\u0416",
                "zhcy": "\u0436",
                "zigrarr": "\u21DD",
                "zopf": "\uD835\uDD6B",
                "Zopf": "\u2124",
                "Zscr": "\uD835\uDCB5",
                "zscr": "\uD835\uDCCF",
                "zwj": "\u200D",
                "zwnj": "\u200C"
            }
        }, {}],
        27: [function (_dereq_, module, exports) {
            module.exports = {
                "Aacute": "\u00C1",
                "aacute": "\u00E1",
                "Acirc": "\u00C2",
                "acirc": "\u00E2",
                "acute": "\u00B4",
                "AElig": "\u00C6",
                "aelig": "\u00E6",
                "Agrave": "\u00C0",
                "agrave": "\u00E0",
                "amp": "&",
                "AMP": "&",
                "Aring": "\u00C5",
                "aring": "\u00E5",
                "Atilde": "\u00C3",
                "atilde": "\u00E3",
                "Auml": "\u00C4",
                "auml": "\u00E4",
                "brvbar": "\u00A6",
                "Ccedil": "\u00C7",
                "ccedil": "\u00E7",
                "cedil": "\u00B8",
                "cent": "\u00A2",
                "copy": "\u00A9",
                "COPY": "\u00A9",
                "curren": "\u00A4",
                "deg": "\u00B0",
                "divide": "\u00F7",
                "Eacute": "\u00C9",
                "eacute": "\u00E9",
                "Ecirc": "\u00CA",
                "ecirc": "\u00EA",
                "Egrave": "\u00C8",
                "egrave": "\u00E8",
                "ETH": "\u00D0",
                "eth": "\u00F0",
                "Euml": "\u00CB",
                "euml": "\u00EB",
                "frac12": "\u00BD",
                "frac14": "\u00BC",
                "frac34": "\u00BE",
                "gt": ">",
                "GT": ">",
                "Iacute": "\u00CD",
                "iacute": "\u00ED",
                "Icirc": "\u00CE",
                "icirc": "\u00EE",
                "iexcl": "\u00A1",
                "Igrave": "\u00CC",
                "igrave": "\u00EC",
                "iquest": "\u00BF",
                "Iuml": "\u00CF",
                "iuml": "\u00EF",
                "laquo": "\u00AB",
                "lt": "<",
                "LT": "<",
                "macr": "\u00AF",
                "micro": "\u00B5",
                "middot": "\u00B7",
                "nbsp": "\u00A0",
                "not": "\u00AC",
                "Ntilde": "\u00D1",
                "ntilde": "\u00F1",
                "Oacute": "\u00D3",
                "oacute": "\u00F3",
                "Ocirc": "\u00D4",
                "ocirc": "\u00F4",
                "Ograve": "\u00D2",
                "ograve": "\u00F2",
                "ordf": "\u00AA",
                "ordm": "\u00BA",
                "Oslash": "\u00D8",
                "oslash": "\u00F8",
                "Otilde": "\u00D5",
                "otilde": "\u00F5",
                "Ouml": "\u00D6",
                "ouml": "\u00F6",
                "para": "\u00B6",
                "plusmn": "\u00B1",
                "pound": "\u00A3",
                "quot": "\"",
                "QUOT": "\"",
                "raquo": "\u00BB",
                "reg": "\u00AE",
                "REG": "\u00AE",
                "sect": "\u00A7",
                "shy": "\u00AD",
                "sup1": "\u00B9",
                "sup2": "\u00B2",
                "sup3": "\u00B3",
                "szlig": "\u00DF",
                "THORN": "\u00DE",
                "thorn": "\u00FE",
                "times": "\u00D7",
                "Uacute": "\u00DA",
                "uacute": "\u00FA",
                "Ucirc": "\u00DB",
                "ucirc": "\u00FB",
                "Ugrave": "\u00D9",
                "ugrave": "\u00F9",
                "uml": "\u00A8",
                "Uuml": "\u00DC",
                "uuml": "\u00FC",
                "Yacute": "\u00DD",
                "yacute": "\u00FD",
                "yen": "\u00A5",
                "yuml": "\u00FF"
            }
        }, {}],
        28: [function (_dereq_, module, exports) {
            module.exports = {"amp": "&", "apos": "'", "gt": ">", "lt": "<", "quot": "\""}

        }, {}],
        29: [function (_dereq_, module, exports) {
            arguments[4][23][0].apply(exports, arguments)
        }, {"../maps/decode.json": 30, "dup": 23}],
        30: [function (_dereq_, module, exports) {
            arguments[4][25][0].apply(exports, arguments)
        }, {"dup": 25}],
        31: [function (_dereq_, module, exports) {
            arguments[4][26][0].apply(exports, arguments)
        }, {"dup": 26}],
        32: [function (_dereq_, module, exports) {
            arguments[4][27][0].apply(exports, arguments)
        }, {"dup": 27}],
        33: [function (_dereq_, module, exports) {
            arguments[4][28][0].apply(exports, arguments)
        }, {"dup": 28}],
        34: [function (_dereq_, module, exports) {

        }, {}],
        35: [function (_dereq_, module, exports) {
            /*!
             * The buffer module from node.js, for the browser.
             *
             * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
             * @license  MIT
             */

            var base64 = _dereq_('base64-js')
            var ieee754 = _dereq_('ieee754')
            var isArray = _dereq_('is-array')

            exports.Buffer = Buffer
            exports.SlowBuffer = SlowBuffer
            exports.INSPECT_MAX_BYTES = 50
            Buffer.poolSize = 8192 // not used by this implementation

            var kMaxLength = 0x3fffffff
            var rootParent = {}

            /**
             * If `Buffer.TYPED_ARRAY_SUPPORT`:
             *   === true    Use Uint8Array implementation (fastest)
             *   === false   Use Object implementation (most compatible, even IE6)
             *
             * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
             * Opera 11.6+, iOS 4.2+.
             *
             * Note:
             *
             * - Implementation must support adding new properties to `Uint8Array` instances.
             *   Firefox 4-29 lacked support, fixed in Firefox 30+.
             *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
             *
             *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
             *
             *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
             *    incorrect length in some situations.
             *
             * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
             * get the Object implementation, which is slower but will work correctly.
             */
            Buffer.TYPED_ARRAY_SUPPORT = (function () {
                try {
                    var buf = new ArrayBuffer(0)
                    var arr = new Uint8Array(buf)
                    arr.foo = function () {
                        return 42
                    }
                    return arr.foo() === 42 && // typed array instances can be augmented
                        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
                        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
                } catch (e) {
                    return false
                }
            })()

            /**
             * Class: Buffer
             * =============
             *
             * The Buffer constructor returns instances of `Uint8Array` that are augmented
             * with function properties for all the node `Buffer` API functions. We use
             * `Uint8Array` so that square bracket notation works as expected -- it returns
             * a single octet.
             *
             * By augmenting the instances, we can avoid modifying the `Uint8Array`
             * prototype.
             */
            function Buffer(subject, encoding) {
                var self = this
                if (!(self instanceof Buffer)) return new Buffer(subject, encoding)

                var type = typeof subject
                var length

                if (type === 'number') {
                    length = +subject
                } else if (type === 'string') {
                    length = Buffer.byteLength(subject, encoding)
                } else if (type === 'object' && subject !== null) {
                    // assume object is array-like
                    if (subject.type === 'Buffer' && isArray(subject.data)) subject = subject.data
                    length = +subject.length
                } else {
                    throw new TypeError('must start with number, buffer, array or string')
                }

                if (length > kMaxLength) {
                    throw new RangeError('Attempt to allocate Buffer larger than maximum size: 0x' +
                        kMaxLength.toString(16) + ' bytes')
                }

                if (length < 0) length = 0
                else length >>>= 0 // coerce to uint32

                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    // Preferred: Return an augmented `Uint8Array` instance for best performance
                    self = Buffer._augment(new Uint8Array(length)) // eslint-disable-line consistent-this
                } else {
                    // Fallback: Return THIS instance of Buffer (created by `new`)
                    self.length = length
                    self._isBuffer = true
                }

                var i
                if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
                    // Speed optimization -- use set if we're copying from a typed array
                    self._set(subject)
                } else if (isArrayish(subject)) {
                    // Treat array-ish objects as a byte array
                    if (Buffer.isBuffer(subject)) {
                        for (i = 0; i < length; i++) {
                            self[i] = subject.readUInt8(i)
                        }
                    } else {
                        for (i = 0; i < length; i++) {
                            self[i] = ((subject[i] % 256) + 256) % 256
                        }
                    }
                } else if (type === 'string') {
                    self.write(subject, 0, encoding)
                } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT) {
                    for (i = 0; i < length; i++) {
                        self[i] = 0
                    }
                }

                if (length > 0 && length <= Buffer.poolSize) self.parent = rootParent

                return self
            }

            function SlowBuffer(subject, encoding) {
                if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

                var buf = new Buffer(subject, encoding)
                delete buf.parent
                return buf
            }

            Buffer.isBuffer = function isBuffer(b) {
                return !!(b != null && b._isBuffer)
            }

            Buffer.compare = function compare(a, b) {
                if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                    throw new TypeError('Arguments must be Buffers')
                }

                if (a === b) return 0

                var x = a.length
                var y = b.length
                for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {
                }
                if (i !== len) {
                    x = a[i]
                    y = b[i]
                }
                if (x < y) return -1
                if (y < x) return 1
                return 0
            }

            Buffer.isEncoding = function isEncoding(encoding) {
                switch (String(encoding).toLowerCase()) {
                    case 'hex':
                    case 'utf8':
                    case 'utf-8':
                    case 'ascii':
                    case 'binary':
                    case 'base64':
                    case 'raw':
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                        return true
                    default:
                        return false
                }
            }

            Buffer.concat = function concat(list, totalLength) {
                if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

                if (list.length === 0) {
                    return new Buffer(0)
                } else if (list.length === 1) {
                    return list[0]
                }

                var i
                if (totalLength === undefined) {
                    totalLength = 0
                    for (i = 0; i < list.length; i++) {
                        totalLength += list[i].length
                    }
                }

                var buf = new Buffer(totalLength)
                var pos = 0
                for (i = 0; i < list.length; i++) {
                    var item = list[i]
                    item.copy(buf, pos)
                    pos += item.length
                }
                return buf
            }

            Buffer.byteLength = function byteLength(str, encoding) {
                var ret
                str = str + ''
                switch (encoding || 'utf8') {
                    case 'ascii':
                    case 'binary':
                    case 'raw':
                        ret = str.length
                        break
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                        ret = str.length * 2
                        break
                    case 'hex':
                        ret = str.length >>> 1
                        break
                    case 'utf8':
                    case 'utf-8':
                        ret = utf8ToBytes(str).length
                        break
                    case 'base64':
                        ret = base64ToBytes(str).length
                        break
                    default:
                        ret = str.length
                }
                return ret
            }

// pre-set for values that may exist in the future
            Buffer.prototype.length = undefined
            Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
            Buffer.prototype.toString = function toString(encoding, start, end) {
                var loweredCase = false

                start = start >>> 0
                end = end === undefined || end === Infinity ? this.length : end >>> 0

                if (!encoding) encoding = 'utf8'
                if (start < 0) start = 0
                if (end > this.length) end = this.length
                if (end <= start) return ''

                while (true) {
                    switch (encoding) {
                        case 'hex':
                            return hexSlice(this, start, end)

                        case 'utf8':
                        case 'utf-8':
                            return utf8Slice(this, start, end)

                        case 'ascii':
                            return asciiSlice(this, start, end)

                        case 'binary':
                            return binarySlice(this, start, end)

                        case 'base64':
                            return base64Slice(this, start, end)

                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return utf16leSlice(this, start, end)

                        default:
                            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                            encoding = (encoding + '').toLowerCase()
                            loweredCase = true
                    }
                }
            }

            Buffer.prototype.equals = function equals(b) {
                if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
                if (this === b) return true
                return Buffer.compare(this, b) === 0
            }

            Buffer.prototype.inspect = function inspect() {
                var str = ''
                var max = exports.INSPECT_MAX_BYTES
                if (this.length > 0) {
                    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
                    if (this.length > max) str += ' ... '
                }
                return '<Buffer ' + str + '>'
            }

            Buffer.prototype.compare = function compare(b) {
                if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
                if (this === b) return 0
                return Buffer.compare(this, b)
            }

            Buffer.prototype.indexOf = function indexOf(val, byteOffset) {
                if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
                else if (byteOffset < -0x80000000) byteOffset = -0x80000000
                byteOffset >>= 0

                if (this.length === 0) return -1
                if (byteOffset >= this.length) return -1

                // Negative offsets start from the end of the buffer
                if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

                if (typeof val === 'string') {
                    if (val.length === 0) return -1 // special case: looking for empty string always fails
                    return String.prototype.indexOf.call(this, val, byteOffset)
                }
                if (Buffer.isBuffer(val)) {
                    return arrayIndexOf(this, val, byteOffset)
                }
                if (typeof val === 'number') {
                    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
                        return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
                    }
                    return arrayIndexOf(this, [val], byteOffset)
                }

                function arrayIndexOf(arr, val, byteOffset) {
                    var foundIndex = -1
                    for (var i = 0; byteOffset + i < arr.length; i++) {
                        if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
                            if (foundIndex === -1) foundIndex = i
                            if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
                        } else {
                            foundIndex = -1
                        }
                    }
                    return -1
                }

                throw new TypeError('val must be string, number or Buffer')
            }

// `get` will be removed in Node 0.13+
            Buffer.prototype.get = function get(offset) {
                // console.log('.get() is deprecated. Access using array indexes instead.')
                return this.readUInt8(offset)
            }

// `set` will be removed in Node 0.13+
            Buffer.prototype.set = function set(v, offset) {
                // console.log('.set() is deprecated. Access using array indexes instead.')
                return this.writeUInt8(v, offset)
            }

            function hexWrite(buf, string, offset, length) {
                offset = Number(offset) || 0
                var remaining = buf.length - offset
                if (!length) {
                    length = remaining
                } else {
                    length = Number(length)
                    if (length > remaining) {
                        length = remaining
                    }
                }

                // must be an even number of digits
                var strLen = string.length
                if (strLen % 2 !== 0) throw new Error('Invalid hex string')

                if (length > strLen / 2) {
                    length = strLen / 2
                }
                for (var i = 0; i < length; i++) {
                    var parsed = parseInt(string.substr(i * 2, 2), 16)
                    if (isNaN(parsed)) throw new Error('Invalid hex string')
                    buf[offset + i] = parsed
                }
                return i
            }

            function utf8Write(buf, string, offset, length) {
                var charsWritten = blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
                return charsWritten
            }

            function asciiWrite(buf, string, offset, length) {
                var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
                return charsWritten
            }

            function binaryWrite(buf, string, offset, length) {
                return asciiWrite(buf, string, offset, length)
            }

            function base64Write(buf, string, offset, length) {
                var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
                return charsWritten
            }

            function utf16leWrite(buf, string, offset, length) {
                var charsWritten = blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
                return charsWritten
            }

            Buffer.prototype.write = function write(string, offset, length, encoding) {
                // Support both (string, offset, length, encoding)
                // and the legacy (string, encoding, offset, length)
                if (isFinite(offset)) {
                    if (!isFinite(length)) {
                        encoding = length
                        length = undefined
                    }
                } else {  // legacy
                    var swap = encoding
                    encoding = offset
                    offset = length
                    length = swap
                }

                offset = Number(offset) || 0

                if (length < 0 || offset < 0 || offset > this.length) {
                    throw new RangeError('attempt to write outside buffer bounds')
                }

                var remaining = this.length - offset
                if (!length) {
                    length = remaining
                } else {
                    length = Number(length)
                    if (length > remaining) {
                        length = remaining
                    }
                }
                encoding = String(encoding || 'utf8').toLowerCase()

                var ret
                switch (encoding) {
                    case 'hex':
                        ret = hexWrite(this, string, offset, length)
                        break
                    case 'utf8':
                    case 'utf-8':
                        ret = utf8Write(this, string, offset, length)
                        break
                    case 'ascii':
                        ret = asciiWrite(this, string, offset, length)
                        break
                    case 'binary':
                        ret = binaryWrite(this, string, offset, length)
                        break
                    case 'base64':
                        ret = base64Write(this, string, offset, length)
                        break
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                        ret = utf16leWrite(this, string, offset, length)
                        break
                    default:
                        throw new TypeError('Unknown encoding: ' + encoding)
                }
                return ret
            }

            Buffer.prototype.toJSON = function toJSON() {
                return {
                    type: 'Buffer',
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            }

            function base64Slice(buf, start, end) {
                if (start === 0 && end === buf.length) {
                    return base64.fromByteArray(buf)
                } else {
                    return base64.fromByteArray(buf.slice(start, end))
                }
            }

            function utf8Slice(buf, start, end) {
                var res = ''
                var tmp = ''
                end = Math.min(buf.length, end)

                for (var i = start; i < end; i++) {
                    if (buf[i] <= 0x7F) {
                        res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
                        tmp = ''
                    } else {
                        tmp += '%' + buf[i].toString(16)
                    }
                }

                return res + decodeUtf8Char(tmp)
            }

            function asciiSlice(buf, start, end) {
                var ret = ''
                end = Math.min(buf.length, end)

                for (var i = start; i < end; i++) {
                    ret += String.fromCharCode(buf[i] & 0x7F)
                }
                return ret
            }

            function binarySlice(buf, start, end) {
                var ret = ''
                end = Math.min(buf.length, end)

                for (var i = start; i < end; i++) {
                    ret += String.fromCharCode(buf[i])
                }
                return ret
            }

            function hexSlice(buf, start, end) {
                var len = buf.length

                if (!start || start < 0) start = 0
                if (!end || end < 0 || end > len) end = len

                var out = ''
                for (var i = start; i < end; i++) {
                    out += toHex(buf[i])
                }
                return out
            }

            function utf16leSlice(buf, start, end) {
                var bytes = buf.slice(start, end)
                var res = ''
                for (var i = 0; i < bytes.length; i += 2) {
                    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
                }
                return res
            }

            Buffer.prototype.slice = function slice(start, end) {
                var len = this.length
                start = ~~start
                end = end === undefined ? len : ~~end

                if (start < 0) {
                    start += len
                    if (start < 0) start = 0
                } else if (start > len) {
                    start = len
                }

                if (end < 0) {
                    end += len
                    if (end < 0) end = 0
                } else if (end > len) {
                    end = len
                }

                if (end < start) end = start

                var newBuf
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    newBuf = Buffer._augment(this.subarray(start, end))
                } else {
                    var sliceLen = end - start
                    newBuf = new Buffer(sliceLen, undefined)
                    for (var i = 0; i < sliceLen; i++) {
                        newBuf[i] = this[i + start]
                    }
                }

                if (newBuf.length) newBuf.parent = this.parent || this

                return newBuf
            }

            /*
             * Need to make sure that buffer isn't trying to write out of bounds.
             */
            function checkOffset(offset, ext, length) {
                if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
                if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
            }

            Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
                offset = offset >>> 0
                byteLength = byteLength >>> 0
                if (!noAssert) checkOffset(offset, byteLength, this.length)

                var val = this[offset]
                var mul = 1
                var i = 0
                while (++i < byteLength && (mul *= 0x100)) {
                    val += this[offset + i] * mul
                }

                return val
            }

            Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
                offset = offset >>> 0
                byteLength = byteLength >>> 0
                if (!noAssert) {
                    checkOffset(offset, byteLength, this.length)
                }

                var val = this[offset + --byteLength]
                var mul = 1
                while (byteLength > 0 && (mul *= 0x100)) {
                    val += this[offset + --byteLength] * mul
                }

                return val
            }

            Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 1, this.length)
                return this[offset]
            }

            Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length)
                return this[offset] | (this[offset + 1] << 8)
            }

            Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length)
                return (this[offset] << 8) | this[offset + 1]
            }

            Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)

                return ((this[offset]) |
                    (this[offset + 1] << 8) |
                    (this[offset + 2] << 16)) +
                    (this[offset + 3] * 0x1000000)
            }

            Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)

                return (this[offset] * 0x1000000) +
                    ((this[offset + 1] << 16) |
                    (this[offset + 2] << 8) |
                    this[offset + 3])
            }

            Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
                offset = offset >>> 0
                byteLength = byteLength >>> 0
                if (!noAssert) checkOffset(offset, byteLength, this.length)

                var val = this[offset]
                var mul = 1
                var i = 0
                while (++i < byteLength && (mul *= 0x100)) {
                    val += this[offset + i] * mul
                }
                mul *= 0x80

                if (val >= mul) val -= Math.pow(2, 8 * byteLength)

                return val
            }

            Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
                offset = offset >>> 0
                byteLength = byteLength >>> 0
                if (!noAssert) checkOffset(offset, byteLength, this.length)

                var i = byteLength
                var mul = 1
                var val = this[offset + --i]
                while (i > 0 && (mul *= 0x100)) {
                    val += this[offset + --i] * mul
                }
                mul *= 0x80

                if (val >= mul) val -= Math.pow(2, 8 * byteLength)

                return val
            }

            Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 1, this.length)
                if (!(this[offset] & 0x80)) return (this[offset])
                return ((0xff - this[offset] + 1) * -1)
            }

            Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length)
                var val = this[offset] | (this[offset + 1] << 8)
                return (val & 0x8000) ? val | 0xFFFF0000 : val
            }

            Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 2, this.length)
                var val = this[offset + 1] | (this[offset] << 8)
                return (val & 0x8000) ? val | 0xFFFF0000 : val
            }

            Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)

                return (this[offset]) |
                    (this[offset + 1] << 8) |
                    (this[offset + 2] << 16) |
                    (this[offset + 3] << 24)
            }

            Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)

                return (this[offset] << 24) |
                    (this[offset + 1] << 16) |
                    (this[offset + 2] << 8) |
                    (this[offset + 3])
            }

            Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)
                return ieee754.read(this, offset, true, 23, 4)
            }

            Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 4, this.length)
                return ieee754.read(this, offset, false, 23, 4)
            }

            Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 8, this.length)
                return ieee754.read(this, offset, true, 52, 8)
            }

            Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
                if (!noAssert) checkOffset(offset, 8, this.length)
                return ieee754.read(this, offset, false, 52, 8)
            }

            function checkInt(buf, value, offset, ext, max, min) {
                if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
                if (value > max || value < min) throw new RangeError('value is out of bounds')
                if (offset + ext > buf.length) throw new RangeError('index out of range')
            }

            Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
                value = +value
                offset = offset >>> 0
                byteLength = byteLength >>> 0
                if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

                var mul = 1
                var i = 0
                this[offset] = value & 0xFF
                while (++i < byteLength && (mul *= 0x100)) {
                    this[offset + i] = (value / mul) >>> 0 & 0xFF
                }

                return offset + byteLength
            }

            Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
                value = +value
                offset = offset >>> 0
                byteLength = byteLength >>> 0
                if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

                var i = byteLength - 1
                var mul = 1
                this[offset + i] = value & 0xFF
                while (--i >= 0 && (mul *= 0x100)) {
                    this[offset + i] = (value / mul) >>> 0 & 0xFF
                }

                return offset + byteLength
            }

            Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
                if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
                this[offset] = value
                return offset + 1
            }

            function objectWriteUInt16(buf, value, offset, littleEndian) {
                if (value < 0) value = 0xffff + value + 1
                for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
                    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
                        (littleEndian ? i : 1 - i) * 8
                }
            }

            Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = value
                    this[offset + 1] = (value >>> 8)
                } else {
                    objectWriteUInt16(this, value, offset, true)
                }
                return offset + 2
            }

            Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = (value >>> 8)
                    this[offset + 1] = value
                } else {
                    objectWriteUInt16(this, value, offset, false)
                }
                return offset + 2
            }

            function objectWriteUInt32(buf, value, offset, littleEndian) {
                if (value < 0) value = 0xffffffff + value + 1
                for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
                    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
                }
            }

            Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset + 3] = (value >>> 24)
                    this[offset + 2] = (value >>> 16)
                    this[offset + 1] = (value >>> 8)
                    this[offset] = value
                } else {
                    objectWriteUInt32(this, value, offset, true)
                }
                return offset + 4
            }

            Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = (value >>> 24)
                    this[offset + 1] = (value >>> 16)
                    this[offset + 2] = (value >>> 8)
                    this[offset + 3] = value
                } else {
                    objectWriteUInt32(this, value, offset, false)
                }
                return offset + 4
            }

            Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) {
                    checkInt(
                        this, value, offset, byteLength,
                        Math.pow(2, 8 * byteLength - 1) - 1,
                        -Math.pow(2, 8 * byteLength - 1)
                    )
                }

                var i = 0
                var mul = 1
                var sub = value < 0 ? 1 : 0
                this[offset] = value & 0xFF
                while (++i < byteLength && (mul *= 0x100)) {
                    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
                }

                return offset + byteLength
            }

            Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) {
                    checkInt(
                        this, value, offset, byteLength,
                        Math.pow(2, 8 * byteLength - 1) - 1,
                        -Math.pow(2, 8 * byteLength - 1)
                    )
                }

                var i = byteLength - 1
                var mul = 1
                var sub = value < 0 ? 1 : 0
                this[offset + i] = value & 0xFF
                while (--i >= 0 && (mul *= 0x100)) {
                    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
                }

                return offset + byteLength
            }

            Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
                if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
                if (value < 0) value = 0xff + value + 1
                this[offset] = value
                return offset + 1
            }

            Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = value
                    this[offset + 1] = (value >>> 8)
                } else {
                    objectWriteUInt16(this, value, offset, true)
                }
                return offset + 2
            }

            Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = (value >>> 8)
                    this[offset + 1] = value
                } else {
                    objectWriteUInt16(this, value, offset, false)
                }
                return offset + 2
            }

            Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = value
                    this[offset + 1] = (value >>> 8)
                    this[offset + 2] = (value >>> 16)
                    this[offset + 3] = (value >>> 24)
                } else {
                    objectWriteUInt32(this, value, offset, true)
                }
                return offset + 4
            }

            Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
                value = +value
                offset = offset >>> 0
                if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
                if (value < 0) value = 0xffffffff + value + 1
                if (Buffer.TYPED_ARRAY_SUPPORT) {
                    this[offset] = (value >>> 24)
                    this[offset + 1] = (value >>> 16)
                    this[offset + 2] = (value >>> 8)
                    this[offset + 3] = value
                } else {
                    objectWriteUInt32(this, value, offset, false)
                }
                return offset + 4
            }

            function checkIEEE754(buf, value, offset, ext, max, min) {
                if (value > max || value < min) throw new RangeError('value is out of bounds')
                if (offset + ext > buf.length) throw new RangeError('index out of range')
                if (offset < 0) throw new RangeError('index out of range')
            }

            function writeFloat(buf, value, offset, littleEndian, noAssert) {
                if (!noAssert) {
                    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
                }
                ieee754.write(buf, value, offset, littleEndian, 23, 4)
                return offset + 4
            }

            Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
                return writeFloat(this, value, offset, true, noAssert)
            }

            Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
                return writeFloat(this, value, offset, false, noAssert)
            }

            function writeDouble(buf, value, offset, littleEndian, noAssert) {
                if (!noAssert) {
                    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
                }
                ieee754.write(buf, value, offset, littleEndian, 52, 8)
                return offset + 8
            }

            Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
                return writeDouble(this, value, offset, true, noAssert)
            }

            Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
                return writeDouble(this, value, offset, false, noAssert)
            }

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
            Buffer.prototype.copy = function copy(target, target_start, start, end) {
                if (!start) start = 0
                if (!end && end !== 0) end = this.length
                if (target_start >= target.length) target_start = target.length
                if (!target_start) target_start = 0
                if (end > 0 && end < start) end = start

                // Copy 0 bytes; we're done
                if (end === start) return 0
                if (target.length === 0 || this.length === 0) return 0

                // Fatal error conditions
                if (target_start < 0) {
                    throw new RangeError('targetStart out of bounds')
                }
                if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
                if (end < 0) throw new RangeError('sourceEnd out of bounds')

                // Are we oob?
                if (end > this.length) end = this.length
                if (target.length - target_start < end - start) {
                    end = target.length - target_start + start
                }

                var len = end - start

                if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
                    for (var i = 0; i < len; i++) {
                        target[i + target_start] = this[i + start]
                    }
                } else {
                    target._set(this.subarray(start, start + len), target_start)
                }

                return len
            }

// fill(value, start=0, end=buffer.length)
            Buffer.prototype.fill = function fill(value, start, end) {
                if (!value) value = 0
                if (!start) start = 0
                if (!end) end = this.length

                if (end < start) throw new RangeError('end < start')

                // Fill 0 bytes; we're done
                if (end === start) return
                if (this.length === 0) return

                if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
                if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

                var i
                if (typeof value === 'number') {
                    for (i = start; i < end; i++) {
                        this[i] = value
                    }
                } else {
                    var bytes = utf8ToBytes(value.toString())
                    var len = bytes.length
                    for (i = start; i < end; i++) {
                        this[i] = bytes[i % len]
                    }
                }

                return this
            }

            /**
             * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
             * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
             */
            Buffer.prototype.toArrayBuffer = function toArrayBuffer() {
                if (typeof Uint8Array !== 'undefined') {
                    if (Buffer.TYPED_ARRAY_SUPPORT) {
                        return (new Buffer(this)).buffer
                    } else {
                        var buf = new Uint8Array(this.length)
                        for (var i = 0, len = buf.length; i < len; i += 1) {
                            buf[i] = this[i]
                        }
                        return buf.buffer
                    }
                } else {
                    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
                }
            }

// HELPER FUNCTIONS
// ================

            var BP = Buffer.prototype

            /**
             * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
             */
            Buffer._augment = function _augment(arr) {
                arr.constructor = Buffer
                arr._isBuffer = true

                // save reference to original Uint8Array set method before overwriting
                arr._set = arr.set

                // deprecated, will be removed in node 0.13+
                arr.get = BP.get
                arr.set = BP.set

                arr.write = BP.write
                arr.toString = BP.toString
                arr.toLocaleString = BP.toString
                arr.toJSON = BP.toJSON
                arr.equals = BP.equals
                arr.compare = BP.compare
                arr.indexOf = BP.indexOf
                arr.copy = BP.copy
                arr.slice = BP.slice
                arr.readUIntLE = BP.readUIntLE
                arr.readUIntBE = BP.readUIntBE
                arr.readUInt8 = BP.readUInt8
                arr.readUInt16LE = BP.readUInt16LE
                arr.readUInt16BE = BP.readUInt16BE
                arr.readUInt32LE = BP.readUInt32LE
                arr.readUInt32BE = BP.readUInt32BE
                arr.readIntLE = BP.readIntLE
                arr.readIntBE = BP.readIntBE
                arr.readInt8 = BP.readInt8
                arr.readInt16LE = BP.readInt16LE
                arr.readInt16BE = BP.readInt16BE
                arr.readInt32LE = BP.readInt32LE
                arr.readInt32BE = BP.readInt32BE
                arr.readFloatLE = BP.readFloatLE
                arr.readFloatBE = BP.readFloatBE
                arr.readDoubleLE = BP.readDoubleLE
                arr.readDoubleBE = BP.readDoubleBE
                arr.writeUInt8 = BP.writeUInt8
                arr.writeUIntLE = BP.writeUIntLE
                arr.writeUIntBE = BP.writeUIntBE
                arr.writeUInt16LE = BP.writeUInt16LE
                arr.writeUInt16BE = BP.writeUInt16BE
                arr.writeUInt32LE = BP.writeUInt32LE
                arr.writeUInt32BE = BP.writeUInt32BE
                arr.writeIntLE = BP.writeIntLE
                arr.writeIntBE = BP.writeIntBE
                arr.writeInt8 = BP.writeInt8
                arr.writeInt16LE = BP.writeInt16LE
                arr.writeInt16BE = BP.writeInt16BE
                arr.writeInt32LE = BP.writeInt32LE
                arr.writeInt32BE = BP.writeInt32BE
                arr.writeFloatLE = BP.writeFloatLE
                arr.writeFloatBE = BP.writeFloatBE
                arr.writeDoubleLE = BP.writeDoubleLE
                arr.writeDoubleBE = BP.writeDoubleBE
                arr.fill = BP.fill
                arr.inspect = BP.inspect
                arr.toArrayBuffer = BP.toArrayBuffer

                return arr
            }

            var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g

            function base64clean(str) {
                // Node strips out invalid characters like \n and \t from the string, base64-js does not
                str = stringtrim(str).replace(INVALID_BASE64_RE, '')
                // Node converts strings with length < 2 to ''
                if (str.length < 2) return ''
                // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
                while (str.length % 4 !== 0) {
                    str = str + '='
                }
                return str
            }

            function stringtrim(str) {
                if (str.trim) return str.trim()
                return str.replace(/^\s+|\s+$/g, '')
            }

            function isArrayish(subject) {
                return isArray(subject) || Buffer.isBuffer(subject) ||
                    subject && typeof subject === 'object' &&
                    typeof subject.length === 'number'
            }

            function toHex(n) {
                if (n < 16) return '0' + n.toString(16)
                return n.toString(16)
            }

            function utf8ToBytes(string, units) {
                units = units || Infinity
                var codePoint
                var length = string.length
                var leadSurrogate = null
                var bytes = []
                var i = 0

                for (; i < length; i++) {
                    codePoint = string.charCodeAt(i)

                    // is surrogate component
                    if (codePoint > 0xD7FF && codePoint < 0xE000) {
                        // last char was a lead
                        if (leadSurrogate) {
                            // 2 leads in a row
                            if (codePoint < 0xDC00) {
                                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                leadSurrogate = codePoint
                                continue
                            } else {
                                // valid surrogate pair
                                codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
                                leadSurrogate = null
                            }
                        } else {
                            // no lead yet

                            if (codePoint > 0xDBFF) {
                                // unexpected trail
                                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                continue
                            } else if (i + 1 === length) {
                                // unpaired lead
                                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                continue
                            } else {
                                // valid lead
                                leadSurrogate = codePoint
                                continue
                            }
                        }
                    } else if (leadSurrogate) {
                        // valid bmp char, but last char was a lead
                        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                        leadSurrogate = null
                    }

                    // encode utf8
                    if (codePoint < 0x80) {
                        if ((units -= 1) < 0) break
                        bytes.push(codePoint)
                    } else if (codePoint < 0x800) {
                        if ((units -= 2) < 0) break
                        bytes.push(
                            codePoint >> 0x6 | 0xC0,
                            codePoint & 0x3F | 0x80
                        )
                    } else if (codePoint < 0x10000) {
                        if ((units -= 3) < 0) break
                        bytes.push(
                            codePoint >> 0xC | 0xE0,
                            codePoint >> 0x6 & 0x3F | 0x80,
                            codePoint & 0x3F | 0x80
                        )
                    } else if (codePoint < 0x200000) {
                        if ((units -= 4) < 0) break
                        bytes.push(
                            codePoint >> 0x12 | 0xF0,
                            codePoint >> 0xC & 0x3F | 0x80,
                            codePoint >> 0x6 & 0x3F | 0x80,
                            codePoint & 0x3F | 0x80
                        )
                    } else {
                        throw new Error('Invalid code point')
                    }
                }

                return bytes
            }

            function asciiToBytes(str) {
                var byteArray = []
                for (var i = 0; i < str.length; i++) {
                    // Node's code seems to be doing this and not & 0x7F..
                    byteArray.push(str.charCodeAt(i) & 0xFF)
                }
                return byteArray
            }

            function utf16leToBytes(str, units) {
                var c, hi, lo
                var byteArray = []
                for (var i = 0; i < str.length; i++) {
                    if ((units -= 2) < 0) break

                    c = str.charCodeAt(i)
                    hi = c >> 8
                    lo = c % 256
                    byteArray.push(lo)
                    byteArray.push(hi)
                }

                return byteArray
            }

            function base64ToBytes(str) {
                return base64.toByteArray(base64clean(str))
            }

            function blitBuffer(src, dst, offset, length) {
                for (var i = 0; i < length; i++) {
                    if ((i + offset >= dst.length) || (i >= src.length)) break
                    dst[i + offset] = src[i]
                }
                return i
            }

            function decodeUtf8Char(str) {
                try {
                    return decodeURIComponent(str)
                } catch (err) {
                    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
                }
            }

        }, {"base64-js": 36, "ieee754": 37, "is-array": 38}],
        36: [function (_dereq_, module, exports) {
            var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

            ;
            (function (exports) {
                'use strict';

                var Arr = (typeof Uint8Array !== 'undefined')
                    ? Uint8Array
                    : Array

                var PLUS = '+'.charCodeAt(0)
                var SLASH = '/'.charCodeAt(0)
                var NUMBER = '0'.charCodeAt(0)
                var LOWER = 'a'.charCodeAt(0)
                var UPPER = 'A'.charCodeAt(0)
                var PLUS_URL_SAFE = '-'.charCodeAt(0)
                var SLASH_URL_SAFE = '_'.charCodeAt(0)

                function decode(elt) {
                    var code = elt.charCodeAt(0)
                    if (code === PLUS ||
                        code === PLUS_URL_SAFE)
                        return 62 // '+'
                    if (code === SLASH ||
                        code === SLASH_URL_SAFE)
                        return 63 // '/'
                    if (code < NUMBER)
                        return -1 //no match
                    if (code < NUMBER + 10)
                        return code - NUMBER + 26 + 26
                    if (code < UPPER + 26)
                        return code - UPPER
                    if (code < LOWER + 26)
                        return code - LOWER + 26
                }

                function b64ToByteArray(b64) {
                    var i, j, l, tmp, placeHolders, arr

                    if (b64.length % 4 > 0) {
                        throw new Error('Invalid string. Length must be a multiple of 4')
                    }

                    // the number of equal signs (place holders)
                    // if there are two placeholders, than the two characters before it
                    // represent one byte
                    // if there is only one, then the three characters before it represent 2 bytes
                    // this is just a cheap hack to not do indexOf twice
                    var len = b64.length
                    placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

                    // base64 is 4/3 + up to two characters of the original data
                    arr = new Arr(b64.length * 3 / 4 - placeHolders)

                    // if there are placeholders, only get up to the last complete 4 chars
                    l = placeHolders > 0 ? b64.length - 4 : b64.length

                    var L = 0

                    function push(v) {
                        arr[L++] = v
                    }

                    for (i = 0, j = 0; i < l; i += 4, j += 3) {
                        tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
                        push((tmp & 0xFF0000) >> 16)
                        push((tmp & 0xFF00) >> 8)
                        push(tmp & 0xFF)
                    }

                    if (placeHolders === 2) {
                        tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
                        push(tmp & 0xFF)
                    } else if (placeHolders === 1) {
                        tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
                        push((tmp >> 8) & 0xFF)
                        push(tmp & 0xFF)
                    }

                    return arr
                }

                function uint8ToBase64(uint8) {
                    var i,
                        extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
                        output = "",
                        temp, length

                    function encode(num) {
                        return lookup.charAt(num)
                    }

                    function tripletToBase64(num) {
                        return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
                    }

                    // go through the array every three bytes, we'll deal with trailing stuff later
                    for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
                        temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
                        output += tripletToBase64(temp)
                    }

                    // pad the end with zeros, but make sure to not forget the extra bytes
                    switch (extraBytes) {
                        case 1:
                            temp = uint8[uint8.length - 1]
                            output += encode(temp >> 2)
                            output += encode((temp << 4) & 0x3F)
                            output += '=='
                            break
                        case 2:
                            temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
                            output += encode(temp >> 10)
                            output += encode((temp >> 4) & 0x3F)
                            output += encode((temp << 2) & 0x3F)
                            output += '='
                            break
                    }

                    return output
                }

                exports.toByteArray = b64ToByteArray
                exports.fromByteArray = uint8ToBase64
            }(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

        }, {}],
        37: [function (_dereq_, module, exports) {
            exports.read = function (buffer, offset, isLE, mLen, nBytes) {
                var e, m,
                    eLen = nBytes * 8 - mLen - 1,
                    eMax = (1 << eLen) - 1,
                    eBias = eMax >> 1,
                    nBits = -7,
                    i = isLE ? (nBytes - 1) : 0,
                    d = isLE ? -1 : 1,
                    s = buffer[offset + i];

                i += d;

                e = s & ((1 << (-nBits)) - 1);
                s >>= (-nBits);
                nBits += eLen;
                for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

                m = e & ((1 << (-nBits)) - 1);
                e >>= (-nBits);
                nBits += mLen;
                for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

                if (e === 0) {
                    e = 1 - eBias;
                } else if (e === eMax) {
                    return m ? NaN : ((s ? -1 : 1) * Infinity);
                } else {
                    m = m + Math.pow(2, mLen);
                    e = e - eBias;
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
            };

            exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c,
                    eLen = nBytes * 8 - mLen - 1,
                    eMax = (1 << eLen) - 1,
                    eBias = eMax >> 1,
                    rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
                    i = isLE ? 0 : (nBytes - 1),
                    d = isLE ? 1 : -1,
                    s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

                value = Math.abs(value);

                if (isNaN(value) || value === Infinity) {
                    m = isNaN(value) ? 1 : 0;
                    e = eMax;
                } else {
                    e = Math.floor(Math.log(value) / Math.LN2);
                    if (value * (c = Math.pow(2, -e)) < 1) {
                        e--;
                        c *= 2;
                    }
                    if (e + eBias >= 1) {
                        value += rt / c;
                    } else {
                        value += rt * Math.pow(2, 1 - eBias);
                    }
                    if (value * c >= 2) {
                        e++;
                        c /= 2;
                    }

                    if (e + eBias >= eMax) {
                        m = 0;
                        e = eMax;
                    } else if (e + eBias >= 1) {
                        m = (value * c - 1) * Math.pow(2, mLen);
                        e = e + eBias;
                    } else {
                        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                        e = 0;
                    }
                }

                for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

                e = (e << mLen) | m;
                eLen += mLen;
                for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

                buffer[offset + i - d] |= s * 128;
            };

        }, {}],
        38: [function (_dereq_, module, exports) {

            /**
             * isArray
             */

            var isArray = Array.isArray;

            /**
             * toString
             */

            var str = Object.prototype.toString;

            /**
             * Whether or not the given `val`
             * is an array.
             *
             * example:
             *
             *        isArray([]);
             *        // > true
             *        isArray(arguments);
             *        // > false
             *        isArray('');
             *        // > false
             *
             * @param {mixed} val
             * @return {bool}
             */

            module.exports = isArray || function (val) {
                    return !!val && '[object Array]' == str.call(val);
                };

        }, {}],
        39: [function (_dereq_, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

            function EventEmitter() {
                this._events = this._events || {};
                this._maxListeners = this._maxListeners || undefined;
            }

            module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
            EventEmitter.EventEmitter = EventEmitter;

            EventEmitter.prototype._events = undefined;
            EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
            EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
            EventEmitter.prototype.setMaxListeners = function (n) {
                if (!isNumber(n) || n < 0 || isNaN(n))
                    throw TypeError('n must be a positive number');
                this._maxListeners = n;
                return this;
            };

            EventEmitter.prototype.emit = function (type) {
                var er, handler, len, args, i, listeners;

                if (!this._events)
                    this._events = {};

                // If there is no 'error' event listener then throw.
                if (type === 'error') {
                    if (!this._events.error ||
                        (isObject(this._events.error) && !this._events.error.length)) {
                        er = arguments[1];
                        if (er instanceof Error) {
                            throw er; // Unhandled 'error' event
                        }
                        throw TypeError('Uncaught, unspecified "error" event.');
                    }
                }

                handler = this._events[type];

                if (isUndefined(handler))
                    return false;

                if (isFunction(handler)) {
                    switch (arguments.length) {
                        // fast cases
                        case 1:
                            handler.call(this);
                            break;
                        case 2:
                            handler.call(this, arguments[1]);
                            break;
                        case 3:
                            handler.call(this, arguments[1], arguments[2]);
                            break;
                        // slower
                        default:
                            len = arguments.length;
                            args = new Array(len - 1);
                            for (i = 1; i < len; i++)
                                args[i - 1] = arguments[i];
                            handler.apply(this, args);
                    }
                } else if (isObject(handler)) {
                    len = arguments.length;
                    args = new Array(len - 1);
                    for (i = 1; i < len; i++)
                        args[i - 1] = arguments[i];

                    listeners = handler.slice();
                    len = listeners.length;
                    for (i = 0; i < len; i++)
                        listeners[i].apply(this, args);
                }

                return true;
            };

            EventEmitter.prototype.addListener = function (type, listener) {
                var m;

                if (!isFunction(listener))
                    throw TypeError('listener must be a function');

                if (!this._events)
                    this._events = {};

                // To avoid recursion in the case that type === "newListener"! Before
                // adding it to the listeners, first emit "newListener".
                if (this._events.newListener)
                    this.emit('newListener', type,
                        isFunction(listener.listener) ?
                            listener.listener : listener);

                if (!this._events[type])
                // Optimize the case of one listener. Don't need the extra array object.
                    this._events[type] = listener;
                else if (isObject(this._events[type]))
                // If we've already got an array, just append.
                    this._events[type].push(listener);
                else
                // Adding the second element, need to change to array.
                    this._events[type] = [this._events[type], listener];

                // Check for listener leak
                if (isObject(this._events[type]) && !this._events[type].warned) {
                    var m;
                    if (!isUndefined(this._maxListeners)) {
                        m = this._maxListeners;
                    } else {
                        m = EventEmitter.defaultMaxListeners;
                    }

                    if (m && m > 0 && this._events[type].length > m) {
                        this._events[type].warned = true;
                        console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            this._events[type].length);
                        if (typeof console.trace === 'function') {
                            // not supported in IE 10
                            console.trace();
                        }
                    }
                }

                return this;
            };

            EventEmitter.prototype.on = EventEmitter.prototype.addListener;

            EventEmitter.prototype.once = function (type, listener) {
                if (!isFunction(listener))
                    throw TypeError('listener must be a function');

                var fired = false;

                function g() {
                    this.removeListener(type, g);

                    if (!fired) {
                        fired = true;
                        listener.apply(this, arguments);
                    }
                }

                g.listener = listener;
                this.on(type, g);

                return this;
            };

// emits a 'removeListener' event iff the listener was removed
            EventEmitter.prototype.removeListener = function (type, listener) {
                var list, position, length, i;

                if (!isFunction(listener))
                    throw TypeError('listener must be a function');

                if (!this._events || !this._events[type])
                    return this;

                list = this._events[type];
                length = list.length;
                position = -1;

                if (list === listener ||
                    (isFunction(list.listener) && list.listener === listener)) {
                    delete this._events[type];
                    if (this._events.removeListener)
                        this.emit('removeListener', type, listener);

                } else if (isObject(list)) {
                    for (i = length; i-- > 0;) {
                        if (list[i] === listener ||
                            (list[i].listener && list[i].listener === listener)) {
                            position = i;
                            break;
                        }
                    }

                    if (position < 0)
                        return this;

                    if (list.length === 1) {
                        list.length = 0;
                        delete this._events[type];
                    } else {
                        list.splice(position, 1);
                    }

                    if (this._events.removeListener)
                        this.emit('removeListener', type, listener);
                }

                return this;
            };

            EventEmitter.prototype.removeAllListeners = function (type) {
                var key, listeners;

                if (!this._events)
                    return this;

                // not listening for removeListener, no need to emit
                if (!this._events.removeListener) {
                    if (arguments.length === 0)
                        this._events = {};
                    else if (this._events[type])
                        delete this._events[type];
                    return this;
                }

                // emit removeListener for all listeners on all events
                if (arguments.length === 0) {
                    for (key in this._events) {
                        if (key === 'removeListener') continue;
                        this.removeAllListeners(key);
                    }
                    this.removeAllListeners('removeListener');
                    this._events = {};
                    return this;
                }

                listeners = this._events[type];

                if (isFunction(listeners)) {
                    this.removeListener(type, listeners);
                } else {
                    // LIFO order
                    while (listeners.length)
                        this.removeListener(type, listeners[listeners.length - 1]);
                }
                delete this._events[type];

                return this;
            };

            EventEmitter.prototype.listeners = function (type) {
                var ret;
                if (!this._events || !this._events[type])
                    ret = [];
                else if (isFunction(this._events[type]))
                    ret = [this._events[type]];
                else
                    ret = this._events[type].slice();
                return ret;
            };

            EventEmitter.listenerCount = function (emitter, type) {
                var ret;
                if (!emitter._events || !emitter._events[type])
                    ret = 0;
                else if (isFunction(emitter._events[type]))
                    ret = 1;
                else
                    ret = emitter._events[type].length;
                return ret;
            };

            function isFunction(arg) {
                return typeof arg === 'function';
            }

            function isNumber(arg) {
                return typeof arg === 'number';
            }

            function isObject(arg) {
                return typeof arg === 'object' && arg !== null;
            }

            function isUndefined(arg) {
                return arg === void 0;
            }

        }, {}],
        40: [function (_dereq_, module, exports) {
            if (typeof Object.create === 'function') {
                // implementation from standard node.js 'util' module
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor
                    ctor.prototype = Object.create(superCtor.prototype, {
                        constructor: {
                            value: ctor,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                };
            } else {
                // old school shim for old browsers
                module.exports = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor
                    var TempCtor = function () {
                    }
                    TempCtor.prototype = superCtor.prototype
                    ctor.prototype = new TempCtor()
                    ctor.prototype.constructor = ctor
                }
            }

        }, {}],
        41: [function (_dereq_, module, exports) {
            module.exports = Array.isArray || function (arr) {
                    return Object.prototype.toString.call(arr) == '[object Array]';
                };

        }, {}],
        42: [function (_dereq_, module, exports) {
// shim for using process in browser

            var process = module.exports = {};
            var queue = [];
            var draining = false;

            function drainQueue() {
                if (draining) {
                    return;
                }
                draining = true;
                var currentQueue;
                var len = queue.length;
                while (len) {
                    currentQueue = queue;
                    queue = [];
                    var i = -1;
                    while (++i < len) {
                        currentQueue[i]();
                    }
                    len = queue.length;
                }
                draining = false;
            }

            process.nextTick = function (fun) {
                queue.push(fun);
                if (!draining) {
                    setTimeout(drainQueue, 0);
                }
            };

            process.title = 'browser';
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = ''; // empty string to avoid regexp issues
            process.versions = {};

            function noop() {
            }

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

// TODO(shtylman)
            process.cwd = function () {
                return '/'
            };
            process.chdir = function (dir) {
                throw new Error('process.chdir is not supported');
            };
            process.umask = function () {
                return 0;
            };

        }, {}],
        43: [function (_dereq_, module, exports) {
            module.exports = _dereq_("./lib/_stream_duplex.js")

        }, {"./lib/_stream_duplex.js": 44}],
        44: [function (_dereq_, module, exports) {
            (function (process) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

                module.exports = Duplex;

                /*<replacement>*/
                var objectKeys = Object.keys || function (obj) {
                        var keys = [];
                        for (var key in obj) keys.push(key);
                        return keys;
                    }
                /*</replacement>*/

                /*<replacement>*/
                var util = _dereq_('core-util-is');
                util.inherits = _dereq_('inherits');
                /*</replacement>*/

                var Readable = _dereq_('./_stream_readable');
                var Writable = _dereq_('./_stream_writable');

                util.inherits(Duplex, Readable);

                forEach(objectKeys(Writable.prototype), function (method) {
                    if (!Duplex.prototype[method])
                        Duplex.prototype[method] = Writable.prototype[method];
                });

                function Duplex(options) {
                    if (!(this instanceof Duplex))
                        return new Duplex(options);

                    Readable.call(this, options);
                    Writable.call(this, options);

                    if (options && options.readable === false)
                        this.readable = false;

                    if (options && options.writable === false)
                        this.writable = false;

                    this.allowHalfOpen = true;
                    if (options && options.allowHalfOpen === false)
                        this.allowHalfOpen = false;

                    this.once('end', onend);
                }

// the no-half-open enforcer
                function onend() {
                    // if we allow half-open state, or if the writable side ended,
                    // then we're ok.
                    if (this.allowHalfOpen || this._writableState.ended)
                        return;

                    // no more data can be written.
                    // But allow more writes to happen in this tick.
                    process.nextTick(this.end.bind(this));
                }

                function forEach(xs, f) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        f(xs[i], i);
                    }
                }

            }).call(this, _dereq_('_process'))
        }, {"./_stream_readable": 46, "./_stream_writable": 48, "_process": 42, "core-util-is": 49, "inherits": 40}],
        45: [function (_dereq_, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

            module.exports = PassThrough;

            var Transform = _dereq_('./_stream_transform');

            /*<replacement>*/
            var util = _dereq_('core-util-is');
            util.inherits = _dereq_('inherits');
            /*</replacement>*/

            util.inherits(PassThrough, Transform);

            function PassThrough(options) {
                if (!(this instanceof PassThrough))
                    return new PassThrough(options);

                Transform.call(this, options);
            }

            PassThrough.prototype._transform = function (chunk, encoding, cb) {
                cb(null, chunk);
            };

        }, {"./_stream_transform": 47, "core-util-is": 49, "inherits": 40}],
        46: [function (_dereq_, module, exports) {
            (function (process) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

                module.exports = Readable;

                /*<replacement>*/
                var isArray = _dereq_('isarray');
                /*</replacement>*/

                /*<replacement>*/
                var Buffer = _dereq_('buffer').Buffer;
                /*</replacement>*/

                Readable.ReadableState = ReadableState;

                var EE = _dereq_('events').EventEmitter;

                /*<replacement>*/
                if (!EE.listenerCount) EE.listenerCount = function (emitter, type) {
                    return emitter.listeners(type).length;
                };
                /*</replacement>*/

                var Stream = _dereq_('stream');

                /*<replacement>*/
                var util = _dereq_('core-util-is');
                util.inherits = _dereq_('inherits');
                /*</replacement>*/

                var StringDecoder;

                /*<replacement>*/
                var debug = _dereq_('util');
                if (debug && debug.debuglog) {
                    debug = debug.debuglog('stream');
                } else {
                    debug = function () {
                    };
                }
                /*</replacement>*/

                util.inherits(Readable, Stream);

                function ReadableState(options, stream) {
                    var Duplex = _dereq_('./_stream_duplex');

                    options = options || {};

                    // the point at which it stops calling _read() to fill the buffer
                    // Note: 0 is a valid value, means "don't call _read preemptively ever"
                    var hwm = options.highWaterMark;
                    var defaultHwm = options.objectMode ? 16 : 16 * 1024;
                    this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

                    // cast to ints.
                    this.highWaterMark = ~~this.highWaterMark;

                    this.buffer = [];
                    this.length = 0;
                    this.pipes = null;
                    this.pipesCount = 0;
                    this.flowing = null;
                    this.ended = false;
                    this.endEmitted = false;
                    this.reading = false;

                    // a flag to be able to tell if the onwrite cb is called immediately,
                    // or on a later tick.  We set this to true at first, because any
                    // actions that shouldn't happen until "later" should generally also
                    // not happen before the first write call.
                    this.sync = true;

                    // whenever we return null, then we set a flag to say
                    // that we're awaiting a 'readable' event emission.
                    this.needReadable = false;
                    this.emittedReadable = false;
                    this.readableListening = false;

                    // object stream flag. Used to make read(n) ignore n and to
                    // make all the buffer merging and length checks go away
                    this.objectMode = !!options.objectMode;

                    if (stream instanceof Duplex)
                        this.objectMode = this.objectMode || !!options.readableObjectMode;

                    // Crypto is kind of old and crusty.  Historically, its default string
                    // encoding is 'binary' so we have to make this configurable.
                    // Everything else in the universe uses 'utf8', though.
                    this.defaultEncoding = options.defaultEncoding || 'utf8';

                    // when piping, we only care about 'readable' events that happen
                    // after read()ing all the bytes and not getting any pushback.
                    this.ranOut = false;

                    // the number of writers that are awaiting a drain event in .pipe()s
                    this.awaitDrain = 0;

                    // if true, a maybeReadMore has been scheduled
                    this.readingMore = false;

                    this.decoder = null;
                    this.encoding = null;
                    if (options.encoding) {
                        if (!StringDecoder)
                            StringDecoder = _dereq_('string_decoder/').StringDecoder;
                        this.decoder = new StringDecoder(options.encoding);
                        this.encoding = options.encoding;
                    }
                }

                function Readable(options) {
                    var Duplex = _dereq_('./_stream_duplex');

                    if (!(this instanceof Readable))
                        return new Readable(options);

                    this._readableState = new ReadableState(options, this);

                    // legacy
                    this.readable = true;

                    Stream.call(this);
                }

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
                Readable.prototype.push = function (chunk, encoding) {
                    var state = this._readableState;

                    if (util.isString(chunk) && !state.objectMode) {
                        encoding = encoding || state.defaultEncoding;
                        if (encoding !== state.encoding) {
                            chunk = new Buffer(chunk, encoding);
                            encoding = '';
                        }
                    }

                    return readableAddChunk(this, state, chunk, encoding, false);
                };

// Unshift should *always* be something directly out of read()
                Readable.prototype.unshift = function (chunk) {
                    var state = this._readableState;
                    return readableAddChunk(this, state, chunk, '', true);
                };

                function readableAddChunk(stream, state, chunk, encoding, addToFront) {
                    var er = chunkInvalid(state, chunk);
                    if (er) {
                        stream.emit('error', er);
                    } else if (util.isNullOrUndefined(chunk)) {
                        state.reading = false;
                        if (!state.ended)
                            onEofChunk(stream, state);
                    } else if (state.objectMode || chunk && chunk.length > 0) {
                        if (state.ended && !addToFront) {
                            var e = new Error('stream.push() after EOF');
                            stream.emit('error', e);
                        } else if (state.endEmitted && addToFront) {
                            var e = new Error('stream.unshift() after end event');
                            stream.emit('error', e);
                        } else {
                            if (state.decoder && !addToFront && !encoding)
                                chunk = state.decoder.write(chunk);

                            if (!addToFront)
                                state.reading = false;

                            // if we want the data now, just emit it.
                            if (state.flowing && state.length === 0 && !state.sync) {
                                stream.emit('data', chunk);
                                stream.read(0);
                            } else {
                                // update the buffer info.
                                state.length += state.objectMode ? 1 : chunk.length;
                                if (addToFront)
                                    state.buffer.unshift(chunk);
                                else
                                    state.buffer.push(chunk);

                                if (state.needReadable)
                                    emitReadable(stream);
                            }

                            maybeReadMore(stream, state);
                        }
                    } else if (!addToFront) {
                        state.reading = false;
                    }

                    return needMoreData(state);
                }

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
                function needMoreData(state) {
                    return !state.ended &&
                        (state.needReadable ||
                        state.length < state.highWaterMark ||
                        state.length === 0);
                }

// backwards compatibility.
                Readable.prototype.setEncoding = function (enc) {
                    if (!StringDecoder)
                        StringDecoder = _dereq_('string_decoder/').StringDecoder;
                    this._readableState.decoder = new StringDecoder(enc);
                    this._readableState.encoding = enc;
                    return this;
                };

// Don't raise the hwm > 128MB
                var MAX_HWM = 0x800000;

                function roundUpToNextPowerOf2(n) {
                    if (n >= MAX_HWM) {
                        n = MAX_HWM;
                    } else {
                        // Get the next highest power of 2
                        n--;
                        for (var p = 1; p < 32; p <<= 1) n |= n >> p;
                        n++;
                    }
                    return n;
                }

                function howMuchToRead(n, state) {
                    if (state.length === 0 && state.ended)
                        return 0;

                    if (state.objectMode)
                        return n === 0 ? 0 : 1;

                    if (isNaN(n) || util.isNull(n)) {
                        // only flow one buffer at a time
                        if (state.flowing && state.buffer.length)
                            return state.buffer[0].length;
                        else
                            return state.length;
                    }

                    if (n <= 0)
                        return 0;

                    // If we're asking for more than the target buffer level,
                    // then raise the water mark.  Bump up to the next highest
                    // power of 2, to prevent increasing it excessively in tiny
                    // amounts.
                    if (n > state.highWaterMark)
                        state.highWaterMark = roundUpToNextPowerOf2(n);

                    // don't have that much.  return null, unless we've ended.
                    if (n > state.length) {
                        if (!state.ended) {
                            state.needReadable = true;
                            return 0;
                        } else
                            return state.length;
                    }

                    return n;
                }

// you can override either this method, or the async _read(n) below.
                Readable.prototype.read = function (n) {
                    debug('read', n);
                    var state = this._readableState;
                    var nOrig = n;

                    if (!util.isNumber(n) || n > 0)
                        state.emittedReadable = false;

                    // if we're doing read(0) to trigger a readable event, but we
                    // already have a bunch of data in the buffer, then just trigger
                    // the 'readable' event and move on.
                    if (n === 0 &&
                        state.needReadable &&
                        (state.length >= state.highWaterMark || state.ended)) {
                        debug('read: emitReadable', state.length, state.ended);
                        if (state.length === 0 && state.ended)
                            endReadable(this);
                        else
                            emitReadable(this);
                        return null;
                    }

                    n = howMuchToRead(n, state);

                    // if we've ended, and we're now clear, then finish it up.
                    if (n === 0 && state.ended) {
                        if (state.length === 0)
                            endReadable(this);
                        return null;
                    }

                    // All the actual chunk generation logic needs to be
                    // *below* the call to _read.  The reason is that in certain
                    // synthetic stream cases, such as passthrough streams, _read
                    // may be a completely synchronous operation which may change
                    // the state of the read buffer, providing enough data when
                    // before there was *not* enough.
                    //
                    // So, the steps are:
                    // 1. Figure out what the state of things will be after we do
                    // a read from the buffer.
                    //
                    // 2. If that resulting state will trigger a _read, then call _read.
                    // Note that this may be asynchronous, or synchronous.  Yes, it is
                    // deeply ugly to write APIs this way, but that still doesn't mean
                    // that the Readable class should behave improperly, as streams are
                    // designed to be sync/async agnostic.
                    // Take note if the _read call is sync or async (ie, if the read call
                    // has returned yet), so that we know whether or not it's safe to emit
                    // 'readable' etc.
                    //
                    // 3. Actually pull the requested chunks out of the buffer and return.

                    // if we need a readable event, then we need to do some reading.
                    var doRead = state.needReadable;
                    debug('need readable', doRead);

                    // if we currently have less than the highWaterMark, then also read some
                    if (state.length === 0 || state.length - n < state.highWaterMark) {
                        doRead = true;
                        debug('length less than watermark', doRead);
                    }

                    // however, if we've ended, then there's no point, and if we're already
                    // reading, then it's unnecessary.
                    if (state.ended || state.reading) {
                        doRead = false;
                        debug('reading or ended', doRead);
                    }

                    if (doRead) {
                        debug('do read');
                        state.reading = true;
                        state.sync = true;
                        // if the length is currently zero, then we *need* a readable event.
                        if (state.length === 0)
                            state.needReadable = true;
                        // call internal read method
                        this._read(state.highWaterMark);
                        state.sync = false;
                    }

                    // If _read pushed data synchronously, then `reading` will be false,
                    // and we need to re-evaluate how much data we can return to the user.
                    if (doRead && !state.reading)
                        n = howMuchToRead(nOrig, state);

                    var ret;
                    if (n > 0)
                        ret = fromList(n, state);
                    else
                        ret = null;

                    if (util.isNull(ret)) {
                        state.needReadable = true;
                        n = 0;
                    }

                    state.length -= n;

                    // If we have nothing in the buffer, then we want to know
                    // as soon as we *do* get something into the buffer.
                    if (state.length === 0 && !state.ended)
                        state.needReadable = true;

                    // If we tried to read() past the EOF, then emit end on the next tick.
                    if (nOrig !== n && state.ended && state.length === 0)
                        endReadable(this);

                    if (!util.isNull(ret))
                        this.emit('data', ret);

                    return ret;
                };

                function chunkInvalid(state, chunk) {
                    var er = null;
                    if (!util.isBuffer(chunk) && !util.isString(chunk) && !util.isNullOrUndefined(chunk) && !state.objectMode) {
                        er = new TypeError('Invalid non-string/buffer chunk');
                    }
                    return er;
                }

                function onEofChunk(stream, state) {
                    if (state.decoder && !state.ended) {
                        var chunk = state.decoder.end();
                        if (chunk && chunk.length) {
                            state.buffer.push(chunk);
                            state.length += state.objectMode ? 1 : chunk.length;
                        }
                    }
                    state.ended = true;

                    // emit 'readable' now to make sure it gets picked up.
                    emitReadable(stream);
                }

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
                function emitReadable(stream) {
                    var state = stream._readableState;
                    state.needReadable = false;
                    if (!state.emittedReadable) {
                        debug('emitReadable', state.flowing);
                        state.emittedReadable = true;
                        if (state.sync)
                            process.nextTick(function () {
                                emitReadable_(stream);
                            });
                        else
                            emitReadable_(stream);
                    }
                }

                function emitReadable_(stream) {
                    debug('emit readable');
                    stream.emit('readable');
                    flow(stream);
                }

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
                function maybeReadMore(stream, state) {
                    if (!state.readingMore) {
                        state.readingMore = true;
                        process.nextTick(function () {
                            maybeReadMore_(stream, state);
                        });
                    }
                }

                function maybeReadMore_(stream, state) {
                    var len = state.length;
                    while (!state.reading && !state.flowing && !state.ended &&
                    state.length < state.highWaterMark) {
                        debug('maybeReadMore read 0');
                        stream.read(0);
                        if (len === state.length)
                        // didn't get any data, stop spinning.
                            break;
                        else
                            len = state.length;
                    }
                    state.readingMore = false;
                }

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
                Readable.prototype._read = function (n) {
                    this.emit('error', new Error('not implemented'));
                };

                Readable.prototype.pipe = function (dest, pipeOpts) {
                    var src = this;
                    var state = this._readableState;

                    switch (state.pipesCount) {
                        case 0:
                            state.pipes = dest;
                            break;
                        case 1:
                            state.pipes = [state.pipes, dest];
                            break;
                        default:
                            state.pipes.push(dest);
                            break;
                    }
                    state.pipesCount += 1;
                    debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

                    var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
                        dest !== process.stdout &&
                        dest !== process.stderr;

                    var endFn = doEnd ? onend : cleanup;
                    if (state.endEmitted)
                        process.nextTick(endFn);
                    else
                        src.once('end', endFn);

                    dest.on('unpipe', onunpipe);
                    function onunpipe(readable) {
                        debug('onunpipe');
                        if (readable === src) {
                            cleanup();
                        }
                    }

                    function onend() {
                        debug('onend');
                        dest.end();
                    }

                    // when the dest drains, it reduces the awaitDrain counter
                    // on the source.  This would be more elegant with a .once()
                    // handler in flow(), but adding and removing repeatedly is
                    // too slow.
                    var ondrain = pipeOnDrain(src);
                    dest.on('drain', ondrain);

                    function cleanup() {
                        debug('cleanup');
                        // cleanup event handlers once the pipe is broken
                        dest.removeListener('close', onclose);
                        dest.removeListener('finish', onfinish);
                        dest.removeListener('drain', ondrain);
                        dest.removeListener('error', onerror);
                        dest.removeListener('unpipe', onunpipe);
                        src.removeListener('end', onend);
                        src.removeListener('end', cleanup);
                        src.removeListener('data', ondata);

                        // if the reader is waiting for a drain event from this
                        // specific writer, then it would cause it to never start
                        // flowing again.
                        // So, if this is awaiting a drain, then we just call it now.
                        // If we don't know, then assume that we are waiting for one.
                        if (state.awaitDrain &&
                            (!dest._writableState || dest._writableState.needDrain))
                            ondrain();
                    }

                    src.on('data', ondata);
                    function ondata(chunk) {
                        debug('ondata');
                        var ret = dest.write(chunk);
                        if (false === ret) {
                            debug('false write response, pause',
                                src._readableState.awaitDrain);
                            src._readableState.awaitDrain++;
                            src.pause();
                        }
                    }

                    // if the dest has an error, then stop piping into it.
                    // however, don't suppress the throwing behavior for this.
                    function onerror(er) {
                        debug('onerror', er);
                        unpipe();
                        dest.removeListener('error', onerror);
                        if (EE.listenerCount(dest, 'error') === 0)
                            dest.emit('error', er);
                    }

                    // This is a brutally ugly hack to make sure that our error handler
                    // is attached before any userland ones.  NEVER DO THIS.
                    if (!dest._events || !dest._events.error)
                        dest.on('error', onerror);
                    else if (isArray(dest._events.error))
                        dest._events.error.unshift(onerror);
                    else
                        dest._events.error = [onerror, dest._events.error];

                    // Both close and finish should trigger unpipe, but only once.
                    function onclose() {
                        dest.removeListener('finish', onfinish);
                        unpipe();
                    }

                    dest.once('close', onclose);
                    function onfinish() {
                        debug('onfinish');
                        dest.removeListener('close', onclose);
                        unpipe();
                    }

                    dest.once('finish', onfinish);

                    function unpipe() {
                        debug('unpipe');
                        src.unpipe(dest);
                    }

                    // tell the dest that it's being piped to
                    dest.emit('pipe', src);

                    // start the flow if it hasn't been started already.
                    if (!state.flowing) {
                        debug('pipe resume');
                        src.resume();
                    }

                    return dest;
                };

                function pipeOnDrain(src) {
                    return function () {
                        var state = src._readableState;
                        debug('pipeOnDrain', state.awaitDrain);
                        if (state.awaitDrain)
                            state.awaitDrain--;
                        if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
                            state.flowing = true;
                            flow(src);
                        }
                    };
                }

                Readable.prototype.unpipe = function (dest) {
                    var state = this._readableState;

                    // if we're not piping anywhere, then do nothing.
                    if (state.pipesCount === 0)
                        return this;

                    // just one destination.  most common case.
                    if (state.pipesCount === 1) {
                        // passed in one, but it's not the right one.
                        if (dest && dest !== state.pipes)
                            return this;

                        if (!dest)
                            dest = state.pipes;

                        // got a match.
                        state.pipes = null;
                        state.pipesCount = 0;
                        state.flowing = false;
                        if (dest)
                            dest.emit('unpipe', this);
                        return this;
                    }

                    // slow case. multiple pipe destinations.

                    if (!dest) {
                        // remove all.
                        var dests = state.pipes;
                        var len = state.pipesCount;
                        state.pipes = null;
                        state.pipesCount = 0;
                        state.flowing = false;

                        for (var i = 0; i < len; i++)
                            dests[i].emit('unpipe', this);
                        return this;
                    }

                    // try to find the right one.
                    var i = indexOf(state.pipes, dest);
                    if (i === -1)
                        return this;

                    state.pipes.splice(i, 1);
                    state.pipesCount -= 1;
                    if (state.pipesCount === 1)
                        state.pipes = state.pipes[0];

                    dest.emit('unpipe', this);

                    return this;
                };

// set up data events if they are asked for
// Ensure readable listeners eventually get something
                Readable.prototype.on = function (ev, fn) {
                    var res = Stream.prototype.on.call(this, ev, fn);

                    // If listening to data, and it has not explicitly been paused,
                    // then call resume to start the flow of data on the next tick.
                    if (ev === 'data' && false !== this._readableState.flowing) {
                        this.resume();
                    }

                    if (ev === 'readable' && this.readable) {
                        var state = this._readableState;
                        if (!state.readableListening) {
                            state.readableListening = true;
                            state.emittedReadable = false;
                            state.needReadable = true;
                            if (!state.reading) {
                                var self = this;
                                process.nextTick(function () {
                                    debug('readable nexttick read 0');
                                    self.read(0);
                                });
                            } else if (state.length) {
                                emitReadable(this, state);
                            }
                        }
                    }

                    return res;
                };
                Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
                Readable.prototype.resume = function () {
                    var state = this._readableState;
                    if (!state.flowing) {
                        debug('resume');
                        state.flowing = true;
                        if (!state.reading) {
                            debug('resume read 0');
                            this.read(0);
                        }
                        resume(this, state);
                    }
                    return this;
                };

                function resume(stream, state) {
                    if (!state.resumeScheduled) {
                        state.resumeScheduled = true;
                        process.nextTick(function () {
                            resume_(stream, state);
                        });
                    }
                }

                function resume_(stream, state) {
                    state.resumeScheduled = false;
                    stream.emit('resume');
                    flow(stream);
                    if (state.flowing && !state.reading)
                        stream.read(0);
                }

                Readable.prototype.pause = function () {
                    debug('call pause flowing=%j', this._readableState.flowing);
                    if (false !== this._readableState.flowing) {
                        debug('pause');
                        this._readableState.flowing = false;
                        this.emit('pause');
                    }
                    return this;
                };

                function flow(stream) {
                    var state = stream._readableState;
                    debug('flow', state.flowing);
                    if (state.flowing) {
                        do {
                            var chunk = stream.read();
                        } while (null !== chunk && state.flowing);
                    }
                }

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
                Readable.prototype.wrap = function (stream) {
                    var state = this._readableState;
                    var paused = false;

                    var self = this;
                    stream.on('end', function () {
                        debug('wrapped end');
                        if (state.decoder && !state.ended) {
                            var chunk = state.decoder.end();
                            if (chunk && chunk.length)
                                self.push(chunk);
                        }

                        self.push(null);
                    });

                    stream.on('data', function (chunk) {
                        debug('wrapped data');
                        if (state.decoder)
                            chunk = state.decoder.write(chunk);
                        if (!chunk || !state.objectMode && !chunk.length)
                            return;

                        var ret = self.push(chunk);
                        if (!ret) {
                            paused = true;
                            stream.pause();
                        }
                    });

                    // proxy all the other methods.
                    // important when wrapping filters and duplexes.
                    for (var i in stream) {
                        if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
                            this[i] = function (method) {
                                return function () {
                                    return stream[method].apply(stream, arguments);
                                }
                            }(i);
                        }
                    }

                    // proxy certain important events.
                    var events = ['error', 'close', 'destroy', 'pause', 'resume'];
                    forEach(events, function (ev) {
                        stream.on(ev, self.emit.bind(self, ev));
                    });

                    // when we try to consume some more bytes, simply unpause the
                    // underlying stream.
                    self._read = function (n) {
                        debug('wrapped _read', n);
                        if (paused) {
                            paused = false;
                            stream.resume();
                        }
                    };

                    return self;
                };

// exposed for testing purposes only.
                Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
                function fromList(n, state) {
                    var list = state.buffer;
                    var length = state.length;
                    var stringMode = !!state.decoder;
                    var objectMode = !!state.objectMode;
                    var ret;

                    // nothing in the list, definitely empty.
                    if (list.length === 0)
                        return null;

                    if (length === 0)
                        ret = null;
                    else if (objectMode)
                        ret = list.shift();
                    else if (!n || n >= length) {
                        // read it all, truncate the array.
                        if (stringMode)
                            ret = list.join('');
                        else
                            ret = Buffer.concat(list, length);
                        list.length = 0;
                    } else {
                        // read just some of it.
                        if (n < list[0].length) {
                            // just take a part of the first list item.
                            // slice is the same for buffers and strings.
                            var buf = list[0];
                            ret = buf.slice(0, n);
                            list[0] = buf.slice(n);
                        } else if (n === list[0].length) {
                            // first list is a perfect match
                            ret = list.shift();
                        } else {
                            // complex case.
                            // we have enough to cover it, but it spans past the first buffer.
                            if (stringMode)
                                ret = '';
                            else
                                ret = new Buffer(n);

                            var c = 0;
                            for (var i = 0, l = list.length; i < l && c < n; i++) {
                                var buf = list[0];
                                var cpy = Math.min(n - c, buf.length);

                                if (stringMode)
                                    ret += buf.slice(0, cpy);
                                else
                                    buf.copy(ret, c, 0, cpy);

                                if (cpy < buf.length)
                                    list[0] = buf.slice(cpy);
                                else
                                    list.shift();

                                c += cpy;
                            }
                        }
                    }

                    return ret;
                }

                function endReadable(stream) {
                    var state = stream._readableState;

                    // If we get here before consuming all the bytes, then that is a
                    // bug in node.  Should never happen.
                    if (state.length > 0)
                        throw new Error('endReadable called on non-empty stream');

                    if (!state.endEmitted) {
                        state.ended = true;
                        process.nextTick(function () {
                            // Check that we didn't get one last unshift.
                            if (!state.endEmitted && state.length === 0) {
                                state.endEmitted = true;
                                stream.readable = false;
                                stream.emit('end');
                            }
                        });
                    }
                }

                function forEach(xs, f) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        f(xs[i], i);
                    }
                }

                function indexOf(xs, x) {
                    for (var i = 0, l = xs.length; i < l; i++) {
                        if (xs[i] === x) return i;
                    }
                    return -1;
                }

            }).call(this, _dereq_('_process'))
        }, {
            "./_stream_duplex": 44,
            "_process": 42,
            "buffer": 35,
            "core-util-is": 49,
            "events": 39,
            "inherits": 40,
            "isarray": 41,
            "stream": 54,
            "string_decoder/": 55,
            "util": 34
        }],
        47: [function (_dereq_, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

            module.exports = Transform;

            var Duplex = _dereq_('./_stream_duplex');

            /*<replacement>*/
            var util = _dereq_('core-util-is');
            util.inherits = _dereq_('inherits');
            /*</replacement>*/

            util.inherits(Transform, Duplex);

            function TransformState(options, stream) {
                this.afterTransform = function (er, data) {
                    return afterTransform(stream, er, data);
                };

                this.needTransform = false;
                this.transforming = false;
                this.writecb = null;
                this.writechunk = null;
            }

            function afterTransform(stream, er, data) {
                var ts = stream._transformState;
                ts.transforming = false;

                var cb = ts.writecb;

                if (!cb)
                    return stream.emit('error', new Error('no writecb in Transform class'));

                ts.writechunk = null;
                ts.writecb = null;

                if (!util.isNullOrUndefined(data))
                    stream.push(data);

                if (cb)
                    cb(er);

                var rs = stream._readableState;
                rs.reading = false;
                if (rs.needReadable || rs.length < rs.highWaterMark) {
                    stream._read(rs.highWaterMark);
                }
            }

            function Transform(options) {
                if (!(this instanceof Transform))
                    return new Transform(options);

                Duplex.call(this, options);

                this._transformState = new TransformState(options, this);

                // when the writable side finishes, then flush out anything remaining.
                var stream = this;

                // start out asking for a readable event once data is transformed.
                this._readableState.needReadable = true;

                // we have implemented the _read method, and done the other things
                // that Readable wants before the first _read call, so unset the
                // sync guard flag.
                this._readableState.sync = false;

                this.once('prefinish', function () {
                    if (util.isFunction(this._flush))
                        this._flush(function (er) {
                            done(stream, er);
                        });
                    else
                        done(stream);
                });
            }

            Transform.prototype.push = function (chunk, encoding) {
                this._transformState.needTransform = false;
                return Duplex.prototype.push.call(this, chunk, encoding);
            };

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
            Transform.prototype._transform = function (chunk, encoding, cb) {
                throw new Error('not implemented');
            };

            Transform.prototype._write = function (chunk, encoding, cb) {
                var ts = this._transformState;
                ts.writecb = cb;
                ts.writechunk = chunk;
                ts.writeencoding = encoding;
                if (!ts.transforming) {
                    var rs = this._readableState;
                    if (ts.needTransform ||
                        rs.needReadable ||
                        rs.length < rs.highWaterMark)
                        this._read(rs.highWaterMark);
                }
            };

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
            Transform.prototype._read = function (n) {
                var ts = this._transformState;

                if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
                    ts.transforming = true;
                    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
                } else {
                    // mark that we need a transform, so that any data that comes in
                    // will get processed, now that we've asked for it.
                    ts.needTransform = true;
                }
            };

            function done(stream, er) {
                if (er)
                    return stream.emit('error', er);

                // if there's nothing in the write buffer, then that means
                // that nothing more will ever be provided
                var ws = stream._writableState;
                var ts = stream._transformState;

                if (ws.length)
                    throw new Error('calling transform done when ws.length != 0');

                if (ts.transforming)
                    throw new Error('calling transform done when still transforming');

                return stream.push(null);
            }

        }, {"./_stream_duplex": 44, "core-util-is": 49, "inherits": 40}],
        48: [function (_dereq_, module, exports) {
            (function (process) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

                module.exports = Writable;

                /*<replacement>*/
                var Buffer = _dereq_('buffer').Buffer;
                /*</replacement>*/

                Writable.WritableState = WritableState;

                /*<replacement>*/
                var util = _dereq_('core-util-is');
                util.inherits = _dereq_('inherits');
                /*</replacement>*/

                var Stream = _dereq_('stream');

                util.inherits(Writable, Stream);

                function WriteReq(chunk, encoding, cb) {
                    this.chunk = chunk;
                    this.encoding = encoding;
                    this.callback = cb;
                }

                function WritableState(options, stream) {
                    var Duplex = _dereq_('./_stream_duplex');

                    options = options || {};

                    // the point at which write() starts returning false
                    // Note: 0 is a valid value, means that we always return false if
                    // the entire buffer is not flushed immediately on write()
                    var hwm = options.highWaterMark;
                    var defaultHwm = options.objectMode ? 16 : 16 * 1024;
                    this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

                    // object stream flag to indicate whether or not this stream
                    // contains buffers or objects.
                    this.objectMode = !!options.objectMode;

                    if (stream instanceof Duplex)
                        this.objectMode = this.objectMode || !!options.writableObjectMode;

                    // cast to ints.
                    this.highWaterMark = ~~this.highWaterMark;

                    this.needDrain = false;
                    // at the start of calling end()
                    this.ending = false;
                    // when end() has been called, and returned
                    this.ended = false;
                    // when 'finish' is emitted
                    this.finished = false;

                    // should we decode strings into buffers before passing to _write?
                    // this is here so that some node-core streams can optimize string
                    // handling at a lower level.
                    var noDecode = options.decodeStrings === false;
                    this.decodeStrings = !noDecode;

                    // Crypto is kind of old and crusty.  Historically, its default string
                    // encoding is 'binary' so we have to make this configurable.
                    // Everything else in the universe uses 'utf8', though.
                    this.defaultEncoding = options.defaultEncoding || 'utf8';

                    // not an actual buffer we keep track of, but a measurement
                    // of how much we're waiting to get pushed to some underlying
                    // socket or file.
                    this.length = 0;

                    // a flag to see when we're in the middle of a write.
                    this.writing = false;

                    // when true all writes will be buffered until .uncork() call
                    this.corked = 0;

                    // a flag to be able to tell if the onwrite cb is called immediately,
                    // or on a later tick.  We set this to true at first, because any
                    // actions that shouldn't happen until "later" should generally also
                    // not happen before the first write call.
                    this.sync = true;

                    // a flag to know if we're processing previously buffered items, which
                    // may call the _write() callback in the same tick, so that we don't
                    // end up in an overlapped onwrite situation.
                    this.bufferProcessing = false;

                    // the callback that's passed to _write(chunk,cb)
                    this.onwrite = function (er) {
                        onwrite(stream, er);
                    };

                    // the callback that the user supplies to write(chunk,encoding,cb)
                    this.writecb = null;

                    // the amount that is being written when _write is called.
                    this.writelen = 0;

                    this.buffer = [];

                    // number of pending user-supplied write callbacks
                    // this must be 0 before 'finish' can be emitted
                    this.pendingcb = 0;

                    // emit prefinish if the only thing we're waiting for is _write cbs
                    // This is relevant for synchronous Transform streams
                    this.prefinished = false;

                    // True if the error was already emitted and should not be thrown again
                    this.errorEmitted = false;
                }

                function Writable(options) {
                    var Duplex = _dereq_('./_stream_duplex');

                    // Writable ctor is applied to Duplexes, though they're not
                    // instanceof Writable, they're instanceof Readable.
                    if (!(this instanceof Writable) && !(this instanceof Duplex))
                        return new Writable(options);

                    this._writableState = new WritableState(options, this);

                    // legacy.
                    this.writable = true;

                    Stream.call(this);
                }

// Otherwise people can pipe Writable streams, which is just wrong.
                Writable.prototype.pipe = function () {
                    this.emit('error', new Error('Cannot pipe. Not readable.'));
                };

                function writeAfterEnd(stream, state, cb) {
                    var er = new Error('write after end');
                    // TODO: defer error events consistently everywhere, not just the cb
                    stream.emit('error', er);
                    process.nextTick(function () {
                        cb(er);
                    });
                }

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
                function validChunk(stream, state, chunk, cb) {
                    var valid = true;
                    if (!util.isBuffer(chunk) && !util.isString(chunk) && !util.isNullOrUndefined(chunk) && !state.objectMode) {
                        var er = new TypeError('Invalid non-string/buffer chunk');
                        stream.emit('error', er);
                        process.nextTick(function () {
                            cb(er);
                        });
                        valid = false;
                    }
                    return valid;
                }

                Writable.prototype.write = function (chunk, encoding, cb) {
                    var state = this._writableState;
                    var ret = false;

                    if (util.isFunction(encoding)) {
                        cb = encoding;
                        encoding = null;
                    }

                    if (util.isBuffer(chunk))
                        encoding = 'buffer';
                    else if (!encoding)
                        encoding = state.defaultEncoding;

                    if (!util.isFunction(cb))
                        cb = function () {
                        };

                    if (state.ended)
                        writeAfterEnd(this, state, cb);
                    else if (validChunk(this, state, chunk, cb)) {
                        state.pendingcb++;
                        ret = writeOrBuffer(this, state, chunk, encoding, cb);
                    }

                    return ret;
                };

                Writable.prototype.cork = function () {
                    var state = this._writableState;

                    state.corked++;
                };

                Writable.prototype.uncork = function () {
                    var state = this._writableState;

                    if (state.corked) {
                        state.corked--;

                        if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing &&
                            state.buffer.length)
                            clearBuffer(this, state);
                    }
                };

                function decodeChunk(state, chunk, encoding) {
                    if (!state.objectMode &&
                        state.decodeStrings !== false &&
                        util.isString(chunk)) {
                        chunk = new Buffer(chunk, encoding);
                    }
                    return chunk;
                }

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
                function writeOrBuffer(stream, state, chunk, encoding, cb) {
                    chunk = decodeChunk(state, chunk, encoding);
                    if (util.isBuffer(chunk))
                        encoding = 'buffer';
                    var len = state.objectMode ? 1 : chunk.length;

                    state.length += len;

                    var ret = state.length < state.highWaterMark;
                    // we must ensure that previous needDrain will not be reset to false.
                    if (!ret)
                        state.needDrain = true;

                    if (state.writing || state.corked)
                        state.buffer.push(new WriteReq(chunk, encoding, cb));
                    else
                        doWrite(stream, state, false, len, chunk, encoding, cb);

                    return ret;
                }

                function doWrite(stream, state, writev, len, chunk, encoding, cb) {
                    state.writelen = len;
                    state.writecb = cb;
                    state.writing = true;
                    state.sync = true;
                    if (writev)
                        stream._writev(chunk, state.onwrite);
                    else
                        stream._write(chunk, encoding, state.onwrite);
                    state.sync = false;
                }

                function onwriteError(stream, state, sync, er, cb) {
                    if (sync)
                        process.nextTick(function () {
                            state.pendingcb--;
                            cb(er);
                        });
                    else {
                        state.pendingcb--;
                        cb(er);
                    }

                    stream._writableState.errorEmitted = true;
                    stream.emit('error', er);
                }

                function onwriteStateUpdate(state) {
                    state.writing = false;
                    state.writecb = null;
                    state.length -= state.writelen;
                    state.writelen = 0;
                }

                function onwrite(stream, er) {
                    var state = stream._writableState;
                    var sync = state.sync;
                    var cb = state.writecb;

                    onwriteStateUpdate(state);

                    if (er)
                        onwriteError(stream, state, sync, er, cb);
                    else {
                        // Check if we're actually ready to finish, but don't emit yet
                        var finished = needFinish(stream, state);

                        if (!finished && !state.corked && !state.bufferProcessing &&
                            state.buffer.length) {
                            clearBuffer(stream, state);
                        }

                        if (sync) {
                            process.nextTick(function () {
                                afterWrite(stream, state, finished, cb);
                            });
                        } else {
                            afterWrite(stream, state, finished, cb);
                        }
                    }
                }

                function afterWrite(stream, state, finished, cb) {
                    if (!finished)
                        onwriteDrain(stream, state);
                    state.pendingcb--;
                    cb();
                    finishMaybe(stream, state);
                }

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
                function onwriteDrain(stream, state) {
                    if (state.length === 0 && state.needDrain) {
                        state.needDrain = false;
                        stream.emit('drain');
                    }
                }

// if there's something in the buffer waiting, then process it
                function clearBuffer(stream, state) {
                    state.bufferProcessing = true;

                    if (stream._writev && state.buffer.length > 1) {
                        // Fast case, write everything using _writev()
                        var cbs = [];
                        for (var c = 0; c < state.buffer.length; c++)
                            cbs.push(state.buffer[c].callback);

                        // count the one we are adding, as well.
                        // TODO(isaacs) clean this up
                        state.pendingcb++;
                        doWrite(stream, state, true, state.length, state.buffer, '', function (err) {
                            for (var i = 0; i < cbs.length; i++) {
                                state.pendingcb--;
                                cbs[i](err);
                            }
                        });

                        // Clear buffer
                        state.buffer = [];
                    } else {
                        // Slow case, write chunks one-by-one
                        for (var c = 0; c < state.buffer.length; c++) {
                            var entry = state.buffer[c];
                            var chunk = entry.chunk;
                            var encoding = entry.encoding;
                            var cb = entry.callback;
                            var len = state.objectMode ? 1 : chunk.length;

                            doWrite(stream, state, false, len, chunk, encoding, cb);

                            // if we didn't call the onwrite immediately, then
                            // it means that we need to wait until it does.
                            // also, that means that the chunk and cb are currently
                            // being processed, so move the buffer counter past them.
                            if (state.writing) {
                                c++;
                                break;
                            }
                        }

                        if (c < state.buffer.length)
                            state.buffer = state.buffer.slice(c);
                        else
                            state.buffer.length = 0;
                    }

                    state.bufferProcessing = false;
                }

                Writable.prototype._write = function (chunk, encoding, cb) {
                    cb(new Error('not implemented'));

                };

                Writable.prototype._writev = null;

                Writable.prototype.end = function (chunk, encoding, cb) {
                    var state = this._writableState;

                    if (util.isFunction(chunk)) {
                        cb = chunk;
                        chunk = null;
                        encoding = null;
                    } else if (util.isFunction(encoding)) {
                        cb = encoding;
                        encoding = null;
                    }

                    if (!util.isNullOrUndefined(chunk))
                        this.write(chunk, encoding);

                    // .end() fully uncorks
                    if (state.corked) {
                        state.corked = 1;
                        this.uncork();
                    }

                    // ignore unnecessary end() calls.
                    if (!state.ending && !state.finished)
                        endWritable(this, state, cb);
                };

                function needFinish(stream, state) {
                    return (state.ending &&
                    state.length === 0 && !state.finished && !state.writing);
                }

                function prefinish(stream, state) {
                    if (!state.prefinished) {
                        state.prefinished = true;
                        stream.emit('prefinish');
                    }
                }

                function finishMaybe(stream, state) {
                    var need = needFinish(stream, state);
                    if (need) {
                        if (state.pendingcb === 0) {
                            prefinish(stream, state);
                            state.finished = true;
                            stream.emit('finish');
                        } else
                            prefinish(stream, state);
                    }
                    return need;
                }

                function endWritable(stream, state, cb) {
                    state.ending = true;
                    finishMaybe(stream, state);
                    if (cb) {
                        if (state.finished)
                            process.nextTick(cb);
                        else
                            stream.once('finish', cb);
                    }
                    state.ended = true;
                }

            }).call(this, _dereq_('_process'))
        }, {"./_stream_duplex": 44, "_process": 42, "buffer": 35, "core-util-is": 49, "inherits": 40, "stream": 54}],
        49: [function (_dereq_, module, exports) {
            (function (Buffer) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
                function isArray(ar) {
                    return Array.isArray(ar);
                }

                exports.isArray = isArray;

                function isBoolean(arg) {
                    return typeof arg === 'boolean';
                }

                exports.isBoolean = isBoolean;

                function isNull(arg) {
                    return arg === null;
                }

                exports.isNull = isNull;

                function isNullOrUndefined(arg) {
                    return arg == null;
                }

                exports.isNullOrUndefined = isNullOrUndefined;

                function isNumber(arg) {
                    return typeof arg === 'number';
                }

                exports.isNumber = isNumber;

                function isString(arg) {
                    return typeof arg === 'string';
                }

                exports.isString = isString;

                function isSymbol(arg) {
                    return typeof arg === 'symbol';
                }

                exports.isSymbol = isSymbol;

                function isUndefined(arg) {
                    return arg === void 0;
                }

                exports.isUndefined = isUndefined;

                function isRegExp(re) {
                    return isObject(re) && objectToString(re) === '[object RegExp]';
                }

                exports.isRegExp = isRegExp;

                function isObject(arg) {
                    return typeof arg === 'object' && arg !== null;
                }

                exports.isObject = isObject;

                function isDate(d) {
                    return isObject(d) && objectToString(d) === '[object Date]';
                }

                exports.isDate = isDate;

                function isError(e) {
                    return isObject(e) &&
                        (objectToString(e) === '[object Error]' || e instanceof Error);
                }

                exports.isError = isError;

                function isFunction(arg) {
                    return typeof arg === 'function';
                }

                exports.isFunction = isFunction;

                function isPrimitive(arg) {
                    return arg === null ||
                        typeof arg === 'boolean' ||
                        typeof arg === 'number' ||
                        typeof arg === 'string' ||
                        typeof arg === 'symbol' ||  // ES6 symbol
                        typeof arg === 'undefined';
                }

                exports.isPrimitive = isPrimitive;

                function isBuffer(arg) {
                    return Buffer.isBuffer(arg);
                }

                exports.isBuffer = isBuffer;

                function objectToString(o) {
                    return Object.prototype.toString.call(o);
                }
            }).call(this, _dereq_("buffer").Buffer)
        }, {"buffer": 35}],
        50: [function (_dereq_, module, exports) {
            module.exports = _dereq_("./lib/_stream_passthrough.js")

        }, {"./lib/_stream_passthrough.js": 45}],
        51: [function (_dereq_, module, exports) {
            exports = module.exports = _dereq_('./lib/_stream_readable.js');
            exports.Stream = _dereq_('stream');
            exports.Readable = exports;
            exports.Writable = _dereq_('./lib/_stream_writable.js');
            exports.Duplex = _dereq_('./lib/_stream_duplex.js');
            exports.Transform = _dereq_('./lib/_stream_transform.js');
            exports.PassThrough = _dereq_('./lib/_stream_passthrough.js');

        }, {
            "./lib/_stream_duplex.js": 44,
            "./lib/_stream_passthrough.js": 45,
            "./lib/_stream_readable.js": 46,
            "./lib/_stream_transform.js": 47,
            "./lib/_stream_writable.js": 48,
            "stream": 54
        }],
        52: [function (_dereq_, module, exports) {
            module.exports = _dereq_("./lib/_stream_transform.js")

        }, {"./lib/_stream_transform.js": 47}],
        53: [function (_dereq_, module, exports) {
            module.exports = _dereq_("./lib/_stream_writable.js")

        }, {"./lib/_stream_writable.js": 48}],
        54: [function (_dereq_, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

            module.exports = Stream;

            var EE = _dereq_('events').EventEmitter;
            var inherits = _dereq_('inherits');

            inherits(Stream, EE);
            Stream.Readable = _dereq_('readable-stream/readable.js');
            Stream.Writable = _dereq_('readable-stream/writable.js');
            Stream.Duplex = _dereq_('readable-stream/duplex.js');
            Stream.Transform = _dereq_('readable-stream/transform.js');
            Stream.PassThrough = _dereq_('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
            Stream.Stream = Stream;

// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

            function Stream() {
                EE.call(this);
            }

            Stream.prototype.pipe = function (dest, options) {
                var source = this;

                function ondata(chunk) {
                    if (dest.writable) {
                        if (false === dest.write(chunk) && source.pause) {
                            source.pause();
                        }
                    }
                }

                source.on('data', ondata);

                function ondrain() {
                    if (source.readable && source.resume) {
                        source.resume();
                    }
                }

                dest.on('drain', ondrain);

                // If the 'end' option is not supplied, dest.end() will be called when
                // source gets the 'end' or 'close' events.  Only dest.end() once.
                if (!dest._isStdio && (!options || options.end !== false)) {
                    source.on('end', onend);
                    source.on('close', onclose);
                }

                var didOnEnd = false;

                function onend() {
                    if (didOnEnd) return;
                    didOnEnd = true;

                    dest.end();
                }

                function onclose() {
                    if (didOnEnd) return;
                    didOnEnd = true;

                    if (typeof dest.destroy === 'function') dest.destroy();
                }

                // don't leave dangling pipes when there are errors.
                function onerror(er) {
                    cleanup();
                    if (EE.listenerCount(this, 'error') === 0) {
                        throw er; // Unhandled stream error in pipe.
                    }
                }

                source.on('error', onerror);
                dest.on('error', onerror);

                // remove all the event listeners that were added.
                function cleanup() {
                    source.removeListener('data', ondata);
                    dest.removeListener('drain', ondrain);

                    source.removeListener('end', onend);
                    source.removeListener('close', onclose);

                    source.removeListener('error', onerror);
                    dest.removeListener('error', onerror);

                    source.removeListener('end', cleanup);
                    source.removeListener('close', cleanup);

                    dest.removeListener('close', cleanup);
                }

                source.on('end', cleanup);
                source.on('close', cleanup);

                dest.on('close', cleanup);

                dest.emit('pipe', source);

                // Allow for unix-like usage: A.pipe(B).pipe(C)
                return dest;
            };

        }, {
            "events": 39,
            "inherits": 40,
            "readable-stream/duplex.js": 43,
            "readable-stream/passthrough.js": 50,
            "readable-stream/readable.js": 51,
            "readable-stream/transform.js": 52,
            "readable-stream/writable.js": 53
        }],
        55: [function (_dereq_, module, exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

            var Buffer = _dereq_('buffer').Buffer;

            var isBufferEncoding = Buffer.isEncoding
                || function (encoding) {
                    switch (encoding && encoding.toLowerCase()) {
                        case 'hex':
                        case 'utf8':
                        case 'utf-8':
                        case 'ascii':
                        case 'binary':
                        case 'base64':
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                        case 'raw':
                            return true;
                        default:
                            return false;
                    }
                }

            function assertEncoding(encoding) {
                if (encoding && !isBufferEncoding(encoding)) {
                    throw new Error('Unknown encoding: ' + encoding);
                }
            }

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
            var StringDecoder = exports.StringDecoder = function (encoding) {
                this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
                assertEncoding(encoding);
                switch (this.encoding) {
                    case 'utf8':
                        // CESU-8 represents each of Surrogate Pair by 3-bytes
                        this.surrogateSize = 3;
                        break;
                    case 'ucs2':
                    case 'utf16le':
                        // UTF-16 represents each of Surrogate Pair by 2-bytes
                        this.surrogateSize = 2;
                        this.detectIncompleteChar = utf16DetectIncompleteChar;
                        break;
                    case 'base64':
                        // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
                        this.surrogateSize = 3;
                        this.detectIncompleteChar = base64DetectIncompleteChar;
                        break;
                    default:
                        this.write = passThroughWrite;
                        return;
                }

                // Enough space to store all bytes of a single character. UTF-8 needs 4
                // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
                this.charBuffer = new Buffer(6);
                // Number of bytes received for the current incomplete multi-byte character.
                this.charReceived = 0;
                // Number of bytes expected for the current incomplete multi-byte character.
                this.charLength = 0;
            };

// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
            StringDecoder.prototype.write = function (buffer) {
                var charStr = '';
                // if our last write ended with an incomplete multibyte character
                while (this.charLength) {
                    // determine how many remaining bytes this buffer has to offer for this char
                    var available = (buffer.length >= this.charLength - this.charReceived) ?
                        this.charLength - this.charReceived :
                        buffer.length;

                    // add the new bytes to the char buffer
                    buffer.copy(this.charBuffer, this.charReceived, 0, available);
                    this.charReceived += available;

                    if (this.charReceived < this.charLength) {
                        // still not enough chars in this buffer? wait for more ...
                        return '';
                    }

                    // remove bytes belonging to the current character from the buffer
                    buffer = buffer.slice(available, buffer.length);

                    // get the character that was split
                    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

                    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
                    var charCode = charStr.charCodeAt(charStr.length - 1);
                    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
                        this.charLength += this.surrogateSize;
                        charStr = '';
                        continue;
                    }
                    this.charReceived = this.charLength = 0;

                    // if there are no more bytes in this buffer, just emit our char
                    if (buffer.length === 0) {
                        return charStr;
                    }
                    break;
                }

                // determine and set charLength / charReceived
                this.detectIncompleteChar(buffer);

                var end = buffer.length;
                if (this.charLength) {
                    // buffer the incomplete character bytes we got
                    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
                    end -= this.charReceived;
                }

                charStr += buffer.toString(this.encoding, 0, end);

                var end = charStr.length - 1;
                var charCode = charStr.charCodeAt(end);
                // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
                if (charCode >= 0xD800 && charCode <= 0xDBFF) {
                    var size = this.surrogateSize;
                    this.charLength += size;
                    this.charReceived += size;
                    this.charBuffer.copy(this.charBuffer, size, 0, size);
                    buffer.copy(this.charBuffer, 0, 0, size);
                    return charStr.substring(0, end);
                }

                // or just emit the charStr
                return charStr;
            };

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
            StringDecoder.prototype.detectIncompleteChar = function (buffer) {
                // determine how many bytes we have to check at the end of this buffer
                var i = (buffer.length >= 3) ? 3 : buffer.length;

                // Figure out if one of the last i bytes of our buffer announces an
                // incomplete char.
                for (; i > 0; i--) {
                    var c = buffer[buffer.length - i];

                    // See http://en.wikipedia.org/wiki/UTF-8#Description

                    // 110XXXXX
                    if (i == 1 && c >> 5 == 0x06) {
                        this.charLength = 2;
                        break;
                    }

                    // 1110XXXX
                    if (i <= 2 && c >> 4 == 0x0E) {
                        this.charLength = 3;
                        break;
                    }

                    // 11110XXX
                    if (i <= 3 && c >> 3 == 0x1E) {
                        this.charLength = 4;
                        break;
                    }
                }
                this.charReceived = i;
            };

            StringDecoder.prototype.end = function (buffer) {
                var res = '';
                if (buffer && buffer.length)
                    res = this.write(buffer);

                if (this.charReceived) {
                    var cr = this.charReceived;
                    var buf = this.charBuffer;
                    var enc = this.encoding;
                    res += buf.slice(0, cr).toString(enc);
                }

                return res;
            };

            function passThroughWrite(buffer) {
                return buffer.toString(this.encoding);
            }

            function utf16DetectIncompleteChar(buffer) {
                this.charReceived = buffer.length % 2;
                this.charLength = this.charReceived ? 2 : 0;
            }

            function base64DetectIncompleteChar(buffer) {
                this.charReceived = buffer.length % 3;
                this.charLength = this.charReceived ? 3 : 0;
            }

        }, {"buffer": 35}],
        56: [function (_dereq_, module, exports) {
            module.exports = function isBuffer(arg) {
                return arg && typeof arg === 'object'
                    && typeof arg.copy === 'function'
                    && typeof arg.fill === 'function'
                    && typeof arg.readUInt8 === 'function';
            }
        }, {}],
        57: [function (_dereq_, module, exports) {
            (function (process, global) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

                var formatRegExp = /%[sdj%]/g;
                exports.format = function (f) {
                    if (!isString(f)) {
                        var objects = [];
                        for (var i = 0; i < arguments.length; i++) {
                            objects.push(inspect(arguments[i]));
                        }
                        return objects.join(' ');
                    }

                    var i = 1;
                    var args = arguments;
                    var len = args.length;
                    var str = String(f).replace(formatRegExp, function (x) {
                        if (x === '%') return '%';
                        if (i >= len) return x;
                        switch (x) {
                            case '%s':
                                return String(args[i++]);
                            case '%d':
                                return Number(args[i++]);
                            case '%j':
                                try {
                                    return JSON.stringify(args[i++]);
                                } catch (_) {
                                    return '[Circular]';
                                }
                            default:
                                return x;
                        }
                    });
                    for (var x = args[i]; i < len; x = args[++i]) {
                        if (isNull(x) || !isObject(x)) {
                            str += ' ' + x;
                        } else {
                            str += ' ' + inspect(x);
                        }
                    }
                    return str;
                };

// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
                exports.deprecate = function (fn, msg) {
                    // Allow for deprecating things in the process of starting up.
                    if (isUndefined(global.process)) {
                        return function () {
                            return exports.deprecate(fn, msg).apply(this, arguments);
                        };
                    }

                    if (process.noDeprecation === true) {
                        return fn;
                    }

                    var warned = false;

                    function deprecated() {
                        if (!warned) {
                            if (process.throwDeprecation) {
                                throw new Error(msg);
                            } else if (process.traceDeprecation) {
                                console.trace(msg);
                            } else {
                                console.error(msg);
                            }
                            warned = true;
                        }
                        return fn.apply(this, arguments);
                    }

                    return deprecated;
                };

                var debugs = {};
                var debugEnviron;
                exports.debuglog = function (set) {
                    if (isUndefined(debugEnviron))
                        debugEnviron = process.env.NODE_DEBUG || '';
                    set = set.toUpperCase();
                    if (!debugs[set]) {
                        if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
                            var pid = process.pid;
                            debugs[set] = function () {
                                var msg = exports.format.apply(exports, arguments);
                                console.error('%s %d: %s', set, pid, msg);
                            };
                        } else {
                            debugs[set] = function () {
                            };
                        }
                    }
                    return debugs[set];
                };

                /**
                 * Echos the value of a value. Trys to print the value out
                 * in the best way possible given the different types.
                 *
                 * @param {Object} obj The object to print out.
                 * @param {Object} opts Optional options object that alters the output.
                 */
                /* legacy: obj, showHidden, depth, colors*/
                function inspect(obj, opts) {
                    // default options
                    var ctx = {
                        seen: [],
                        stylize: stylizeNoColor
                    };
                    // legacy...
                    if (arguments.length >= 3) ctx.depth = arguments[2];
                    if (arguments.length >= 4) ctx.colors = arguments[3];
                    if (isBoolean(opts)) {
                        // legacy...
                        ctx.showHidden = opts;
                    } else if (opts) {
                        // got an "options" object
                        exports._extend(ctx, opts);
                    }
                    // set default options
                    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
                    if (isUndefined(ctx.depth)) ctx.depth = 2;
                    if (isUndefined(ctx.colors)) ctx.colors = false;
                    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
                    if (ctx.colors) ctx.stylize = stylizeWithColor;
                    return formatValue(ctx, obj, ctx.depth);
                }

                exports.inspect = inspect;

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
                inspect.colors = {
                    'bold': [1, 22],
                    'italic': [3, 23],
                    'underline': [4, 24],
                    'inverse': [7, 27],
                    'white': [37, 39],
                    'grey': [90, 39],
                    'black': [30, 39],
                    'blue': [34, 39],
                    'cyan': [36, 39],
                    'green': [32, 39],
                    'magenta': [35, 39],
                    'red': [31, 39],
                    'yellow': [33, 39]
                };

// Don't use 'blue' not visible on cmd.exe
                inspect.styles = {
                    'special': 'cyan',
                    'number': 'yellow',
                    'boolean': 'yellow',
                    'undefined': 'grey',
                    'null': 'bold',
                    'string': 'green',
                    'date': 'magenta',
                    // "name": intentionally not styling
                    'regexp': 'red'
                };

                function stylizeWithColor(str, styleType) {
                    var style = inspect.styles[styleType];

                    if (style) {
                        return '\u001b[' + inspect.colors[style][0] + 'm' + str +
                            '\u001b[' + inspect.colors[style][1] + 'm';
                    } else {
                        return str;
                    }
                }

                function stylizeNoColor(str, styleType) {
                    return str;
                }

                function arrayToHash(array) {
                    var hash = {};

                    array.forEach(function (val, idx) {
                        hash[val] = true;
                    });

                    return hash;
                }

                function formatValue(ctx, value, recurseTimes) {
                    // Provide a hook for user-specified inspect functions.
                    // Check that value is an object with an inspect function on it
                    if (ctx.customInspect &&
                        value &&
                        isFunction(value.inspect) &&
                        // Filter out the util module, it's inspect function is special
                        value.inspect !== exports.inspect &&
                        // Also filter out any prototype objects using the circular check.
                        !(value.constructor && value.constructor.prototype === value)) {
                        var ret = value.inspect(recurseTimes, ctx);
                        if (!isString(ret)) {
                            ret = formatValue(ctx, ret, recurseTimes);
                        }
                        return ret;
                    }

                    // Primitive types cannot have properties
                    var primitive = formatPrimitive(ctx, value);
                    if (primitive) {
                        return primitive;
                    }

                    // Look up the keys of the object.
                    var keys = Object.keys(value);
                    var visibleKeys = arrayToHash(keys);

                    if (ctx.showHidden) {
                        keys = Object.getOwnPropertyNames(value);
                    }

                    // IE doesn't make error fields non-enumerable
                    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
                    if (isError(value)
                        && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
                        return formatError(value);
                    }

                    // Some type of object without properties can be shortcutted.
                    if (keys.length === 0) {
                        if (isFunction(value)) {
                            var name = value.name ? ': ' + value.name : '';
                            return ctx.stylize('[Function' + name + ']', 'special');
                        }
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                        }
                        if (isDate(value)) {
                            return ctx.stylize(Date.prototype.toString.call(value), 'date');
                        }
                        if (isError(value)) {
                            return formatError(value);
                        }
                    }

                    var base = '', array = false, braces = ['{', '}'];

                    // Make Array say that they are Array
                    if (isArray(value)) {
                        array = true;
                        braces = ['[', ']'];
                    }

                    // Make functions say that they are functions
                    if (isFunction(value)) {
                        var n = value.name ? ': ' + value.name : '';
                        base = ' [Function' + n + ']';
                    }

                    // Make RegExps say that they are RegExps
                    if (isRegExp(value)) {
                        base = ' ' + RegExp.prototype.toString.call(value);
                    }

                    // Make dates with properties first say the date
                    if (isDate(value)) {
                        base = ' ' + Date.prototype.toUTCString.call(value);
                    }

                    // Make error with message first say the error
                    if (isError(value)) {
                        base = ' ' + formatError(value);
                    }

                    if (keys.length === 0 && (!array || value.length == 0)) {
                        return braces[0] + base + braces[1];
                    }

                    if (recurseTimes < 0) {
                        if (isRegExp(value)) {
                            return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                        } else {
                            return ctx.stylize('[Object]', 'special');
                        }
                    }

                    ctx.seen.push(value);

                    var output;
                    if (array) {
                        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
                    } else {
                        output = keys.map(function (key) {
                            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                        });
                    }

                    ctx.seen.pop();

                    return reduceToSingleString(output, base, braces);
                }

                function formatPrimitive(ctx, value) {
                    if (isUndefined(value))
                        return ctx.stylize('undefined', 'undefined');
                    if (isString(value)) {
                        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                .replace(/'/g, "\\'")
                                .replace(/\\"/g, '"') + '\'';
                        return ctx.stylize(simple, 'string');
                    }
                    if (isNumber(value))
                        return ctx.stylize('' + value, 'number');
                    if (isBoolean(value))
                        return ctx.stylize('' + value, 'boolean');
                    // For some reason typeof null is "object", so special case here.
                    if (isNull(value))
                        return ctx.stylize('null', 'null');
                }

                function formatError(value) {
                    return '[' + Error.prototype.toString.call(value) + ']';
                }

                function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                    var output = [];
                    for (var i = 0, l = value.length; i < l; ++i) {
                        if (hasOwnProperty(value, String(i))) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                                String(i), true));
                        } else {
                            output.push('');
                        }
                    }
                    keys.forEach(function (key) {
                        if (!key.match(/^\d+$/)) {
                            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                                key, true));
                        }
                    });
                    return output;
                }

                function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                    var name, str, desc;
                    desc = Object.getOwnPropertyDescriptor(value, key) || {value: value[key]};
                    if (desc.get) {
                        if (desc.set) {
                            str = ctx.stylize('[Getter/Setter]', 'special');
                        } else {
                            str = ctx.stylize('[Getter]', 'special');
                        }
                    } else {
                        if (desc.set) {
                            str = ctx.stylize('[Setter]', 'special');
                        }
                    }
                    if (!hasOwnProperty(visibleKeys, key)) {
                        name = '[' + key + ']';
                    }
                    if (!str) {
                        if (ctx.seen.indexOf(desc.value) < 0) {
                            if (isNull(recurseTimes)) {
                                str = formatValue(ctx, desc.value, null);
                            } else {
                                str = formatValue(ctx, desc.value, recurseTimes - 1);
                            }
                            if (str.indexOf('\n') > -1) {
                                if (array) {
                                    str = str.split('\n').map(function (line) {
                                        return '  ' + line;
                                    }).join('\n').substr(2);
                                } else {
                                    str = '\n' + str.split('\n').map(function (line) {
                                            return '   ' + line;
                                        }).join('\n');
                                }
                            }
                        } else {
                            str = ctx.stylize('[Circular]', 'special');
                        }
                    }
                    if (isUndefined(name)) {
                        if (array && key.match(/^\d+$/)) {
                            return str;
                        }
                        name = JSON.stringify('' + key);
                        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                            name = name.substr(1, name.length - 2);
                            name = ctx.stylize(name, 'name');
                        } else {
                            name = name.replace(/'/g, "\\'")
                                .replace(/\\"/g, '"')
                                .replace(/(^"|"$)/g, "'");
                            name = ctx.stylize(name, 'string');
                        }
                    }

                    return name + ': ' + str;
                }

                function reduceToSingleString(output, base, braces) {
                    var numLinesEst = 0;
                    var length = output.reduce(function (prev, cur) {
                        numLinesEst++;
                        if (cur.indexOf('\n') >= 0) numLinesEst++;
                        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
                    }, 0);

                    if (length > 60) {
                        return braces[0] +
                            (base === '' ? '' : base + '\n ') +
                            ' ' +
                            output.join(',\n  ') +
                            ' ' +
                            braces[1];
                    }

                    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
                }

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
                function isArray(ar) {
                    return Array.isArray(ar);
                }

                exports.isArray = isArray;

                function isBoolean(arg) {
                    return typeof arg === 'boolean';
                }

                exports.isBoolean = isBoolean;

                function isNull(arg) {
                    return arg === null;
                }

                exports.isNull = isNull;

                function isNullOrUndefined(arg) {
                    return arg == null;
                }

                exports.isNullOrUndefined = isNullOrUndefined;

                function isNumber(arg) {
                    return typeof arg === 'number';
                }

                exports.isNumber = isNumber;

                function isString(arg) {
                    return typeof arg === 'string';
                }

                exports.isString = isString;

                function isSymbol(arg) {
                    return typeof arg === 'symbol';
                }

                exports.isSymbol = isSymbol;

                function isUndefined(arg) {
                    return arg === void 0;
                }

                exports.isUndefined = isUndefined;

                function isRegExp(re) {
                    return isObject(re) && objectToString(re) === '[object RegExp]';
                }

                exports.isRegExp = isRegExp;

                function isObject(arg) {
                    return typeof arg === 'object' && arg !== null;
                }

                exports.isObject = isObject;

                function isDate(d) {
                    return isObject(d) && objectToString(d) === '[object Date]';
                }

                exports.isDate = isDate;

                function isError(e) {
                    return isObject(e) &&
                        (objectToString(e) === '[object Error]' || e instanceof Error);
                }

                exports.isError = isError;

                function isFunction(arg) {
                    return typeof arg === 'function';
                }

                exports.isFunction = isFunction;

                function isPrimitive(arg) {
                    return arg === null ||
                        typeof arg === 'boolean' ||
                        typeof arg === 'number' ||
                        typeof arg === 'string' ||
                        typeof arg === 'symbol' ||  // ES6 symbol
                        typeof arg === 'undefined';
                }

                exports.isPrimitive = isPrimitive;

                exports.isBuffer = _dereq_('./support/isBuffer');

                function objectToString(o) {
                    return Object.prototype.toString.call(o);
                }

                function pad(n) {
                    return n < 10 ? '0' + n.toString(10) : n.toString(10);
                }

                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                    'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
                function timestamp() {
                    var d = new Date();
                    var time = [pad(d.getHours()),
                        pad(d.getMinutes()),
                        pad(d.getSeconds())].join(':');
                    return [d.getDate(), months[d.getMonth()], time].join(' ');
                }

// log is just a thin wrapper to console.log that prepends a timestamp
                exports.log = function () {
                    // console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
                };

                /**
                 * Inherit the prototype methods from one constructor into another.
                 *
                 * The Function.prototype.inherits from lang.js rewritten as a standalone
                 * function (not on Function.prototype). NOTE: If this file is to be loaded
                 * during bootstrapping this function needs to be rewritten using some native
                 * functions as prototype setup using normal JavaScript does not work as
                 * expected during bootstrapping (see mirror.js in r114903).
                 *
                 * @param {function} ctor Constructor function which needs to inherit the
                 *     prototype.
                 * @param {function} superCtor Constructor function to inherit prototype from.
                 */
                exports.inherits = _dereq_('inherits');

                exports._extend = function (origin, add) {
                    // Don't do anything if add isn't an object
                    if (!add || !isObject(add)) return origin;

                    var keys = Object.keys(add);
                    var i = keys.length;
                    while (i--) {
                        origin[keys[i]] = add[keys[i]];
                    }
                    return origin;
                };

                function hasOwnProperty(obj, prop) {
                    return Object.prototype.hasOwnProperty.call(obj, prop);
                }

            }).call(this, _dereq_('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        }, {"./support/isBuffer": 56, "_process": 42, "inherits": 40}],
        "htmlparser2": [function (_dereq_, module, exports) {
            var Parser = _dereq_("./Parser.js"),
                DomHandler = _dereq_("domhandler");

            function defineProp(name, value) {
                delete module.exports[name];
                module.exports[name] = value;
                return value;
            }

            module.exports = {
                Parser: Parser,
                Tokenizer: _dereq_("./Tokenizer.js"),
                ElementType: _dereq_("domelementtype"),
                DomHandler: DomHandler,
                get FeedHandler() {
                    return defineProp("FeedHandler", _dereq_("./FeedHandler.js"));
                },
                get Stream() {
                    return defineProp("Stream", _dereq_("./Stream.js"));
                },
                get WritableStream() {
                    return defineProp("WritableStream", _dereq_("./WritableStream.js"));
                },
                get ProxyHandler() {
                    return defineProp("ProxyHandler", _dereq_("./ProxyHandler.js"));
                },
                get DomUtils() {
                    return defineProp("DomUtils", _dereq_("domutils"));
                },
                get CollectingHandler() {
                    return defineProp("CollectingHandler", _dereq_("./CollectingHandler.js"));
                },
                // For legacy support
                DefaultHandler: DomHandler,
                get RssHandler() {
                    return defineProp("RssHandler", this.FeedHandler);
                },
                //helper methods
                parseDOM: function (data, options) {
                    var handler = new DomHandler(options);
                    new Parser(handler, options).end(data);
                    return handler.dom;
                },
                parseFeed: function (feed, options) {
                    var handler = new module.exports.FeedHandler(options);
                    new Parser(handler, options).end(feed);
                    return handler.dom;
                },
                createDomStream: function (cb, options, elementCb) {
                    var handler = new DomHandler(cb, options, elementCb);
                    return new Parser(handler, options);
                },
                // List of all events that the parser emits
                EVENTS: {
                    /* Format: eventname: number of arguments */
                    attribute: 2,
                    cdatastart: 0,
                    cdataend: 0,
                    text: 1,
                    processinginstruction: 2,
                    comment: 1,
                    commentend: 0,
                    closetag: 1,
                    opentag: 2,
                    opentagname: 1,
                    error: 1,
                    end: 0
                }
            };

        }, {
            "./CollectingHandler.js": 1,
            "./FeedHandler.js": 2,
            "./Parser.js": 3,
            "./ProxyHandler.js": 4,
            "./Stream.js": 5,
            "./Tokenizer.js": 6,
            "./WritableStream.js": 7,
            "domelementtype": 8,
            "domhandler": 9,
            "domutils": 12
        }]
    }, {}, [])("htmlparser2")
});
