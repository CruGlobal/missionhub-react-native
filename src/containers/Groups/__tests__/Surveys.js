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
jest.mock('../../../utils/common');

const surveys = [
  {
    id: '1',
    created_at: '2018-08-14T17:02:02Z',
    title: 'Test Survey 1',
    contacts_count: 5,
    unassigned_contacts_count: 5,
    uncontacted_contacts_count: 5,
  },
  {
    id: '2',
    created_at: '2018-08-14T17:02:02Z',
    title: 'Test Survey 2',
    contacts_count: 5,
    unassigned_contacts_count: 5,
    uncontacted_contacts_count: 5,
  },
  {
    id: '3',
    created_at: '2018-08-14T17:02:02Z',
    title: 'Test Survey 3',
    contacts_count: 5,
    unassigned_contacts_count: 5,
    uncontacted_contacts_count: 5,
  },
];
const store = createMockStore({
  organizations: {
    all: [
      {
        id: '1',
        surveys,
      },
    ],
    surveysPagination: { hasNextPage: true },
  },
});

const organization = {
  id: '1',
  name: 'Test Org',
};

describe('Surveys', () => {
  const component = <Surveys organization={organization} />;

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should mount correctly', () => {
    const store = createMockStore({
      organizations: {
        all: [
          {
            id: '1',
            surveys: [],
          },
        ],
        surveysPagination: { hasNextPage: true },
      },
    });

    const instance = renderShallow(component, store).instance();
    instance.componentDidMount();
    expect(getOrgSurveys).toHaveBeenCalled();
  });

  it('should handleSelect correctly', () => {
    const buildTrackingResult = { name: 'screen name' };
    common.buildTrackingObj.mockReturnValue(buildTrackingResult);

    const instance = renderShallow(component, store).instance();
    instance.handleSelect({ id: '1' });
    expect(navigatePush).toHaveBeenCalled();
    expect(common.buildTrackingObj).toHaveBeenCalled();
  });

  it('should handleLoadMore correctly', () => {
    const instance = renderShallow(component, store).instance();
    instance.handleLoadMore();
    expect(getOrgSurveysNextPage).toHaveBeenCalled();
  });

  it('should handleRefresh correctly', () => {
    const instance = renderShallow(component, store).instance();
    instance.handleRefresh();
    expect(common.refresh).toHaveBeenCalled();
  });

  it('calls key extractor', () => {
    const instance = renderShallow(component, store).instance();
    const item = { id: '1' };
    const result = instance.keyExtractor(item);
    expect(result).toEqual(item.id);
  });

  it('renders item', () => {
    const instance = renderShallow(component, store).instance();
    const renderedItem = instance.renderItem({ item: surveys[0] });
    expect(renderedItem).toMatchSnapshot();
  });

  it('renderHeader match snapshot', () => {
    const instance = renderShallow(component, store).instance();
    const header = instance.renderHeader();
    expect(header).toMatchSnapshot();
  });
});
