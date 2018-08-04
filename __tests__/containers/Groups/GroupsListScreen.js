import React from 'react';

import GroupsListScreen from '../../../src/containers/Groups/GroupsListScreen';
import { renderShallow, createMockStore } from '../../../testUtils';
import { navigatePush } from '../../../src/actions/navigation';
jest.mock('../../../src/actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));

const store = createMockStore({
  organizations: {
    all: [
      {
        id: '1',
        name: 'Test Org 1',
      },
      {
        id: '2',
        name: 'Test Org 2',
      },
    ],
  },
});

describe('GroupsListScreen', () => {
  let component;
  beforeEach(() => {
    component = renderShallow(<GroupsListScreen />, store);
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });

  it('should handlePress correctly', () => {
    const instance = component.instance();
    instance.handlePress();
    expect(navigatePush).toHaveBeenCalled();
  });
});
