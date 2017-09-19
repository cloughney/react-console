var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
export var ConsoleTextLineType;
(function (ConsoleTextLineType) {
    ConsoleTextLineType[ConsoleTextLineType["Standard"] = 0] = "Standard";
    ConsoleTextLineType[ConsoleTextLineType["Error"] = 1] = "Error";
})(ConsoleTextLineType || (ConsoleTextLineType = {}));
export default class Console extends React.Component {
    constructor(props) {
        super(props);
        this.focusInput = () => {
            if (!this.containerElement || !this.inputElement) {
                return;
            }
            this.containerElement.scrollTop = this.containerElement.scrollHeight;
            this.inputElement.focus();
        };
        this.onInput = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const input = this.state.input;
            this.setState({ isWorking: true, input: '' });
            yield this.writeOutput({ data: `${this.cursor} ${input}`, writeLine: true, forceNewLine: true });
            yield this.sendCommand(input);
            if (!this.isComponentMounted) {
                return;
            }
            this.setState({ isWorking: false });
            this.focusInput();
        });
        this.writeOutput = ({ data, writeLine = false, forceNewLine = false, outputType = ConsoleTextLineType.Standard }) => __awaiter(this, void 0, void 0, function* () {
            this.setState(state => {
                const outputLines = state.outputLines;
                const currentLine = outputLines.length !== 0 ? outputLines[outputLines.length - 1] : undefined;
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
                return { outputLines };
            });
            this.focusInput();
        });
        this.clearOutput = () => {
            this.setState(state => ({ outputLines: [] }));
            return Promise.resolve();
        };
        this.sendCommand = (input) => {
            const onCommandReceived = this.props.onCommandReceived;
            if (!onCommandReceived) {
                return Promise.resolve(-1);
            }
            const inputParts = input.split(' ');
            const commandName = inputParts[0];
            const commandArgs = inputParts.slice(1);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const timeoutTimer = setTimeout(() => { reject(new Error('Command timed out.')); }, 10000);
                const exitCode = yield onCommandReceived({
                    input,
                    name: commandName,
                    args: commandArgs,
                    stdout: {
                        write: data => this.writeOutput({ data, writeLine: false }),
                        writeLine: data => this.writeOutput({ data, writeLine: true }),
                        clear: this.clearOutput
                    },
                    stderr: {
                        write: data => this.writeOutput({ data, writeLine: false, outputType: ConsoleTextLineType.Error }),
                        writeLine: data => this.writeOutput({ data, writeLine: true, outputType: ConsoleTextLineType.Error }),
                        clear: this.clearOutput
                    }
                });
                clearTimeout(timeoutTimer);
                resolve(exitCode);
            }));
        };
        this.state = {
            outputLines: props.outputLines || [],
            input: props.input || '',
            isWorking: false
        };
    }
    get cursor() {
        return this.props.cursor || '$>';
    }
    render() {
        const outputHtml = this.state.outputLines.map((line, index) => {
            const className = line.type == ConsoleTextLineType.Error ? 'error' : '';
            return (React.createElement("div", { key: index, className: className }, line.text));
        });
        return (React.createElement("div", { onClick: this.focusInput, ref: el => { this.containerElement = el; } },
            React.createElement("form", { onSubmit: this.onInput },
                React.createElement("div", { className: "output" }, outputHtml),
                React.createElement("div", { className: "input-line", style: { visibility: this.state.isWorking ? 'hidden' : 'inherit' } },
                    React.createElement("label", null, this.cursor),
                    React.createElement("input", { type: "text", ref: el => { this.inputElement = el; }, onChange: e => { this.setState({ input: e.target.value }); }, value: this.state.input })))));
    }
    componentDidMount() {
        this.isComponentMounted = true;
    }
    componentWillUnmount() {
        this.isComponentMounted = false;
    }
}
