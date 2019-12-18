import 'react-native';
import React from 'react';
import { Provider } from 'react-redux-legacy';

import {
  createMockNavState,
  testSnapshot,
  renderShallow,
  createThunkStore,
} from '../../../../testUtils';
import { navigateReset, navigateToMainTabs } from '../../../actions/navigation';
import { CONTACT_PERSON_SCREEN } from '../../Groups/AssignedPersonScreen';

import CelebrationScreen from '..';

let store;

jest.mock('react-native-device-info');
jest.mock('../../../actions/navigation');

const mockMath = Object.create(global.Math);
mockMath.random = () => 0;
global.Math = mockMath;

navigateReset.mockReturnValue({ type: 'navigated reset' });
navigateToMainTabs.mockReturnValue({ type: 'navigateToMainTabs' });

beforeEach(() => {
  store = createThunkStore();
});

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
  const mockNext = jest.fn(() => ({ type: 'next' }));

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

    it('runs navigateToMainTabs', () => {
      screen = renderShallow(
        <CelebrationScreen navigation={createMockNavState()} />,
        store,
      );
      component = screen.instance();

      component.navigateToNext();
      expect(navigateToMainTabs).toHaveBeenCalled();
    });

    it('runs navigateReset with next screen', () => {
      screen = renderShallow(
        <CelebrationScreen
          navigation={createMockNavState({ nextScreen: CONTACT_PERSON_SCREEN })}
        />,
        store,
      );
      component = screen.instance();

      component.navigateToNext();
      expect(navigateReset).toHaveBeenCalledWith(CONTACT_PERSON_SCREEN);
    });
  });
});
