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

  it('returns community_member', () => {
    expect(getAnalyticsAssignmentType(false, true)).toEqual('community_member');
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
});

describe('getPostTypeAnalytics', () => {
  it('returns "god_story" for story post type', () => {
    expect(getPostTypeAnalytics(PostTypeEnum.story)).toEqual('god_story');
  });

  it('returns "god_story" for story feed type', () => {
    expect(getPostTypeAnalytics(FeedItemSubjectTypeEnum.STORY)).toEqual(
      'god_story',
    );
  });

  it('returns "prayer_request" for prayer post type', () => {
    expect(getPostTypeAnalytics(PostTypeEnum.prayer_request)).toEqual(
      'prayer_request',
    );
  });

  it('returns "prayer_request" for prayer feed type', () => {
    expect(
      getPostTypeAnalytics(FeedItemSubjectTypeEnum.PRAYER_REQUEST),
    ).toEqual('prayer_request');
  });

  it('returns "spiritual_question" for question post type', () => {
    expect(getPostTypeAnalytics(PostTypeEnum.question)).toEqual(
      'spiritual_question',
    );
  });

  it('returns "spiritual_question" for question feed type', () => {
    expect(getPostTypeAnalytics(FeedItemSubjectTypeEnum.QUESTION)).toEqual(
      'spiritual_question',
    );
  });

  it('returns "care_request" for help post type', () => {
    expect(getPostTypeAnalytics(PostTypeEnum.help_request)).toEqual(
      'care_request',
    );
  });

  it('returns "care_request" for help feed type', () => {
    expect(getPostTypeAnalytics(FeedItemSubjectTypeEnum.HELP_REQUEST)).toEqual(
      'care_request',
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

  it('returns "steps_of_faith" for step feed type', () => {
    expect(getPostTypeAnalytics(FeedItemSubjectTypeEnum.STEP)).toEqual(
      'steps_of_faith',
    );
  });

  it('returns "" for other feed type', () => {
    expect(
      getPostTypeAnalytics(
        FeedItemSubjectTypeEnum.ACCEPTED_COMMUNITY_CHALLENGE,
      ),
    ).toEqual('');
  });
});
