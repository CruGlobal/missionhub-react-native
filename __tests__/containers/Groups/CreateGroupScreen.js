import React from 'react';
import configureStore from 'redux-mock-store';

import CreateGroupScreen from '../../../src/containers/Groups/CreateGroupScreen';
import { renderShallow, createMockNavState } from '../../../testUtils';

const mockStore = configureStore();
const organizations = {
  all: [
    {
      id: '1',
      name: 'Test Org 1',
      contactReport: {},
    },
    {
      id: '2',
      name: 'Test Org 2',
      contactReport: {},
      user_created: true,
    },
  ],
};
const auth = {};
const store = mockStore({ organizations, auth });

it('should render null state', () => {
  const component = renderShallow(
    <CreateGroupScreen navigation={createMockNavState()} />,
    mockStore({ organizations: { all: [] }, auth }),
  );
  expect(component).toMatchSnapshot();
});

describe('CreateGroupScreen', () => {
  let component;
  beforeEach(() => {
    component = renderShallow(
      <CreateGroupScreen navigation={createMockNavState()} />,
      store,
    );
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
