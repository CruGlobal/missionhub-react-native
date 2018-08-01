import React from 'react';

import SurveyContacts from '../../../src/containers/Groups/SurveyContacts';
import {
  createMockStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../../testUtils';
import { navigatePush } from '../../../src/actions/navigation';
import { navToPersonScreen } from '../../../src/actions/person';

jest.mock('../../../src/actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../src/actions/person', () => ({
  navToPersonScreen: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../src/actions/people', () => ({
  searchPeople: jest.fn(() => ({
    type: 'test',
    findAll: () => [{ id: '1' }, { id: '2' }],
  })),
}));

const store = createMockStore({});
const organization = { id: '1', name: 'Test Org' };
const survey = { id: '11' };
const people = [{ id: '1' }, { id: '2' }];

beforeEach(() => {
  navigatePush.mockClear();
  navToPersonScreen.mockClear();
});

describe('SurveyContacts', () => {
  const component = (
    <SurveyContacts
      navigation={createMockNavState({
        organization,
        survey,
      })}
    />
  );

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should load contacts with filter', async () => {
    const instance = renderShallow(component, store).instance();
    instance.handleSearch = jest.fn(() => Promise.resolve(people));
    await instance.loadContactsWithFilters();
    expect(instance.state.defaultResults).toEqual(people);
  });

  it('should handleFilterPress correctly', () => {
    const instance = renderShallow(component, store).instance();
    instance.handleFilterPress();
    expect(navigatePush).toHaveBeenCalled();
  });

  it('should handleChangeFilter correctly', () => {
    const instance = renderShallow(component, store).instance();
    const newFilters = {
      filter1: { id: '1' },
    };
    instance.handleChangeFilter(newFilters);
    expect(instance.state.filters).toEqual(newFilters);
  });

  it('should handleSearch correctly', async () => {
    const instance = renderShallow(component, store).instance();

    const result = await instance.handleSearch('test');
    expect(result).toEqual(people);
  });

  it('should handleRemoveFilter correctly', async () => {
    const instance = renderShallow(component, store).instance();
    instance.setState({
      filters: {
        filter1: { id: '1', text: 'Last 30 days' },
        filter2: { id: '2', text: 'Last 7 days' },
      },
    });
    await instance.handleRemoveFilter('filter1');

    expect(Object.keys(instance.state.filters)).toHaveLength(1);
    expect(instance.state.filters.filter2).toMatchObject({
      id: '2',
      text: 'Last 7 days',
    });
  });

  it('should handleSelect correctly', async () => {
    const person = { id: '1' };
    const instance = renderShallow(component, store).instance();
    instance.handleSelect(person);
    expect(navToPersonScreen).toHaveBeenCalledWith(person, organization);
  });
});
