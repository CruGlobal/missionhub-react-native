import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { FeedItemSubjectTypeEnum } from '../../../../__generated__/globalTypes';
import { FeedItemPostCard } from '../../../containers/CelebrateFeedPostCards/__generated__/FeedItemPostCard';
import { FEED_ITEM_POST_CARD_FRAGMENT } from '../../../containers/CelebrateFeedPostCards/queries';

import PostTypeLabel, {
  PostLabelSizeEnum,
  PostTypeCardWithPeople,
  PostTypeNullState,
} from '..';

const onPress = jest.fn();
it('renders correctly', () => {
  renderWithContext(<PostTypeLabel type={FeedItemSubjectTypeEnum.STORY} />, {
    noWrappers: true,
  }).snapshot();
});

it('renders pressable correctly', () => {
  renderWithContext(
    <PostTypeLabel type={FeedItemSubjectTypeEnum.STORY} onPress={onPress} />,
    { noWrappers: true },
  ).snapshot();
});

describe('post types', () => {
  function postType(type: FeedItemSubjectTypeEnum) {
    renderWithContext(<PostTypeLabel type={type} />, {
      noWrappers: true,
    }).snapshot();
  }
  it('renders God Story Label', () => {
    postType(FeedItemSubjectTypeEnum.STORY);
  });
  it('renders Prayer Request Label', () => {
    postType(FeedItemSubjectTypeEnum.PRAYER_REQUEST);
  });
  it('renders Spiritual Question Label', () => {
    postType(FeedItemSubjectTypeEnum.QUESTION);
  });
  it('renders Care Request Label', () => {
    postType(FeedItemSubjectTypeEnum.HELP_REQUEST);
  });
  it('renders On Your Mind Label', () => {
    postType(FeedItemSubjectTypeEnum.THOUGHT);
  });
  it('renders Announcement Label', () => {
    postType(FeedItemSubjectTypeEnum.ANNOUNCEMENT);
  });
  it('renders Step Of Faith Label', () => {
    postType(FeedItemSubjectTypeEnum.STEP);
  });
});

describe('label variations', () => {
  it('renders large label', () => {
    renderWithContext(
      <PostTypeLabel
        type={FeedItemSubjectTypeEnum.STORY}
        size={PostLabelSizeEnum.large}
      />,
      { noWrappers: true },
    ).snapshot();
  });

  it('render extra large label', () => {
    renderWithContext(
      <PostTypeLabel
        type={FeedItemSubjectTypeEnum.STORY}
        size={PostLabelSizeEnum.extraLarge}
      />,
    ).snapshot();
  });

  it('renders label with no text', () => {
    renderWithContext(
      <PostTypeLabel type={FeedItemSubjectTypeEnum.STORY} showText={false} />,
      { noWrappers: true },
    ).snapshot();
  });

  it('renders small label with no text', () => {
    renderWithContext(
      <PostTypeLabel
        type={FeedItemSubjectTypeEnum.STORY}
        showText={false}
        size={PostLabelSizeEnum.small}
      />,
      { noWrappers: true },
    ).snapshot();
  });
});

it('fires onPress when pressed', () => {
  const { getByTestId } = renderWithContext(
    <PostTypeLabel type={FeedItemSubjectTypeEnum.STORY} onPress={onPress} />,
    { noWrappers: true },
  );

  fireEvent.press(getByTestId('STORYButton'));
  expect(onPress).toHaveBeenCalled();
});

describe('post types cards', () => {
  function card(type: FeedItemSubjectTypeEnum) {
    renderWithContext(
      <PostTypeCardWithPeople onPress={onPress} type={type} />,
      { noWrappers: true },
    ).snapshot();
  }
  it('renders God Story Label', () => {
    card(FeedItemSubjectTypeEnum.STORY);
  });
  it('renders Prayer Request Label', () => {
    card(FeedItemSubjectTypeEnum.PRAYER_REQUEST);
  });
  it('renders Spiritual Question Label', () => {
    card(FeedItemSubjectTypeEnum.QUESTION);
  });
  it('renders Care Request Label', () => {
    card(FeedItemSubjectTypeEnum.HELP_REQUEST);
  });
  it('renders On Your Mind Label', () => {
    card(FeedItemSubjectTypeEnum.THOUGHT);
  });
  it('renders Announcement Label', () => {
    card(FeedItemSubjectTypeEnum.ANNOUNCEMENT);
  });
  it('renders Step Of Faith Label', () => {
    card(FeedItemSubjectTypeEnum.STEP);
  });

  const people = [
    mockFragment<FeedItemPostCard>(FEED_ITEM_POST_CARD_FRAGMENT).author,
    mockFragment<FeedItemPostCard>(FEED_ITEM_POST_CARD_FRAGMENT).author,
    mockFragment<FeedItemPostCard>(FEED_ITEM_POST_CARD_FRAGMENT).author,
    mockFragment<FeedItemPostCard>(FEED_ITEM_POST_CARD_FRAGMENT).author,
    mockFragment<FeedItemPostCard>(FEED_ITEM_POST_CARD_FRAGMENT).author,
    mockFragment<FeedItemPostCard>(FEED_ITEM_POST_CARD_FRAGMENT).author,
  ];

  it('renders people', () => {
    renderWithContext(
      <PostTypeCardWithPeople
        onPress={onPress}
        type={FeedItemSubjectTypeEnum.STEP}
        people={people}
      />,
      { noWrappers: true },
    ).snapshot();
  });

  it('renders people with count only', () => {
    renderWithContext(
      <PostTypeCardWithPeople
        onPress={onPress}
        type={FeedItemSubjectTypeEnum.STEP}
        people={people}
        countOnly={true}
      />,
      { noWrappers: true },
    ).snapshot();
  });

  it('fires onPress when pressed', () => {
    const { getByTestId } = renderWithContext(
      <PostTypeCardWithPeople
        onPress={onPress}
        type={FeedItemSubjectTypeEnum.STORY}
        people={people}
        countOnly={true}
      />,
      { noWrappers: true },
    );

    fireEvent.press(getByTestId('STORYCardWithPeople'));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('post types null states', () => {
  function nullState(type: FeedItemSubjectTypeEnum) {
    renderWithContext(<PostTypeNullState type={type} />, {
      noWrappers: true,
    }).snapshot();
  }
  it('renders God Story Null State', () => {
    nullState(FeedItemSubjectTypeEnum.STORY);
  });
  it('renders Prayer Request Null State', () => {
    nullState(FeedItemSubjectTypeEnum.PRAYER_REQUEST);
  });
  it('renders Spiritual Question Null State', () => {
    nullState(FeedItemSubjectTypeEnum.QUESTION);
  });
  it('renders Care Request Null State', () => {
    nullState(FeedItemSubjectTypeEnum.HELP_REQUEST);
  });
  it('renders On Your Mind Null State', () => {
    nullState(FeedItemSubjectTypeEnum.THOUGHT);
  });
  it('renders Announcement Null State', () => {
    nullState(FeedItemSubjectTypeEnum.ANNOUNCEMENT);
  });
  it('renders Step Of Faith Null State', () => {
    nullState(FeedItemSubjectTypeEnum.STEP);
  });
});
