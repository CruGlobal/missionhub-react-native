import 'react-native';
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { MockList } from 'graphql-tools';

import { renderWithContext } from '../../../../testUtils';
import * as common from '../../../utils/common';
import { navigatePush } from '../../../actions/navigation';
import { ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW } from '../../../routes/constants';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../../utils/hooks/useAnalytics';
import { PeopleScreen } from '..';

jest.mock('react-native-device-info');
jest.mock('react-navigation-hooks');
jest.mock('../../PersonItem', () => ({
  PersonItem: 'PersonItem',
}));
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/people');
jest.mock('../../../actions/person');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../utils/common');
jest.mock('react-native/Libraries/LogBox/LogBox');

const myId = '1';
const initialState = { auth: { person: { id: myId } } };
const mocks = {
  User: () => ({
    person: () => ({
      id: myId,
    }),
  }),
  PersonConnection: () => ({ nodes: () => new MockList(10) }),
};

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });
  (common.openMainMenu as jest.Mock).mockReturnValue({
    type: 'open main menu',
  });
});

it('renders empty correctly', async () => {
  const { snapshot } = renderWithContext(<PeopleScreen />, {
    initialState,
    mocks: {
      ...mocks,
      PersonConnection: () => ({ nodes: () => [] }),
    },
  });

  await flushMicrotasksQueue();
  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith('people', {
    screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  });
});

it('renders with people correctly', async () => {
  const { snapshot } = renderWithContext(<PeopleScreen />, {
    initialState,
    mocks,
  });

  await flushMicrotasksQueue();
  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith('people', {
    screenType: ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  });
});

it('should open main menu', () => {
  const { getByTestId } = renderWithContext(<PeopleScreen />, {
    initialState,
    mocks,
  });

  fireEvent.press(getByTestId('menuButton'));

  expect(common.openMainMenu).toHaveBeenCalled();
});

describe('handleAddContact', () => {
  describe('press header button', () => {
    it('should navigate to add person flow', () => {
      const { getByTestId } = renderWithContext(<PeopleScreen />, {
        initialState,
        mocks,
      });

      fireEvent.press(getByTestId('header').props.right);

      expect(navigatePush).toHaveBeenCalledWith(
        ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW,
        {
          organization: undefined,
        },
      );
    });
  });

  describe('press bottom button', () => {
    it('should navigate to add person flow', () => {
      const { getByTestId } = renderWithContext(<PeopleScreen />, {
        initialState,
        mocks: {
          ...mocks,
          PersonConnection: () => ({ nodes: () => [] }),
        },
      });

      fireEvent.press(getByTestId('bottomButton'));

      expect(navigatePush).toHaveBeenCalledWith(
        ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW,
        {
          organization: undefined,
        },
      );
    });
  });
});
