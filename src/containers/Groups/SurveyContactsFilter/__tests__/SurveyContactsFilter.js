import React from 'react';

import SurveyContactsFilter from '..';

import {
  createMockStore,
  renderShallow,
  testSnapshotShallow,
  createMockNavState,
} from '../../../../../testUtils';
import { navigatePush } from '../../../../actions/navigation';
import * as filterUtils from '../../../../utils/filters';

jest.mock('../../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../../actions/surveys', () => ({
  getSurveyQuestions: jest.fn(() => ({
    type: 'surveyQuestions',
    response: [{ id: '1' }, { id: '2' }],
  })),
}));
jest.mock('../../../../actions/labels', () => ({
  getOrgLabels: jest.fn(() => ({
    type: 'orgLabels',
    response: [{ id: '3' }, { id: '4' }],
  })),
}));

const store = createMockStore({});
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
    testSnapshotShallow(component, store);
  });

  it('should handleDrillDown correctly', () => {
    const instance = renderShallow(component, store).instance();
    const options = [{ id: 'o1' }, { id: 'o2' }];
    instance.handleDrillDown({ id: '1', options });

    expect(navigatePush).toHaveBeenCalled();
    expect(instance.state.selectedFilterId).toBe('1');
  });

  it('should handleToggle correctly', () => {
    filterUtils.searchHandleToggle = jest.fn();
    const instance = renderShallow(component, store).instance();
    const item = { id: 'test' };
    instance.handleToggle(item);
    expect(filterUtils.searchHandleToggle).toHaveBeenCalledWith(instance, item);
  });

  it('should handleSelectFilter correctly', () => {
    filterUtils.searchSelectFilter = jest.fn();
    const instance = renderShallow(component, store).instance();
    const item = { id: 'test' };
    instance.handleSelectFilter(item);
    expect(filterUtils.searchSelectFilter).toHaveBeenCalledWith(instance, item);
  });
});
