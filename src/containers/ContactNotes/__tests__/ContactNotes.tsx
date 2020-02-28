import React from 'react';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { useIsFocused } from 'react-navigation-hooks';

import { renderWithContext } from '../../../../testUtils';
import { ORG_PERMISSIONS, ANALYTICS_ASSIGNMENT_TYPE } from '../../../constants';
import { getPersonNote, savePersonNote } from '../../../actions/person';
import { orgPermissionSelector } from '../../../selectors/people';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import ContactNotes from '..';

jest.mock('react-native-device-info');
jest.mock('react-navigation-hooks');
jest.mock('../../../actions/person');
jest.mock('../../../selectors/people');
jest.mock('../../../utils/hooks/useAnalytics');

const person = { id: '141234', first_name: 'Roger' };
const myPersonId = '123';
const myUserId = '1';
const note = { id: '988998', content: 'Roge rules' };
const orgPermission = { id: '2', permission_id: ORG_PERMISSIONS.USER };

const initialState = {
  auth: { person: { id: myPersonId, user: { id: myUserId } } },
};

beforeEach(() => {
  (useIsFocused as jest.Mock).mockReturnValue(true);
  (getPersonNote as jest.Mock).mockReturnValue(() => Promise.resolve(note));
  (savePersonNote as jest.Mock).mockReturnValue(() => Promise.resolve());
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(undefined);
});

describe('contact notes', () => {
  it('icon and prompt are shown if no notes', () => {
    renderWithContext(<ContactNotes person={person} />, {
      initialState,
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith({
      screenName: ['person', 'my notes'],
      screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'contact' },
    });
  });

  it('icon and prompt are shown if no notes as me', () => {
    renderWithContext(<ContactNotes person={{ ...person, id: myPersonId }} />, {
      initialState,
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith({
      screenName: ['person', 'my notes'],
      screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'self' },
    });
  });

  it('icon and prompt are shown if no notes as community member', () => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
      orgPermission,
    );

    renderWithContext(<ContactNotes person={person} />, {
      initialState,
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith({
      screenName: ['person', 'my notes'],
      screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'community member' },
    });
  });

  it('notes are shown', async () => {
    const { snapshot } = renderWithContext(<ContactNotes person={person} />, {
      initialState,
    });

    await flushMicrotasksQueue();

    snapshot();

    expect(useAnalytics).toHaveBeenCalledWith({
      screenName: ['person', 'my notes'],
      screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'contact' },
    });
    expect(getPersonNote).toHaveBeenCalledWith(person.id, myUserId);
  });

  describe('press bottom button', () => {
    it('switches to editing state', async () => {
      const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
        <ContactNotes person={person} />,
        {
          initialState,
        },
      );

      await flushMicrotasksQueue();
      recordSnapshot();

      fireEvent.press(getByTestId('bottomButton'));

      diffSnapshot();
    });

    it('saves and switches to not editing state', async () => {
      const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
        <ContactNotes person={person} />,
        {
          initialState,
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
      <ContactNotes person={person} />,
      {
        initialState,
      },
    );

    expect(savePersonNote).not.toHaveBeenCalled();

    await flushMicrotasksQueue();
    fireEvent.press(getByTestId('bottomButton'));

    (useIsFocused as jest.Mock).mockReturnValue(false);
    rerender(<ContactNotes person={person} />);

    expect(savePersonNote).toHaveBeenCalledWith(
      person.id,
      note.content,
      note.id,
      myUserId,
    );
  });
});
