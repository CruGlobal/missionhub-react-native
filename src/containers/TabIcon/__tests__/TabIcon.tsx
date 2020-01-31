import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';

import TabIcon from '..';

const mockStore = configureStore([thunk]);
// @ts-ignore
let store;

const buildScreen = (props = {}) => {
  // @ts-ignore
  return renderShallow(<TabIcon {...props} />, store);
};

const storeActive = {
  auth: { person: { unread_comments_count: 10 } },
};
const storeInactive = {
  auth: { person: { unread_comments_count: 0 } },
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