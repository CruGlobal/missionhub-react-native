import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createMockNavState, renderShallow } from '../../../../testUtils';
import { completeStep, deleteStepWithTracking } from '../../../actions/steps';
import { navigateBack } from '../../../actions/navigation';

import AcceptedStepDetailScreen from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/navigation');

const completeStepResult = { type: 'completed step' };
const deleteStepResult = { type: 'deleted step' };
const navigateBackResult = { type: 'navigate back' };

let step;
let challenge_suggestion;
let screen;

const mockStore = configureStore([thunk]);
let store;

completeStep.mockReturnValue(completeStepResult);
deleteStepWithTracking.mockReturnValue(deleteStepResult);
navigateBack.mockReturnValue(navigateBackResult);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore();

  step = {
    title: 'ROBERT',
    challenge_suggestion,
  };
  screen = renderShallow(
    <AcceptedStepDetailScreen navigation={createMockNavState({ step })} />,
    store,
  );
});

describe('with challenge suggestion', () => {
  beforeAll(() => {
    challenge_suggestion = { description_markdown: 'roge rules' };
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  describe('bottomButtonProps', () => {
    it('completes step', () => {
      screen.props().bottomButtonProps.onPress();

      expect(completeStep).toHaveBeenCalledWith(step, 'Step Detail', true);
      expect(store.getActions()).toEqual([completeStepResult]);
    });
  });

  describe('remove step button', () => {
    it('deletes step', () => {
      screen.props().RightHeader.props.onPress();

      expect(deleteStepWithTracking).toHaveBeenCalledWith(step, 'Step Detail');
      expect(navigateBack).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        deleteStepResult,
        navigateBackResult,
      ]);
    });
  });
});

describe('without challenge suggestion', () => {
  beforeAll(() => {
    challenge_suggestion = undefined;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});
