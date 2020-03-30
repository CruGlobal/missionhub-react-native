import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { trackActionWithoutData } from '../../../actions/analytics';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { ACTIONS, ANALYTICS_SECTION_TYPE } from '../../../constants';

import WelcomeScreen from '..';

const next = jest.fn(() => () => {});

jest.mock('react-native-device-info');
jest.mock('../../../actions/analytics');
jest.mock('../../../components/BottomButton', () => 'BottomButton');
jest.mock('../../../components/common', () => ({
  Flex: 'Flex',
  Text: 'Text',
  Button: 'Button',
}));
jest.mock('../../../utils/hooks/useAnalytics');

const initialState = { onboarding: { currentlyOnboarding: true } };

beforeEach(() => {
  (trackActionWithoutData as jest.Mock).mockReturnValue({
    type: 'tracked action without data',
  });
});

describe('WelcomeScreen', () => {
  const allowSignInVariantConfig = {
    initialState,
    navParams: { allowSignIn: true },
  };

  it('should render correctly', () => {
    renderWithContext(<WelcomeScreen next={next} />, {
      initialState,
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(['onboarding', 'welcome'], {
      screenContext: { [ANALYTICS_SECTION_TYPE]: 'onboarding' },
    });
  });

  it('should render correctly with sign in button', () => {
    renderWithContext(
      <WelcomeScreen next={next} />,
      allowSignInVariantConfig,
    ).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(['onboarding', 'welcome'], {
      screenContext: { [ANALYTICS_SECTION_TYPE]: 'onboarding' },
    });
  });

  it('getStarted btn should call next', () => {
    const { getByTestId } = renderWithContext(<WelcomeScreen next={next} />, {
      initialState,
    });
    fireEvent.press(getByTestId('get-started'));

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ signin: false });
  });

  it('tryItNow btn should call next', () => {
    const { getByTestId } = renderWithContext(
      <WelcomeScreen next={next} />,
      allowSignInVariantConfig,
    );
    fireEvent.press(getByTestId('get-started-sign-in-variant'));

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ signin: false });
  });

  it('signIn btn should call next with signIn = true', () => {
    const { getByTestId } = renderWithContext(
      <WelcomeScreen next={next} />,
      allowSignInVariantConfig,
    );
    fireEvent.press(getByTestId('sign-in'));

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ signin: true });
  });

  it('should fire analytics event on mount', () => {
    renderWithContext(<WelcomeScreen next={next} />, { initialState });

    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ONBOARDING_STARTED,
    );
  });
});
