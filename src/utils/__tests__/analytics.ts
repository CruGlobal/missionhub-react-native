import {
  PermissionEnum,
  PostTypeEnum,
  FeedItemSubjectTypeEnum,
} from '../../../__generated__/globalTypes';
import {
  getAnalyticsAssignmentType,
  getAnalyticsSectionType,
  getAnalyticsEditMode,
  getAnalyticsPermissionType,
  getPostTypeAnalytics,
} from '../analytics';

describe('getAnalyticsAssignmentType', () => {
  it('returns self with no community', () => {
    expect(getAnalyticsAssignmentType(true, false)).toEqual('self');
  });

  it('returns self with community', () => {
    expect(getAnalyticsAssignmentType(true, true)).toEqual('self');
  });

  it('returns contact', () => {
    expect(getAnalyticsAssignmentType(false, false)).toEqual('contact');
  });

  it('returns community member', () => {
    expect(getAnalyticsAssignmentType(false, true)).toEqual('community member');
  });
});

describe('getAnalyticsSectionType', () => {
  it('returns onboarding', () => {
    expect(getAnalyticsSectionType(true)).toEqual('onboarding');
  });

  it('returns empty', () => {
    expect(getAnalyticsSectionType(false)).toEqual('');
  });
});

describe('getAnalyticsEditMode', () => {
  it('returns update', () => {
    expect(getAnalyticsEditMode(true)).toEqual('update');
  });

  it('returns set', () => {
    expect(getAnalyticsEditMode(false)).toEqual('set');
  });
});

describe('getAnalyticsPermissionType', () => {
  it('returns owner from permission', () => {
    expect(getAnalyticsPermissionType(PermissionEnum.owner)).toEqual('owner');
  });

  it('returns admin from permission', () => {
    expect(getAnalyticsPermissionType(PermissionEnum.admin)).toEqual('admin');
  });

  it('returns member from permission', () => {
    expect(getAnalyticsPermissionType(PermissionEnum.user)).toEqual('member');
  });

  it('returns empty string if no permissions', () => {
    expect(getAnalyticsPermissionType(PermissionEnum.no_permissions)).toEqual(
      '',
    );
  });
});

describe('getPostTypeAnalytics', () => {
  it('returns "god story" for story post type', () => {
    expect(getPostTypeAnalytics(PostTypeEnum.story)).toEqual('god story');
  });

  it('returns "god story" for story feed type', () => {
    expect(getPostTypeAnalytics(FeedItemSubjectTypeEnum.STORY)).toEqual(
      'god story',
    );
  });

  it('returns "prayer request" for prayer post type', () => {
    expect(getPostTypeAnalytics(PostTypeEnum.prayer_request)).toEqual(
      'prayer request',
    );
  });

  it('returns "prayer request" for prayer feed type', () => {
    expect(
      getPostTypeAnalytics(FeedItemSubjectTypeEnum.PRAYER_REQUEST),
    ).toEqual('prayer request');
  });

  it('returns "spiritual question" for question post type', () => {
    expect(getPostTypeAnalytics(PostTypeEnum.question)).toEqual(
      'spiritual question',
    );
  });

  it('returns "spiritual question" for question feed type', () => {
    expect(getPostTypeAnalytics(FeedItemSubjectTypeEnum.QUESTION)).toEqual(
      'spiritual question',
    );
  });

  it('returns "care request" for help post type', () => {
    expect(getPostTypeAnalytics(PostTypeEnum.help_request)).toEqual(
      'care request',
    );
  });

  it('returns "care request" for help feed type', () => {
    expect(getPostTypeAnalytics(FeedItemSubjectTypeEnum.HELP_REQUEST)).toEqual(
      'care request',
    );
  });

  it('returns "thoughts" for thought post type', () => {
    expect(getPostTypeAnalytics(PostTypeEnum.thought)).toEqual('thoughts');
  });

  it('returns "thoughts" for thought feed type', () => {
    expect(getPostTypeAnalytics(FeedItemSubjectTypeEnum.THOUGHT)).toEqual(
      'thoughts',
    );
  });

  it('returns "announcement" for announcement post type', () => {
    expect(getPostTypeAnalytics(PostTypeEnum.announcement)).toEqual(
      'announcement',
    );
  });

  it('returns "announcement" for announcement feed type', () => {
    expect(getPostTypeAnalytics(FeedItemSubjectTypeEnum.ANNOUNCEMENT)).toEqual(
      'announcement',
    );
  });

  it('returns "steps of faith" for step feed type', () => {
    expect(getPostTypeAnalytics(FeedItemSubjectTypeEnum.STEP)).toEqual(
      'steps of faith',
    );
  });

  it('returns "" for other feed type', () => {
    expect(
      getPostTypeAnalytics(FeedItemSubjectTypeEnum.COMMUNITY_CHALLENGE),
    ).toEqual('');
  });
});
