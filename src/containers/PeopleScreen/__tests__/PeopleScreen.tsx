import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import { useFocusEffect } from 'react-navigation-hooks';

import { renderWithContext } from '../../../../testUtils';
import * as common from '../../../utils/common';
import { navigatePush } from '../../../actions/navigation';
import { getMyPeople } from '../../../actions/people';
import { checkForUnreadComments } from '../../../actions/unreadComments';
import { ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW } from '../../../routes/constants';
import { SEARCH_SCREEN } from '../../../containers/SearchPeopleScreen';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../../utils/hooks/useAnalytics';

import { PeopleScreen } from '..';

jest.mock('react-native-device-info');
jest.mock('react-navigation-hooks');
jest.mock('../../../components/common', () => ({
  IconButton: 'IconButton',
  Button: 'Button',
}));
jest.mock('../../../components/PeopleList', () => 'PeopleList');
jest.mock('../../../components/Header', () => 'Header');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/people');
jest.mock('../../../actions/person');
jest.mock('../../../actions/unreadComments');
jest.mock('../../../selectors/people');
jest.mock('../../../actions/people', () => ({
  getMyPeople: jest.fn(),
}));
jest.mock('../../../utils/hooks/useAnalytics');

const person = {
  first_name: 'Christian',
  last_name: 'Huffman',
  id: '4224323',
};

const orgs = [
  {
    id: 'personal',
    type: 'organization',
    people: [
      {
        id: 1,
        type: 'person',
      },
      {
        id: 2,
        type: 'person',
      },
      {
        id: 3,
        type: 'person',
      },
    ],
  },
  {
    id: 10,
    name: 'org 1',
    type: 'organization',
    people: [
      {
        id: 11,
        type: 'person',
      },
    ],
  },
  {
    id: 20,
    name: 'org 2',
    type: 'organization',
    people: [
      {
        id: 21,
        type: 'person',
      },
    ],
  },
];

const people = [
  {
    id: 1,
    type: 'person',
  },
  {
    id: 2,
    type: 'person',
  },
  {
    id: 3,
    type: 'person',
  },
];

const props = {
  isJean: true,
  hasNoContacts: false,
  items: orgs,
  dispatch: jest.fn(response => Promise.resolve(response)),
  person: person,
};

it('renders empty correctly', () => {
  renderWithContext(
    <PeopleScreen
      {...props}
      isJean={false}
      items={[{ id: 'me person' }]}
      hasNoContacts={true}
    />,
    {
      initialState: { auth: { person: {} }, stages: {} },
    },
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    'people',
    ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  );
  expect(useFocusEffect).toHaveBeenCalledWith(expect.any(Function));
});

it('renders correctly as Casey', () => {
  renderWithContext(
    <PeopleScreen {...props} isJean={false} items={people} />,
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    'people',
    ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  );
  expect(useFocusEffect).toHaveBeenCalledWith(expect.any(Function));
});

it('renders correctly as Jean', () => {
  renderWithContext(
    <PeopleScreen {...props} isJean={true} items={orgs} />,
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    'people',
    ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  );
  expect(useFocusEffect).toHaveBeenCalledWith(expect.any(Function));
});

it('should open main menu', () => {
  (common.openMainMenu as jest.Mock) = jest.fn();

  const { getByTestId } = renderWithContext(<PeopleScreen {...props} />);
  fireEvent.press(getByTestId('header').props.left);
  expect(common.openMainMenu).toHaveBeenCalled();
});

describe('handleAddContact', () => {
  const organization = orgs[0];

  describe('not isJean', () => {
    describe('press header button', () => {
      it('should navigate to add person flow', () => {
        const { getByTestId } = renderWithContext(
          <PeopleScreen {...props} isJean={false} />,
        );

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
        const { getByTestId } = renderWithContext(
          <PeopleScreen {...props} isJean={false} hasNoContacts={true} />,
        );

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

  describe('isJean', () => {
    describe('press header button', () => {
      it('should replace top right icon with search', () => {
        const { getByTestId } = renderWithContext(
          <PeopleScreen {...props} isJean={true} />,
        );

        fireEvent.press(getByTestId('header').props.right);
        expect(navigatePush).toHaveBeenCalledWith(SEARCH_SCREEN);
      });
    });

    describe('press section header button', () => {
      it('should navigate to add person flow', () => {
        const { getByTestId } = renderWithContext(
          <PeopleScreen {...props} isJean={true} />,
        );
        fireEvent(getByTestId('peopleList'), 'addContact', organization);

        expect(navigatePush).toHaveBeenCalledWith(
          ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW,
          {
            organization,
          },
        );
      });
    });

    describe('press bottom button', () => {
      it('should navigate to add person flow', () => {
        const { getByTestId } = renderWithContext(
          <PeopleScreen {...props} isJean={true} hasNoContacts={true} />,
        );

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
});

describe('handleRefresh', () => {
  beforeEach(() => {
    (getMyPeople as jest.Mock).mockReturnValue({
      type: 'get people',
    });
    (checkForUnreadComments as jest.Mock).mockReturnValue({
      type: 'check for unread comments',
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (common as any).refresh = jest.fn((_, refreshMethod) => refreshMethod());

    const { getByTestId } = renderWithContext(<PeopleScreen {...props} />);
    fireEvent(getByTestId('peopleList'), 'refresh');
  });

  it('should get me', () => {
    expect(checkForUnreadComments).toHaveBeenCalled();
  });

  it('should get people', () => {
    expect(getMyPeople).toHaveBeenCalled();
  });
});
