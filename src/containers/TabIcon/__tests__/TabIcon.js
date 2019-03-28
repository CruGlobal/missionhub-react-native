import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import TabIcon from '..';

import { renderShallow } from '../../../../testUtils';

const mockStore = configureStore([thunk]);
let store;

const buildScreen = (props = {}) => {
  return renderShallow(<TabIcon {...props} />, store);
};

const storeActive = {
  auth: { person: { hasActiveNotification: true } },
};
const storeInactive = {
  auth: { person: { hasActiveNotification: false } },
};

beforeEach(() => {
  store = mockStore(storeInactive);
});

describe('renders', () => {
  it('steps', () => {
    const screen = buildScreen({ name: 'steps', tintColor: 'blue' });
    expect(screen).toMatchSnapshot();
  });
  it('steps different tint color', () => {
    const screen = buildScreen({ name: 'steps', tintColor: 'grey' });
    expect(screen).toMatchSnapshot();
  });
  it('people', () => {
    const screen = buildScreen({ name: 'people', tintColor: 'blue' });
    expect(screen).toMatchSnapshot();
  });
  it('group', () => {
    const screen = buildScreen({ name: 'group', tintColor: 'blue' });
    expect(screen).toMatchSnapshot();
  });
  it('group with notification dot', () => {
    store = mockStore(storeActive);
    const screen = buildScreen({ name: 'group', tintColor: 'blue' });
    expect(screen).toMatchSnapshot();
  });
});
