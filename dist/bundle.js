/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(2);
	var App_1 = __webpack_require__(3);
	ReactDOM.render(React.createElement(App_1.AppComponent, null), document.getElementById("app"));


/***/ },

/***/ 1:
/***/ function(module, exports) {

	module.exports = React;

/***/ },

/***/ 2:
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },

/***/ 3:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var State_1 = __webpack_require__(49);
	var Editor_1 = __webpack_require__(51);
	var lib_1 = __webpack_require__(50);
	var AppComponent = (function (_super) {
	    __extends(AppComponent, _super);
	    function AppComponent() {
	        _super.call(this);
	        this.mainEditor = null;
	        this.wastEditor = null;
	        this.wasmEditor = null;
	        this.outputEditor = null;
	        this.harnessEditor = null;
	        this.buffer = null;
	        this.downloadLink = null;
	        this.installKeyboardShortcuts();
	        State_1.State.app = this;
	        this.state = {
	            compilerOptions: "-O3 -std=C++11"
	        };
	    }
	    AppComponent.prototype.installKeyboardShortcuts = function () {
	        var _this = this;
	        Mousetrap.bind(['ctrl+shift+enter'], function (e) {
	            _this.run();
	            e.preventDefault();
	        });
	        Mousetrap.bind(['ctrl+enter'], function (e) {
	            _this.runHarness();
	            e.preventDefault();
	        });
	        Mousetrap.bind(['command+s'], function (e) {
	            _this.saveFiddleStateToURI();
	            e.preventDefault();
	        });
	    };
	    AppComponent.prototype.componentDidMount = function () {
	        this.init();
	    };
	    AppComponent.prototype.compilerOptionsChanged = function (options) {
	        this.setState({ compilerOptions: options });
	    };
	    AppComponent.prototype.onResize = function () {
	        // State.resize();
	        this.mainEditor.editor.resize();
	    };
	    AppComponent.prototype.download = function () {
	        // TODO: mbx
	        // this.downloadLink.href = "data:;base64,"; // + wasm.split('\n')[1];
	        // if (this.downloadLink.href as any != document.location) {
	        //   this.downloadLink.click();
	        // }
	    };
	    AppComponent.prototype.loadFiddledStateFromURI = function (fiddleURI) {
	        State_1.State.fiddleURI = fiddleURI;
	        var xhr = new XMLHttpRequest();
	        var self = this;
	        xhr.addEventListener("load", function () {
	            self.loadFiddledState(JSON.parse(this.response));
	            history.replaceState({}, fiddleURI, '?' + State_1.State.fiddleURI);
	        });
	        var url = "https://api.myjson.com/bins/" + fiddleURI;
	        xhr.open("GET", url, true);
	        xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
	        xhr.send();
	    };
	    AppComponent.prototype.saveFiddleStateToURI = function () {
	        var xhr = new XMLHttpRequest();
	        xhr.addEventListener("load", function () {
	            var uri = JSON.parse(this.response).uri;
	            uri = uri.substring(uri.lastIndexOf("/") + 1);
	            State_1.State.fiddleURI = uri;
	            State_1.State.app.forceUpdate();
	            history.replaceState({}, State_1.State.fiddleURI, '?' + State_1.State.fiddleURI);
	        });
	        xhr.open("POST", "//api.myjson.com/bins", true);
	        xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
	        xhr.send(JSON.stringify(this.saveFiddleState()));
	    };
	    AppComponent.prototype.init = function () {
	        var uri = window.location.search.substring(1);
	        if (uri) {
	            var i = uri.indexOf("/");
	            if (i > 0) {
	                uri = uri.substring(0, i);
	            }
	            this.loadFiddledStateFromURI(uri);
	            this.forceUpdate();
	        }
	        else {
	            this.loadFiddledState({
	                editors: {
	                    "main": "int main() { \n  return 42;\n}",
	                    "harness": "var wasmModule = new WebAssembly.Module(wasmCode);\n" +
	                        "var wasmInstance = new WebAssembly.Instance(wasmModule);\n\n" +
	                        "log(wasmInstance.exports.main());"
	                }
	            });
	        }
	    };
	    AppComponent.prototype.saveFiddleState = function () {
	        return {
	            editors: {
	                main: this.mainEditor.editor.getValue(),
	                harness: this.harnessEditor.editor.getValue()
	            }
	        };
	    };
	    AppComponent.prototype.loadFiddledState = function (fiddleState) {
	        // For backwards compatibility.
	        if (fiddleState.editors["main.c"]) {
	            fiddleState.editors.main = fiddleState.editors["main.c"];
	        }
	        if (fiddleState.editors["harness.js"]) {
	            fiddleState.editors.harness = fiddleState.editors["harness.js"];
	        }
	        this.mainEditor.editor.setValue(fiddleState.editors.main, -1);
	        this.harnessEditor.editor.setValue(fiddleState.editors.harness, -1);
	    };
	    AppComponent.prototype.run = function () {
	        var _this = this;
	        var main = this.mainEditor;
	        var options = this.state.compilerOptions;
	        this.compileToWasm(main.editor.getValue(), options, function (result, annotations) {
	            main.editor.getSession().clearAnnotations();
	            if (annotations.length) {
	                main.editor.getSession().setAnnotations(annotations);
	                _this.appendOutput(String(result));
	                return;
	            }
	            _this.buffer = result;
	            _this.runHarness();
	        });
	    };
	    AppComponent.prototype.runHarness = function () {
	        if (!this.buffer) {
	            this.appendOutput("Compile a WebAssembly module first.");
	            return;
	        }
	        // |buffer| is needed for backward compatibility
	        var self = this;
	        var func = new Function("wasmCode", "buffer", "lib", "log", "canvas", this.harnessEditor.editor.getValue());
	        try {
	            func(this.buffer, this.buffer, lib_1.lib, function (x) {
	                self.appendOutput(String(x));
	            }, State_1.State.app.canvas);
	        }
	        catch (x) {
	            self.appendOutput(x);
	        }
	    };
	    AppComponent.prototype.compileToWasm = function (src, options, cb) {
	        var self = this;
	        src = encodeURIComponent(src).replace('%20', '+');
	        var action = "c2wast";
	        options = encodeURIComponent(options);
	        State_1.State.sendRequest("input=" + src + "&action=" + action + "&options=" + options, function () {
	            if (!this.responseText) {
	                this.appendOutput("Something went wrong while compiling " + action + ".");
	                return;
	            }
	            var annotations = State_1.State.getAnnotations(this.responseText);
	            if (annotations.length) {
	                cb(this.responseText, annotations);
	                return;
	            }
	            self.wastEditor.editor.setValue(this.responseText, -1);
	            src = encodeURIComponent(this.responseText).replace('%20', '+');
	            State_1.State.sendRequest("input=" + src + "&action=" + "wast2wasm" + "&options=" + options, function () {
	                var buffer = atob(this.responseText.split('\n', 2)[1]);
	                var data = new Uint8Array(buffer.length);
	                for (var i = 0; i < buffer.length; i++) {
	                    data[i] = buffer.charCodeAt(i);
	                }
	                self.wasmEditor.editor.setValue("var wasmCode = new Uint8Array([" + String(data) + "]);", -1);
	                cb(data, []);
	            });
	        });
	    };
	    AppComponent.prototype.appendOutput = function (s) {
	        this.outputEditor.editor.insert(s + "\n");
	        this.outputEditor.editor.gotoLine(Infinity);
	    };
	    AppComponent.prototype.share = function () {
	        this.saveFiddleStateToURI();
	    };
	    AppComponent.prototype.clear = function () {
	        this.outputEditor.editor.setValue("");
	    };
	    AppComponent.prototype.render = function () {
	        var _this = this;
	        return React.createElement("div", {className: "gAppContainer"}, 
	            React.createElement("div", {className: "gHeader"}, 
	                React.createElement("div", null, 
	                    React.createElement("img", {src: "img/web-assembly-icon-white-64px.png", className: "waIcon"})
	                ), 
	                React.createElement("div", {className: "gShareURI"}, window.location.origin + window.location.pathname + '?' + State_1.State.fiddleURI), 
	                React.createElement("div", {className: "gShareButton"}, 
	                    React.createElement("i", {title: "Share", onClick: this.share.bind(this), className: "fa fa-cloud-upload fa-2x", "aria-hidden": "true"})
	                )), 
	            React.createElement("div", null, 
	                React.createElement("div", {className: "gV2"}, 
	                    React.createElement("div", null, 
	                        React.createElement("div", {className: "editorHeader"}, 
	                            React.createElement("span", {className: "editorHeaderTitle"}, "C/C++"), 
	                            React.createElement("div", {className: "editorHeaderButtons"}, 
	                                React.createElement("a", {title: "Compile & Run: CTRL + Shift + Return", onClick: this.run.bind(this)}, 
	                                    "Compile & Run ", 
	                                    React.createElement("i", {className: "fa fa-cog fa-lg", "aria-hidden": "true"}))
	                            )), 
	                        React.createElement(Editor_1.EditorComponent, {ref: function (self) { return _this.mainEditor = self; }, name: "main", mode: "ace/mode/c_cpp", showGutter: true, showLineNumbers: true})), 
	                    React.createElement("div", null, 
	                        React.createElement("div", {className: "editorHeader"}, 
	                            React.createElement("span", {className: "editorHeaderTitle"}, "JS"), 
	                            React.createElement("div", {className: "editorHeaderButtons"}, 
	                                React.createElement("a", {title: "Run: CTRL + Return", onClick: this.runHarness.bind(this)}, 
	                                    "Run ", 
	                                    React.createElement("i", {className: "fa fa-play-circle fa-lg", "aria-hidden": "true"}))
	                            )), 
	                        React.createElement(Editor_1.EditorComponent, {ref: function (self) { return _this.harnessEditor = self; }, name: "harness", mode: "ace/mode/javascript", showGutter: true, showLineNumbers: true})))
	            ), 
	            React.createElement("div", null, 
	                React.createElement("div", {className: "gV3"}, 
	                    React.createElement("div", null, 
	                        React.createElement("div", {className: "editorHeader"}, 
	                            React.createElement("span", {className: "editorHeaderTitle"}, "out.wast"), 
	                            React.createElement("div", {className: "editorHeaderButtons"})), 
	                        React.createElement(Editor_1.EditorComponent, {ref: function (self) { return _this.wastEditor = self; }, name: "wast", save: false, readOnly: true, fontSize: 8})), 
	                    React.createElement("div", null, 
	                        React.createElement("div", {className: "editorHeader"}, 
	                            React.createElement("span", {className: "editorHeaderTitle"}, "out.wasm"), 
	                            React.createElement("div", {className: "editorHeaderButtons"}, 
	                                React.createElement("a", {title: "Download", onClick: this.download.bind(this)}, 
	                                    "Download ", 
	                                    React.createElement("i", {className: "fa fa-download fa-lg", "aria-hidden": "true"}))
	                            )), 
	                        React.createElement(Editor_1.EditorComponent, {ref: function (self) { return _this.wasmEditor = self; }, name: "wasm", save: false, readOnly: true, fontSize: 8})), 
	                    React.createElement("div", null, 
	                        React.createElement("div", {className: "editorHeader"}, 
	                            React.createElement("span", {className: "editorHeaderTitle"}, "out"), 
	                            React.createElement("div", {className: "editorHeaderButtons"}, 
	                                React.createElement("a", {title: "Clear Output", onClick: this.clear.bind(this)}, 
	                                    "Clear ", 
	                                    React.createElement("i", {className: "fa fa-close fa-lg", "aria-hidden": "true"}))
	                            )), 
	                        React.createElement(Editor_1.EditorComponent, {ref: function (self) { return _this.outputEditor = self; }, name: "output", save: false, readOnly: true})))
	            ));
	    };
	    return AppComponent;
	}(React.Component));
	exports.AppComponent = AppComponent;


/***/ },

/***/ 49:
/***/ function(module, exports) {

	"use strict";
	var State = (function () {
	    function State() {
	    }
	    State.sendRequest = function (command, cb) {
	        var self = this;
	        var xhr = new XMLHttpRequest();
	        xhr.addEventListener("load", function () {
	            cb.call(this);
	        });
	        xhr.open("POST", "//wasmexplorer-service.herokuapp.com/service.php", true);
	        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	        xhr.send(command);
	    };
	    State.getAnnotations = function (response) {
	        // Parse and annotate errors if compilation fails.
	        var annotations = [];
	        if (response.indexOf("(module") !== 0) {
	            var re = /^.*?:(\d+?):(\d+?):(.*)$/gm;
	            var m;
	            while ((m = re.exec(response)) !== null) {
	                if (m.index === re.lastIndex) {
	                    re.lastIndex++;
	                }
	                var line = parseInt(m[1]) - 1;
	                var column = parseInt(m[2]) - 1;
	                var message = m[3];
	                annotations.push({
	                    row: line,
	                    column: column,
	                    text: message,
	                    type: message.indexOf("error") >= 0 ? "error" : "warning" // also warning and information
	                });
	            }
	        }
	        return annotations;
	    };
	    State.fiddleURI = "";
	    return State;
	}());
	exports.State = State;


/***/ },

/***/ 50:
/***/ function(module, exports) {

	"use strict";
	function UTF8ArrayToString(u8Array, idx) {
	    var endPtr = idx;
	    while (u8Array[endPtr])
	        ++endPtr;
	    if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
	        return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
	    }
	    else {
	        var u0 = 0, u1 = 0, u2 = 0, u3 = 0, u4 = 0, u5 = 0;
	        var str = "";
	        while (1) {
	            u0 = u8Array[idx++];
	            if (!u0)
	                return str;
	            if (!(u0 & 128)) {
	                str += String.fromCharCode(u0);
	                continue;
	            }
	            u1 = u8Array[idx++] & 63;
	            if ((u0 & 224) == 192) {
	                str += String.fromCharCode((u0 & 31) << 6 | u1);
	                continue;
	            }
	            u2 = u8Array[idx++] & 63;
	            if ((u0 & 240) == 224) {
	                u0 = (u0 & 15) << 12 | u1 << 6 | u2;
	            }
	            else {
	                u3 = u8Array[idx++] & 63;
	                if ((u0 & 248) == 240) {
	                    u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3;
	                }
	                else {
	                    u4 = u8Array[idx++] & 63;
	                    if ((u0 & 252) == 248) {
	                        u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4;
	                    }
	                    else {
	                        u5 = u8Array[idx++] & 63;
	                        u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5;
	                    }
	                }
	            }
	            if (u0 < 65536) {
	                str += String.fromCharCode(u0);
	            }
	            else {
	                var ch = u0 - 65536;
	                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
	            }
	        }
	    }
	}
	exports.lib = {
	    UTF8ArrayToString: UTF8ArrayToString
	};


/***/ },

/***/ 51:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var State_1 = __webpack_require__(49);
	var EditorComponent = (function (_super) {
	    __extends(EditorComponent, _super);
	    function EditorComponent() {
	        _super.apply(this, arguments);
	    }
	    EditorComponent.prototype.componentDidMount = function () {
	        var editor = this.editor = ace.edit(this.container);
	        var theme = true ? "ace/theme/monokai" : "ace/theme/github";
	        // editor.setValue(this.props.source, -1);
	        editor.setReadOnly(this.props.readOnly);
	        editor.setTheme(theme);
	        editor.setFontSize(this.props.fontSize);
	        editor.getSession().setUseSoftTabs(true);
	        editor.getSession().setTabSize(2);
	        editor.setShowPrintMargin(false);
	        editor.setOptions({
	            wrap: true,
	            enableBasicAutocompletion: true,
	            // enableSnippets: true,
	            // enableLiveAutocompletion: true,
	            showLineNumbers: this.props.showLineNumbers,
	            showGutter: this.props.showGutter
	        });
	        editor.$blockScrolling = Infinity;
	        editor.renderer.setScrollMargin(10, 10);
	        editor.getSession().setMode(this.props.mode);
	        var action = this.props.action;
	        var self = this;
	        editor.commands.addCommands([{
	                bindKey: { win: "Ctrl-S", mac: "Command-S" }, exec: function () {
	                    State_1.State.app.share();
	                }
	            },
	            {
	                bindKey: { win: "Ctrl-Shift-Return", mac: "Ctrl-Shift-Return" }, exec: function () {
	                    State_1.State.app.run();
	                }
	            },
	            {
	                bindKey: { win: "Ctrl-Return", mac: "Ctrl-Return" }, exec: function () {
	                    State_1.State.app.runHarness();
	                }
	            }
	        ]);
	    };
	    EditorComponent.prototype.onChange = function () {
	    };
	    EditorComponent.prototype.render = function () {
	        var _this = this;
	        return React.createElement("div", {ref: function (self) { return _this.container = self; }, className: "editorBody"});
	    };
	    EditorComponent.defaultProps = {
	        // source: "",
	        mode: "",
	        action: "",
	        save: true,
	        readOnly: false,
	        showGutter: false,
	        showLineNumbers: false,
	        fontSize: 11
	    };
	    return EditorComponent;
	}(React.Component));
	exports.EditorComponent = EditorComponent;


/***/ }

/******/ });
//# sourceMappingURL=bundle.js.map