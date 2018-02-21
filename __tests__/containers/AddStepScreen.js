import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';

// Note: test renderer must be required after react-native.
import AddStepScreen from '../../src/containers/AddStepScreen/index';
import { createMockNavState, testSnapshot, createMockStore } from '../../testUtils';
import { STEP_NOTE } from '../../src/constants';
import * as common from '../../src/utils/common';

const store = createMockStore();

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen navigation={createMockNavState({ onComplete: () => {} })} />
    </Provider>
  );
});

it('renders journey correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen navigation={createMockNavState({
        onComplete: () => {},
        type: 'journey',
      })} />
    </Provider>
  );
});

it('renders edit journey correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen navigation={createMockNavState({
        onComplete: () => {},
        type: 'editJourney',
        isEdit: true,
        text: 'Comment',
      })} />
    </Provider>
  );
});

it('renders step note correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <AddStepScreen navigation={createMockNavState({
        onComplete: () => {},
        type: STEP_NOTE,
        text: 'Comment',
      })} />
    </Provider>
  );
});


describe('add step methods', () => {
  let component;
  const mockComplete = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <AddStepScreen navigation={createMockNavState({
        onComplete: mockComplete,
        type: 'editJourney',
        isEdit: true,
        text: 'Comment',
      })} />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
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
      <AddStepScreen navigation={createMockNavState({
        onComplete: mockComplete,
        type: STEP_NOTE,
        text: 'Comment',
      })} />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
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
      <AddStepScreen navigation={createMockNavState({
        onComplete: mockComplete,
        type: 'journey',
      })} />,
      { context: { store } },
    );

    component = screen.dive().dive().dive().instance();
  });

  it('doesnt save a step', () => {
    component.saveStep();
    expect(mockComplete).toHaveBeenCalledTimes(0);
  });
});
