import React from 'react';
import configureStore from 'redux-mock-store';

import CelebrateItemName from '../index';
import { renderShallow } from '../../../../testUtils';
import { navToPersonScreen } from '../../../actions/person';

const mockStore = configureStore();
let store;

const navToPersonScreenResult = { type: 'navigated to person screen' };
const person = { id: '1234123' };
const organization = { id: '235234' };

let name;
let pressable;
let screen;

jest.mock('../../../actions/person');

navToPersonScreen.mockReturnValue(navToPersonScreenResult);

beforeEach(() => {
  store = mockStore();

  screen = renderShallow(
    <CelebrateItemName
      name={name}
      person={person}
      organization={organization}
      pressable={pressable}
    />,
    store,
  );
});

describe('does not have name', () => {
  beforeAll(() => {
    name = null;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('has name', () => {
  beforeAll(() => {
    name = 'Roger Goers';
  });

  describe('is not pressable', () => {
    beforeAll(() => {
      pressable = false;
    });

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });
  });

  describe('is pressable', () => {
    beforeAll(() => {
      pressable = true;
    });

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });

    it('navigates to person screen', () => {
      screen.props().onPress();

      expect(navToPersonScreen).toHaveBeenCalledWith(person, organization);
      expect(store.getActions()).toEqual([navToPersonScreenResult]);
    });
  });
});
