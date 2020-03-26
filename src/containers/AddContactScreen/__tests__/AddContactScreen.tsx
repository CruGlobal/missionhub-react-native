/* eslint max-lines: 0 */

import React from 'react';
import { Alert } from 'react-native';
import i18next from 'i18next';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { useIsMe } from '../../../utils/hooks/useIsMe';
import { addNewPerson } from '../../../actions/organizations';
import { updatePerson } from '../../../actions/person';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import {
  trackActionWithoutData,
  trackScreenChange,
} from '../../../actions/analytics';
import {
  ACTIONS,
  ORG_PERMISSIONS,
  CANNOT_EDIT_FIRST_NAME,
} from '../../../constants';

import AddContactScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/person');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../utils/hooks/useIsMe');

const me = { id: '99' };
const contactId = '23';
const contactFName = 'Christian';
const organization = { id: '2' };
const mockContactAssignment = { id: '123', assigned_to: me };
const person = {
  id: contactId,
  first_name: contactFName,
  organization,
  reverse_contact_assignments: [mockContactAssignment],
};

let addNewPersonResponse = { type: 'add new person', response: person };
const updatePersonResponse = { type: 'update person', response: person };
const trackActionResponse = { type: 'track action' };
const trackScreenChangeResponse = { type: 'track screen change' };
const nextResponse = { type: 'next' };
const navigateBackResults = { type: 'navigate back' };
const navigatePushResults = { type: 'navigate push' };
const next = jest.fn();

const initialState = {
  auth: { person: me, isJean: false },
  drawer: { isOpen: false },
};

beforeEach(() => {
  (addNewPerson as jest.Mock).mockReturnValue(addNewPersonResponse);
  (updatePerson as jest.Mock).mockReturnValue(updatePersonResponse);
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResponse);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResults);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResults);
  (useIsMe as jest.Mock).mockReturnValue(false);
  next.mockReturnValue(nextResponse);
  Alert.alert = jest.fn();
});

it('renders correctly', () => {
  renderWithContext(<AddContactScreen next={next} />, {
    initialState,
    navParams: {
      organization,
      person,
    },
  }).snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['people', 'add']);
});

describe('handleUpdateData', () => {
  it('should update the state', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <AddContactScreen next={next} />,
      {
        initialState,
        navParams: {
          organization,
          person,
        },
      },
    );
    recordSnapshot();
    await fireEvent(getByTestId('firstNameInput'), 'onChangeText', 'GreatGuy');
    await fireEvent(getByTestId('contactFields'), 'onUpdateData');
    diffSnapshot();
    expect(useAnalytics).toHaveBeenCalledWith(['people', 'add']);
  });
});

describe('completeWithoutSave', () => {
  it('calls next', () => {
    const { getByTestId } = renderWithContext(
      <AddContactScreen next={next} />,
      {
        initialState,
        navParams: {
          organization,
          person,
        },
      },
    );
    fireEvent.press(getByTestId('backIcon'));
    expect(next).toHaveBeenCalledWith({
      personId: undefined,
      relationshipType: undefined,
      orgId: organization.id,
      didSavePerson: false,
      isMe: false,
    });

    expect(useAnalytics).toHaveBeenCalledWith(['people', 'add']);
  });
});

describe('savePerson', () => {
  const newName = 'new name';

  describe('add new person', () => {
    describe('without org', () => {
      const {
        getByTestId,
        recordSnapshot,
        diffSnapshot,
        store,
      } = renderWithContext(<AddContactScreen next={next} />, {
        initialState,
        navParams: {
          organization: undefined,
          person: undefined,
        },
      });

      it('should add a new person', async () => {
        recordSnapshot();
        await fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        await fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        diffSnapshot();
        expect(addNewPerson).toHaveBeenCalledWith({
          assignToMe: true,
          firstName: newName,
        });
        expect(trackActionWithoutData).toHaveBeenCalledWith(
          ACTIONS.PERSON_ADDED,
        );
        expect(next).toHaveBeenCalledWith({
          personId: addNewPersonResponse.response.id,
          relationshipType: undefined,
          orgId: undefined,
          didSavePerson: true,
          isMe: false,
        });

        expect(store.getActions()).toEqual([
          addNewPersonResponse,
          trackActionResponse,
          nextResponse,
        ]);
        expect(useAnalytics).toHaveBeenCalledWith(['people', 'add']);
      });
    });

    describe('with org', () => {
      const {
        getByTestId,
        recordSnapshot,
        diffSnapshot,
        store,
      } = renderWithContext(<AddContactScreen next={next} />, {
        initialState,
        navParams: {
          organization,
          person: undefined,
        },
      });

      it('should add a new person', async () => {
        recordSnapshot();
        await fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        await fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        diffSnapshot();
        expect(addNewPerson).toHaveBeenCalledWith({
          firstName: newName,
          orgId: organization.id,
          assignToMe: true,
        });
        expect(trackActionWithoutData).toHaveBeenCalledWith(
          ACTIONS.PERSON_ADDED,
        );
        expect(next).toHaveBeenCalledWith({
          personId: addNewPersonResponse.response.id,
          relationshipType: undefined,
          orgId: organization.id,
          didSavePerson: true,
          isMe: false,
        });

        expect(store.getActions()).toEqual([
          addNewPersonResponse,
          trackActionResponse,
          nextResponse,
        ]);
      });
    });
  });

  describe('update existing person', () => {
    describe('without org', () => {
      const {
        getByTestId,
        recordSnapshot,
        diffSnapshot,
        store,
      } = renderWithContext(<AddContactScreen next={next} />, {
        initialState,
        navParams: {
          organization: undefined,
          person,
        },
      });

      it('should update person and navigate back', async () => {
        recordSnapshot();
        await fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        await fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        diffSnapshot();
        expect(updatePerson).toHaveBeenCalledWith({
          ...person,
          firstName: newName,
          assignToMe: true,
        });
        expect(trackActionWithoutData).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith({
          personId: updatePersonResponse.response.id,
          relationshipType: undefined,
          orgId: undefined,
          didSavePerson: true,
          isMe: false,
        });

        expect(store.getActions()).toEqual([
          updatePersonResponse,
          nextResponse,
        ]);
      });
    });

    describe('with org', () => {
      const {
        getByTestId,
        recordSnapshot,
        diffSnapshot,
        store,
      } = renderWithContext(<AddContactScreen next={next} />, {
        initialState,
        navParams: {
          organization,
          person,
        },
      });

      it('should update person and navigate back', async () => {
        recordSnapshot();
        await fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        await fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        diffSnapshot();
        expect(updatePerson).toHaveBeenCalledWith({
          ...person,
          firstName: newName,
          orgId: organization.id,
          assignToMe: true,
        });
        expect(trackActionWithoutData).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith({
          personId: updatePersonResponse.response.id,
          relationshipType: undefined,
          orgId: organization.id,
          didSavePerson: true,
          isMe: false,
        });

        expect(store.getActions()).toEqual([
          updatePersonResponse,
          nextResponse,
        ]);
      });
    });

    describe('set last name to null', () => {
      const {
        getByTestId,
        recordSnapshot,
        diffSnapshot,
        store,
      } = renderWithContext(<AddContactScreen next={next} />, {
        initialState,
        navParams: {
          organization: undefined,
          person: {
            ...person,
            last_name: 'someLastName',
          },
        },
      });
      it('should update person and navigate back', async () => {
        recordSnapshot();
        await fireEvent(getByTestId('lastNameInput'), 'onChangeText', '');
        await fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        diffSnapshot();
        expect(updatePerson).toHaveBeenCalledWith({
          id: contactId,
          first_name: contactFName,
          organization,
          reverse_contact_assignments: [mockContactAssignment],
          assignToMe: true,
          lastName: '',
          last_name: 'someLastName',
        });
        expect(trackActionWithoutData).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({
          personId: updatePersonResponse.response.id,
          relationshipType: undefined,
          orgId: undefined,
          didSavePerson: true,
          isMe: false,
        });

        expect(store.getActions()).toEqual([
          updatePersonResponse,
          nextResponse,
        ]);
      });
    });

    describe('show alert', () => {
      const test = () => {
        expect(Alert.alert).toHaveBeenCalledWith(
          i18next.t('addContact:alertBlankEmail'),
          i18next.t('addContact:alertPermissionsMustHaveEmail'),
        );
      };

      describe('admin permissions', () => {
        describe('blank email, new firstName', () => {
          const { getByTestId } = renderWithContext(
            <AddContactScreen next={next} />,
            {
              initialState,
              navParams: {
                organization: undefined,
                person: {
                  ...person,
                  orgPermission: { permission_id: ORG_PERMISSIONS.ADMIN },
                },
              },
            },
          );

          it('shows alert', async () => {
            await fireEvent.press(getByTestId('continueButton'));
            test();
          });
        });

        describe('new email, blank firstName', () => {
          const { getByTestId } = renderWithContext(
            <AddContactScreen next={next} />,
            {
              initialState,
              navParams: {
                organization: undefined,
                person: {
                  ...person,
                  first_name: '',
                  email: 'test',
                  orgPermission: { permission_id: ORG_PERMISSIONS.ADMIN },
                },
              },
            },
          );

          it('shows alert', async () => {
            await fireEvent.press(getByTestId('continueButton'));
            test();
          });
        });
      });

      describe('user permissions', () => {
        describe('blank email, new firstName', () => {
          const { getByTestId } = renderWithContext(
            <AddContactScreen next={next} />,
            {
              initialState,
              navParams: {
                organization: undefined,
                person: {
                  ...person,
                  orgPermission: { permission_id: ORG_PERMISSIONS.USER },
                },
              },
            },
          );

          it('shows alert', async () => {
            await fireEvent.press(getByTestId('continueButton'));
            test();
          });
        });

        describe('new email, blank firstName', () => {
          const { getByTestId } = renderWithContext(
            <AddContactScreen next={next} />,
            {
              initialState,
              navParams: {
                organization: undefined,
                person: {
                  ...person,
                  first_name: '',
                  email: 'test',
                  orgPermission: { permission_id: ORG_PERMISSIONS.USER },
                },
              },
            },
          );

          it('shows alert', async () => {
            await fireEvent.press(getByTestId('continueButton'));
            test();
          });
        });
      });

      describe('update user fails', () => {
        beforeAll(() => {
          // @ts-ignore
          addNewPersonResponse = () =>
            Promise.reject({
              apiError: {
                errors: [
                  {
                    detail: CANNOT_EDIT_FIRST_NAME,
                  },
                ],
              },
            });
        });

        it('shows alert', async () => {
          const { getByTestId } = renderWithContext(
            <AddContactScreen next={next} />,
            {
              initialState: {
                ...initialState,
                auth: { person: me, isJean: true },
              },
              navParams: {
                organization: undefined,
                person: undefined,
              },
            },
          );

          await fireEvent(
            getByTestId('firstNameInput'),
            'onChangeText',
            newName,
          );
          await fireEvent(getByTestId('emailInput'), 'onChangeText', 'test');
          await fireEvent(getByTestId('contactFields'), 'onUpdateData');
          await fireEvent.press(getByTestId('continueButton'));
          expect(Alert.alert).toHaveBeenCalledWith(
            i18next.t('addContact:alertSorry'),
            i18next.t('addContact:alertCannotEditFirstName'),
          );
        });
      });
    });
  });
});
