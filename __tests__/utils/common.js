import { DrawerActions } from 'react-navigation';

import {
  userIsJean,
  orgIsPersonalMinistry,
  orgIsUserCreated,
  orgIsCru,
  isMissionhubUser,
  isAdminForOrg,
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
} from '../../src/utils/common';
import { MAIN_MENU_DRAWER, DEFAULT_PAGE_LIMIT } from '../../src/constants';

jest.mock('react-navigation', () => ({
  DrawerActions: {
    openDrawer: jest.fn(),
  },
}));

const id = '123';
const first_name = 'Roger';

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
  it('returns true for user-created community', () => {
    expect(orgIsUserCreated({ id: '1', user_created: true })).toEqual(true);
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
  it('returns false for user-created community', () => {
    expect(orgIsCru({ id: '1', user_created: true })).toEqual(false);
  });
  it('returns true for cru community', () => {
    expect(orgIsCru({ id: '1', user_created: false })).toEqual(true);
  });
});

describe('isMissionhubUser', () => {
  it('should return true for admins', () => {
    expect(isMissionhubUser({ permission_id: 1 })).toEqual(true);
  });
  it('should return true for users', () => {
    expect(isMissionhubUser({ permission_id: 4 })).toEqual(true);
  });
  it('should return false for contacts', () => {
    expect(isMissionhubUser({ permission_id: 2 })).toEqual(false);
  });
  it('should return false if there is no org permission', () => {
    expect(isMissionhubUser()).toEqual(false);
  });
});

describe('isAdminForOrg', () => {
  it('should return true for admins', () => {
    expect(isAdminForOrg({ permission_id: 1 })).toEqual(true);
  });
  it('should return false for users', () => {
    expect(isAdminForOrg({ permission_id: 4 })).toEqual(false);
  });
  it('should return false for contacts', () => {
    expect(isAdminForOrg({ permission_id: 2 })).toEqual(false);
  });
  it('should return false if there is no org permission', () => {
    expect(isAdminForOrg()).toEqual(false);
  });
});

describe('openMainMenu', () => {
  it('should open main drawer navigator', () => {
    openMainMenu();
    expect(DrawerActions.openDrawer).toHaveBeenCalledWith({
      drawer: MAIN_MENU_DRAWER,
    });
  });
});

describe('getIconName', () => {
  it('should return steps icon', () => {
    const item = { type: 'accepted_challenge' };
    const result = getIconName(item.type);
    expect(result).toBe('stepsIcon');
  });
  it('should return journey icon', () => {
    const item = { type: 'pathway_progression_audit' };
    const result = getIconName(item.type);
    expect(result).toBe('journeyIcon');
  });
  it('should return survey icon', () => {
    const item = { type: 'answer_sheet' };
    const result = getIconName(item.type);
    expect(result).toBe('surveyIcon');
  });
  it('should return interaction icon', () => {
    const item = { type: 'interaction', interaction_type_id: 2 };
    const result = getIconName(item.type, item.interaction_type_id);
    expect(result).toBe('spiritualConversationIcon');
  });
  it('should return null', () => {
    const item = { type: 'something_else' };
    const result = getIconName(item.type);
    expect(result).toBe(null);
  });
});

describe('shuffleArray', () => {
  const inArray = ['Alpha', 'Bravo', 'Charlie', 'Delta'];
  const expectedOutArray = ['Alpha', 'Delta', 'Bravo', 'Charlie'];

  Math.random = jest.fn().mockReturnValue(0.5);

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
  let isCruOrg;
  let personIsCurrentUser;
  let contactAssignment;

  const test = () => {
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
  let isCruOrg;
  let contactAssignment;

  const test = () => {
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
  let personIsCurrentUser;
  let contactAssignment;
  let orgPermission;

  const test = () => {
    return showDeleteButton(
      personIsCurrentUser,
      contactAssignment,
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
