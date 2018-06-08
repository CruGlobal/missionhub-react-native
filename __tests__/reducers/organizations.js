import organizations from '../../src/reducers/organizations';
import { REQUESTS } from '../../src/actions/api';
import {
  GET_ORGANIZATION_CONTACTS,
  GET_ORGANIZATIONS_CONTACTS_REPORT,
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
