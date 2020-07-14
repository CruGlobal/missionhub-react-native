import React from 'react';
import { Text, View } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import * as common from '../../../utils/common';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { STEP_DETAIL_POST_FRAGMENT } from '../queries';
import { StepDetailPost } from '../__generated__/StepDetailPost';
import { StepTypeEnum } from '../../../../__generated__/globalTypes';
import { navigatePush } from '../../../actions/navigation';
import { FEED_ITEM_DETAIL_SCREEN } from '../../../containers/Communities/Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';

import StepDetailScreen from '..';

jest.mock('../../../actions/navigation');
const firstName = 'Christian';
const mockPost = mockFragment<StepDetailPost>(STEP_DETAIL_POST_FRAGMENT);

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });
});

const snapshot = (props = {}) => {
  renderWithContext(
    <StepDetailScreen
      firstName={firstName}
      text="Roge is well behaved"
      CenterHeader={<View />}
      RightHeader={<View />}
      CenterContent={<Text>Center content</Text>}
      {...props}
    />,
  ).snapshot();
};

describe('Post is not null', () => {
  it('renders correctly with post', () => {
    snapshot({ post: mockPost, stepType: StepTypeEnum.care });
  });

  it('renders correctly with post with image', () => {
    snapshot({
      post: mockPost,
      stepType: StepTypeEnum.care,
    });
  });
  it('renders post without image', () => {
    snapshot({
      post: mockFragment<StepDetailPost>(STEP_DETAIL_POST_FRAGMENT, {
        mocks: {
          Post: () => ({
            mediaExpiringUrl: () => null,
          }),
        },
      }),
      stepType: StepTypeEnum.care,
    });
  });
  it('renders with an input', () => {
    snapshot({
      post: mockPost,
      stepType: StepTypeEnum.care,
      Input: <View>Input</View>,
    });
  });
  it('navigates to post when user presses open post', async () => {
    const newPost = mockFragment<StepDetailPost>(STEP_DETAIL_POST_FRAGMENT);

    const { getByTestId } = renderWithContext(
      <StepDetailScreen
        firstName={firstName}
        text="Roge is well behaved"
        CenterHeader={<View />}
        RightHeader={<View />}
        CenterContent={<Text>Center content</Text>}
        post={newPost}
        stepType={StepTypeEnum.care}
      />,
    );
    await flushMicrotasksQueue();
    fireEvent.press(getByTestId('openPostButton'));
    expect(navigatePush).toHaveBeenCalledWith(FEED_ITEM_DETAIL_SCREEN, {
      feedItemId: newPost.feedItem.id,
    });
  });
});

describe('markdown is not null', () => {
  it('renders correctly', () => {
    snapshot({ markdown: 'ROBERT ROBERT ROBERT' });
  });

  it('renders correctly on android', () => {
    ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
    snapshot({ markdown: 'ROBERT ROBERT ROBERT' });
  });

  it('renders correctly with bottom button props', () => {
    snapshot({
      markdown: 'ROBERT ROBERT ROBERT',
      bottomButtonProps: { text: 'bottom button props', onPress: () => {} },
    });
  });

  it('renders correctly on android with bottom button props', () => {
    ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
    snapshot({
      markdown: 'ROBERT ROBERT ROBERT',
      bottomButtonProps: { text: 'bottom button props', onPress: () => {} },
    });
  });
});

describe('markdown with <<name>> to change', () => {
  it('renders correctly', () => {
    snapshot({ markdown: '<<name>> <<name>> <<name>>' });
  });
});

describe('renders with hideBackButton', () => {
  it('renders correctly', () => {
    snapshot({ hideBackButton: true });
  });
});

describe('markdown is empty string', () => {
  it('renders correctly', () => {
    snapshot({ markdown: '' });
  });
});

describe('markdown is null', () => {
  describe('bottomButtonProps are not null', () => {
    it('renders correctly', () => {
      snapshot({
        markdown: null,
        bottomButtonProps: { text: 'bottom button props', onPress: () => {} },
      });
    });
  });

  describe('bottomButtonProps are null', () => {
    it('renders correctly', () => {
      snapshot({ bottomButtonProps: null });
    });
  });
});
