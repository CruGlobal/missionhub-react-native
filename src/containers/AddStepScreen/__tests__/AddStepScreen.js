import { Alert } from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import AddStepScreen from '..';

import {
  createMockNavState,
  testSnapshot,
  createMockStore,
  renderShallow,
} from '../../../../testUtils';
import { CREATE_STEP, STEP_NOTE, ACTIONS } from '../../../constants';
import { updateChallengeNote } from '../../../actions/steps';
import { trackAction } from '../../../actions/analytics';
import * as common from '../../../utils/common';
import locale from '../../../i18n/locales/en-US';

const store = createMockStore();

jest.mock('react-native-device-info');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/analytics');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen
        navigation={createMockNavState({
          onComplete: jest.fn(),
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
          onComplete: jest.fn(),
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
          onComplete: jest.fn(),
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
          onComplete: jest.fn(),
          type: STEP_NOTE,
          text: 'Comment',
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
          onComplete: jest.fn(),
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
          onComplete: jest.fn(),
          type: 'interaction',
          hideSkip: false,
        })}
      />
    </Provider>,
  );
});

describe('add step methods', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    const screen = renderShallow(
      <AddStepScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
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
    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});

describe('add step methods for stepNote with onComplete', () => {
  let screen;
  const mockComplete = jest.fn();
  common.disableBack = { add: jest.fn(), remove: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();

    screen = renderShallow(
      <AddStepScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
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
      .childAt(0)
      .childAt(0)
      .simulate('press');

    expect(mockComplete).toHaveBeenCalledTimes(1);
  });

  it('runs saveStep', () => {
    screen
      .find('Input')
      .props()
      .onChangeText('test');

    screen.update();

    screen
      .childAt(2)
      .childAt(0)
      .simulate('press');

    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});

describe('add step methods for stepNote with next', () => {
  let screen;

  const stepId = '10';
  const personId = '111';
  const orgId = '11';
  const text = 'Comment';
  const mockNext = jest.fn();
  common.disableBack = { add: jest.fn(), remove: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();

    screen = renderShallow(
      <AddStepScreen
        navigation={createMockNavState({
          next: mockNext,
          type: STEP_NOTE,
          text,
          personId,
          orgId,
          stepId,
        })}
      />,
      store,
    );

    expect(common.disableBack.add).toHaveBeenCalledTimes(1);
  });

  it('runs skip', () => {
    screen
      .childAt(0)
      .childAt(0)
      .simulate('press');

    expect(mockNext).toHaveBeenCalledWith({ personId, orgId });
  });

  it('runs saveStep', () => {
    screen
      .find('Input')
      .props()
      .onChangeText(text);

    screen.update();

    screen
      .childAt(2)
      .childAt(0)
      .simulate('press');

    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
    expect(updateChallengeNote).toHaveBeenCalledWith(stepId, text);
    expect(trackAction).toHaveBeenCalledWith(ACTIONS.INTERACTION.name, {
      [ACTIONS.INTERACTION.COMMENT]: null,
    });
    expect(mockNext).toHaveBeenCalledWith({ personId, orgId });
  });
});

describe('add step methods without edit', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    const screen = renderShallow(
      <AddStepScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          type: 'journey',
        })}
      />,
      store,
    );

    component = screen.instance();
  });

  it('doesnt save a step', () => {
    component.saveStep();
    expect(mockComplete).toHaveBeenCalledTimes(0);
  });
});

describe('Caps create step at 255 characters', () => {
  let component;
  const mockComplete = jest.fn();
  Alert.alert = jest.fn();
  const { makeShorter } = locale.addStep;

  beforeEach(() => {
    const screen = renderShallow(
      <AddStepScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
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
