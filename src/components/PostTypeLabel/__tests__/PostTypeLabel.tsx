import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { FeedItemSubjectTypeEnum } from '../../../../__generated__/globalTypes';

import PostTypeLabel, { PostLabelSizeEnum, PostTypeCardWithPeople } from '..';

it('renders correctly', () => {
  renderWithContext(<PostTypeLabel type={FeedItemSubjectTypeEnum.STORY} />, {
    noWrappers: true,
  }).snapshot();
});

describe('post types', () => {
  it('renders God Story Label', () => {
    renderWithContext(<PostTypeLabel type={FeedItemSubjectTypeEnum.STORY} />, {
      noWrappers: true,
    }).snapshot();
  });
  it('renders Prayer Request Label', () => {
    renderWithContext(
      <PostTypeLabel type={FeedItemSubjectTypeEnum.PRAYER_REQUEST} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders Spiritual Question Label', () => {
    renderWithContext(
      <PostTypeLabel type={FeedItemSubjectTypeEnum.QUESTION} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders Care Request Label', () => {
    renderWithContext(
      <PostTypeLabel type={FeedItemSubjectTypeEnum.HELP_REQUEST} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders On Your Mind Label', () => {
    renderWithContext(
      <PostTypeLabel type={FeedItemSubjectTypeEnum.THOUGHT} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders Announcement Label', () => {
    renderWithContext(
      <PostTypeLabel type={FeedItemSubjectTypeEnum.ANNOUNCEMENT} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders Step Of Faith Label', () => {
    renderWithContext(<PostTypeLabel type={FeedItemSubjectTypeEnum.STEP} />, {
      noWrappers: true,
    }).snapshot();
  });
});

describe('label variations', () => {
  it('renders large label', () => {
    renderWithContext(
      <PostTypeLabel
        type={FeedItemSubjectTypeEnum.STORY}
        size={PostLabelSizeEnum.large}
      />,
      {
        noWrappers: true,
      },
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
      {
        noWrappers: true,
      },
    ).snapshot();
  });
});

it('fires onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByTestId } = renderWithContext(
    <PostTypeLabel type={FeedItemSubjectTypeEnum.STORY} onPress={onPress} />,
    {
      noWrappers: true,
    },
  );

  fireEvent.press(getByTestId('STORYButton'));
  expect(onPress).toHaveBeenCalled();
});

describe('post types cards', () => {
  const onPress = jest.fn();
  it('renders God Story Label', () => {
    renderWithContext(
      <PostTypeCardWithPeople
        onPress={onPress}
        type={FeedItemSubjectTypeEnum.STORY}
      />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders Prayer Request Label', () => {
    renderWithContext(
      <PostTypeCardWithPeople
        onPress={onPress}
        type={FeedItemSubjectTypeEnum.PRAYER_REQUEST}
      />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders Spiritual Question Label', () => {
    renderWithContext(
      <PostTypeCardWithPeople
        onPress={onPress}
        type={FeedItemSubjectTypeEnum.QUESTION}
      />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders Care Request Label', () => {
    renderWithContext(
      <PostTypeCardWithPeople
        onPress={onPress}
        type={FeedItemSubjectTypeEnum.HELP_REQUEST}
      />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders On Your Mind Label', () => {
    renderWithContext(
      <PostTypeCardWithPeople
        onPress={onPress}
        type={FeedItemSubjectTypeEnum.THOUGHT}
      />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders Announcement Label', () => {
    renderWithContext(
      <PostTypeCardWithPeople
        onPress={onPress}
        type={FeedItemSubjectTypeEnum.ANNOUNCEMENT}
      />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
  it('renders Step Of Faith Label', () => {
    renderWithContext(
      <PostTypeCardWithPeople
        onPress={onPress}
        type={FeedItemSubjectTypeEnum.STEP}
      />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
});
