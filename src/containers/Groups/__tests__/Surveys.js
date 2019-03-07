import React from 'react';

import Surveys from '../Surveys';
import {
  renderShallow,
  createThunkStore,
  testSnapshotShallow,
} from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { getOrgSurveys, getOrgSurveysNextPage } from '../../../actions/surveys';
import { refreshCommunity } from '../../../actions/organizations';
import * as common from '../../../utils/common';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/surveys');
jest.mock('../../../actions/organizations');
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
const store = createThunkStore({
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

navigatePush.mockReturnValue({ type: 'navigated push' });
getOrgSurveysNextPage.mockReturnValue({ type: 'got org surveys next page' });
getOrgSurveys.mockReturnValue({ type: 'got org surveys' });
refreshCommunity.mockReturnValue({ type: 'refreshed community' });

describe('Surveys', () => {
  const component = <Surveys organization={organization} />;

  it('should render correctly', () => {
    testSnapshotShallow(component, store);
  });

  it('should mount correctly', () => {
    const store = createThunkStore({
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
    expect(refreshCommunity).toHaveBeenCalledWith(organization.id);
    expect(getOrgSurveys).toHaveBeenCalledWith(organization.id);
  });

  it('should handleSelect correctly', () => {
    const buildTrackingResult = { name: 'screen name' };
    common.buildTrackingObj.mockReturnValue(buildTrackingResult);

    const instance = renderShallow(component, store).instance();
    instance.handleSelect({ id: '1' });
    expect(navigatePush).toHaveBeenCalled();
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
