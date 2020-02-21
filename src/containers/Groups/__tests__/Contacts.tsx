import React from 'react';

import Contacts from '../Contacts';
import {
  createThunkStore,
  renderShallow,
  testSnapshotShallow,
} from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { navToPersonScreen } from '../../../actions/person';
import { getOrganizationContacts } from '../../../actions/organizations';
import { buildUpdatedPagination } from '../../../utils/pagination';

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../actions/person', () => ({
  navToPersonScreen: jest.fn(() => ({ type: 'test' })),
}));

jest.mock('../../../actions/organizations');
jest.mock('../../../utils/pagination');

const people = [{ id: '1' }, { id: '2' }];

const orgId = '1';
const organization = { id: orgId, name: 'Test Org' };

const store = createThunkStore({ organizations: { all: [organization] } });

// @ts-ignore
getOrganizationContacts.mockReturnValue({
  type: 'got org contacts',
  response: people,
});
// @ts-ignore
buildUpdatedPagination.mockReturnValue({});

describe('Contacts', () => {
  const component = <Contacts orgId={orgId} />;

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should load contacts with filter', async () => {
    const instance = renderShallow(component, store).instance();
    // @ts-ignore
    instance.handleSearch = jest.fn(() => Promise.resolve(people));
    // @ts-ignore
    await instance.loadContactsWithFilters();
    // @ts-ignore
    expect(instance.state.defaultResults).toEqual(people);
  });

  it('should handleFilterPress correctly', () => {
    const instance = renderShallow(component, store).instance();
    // @ts-ignore
    instance.handleFilterPress();
    expect(navigatePush).toHaveBeenCalled();
  });

  it('should handleChangeFilter correctly', () => {
    const instance = renderShallow(component, store).instance();
    const newFilters = {
      filter1: { id: '1' },
    };
    // @ts-ignore
    instance.handleChangeFilter(newFilters);
    // @ts-ignore
    expect(instance.state.filters).toEqual(newFilters);
  });

  it('should handleSearch correctly', async () => {
    const instance = renderShallow(component, store).instance();
    // @ts-ignore
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
    // @ts-ignore
    await instance.handleRemoveFilter('filter1');

    // @ts-ignore
    expect(Object.keys(instance.state.filters)).toHaveLength(1);
    // @ts-ignore
    expect(instance.state.filters.filter2).toMatchObject({
      id: '2',
      text: 'Last 7 days',
    });
  });

  it('should handleSelect correctly', () => {
    const person = people[0];
    const screen = renderShallow(component, store);
    const listItem = screen
      .childAt(1)
      .props()
      .listProps.renderItem({ item: person });

    listItem.props.onSelect(person);

    expect(navToPersonScreen).toHaveBeenCalledWith(person, organization, {
      // @ts-ignore
      onAssign: screen.instance().handleRefreshSearchList,
    });
  });
  it('should set searchListSearch when setSearch is called', () => {
    const instance = renderShallow(component, store).instance();
    const childSearch = () => {};
    // @ts-ignore
    instance.setSearch(childSearch);
    // @ts-ignore
    expect(instance.searchListSearch).toEqual(childSearch);
  });
  it('should render item', () => {
    const instance = renderShallow(component, store).instance();
    // @ts-ignore
    const renderedItem = instance.renderItem({ item: people[0] });
    expect(renderedItem).toMatchSnapshot();
  });
});
