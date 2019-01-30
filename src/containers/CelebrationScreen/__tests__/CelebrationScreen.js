import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import {
  createMockStore,
  createMockNavState,
  testSnapshot,
  renderShallow,
} from '../../../../testUtils';

import CelebrationScreen from '..';

import * as navigation from '../../../actions/navigation';
import { MAIN_TABS } from '../../../constants';
import { CONTACT_PERSON_SCREEN } from '../../Groups/AssignedPersonScreen';

const store = createMockStore();

jest.mock('react-native-device-info');

const mockMath = Object.create(global.Math);
mockMath.random = () => 0;
global.Math = mockMath;

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <CelebrationScreen navigation={createMockNavState()} />
    </Provider>,
  );
});

describe('celebration screen methods', () => {
  let component;
  let screen;
  const mockComplete = jest.fn();
  const mockNext = jest.fn();

  describe('navigateToNext', () => {
    it('runs onComplete', () => {
      screen = renderShallow(
        <CelebrationScreen
          navigation={createMockNavState({
            onComplete: mockComplete,
          })}
        />,
        store,
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
        store,
      );
      component = screen.instance();

      component.navigateToNext();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('runs navigateReset with MAIN_TABS', () => {
      screen = renderShallow(
        <CelebrationScreen navigation={createMockNavState()} />,
        store,
      );
      component = screen.instance();

      navigation.navigateReset = jest.fn();

      component.navigateToNext();
      expect(navigation.navigateReset).toHaveBeenCalledWith(MAIN_TABS);
    });

    it('runs navigateReset with next screen', () => {
      screen = renderShallow(
        <CelebrationScreen
          navigation={createMockNavState({ nextScreen: CONTACT_PERSON_SCREEN })}
        />,
        store,
      );
      component = screen.instance();

      navigation.navigateReset = jest.fn();

      component.navigateToNext();
      expect(navigation.navigateReset).toHaveBeenCalledWith(
        CONTACT_PERSON_SCREEN,
      );
    });
  });
});
