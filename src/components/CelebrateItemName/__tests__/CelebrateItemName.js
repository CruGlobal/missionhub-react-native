import React from 'react';
import configureStore from 'redux-mock-store';

import CelebrateItemName from '..';

import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { renderShallow } from '../../../../testUtils';
import { navToPersonScreen } from '../../../actions/person';

const mockStore = configureStore();
let store;

const navToPersonScreenResult = { type: 'navigated to person screen' };
const organization = { id: '235234' };
const subject_person_name = 'Roger Goers';
let event;
let screen;

jest.mock('../../../actions/person');

navToPersonScreen.mockReturnValue(navToPersonScreenResult);

beforeEach(() => {
  store = mockStore();

  jest.clearAllMocks();

  screen = renderShallow(<CelebrateItemName event={event} />, store);
});

describe('does not have organization', () => {
  beforeAll(() => {
    event = {
      ...event,
      organization: null,
    };
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('global community', () => {
  beforeAll(() => {
    event = {
      ...event,
      organization: { id: GLOBAL_COMMUNITY_ID },
    };
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('has organization', () => {
  beforeAll(() => {
    event = { ...event, organization };
  });

  describe('does not have subject person name', () => {
    beforeAll(() => {
      event = {
        ...event,
        subject_person_name: null,
      };
    });

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });
  });

  describe('has subject person name', () => {
    const subject_person = { name: 'Roger' };

    beforeAll(() => {
      event = {
        ...event,
        subject_person_name,
        subject_person,
      };
    });

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });

    it('navigates to person screen', () => {
      screen.props().onPress();

      expect(navToPersonScreen).toHaveBeenCalledWith(
        subject_person,
        organization,
      );
      expect(store.getActions()).toEqual([navToPersonScreenResult]);
    });
  });
});
