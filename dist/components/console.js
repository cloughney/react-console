"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ConsoleTextLineType;
(function (ConsoleTextLineType) {
    ConsoleTextLineType[ConsoleTextLineType["Standard"] = 0] = "Standard";
    ConsoleTextLineType[ConsoleTextLineType["Error"] = 1] = "Error";
})(ConsoleTextLineType = exports.ConsoleTextLineType || (exports.ConsoleTextLineType = {}));
var Console = (function (_super) {
    __extends(Console, _super);
    function Console(props) {
        var _this = _super.call(this, props) || this;
        _this.focusInput = function () {
            if (!_this.containerElement || !_this.inputElement) {
                return;
            }
            _this.containerElement.scrollTop = _this.containerElement.scrollHeight;
            _this.inputElement.focus();
        };
        _this.onInput = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        input = this.state.input;
                        this.setState({ isWorking: true, input: '' });
                        return [4, this.writeOutput({ data: this.cursor + " " + input, writeLine: true, forceNewLine: true })];
                    case 1:
                        _a.sent();
                        return [4, this.sendCommand(input)];
                    case 2:
                        _a.sent();
                        if (!this.isComponentMounted) {
                            return [2];
                        }
                        this.setState({ isWorking: false });
                        this.focusInput();
                        return [2];
                }
            });
        }); };
        _this.writeOutput = function (_a) {
            var data = _a.data, _b = _a.writeLine, writeLine = _b === void 0 ? false : _b, _c = _a.forceNewLine, forceNewLine = _c === void 0 ? false : _c, _d = _a.outputType, outputType = _d === void 0 ? ConsoleTextLineType.Standard : _d;
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.setState(function (state) {
                        var outputLines = state.outputLines;
                        var currentLine = outputLines.length !== 0 ? outputLines[outputLines.length - 1] : undefined;
                        if (!currentLine || currentLine.hasEol || forceNewLine) {
                            outputLines.push({
                                text: data,
                                type: outputType,
                                hasEol: writeLine
                            });
                        }
                        else {
                            currentLine.text += data;
                            currentLine.type = outputType;
                            currentLine.hasEol = writeLine;
                        }
                        if (outputLines.length > 100) {
                            outputLines.splice(0, 1);
                        }
                        return { outputLines: outputLines };
                    });
                    this.focusInput();
                    return [2];
                });
            });
        };
        _this.clearOutput = function () {
            _this.setState(function (state) { return ({ outputLines: [] }); });
            return Promise.resolve();
        };
        _this.sendCommand = function (input) {
            var onCommandReceived = _this.props.onCommandReceived;
            if (!onCommandReceived) {
                return Promise.resolve(-1);
            }
            var inputParts = input.split(' ');
            var commandName = inputParts[0];
            var commandArgs = inputParts.slice(1);
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var timeoutTimer, exitCode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            timeoutTimer = setTimeout(function () { reject(new Error('Command timed out.')); }, 10000);
                            return [4, onCommandReceived({
                                    input: input,
                                    name: commandName,
                                    args: commandArgs,
                                    stdout: {
                                        write: function (data) { return _this.writeOutput({ data: data, writeLine: false }); },
                                        writeLine: function (data) { return _this.writeOutput({ data: data, writeLine: true }); },
                                        clear: this.clearOutput
                                    },
                                    stderr: {
                                        write: function (data) { return _this.writeOutput({ data: data, writeLine: false, outputType: ConsoleTextLineType.Error }); },
                                        writeLine: function (data) { return _this.writeOutput({ data: data, writeLine: true, outputType: ConsoleTextLineType.Error }); },
                                        clear: this.clearOutput
                                    }
                                })];
                        case 1:
                            exitCode = _a.sent();
                            clearTimeout(timeoutTimer);
                            resolve(exitCode);
                            return [2];
                    }
                });
            }); });
        };
        _this.state = {
            outputLines: props.outputLines || [],
            input: props.input || '',
            isWorking: false
        };
        return _this;
    }
    Object.defineProperty(Console.prototype, "cursor", {
        get: function () {
            return this.props.cursor || '$>';
        },
        enumerable: true,
        configurable: true
    });
    Console.prototype.render = function () {
        var _this = this;
        var outputHtml = this.state.outputLines.map(function (line, index) {
            var className = line.type == ConsoleTextLineType.Error ? 'error' : '';
            return (React.createElement("div", { key: index, className: className }, line.text));
        });
        return (React.createElement("div", { onClick: this.focusInput, ref: function (el) { _this.containerElement = el; } },
            React.createElement("form", { onSubmit: this.onInput },
                React.createElement("div", { className: "output" }, outputHtml),
                React.createElement("div", { className: "input-line", style: { visibility: this.state.isWorking ? 'hidden' : 'inherit' } },
                    React.createElement("label", null, this.cursor),
                    React.createElement("input", { type: "text", ref: function (el) { _this.inputElement = el; }, onChange: function (e) { _this.setState({ input: e.target.value }); }, value: this.state.input })))));
    };
    Console.prototype.componentDidMount = function () {
        this.isComponentMounted = true;
    };
    Console.prototype.componentWillUnmount = function () {
        this.isComponentMounted = false;
    };
    return Console;
}(React.Component));
exports.default = Console;
