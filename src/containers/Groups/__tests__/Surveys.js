import React from 'react';

import Surveys from '../Surveys';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
} from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { getOrgSurveys, getOrgSurveysNextPage } from '../../../actions/surveys';
import * as common from '../../../utils/common';
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));
jest.mock('../../../actions/surveys', () => ({
  getOrgSurveys: jest.fn(() => ({ type: 'test' })),
  getOrgSurveysNextPage: jest.fn(() => ({ type: 'test' })),
}));
common.refresh = jest.fn();

const store = createMockStore({
  groups: {
    surveys: [
      {
        id: '1',
        title: 'Test Survey 1',
        contacts_count: 5,
        unassigned_contacts_count: 5,
        uncontacted_contacts_count: 5,
      },
      {
        id: '2',
        title: 'Test Survey 2',
        contacts_count: 5,
        unassigned_contacts_count: 5,
        uncontacted_contacts_count: 5,
      },
      {
        id: '3',
        title: 'Test Survey 3',
        contacts_count: 5,
        unassigned_contacts_count: 5,
        uncontacted_contacts_count: 5,
      },
    ],
    surveysPagination: { hasNextPage: true },
  },
});

const organization = { id: '1', name: 'Test Org' };

describe('Surveys', () => {
  const component = <Surveys organization={organization} />;

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should mount correctly', () => {
    const instance = renderShallow(component, store)
      .dive()
      .dive()
      .dive()
      .instance();
    instance.componentDidMount();
    expect(getOrgSurveys).toHaveBeenCalled();
  });

  it('should handleSelect correctly', () => {
    const instance = renderShallow(component, store)
      .dive()
      .dive()
      .dive()
      .instance();
    instance.handleSelect({ id: '1' });
    expect(navigatePush).toHaveBeenCalled();
  });

  it('should handleLoadMore correctly', () => {
    const instance = renderShallow(component, store)
      .dive()
      .dive()
      .dive()
      .instance();
    instance.handleLoadMore();
    expect(getOrgSurveysNextPage).toHaveBeenCalled();
  });

  it('should handleRefresh correctly', () => {
    const instance = renderShallow(component, store)
      .dive()
      .dive()
      .dive()
      .instance();
    instance.handleRefresh();
    expect(common.refresh).toHaveBeenCalled();
  });
});
