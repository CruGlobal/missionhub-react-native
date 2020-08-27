import 'react-native';
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { navigatePush } from '../../../../actions/navigation';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import SignUpScreen, { SIGNUP_TYPES } from '..';
import { useAuth } from '../../../../auth/useAuth';

const next = jest.fn(() => () => {});

jest.mock('../../../../actions/auth/auth');
jest.mock('../../../../actions/navigation');
jest.mock('../../../../reducers/nav', () => null);
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('../../../../auth/useAuth');

jest.mock('../../../../components/common', () => ({
  Text: 'Text',
  Button: 'Button',
  Flex: 'Flex',
  Icon: 'Icon',
  LoadingWheel: 'LoadingWheel',
}));
jest.mock('../../../DeprecatedBackButton', () => 'DeprecatedBackButton');

const authenticate = jest.fn();
(useAuth as jest.Mock).mockReturnValue({ authenticate });

it('renders correctly with logo', () => {
  renderWithContext(<SignUpScreen next={next} />).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['menu', 'sign up']);
});

it('renders correctly for Create Community', () => {
  const { recordSnapshot, rerender, diffSnapshot } = renderWithContext(
    <SignUpScreen next={next} />,
  );
  recordSnapshot();
  rerender(
    <SignUpScreen signUpType={SIGNUP_TYPES.CREATE_COMMUNITY} next={next} />,
  );
  diffSnapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['communities', 'sign up']);
});

describe('a login button is clicked', () => {
  const navigateResponse = { type: 'navigate push' };

  (navigatePush as jest.Mock).mockReturnValue(navigateResponse);

  it('login to be called', () => {
    const { getByTestId } = renderWithContext(<SignUpScreen next={next} />);
    fireEvent.press(getByTestId('loginButton'));

    expect(next).toHaveBeenCalledWith({ signIn: true });
  });

  describe('social auth buttons', () => {
    it('should call authenticate when pressed', async () => {
      const { getByTestId } = renderWithContext(<SignUpScreen next={next} />);

      fireEvent(
        getByTestId('signUpSocialAuthButtons'),
        'authenticate',
        'authenticateOptions',
      );
      await flushMicrotasksQueue();

      expect(authenticate).toHaveBeenCalledWith('authenticateOptions');
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
