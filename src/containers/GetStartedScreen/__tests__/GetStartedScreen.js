import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import GetStartedScreen from '..';

import { renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { disableBack } from '../../../utils/common';
import { STAGE_ONBOARDING_SCREEN } from '../../../containers/StageScreen';

jest.mock('react-native-device-info');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/common');

const initialState = {
  profile: {
    firstName: 'Roger',
  },
};
const next = jest.fn();
const nextResult = { type: 'next' };
const navigatePushResult = { type: 'navigate push' };

beforeEach(() => {
  disableBack.remove = jest.fn();
  next.mockReturnValue(nextResult);
  navigatePush.mockReturnValue(navigatePushResult);
});

it('renders correctly', () => {
  renderWithContext(<GetStartedScreen next={next} />, {
    initialState,
  }).snapshot();
});

it('navigates with next', () => {
  const { getByTestId, store } = renderWithContext(
    <GetStartedScreen next={next} />,
    {
      initialState,
    },
  );

  fireEvent.press(getByTestId('BottomButton'));

  expect(disableBack.remove).toHaveBeenCalledWith();
  expect(next).toHaveBeenCalledWith({});
  expect(store.getActions()).toEqual([nextResult]);
});

it('navigates without next', () => {
  const { getByTestId, store } = renderWithContext(<GetStartedScreen />, {
    initialState,
  });

  fireEvent.press(getByTestId('BottomButton'));

  expect(disableBack.remove).toHaveBeenCalledWith();
  expect(navigatePush).toHaveBeenCalledWith(STAGE_ONBOARDING_SCREEN, {
    section: 'onboarding',
    subsection: 'self',
    enableBackButton: false,
  });
  expect(store.getActions()).toEqual([navigatePushResult]);
});
