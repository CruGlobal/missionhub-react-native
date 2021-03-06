/* eslint-disable max-lines */

import { DrawerActions } from 'react-navigation-drawer';
import Config from 'react-native-config';

import {
  buildTrackingObj,
  hasOrgPermissions,
  isAdminOrOwner,
  isOwner,
  openMainMenu,
  getPagination,
  getAssignedByName,
  getAssignedToName,
  getStageIndex,
  getFirstNameAndLastInitial,
  getCommunityUrl,
  keyExtractorId,
  isAdmin,
  orgIsGlobal,
  mapPostTypeToFeedType,
  mapFeedTypeToPostType,
  getFeedItemType,
  canModifyFeedItemSubject,
} from '../common';
import {
  MAIN_MENU_DRAWER,
  DEFAULT_PAGE_LIMIT,
  GLOBAL_COMMUNITY_ID,
  ORG_PERMISSIONS,
} from '../../constants';
import { createThunkStore } from '../../../testUtils';
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

describe('getStageIndex', () => {
  const stageOne = {
    id: '1',
    name: 'Test Stage',
    description: 'Test Description',
    self_followup_description: 'Test self description',
    position: 1,
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
