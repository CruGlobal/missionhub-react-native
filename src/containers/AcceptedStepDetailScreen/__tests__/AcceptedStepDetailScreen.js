import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createMockNavState, renderShallow } from '../../../../testUtils';

import AcceptedStepDetailScreen from '..';

import { completeStep } from '../../../actions/steps';

jest.mock('../../../actions/steps');

const step = {
  title: 'ROBERT',
  challenge_suggestion: { description_markdown: 'roge rules' },
};
const completeStepResult = { type: 'completed step' };
let screen;

const mockStore = configureStore([thunk]);
let store;

completeStep.mockReturnValue(completeStepResult);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore();

  screen = renderShallow(
    <AcceptedStepDetailScreen navigation={createMockNavState({ step })} />,
    store,
  );
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

describe('bottomButtonProps', () => {
  it('completes step', () => {
    screen.props().bottomButtonProps.onPress();

    expect(completeStep).toHaveBeenCalledWith(step, 'Step Detail');
    expect(store.getActions()).toEqual([completeStepResult]);
  });
});
