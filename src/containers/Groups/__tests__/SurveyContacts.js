import React from 'react';

import SurveyContacts from '../SurveyContacts';
import {
  createMockStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));

const store = createMockStore({});
const organization = { id: '1', name: 'Test Org' };
const survey = { id: '11' };

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

  it('should handleFilterPress correctly', () => {
    const instance = renderShallow(component, store)
      .dive()
      .dive()
      .dive()
      .instance();
    instance.handleFilterPress();
    expect(instance.state.filters.filter1).toMatchObject({
      id: 'filter1',
      text: 'Last 30 days',
    });
  });

  it('should handleSearch correctly', async () => {
    const instance = renderShallow(component, store)
      .dive()
      .dive()
      .dive()
      .instance();
    const result = await instance.handleSearch('test');
    expect(result).toHaveLength(4);
  });

  it('should handleRemoveFilter correctly', async () => {
    const instance = renderShallow(component, store)
      .dive()
      .dive()
      .dive()
      .instance();
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
    const instance = renderShallow(component, store)
      .dive()
      .dive()
      .dive()
      .instance();
    instance.handleSelect({ id: '1' });

    expect(navigatePush).toHaveBeenCalled();
  });
});
