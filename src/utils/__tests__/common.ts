/* eslint-disable max-lines */

import { DrawerActions } from 'react-navigation-drawer';
import Config from 'react-native-config';

import {
  buildTrackingObj,
  hasOrgPermissions,
  isAdminOrOwner,
  isOwner,
  openMainMenu,
  getIconName,
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
  isAuthenticated,
  personIsCurrentUser,
  isOnboarding,
  mapPostTypeToFeedType,
  mapFeedTypeToPostType,
  getFeedItemType,
  canModifyFeedItemSubject,
} from '../common';
import {
  MAIN_MENU_DRAWER,
  DEFAULT_PAGE_LIMIT,
  ACCEPTED_STEP,
  GLOBAL_COMMUNITY_ID,
  ORG_PERMISSIONS,
} from '../../constants';
import { createThunkStore } from '../../../testUtils';
import { AuthState } from '../../reducers/auth';
import { OnboardingState } from '../../reducers/onboarding';
import {
  PermissionEnum,
  PostTypeEnum,
  FeedItemSubjectTypeEnum,
  PostStepStatusEnum,
} from '../../../__generated__/globalTypes';
import {
  CommunityFeedItem_subject_Post,
  CommunityFeedItem_subject_Step,
  CommunityFeedItem_subject_AcceptedCommunityChallenge,
} from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';

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

describe('isAuthenticated', () => {
  it('returns true', () => {
    expect(isAuthenticated({ token: 'abcd' } as AuthState)).toEqual(true);
    expect(isAuthenticated({ token: 'undefined' } as AuthState)).toEqual(true);
    expect(isAuthenticated({ token: 'null' } as AuthState)).toEqual(true);
  });

  it('returns false', () => {
    expect(isAuthenticated({ token: '' } as AuthState)).toEqual(false);
    expect(isAuthenticated({ token: undefined } as AuthState)).toEqual(false);
  });
});

describe('personIsCurrentUser', () => {
  const myId = '1';
  const otherId = '2';
  const authState = { person: { id: myId } } as AuthState;

  it('returns true', () => {
    expect(personIsCurrentUser(myId, authState)).toEqual(true);
  });

  it('returns false', () => {
    expect(personIsCurrentUser(otherId, authState)).toEqual(false);
  });
});

describe('isOnboarding', () => {
  it('returns true', () => {
    expect(
      isOnboarding({ currentlyOnboarding: true } as OnboardingState),
    ).toEqual(true);
  });

  it('returns false', () => {
    expect(
      isOnboarding({ currentlyOnboarding: false } as OnboardingState),
    ).toEqual(false);
  });
});

describe('orgIsGlobal', () => {
  it('returns false for empty org', () => {
    expect(orgIsGlobal({})).toEqual(false);
  });
  it('returns false for personal ministry', () => {
    expect(orgIsGlobal({ id: 'personal' })).toEqual(false);
  });
  it('returns true for global community', () => {
    expect(orgIsGlobal({ id: GLOBAL_COMMUNITY_ID })).toEqual(true);
  });
});

describe('hasOrgPermissions', () => {
  it('should return true for admins', () => {
    expect(hasOrgPermissions({ permission_id: ORG_PERMISSIONS.ADMIN })).toEqual(
      true,
    );
  });
  it('should return true for owners', () => {
    expect(hasOrgPermissions({ permission_id: ORG_PERMISSIONS.OWNER })).toEqual(
      true,
    );
  });
  it('should return true for users', () => {
    expect(hasOrgPermissions({ permission_id: ORG_PERMISSIONS.USER })).toEqual(
      true,
    );
  });
  it('should return false for contacts', () => {
    expect(
      hasOrgPermissions({ permission_id: ORG_PERMISSIONS.CONTACT }),
    ).toEqual(false);
  });
  it('should return false if there is no org permission', () => {
    expect(hasOrgPermissions(null)).toEqual(false);
  });
  it('should return true for admins | permission', () => {
    expect(hasOrgPermissions({ permission: PermissionEnum.admin })).toEqual(
      true,
    );
  });
  it('should return true for owners | permission', () => {
    expect(hasOrgPermissions({ permission: PermissionEnum.owner })).toEqual(
      true,
    );
  });
  it('should return true for users | permission', () => {
    expect(hasOrgPermissions({ permission: PermissionEnum.user })).toEqual(
      true,
    );
  });
  it('should return false for no_permission | permission', () => {
    expect(
      hasOrgPermissions({ permission: PermissionEnum.no_permissions }),
    ).toEqual(false);
  });
});

describe('isAdminOrOwner', () => {
  it('should return true for admins', () => {
    expect(isAdminOrOwner({ permission_id: ORG_PERMISSIONS.ADMIN })).toEqual(
      true,
    );
  });
  it('should return true for owners', () => {
    expect(isAdminOrOwner({ permission_id: ORG_PERMISSIONS.OWNER })).toEqual(
      true,
    );
  });
  it('should return false for users', () => {
    expect(isAdminOrOwner({ permission_id: ORG_PERMISSIONS.USER })).toEqual(
      false,
    );
  });
  it('should return false for contacts', () => {
    expect(isAdminOrOwner({ permission_id: ORG_PERMISSIONS.CONTACT })).toEqual(
      false,
    );
  });
  it('should return false if there is no org permission', () => {
    expect(isAdminOrOwner(null)).toEqual(false);
  });
  it('should return true for admins | permission', () => {
    expect(isAdminOrOwner({ permission: PermissionEnum.admin })).toEqual(true);
  });
  it('should return true for owners | permission', () => {
    expect(isAdminOrOwner({ permission: PermissionEnum.owner })).toEqual(true);
  });
  it('should return false for users | permission', () => {
    expect(isAdminOrOwner({ permission: PermissionEnum.user })).toEqual(false);
  });
  it('should return false for no_permission | permission', () => {
    expect(
      isAdminOrOwner({ permission: PermissionEnum.no_permissions }),
    ).toEqual(false);
  });
});

describe('isOwner', () => {
  it('should return false for admins', () => {
    expect(isOwner({ permission_id: ORG_PERMISSIONS.ADMIN })).toEqual(false);
  });
  it('should return true for owners', () => {
    expect(isOwner({ permission_id: ORG_PERMISSIONS.OWNER })).toEqual(true);
  });
  it('should return false for users', () => {
    expect(isOwner({ permission_id: ORG_PERMISSIONS.USER })).toEqual(false);
  });
  it('should return false for contacts', () => {
    expect(isOwner({ permission_id: ORG_PERMISSIONS.CONTACT })).toEqual(false);
  });
  it('should return false if there is no org permission', () => {
    expect(isOwner(null)).toEqual(false);
  });
  it('should return false for admins | permission', () => {
    expect(isOwner({ permission: PermissionEnum.admin })).toEqual(false);
  });
  it('should return true for owners | permission', () => {
    expect(isOwner({ permission: PermissionEnum.owner })).toEqual(true);
  });
  it('should return false for users | permission', () => {
    expect(isOwner({ permission: PermissionEnum.user })).toEqual(false);
  });
  it('should return false for no_permission | permission', () => {
    expect(isOwner({ permission: PermissionEnum.no_permissions })).toEqual(
      false,
    );
  });
});

describe('isAdmin', () => {
  it('should return true for admins', () => {
    expect(isAdmin({ permission_id: ORG_PERMISSIONS.ADMIN })).toEqual(true);
  });
  it('should return false for owners', () => {
    expect(isAdmin({ permission_id: ORG_PERMISSIONS.OWNER })).toEqual(false);
  });
  it('should return false for users', () => {
    expect(isAdmin({ permission_id: ORG_PERMISSIONS.USER })).toEqual(false);
  });
  it('should return false for contacts', () => {
    expect(isAdmin({ permission_id: ORG_PERMISSIONS.CONTACT })).toEqual(false);
  });
  it('should return false if there is no org permission', () => {
    expect(isAdmin(null)).toEqual(false);
  });
  it('should return true for admins | permission', () => {
    expect(isAdmin({ permission: PermissionEnum.admin })).toEqual(true);
  });
  it('should return false for owners | permission', () => {
    expect(isAdmin({ permission: PermissionEnum.owner })).toEqual(false);
  });
  it('should return false for users | permission', () => {
    expect(isAdmin({ permission: PermissionEnum.user })).toEqual(false);
  });
  it('should return false for no_permissions | permission', () => {
    expect(isAdmin({ permission: PermissionEnum.no_permissions })).toEqual(
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

  const testShowAssignButton = () => {
    // @ts-ignore
    return showAssignButton(isCruOrg, personIsCurrentUser, contactAssignment);
  };

  it('should return false if not cru org', () => {
    isCruOrg = false;
    personIsCurrentUser = false;
    contactAssignment = false;
    expect(testShowAssignButton()).toEqual(false);
  });
  it('should return false if is current user', () => {
    isCruOrg = true;
    personIsCurrentUser = true;
    contactAssignment = false;
    expect(testShowAssignButton()).toEqual(false);
  });
  it('should return false if assigned to you', () => {
    isCruOrg = true;
    personIsCurrentUser = false;
    contactAssignment = true;
    expect(testShowAssignButton()).toEqual(false);
  });
  it('should return true if cru org, not current user, and not assigned to you', () => {
    isCruOrg = true;
    personIsCurrentUser = false;
    contactAssignment = false;
    expect(testShowAssignButton()).toEqual(true);
  });
});

describe('showUnassignButton', () => {
  // @ts-ignore
  let isCruOrg;
  // @ts-ignore
  let contactAssignment;

  const testShowUnassignButton = () => {
    // @ts-ignore
    return showUnassignButton(isCruOrg, contactAssignment);
  };

  it('should return false if not cru org', () => {
    isCruOrg = false;
    contactAssignment = true;
    expect(testShowUnassignButton()).toEqual(false);
  });
  it('should return false if not assigned to you', () => {
    isCruOrg = true;
    contactAssignment = false;
    expect(testShowUnassignButton()).toEqual(false);
  });
  it('should return true if cru org and assigned to you', () => {
    isCruOrg = true;
    contactAssignment = true;
    expect(testShowUnassignButton()).toEqual(true);
  });
});

describe('showDeleteButton', () => {
  // @ts-ignore
  let personIsCurrentUser;
  // @ts-ignore
  let contactAssignment;
  // @ts-ignore
  let orgPermission;

  const testShowDeleteButton = () => {
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
    expect(testShowDeleteButton()).toEqual(false);
  });
  it('should return false if not assigned to you', () => {
    personIsCurrentUser = false;
    contactAssignment = false;
    orgPermission = false;
    expect(testShowDeleteButton()).toEqual(false);
  });
  it('should return false if not personal ministry', () => {
    personIsCurrentUser = false;
    contactAssignment = true;
    orgPermission = true;
    expect(testShowDeleteButton()).toEqual(false);
  });
  it('should return true if not current user, assigned to you, and is personal ministry', () => {
    personIsCurrentUser = false;
    contactAssignment = true;
    orgPermission = false;
    expect(testShowDeleteButton()).toEqual(true);
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
  const stageOne = {
    id: '1',
    name: 'Test Stage',
    description: 'Test Description',
    self_followup_description: 'Test self description',
    position: 1,
    name_i18n: 'Test Stage',
    description_i18n: 'Test Description',
    icon_url: '',
    localized_pathway_stages: [],
  };
  const stageTwo = { ...stageOne, id: '2' };

  it('should get index of stage ID', () =>
    expect(getStageIndex([stageOne], stageOne.id)).toEqual(0));

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

describe('mapPostTypeToFeedType', () => {
  it('maps for Story', () => {
    expect(mapPostTypeToFeedType(PostTypeEnum.story)).toEqual(
      FeedItemSubjectTypeEnum.STORY,
    );
  });

  it('maps for Prayer Request', () => {
    expect(mapPostTypeToFeedType(PostTypeEnum.prayer_request)).toEqual(
      FeedItemSubjectTypeEnum.PRAYER_REQUEST,
    );
  });

  it('maps for Question', () => {
    expect(mapPostTypeToFeedType(PostTypeEnum.question)).toEqual(
      FeedItemSubjectTypeEnum.QUESTION,
    );
  });

  it('maps for Help Request', () => {
    expect(mapPostTypeToFeedType(PostTypeEnum.help_request)).toEqual(
      FeedItemSubjectTypeEnum.HELP_REQUEST,
    );
  });

  it('maps for Thought', () => {
    expect(mapPostTypeToFeedType(PostTypeEnum.thought)).toEqual(
      FeedItemSubjectTypeEnum.THOUGHT,
    );
  });

  it('maps for Announcement', () => {
    expect(mapPostTypeToFeedType(PostTypeEnum.announcement)).toEqual(
      FeedItemSubjectTypeEnum.ANNOUNCEMENT,
    );
  });
});

describe('mapFeedTypeToPostType', () => {
  it('maps for Story', () => {
    expect(mapFeedTypeToPostType(FeedItemSubjectTypeEnum.STORY)).toEqual(
      PostTypeEnum.story,
    );
  });

  it('maps for Prayer Request', () => {
    expect(
      mapFeedTypeToPostType(FeedItemSubjectTypeEnum.PRAYER_REQUEST),
    ).toEqual(PostTypeEnum.prayer_request);
  });

  it('maps for Question', () => {
    expect(mapFeedTypeToPostType(FeedItemSubjectTypeEnum.QUESTION)).toEqual(
      PostTypeEnum.question,
    );
  });

  it('maps for Help Request', () => {
    expect(mapFeedTypeToPostType(FeedItemSubjectTypeEnum.HELP_REQUEST)).toEqual(
      PostTypeEnum.help_request,
    );
  });

  it('maps for Thought', () => {
    expect(mapFeedTypeToPostType(FeedItemSubjectTypeEnum.THOUGHT)).toEqual(
      PostTypeEnum.thought,
    );
  });

  it('maps for Announcement', () => {
    expect(mapFeedTypeToPostType(FeedItemSubjectTypeEnum.ANNOUNCEMENT)).toEqual(
      PostTypeEnum.announcement,
    );
  });
});

describe('getFeedItemType', () => {
  const post: CommunityFeedItem_subject_Post = {
    __typename: 'Post',
    id: '1',
    content: 'asdf',
    mediaContentType: '',
    mediaExpiringUrl: '',
    postType: PostTypeEnum.story,
    stepStatus: PostStepStatusEnum.INCOMPLETE,
  };

  it('returns STEP', () => {
    const step: CommunityFeedItem_subject_Step = {
      __typename: 'Step',
      id: '1',
      receiverStageAtCompletion: null,
    };

    expect(getFeedItemType(step)).toEqual(FeedItemSubjectTypeEnum.STEP);
  });

  it('returns ACCEPTED_COMMUNITY_CHALLENGE', () => {
    const challenge: CommunityFeedItem_subject_AcceptedCommunityChallenge = {
      __typename: 'AcceptedCommunityChallenge',
      id: '1',
      completedAt: 'some time',
      communityChallenge: {
        __typename: 'CommunityChallenge',
        id: '1',
        title: 'asdf',
      },
    };

    expect(getFeedItemType(challenge)).toEqual(
      FeedItemSubjectTypeEnum.ACCEPTED_COMMUNITY_CHALLENGE,
    );
  });

  it('returns STORY', () => {
    expect(getFeedItemType({ ...post, postType: PostTypeEnum.story })).toEqual(
      FeedItemSubjectTypeEnum.STORY,
    );
  });

  it('returns PRAYER_REQUEST', () => {
    expect(
      getFeedItemType({ ...post, postType: PostTypeEnum.prayer_request }),
    ).toEqual(FeedItemSubjectTypeEnum.PRAYER_REQUEST);
  });

  it('returns QUESTION', () => {
    expect(
      getFeedItemType({ ...post, postType: PostTypeEnum.question }),
    ).toEqual(FeedItemSubjectTypeEnum.QUESTION);
  });

  it('returns HELP_REQUEST', () => {
    expect(
      getFeedItemType({ ...post, postType: PostTypeEnum.help_request }),
    ).toEqual(FeedItemSubjectTypeEnum.HELP_REQUEST);
  });

  it('returns THOUGHT', () => {
    expect(
      getFeedItemType({ ...post, postType: PostTypeEnum.thought }),
    ).toEqual(FeedItemSubjectTypeEnum.THOUGHT);
  });

  it('returns ANNOUNCEMENT', () => {
    expect(
      getFeedItemType({ ...post, postType: PostTypeEnum.announcement }),
    ).toEqual(FeedItemSubjectTypeEnum.ANNOUNCEMENT);
  });
});

describe('canModifyFeedItemSubject', () => {
  const post: CommunityFeedItem_subject_Post = {
    __typename: 'Post',
    id: '1',
    content: 'asdf',
    mediaContentType: '',
    mediaExpiringUrl: '',
    postType: PostTypeEnum.story,
    stepStatus: PostStepStatusEnum.INCOMPLETE,
  };
  function check(postType: PostTypeEnum) {
    return canModifyFeedItemSubject({ ...post, postType });
  }

  it('returns STEP', () => {
    const step: CommunityFeedItem_subject_Step = {
      __typename: 'Step',
      id: '1',
      receiverStageAtCompletion: null,
    };

    expect(canModifyFeedItemSubject(step)).toEqual(false);
  });

  it('returns ACCEPTED_COMMUNITY_CHALLENGE', () => {
    const challenge: CommunityFeedItem_subject_AcceptedCommunityChallenge = {
      __typename: 'AcceptedCommunityChallenge',
      id: '1',
      completedAt: 'some time',
      communityChallenge: {
        __typename: 'CommunityChallenge',
        id: '1',
        title: 'asdf',
      },
    };

    expect(canModifyFeedItemSubject(challenge)).toEqual(false);
  });

  it('returns STORY', () => {
    expect(check(PostTypeEnum.story)).toEqual(true);
  });

  it('returns PRAYER_REQUEST', () => {
    expect(check(PostTypeEnum.prayer_request)).toEqual(true);
  });

  it('returns QUESTION', () => {
    expect(check(PostTypeEnum.question)).toEqual(true);
  });

  it('returns HELP_REQUEST', () => {
    expect(check(PostTypeEnum.help_request)).toEqual(true);
  });

  it('returns THOUGHT', () => {
    expect(check(PostTypeEnum.thought)).toEqual(true);
  });

  it('returns ANNOUNCEMENT', () => {
    expect(check(PostTypeEnum.announcement)).toEqual(true);
  });
});
