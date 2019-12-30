import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigateReset, navigateToMainTabs } from '../../../actions/navigation';
import { CONTACT_PERSON_SCREEN } from '../../Groups/AssignedPersonScreen';

import CelebrationScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../actions/navigation');
jest.useFakeTimers();

const mockMath = Object.create(global.Math);
mockMath.random = () => 0;
global.Math = mockMath;

navigateReset.mockReturnValue({ type: 'navigated reset' });
navigateToMainTabs.mockReturnValue({ type: 'navigateToMainTabs' });

it('renders correctly', () => {
  renderWithContext(<CelebrationScreen />).snapshot();
});

describe('celebration screen methods', () => {
  const mockComplete = jest.fn();
  const mockNext = jest.fn(() => ({ type: 'next' }));

  describe('navigateToNext', () => {
    it('runs onComplete', () => {
      const { getByTestId } = renderWithContext(<CelebrationScreen />, {
        navParams: { onComplete: mockComplete },
      });

      fireEvent(getByTestId('gif'), 'onLoad');
      jest.runAllTimers();

      expect(mockComplete).toHaveBeenCalledWith();
    });

    it('runs next', () => {
      const { getByTestId } = renderWithContext(<CelebrationScreen />, {
        navParams: { next: mockNext },
      });

      fireEvent(getByTestId('gif'), 'onLoad');
      jest.runAllTimers();

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('runs navigateToMainTabs', () => {
      const { getByTestId } = renderWithContext(<CelebrationScreen />);

      fireEvent(getByTestId('gif'), 'onLoad');
      jest.runAllTimers();

      expect(navigateToMainTabs).toHaveBeenCalled();
    });

    it('runs navigateReset with next screen', () => {
      const { getByTestId } = renderWithContext(<CelebrationScreen />, {
        navParams: { nextScreen: CONTACT_PERSON_SCREEN },
      });

      fireEvent(getByTestId('gif'), 'onLoad');
      jest.runAllTimers();

      expect(navigateReset).toHaveBeenCalledWith(CONTACT_PERSON_SCREEN);
    });
  });
});
