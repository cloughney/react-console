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

export enum ConsoleTextLineType {
	Standard,
	Error
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
	private isComponentMounted?: boolean;
	private containerElement?: HTMLDivElement | null;
	private inputElement?: HTMLInputElement | null;

	public constructor(props: Props) {
		super(props);
		this.state = {
			outputLines: props.outputLines || [],
			input: props.input || '',
			isWorking: false
		};
	}

	public get cursor(): string {
		return this.props.cursor || '$>';
	}

	public render(): JSX.Element {
		const outputHtml = this.state.outputLines.map((line, index) => {
			const className = line.type == ConsoleTextLineType.Error ? 'error' : '';
			return (<div key={ index } className={ className }>{ line.text }</div>);
		});

		return (
			<div onClick={ this.focusInput } ref={ el => { this.containerElement = el; } }>
				<form onSubmit={ this.onInput }>
					<div className="output">
						{ outputHtml }
					</div>
					<div className="input-line" style={ { visibility: this.state.isWorking ? 'hidden' : 'inherit' } }>
						<label>{ this.cursor }</label>
						<input type="text"
							ref={ el => { this.inputElement = el; } }
							onChange={ e => { this.setState({ input: e.target.value }); } }
							value={ this.state.input } />
					</div>
				</form>
			</div>
		);
	}

	public componentDidMount(): void {
		this.isComponentMounted = true;
	}

	public componentWillUnmount(): void {
		this.isComponentMounted = false;
	}

	private focusInput = (): void => {
		if (!this.containerElement || !this.inputElement) {
			return;
		}
		
		this.containerElement.scrollTop = this.containerElement.scrollHeight;
		this.inputElement.focus();
	};

	private onInput = async (e: React.FormEvent<any>): Promise<void> => {
		e.preventDefault();

		const input = this.state.input;
		this.setState({ isWorking: true, input: '' });

		await this.writeOutput({ data: `${this.cursor} ${input}`, writeLine: true, forceNewLine: true });
		await this.sendCommand(input);

		if (!this.isComponentMounted) { return; }

		this.setState({ isWorking: false });
		this.focusInput();
	};

	private writeOutput = async ({
		data,
		writeLine = false,
		forceNewLine = false,
		outputType = ConsoleTextLineType.Standard
	}: {
		data: string;
		writeLine?: boolean;
		forceNewLine?: boolean;
		outputType?: ConsoleTextLineType;
	}): Promise<void> => {

		this.setState(state => {
			const outputLines = state.outputLines;
			const currentLine = outputLines.length !== 0 ? outputLines[outputLines.length - 1] : undefined;

			if (!currentLine || currentLine.hasEol || forceNewLine) {
				outputLines.push({
					text: data,
					type: outputType,
					hasEol: writeLine
				});
			} else {
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
	};

	private clearOutput = (): Promise<void> => {
		this.setState(state => ({ outputLines: [] }));
		return Promise.resolve();
	}

	private sendCommand = (input: string): Promise<number> => {
		const onCommandReceived = this.props.onCommandReceived;
		if (!onCommandReceived) {
			return Promise.resolve(-1);
		}

		const inputParts = input.split(' ');
		const commandName = inputParts[0];
		const commandArgs = inputParts.slice(1);

		return new Promise<number>(async (resolve, reject) => {
			const timeoutTimer = setTimeout(() => { reject(new Error('Command timed out.')); }, 10000);
			const exitCode = await onCommandReceived({
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
			} as ConsoleCommand);

			clearTimeout(timeoutTimer);
			resolve(exitCode);
		});
	};
}
