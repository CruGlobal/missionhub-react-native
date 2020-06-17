import React from 'react';
import { Alert, ActionSheetIOS } from 'react-native';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { PersonHeader } from '../PersonHeader';
import {
  personTabs,
  PersonCollapsibleHeaderContext,
} from '../../../containers/PersonScreen/PersonTabs';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { EDIT_PERSON_FLOW } from '../../../routes/constants';
import { deleteContactAssignment } from '../../../actions/person';

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'navigatePush' })),
  navigateBack: jest.fn(() => ({ type: 'navigateBack' })),
}));
jest.mock('../../../actions/person', () => ({
  deleteContactAssignment: jest.fn(() => ({ type: 'deleteContactAssignment' })),
}));

ActionSheetIOS.showActionSheetWithOptions = jest.fn();
Alert.alert = jest.fn();

const personId = '1';
const myId = '2';

const testPersonTabs = personTabs({ isMe: false });

const initialState = {
  auth: { person: { id: myId } },
};

it('should render loading', () => {
  renderWithContext(
    <PersonHeader
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
    {
      navParams: { personId },
      initialState,
    },
  ).snapshot();
});

it('should render me loading', () => {
  renderWithContext(
    <PersonHeader
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
    {
      navParams: { personId: myId },
      initialState,
    },
  ).snapshot();
});

it('should load person data correctly', async () => {
  const { recordSnapshot, diffSnapshot } = renderWithContext(
    <PersonHeader
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
    {
      navParams: { personId },
      initialState,
    },
  );

  recordSnapshot();
  await flushMicrotasksQueue();
  diffSnapshot();
});

it('should hide edit, delete, and stage for members', async () => {
  const { rerender, recordSnapshot, diffSnapshot } = renderWithContext(
    <PersonHeader
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
    {
      navParams: { personId },
      initialState,
    },
  );

  await flushMicrotasksQueue();

  recordSnapshot();
  rerender(
    <PersonHeader
      isMember
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
  );
  diffSnapshot();
});

it('should handle edit me', async () => {
  const { getByTestId } = renderWithContext(
    <PersonHeader
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
    {
      navParams: { personId: myId },
      initialState,
    },
  );

  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('editButton'));

  expect(navigatePush).toHaveBeenCalledWith(EDIT_PERSON_FLOW, {
    person: { id: myId },
  });
});

it('should handle edit person', async () => {
  const { getByTestId } = renderWithContext(
    <PersonHeader
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
    {
      navParams: { personId },
      initialState,
    },
  );

  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('popupMenuButton'));
  (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](0);

  expect(navigatePush).toHaveBeenCalledWith(EDIT_PERSON_FLOW, {
    person: { id: personId },
  });
});

it('should handle delete person', async () => {
  const { getByTestId } = renderWithContext(
    <PersonHeader
      collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      tabs={testPersonTabs}
    />,
    {
      navParams: { personId },
      initialState,
    },
  );

  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('popupMenuButton'));
  (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](1);

  expect(Alert.alert).toHaveBeenCalledWith(
    'Delete Hayden Zieme?',
    'Are you sure you want to delete this person?',
    [
      { style: 'cancel', text: 'Cancel' },
      { onPress: expect.any(Function), style: 'destructive', text: 'Delete' },
    ],
  );

  (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress();
  expect(deleteContactAssignment).toHaveBeenCalledWith(personId);
  expect(navigateBack).toHaveBeenCalledWith();
});
