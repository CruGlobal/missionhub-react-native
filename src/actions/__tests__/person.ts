/* eslint max-lines: 0 */

import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import MockDate from 'mockdate';

import {
  ACTIONS,
  LOAD_PERSON_DETAILS,
  DELETE_PERSON,
  ORG_PERMISSIONS,
  UPDATE_PERSON_ATTRIBUTES,
} from '../../constants';
import {
  getMe,
  getPersonDetails,
  updateFollowupStatus,
  archiveOrgPermission,
  updatePerson,
  makeAdmin,
  removeAsAdmin,
  updateOrgPermission,
  createContactAssignment,
  deleteContactAssignment,
  getPersonJourneyDetails,
  savePersonNote,
  getPersonNote,
  navToPersonScreen,
} from '../person';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { trackActionWithoutData, setAnalyticsMinistryMode } from '../analytics';
import { navigatePush } from '../navigation';
import { getMyCommunities } from '../organizations';
import {
  CONTACT_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
} from '../../containers/Groups/AssignedPersonScreen/constants';
import { UNASSIGNED_PERSON_SCREEN } from '../../containers/Groups/UnassignedPersonScreen';
import {
  personSelector,
  contactAssignmentSelector,
} from '../../selectors/people';
import { PeopleState } from '../../reducers/people';
import { OrganizationsState } from '../../reducers/organizations';
import { AuthState } from '../../reducers/auth';

jest.mock('../api');
jest.mock('../navigation');
jest.mock('../organizations');
jest.mock('../../selectors/people');
jest.mock('../../selectors/organizations');
jest.mock('../analytics');

const myId = '1';

const mockStore = configureStore([thunk]);
// @ts-ignore
let store;
let auth: AuthState;
let organizations: OrganizationsState;
let people: PeopleState;
const dispatch = jest.fn(response => Promise.resolve(response));
const expectedInclude =
  'email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';
const expectedIncludeWithContactAssignmentPerson =
  'contact_assignments.person,email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

beforeEach(() => {
  auth = { person: { id: myId, user: { groups_feature: true } } } as AuthState;
  organizations = ({ all: [] } as unknown) as OrganizationsState;
  people = { allByOrg: {} };
  store = mockStore({
    auth,
    organizations,
    people,
  });
});

describe('get me', () => {
  const action = { type: 'got me' };
  const setMinistryModeResult = { type: 'set ministry mode' };

  beforeEach(() => {
    (callApi as jest.Mock).mockReturnValue(action);
    (setAnalyticsMinistryMode as jest.Mock).mockReturnValue(
      setMinistryModeResult,
    );
  });

  it('should get me', async () => {
    // @ts-ignore
    await store.dispatch(getMe());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ME, {
      include: expectedInclude,
    });
    expect(setAnalyticsMinistryMode).toHaveBeenCalledWith();
    // @ts-ignore
    expect(store.getActions()).toEqual([action, setMinistryModeResult]);
  });

  it('should add extra include', () => {
    const extraInclude = 'contact_assignments';

    // @ts-ignore
    store.dispatch(getMe(extraInclude));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ME, {
      include: `${expectedInclude},${extraInclude}`,
    });
    // @ts-ignore
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

  const apiResponse = { type: REQUESTS.GET_PERSON.SUCCESS, response: person };

  beforeEach(() => {
    // @ts-ignore
    callApi.mockReturnValue(apiResponse);
  });

  it("should get a person's details", async () => {
    // @ts-ignore
    await store.dispatch(getPersonDetails(person.id, orgId));
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PERSON, {
      person_id: person.id,
      include: expectedIncludeWithContactAssignmentPerson,
    });

    // @ts-ignore
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

  it('should not get person details if no person id', async () => {
    try {
      // @ts-ignore
      await store.dispatch(getPersonDetails(undefined, orgId));
    } catch {
      expect(callApi).not.toHaveBeenCalled();
      // @ts-ignore
      expect(store.getActions()).toEqual([]);
    }
  });
});

describe('updatePerson', () => {
  const updateInclude = expectedIncludeWithContactAssignmentPerson;

  it('should update first name', () => {
    // @ts-ignore
    store.dispatch(
      updatePerson({
        id: 1,
        firstName: 'Test Fname',
      }),
    );

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
    // @ts-ignore
    store.dispatch(
      updatePerson({
        id: 1,
        firstName: 'Test Fname',
        lastName: 'Test Lname',
      }),
    );

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
    // @ts-ignore
    store.dispatch(
      updatePerson({
        id: 1,
        firstName: 'Test Fname',
        userGender: 'Male',
      }),
    );

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

  it('should update email only', () => {
    // @ts-ignore
    store.dispatch(
      updatePerson({
        id: 1,
        email: 'a@a.com',
        emailId: 2,
      }),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: 1, include: updateInclude },
      {
        data: {
          type: 'person',
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

  it('should update phone only', () => {
    // @ts-ignore
    store.dispatch(
      updatePerson({
        id: 1,
        phone: '1234567890',
        phoneId: 3,
      }),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: 1, include: updateInclude },
      {
        data: {
          type: 'person',
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

  it('does not update person if no data', () => {
    // @ts-ignore
    store.dispatch(updatePerson());

    expect(callApi).not.toHaveBeenCalled();

    // @ts-ignore
    expect(store.getActions()).toEqual([
      {
        type: 'UPDATE_PERSON_FAIL',
        error: 'InvalidData',
        data: undefined,
      },
    ]);
  });

  it('does not update person if no person id', () => {
    const data = { id: undefined };

    // @ts-ignore
    store.dispatch(updatePerson(data));

    expect(callApi).not.toHaveBeenCalled();

    // @ts-ignore
    expect(store.getActions()).toEqual([
      {
        type: 'UPDATE_PERSON_FAIL',
        error: 'InvalidData',
        data,
      },
    ]);
  });
});

describe('makeAdmin', () => {
  const personId = '24234234';
  const orgPermissionId = '78978998';

  it('sends a request with org permission level set', async () => {
    (trackActionWithoutData as jest.Mock).mockReturnValue({
      type: 'track action',
    });

    // @ts-ignore
    await store.dispatch(makeAdmin(personId, orgPermissionId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      {
        personId,
        include: expectedIncludeWithContactAssignmentPerson,
      },
      {
        data: {
          type: 'person',
        },
        included: [
          {
            id: orgPermissionId,
            type: 'organizational_permission',
            attributes: {
              permission_id: ORG_PERMISSIONS.ADMIN,
            },
          },
        ],
      },
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.MANAGE_MAKE_ADMIN,
    );
  });
});

describe('removeAsAdmin', () => {
  const personId = '24234234';
  const orgPermissionId = '78978998';

  it('sends a request with org permission level set', async () => {
    (trackActionWithoutData as jest.Mock).mockReturnValue({
      type: 'track action',
    });

    // @ts-ignore
    await store.dispatch(removeAsAdmin(personId, orgPermissionId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      {
        personId,
        include: expectedIncludeWithContactAssignmentPerson,
      },
      {
        data: {
          type: 'person',
        },
        included: [
          {
            id: orgPermissionId,
            type: 'organizational_permission',
            attributes: {
              permission_id: ORG_PERMISSIONS.USER,
            },
          },
        ],
      },
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.MANAGE_REMOVE_ADMIN,
    );
  });
});

describe('updateOrgPermission', () => {
  const personId = '24234234';
  const orgPermissionId = '78978998';
  const permissionLevel = ORG_PERMISSIONS.USER;

  it('sends a request with org permission level set', () => {
    // @ts-ignore
    store.dispatch(
      updateOrgPermission(personId, orgPermissionId, permissionLevel),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      {
        personId,
        include: expectedIncludeWithContactAssignmentPerson,
      },
      {
        data: {
          type: 'person',
        },
        included: [
          {
            id: orgPermissionId,
            type: 'organizational_permission',
            attributes: {
              permission_id: permissionLevel,
            },
          },
        ],
      },
    );
  });
});

describe('archiveOrgPermission', () => {
  const personId = '24234234';
  const orgPermissionId = '78978998';
  const date = '2018-01-01';
  MockDate.set(date);

  it('sends a request with archive_date set', async () => {
    const person = {
      id: personId,
      organizational_permissions: [],
    };

    const callApiResponse = { type: 'call Api', response: person };
    const trackActionResponse = { type: 'track action' };
    const getCommunitiesResponse = { type: 'get my communities' };

    // @ts-ignore
    callApi.mockReturnValue(callApiResponse);
    (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
    // @ts-ignore
    getMyCommunities.mockReturnValue(getCommunitiesResponse);

    // @ts-ignore
    await store.dispatch(archiveOrgPermission(personId, orgPermissionId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      {
        personId,
        include: expectedIncludeWithContactAssignmentPerson,
      },
      {
        data: {
          type: 'person',
        },
        included: [
          {
            id: orgPermissionId,
            type: 'organizational_permission',
            attributes: {
              archive_date: new Date(date).toISOString(),
            },
          },
        ],
      },
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.MANAGE_REMOVE_MEMBER,
    );
    expect(getMyCommunities).toHaveBeenCalledWith();
    // @ts-ignore
    expect(store.getActions()).toEqual([
      callApiResponse,
      {
        type: UPDATE_PERSON_ATTRIBUTES,
        updatedPersonAttributes: {
          email_addresses: undefined,
          first_name: undefined,
          full_name: undefined,
          gender: undefined,
          id: personId,
          last_name: undefined,
          organizational_permissions: [],
          phone_numbers: undefined,
        },
      },
      trackActionResponse,
      getCommunitiesResponse,
    ]);
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
    const trackActionResult = { type: 'track action' };
    (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);

    await updateFollowupStatus(
      { id: 1, type: 'person', organizational_permissions: [] },
      2,
      'uncontacted',
    )(dispatch);

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.STATUS_CHANGED);
  });
});

describe('createContactAssignment', () => {
  it('should send the correct API request', async () => {
    // @ts-ignore
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
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ASSIGNED_TO_ME);
    expect(dispatch).toHaveBeenCalledTimes(3);
  });
});

describe('deleteContactAssignment', () => {
  const personId = '123';
  const personOrgId = '456';
  const contactAssignmentId = 1;

  const query = { contactAssignmentId };

  const data = {
    data: {
      type: 'contact_assignment',
      attributes: { unassignment_reason: '' },
    },
  };

  const callAPIResult = { type: 'call api' };

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
    // @ts-ignore
    expect(store.getActions()).toEqual([callAPIResult, deleteAction]);
  };

  beforeEach(() => {
    (callApi as jest.Mock).mockReturnValue(callAPIResult);
  });

  it('should send the correct API request', async () => {
    // @ts-ignore
    await store.dispatch(deleteContactAssignment(1, personId, personOrgId));

    testDelete();
  });

  it('should send the correct API request with note', async () => {
    const note = 'testNote';
    data.data.attributes.unassignment_reason = note;

    // @ts-ignore
    await store.dispatch(
      deleteContactAssignment(1, personId, personOrgId, note),
    );

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
    // @ts-ignore
    callApi.mockReturnValue(action);
  });

  it('should get me', () => {
    // @ts-ignore
    store.dispatch(getPersonJourneyDetails(userId));

    expect(callApi).toHaveBeenCalledWith(
      // @ts-ignore
      REQUESTS.GET_PERSON_JOURNEY,
      expectedQuery,
    );
    // @ts-ignore
    expect(store.getActions()[0]).toEqual(action);
  });
});

describe('saveNote', () => {
  const personId = 23;
  const note = 'test';
  // @ts-ignore
  let noteId;
  // @ts-ignore
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

      // @ts-ignore
      callApi.mockReturnValue(action);
    });

    it('should add note', () => {
      // @ts-ignore
      store.dispatch(savePersonNote(personId, note, noteId, myId));

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.ADD_PERSON_NOTE,
        {},
        expectedData,
      );
      // @ts-ignore
      expect(store.getActions()[0]).toBe(action);
    });
  });

  describe('UpdatePersonNote', () => {
    beforeEach(() => {
      noteId = 2;
      action = { type: 'updated note' };

      // @ts-ignore
      callApi.mockReturnValue(action);
    });

    it('should update note', () => {
      // @ts-ignore
      store.dispatch(savePersonNote(personId, note, noteId, myId));

      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.UPDATE_PERSON_NOTE,
        // @ts-ignore
        { noteId },
        expectedData,
      );
      // @ts-ignore
      expect(store.getActions()[0]).toBe(action);
    });

    it('should reject note', async () => {
      try {
        // @ts-ignore
        await store.dispatch(savePersonNote(undefined, note, noteId, myId));
      } catch (e) {
        expect(e).toBe(
          'Invalid Data from savePersonNote: no personId passed in',
        );
      }
    });
  });
});

describe('GetPersonNote', () => {
  const personId = 23;

  const expectedQuery = { person_id: personId, include: 'person_notes' };

  beforeEach(() => {
    // @ts-ignore
    callApi.mockReturnValue(() => Promise.resolve());
  });

  it('should get note', () => {
    // @ts-ignore
    store.dispatch(getPersonNote(personId, myId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_PERSON_NOTE,
      expectedQuery,
    );
  });
});

describe('navToPersonScreen', () => {
  const person = { id: '2' };
  const me = { id: myId };
  const organization = { id: '111' };
  const navigatePushResult = { type: 'test' };
  const contactAssignment = {};

  beforeEach(() => {
    (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
    (callApi as jest.Mock).mockReturnValue({});
  });

  // @ts-ignore
  afterEach(() => expect(store.getActions()).toEqual([navigatePushResult]));

  describe('isMe', () => {
    it('navigates to me screen', () => {
      ((personSelector as unknown) as jest.Mock).mockReturnValue(me);

      // @ts-ignore
      store.dispatch(navToPersonScreen(me.id));

      expect(personSelector).toHaveBeenCalledWith(
        // @ts-ignore
        { people },
        { personId: me.id },
      );
      expect(contactAssignmentSelector).toHaveBeenCalledWith(
        // @ts-ignore
        { auth },
        { person: me, orgId: undefined },
      );
      expect(navigatePush).toHaveBeenCalledWith(ME_PERSONAL_PERSON_SCREEN, {
        person: me,
      });
    });
  });

  describe('is not me', () => {
    describe('is not in org', () => {
      beforeEach(() => {
        // @ts-ignore
        personSelector.mockReturnValue(person);
      });

      afterEach(() => {
        expect(personSelector).toHaveBeenCalledWith(
          // @ts-ignore
          { people },
          { personId: person.id },
        );
        expect(contactAssignmentSelector).toHaveBeenCalledWith(
          // @ts-ignore
          { auth },
          { person, orgId: undefined },
        );
      });

      describe('has ContactAssignment', () => {
        it('navigates to contact person screen', () => {
          // @ts-ignore
          contactAssignmentSelector.mockReturnValue(contactAssignment);

          // @ts-ignore
          store.dispatch(navToPersonScreen(person.id));

          expect(navigatePush).toHaveBeenCalledWith(CONTACT_PERSON_SCREEN, {
            person,
          });
        });
      });

      describe('does not have ContactAssignment', () => {
        it('navigates to unassigned person screen', () => {
          // @ts-ignore
          contactAssignmentSelector.mockReturnValue(undefined);

          // @ts-ignore
          store.dispatch(navToPersonScreen(person.id));

          expect(navigatePush).toHaveBeenCalledWith(UNASSIGNED_PERSON_SCREEN, {
            person,
          });
        });
      });
    });
  });

  describe('with extra props', () => {
    // @ts-ignore
    contactAssignmentSelector.mockReturnValue(undefined);
    // @ts-ignore
    personSelector.mockReturnValue(person);

    const onAssign = jest.fn();

    it('includes props in navigation', () => {
      // @ts-ignore
      store.dispatch(navToPersonScreen(person, { onAssign }));

      expect(navigatePush).toHaveBeenCalledWith(UNASSIGNED_PERSON_SCREEN, {
        person,
        onAssign,
      });
    });
  });
});
