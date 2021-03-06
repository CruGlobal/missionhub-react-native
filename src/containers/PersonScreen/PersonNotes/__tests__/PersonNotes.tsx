import React from 'react';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { useIsFocused } from 'react-navigation-hooks';

import { renderWithContext } from '../../../../../testUtils';
import { ORG_PERMISSIONS } from '../../../../constants';
import { getPersonNote, savePersonNote } from '../../../../actions/person';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import * as common from '../../../../utils/common';
import { PersonCollapsibleHeaderContext } from '../../PersonTabs';
import { PersonNotes } from '..';

jest.mock('react-native-device-info');
jest.mock('react-navigation-hooks', () => ({
  // @ts-ignore
  ...jest.requireActual('react-navigation-hooks'),
  useIsFocused: jest.fn(),
}));
jest.mock('../../../../actions/person');
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('../../../../auth/authStore', () => ({
  isAuthenticated: () => true,
}));

const personId = '141234';
const orgId = '234';
const person = {
  id: personId,
  first_name: 'Roger',
  organizational_permissions: [
    { organization_id: orgId, permission_id: ORG_PERMISSIONS.OWNER },
  ],
};
const myPersonId = '123';
const myUserId = '1';
const note = { id: '988998', content: 'Roge rules' };

const initialState = {
  people: {
    people: {
      [person.id]: person,
      [myPersonId]: { id: myPersonId },
    },
  },
};

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
  (useIsFocused as jest.Mock).mockReturnValue(true);
  (getPersonNote as jest.Mock).mockReturnValue(() => Promise.resolve(note));
  (savePersonNote as jest.Mock).mockReturnValue(() => Promise.resolve());
});

describe('contact notes', () => {
  it('icon and prompt are shown if no notes', async () => {
    (getPersonNote as jest.Mock).mockReturnValue(() => Promise.resolve());
    const { snapshot } = renderWithContext(
      <PersonNotes collapsibleHeaderContext={PersonCollapsibleHeaderContext} />,
      {
        initialState,
        navParams: { personId },
        mocks: {
          User: () => ({ id: myUserId, person: () => ({ id: myPersonId }) }),
        },
      },
    );

    await flushMicrotasksQueue();

    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(['person', 'my notes']);
  });

  it('icon and prompt are shown if no notes as me', async () => {
    (getPersonNote as jest.Mock).mockReturnValue(() => Promise.resolve());
    const { snapshot } = renderWithContext(
      <PersonNotes collapsibleHeaderContext={PersonCollapsibleHeaderContext} />,
      {
        initialState,
        navParams: { personId: myPersonId },
        mocks: {
          User: () => ({ id: myUserId, person: () => ({ id: myPersonId }) }),
        },
      },
    );

    await flushMicrotasksQueue();

    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(['person', 'my notes']);
  });

  it('notes are shown', async () => {
    const { snapshot } = renderWithContext(
      <PersonNotes collapsibleHeaderContext={PersonCollapsibleHeaderContext} />,
      {
        initialState,
        navParams: { personId },
        mocks: {
          User: () => ({ id: myUserId, person: () => ({ id: myPersonId }) }),
        },
      },
    );

    await flushMicrotasksQueue();

    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(['person', 'my notes']);
    expect(getPersonNote).toHaveBeenCalledWith(person.id, myUserId);
  });

  describe('press bottom button', () => {
    it('switches to editing state', async () => {
      const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
        <PersonNotes
          collapsibleHeaderContext={PersonCollapsibleHeaderContext}
        />,
        {
          initialState,
          navParams: { personId },
          mocks: {
            User: () => ({ id: myUserId, person: () => ({ id: myPersonId }) }),
          },
        },
      );

      await flushMicrotasksQueue();
      recordSnapshot();

      fireEvent.press(getByTestId('bottomButton'));

      diffSnapshot();
    });

    it('switches to editing state on android', async () => {
      ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
      const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
        <PersonNotes
          collapsibleHeaderContext={PersonCollapsibleHeaderContext}
        />,
        {
          initialState,
          navParams: { personId },
          mocks: {
            User: () => ({ id: myUserId, person: () => ({ id: myPersonId }) }),
          },
        },
      );

      await flushMicrotasksQueue();
      recordSnapshot();

      fireEvent.press(getByTestId('bottomButton'));

      diffSnapshot();
    });

    it('saves and switches to not editing state', async () => {
      const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
        <PersonNotes
          collapsibleHeaderContext={PersonCollapsibleHeaderContext}
        />,
        {
          initialState,
          navParams: { personId },
          mocks: {
            User: () => ({ id: myUserId, person: () => ({ id: myPersonId }) }),
          },
        },
      );

      await flushMicrotasksQueue();
      fireEvent.press(getByTestId('bottomButton'));
      recordSnapshot();

      fireEvent.press(getByTestId('bottomButton'));

      diffSnapshot();
      expect(getPersonNote).toHaveBeenCalledWith(person.id, myUserId);
      expect(savePersonNote).toHaveBeenCalledWith(
        person.id,
        note.content,
        note.id,
        myUserId,
      );
    });
  });

  it('should save on blur', async () => {
    const { rerender, getByTestId } = renderWithContext(
      <PersonNotes collapsibleHeaderContext={PersonCollapsibleHeaderContext} />,
      {
        initialState,
        navParams: { personId },
        mocks: {
          User: () => ({ id: myUserId, person: () => ({ id: myPersonId }) }),
        },
      },
    );

    expect(savePersonNote).not.toHaveBeenCalled();

    await flushMicrotasksQueue();
    fireEvent.press(getByTestId('bottomButton'));

    (useIsFocused as jest.Mock).mockReturnValue(false);
    rerender(
      <PersonNotes
        collapsibleHeaderContext={PersonCollapsibleHeaderContext}
        // @ts-ignore
        forceRerender
      />,
    );

    expect(savePersonNote).toHaveBeenCalledWith(
      person.id,
      note.content,
      note.id,
      myUserId,
    );
  });
});
