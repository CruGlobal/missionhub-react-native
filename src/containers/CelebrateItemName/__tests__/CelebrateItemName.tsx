import React from 'react';
import configureStore from 'redux-mock-store';

import CelebrateItemName from '../index';
import { renderShallow } from '../../../../testUtils';
import { navToPersonScreen } from '../../../actions/person';

const mockStore = configureStore();
// @ts-ignore
let store;

const navToPersonScreenResult = { type: 'navigated to person screen' };
const person = { id: '1234123' };
const organization = { id: '235234' };

// @ts-ignore
let name;
// @ts-ignore
let pressable;
// @ts-ignore
let screen;

jest.mock('../../../actions/person');

// @ts-ignore
navToPersonScreen.mockReturnValue(navToPersonScreenResult);

beforeEach(() => {
  store = mockStore();

  screen = renderShallow(
    <CelebrateItemName
      // @ts-ignore
      name={name}
      person={person}
      organization={organization}
      // @ts-ignore
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
    // @ts-ignore
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
      // @ts-ignore
      expect(screen).toMatchSnapshot();
    });
  });

  describe('is pressable', () => {
    beforeAll(() => {
      pressable = true;
    });

    it('renders correctly', () => {
      // @ts-ignore
      expect(screen).toMatchSnapshot();
    });

    it('navigates to person screen', () => {
      // @ts-ignore
      screen.props().onPress();

      expect(navToPersonScreen).toHaveBeenCalledWith(person, organization);
      // @ts-ignore
      expect(store.getActions()).toEqual([navToPersonScreenResult]);
    });
  });
});
