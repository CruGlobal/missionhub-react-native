import React from 'react';
import configureStore from 'redux-mock-store';

import GroupsListScreen from '../../../src/containers/Groups/GroupsListScreen';
import { renderShallow } from '../../../testUtils';
import { navigatePush } from '../../../src/actions/navigation';
import { communitiesSelector } from '../../../src/selectors/organizations';

jest.mock('../../../src/selectors/organizations');
jest.mock('../../../src/actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));

const mockStore = configureStore();
const organizations = {
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
};
const auth = {};
const store = mockStore({ organizations, auth });

communitiesSelector.mockReturnValue(organizations.all);

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
    expect(communitiesSelector).toHaveBeenCalledWith({
      organizations,
      auth,
    });
  });
});
