import React from 'react';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../../../../testUtils';
import { CommunityMemberHeader } from '../CommunityMemberHeader';

const personId = '1';

it('should render loading', () => {
  renderWithContext(<CommunityMemberHeader />, {
    navParams: { personId },
  }).snapshot();
});

it('should load person data correctly', async () => {
  const { recordSnapshot, diffSnapshot } = renderWithContext(
    <CommunityMemberHeader />,
    {
      navParams: { personId },
    },
  );

  recordSnapshot();
  await flushMicrotasksQueue();
  diffSnapshot();
});
