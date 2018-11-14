import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import MockDate from 'mockdate';

import {
  ACTIONS,
  LOAD_PERSON_DETAILS,
  DELETE_PERSON,
  ORG_PERMISSIONS,
} from '../../constants';
import {
  getMe,
  getPersonDetails,
  updateFollowupStatus,
  archiveOrgPermission,
  updatePerson,
  createContactAssignment,
  deleteContactAssignment,
  getPersonJourneyDetails,
  savePersonNote,
  getPersonNote,
  navToPersonScreen,
} from '../person';
import callApi, { REQUESTS } from '../api';
import * as analytics from '../analytics';
import { navigatePush } from '../navigation';
import {
  CONTACT_PERSON_SCREEN,
  IS_USER_CREATED_MEMBER_PERSON_SCREEN,
  IS_GROUPS_MEMBER_PERSON_SCREEN,
  MEMBER_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
  IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
  ME_COMMUNITY_PERSON_SCREEN,
} from '../../containers/Groups/AssignedPersonScreen';
import { UNASSIGNED_PERSON_SCREEN } from '../../containers/Groups/UnassignedPersonScreen';
import {
  personSelector,
  orgPermissionSelector,
  contactAssignmentSelector,
} from '../../selectors/people';
import { organizationSelector } from '../../selectors/organizations';

jest.mock('../api');
jest.mock('../navigation');
jest.mock('../../selectors/people');
jest.mock('../../selectors/organizations');

const myId = '1';

const mockStore = configureStore([thunk]);
let store;
let auth;
let organizations;
let people;
const dispatch = jest.fn(response => Promise.resolve(response));
const expectedInclude =
  'email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';
const expectedIncludeWithContactAssignmentPerson =
  'contact_assignments.person,email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

beforeEach(() => {
  auth = { person: { id: myId, user: { groups_feature: true } } };
  organizations = { all: {} };
  people = { allByOrg: {} };
  store = mockStore({
    auth,
    organizations,
    people,
  });
  jest.clearAllMocks();
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
      include: expectedIncludeWithContactAssignmentPerson,
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
  const updateInclude = expectedIncludeWithContactAssignmentPerson;

  afterEach(() => {
    expect(dispatch).toHaveBeenCalled();
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
  it('should update email only', () => {
    updatePerson({
      id: 1,
      email: 'a@a.com',
      emailId: 2,
    })(dispatch);
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
    updatePerson({
      id: 1,
      phone: '1234567890',
      phoneId: 3,
    })(dispatch);
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
});

describe('archiveOrgPermission', () => {
  const personId = '24234234';
  const orgPermissionId = '78978998';
  const date = '2018-01-01';
  MockDate.set(date);

  it('sends a request with archive_date set', () => {
    store.dispatch(archiveOrgPermission(personId, orgPermissionId));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      {
        personId: personId,
        include:
          'contact_assignments.person,email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user',
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
    expect(analytics.trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ASSIGNED_TO_ME,
    );
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

    it('should reject note', async () => {
      try {
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
  const person = { id: '2' };
  const me = { id: myId };
  const organization = { id: '111' };
  const navigatePushResult = { type: 'test' };
  const contactAssignment = {};

  beforeEach(() => {
    navigatePush.mockReturnValue(navigatePushResult);
    callApi.mockReturnValue({});
  });

  afterEach(() => expect(store.getActions()).toEqual([navigatePushResult]));

  describe('isMe', () => {
    describe('isMember', () => {
      beforeEach(() => {
        orgPermissionSelector.mockReturnValue({
          permission_id: ORG_PERMISSIONS.ADMIN,
        });
        organizationSelector.mockReturnValue(organization);
        personSelector.mockReturnValue(me);
      });

      afterEach(() => {
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId: organization.id },
        );
        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { orgId: organization.id, personId: me.id },
        );
        expect(orgPermissionSelector).toHaveBeenCalledWith(null, {
          person: me,
          organization,
        });
        expect(contactAssignmentSelector).toHaveBeenCalledWith(
          { auth },
          { person: me, orgId: organization.id },
        );
      });

      describe('isGroups', () => {
        it('navigates to groups community me screen', () => {
          store.dispatch(navToPersonScreen(me, organization));

          expect(navigatePush).toHaveBeenCalledWith(
            IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
            {
              person: me,
              organization,
            },
          );
        });
      });

      describe('is not Groups', () => {
        it('navigates to non-groups community me screen', () => {
          auth = { person: { id: myId, user: { groups_feature: false } } };
          store = mockStore({
            auth,
            organizations,
            people,
          });

          store.dispatch(navToPersonScreen(me, organization));

          expect(navigatePush).toHaveBeenCalledWith(
            ME_COMMUNITY_PERSON_SCREEN,
            {
              person: me,
              organization,
            },
          );
        });
      });
    });

    describe('is not in org', () => {
      it('navigates to me screen', () => {
        orgPermissionSelector.mockReturnValue(undefined);
        organizationSelector.mockReturnValue(undefined);
        personSelector.mockReturnValue(me);

        store.dispatch(navToPersonScreen(me, undefined));

        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId: undefined },
        );
        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { orgId: undefined, personId: me.id },
        );
        expect(orgPermissionSelector).toHaveBeenCalledWith(null, {
          person: me,
          organization: {},
        });
        expect(contactAssignmentSelector).toHaveBeenCalledWith(
          { auth },
          { person: me, orgId: undefined },
        );
        expect(navigatePush).toHaveBeenCalledWith(ME_PERSONAL_PERSON_SCREEN, {
          person: me,
          organization: {},
        });
      });
    });
  });

  describe('is not me', () => {
    describe('isMember', () => {
      beforeEach(() => {
        orgPermissionSelector.mockReturnValue({
          permission_id: ORG_PERMISSIONS.USER,
        });
        contactAssignmentSelector.mockReturnValue(undefined);
        organizationSelector.mockReturnValue(organization);
        personSelector.mockReturnValue(person);
      });

      const testResult = (route, testPerson, testOrg) => {
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId: testOrg.id },
        );
        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { orgId: testOrg.id, personId: testPerson.id },
        );
        expect(orgPermissionSelector).toHaveBeenCalledWith(null, {
          person: testPerson,
          organization: testOrg,
        });
        expect(contactAssignmentSelector).toHaveBeenCalledWith(
          { auth },
          { person: testPerson, orgId: testOrg.id },
        );
        expect(navigatePush).toHaveBeenCalledWith(route, {
          person: testPerson,
          organization: testOrg,
        });
      };

      describe('isUserCreatedOrg', () => {
        it('navigates to user created member person screen', () => {
          const userCreatedOrg = { ...organization, user_created: true };
          organizationSelector.mockReturnValue(userCreatedOrg);

          store.dispatch(navToPersonScreen(person, userCreatedOrg));

          testResult(
            IS_USER_CREATED_MEMBER_PERSON_SCREEN,
            person,
            userCreatedOrg,
          );
        });
      });

      describe('isGroups', () => {
        it('navigates to groups member person screen', () => {
          store.dispatch(navToPersonScreen(person, organization));

          testResult(IS_GROUPS_MEMBER_PERSON_SCREEN, person, organization);
        });
      });

      describe('is not Groups', () => {
        it('navigates to non-groups member person screen', () => {
          auth = { person: { id: myId, user: { groups_feature: false } } };
          store = mockStore({
            auth,
            organizations,
            people,
          });

          store.dispatch(navToPersonScreen(person, organization));

          testResult(MEMBER_PERSON_SCREEN, person, organization);
        });
      });
    });

    describe('is not in org', () => {
      beforeEach(() => {
        orgPermissionSelector.mockReturnValue(undefined);
        organizationSelector.mockReturnValue(undefined);
        personSelector.mockReturnValue(person);
      });

      afterEach(() => {
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId: undefined },
        );
        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { orgId: undefined, personId: person.id },
        );
        expect(orgPermissionSelector).toHaveBeenCalledWith(null, {
          person,
          organization: {},
        });
        expect(contactAssignmentSelector).toHaveBeenCalledWith(
          { auth },
          { person, orgId: undefined },
        );
      });

      describe('has ContactAssignment', () => {
        it('navigates to contact person screen', () => {
          contactAssignmentSelector.mockReturnValue(contactAssignment);

          store.dispatch(navToPersonScreen(person, undefined));

          expect(navigatePush).toHaveBeenCalledWith(CONTACT_PERSON_SCREEN, {
            person,
            organization: {},
          });
        });
      });

      describe('does not have ContactAssignment', () => {
        it('navigates to unassigned person screen', () => {
          contactAssignmentSelector.mockReturnValue(undefined);

          store.dispatch(navToPersonScreen(person, undefined));

          expect(navigatePush).toHaveBeenCalledWith(UNASSIGNED_PERSON_SCREEN, {
            person,
            organization: {},
          });
        });
      });
    });

    describe('is in org but not a Member', () => {
      beforeEach(() => {
        orgPermissionSelector.mockReturnValue({
          permission_id: ORG_PERMISSIONS.CONTACT,
        });
        organizationSelector.mockReturnValue(organization);
        personSelector.mockReturnValue(person);
      });

      afterEach(() => {
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId: organization.id },
        );
        expect(personSelector).toHaveBeenCalledWith(
          { people },
          { orgId: organization.id, personId: person.id },
        );
        expect(orgPermissionSelector).toHaveBeenCalledWith(null, {
          person,
          organization,
        });
        expect(contactAssignmentSelector).toHaveBeenCalledWith(
          { auth },
          { person, orgId: organization.id },
        );
      });

      describe('has ContactAssignment', () => {
        it('navigates to contact person screen', () => {
          contactAssignmentSelector.mockReturnValue(contactAssignment);

          store.dispatch(navToPersonScreen(person, organization));

          expect(navigatePush).toHaveBeenCalledWith(CONTACT_PERSON_SCREEN, {
            person,
            organization: { id: organization.id },
          });
        });
      });

      describe('does not have ContactAssignment', () => {
        it('navigates to unassigned person screen', () => {
          contactAssignmentSelector.mockReturnValue(undefined);

          store.dispatch(navToPersonScreen(person, organization));

          expect(navigatePush).toHaveBeenCalledWith(UNASSIGNED_PERSON_SCREEN, {
            person,
            organization,
          });
        });
      });
    });
  });

  describe('with extra props', () => {
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.CONTACT,
    });
    contactAssignmentSelector.mockReturnValue(undefined);
    organizationSelector.mockReturnValue(organization);
    personSelector.mockReturnValue(person);

    const onAssign = jest.fn();

    it('includes props in navigation', () => {
      store.dispatch(navToPersonScreen(person, organization, { onAssign }));

      expect(navigatePush).toHaveBeenCalledWith(UNASSIGNED_PERSON_SCREEN, {
        person,
        organization,
        onAssign,
      });
    });
  });
});
