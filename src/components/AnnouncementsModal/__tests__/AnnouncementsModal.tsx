import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { MockList } from 'graphql-tools';

import { renderWithContext } from '../../../../testUtils';

import AnnouncementsModal, {
  GET_ANNOUNCEMENTS,
  HANDLE_ANNOUNCEMENTS,
} from '..';

const initialState = {};
it('renders correctly', async () => {
  renderWithContext(<AnnouncementsModal />, {
    initialState,
    mocks: {
      AnnouncementConnection: () => ({ nodes: () => new MockList(1) }),
    },
  });
  await flushMicrotasksQueue();

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

describe('User clicks the close button', () => {
  it('Should find the testId for the close button', async () => {
    const { getByTestId } = renderWithContext(<AnnouncementsModal />, {
      initialState,
      mocks: {
        AnnouncementConnection: () => ({ nodes: () => new MockList(1) }),
      },
    });
    await flushMicrotasksQueue();

    expect(getByTestId('IconButton')).toBeTruthy();
  });
  it('Should fire the HANDLE_ANNOUNCEMENTS mutation when the user clicks the close button', async () => {
    const { getByTestId } = renderWithContext(<AnnouncementsModal />, {
      initialState,
      mocks: {
        AnnouncementConnection: () => ({ nodes: () => new MockList(1) }),
      },
    });
    await flushMicrotasksQueue();

    await fireEvent.press(getByTestId('IconButton'));
    expect(useMutation).toHaveBeenMutatedWith(HANDLE_ANNOUNCEMENTS, {
      variables: { input: { announcementId: '1' } },
    });
  });
});

describe('User clicks the Modal Action Button', () => {
  it('should find the modals action button', async () => {
    const { getByTestId } = renderWithContext(<AnnouncementsModal />, {
      initialState,
      mocks: {
        AnnouncementConnection: () => ({
          nodes: () => [
            {
              body: 'This is  a test for the new modal',
              id: '24',
              title: 'Another Test 17',
              actions: {
                nodes: [
                  {
                    label: 'Go To Google',
                    id: '18',
                    action: 'go',
                    args: 'https://www.google.com/',
                  },
                ],
              },
            },
          ],
        }),
      },
    });
    await flushMicrotasksQueue();

    expect(getByTestId('CompleteAnnouncementActionButton')).toBeTruthy();
  });

  it('Should fire the HANDLE_ANNOUNCEMENT mutation with no action', async () => {
    const { getByTestId, snapshot } = renderWithContext(
      <AnnouncementsModal />,
      {
        initialState,
        mocks: {
          AnnouncementConnection: () => ({
            nodes: () => [
              {
                body: 'This is  a test for the new modal',
                id: '24',
                title: 'Another Test 17',
                actions: { nodes: [] },
              },
            ],
          }),
        },
      },
    );
    await flushMicrotasksQueue();

    expect(getByTestId('CompleteAnnouncementNoActionButton')).toBeTruthy();
    snapshot();
    await fireEvent.press(getByTestId('CompleteAnnouncementNoActionButton'));
    expect(useMutation).toHaveBeenMutatedWith(HANDLE_ANNOUNCEMENTS, {
      variables: {
        input: { announcementId: '24' },
      },
    });
  });

  it('Should fire the HANDLE_ANNOUCMENTS mutation when the user clicks the modals action button | GO action', async () => {
    const { getByTestId, snapshot } = renderWithContext(
      <AnnouncementsModal />,
      {
        initialState,
        mocks: {
          AnnouncementConnection: () => ({
            nodes: () => [
              {
                body: 'This is  a test for the new modal',
                id: '24',
                title: 'Another Test 17',
                actions: {
                  nodes: [
                    {
                      label: 'Go To Google',
                      id: '18',
                      action: 'go',
                      args: 'https://www.google.com/',
                    },
                  ],
                },
              },
            ],
          }),
        },
      },
    );
    await flushMicrotasksQueue();

    expect(getByTestId('CompleteAnnouncementActionButton')).toBeTruthy();
    await fireEvent.press(getByTestId('CompleteAnnouncementActionButton'));
    expect(useMutation).toHaveBeenMutatedWith(HANDLE_ANNOUNCEMENTS, {
      variables: {
        input: { announcementId: '24', announcementActionId: '18' },
      },
    });
    snapshot();
  });

  it('Should fire the HANDLE_ANNOUCMENTS mutation when the user clicks the modals action button | Track action', async () => {
    const { getByTestId, snapshot } = renderWithContext(
      <AnnouncementsModal />,
      {
        initialState,
        mocks: {
          AnnouncementConnection: () => ({
            nodes: () => [
              {
                body: 'This is  a test for the new modal',
                id: '24',
                title: 'Another Test 17',
                actions: {
                  nodes: [
                    {
                      label: 'Track this action',
                      id: '18',
                      action: 'track',
                      args: 'some action to track',
                    },
                  ],
                },
              },
            ],
          }),
        },
      },
    );
    await flushMicrotasksQueue();

    expect(getByTestId('CompleteAnnouncementActionButton')).toBeTruthy();
    await fireEvent.press(getByTestId('CompleteAnnouncementActionButton'));
    expect(useMutation).toHaveBeenMutatedWith(HANDLE_ANNOUNCEMENTS, {
      variables: {
        input: { announcementId: '24', announcementActionId: '18' },
      },
    });
    snapshot();
  });
  it('Should change modal visibility when they click the modal action button', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AnnouncementsModal />,
      {
        initialState,
        mocks: {
          AnnouncementConnection: () => ({
            nodes: () => [
              {
                body: 'This is  a test for the new modal',
                id: '24',
                title: 'Another Test 17',
                actions: {
                  nodes: [
                    {
                      label: 'Go To Google',
                      id: '18',
                      action: 'go',
                      args: 'https://www.google.com/',
                    },
                  ],
                },
              },
            ],
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    recordSnapshot();
    expect(getByTestId('CompleteAnnouncementActionButton')).toBeTruthy();
    await fireEvent.press(getByTestId('CompleteAnnouncementActionButton'));
    expect(useMutation).toHaveBeenMutatedWith(HANDLE_ANNOUNCEMENTS, {
      variables: {
        input: { announcementId: '24', announcementActionId: '18' },
      },
    });
    diffSnapshot();
  });
});
