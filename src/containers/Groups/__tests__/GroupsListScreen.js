import React from 'react';

import GroupsListScreen from '../GroupsListScreen';
import { renderShallow, createMockStore } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));

const store = createMockStore({
  organizations: {
    all: [
      {
        id: '123',
        name: 'Cru at Boston University',
        contacts: 768,
        unassigned: 13,
        uncontacted: 43,
      },
      {
        id: '456',
        name: 'Cru at Boston University Northeast Branch',
        contacts: 768,
        unassigned: 0,
        uncontacted: 0,
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
