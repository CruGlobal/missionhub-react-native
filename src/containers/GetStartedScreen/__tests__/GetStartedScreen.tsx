import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ANALYTICS_SECTION_TYPE } from '../../../constants';
import { useLogoutOnBack } from '../../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import GetStartedScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../utils/hooks/useLogoutOnBack');
jest.mock('../../../utils/hooks/useAnalytics');

const initialState = {
  auth: { person: { first_name: 'Roger' } },
  onboarding: { currentlyOnboarding: true },
};
const next = jest.fn();
const back = jest.fn();
const nextResult = { type: 'next' };

beforeEach(() => {
  next.mockReturnValue(nextResult);
  (useLogoutOnBack as jest.Mock).mockReturnValue(back);
});

it('renders correctly', () => {
  renderWithContext(<GetStartedScreen next={next} />, {
    initialState,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    ['onboarding', 'personal greeting'],
    { screenContext: { [ANALYTICS_SECTION_TYPE]: 'onboarding' } },
  );
});

it('renders without back button correctly', () => {
  (useLogoutOnBack as jest.Mock).mockReturnValue(null);

  renderWithContext(<GetStartedScreen next={next} enableBackButton={false} />, {
    initialState,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    ['onboarding', 'personal greeting'],
    { screenContext: { [ANALYTICS_SECTION_TYPE]: 'onboarding' } },
  );
});

it('navigates to next screen', () => {
  const { getByTestId, store } = renderWithContext(
    <GetStartedScreen next={next} />,
    {
      initialState,
    },
  );

  fireEvent.press(getByTestId('bottomButton'));

  expect(next).toHaveBeenCalledWith();
  expect(store.getActions()).toEqual([nextResult]);
});

describe('onBack prop', () => {
  describe('enableBackButton', () => {
    it('calls callback from useLogoutOnBack', () => {
      const { getByTestId } = renderWithContext(
        <GetStartedScreen next={next} />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('DeprecatedBackButton'));

      expect(useLogoutOnBack).toHaveBeenCalledWith(true, false);
      expect(back).toHaveBeenCalledWith();
    });
  });

  describe('logoutOnBack', () => {
    it('calls callback from useLogoutOnBack', () => {
      const { getByTestId } = renderWithContext(
        <GetStartedScreen next={next} logoutOnBack={true} />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('DeprecatedBackButton'));

      expect(useLogoutOnBack).toHaveBeenCalledWith(true, true);
      expect(back).toHaveBeenCalledWith();
    });
  });
});
