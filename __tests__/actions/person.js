import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import {
  ACTIONS,
  LOAD_PERSON_DETAILS,
  DELETE_PERSON,
} from '../../src/constants';
import {
  getMe,
  getPersonDetails,
  updateFollowupStatus,
  updatePerson,
  createContactAssignment,
  deleteContactAssignment,
  getPersonJourneyDetails,
  savePersonNote,
  getPersonNote,
  navToPersonScreen,
} from '../../src/actions/person';
import callApi, { REQUESTS } from '../../src/actions/api';
import * as analytics from '../../src/actions/analytics';
import { navigatePush } from '../../src/actions/navigation';
import { UNASSIGNED_PERSON_SCREEN } from '../../src/containers/Groups/PersonScreen/UnassignedPersonScreen';
import { CONTACT_PERSON_SCREEN } from '../../src/containers/Groups/PersonScreen/PersonScreen';
import { MEMBER_PERSON_SCREEN } from '../../src/containers/Groups/PersonScreen/PersonScreen';

jest.mock('../../src/actions/api');
jest.mock('../../src/actions/navigation');

const store = configureStore([thunk])({});
const dispatch = jest.fn(response => Promise.resolve(response));
const expectedInclude =
  'email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

beforeEach(() => {
  store.clearActions();
  dispatch.mockClear();
  callApi.mockClear();
  navigatePush.mockClear();
});

describe('get me', () => {
  const action = { type: 'got me' };

  beforeEach(() => {
    callApi.mockReturnValue(action);
  });

  it('should get me', () => {
    store.dispatch(getMe());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ME, {
      include: expectedInclude,
    });
    expect(store.getActions()[0]).toEqual(action);
  });

  it('should add extra include', () => {
    const extraInclude = 'contact_assignments';

    store.dispatch(getMe(extraInclude));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ME, {
      include: `${expectedInclude},${extraInclude}`,
    });
    expect(store.getActions()[0]).toEqual(action);
  });
});

describe('getPersonDetails', () => {
  const orgId = '2';
  const org = { id: orgId, name: 'test org' };

  const person = {
    id: '1',
    first_name: 'Test',
    organizational_permissions: [
      {
        organization: org,
        organization_id: orgId,
      },
    ],
  };

  it("should get a person's details", async () => {
    const apiResponse = { type: REQUESTS.GET_PERSON.SUCCESS, response: person };
    callApi.mockReturnValue(apiResponse);

    await store.dispatch(getPersonDetails(person.id, orgId));
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PERSON, {
      person_id: person.id,
      include: expectedInclude,
    });

    expect(store.getActions()).toEqual([
      apiResponse,
      {
        type: LOAD_PERSON_DETAILS,
        person,
        orgId,
        org,
      },
    ]);
  });
});

describe('updatePerson', () => {
  const updateInclude =
    'email_addresses,phone_numbers,reverse_contact_assignments';

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
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: 1, include: updateInclude },
      {
        data: {
          type: 'person',
          attributes: {
            first_name: 'Test Fname',
          },
        },
      },
    );
  });
  it('should update last name', () => {
    updatePerson({
      id: 1,
      firstName: 'Test Fname',
      lastName: 'Test Lname',
    })(dispatch);
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: 1, include: updateInclude },
      {
        data: {
          type: 'person',
          attributes: {
            first_name: 'Test Fname',
            last_name: 'Test Lname',
          },
        },
      },
    );
  });
  it('should update gender', () => {
    updatePerson({
      id: 1,
      firstName: 'Test Fname',
      gender: 'Male',
    })(dispatch);
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: 1, include: updateInclude },
      {
        data: {
          type: 'person',
          attributes: {
            first_name: 'Test Fname',
            gender: 'Male',
          },
        },
      },
    );
  });
  it('should update email', () => {
    updatePerson({
      id: 1,
      firstName: 'Test Fname',
      email: 'a@a.com',
      emailId: 2,
    })(dispatch);
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: 1, include: updateInclude },
      {
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
      },
    );
  });
  it('should update phone', () => {
    updatePerson({
      id: 1,
      firstName: 'Test Fname',
      phone: '1234567890',
      phoneId: 3,
    })(dispatch);
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: 1, include: updateInclude },
      {
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
      },
    );
  });
});

describe('updateFollowupStatus', () => {
  it('should send the correct API request', () => {
    updateFollowupStatus(
      { id: 1, type: 'person', organizational_permissions: [] },
      2,
      'uncontacted',
    )(dispatch);
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      {
        personId: 1,
      },
      {
        data: {
          type: 'person',
        },
        included: [
          {
            id: 2,
            type: 'organizational_permission',
            attributes: {
              followup_status: 'uncontacted',
            },
          },
        ],
      },
    );
    expect(dispatch).toHaveBeenCalled();
  });

  it('should track action', async () => {
    analytics.trackActionWithoutData = jest.fn();

    await updateFollowupStatus(
      { id: 1, type: 'person', organizational_permissions: [] },
      2,
      'uncontacted',
    )(dispatch);

    expect(analytics.trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.STATUS_CHANGED,
    );
  });
});

describe('createContactAssignment', () => {
  it('should send the correct API request', async () => {
    callApi.mockReturnValue({ type: REQUESTS.UPDATE_PERSON });
    await createContactAssignment(1, 2, 3)(dispatch);
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: 3 },
      {
        included: [
          {
            type: 'contact_assignment',
            attributes: {
              assigned_to_id: 2,
              organization_id: 1,
            },
          },
        ],
      },
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
  });
});

describe('deleteContactAssignment', () => {
  const personId = '123';
  const personOrgId = '456';
  const contactAssignmentId = 1;

  const query = { contactAssignmentId };

  let data = {
    data: {
      type: 'contact_assignment',
      attributes: { unassignment_reason: '' },
    },
  };

  const deleteAction = {
    type: DELETE_PERSON,
    personId,
    personOrgId,
  };

  const testDelete = () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.DELETE_CONTACT_ASSIGNMENT,
      query,
      data,
    );
    expect(dispatch).toHaveBeenCalledWith(deleteAction);
  };

  it('should send the correct API request', async () => {
    await deleteContactAssignment(1, personId, personOrgId)(dispatch);

    testDelete();
  });

  it('should send the correct API request with note', async () => {
    const note = 'testNote';
    data.data.attributes.unassignment_reason = note;

    await deleteContactAssignment(1, personId, personOrgId, note)(dispatch);

    testDelete();
  });
});

describe('getPersonJourneyDetails', () => {
  const userId = 1;
  const expectedQuery = {
    person_id: userId,
    include:
      'pathway_progression_audits.old_pathway_stage,pathway_progression_audits.new_pathway_stage,interactions.comment,answer_sheets.answers,answer_sheets.survey.active_survey_elements.question',
  };
  const action = { type: 'got user' };

  beforeEach(() => {
    callApi.mockReturnValue(action);
  });

  it('should get me', () => {
    store.dispatch(getPersonJourneyDetails(userId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_PERSON_JOURNEY,
      expectedQuery,
    );
    expect(store.getActions()[0]).toEqual(action);
  });
});

describe('saveNote', () => {
  const personId = 23;
  const myId = 1;
  const note = 'test';
  let noteId;
  let action;

  const expectedData = {
    data: {
      type: 'person_note',
      attributes: {
        content: note,
      },
      relationships: {
        person: {
          data: {
            type: 'person',
            id: personId,
          },
        },
        user: {
          data: {
            type: 'user',
            id: myId,
          },
        },
      },
    },
  };

  describe('AddPersonNote', () => {
    beforeEach(() => {
      noteId = null;
      action = { type: 'added note' };

      callApi.mockReturnValue(action);
    });

    it('should add note', () => {
      store.dispatch(savePersonNote(personId, note, noteId, myId));

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.ADD_PERSON_NOTE,
        {},
        expectedData,
      );
      expect(store.getActions()[0]).toBe(action);
    });
  });

  describe('UpdatePersonNote', () => {
    beforeEach(() => {
      noteId = 2;
      action = { type: 'updated note' };

      callApi.mockReturnValue(action);
    });

    it('should update note', () => {
      store.dispatch(savePersonNote(personId, note, noteId, myId));

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.UPDATE_PERSON_NOTE,
        { noteId },
        expectedData,
      );
      expect(store.getActions()[0]).toBe(action);
    });
  });
});

describe('GetPersonNote', () => {
  const personId = 23;
  const myId = 1;

  const action = { type: 'got note' };

  const expectedQuery = { person_id: personId, include: 'person_notes' };

  beforeEach(() => {
    callApi.mockReturnValue(action);
  });

  it('should get note', () => {
    store.dispatch(getPersonNote(personId, myId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_PERSON_NOTE,
      expectedQuery,
    );
    expect(store.getActions()[0]).toBe(action);
  });
});

describe('navToPersonScreen', () => {
  const person = { id: '1' };
  const organization = { id: '111' };

  beforeEach(() => {
    navigatePush.mockReturnValue({ type: 'test' });
  });

  it('navigates to unassigned person screen', () => {
    store.dispatch(navToPersonScreen(person, organization, false, false));
    expect(navigatePush).toHaveBeenCalledWith(UNASSIGNED_PERSON_SCREEN, {
      person,
      organization,
    });
  });
  it('navigates to contact person screen', () => {
    store.dispatch(navToPersonScreen(person, organization, false, true));
    expect(navigatePush).toHaveBeenCalledWith(CONTACT_PERSON_SCREEN, {
      person,
      organization,
    });
  });
  it('navigates to member person screen', () => {
    store.dispatch(navToPersonScreen(person, organization, true, false));
    expect(navigatePush).toHaveBeenCalledWith(MEMBER_PERSON_SCREEN, {
      person,
      organization,
    });
  });
});
