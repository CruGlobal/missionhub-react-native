/* eslint max-lines: 0 */

import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { useIsMe } from '../../../utils/hooks/useIsMe';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import {
  trackActionWithoutData,
  trackScreenChange,
} from '../../../actions/analytics';
import {
  CREATE_PERSON,
  UPDATE_PERSON,
} from '../../../containers/SetupScreen/queries';
import { ACTIONS, LOAD_PERSON_DETAILS } from '../../../constants';
import { GET_PERSON } from '../queries';

import AddContactScreen from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../utils/hooks/useIsMe');

const me = { id: '99' };
const contactId = '23';
const contactFName = 'Christian';
const organization = { id: '2' };
const person = {
  id: contactId,
  firstName: contactFName,
  organization,
};

const trackActionResponse = { type: 'track action' };
const trackScreenChangeResponse = { type: 'track screen change' };
const nextResponse = { type: 'next' };
const navigateBackResults = { type: 'navigate back' };
const navigatePushResults = { type: 'navigate push' };
const loadPersonResults = {
  person: {
    first_name: 'new name',
    last_name: '',
    id: contactId,
  },
  type: LOAD_PERSON_DETAILS,
};
const next = jest.fn();

const initialState = {
  auth: { person: me, isJean: false },
  drawer: { isOpen: false },
};

beforeEach(() => {
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResponse);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResults);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResults);
  (useIsMe as jest.Mock).mockReturnValue(false);
  next.mockReturnValue(nextResponse);
  Alert.alert = jest.fn();
});

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<AddContactScreen next={next} />, {
    initialState,
    navParams: {
      organization,
      person,
    },
    mocks: {
      Person: () => ({
        firstName: person.firstName,
        lastName: '',
        id: person.id,
        relationshipType: null,
      }),
    },
  });

  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_PERSON, {
    variables: {
      id: person.id,
    },
  });

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
        mocks: {
          Person: () => ({
            firstName: 'GreatGuy',
            lastName: '',
            id: person.id,
            relationshipType: null,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    recordSnapshot();

    expect(useQuery).toHaveBeenCalledWith(GET_PERSON, {
      variables: {
        id: person.id,
      },
    });
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
        mocks: {
          Person: () => ({
            firstName: newName,
            lastName: '',
            id: person.id,
            relationshipType: null,
          }),
        },
      });

      it('should add a new person', async () => {
        recordSnapshot();
        await fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        await fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        diffSnapshot();
        expect(useMutation).toHaveBeenMutatedWith(CREATE_PERSON, {
          variables: {
            input: {
              firstName: newName,
              lastName: '',
              assignToMe: true,
            },
          },
        });
        expect(trackActionWithoutData).toHaveBeenCalledWith(
          ACTIONS.PERSON_ADDED,
        );
        expect(next).toHaveBeenCalledWith({
          personId: person.id,
          relationshipType: null,
          orgId: undefined,
          didSavePerson: true,
          isMe: false,
        });

        expect(store.getActions()).toEqual([
          loadPersonResults,
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
        mocks: {
          Person: () => ({
            firstName: newName,
            lastName: '',
            id: person.id,
            relationshipType: null,
          }),
        },
      });

      it('should add a new person', async () => {
        recordSnapshot();
        await fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        await fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        diffSnapshot();
        expect(useMutation).toHaveBeenMutatedWith(CREATE_PERSON, {
          variables: {
            input: {
              firstName: newName,
              lastName: '',
              assignToMe: true,
            },
          },
        });
        expect(trackActionWithoutData).toHaveBeenCalledWith(
          ACTIONS.PERSON_ADDED,
        );
        expect(next).toHaveBeenCalledWith({
          personId: person.id,
          relationshipType: null,
          orgId: organization.id,
          didSavePerson: true,
          isMe: false,
        });

        expect(store.getActions()).toEqual([
          loadPersonResults,
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
        mocks: {
          Person: () => ({
            firstName: newName,
            lastName: '',
            id: person.id,
            relationshipType: null,
          }),
        },
      });

      it('should update person and navigate back', async () => {
        recordSnapshot();
        await fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        await fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        diffSnapshot();
        await flushMicrotasksQueue();
        expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
          variables: {
            input: {
              firstName: newName,
              lastName: '',
              id: person.id,
            },
          },
        });
        expect(trackActionWithoutData).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith({
          personId: person.id,
          relationshipType: null,
          orgId: undefined,
          didSavePerson: true,
          isMe: false,
        });

        expect(store.getActions()).toEqual([loadPersonResults, nextResponse]);
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
        mocks: {
          Person: () => ({
            firstName: newName,
            lastName: '',
            id: person.id,
            relationshipType: null,
          }),
        },
      });

      it('should update person and navigate back', async () => {
        recordSnapshot();
        await fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        await fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        diffSnapshot();
        await flushMicrotasksQueue();
        expect(trackActionWithoutData).not.toHaveBeenCalled();

        expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
          variables: {
            input: {
              firstName: newName,
              lastName: '',
              id: person.id,
            },
          },
        });

        expect(next).toHaveBeenCalledWith({
          personId: person.id,
          relationshipType: null,
          orgId: organization.id,
          didSavePerson: true,
          isMe: false,
        });

        expect(store.getActions()).toEqual([loadPersonResults, nextResponse]);
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
            lastName: 'someLastName',
          },
        },
        mocks: {
          Person: () => ({
            firstName: newName,
            lastName: '',
            id: person.id,
            relationshipType: null,
          }),
        },
      });
      it('should update person and navigate back', async () => {
        recordSnapshot();
        await fireEvent(getByTestId('lastNameInput'), 'onChangeText', '');
        await fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        diffSnapshot();

        expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
          variables: {
            input: {
              firstName: person.firstName,
              lastName: '',
              id: person.id,
            },
          },
        });
        expect(trackActionWithoutData).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({
          personId: person.id,
          relationshipType: null,
          orgId: undefined,
          didSavePerson: true,
          isMe: false,
        });

        expect(store.getActions()).toEqual([loadPersonResults, nextResponse]);
      });
    });
  });
});
