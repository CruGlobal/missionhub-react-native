import organizations from '../../src/reducers/organizations';
import { REQUESTS } from '../../src/actions/api';
import {
  GET_ORGANIZATION_CONTACTS,
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_SURVEYS,
} from '../../src/constants';

const org1Id = '123';
const org2Id = '234';
const initialState = {
  all: [{ id: org1Id, name: 'test org 1' }, { id: org2Id, name: 'test org 2' }],
};
const contacts = [
  {
    id: '1',
  },
  {
    id: '2',
  },
];

const reports = [
  {
    id: org1Id,
    contactsCount: 12,
    unassignedCount: 10,
    uncontactedCount: 10,
  },
  {
    id: org2Id,
    contactsCount: 23,
    unassignedCount: 10,
    uncontactedCount: 14,
  },
];

it('should load contacts to an organization', () => {
  const state = organizations(initialState, {
    type: GET_ORGANIZATION_CONTACTS,
    contacts,
    orgId: org1Id,
  });

  expect(state).toMatchSnapshot();
});

it('should load contact reports for all organizations', () => {
  const state = organizations(initialState, {
    type: GET_ORGANIZATIONS_CONTACTS_REPORT,
    reports,
  });

  expect(state).toMatchSnapshot();
});

it('loads surveys for org with paging', () => {
  const orgId = '1';
  const oldSurveys = [
    { id: '1', title: 'Title 1' },
    { id: '2', title: 'Title 2' },
    { id: '3', title: 'Title 3' },
    { id: '4', title: 'Title 4' },
    { id: '5', title: 'Title 5' },
    { id: '6', title: 'Title 6' },
    { id: '7', title: 'Title 7' },
    { id: '8', title: 'Title 8' },
    { id: '9', title: 'Title 9' },
    { id: '10', title: 'Title 10' },
    { id: '11', title: 'Title 11' },
    { id: '12', title: 'Title 12' },
    { id: '13', title: 'Title 13' },
    { id: '14', title: 'Title 14' },
    { id: '15', title: 'Title 15' },
    { id: '16', title: 'Title 16' },
    { id: '17', title: 'Title 17' },
    { id: '18', title: 'Title 18' },
    { id: '19', title: 'Title 19' },
    { id: '20', title: 'Title 20' },
    { id: '21', title: 'Title 21' },
    { id: '22', title: 'Title 22' },
    { id: '23', title: 'Title 23' },
    { id: '24', title: 'Title 24' },
  ];
  const newSurveys = [
    { id: '25', title: 'Title 25' },
    { id: '26', title: 'Title 26' },
    { id: '27', title: 'Title 27' },
  ];

  const state = organizations(
    {
      all: [
        {
          id: orgId,
          surveys: oldSurveys,
        },
      ],
      surveysPagination: {
        hasNextPage: true,
        page: 1,
      },
    },
    {
      type: GET_ORGANIZATION_SURVEYS,
      orgId: orgId,
      query: {
        page: {
          limit: 25,
          offset: 25,
        },
        organization_id: orgId,
      },
      meta: {
        total: 28,
      },
      surveys: newSurveys,
    },
  );

  expect(state.surveysPagination).toEqual({ hasNextPage: false, page: 2 });
});
