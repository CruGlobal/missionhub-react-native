import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createMockNavState, renderShallow } from '../../../../testUtils';

import SuggestedStepDetailScreen from '..';

import { addStep } from '../../../actions/steps';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/navigation');

const step = {
  body: 'do this step',
  description_markdown: 'some markdown',
};
const receiverId = '423325';
const orgId = '880124';
let screen;

const mockStore = configureStore([thunk]);
let store;

const next = { type: 'next' };

addStep.mockReturnValue(() => Promise.resolve());

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore();

  screen = renderShallow(
    <SuggestedStepDetailScreen
      navigation={createMockNavState({
        step,
        receiverId,
        orgId,
        next: () => next,
      })}
    />,
    store,
  );
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

describe('bottomButtonProps', () => {
  it('adds step', async () => {
    await screen.props().bottomButtonProps.onPress();

    expect(addStep).toHaveBeenCalledWith(step, receiverId, { id: orgId });
    expect(store.getActions()).toEqual([next]);
  });
});
