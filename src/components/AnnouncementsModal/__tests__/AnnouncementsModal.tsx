import React from 'react';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import { useQuery } from '@apollo/react-hooks';
import { MockList } from 'graphql-tools';

import { renderWithContext } from '../../../../testUtils';

import AnnouncementsModal, { GET_ANNOUNCEMENTS } from '..';

const initialState = {};
it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<AnnouncementsModal />, {
    initialState,
    mocks: {
      AnnouncementConnection: () => ({ nodes: () => new MockList(1) }),
    },
  });
  await flushMicrotasksQueue();

  snapshot();

  expect(useQuery).toHaveBeenCalledWith(GET_ANNOUNCEMENTS);
});

it('Should not render if there are no announcements', async () => {
  const { snapshot } = renderWithContext(<AnnouncementsModal />, {
    initialState,
    mocks: {
      AnnouncementConnection: () => ({ nodes: () => [] }),
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_ANNOUNCEMENTS);
});
