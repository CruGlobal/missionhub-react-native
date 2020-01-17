import React from 'react';

import SurveyContacts from '../SurveyContacts';
import {
  createThunkStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { navToPersonScreen } from '../../../actions/person';
import * as organizations from '../../../actions/organizations';
import { SEARCH_SURVEY_CONTACTS_FILTER_SCREEN } from '../SurveyContactsFilter';
import { buildTrackingObj } from '../../../utils/common';

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../actions/person', () => ({
  navToPersonScreen: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../actions/organizations');
jest.mock('../../../utils/common');

const store = createThunkStore({});
const organization = { id: '1', name: 'Test Org' };
const survey = { id: '11' };
const people = [{ id: '1' }, { id: '2' }];

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
    // @ts-ignore
    instance.handleLoadMore = jest.fn(() => Promise.resolve(people));
    // @ts-ignore
    await instance.loadContactsWithFilters();
    // @ts-ignore
    expect(instance.state.defaultResults).toEqual(people);
  });

  it('should handleFilterPress correctly', () => {
    const instance = renderShallow(component, store).instance();
    // @ts-ignore
    instance.handleFilterPress();
    expect(navigatePush).toHaveBeenCalledWith(
      SEARCH_SURVEY_CONTACTS_FILTER_SCREEN,
      {
        survey,
        // @ts-ignore
        onFilter: instance.handleChangeFilter,
        // @ts-ignore
        filters: instance.state.filters,
      },
    );
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
    const searchReturnValue = {
      response: [people[0], people[1]],
      meta: { total: 42 },
    };
    // @ts-ignore
    organizations.getOrganizationContacts.mockReturnValue(
      () => searchReturnValue,
    );

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
    const buildTrackingResult = { name: 'screen name' };
    // @ts-ignore
    buildTrackingObj.mockReturnValue(buildTrackingResult);

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
      trackingObj: buildTrackingResult,
    });
    expect(buildTrackingObj).toHaveBeenCalled();
  });

  it('should render item correctly', () => {
    const instance = renderShallow(component, store).instance();

    // @ts-ignore
    const renderedItem = instance.renderItem({ item: people[0] });
    expect(renderedItem).toMatchSnapshot();
  });

  it('should call ref', () => {
    const instance = renderShallow(component, store).instance();
    const childSearch = () => {};
    // @ts-ignore
    instance.setSearch(childSearch);
    // @ts-ignore
    expect(instance.searchListSearch).toEqual(childSearch);
  });
});
