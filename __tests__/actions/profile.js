import { firstNameChanged, lastNameChanged, createMyPerson, createPerson, setVisiblePersonInfo, updateVisiblePersonInfo, fetchVisiblePersonInfo, updatePerson, deleteContactAssignment } from '../../src/actions/profile';
import { FIRST_NAME_CHANGED, LAST_NAME_CHANGED, SET_VISIBLE_PERSON_INFO, UPDATE_VISIBLE_PERSON_INFO } from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';
import callApi from '../../src/actions/api';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
jest.mock('../../src/actions/api');

const mockStore = configureStore([ thunk ]);
let store;
const dispatch = jest.fn((response) => Promise.resolve(response));

beforeEach(() => {
  store = mockStore({});
  dispatch.mockClear();
  callApi.mockClear();
});

describe('firstNameChanged', () => {
  it('should return the correct action', () => {
    expect(firstNameChanged('test')).toEqual({
      type: FIRST_NAME_CHANGED,
      firstName: 'test',
    });
  });
});

describe('lastNameChanged', () => {
  it('should return the correct action', () => {
    expect(lastNameChanged('test')).toEqual({
      type: LAST_NAME_CHANGED,
      lastName: 'test',
    });
  });
});

describe('createMyPerson', () => {
  it('should send the correct API request', () => {
    createMyPerson('Roger', 'Goers')(dispatch);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.CREATE_MY_PERSON, {}, {
      code: expect.any(String),
      first_name: 'Roger',
      last_name: 'Goers',
    });
    expect(dispatch).toHaveBeenCalled();
  });
});

describe('createPerson', () => {
  it('should send the correct API request', () => {
    createPerson('Roger', 'Goers')(dispatch);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.ADD_NEW_PERSON, {}, {
      data: {
        type: 'person',
        attributes: {
          first_name: 'Roger',
          last_name: 'Goers',
        },
      },
    });
    expect(dispatch).toHaveBeenCalled();
  });
});

describe('setVisiblePersonInfo', () => {
  it('should return the correct action', () => {
    expect(setVisiblePersonInfo('test')).toEqual({
      type: SET_VISIBLE_PERSON_INFO,
      data: 'test',
    });
  });
});

describe('updateVisiblePersonInfo', () => {
  it('should return the correct action', () => {
    expect(updateVisiblePersonInfo('test')).toEqual({
      type: UPDATE_VISIBLE_PERSON_INFO,
      data: 'test',
    });
  });
});

describe('fetchVisiblePersonInfo', () => {
  it('should update the visible person info with API data', async() => {
    await testFetchVisiblePersonInfo({
      currentUserId: 1,
      personId: 2,
      contactAssignmentId: 3,
      pathwayStageId: '4',
      preloadedStages: [],
    });
  });

  it('should update the visible person info with API data when editing current user', async() => {
    await testFetchVisiblePersonInfo({
      currentUserId: 2,
      personId: 2,
      contactAssignmentId: 3,
      pathwayStageId: '4',
      preloadedStages: [],
    });
  });
  it('should update the visible person info with API data with preloaded stages', async() => {
    await testFetchVisiblePersonInfo({
      currentUserId: 1,
      personId: 2,
      contactAssignmentId: 3,
      pathwayStageId: '4',
      preloadedStages: [ {
        id: '4',
        name: 'Preloaded Stage',
      } ],
    });
  });

  async function testFetchVisiblePersonInfo(testData) {
    const personIsCurrentUser = testData.currentUserId === testData.personId;

    // getPersonDetails request
    callApi.mockReturnValueOnce(() => Promise.resolve({
      find: (type, id) => {
        switch (type) {
          case 'person':
            expect(id).toEqual(testData.personId);
            return {
              id: id,
              first_name: 'Test Fname',
            };
          default:
            throw 'Unknown JsonApi type';
        }
      },
      findAll: (type) => {
        switch (type) {
          case 'contact_assignment':
            expect(personIsCurrentUser).toEqual(false);
            return [
              {
                id: testData.contactAssignmentId,
                assigned_to: {
                  id: 1,
                },
                pathway_stage_id: testData.pathwayStageId,
              },
            ];
          case 'user':
            expect(personIsCurrentUser).toEqual(true);
            return [
              {
                pathway_stage_id: testData.pathwayStageId,
              },
            ];
          default:
            throw 'Unknown JsonApi type';
        }
      },
    }));

    // getStages request
    callApi.mockReturnValueOnce(() => Promise.resolve({
      findAll: (type) => {
        switch (type) {
          case 'pathway_stage':
            return [
              {
                id: testData.pathwayStageId,
                name: 'Uninterested',
              },
            ];
          default:
            throw 'Unknown JsonApi type';
        }
      },
    }));
    expect(await fetchVisiblePersonInfo(testData.personId, testData.currentUserId, personIsCurrentUser, testData.preloadedStages)(store.dispatch)).toEqual({
      type: UPDATE_VISIBLE_PERSON_INFO,
      data: {
        person: {
          id: testData.personId,
          first_name: 'Test Fname',
        },
        contactAssignmentId: personIsCurrentUser ? null : testData.contactAssignmentId,
        contactStage: testData.preloadedStages.length ?
          testData.preloadedStages[0] :
          {
            id: testData.pathwayStageId,
            name: 'Uninterested',
          },
      },
    });
  }
});

describe('updatePerson', () => {
  afterEach(() => {
    expect(dispatch).toHaveBeenCalled();
  });

  it('should throw an error if no first name', () => {
    updatePerson({
      id: 1,
      lastName: 'Test Lname',
    })(dispatch);
    expect(callApi).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: 'UPDATE_PERSON_FAIL',
      error: 'InvalidData',
      data: {
        id: 1,
        lastName: 'Test Lname',
      },
    });
  });

  it('should update first name', () => {
    updatePerson({
      id: 1,
      firstName: 'Test Fname',
    })(dispatch);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.UPDATE_PERSON, { personId: 1 }, {
      data: {
        type: 'person',
        attributes: {
          first_name: 'Test Fname',
        },
      },
    });
  });
  it('should update last name', () => {
    updatePerson({
      id: 1,
      firstName: 'Test Fname',
      lastName: 'Test Lname',
    })(dispatch);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.UPDATE_PERSON, { personId: 1 }, {
      data: {
        type: 'person',
        attributes: {
          first_name: 'Test Fname',
          last_name: 'Test Lname',
        },
      },
    });
  });
  it('should update gender', () => {
    updatePerson({
      id: 1,
      firstName: 'Test Fname',
      gender: 'Male',
    })(dispatch);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.UPDATE_PERSON, { personId: 1 }, {
      data: {
        type: 'person',
        attributes: {
          first_name: 'Test Fname',
          gender: 'Male',
        },
      },
    });
  });
  it('should update email', () => {
    updatePerson({
      id: 1,
      firstName: 'Test Fname',
      email: 'a@a.com',
      emailId: 2,
    })(dispatch);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.UPDATE_PERSON, { personId: 1 }, {
      data: {
        type: 'person',
        attributes: {
          first_name: 'Test Fname',
        },
      },
      included: [
        {
          id: 2,
          type: 'email',
          attributes: { email: 'a@a.com' },
        },
      ],
    });
  });
  it('should update phone', () => {
    updatePerson({
      id: 1,
      firstName: 'Test Fname',
      phone: '1234567890',
      phoneId: 3,
    })(dispatch);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.UPDATE_PERSON, { personId: 1 }, {
      data: {
        type: 'person',
        attributes: {
          first_name: 'Test Fname',
        },
      },
      included: [
        {
          id: 3,
          type: 'phone_number',
          attributes: { number: '1234567890' },
        },
      ],
    });
  });
});

describe('deleteContactAssignment', () => {
  it('should send the correct API request', () => {
    deleteContactAssignment(1)(dispatch);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.DELETE_CONTACT_ASSIGNMENT, {
      contactAssignmentId: 1,
    });
    expect(dispatch).toHaveBeenCalled();
  });
});
