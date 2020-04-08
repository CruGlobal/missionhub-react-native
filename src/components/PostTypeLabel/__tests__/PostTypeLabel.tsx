import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import PostTypeLabel, { PostTypeEnum, LabelSizeEnum } from '..';

it('renders correctly', () => {
  renderWithContext(<PostTypeLabel type={PostTypeEnum.godStory} />, {
    noWrappers: true,
  }).snapshot();
});

describe('post types', () => {
  it('renders God Story Label', () => {
    renderWithContext(<PostTypeLabel type={PostTypeEnum.godStory} />, {
      noWrappers: true,
    }).snapshot();
  });
  it('renders Prayer Request Label', () => {
    renderWithContext(<PostTypeLabel type={PostTypeEnum.prayerRequest} />, {
      noWrappers: true,
    }).snapshot();
  });
  it('renders Spiritual Question Label', () => {
    renderWithContext(<PostTypeLabel type={PostTypeEnum.spiritualQuestion} />, {
      noWrappers: true,
    }).snapshot();
  });
  it('renders Care Request Label', () => {
    renderWithContext(<PostTypeLabel type={PostTypeEnum.careRequest} />, {
      noWrappers: true,
    }).snapshot();
  });
  it('renders On Your Mind Label', () => {
    renderWithContext(<PostTypeLabel type={PostTypeEnum.onYourMind} />, {
      noWrappers: true,
    }).snapshot();
  });
  it('renders Announcement Label', () => {
    renderWithContext(<PostTypeLabel type={PostTypeEnum.announcement} />, {
      noWrappers: true,
    }).snapshot();
  });
  it('renders Step Of Faith Label', () => {
    renderWithContext(<PostTypeLabel type={PostTypeEnum.stepOfFatih} />, {
      noWrappers: true,
    }).snapshot();
  });
});

describe('label variations', () => {
  it('renders large label', () => {
    renderWithContext(
      <PostTypeLabel type={PostTypeEnum.godStory} size={LabelSizeEnum.large} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });

  it('renders label with no text', () => {
    renderWithContext(
      <PostTypeLabel type={PostTypeEnum.godStory} showText={false} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
});

it('fires onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByTestId } = renderWithContext(
    <PostTypeLabel type={PostTypeEnum.godStory} onPress={onPress} />,
    {
      noWrappers: true,
    },
  );

  fireEvent.press(getByTestId('godStoryButton'));
  expect(onPress).toHaveBeenCalled();
});
