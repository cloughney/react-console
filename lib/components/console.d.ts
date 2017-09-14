/// <reference types="react" />
import * as React from 'react';
export interface ConsoleStream {
    write: (data: string) => Promise<void>;
    writeLine: (data: string) => Promise<void>;
    clear: () => Promise<void>;
}
export interface ConsoleCommand {
    input: string;
    name: string;
    args: string[];
    stdout: ConsoleStream;
    stderr: ConsoleStream;
}
export declare enum ConsoleTextLineType {
    Standard = 0,
    Error = 1,
}
export interface ConsoleTextLine {
    text: string;
    type: ConsoleTextLineType;
    hasEol: boolean;
}
export interface Props extends React.Props<any> {
    outputLines?: ConsoleTextLine[];
    input?: string;
    cursor?: string;
    onCommandReceived?: (command: ConsoleCommand) => Promise<number>;
}
export interface State {
    outputLines: ConsoleTextLine[];
    input: string;
    isWorking: boolean;
}
export default class Console extends React.Component<Props, State> {
    private isComponentMounted?;
    private containerElement?;
    private inputElement?;
    constructor(props: Props);
    readonly cursor: string;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private focusInput;
    private onInput;
    private writeOutput;
    private clearOutput;
    private sendCommand;
}
