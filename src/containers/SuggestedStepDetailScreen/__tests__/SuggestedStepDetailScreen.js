import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { createMockNavState, renderShallow } from '../../../../testUtils';

import SuggestedStepDetailScreen from '..';

import { addSteps } from '../../../actions/steps';
import { navigateBack } from '../../../actions/navigation';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/navigation');

const step = {
  body: 'do this step',
  description_markdown: 'some markdown',
};
const receiverId = '423325';
const orgId = '880124';
const navigateBackResult = { type: 'navigated back' };
let screen;

const mockStore = configureStore([thunk]);
let store;

addSteps.mockReturnValue(() => Promise.resolve());
navigateBack.mockReturnValue(navigateBackResult);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore();

  screen = renderShallow(
    <SuggestedStepDetailScreen
      navigation={createMockNavState({ step, receiverId, orgId })}
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

    expect(addSteps).toHaveBeenCalledWith([step], receiverId, { id: orgId });
    expect(store.getActions()).toEqual([navigateBackResult]);
  });
});
