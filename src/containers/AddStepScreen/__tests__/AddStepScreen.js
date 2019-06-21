import { Alert } from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import AddStepScreen from '..';

import { renderWithContext } from '../../../../testUtils';
import { CREATE_STEP, STEP_NOTE } from '../../../constants';
import * as common from '../../../utils/common';
import locale from '../../../i18n/locales/en-US';

//fixed in steps-improvement
const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);

jest.mock('react-native-device-info');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/analytics');

const next = jest.fn();
const nextResult = { type: 'next' };
const auth = { person: { id: '123123' } };

const text = 'Comment';

beforeEach(() => {
  next.mockReturnValue(nextResult);
});

it('renders correctly', () => {
  renderWithContext(AddStepScreen, {
    componentProps: { next },
    initialState: { auth },
    navParams: { type: CREATE_STEP },
  }).snapshot();
});

it('renders journey correctly', () => {
  renderWithContext(AddStepScreen, {
    componentProps: { next },
    initialState: { auth },
    navParams: { type: 'journey' },
  }).snapshot();
});

it('renders edit journey correctly', () => {
  renderWithContext(AddStepScreen, {
    componentProps: { next },
    initialState: { auth },
    navParams: { type: 'editJourney', isEdit: true, text },
  }).snapshot();
});

it('renders step note correctly', () => {
  renderWithContext(AddStepScreen, {
    componentProps: { next },
    initialState: { auth },
    navParams: { type: STEP_NOTE, text },
  }).snapshot();
});

it('renders step note correctly for me', () => {
  renderWithContext(AddStepScreen, {
    componentProps: { next },
    initialState: { auth },
    navParams: { type: STEP_NOTE, text, personId: auth.person.id },
  }).snapshot();
});

it('renders interaction without skip correctly', () => {
  renderWithContext(AddStepScreen, {
    componentProps: { next },
    initialState: { auth },
    navParams: { type: 'interaction', hideSkip: 'true' },
  }).snapshot();
});

it('renders interaction with skip correctly', () => {
  renderWithContext(AddStepScreen, {
    componentProps: { next },
    initialState: { auth },
    navParams: { type: 'interaction', hideSkip: false },
  }).snapshot();
});

describe('edit journey methods', () => {
  it('saves journey edit', () => {
    const { getByTestId, store } = renderWithContext(AddStepScreen, {
      componentProps: { next },
      initialState: { auth },
      navParams: { type: 'editJourney', isEdit: true, text },
    });

    fireEvent.press(getByTestId('bottomButton'));

    expect(store.getActions()).toEqual([nextResult]);
    expect(next).toHaveBeenCalledWith({
      text,
      stepId: undefined,
      personId: undefined,
      orgId: undefined,
    });
  });
});

/*
describe('add step methods for stepNote with next', () => {
  let screen;
  const next = jest.fn(() => ({ type: 'next' }));
  const onSetComplete = jest.fn();
  common.disableBack = { add: jest.fn(), remove: jest.fn() };

  beforeEach(() => {
    screen = renderShallow(
      <AddStepScreen
        navigation={createMockNavState({
          next,
          type: STEP_NOTE,
          text: 'Comment',
          onSetComplete,
        })}
      />,
      store,
    );

    expect(common.disableBack.add).toHaveBeenCalledTimes(1);
  });

  it('runs skip', async () => {
    await screen
      .childAt(4)
      .props()
      .onSkip();

    expect(onSetComplete).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('runs saveStep', async () => {
    screen
      .find('ForwardRef')
      .dive() // Input
      .props()
      .onChangeText('test');

    screen.update();

    await screen.childAt(2).simulate('press');

    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
    expect(onSetComplete).toHaveBeenCalled();
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
*/
