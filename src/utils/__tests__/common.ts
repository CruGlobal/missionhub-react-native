/* eslint max-lines: 0 */

import { DrawerActions } from 'react-navigation-drawer';
import Config from 'react-native-config';

import {
  buildTrackingObj,
  userIsJean,
  orgIsPersonalMinistry,
  orgIsUserCreated,
  orgIsCru,
  hasOrgPermissions,
  isAdminOrOwner,
  isOwner,
  openMainMenu,
  getIconName,
  shuffleArray,
  getPagination,
  showAssignButton,
  showUnassignButton,
  showDeleteButton,
  getAssignedByName,
  getAssignedToName,
  getPersonPhoneNumber,
  getPersonEmailAddress,
  getStageIndex,
  getFirstNameAndLastInitial,
  getCommunityUrl,
  keyExtractorId,
  isAdmin,
  orgIsGlobal,
  shouldQueryReportedComments,
} from '../common';
import {
  MAIN_MENU_DRAWER,
  DEFAULT_PAGE_LIMIT,
  ACCEPTED_STEP,
  GLOBAL_COMMUNITY_ID,
} from '../../constants';
import { createThunkStore } from '../../../testUtils';

jest.mock('react-navigation-drawer', () => ({
  DrawerActions: {
    openDrawer: jest.fn(),
  },
}));

const id = '123';
const first_name = 'Roger';

describe('buildTrackingObj', () => {
  const name = 'screen name';
  const section = 'section';
  const subsection = 'subsection';
  const level3 = 'level3';
  const level4 = 'level4';

  expect(buildTrackingObj(name, section, subsection, level3, level4)).toEqual({
    name,
    section,
    subsection,
    level3,
    level4,
  });
});

describe('userIsJean', () => {
  const caseyPermissions = [
    { id: '1', organization: { id: '1', user_created: true } },
  ];
  const jeanPermissions = [
    ...caseyPermissions,
    { id: '2', organization: { id: '2', user_created: false } },
  ];
  it('should return false for Casey', () => {
    expect(userIsJean(caseyPermissions)).toEqual(false);
  });
  it('should return true for Jean', () => {
    expect(userIsJean(jeanPermissions)).toEqual(true);
  });
});

describe('orgIsPersonalMinistry', () => {
  it('returns true for empty org', () => {
    expect(orgIsPersonalMinistry({})).toEqual(true);
  });
  it('returns true for personal ministry', () => {
    expect(orgIsPersonalMinistry({ id: 'personal' })).toEqual(true);
  });
  it('returns false for user-created community', () => {
    expect(orgIsPersonalMinistry({ id: '1', user_created: true })).toEqual(
      false,
    );
  });
  it('returns false for cru community', () => {
    expect(orgIsPersonalMinistry({ id: '1', user_created: false })).toEqual(
      false,
    );
  });
});

describe('orgIsUserCreated', () => {
  it('returns false for empty org', () => {
    expect(orgIsUserCreated({})).toEqual(false);
  });
  it('returns false for personal ministry', () => {
    expect(orgIsUserCreated({ id: 'personal' })).toEqual(false);
  });
  it('returns true for user_created community', () => {
    expect(orgIsUserCreated({ id: '1', user_created: true })).toEqual(true);
  });
  it('returns true for userCreated community', () => {
    expect(orgIsUserCreated({ id: '1', userCreated: true })).toEqual(true);
  });
  it('returns false for cru community', () => {
    expect(orgIsUserCreated({ id: '1', user_created: false })).toEqual(false);
  });
});

describe('orgIsCru', () => {
  it('returns false for empty org', () => {
    expect(orgIsCru({})).toEqual(false);
  });
  it('returns false for personal ministry', () => {
    expect(orgIsCru({ id: 'personal' })).toEqual(false);
  });
  it('returns false for global community', () => {
    expect(orgIsCru({ id: GLOBAL_COMMUNITY_ID })).toEqual(false);
  });
  it('returns false for user-created community', () => {
    expect(orgIsCru({ id: '1', user_created: true })).toEqual(false);
  });
  it('returns true for cru community', () => {
    expect(orgIsCru({ id: '1', user_created: false })).toEqual(true);
  });
});

describe('orgIsGlobal', () => {
  it('returns false for empty org', () => {
    expect(orgIsGlobal({})).toEqual(false);
  });
  it('returns false for personal ministry', () => {
    expect(orgIsGlobal({ id: 'personal' })).toEqual(false);
  });
  it('returns false for user-created community', () => {
    expect(orgIsGlobal({ id: '1', user_created: true })).toEqual(false);
  });
  it('returns false for cru community', () => {
    expect(orgIsGlobal({ id: '1', user_created: false })).toEqual(false);
  });
  it('returns true for global community', () => {
    expect(orgIsGlobal({ id: GLOBAL_COMMUNITY_ID })).toEqual(true);
  });
});

describe('hasOrgPermissions', () => {
  it('should return true for admins', () => {
    expect(hasOrgPermissions({ permission_id: 1 })).toEqual(true);
  });
  it('should return true for owners', () => {
    expect(hasOrgPermissions({ permission_id: 3 })).toEqual(true);
  });
  it('should return true for users', () => {
    expect(hasOrgPermissions({ permission_id: 4 })).toEqual(true);
  });
  it('should return false for contacts', () => {
    expect(hasOrgPermissions({ permission_id: 2 })).toEqual(false);
  });
  it('should return false if there is no org permission', () => {
    // @ts-ignore
    expect(hasOrgPermissions()).toEqual(false);
  });
});

describe('isAdminOrOwner', () => {
  it('should return true for admins', () => {
    expect(isAdminOrOwner({ permission_id: 1 })).toEqual(true);
  });
  it('should return true for owners', () => {
    expect(isAdminOrOwner({ permission_id: 3 })).toEqual(true);
  });
  it('should return false for users', () => {
    expect(isAdminOrOwner({ permission_id: 4 })).toEqual(false);
  });
  it('should return false for contacts', () => {
    expect(isAdminOrOwner({ permission_id: 2 })).toEqual(false);
  });
  it('should return false if there is no org permission', () => {
    // @ts-ignore
    expect(isAdminOrOwner()).toEqual(false);
  });
});

describe('isOwner', () => {
  it('should return false for admins', () => {
    expect(isOwner({ permission_id: 1 })).toEqual(false);
  });
  it('should return true for owners', () => {
    expect(isOwner({ permission_id: 3 })).toEqual(true);
  });
  it('should return false for users', () => {
    expect(isOwner({ permission_id: 4 })).toEqual(false);
  });
  it('should return false for contacts', () => {
    expect(isOwner({ permission_id: 2 })).toEqual(false);
  });
  it('should return false if there is no org permission', () => {
    // @ts-ignore
    expect(isOwner()).toEqual(false);
  });
});

describe('isAdmin', () => {
  it('should return true for admins', () => {
    expect(isAdmin({ permission_id: 1 })).toEqual(true);
  });
  it('should return false for owners', () => {
    expect(isAdmin({ permission_id: 3 })).toEqual(false);
  });
  it('should return false for users', () => {
    expect(isAdmin({ permission_id: 4 })).toEqual(false);
  });
  it('should return false for contacts', () => {
    expect(isAdmin({ permission_id: 2 })).toEqual(false);
  });
  it('should return false if there is no org permission', () => {
    // @ts-ignore
    expect(isAdmin()).toEqual(false);
  });
});

describe('shouldQueryReportedComments', () => {
  const userCreatedCommunity = { id: '1', user_created: true };
  const cruCommunity = { id: '1', user_created: false };
  const globalCommunity = { id: GLOBAL_COMMUNITY_ID };
  const ownerOrgPerm = { permission_id: 3 };
  const adminOrgPerm = { permission_id: 1 };
  const memberOrgPerm = { permission_id: 4 };

  it('returns true for owner in user created community', () => {
    expect(
      shouldQueryReportedComments(userCreatedCommunity, ownerOrgPerm),
    ).toEqual(true);
  });
  it('returns true for owner in cru community', () => {
    expect(shouldQueryReportedComments(cruCommunity, ownerOrgPerm)).toEqual(
      true,
    );
  });
  it('returns false for owner in global community', () => {
    expect(shouldQueryReportedComments(globalCommunity, ownerOrgPerm)).toEqual(
      false,
    );
  });
  it('returns false for admin in user created community', () => {
    expect(
      shouldQueryReportedComments(userCreatedCommunity, adminOrgPerm),
    ).toEqual(false);
  });
  it('returns true for admin in cru community', () => {
    expect(shouldQueryReportedComments(cruCommunity, adminOrgPerm)).toEqual(
      true,
    );
  });
  it('returns false for admin in global community', () => {
    expect(shouldQueryReportedComments(globalCommunity, adminOrgPerm)).toEqual(
      false,
    );
  });
  it('returns false for member in user created community', () => {
    expect(
      shouldQueryReportedComments(userCreatedCommunity, memberOrgPerm),
    ).toEqual(false);
  });
  it('returns false for member in crucommunity', () => {
    expect(shouldQueryReportedComments(cruCommunity, memberOrgPerm)).toEqual(
      false,
    );
  });
  it('returns false for global in crucommunity', () => {
    expect(shouldQueryReportedComments(globalCommunity, memberOrgPerm)).toEqual(
      false,
    );
  });
});

describe('openMainMenu', () => {
  it('should open main drawer navigator', () => {
    const store = createThunkStore();

    // @ts-ignore
    DrawerActions.openDrawer.mockReturnValue({ type: 'open drawer' });

    // @ts-ignore
    store.dispatch(openMainMenu());

    expect(DrawerActions.openDrawer).toHaveBeenCalledWith({
      drawer: MAIN_MENU_DRAWER,
    });
  });
});

describe('getIconName', () => {
  it('should return steps icon', () => {
    const item = { type: ACCEPTED_STEP };
    // @ts-ignore
    const result = getIconName(item.type);
    expect(result).toBe('stepsIcon');
  });
  it('should return journey icon', () => {
    const item = { type: 'pathway_progression_audit' };
    // @ts-ignore
    const result = getIconName(item.type);
    expect(result).toBe('journeyIcon');
  });
  it('should return survey icon', () => {
    const item = { type: 'answer_sheet' };
    // @ts-ignore
    const result = getIconName(item.type);
    expect(result).toBe('surveyIcon');
  });
  it('should return interaction icon', () => {
    const item = { type: 'interaction', interaction_type_id: '2' };
    const result = getIconName(item.type, item.interaction_type_id);
    expect(result).toBe('spiritualConversationIcon');
  });
  it('should return null', () => {
    const item = { type: 'something_else' };
    // @ts-ignore
    const result = getIconName(item.type);
    expect(result).toBe(null);
  });
});

describe('shuffleArray', () => {
  const inArray = ['Alpha', 'Bravo', 'Charlie', 'Delta'];
  const expectedOutArray = ['Alpha', 'Delta', 'Bravo', 'Charlie'];

  beforeEach(() => {
    Math.random = jest.fn().mockReturnValue(0.5);
  });

  it('reorders array and calls random for each item', () => {
    expect(shuffleArray(inArray)).toEqual(expectedOutArray);
    expect(Math.random).toHaveBeenCalledTimes(inArray.length);
  });
});

describe('getPagination', () => {
  let pagination = {
    hasNextPage: true,
    page: 0,
  };

  const action = {
    query: {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * pagination.page,
      },
    },
    meta: {
      total: 56,
    },
  };

  it('gets pagination first page', () => {
    pagination = getPagination(
      action,
      DEFAULT_PAGE_LIMIT * (pagination.page + 1),
    );

    expect(pagination).toEqual({ hasNextPage: true, page: 1 });
  });

  it('gets pagination second page', () => {
    action.query.page.offset = DEFAULT_PAGE_LIMIT * pagination.page;

    pagination = getPagination(
      action,
      DEFAULT_PAGE_LIMIT * (pagination.page + 1),
    );

    expect(pagination).toEqual({ hasNextPage: true, page: 2 });
  });

  it('does not paginate when total is reached', () => {
    action.query.page.offset = DEFAULT_PAGE_LIMIT * pagination.page;

    pagination = getPagination(action, action.meta.total);

    expect(pagination).toEqual({ hasNextPage: false, page: 3 });
  });
});

describe('showAssignButton', () => {
  // @ts-ignore
  let isCruOrg;
  // @ts-ignore
  let personIsCurrentUser;
  // @ts-ignore
  let contactAssignment;

  const test = () => {
    // @ts-ignore
    return showAssignButton(isCruOrg, personIsCurrentUser, contactAssignment);
  };

  it('should return false if not cru org', () => {
    isCruOrg = false;
    personIsCurrentUser = false;
    contactAssignment = false;
    expect(test()).toEqual(false);
  });
  it('should return false if is current user', () => {
    isCruOrg = true;
    personIsCurrentUser = true;
    contactAssignment = false;
    expect(test()).toEqual(false);
  });
  it('should return false if assigned to you', () => {
    isCruOrg = true;
    personIsCurrentUser = false;
    contactAssignment = true;
    expect(test()).toEqual(false);
  });
  it('should return true if cru org, not current user, and not assigned to you', () => {
    isCruOrg = true;
    personIsCurrentUser = false;
    contactAssignment = false;
    expect(test()).toEqual(true);
  });
});

describe('showUnassignButton', () => {
  // @ts-ignore
  let isCruOrg;
  // @ts-ignore
  let contactAssignment;

  const test = () => {
    // @ts-ignore
    return showUnassignButton(isCruOrg, contactAssignment);
  };

  it('should return false if not cru org', () => {
    isCruOrg = false;
    contactAssignment = true;
    expect(test()).toEqual(false);
  });
  it('should return false if not assigned to you', () => {
    isCruOrg = true;
    contactAssignment = false;
    expect(test()).toEqual(false);
  });
  it('should return true if cru org and assigned to you', () => {
    isCruOrg = true;
    contactAssignment = true;
    expect(test()).toEqual(true);
  });
});

describe('showDeleteButton', () => {
  // @ts-ignore
  let personIsCurrentUser;
  // @ts-ignore
  let contactAssignment;
  // @ts-ignore
  let orgPermission;

  const test = () => {
    return showDeleteButton(
      // @ts-ignore
      personIsCurrentUser,
      // @ts-ignore
      contactAssignment,
      // @ts-ignore
      orgPermission,
    );
  };

  it('should return false if is current user', () => {
    personIsCurrentUser = true;
    contactAssignment = true;
    orgPermission = false;
    expect(test()).toEqual(false);
  });
  it('should return false if not assigned to you', () => {
    personIsCurrentUser = false;
    contactAssignment = false;
    orgPermission = false;
    expect(test()).toEqual(false);
  });
  it('should return false if not personal ministry', () => {
    personIsCurrentUser = false;
    contactAssignment = true;
    orgPermission = true;
    expect(test()).toEqual(false);
  });
  it('should return true if not current user, assigned to you, and is personal ministry', () => {
    personIsCurrentUser = false;
    contactAssignment = true;
    orgPermission = false;
    expect(test()).toEqual(true);
  });
});

describe('getAssignedToName', () => {
  it('should return You if the user is the assigned_to', () => {
    expect(getAssignedToName(id, { assigned_to: { id } })).toEqual('You');
  });

  it('should return the name of assigned_to if it is not the user', () => {
    expect(
      getAssignedToName('200', { assigned_to: { id: 'anything', first_name } }),
    ).toEqual(first_name);
  });
});

describe('getAssignedByName', () => {
  it('should return nothing if assigned_by is not set', () => {
    expect(getAssignedByName('anything', {})).toEqual('');
  });

  it('should return You if the user is the assigned_by', () => {
    expect(getAssignedByName(id, { assigned_by: { id } })).toEqual(' by You');
  });

  it('should return the name of assigned_by if it is not the user', () => {
    expect(
      getAssignedByName('200', { assigned_by: { id: 'anything', first_name } }),
    ).toEqual(` by ${first_name}`);
  });
});

describe('getPersonPhoneNumber', () => {
  const placeholder = { _placeHolder: true };
  const nonPrimary = { number: '2' };
  const primary = { primary: true, number: '3' };

  it('should remove placeholders', () =>
    expect(
      getPersonPhoneNumber({
        phone_numbers: [placeholder, nonPrimary],
      }),
    ).toEqual(nonPrimary));

  it('should look for primary', () =>
    expect(
      getPersonPhoneNumber({
        phone_numbers: [placeholder, nonPrimary, primary],
      }),
    ).toEqual(primary));

  it('should grab first number if there is no primary', () =>
    expect(
      getPersonPhoneNumber({
        phone_numbers: [nonPrimary, { number: '4' }],
      }),
    ).toEqual(nonPrimary));

  it('does not crash if person does not have phone numbers', () =>
    expect(getPersonPhoneNumber({})).toBe(null));
});

describe('getPersonEmailAddress', () => {
  const placeholder = { _placeHolder: true };
  const nonPrimary = { email: 'email2@test.com' };
  const primary = { primary: true, email: 'email3@test.com' };

  it('should remove placeholders', () =>
    expect(
      getPersonEmailAddress({
        email_addresses: [placeholder, nonPrimary],
      }),
    ).toEqual(nonPrimary));

  it('should look for primary', () =>
    expect(
      getPersonEmailAddress({
        email_addresses: [placeholder, nonPrimary, primary],
      }),
    ).toEqual(primary));

  it('should grab first email if there is no primary', () =>
    expect(
      getPersonEmailAddress({
        email_addresses: [nonPrimary, { email: 'email4@test.com' }],
      }),
    ).toEqual(nonPrimary));

  it('does not crash if person does not have email addresses', () =>
    expect(getPersonEmailAddress({})).toBe(null));
});

describe('getStageIndex', () => {
  const stageOne = { id: '1' };
  const stageTwo = { id: '2' };

  it('should get index of stage ID', () =>
    expect(getStageIndex([stageOne], stageOne.id)).toEqual(0));

  it('should skip null/undefined stages', () =>
    expect(getStageIndex([null, stageTwo], stageTwo.id)).toEqual(1));

  it('returns undefined if not found', () =>
    expect(getStageIndex([stageOne, stageTwo], '3')).toBe(undefined));
});

describe('getFirstNameAndLastInitial', () => {
  it('get first and last name', () =>
    expect(getFirstNameAndLastInitial('First', 'Last')).toEqual('First L'));
  it('get first and last name without names', () =>
    // @ts-ignore
    expect(getFirstNameAndLastInitial()).toEqual(''));
  it('get first and last name without last name', () =>
    // @ts-ignore
    expect(getFirstNameAndLastInitial('First')).toEqual('First'));
});

describe('getCommunityUrl', () => {
  it('should create full url', () => {
    Config.COMMUNITY_URL = 'https://missionhub.com/c/';
    expect(getCommunityUrl('asdfasdf')).toEqual(
      'https://missionhub.com/c/asdfasdf',
    );
  });
  it('should handle null', () => expect(getCommunityUrl(null)).toEqual(''));
});

describe('keyExtractorId', () => {
  it('should get id', () => {
    const item = { id: 'test' };
    const result = keyExtractorId(item);
    expect(result).toEqual(item.id);
  });
});