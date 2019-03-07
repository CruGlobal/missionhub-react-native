import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import {
  createMockNavState,
  testSnapshot,
  renderShallow,
  createThunkStore,
} from '../../../../testUtils';

import CelebrationScreen from '..';

import { navigateReset } from '../../../actions/navigation';
import { MAIN_TABS } from '../../../constants';
import { CONTACT_PERSON_SCREEN } from '../../Groups/AssignedPersonScreen';

const mockStore = createThunkStore();

jest.mock('react-native-device-info');
jest.mock('../../../actions/navigation');

const mockMath = Object.create(global.Math);
mockMath.random = () => 0;
global.Math = mockMath;

navigateReset.mockReturnValue({ type: 'navigated reset' });

it('renders correctly', () => {
  testSnapshot(
    <Provider store={mockStore()}>
      <CelebrationScreen navigation={createMockNavState()} />
    </Provider>,
  );
});

describe('celebration screen methods', () => {
  let component;
  let screen;
  const mockComplete = jest.fn();
  const mockNext = jest.fn(() => ({ type: 'next' }));

  describe('navigateToNext', () => {
    it('runs onComplete', () => {
      screen = renderShallow(
        <CelebrationScreen
          navigation={createMockNavState({
            onComplete: mockComplete,
          })}
        />,
        mockStore(),
      );
      component = screen.instance();

      component.navigateToNext();
      expect(mockComplete).toHaveBeenCalledTimes(1);
    });

    it('runs next', () => {
      screen = renderShallow(
        <CelebrationScreen
          navigation={createMockNavState({
            next: mockNext,
          })}
        />,
        mockStore(),
      );
      component = screen.instance();

      component.navigateToNext();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('runs navigateReset with MAIN_TABS', () => {
      screen = renderShallow(
        <CelebrationScreen navigation={createMockNavState()} />,
        mockStore(),
      );
      component = screen.instance();

      component.navigateToNext();
      expect(navigateReset).toHaveBeenCalledWith(MAIN_TABS);
    });

    it('runs navigateReset with next screen', () => {
      screen = renderShallow(
        <CelebrationScreen
          navigation={createMockNavState({ nextScreen: CONTACT_PERSON_SCREEN })}
        />,
        mockStore(),
      );
      component = screen.instance();

      component.navigateToNext();
      expect(navigateReset).toHaveBeenCalledWith(CONTACT_PERSON_SCREEN);
    });
  });
});
