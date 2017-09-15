import * as React from 'react';
import { mount } from 'enzyme';

import Console from '../../../src';

describe('<Console />', () => {
	let componentWrapper: any;
	let componentInstance: Console;
	let formElement: any;
	let inputElement: any;
	let cursorElement: any;

	beforeEach(() => {
		componentWrapper = mount(<Console />);
		componentInstance = componentWrapper.instance() as Console;
		formElement = componentWrapper.find('form');
		inputElement = formElement.find('input');
		cursorElement = formElement.find('label');
	});

	it('renders the input a user submits in the output pane', () => {
		const input = 'test string';

		//need to find a better way to input text...
		(inputElement as any).node.value = input;
		formElement.simulate('submit');

		const outputLines = componentWrapper.find('.output').children();
		expect(outputLines.last().text()).toBe(`${componentInstance.cursor} ${input}`);
	});
});
