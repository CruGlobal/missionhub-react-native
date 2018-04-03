import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { updateUserStage, selectPersonStage } from '../../src/actions/selectStage';
import callApi, { REQUESTS } from '../../src/actions/api';
import { getMyImpact, getGlobalImpact } from '../../src/actions/impact';
jest.mock('../../src/actions/api');
jest.mock('../../src/actions/impact');

const mockStore = configureStore([ thunk ]);
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

callApi.mockReturnValue(() => Promise.resolve({ type: 'test api' }));
getMyImpact.mockReturnValue({ type: 'test my impact' });
getGlobalImpact.mockReturnValue({ type: 'test global impact' });


beforeEach(() => {
  callApi.mockClear();
  store = mockStore();
});

it('updateUserStage', async() => {
  await store.dispatch(updateUserStage(contactAssignmentId, stageId));

  expect(callApi).toHaveBeenCalledWith(REQUESTS.UPDATE_CONTACT_ASSIGNMENT, { contactAssignmentId }, updateData);
  expect(store.getActions()).toEqual([
    { type: 'test my impact' },
    { type: 'test global impact' },
  ]);
});

it('selectPersonStage', async() => {
  await store.dispatch(selectPersonStage(personId, myId, stageId, orgId));

  expect(callApi).toHaveBeenCalledWith(REQUESTS.CREATE_CONTACT_ASSIGNMENT, {}, selectData);
  expect(store.getActions()).toEqual([
    { type: 'test my impact' },
    { type: 'test global impact' },
  ]);
});

