import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigateReset, navigateToMainTabs } from '../../../actions/navigation';

import CelebrationScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/hooks/useAnalytics');
jest.useFakeTimers();

const mockMath = Object.create(global.Math);
mockMath.random = () => 0;
global.Math = mockMath;

// @ts-ignore
navigateReset.mockReturnValue({ type: 'navigated reset' });
// @ts-ignore
navigateToMainTabs.mockReturnValue({ type: 'navigateToMainTabs' });

it('renders random gif correctly', () => {
  // @ts-ignore
  renderWithContext(<CelebrationScreen />).snapshot();
});

describe('renders different gifs correctly', () => {
  it('renders arrow gif', () => {
    // @ts-ignore
    renderWithContext(<CelebrationScreen gifId={0} />).snapshot();
  });
  it('renders dino gif', () => {
    // @ts-ignore
    renderWithContext(<CelebrationScreen gifId={1} />).snapshot();
  });
  it('renders fireworks gif', () => {
    // @ts-ignore
    renderWithContext(<CelebrationScreen gifId={2} />).snapshot();
  });
  it('renders narwhal gif', () => {
    // @ts-ignore
    renderWithContext(<CelebrationScreen gifId={3} />).snapshot();
  });
  it('renders party gif', () => {
    // @ts-ignore
    renderWithContext(<CelebrationScreen gifId={4} />).snapshot();
  });
});

describe('celebration screen methods', () => {
  const mockComplete = jest.fn();
  const mockNext = jest.fn(() => ({ type: 'next' }));

  describe('navigateToNext', () => {
    it('runs onComplete', () => {
      // @ts-ignore
      const { getByTestId } = renderWithContext(<CelebrationScreen />, {
        navParams: { onComplete: mockComplete },
      });

      fireEvent(getByTestId('gif'), 'onLoad');
      jest.runAllTimers();

      expect(mockComplete).toHaveBeenCalledWith();
    });

    it('runs next', () => {
      // @ts-ignore
      const { getByTestId } = renderWithContext(<CelebrationScreen />, {
        navParams: { next: mockNext },
      });

      fireEvent(getByTestId('gif'), 'onLoad');
      jest.runAllTimers();

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('runs navigateToMainTabs', () => {
      // @ts-ignore
      const { getByTestId } = renderWithContext(<CelebrationScreen />);

      fireEvent(getByTestId('gif'), 'onLoad');
      jest.runAllTimers();

      expect(navigateToMainTabs).toHaveBeenCalled();
    });
  });
});
