import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import StageSuccessScreen from '../StageSuccessScreen';
import { renderWithContext } from '../../../testUtils';
import { navigatePush } from '../../actions/navigation';
import { SELECT_MY_STEP_ONBOARDING_SCREEN } from '../SelectMyStepScreen';

jest.mock('../../actions/navigation');

const mockState = {
  profile: {},
  selectedStage: {},
};
const navParams = {
  selectedStage: {
    self_followup_description: '<<user>> test',
  },
};

jest.mock('react-native-device-info');
const next = jest.fn();

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigatePush' });
  next.mockReturnValue({ type: 'next' });
});

it('renders correctly', () => {
  renderWithContext(<StageSuccessScreen />, {
    initialState: mockState,
    navParams,
  }).snapshot();
});

it('renders correctly with default state', () => {
  renderWithContext(<StageSuccessScreen />, {
    initialState: mockState,
  }).snapshot();
});

it('calls navigate push with selected stage', () => {
  const { getByTestId } = renderWithContext(<StageSuccessScreen />, {
    initialState: mockState,
    navParams,
  });
  fireEvent(getByTestId('IconMessageScreen'), 'onComplete');
  expect(navigatePush).toHaveBeenCalledWith(SELECT_MY_STEP_ONBOARDING_SCREEN, {
    contactStage: navParams.selectedStage,
    enableBackButton: false,
    next: expect.any(Function),
  });
});

it('calls next with selected stage', () => {
  const { getByTestId } = renderWithContext(
    <StageSuccessScreen next={next} />,
    {
      initialState: mockState,
      navParams,
    },
  );
  fireEvent(getByTestId('IconMessageScreen'), 'onComplete');
  expect(next).toHaveBeenCalledWith({ selectedStage: navParams.selectedStage });
});
