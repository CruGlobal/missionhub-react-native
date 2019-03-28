import { Alert } from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import AddStepScreen from '..';

import {
  createMockNavState,
  testSnapshot,
  renderShallow,
} from '../../../../testUtils';
import { CREATE_STEP, STEP_NOTE } from '../../../constants';
import * as common from '../../../utils/common';
import locale from '../../../i18n/locales/en-US';

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);

const mockStore = configureStore([thunk]);
let store;

const auth = { person: { id: '123123' } };

jest.mock('react-native-device-info');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/analytics');

beforeEach(() => {
  store = mockStore({ auth });
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen
        navigation={createMockNavState({
          next: jest.fn(),
          type: CREATE_STEP,
        })}
      />
    </Provider>,
  );
});

it('renders journey correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen
        navigation={createMockNavState({
          next: jest.fn(),
          type: 'journey',
        })}
      />
    </Provider>,
  );
});

it('renders edit journey correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen
        navigation={createMockNavState({
          next: jest.fn(),
          type: 'editJourney',
          isEdit: true,
          text: 'Comment',
        })}
      />
    </Provider>,
  );
});

it('renders step note correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen
        navigation={createMockNavState({
          next: jest.fn(),
          type: STEP_NOTE,
          text: 'Comment',
        })}
      />
    </Provider>,
  );
});

it('renders step note correctly for me', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen
        navigation={createMockNavState({
          next: jest.fn(),
          type: STEP_NOTE,
          text: 'Comment',
          personId: auth.person.id,
        })}
      />
    </Provider>,
  );
});

it('renders interaction without skip correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen
        navigation={createMockNavState({
          next: jest.fn(),
          type: 'interaction',
          hideSkip: true,
        })}
      />
    </Provider>,
  );
});

it('renders interaction with skip correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen
        navigation={createMockNavState({
          next: jest.fn(),
          type: 'interaction',
          hideSkip: false,
        })}
      />
    </Provider>,
  );
});

describe('add step methods', () => {
  let component;
  const next = jest.fn(() => ({ type: 'next' }));
  beforeEach(() => {
    const screen = renderShallow(
      <AddStepScreen
        navigation={createMockNavState({
          next,
          type: 'editJourney',
          isEdit: true,
          text: 'Comment',
        })}
      />,
      store,
    );

    component = screen.instance();
  });

  it('saves a step', () => {
    component.saveStep();
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('add step methods for stepNote with next', () => {
  let screen;
  const next = jest.fn(() => ({ type: 'next' }));
  common.disableBack = { add: jest.fn(), remove: jest.fn() };

  beforeEach(() => {
    screen = renderShallow(
      <AddStepScreen
        navigation={createMockNavState({
          next,
          type: STEP_NOTE,
          text: 'Comment',
        })}
      />,
      store,
    );

    expect(common.disableBack.add).toHaveBeenCalledTimes(1);
  });

  it('runs skip', () => {
    screen
      .childAt(3)
      .props()
      .onSkip();

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('runs saveStep', () => {
    screen
      .find('Input')
      .props()
      .onChangeText('test');

    screen.update();

    screen.childAt(2).simulate('press');

    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('add step methods without edit', () => {
  let component;
  const next = jest.fn();
  beforeEach(() => {
    const screen = renderShallow(
      <AddStepScreen
        navigation={createMockNavState({
          next,
          type: 'journey',
        })}
      />,
      store,
    );

    component = screen.instance();
  });

  it('doesnt save a step', () => {
    component.saveStep();
    expect(next).toHaveBeenCalledTimes(0);
  });
});

describe('Caps create step at 255 characters', () => {
  let component;
  const next = jest.fn();
  Alert.alert = jest.fn();
  const { makeShorter } = locale.addStep;

  beforeEach(() => {
    const screen = renderShallow(
      <AddStepScreen
        navigation={createMockNavState({
          next,
          type: CREATE_STEP,
        })}
      />,
      store,
    );

    component = screen.instance();
  });

  const twoFiftyFour =
    '254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254char';
  const twoFiftyFive = `${twoFiftyFour}a`;

  it('Allows 254 characters', () => {
    component.onChangeText(twoFiftyFour);

    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('displays alert at 255 characters', () => {
    component.onChangeText(twoFiftyFive);

    expect(Alert.alert).toHaveBeenCalledWith('', makeShorter);
  });
});
