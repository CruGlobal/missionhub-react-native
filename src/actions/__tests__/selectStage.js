import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { updateUserStage, selectPersonStage } from '../selectStage';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { refreshImpact } from '../impact';
import { getPersonDetails } from '../person';

jest.mock('../api');
jest.mock('../impact');
jest.mock('../person');

const mockStore = configureStore([thunk]);
let store;

const myId = '123';
const personId = '456';
const stageId = '5';
const orgId = '23';
const contactAssignmentId = '333';

const updateData = {
  data: {
    type: 'contact_assignment',
    attributes: {
      pathway_stage_id: stageId,
    },
  },
};

const selectData = {
  data: {
    type: 'contact_assignment',
    relationships: {
      person: {
        data: {
          type: 'person',
          id: personId,
        },
      },
      assigned_to: {
        data: {
          type: 'person',
          id: myId,
        },
      },
      organization: {
        data: {
          type: 'organization',
          id: orgId,
        },
      },
      pathway_stage: {
        data: {
          type: 'pathway_stage',
          id: stageId,
        },
      },
    },
  },
};

const apiResponse = {
  type: 'test api',
  response: {
    person: { id: personId },
    organization: { id: orgId },
  },
};
const impactResponse = { type: 'test impact' };
const getPersonResponse = { type: 'test get person' };

callApi.mockReturnValue(() => Promise.resolve(apiResponse));
refreshImpact.mockReturnValue(impactResponse);
getPersonDetails.mockReturnValue(getPersonResponse);

beforeEach(() => {
  store = mockStore();
});

it('updateUserStage', async () => {
  await store.dispatch(updateUserStage(contactAssignmentId, stageId));

  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.UPDATE_CONTACT_ASSIGNMENT,
    { contactAssignmentId },
    updateData,
  );
  expect(store.getActions()).toEqual([impactResponse, getPersonResponse]);
});

it('selectPersonStage', async () => {
  await store.dispatch(selectPersonStage(personId, myId, stageId, orgId));

  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.CREATE_CONTACT_ASSIGNMENT,
    {},
    selectData,
  );
  expect(store.getActions()).toEqual([impactResponse, getPersonResponse]);
});
