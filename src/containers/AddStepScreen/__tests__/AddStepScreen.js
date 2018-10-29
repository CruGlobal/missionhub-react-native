import { Alert } from 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';

import AddStepScreen from '..';

import {
  createMockNavState,
  testSnapshot,
  createMockStore,
} from '../../../../testUtils';
import { CREATE_STEP, STEP_NOTE } from '../../../constants';
import * as common from '../../../utils/common';
import locale from '../../../i18n/locales/en-US';

const store = createMockStore();

jest.mock('react-native-device-info');

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
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <AddStepScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          type: 'editJourney',
          isEdit: true,
          text: 'Comment',
        })}
      />,
      { context: { store } },
    );

    component = screen
      .dive()
      .dive()
      .dive()
      .instance();
  });

  it('saves a step', () => {
    component.saveStep();
    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});

describe('add step methods for stepNote', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <AddStepScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          type: STEP_NOTE,
          text: 'Comment',
        })}
      />,
      { context: { store } },
    );

    component = screen
      .dive()
      .dive()
      .dive()
      .instance();
  });

  it('runs skip', () => {
    component.skip();
    expect(mockComplete).toHaveBeenCalledTimes(1);
  });

  it('runs skip', () => {
    common.disableBack = { remove: jest.fn() };
    component.componentWillUnmount();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
  });
});

describe('add step methods without edit', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <AddStepScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          type: 'journey',
        })}
      />,
      { context: { store } },
    );

    component = screen
      .dive()
      .dive()
      .dive()
      .instance();
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
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <AddStepScreen
        navigation={createMockNavState({
          onComplete: mockComplete,
          type: CREATE_STEP,
        })}
      />,
      { context: { store } },
    );

    component = screen
      .dive()
      .dive()
      .dive()
      .instance();
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
