import organizations from '../../src/reducers/organizations';
import { GET_ORGANIZATION_CONTACTS } from '../../src/constants';

const orgId = '123';
const initialState = {
  all: [{ id: orgId, name: 'test org' }],
};
const contacts = [
  {
    id: '1',
  },
  {
    id: '2',
  },
];

it('should load contacts to an organization', () => {
  const state = organizations(initialState, {
    type: GET_ORGANIZATION_CONTACTS,
    contacts,
    orgId,
  });

  expect(state).toMatchSnapshot();
});
