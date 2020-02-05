import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { MockList } from 'graphql-tools';

import { renderWithContext } from '../../../../testUtils';

import AnnouncementsModal, { GET_ANNOUNCEMENT, HANDLE_ANNOUNCEMENT } from '..';

const initialState = {};
it('renders correctly', async () => {
  renderWithContext(<AnnouncementsModal />, {
    initialState,
    mocks: {
      Announcement: () => new MockList(1),
    },
  });
  await flushMicrotasksQueue();

  expect(useQuery).toHaveBeenCalledWith(GET_ANNOUNCEMENT);
});

it('Should not render if there are no announcements', async () => {
  const { snapshot } = renderWithContext(<AnnouncementsModal />, {
    initialState,
    mocks: {
      Announcement: () => null,
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_ANNOUNCEMENT);
});

describe('User clicks the close button', () => {
  it('Should find the testId for the close button', async () => {
    const { getByTestId } = renderWithContext(<AnnouncementsModal />, {
      initialState,
      mocks: {
        Announcement: () => new MockList(1),
      },
    });
    await flushMicrotasksQueue();

    expect(getByTestId('CloseButton')).toBeTruthy();
  });

  it('Should fire the HANDLE_ANNOUNCEMENTS mutation when the user clicks the close button', async () => {
    const { getByTestId } = renderWithContext(<AnnouncementsModal />, {
      initialState,
      mocks: {
        Announcement: () => new MockList(1),
      },
    });
    await flushMicrotasksQueue();

    await fireEvent.press(getByTestId('CloseButton'));
    expect(useMutation).toHaveBeenMutatedWith(HANDLE_ANNOUNCEMENT, {
      variables: { input: { announcementId: '1' } },
    });
  });
});

describe('User clicks the Modal Action Button', () => {
  it('should find the modals action button', async () => {
    const { getByTestId } = renderWithContext(<AnnouncementsModal />, {
      initialState,
      mocks: {
        Announcement: () => ({
          body: 'This is  a test for the new modal',
          id: '24',
          title: 'Another Test 17',
          actions: {
            nodes: [
              {
                label: 'Go To Google',
                id: '18',
                uri: 'https://www.google.com/',
              },
            ],
          },
        }),
      },
    });
    await flushMicrotasksQueue();

    expect(getByTestId('AnnouncementActionButton')).toBeTruthy();
  });

  it('Should fire the HANDLE_ANNOUNCEMENT mutation with no action', async () => {
    const { getByTestId, snapshot } = renderWithContext(
      <AnnouncementsModal />,
      {
        initialState,
        mocks: {
          Announcement: () => ({
            body: 'This is  a test for the new modal',
            id: '24',
            title: 'Another Test 17',
            actions: { nodes: [] },
          }),
        },
      },
    );
    await flushMicrotasksQueue();

    expect(getByTestId('AnnouncementNoActionButton')).toBeTruthy();
    snapshot();
    await fireEvent.press(getByTestId('AnnouncementNoActionButton'));
    expect(useMutation).toHaveBeenMutatedWith(HANDLE_ANNOUNCEMENT, {
      variables: {
        input: { announcementId: '24' },
      },
    });
    expect(getByTestId('AnnouncementNoActionButton').props.text).toEqual(
      'Done',
    );
  });

  it('Should fire the HANDLE_ANNOUCMENTS mutation when the user clicks the modals action button | GO and Track action', async () => {
    const { getByTestId, snapshot } = renderWithContext(
      <AnnouncementsModal />,
      {
        initialState,
        mocks: {
          Announcement: () => ({
            body: 'This is  a test for the new modal',
            id: '24',
            title: 'Another Test 17',
            actions: {
              nodes: [
                {
                  label: 'Go To Google',
                  id: '18',
                  uri: 'https://www.google.com/',
                  trackAction: 'some action to track',
                },
              ],
            },
          }),
        },
      },
    );
    await flushMicrotasksQueue();

    expect(getByTestId('AnnouncementActionButton')).toBeTruthy();
    await fireEvent.press(getByTestId('AnnouncementActionButton'));
    expect(useMutation).toHaveBeenMutatedWith(HANDLE_ANNOUNCEMENT, {
      variables: {
        input: { announcementId: '24', announcementActionId: '18' },
      },
    });
    expect(getByTestId('AnnouncementActionButton').props.text).toEqual(
      'GO TO GOOGLE',
    );
    snapshot();
  });

  it('Should fire the HANDLE_ANNOUCMENTS mutation when the user clicks the modals action button | GO action', async () => {
    const { getByTestId, snapshot } = renderWithContext(
      <AnnouncementsModal />,
      {
        initialState,
        mocks: {
          Announcement: () => ({
            body: 'This is  a test for the new modal',
            id: '24',
            title: 'Another Test 17',
            actions: {
              nodes: [
                {
                  label: 'Go To Google',
                  id: '18',
                  uri: 'https://www.google.com/',
                },
              ],
            },
          }),
        },
      },
    );
    await flushMicrotasksQueue();

    expect(getByTestId('AnnouncementActionButton')).toBeTruthy();
    await fireEvent.press(getByTestId('AnnouncementActionButton'));
    expect(useMutation).toHaveBeenMutatedWith(HANDLE_ANNOUNCEMENT, {
      variables: {
        input: { announcementId: '24', announcementActionId: '18' },
      },
    });
    expect(getByTestId('AnnouncementActionButton').props.text).toEqual(
      'GO TO GOOGLE',
    );
    snapshot();
  });

  it('Should fire the HANDLE_ANNOUCMENTS mutation when the user clicks the modals action button | Track action', async () => {
    const { getByTestId, snapshot } = renderWithContext(
      <AnnouncementsModal />,
      {
        initialState,
        mocks: {
          Announcement: () => ({
            body: 'This is  a test for the new modal',
            id: '24',
            title: 'Another Test 17',
            actions: {
              nodes: [
                {
                  label: 'Track this action',
                  id: '18',
                  trackAction: 'some action to track',
                },
              ],
            },
          }),
        },
      },
    );
    await flushMicrotasksQueue();

    expect(getByTestId('AnnouncementActionButton')).toBeTruthy();
    await fireEvent.press(getByTestId('AnnouncementActionButton'));
    expect(useMutation).toHaveBeenMutatedWith(HANDLE_ANNOUNCEMENT, {
      variables: {
        input: { announcementId: '24', announcementActionId: '18' },
      },
    });
    expect(getByTestId('AnnouncementActionButton').props.text).toEqual(
      'TRACK THIS ACTION',
    );
    snapshot();
  });

  it('Should call useQuery again to refetch more announcements after user clicks an action', async () => {
    const { getByTestId } = renderWithContext(<AnnouncementsModal />, {
      initialState,
      mocks: {
        Announcement: () => ({
          body: 'This is  a test for the new modal',
          id: '24',
          title: 'Another Test 17',
          actions: {
            nodes: [
              {
                label: 'Go To Google',
                id: '18',
                uri: 'https://www.google.com/',
              },
            ],
          },
        }),
      },
    });
    await flushMicrotasksQueue();
    expect(getByTestId('AnnouncementActionButton')).toBeTruthy();
    await fireEvent.press(getByTestId('AnnouncementActionButton'));
    expect(useMutation).toHaveBeenMutatedWith(HANDLE_ANNOUNCEMENT, {
      variables: {
        input: { announcementId: '24', announcementActionId: '18' },
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_ANNOUNCEMENT);
  });
});
