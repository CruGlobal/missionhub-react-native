import React from 'react';

import Contacts from '../Contacts';
import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));

const organization = { id: '1', name: 'Test Org' };

describe('Contacts', () => {
  const component = <Contacts organization={organization} />;

  it('should render correctly', () => {
    testSnapshotShallow(component);
  });

  it('should handleFilterPress correctly', () => {
    const instance = renderShallow(component).instance();
    instance.handleFilterPress();
    expect(instance.state.filters.filter1).toMatchObject({
      id: 'filter1',
      text: 'Last 30 days',
    });
  });

  it('should handleSearch correctly', async () => {
    const instance = renderShallow(component).instance();
    const result = await instance.handleSearch('test');
    expect(result).toHaveLength(4);
  });

  it('should handleRemoveFilter correctly', async () => {
    const instance = renderShallow(component).instance();
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
    const instance = renderShallow(component).instance();
    instance.handleSelect({ id: '1' });

    expect(navigatePush).toHaveBeenCalled();
  });
});
