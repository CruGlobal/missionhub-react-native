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
const organization = {
  id: '1',
  name: 'Test Org',
  surveys,
};

// @ts-ignore
let store;

// @ts-ignore
navigatePush.mockReturnValue({ type: 'navigated push' });
// @ts-ignore
getOrgSurveysNextPage.mockReturnValue({ type: 'got org surveys next page' });
// @ts-ignore
getOrgSurveys.mockReturnValue({ type: 'got org surveys' });
// @ts-ignore
refreshCommunity.mockReturnValue({ type: 'refreshed community' });

beforeEach(() => {
  store = createThunkStore({
    organizations: {
      all: [organization],
      surveysPagination: { hasNextPage: true },
    },
  });
});

describe('Surveys', () => {
  const component = <Surveys orgId={organization.id} />;

  it('should render correctly', () => {
    // @ts-ignore
    testSnapshotShallow(component, store);
  });

  it('should mount correctly', () => {
    const store = createThunkStore({
      organizations: {
        all: [
          {
            ...organization,
            surveys: [],
          },
        ],
        surveysPagination: { hasNextPage: true },
      },
    });

    const instance = renderShallow(component, store).instance();
    // @ts-ignore
    instance.componentDidMount();
    expect(refreshCommunity).toHaveBeenCalledWith(organization.id);
    expect(getOrgSurveys).toHaveBeenCalledWith(organization.id);
  });

  it('should handleSelect correctly', () => {
    const buildTrackingResult = { name: 'screen name' };
    // @ts-ignore
    common.buildTrackingObj = jest.fn(() => buildTrackingResult);

    // @ts-ignore
    const instance = renderShallow(component, store).instance();
    // @ts-ignore
    instance.handleSelect({ id: '1' });
    expect(navigatePush).toHaveBeenCalled();
  });

  it('should handleLoadMore correctly', () => {
    // @ts-ignore
    const instance = renderShallow(component, store).instance();
    // @ts-ignore
    instance.handleLoadMore();
    expect(getOrgSurveysNextPage).toHaveBeenCalled();
  });

  it('should handleRefresh correctly', () => {
    const refresh = jest.fn();
    // @ts-ignore
    common.refresh = refresh;
    // @ts-ignore
    const instance = renderShallow(component, store).instance();
    // @ts-ignore
    instance.handleRefresh();
    expect(refresh).toHaveBeenCalled();
  });

  it('renders item', () => {
    // @ts-ignore
    const instance = renderShallow(component, store).instance();
    // @ts-ignore
    const renderedItem = instance.renderItem({ item: surveys[0] });
    expect(renderedItem).toMatchSnapshot();
  });

  it('renderHeader match snapshot', () => {
    // @ts-ignore
    const instance = renderShallow(component, store).instance();
    // @ts-ignore
    const header = instance.renderHeader();
    expect(header).toMatchSnapshot();
  });
});
