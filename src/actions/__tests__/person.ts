/* eslint-disable max-lines */

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
  archiveOrgPermission,
  updatePerson,
  makeAdmin,
  removeAsAdmin,
  updateOrgPermission,
  deleteContactAssignment,
  savePersonNote,
  getPersonNote,
  navToPersonScreen,
  updatePersonGQL,
} from '../person';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { trackActionWithoutData } from '../analytics';
import { navigatePush } from '../navigation';
import { getMyCommunities } from '../organizations';
import { PeopleState } from '../../reducers/people';
import { OrganizationsState } from '../../reducers/organizations';
import {
  ME_PERSON_TABS,
  PERSON_TABS,
} from '../../containers/PersonScreen/PersonTabs';
import { apolloClient } from '../../apolloClient';
import { GET_PERSON } from '../../containers/AddContactScreen/queries';
import { createThunkStore } from '../../../testUtils';
import { getAuthPerson } from '../../auth/authUtilities';

jest.mock('../api');
jest.mock('../navigation');
jest.mock('../organizations');
jest.mock('../../selectors/organizations');
jest.mock('../analytics');
jest.mock('../../auth/authUtilities');

const myId = '1';
(getAuthPerson as jest.Mock).mockReturnValue({ id: myId });
const personId = '2';
const contactAssignmentId = '3';

const expectedInclude =
  'email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';
const expectedIncludeWithContactAssignmentPerson =
  'contact_assignments.person,email_addresses,phone_numbers,organizational_permissions.organization,reverse_contact_assignments,user';

const mePerson = { id: myId, user: { groups_feature: true } };
const person = {
  id: personId,
  reverse_contact_assignments: [
    { id: contactAssignmentId, assigned_to: { id: myId } },
  ],
};

const organizations = ({
  all: [],
} as unknown) as OrganizationsState;
const people: PeopleState = {
  people: {
    [myId]: mePerson,
    [personId]: person,
  },
};
const store = createThunkStore({
  organizations,
  people,
});

beforeEach(() => {
  store.clearActions();
});

describe('get me', () => {
  const action = { type: 'got me' };

  beforeEach(() => {
    (callApi as jest.Mock).mockReturnValue(action);
  });

  it('should get me', async () => {
    // @ts-ignore
    await store.dispatch(getMe());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ME, {
      include: expectedInclude,
    });
    // @ts-ignore
    expect(store.getActions()).toEqual([action]);
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
      },
    ]);
  });

  it('should not get person details if no person id', async () => {
    await expect(
      // @ts-ignore
      store.dispatch(getPersonDetails(undefined, orgId)),
    ).rejects.toEqual(
      'Invalid Data from getPersonDetails: no personId passed in',
    );
    expect(callApi).not.toHaveBeenCalled();
    // @ts-ignore
    expect(store.getActions()).toEqual([]);
  });
});

describe('updatePerson', () => {
  const updateInclude = expectedIncludeWithContactAssignmentPerson;

  it('should update first name', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch<any>(
      updatePerson({
        id: '1',
        firstName: 'Test Fname',
      }),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: '1', include: updateInclude },
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch<any>(
      updatePerson({
        id: '1',
        firstName: 'Test Fname',
        lastName: 'Test Lname',
      }),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: '1', include: updateInclude },
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch<any>(
      updatePerson({
        id: '1',
        firstName: 'Test Fname',
        userGender: 'Male',
      }),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: '1', include: updateInclude },
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch<any>(
      updatePerson({
        id: '1',
        email: 'a@a.com',
        emailId: '2',
      }),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      { personId: '1', include: updateInclude },
      {
        data: {
          type: 'person',
        },
        included: [
          {
            id: '2',
            type: 'email',
            attributes: { email: 'a@a.com' },
          },
        ],
      },
    );
  });

  it('should update phone only', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch<any>(
      updatePerson({
        id: '1',
        phone: '1234567890',
        phoneId: '3',
      }),
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_PERSON,
      {
        personId: '1',
        include: updateInclude,
      },
      {
        data: {
          type: 'person',
        },
        included: [
          {
            id: '3',
            type: 'phone_number',
            attributes: {
              number: '1234567890',
            },
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch<any>(
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

describe('deleteContactAssignment', () => {
  const query = { contactAssignmentId };

  const callAPIResult = { type: 'call api' };

  const deleteAction = {
    type: DELETE_PERSON,
    personId,
  };

  const testDelete = () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.DELETE_CONTACT_ASSIGNMENT,
      query,
    );
    // @ts-ignore
    expect(store.getActions()).toEqual([callAPIResult, deleteAction]);
  };

  beforeEach(() => {
    (callApi as jest.Mock).mockReturnValue(callAPIResult);
  });

  it('should send the correct API request', async () => {
    // @ts-ignore
    await store.dispatch(deleteContactAssignment(personId));

    testDelete();
    expect.hasAssertions();
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
      await expect(
        // @ts-ignore
        store.dispatch(savePersonNote(undefined, note, noteId, myId)),
      ).rejects.toEqual(
        'Invalid Data from savePersonNote: no personId passed in',
      );
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
  const navigatePushResult = { type: 'test' };

  beforeEach(() => {
    (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  });

  // @ts-ignore
  afterEach(() => expect(store.getActions()).toEqual([navigatePushResult]));

  describe('isMe', () => {
    it('navigates to me screen', () => {
      // @ts-ignore
      store.dispatch(navToPersonScreen(me.id));

      expect(navigatePush).toHaveBeenCalledWith(ME_PERSON_TABS, {
        personId: me.id,
      });
    });
  });

  describe('is not me', () => {
    it('navigates to contact person screen', () => {
      // @ts-ignore
      store.dispatch(navToPersonScreen(person.id));

      expect(navigatePush).toHaveBeenCalledWith(PERSON_TABS, {
        personId: person.id,
      });
    });
  });
});

describe('updatePersonGQL', () => {
  it('queries for person updates', () => {
    apolloClient.query = jest.fn();
    const id = '2';

    updatePersonGQL(id);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_PERSON,
      variables: { id },
    });
  });
});
