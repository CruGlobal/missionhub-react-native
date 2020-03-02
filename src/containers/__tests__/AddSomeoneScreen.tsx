import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { ANALYTICS_SECTION_TYPE } from '../../constants';
import AddSomeoneScreen from '../AddSomeoneScreen';
import { renderWithContext } from '../../../testUtils';
import { useLogoutOnBack } from '../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

jest.mock('../../utils/hooks/useLogoutOnBack');
jest.mock('../../utils/hooks/useAnalytics');

const next = jest.fn();
const back = jest.fn();
const nextResult = { type: 'next' };

const initialState = { onboarding: { currentlyOnboarding: true } };

beforeEach(() => {
  (next as jest.Mock).mockReturnValue(nextResult);
  (useLogoutOnBack as jest.Mock).mockReturnValue(back);
});

it('renders correctly', () => {
  renderWithContext(<AddSomeoneScreen next={next} />, {
    initialState,
  }).snapshot();
});

it('renders without skip button correctly', () => {
  renderWithContext(<AddSomeoneScreen next={next} hideSkipBtn={true} />, {
    initialState,
  }).snapshot();
});

it('renders without back button correctly', () => {
  (useLogoutOnBack as jest.Mock).mockReturnValue(null);

  renderWithContext(<AddSomeoneScreen next={next} enableBackButton={false} />, {
    initialState,
  }).snapshot();
});

it('tracks screen change on mount', () => {
  renderWithContext(<AddSomeoneScreen next={next} />, {
    initialState,
  });

  expect(useAnalytics).toHaveBeenCalledWith(['onboarding', 'add someone'], {
    screenContext: { [ANALYTICS_SECTION_TYPE]: 'onboarding' },
  });
});

describe('onComplete', () => {
  it('calls next', () => {
    const { getByTestId, store } = renderWithContext(
      <AddSomeoneScreen next={next} />,
      {
        initialState,
      },
    );

    fireEvent.press(getByTestId('bottomButton'));

    expect(store.getActions()).toEqual([nextResult]);
    expect(next).toHaveBeenCalledWith({ skip: false });
  });
});

describe('onSkip prop', () => {
  it('calls next', () => {
    const { getByTestId, store } = renderWithContext(
      <AddSomeoneScreen next={next} />,
      {
        initialState,
      },
    );

    fireEvent.press(getByTestId('skipButton'));

    expect(store.getActions()).toEqual([nextResult]);
    expect(next).toHaveBeenCalledWith({ skip: true });
  });
});

describe('onBack prop', () => {
  describe('enableBackButton', () => {
    it('calls callback from useLogoutOnBack', () => {
      const { getByTestId } = renderWithContext(
        <AddSomeoneScreen next={next} />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('BackButton'));

      expect(useLogoutOnBack).toHaveBeenCalledWith(true, false);
      expect(back).toHaveBeenCalledWith();
    });
  });

  describe('logoutOnBack', () => {
    it('calls callback from useLogoutOnBack', () => {
      const { getByTestId } = renderWithContext(
        <AddSomeoneScreen next={next} logoutOnBack={true} />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('BackButton'));

      expect(useLogoutOnBack).toHaveBeenCalledWith(true, true);
      expect(back).toHaveBeenCalledWith();
    });
  });
});
