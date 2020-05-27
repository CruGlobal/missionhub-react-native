import 'react-native';
import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { FeedItemSubjectTypeEnum } from '../../../../__generated__/globalTypes';

import CelebrateFeedWithType from '..';

jest.mock('../../CelebrateFeed', () => ({ CelebrateFeed: 'CelebrateFeed' }));

const organization = { id: '1' };

it('renders correctly', () => {
  renderWithContext(<CelebrateFeedWithType />, {
    initialState: { organizations: { all: [organization] } },
    navParams: {
      type: FeedItemSubjectTypeEnum.STEP,
      organization,
    },
  }).snapshot();
});

it('renders correctly with id', () => {
  renderWithContext(<CelebrateFeedWithType />, {
    initialState: { organizations: { all: [organization] } },
    navParams: {
      type: FeedItemSubjectTypeEnum.STEP,
      communityId: organization.id,
    },
  }).snapshot();
});
