import React from 'react';

import {
  createThunkStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../../testUtils';
import { navigatePush } from '../../../../actions/navigation';
import * as filterUtils from '../../../../utils/filters';

import SurveyContactsFilter from '..';

jest.mock('../../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../../actions/surveys');

// @ts-ignore
let store;
const timeFilter30 = { id: 'time30', value: 30, text: 'Last 30 days' };
const filters = {
  unassigned: {
    id: 'unassigned',
    selected: true,
    text: 'Unassigned',
  },
  time: timeFilter30,
};
const survey = { id: '11' };
const organization = { id: '22' };

beforeEach(() => {
  store = createThunkStore();
});

describe('SurveyContactsFilter', () => {
  const onFilter = jest.fn();
  const component = (
    <SurveyContactsFilter
      navigation={createMockNavState({
        onFilter,
        filters,
        survey,
        organization,
      })}
    />
  );

  it('should render correctly', () => {
    // @ts-ignore
    testSnapshotShallow(component, store);
  });

  it('should handleDrillDown correctly', () => {
    // @ts-ignore
    const instance = renderShallow(component, store).instance();
    const options = [{ id: 'o1' }, { id: 'o2' }];
    // @ts-ignore
    instance.handleDrillDown({ id: '1', options });

    expect(navigatePush).toHaveBeenCalled();
    // @ts-ignore
    expect(instance.state.selectedFilterId).toBe('1');
  });

  it('should handleToggle correctly', () => {
    // @ts-ignore
    filterUtils.searchHandleToggle = jest.fn();
    // @ts-ignore
    const instance = renderShallow(component, store).instance();
    const item = { id: 'test' };
    // @ts-ignore
    instance.handleToggle(item);
    expect(filterUtils.searchHandleToggle).toHaveBeenCalledWith(instance, item);
  });

  it('should handleSelectFilter correctly', () => {
    // @ts-ignore
    filterUtils.searchSelectFilter = jest.fn();
    // @ts-ignore
    const instance = renderShallow(component, store).instance();
    const item = { id: 'test' };
    // @ts-ignore
    instance.handleSelectFilter(item);
    expect(filterUtils.searchSelectFilter).toHaveBeenCalledWith(instance, item);
  });
});
