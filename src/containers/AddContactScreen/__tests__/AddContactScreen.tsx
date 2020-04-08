/* eslint max-lines: 0 */

import React from 'react';
import { Alert, ActionSheetIOS } from 'react-native';
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
import { getPersonDetails } from '../../../actions/person';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';

import AddContactScreen from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
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
const getPersonDetailsResults = { type: 'get person details' };
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
  (getPersonDetails as jest.Mock).mockReturnValue(getPersonDetailsResults);
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
        stage: {
          name: 'Forgiven',
        },
      }),
    },
  });

  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_PERSON, {
    variables: {
      id: person.id,
    },
    onCompleted: expect.any(Function),
    skip: false,
  });

  expect(useAnalytics).toHaveBeenCalledWith(['people', 'add']);
});

describe('handleUpdateData', () => {
  it('should update the state', async () => {
    const { getByTestId, snapshot } = renderWithContext(
      <AddContactScreen next={next} />,
      {
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
            stage: {
              name: 'Forgiven',
            },
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    expect(useQuery).toHaveBeenCalledWith(GET_PERSON, {
      variables: {
        id: person.id,
      },
      onCompleted: expect.any(Function),
      skip: false,
    });
    fireEvent(getByTestId('firstNameInput'), 'onChangeText', 'GreatGuy');
    fireEvent(getByTestId('contactFields'), 'onUpdateData');
    snapshot();
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
    fireEvent.press(getByTestId('closeIcon'));
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
      it('should add a new person', async () => {
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
              stage: null,
            }),
          },
        });
        recordSnapshot();
        fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        diffSnapshot();
        await flushMicrotasksQueue();
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
      it('should add a new person', async () => {
        const { getByTestId, snapshot, store } = renderWithContext(
          <AddContactScreen next={next} />,
          {
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
                stage: null,
              }),
            },
          },
        );
        await flushMicrotasksQueue();

        fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        snapshot();
        expect(useQuery).toHaveBeenCalledWith(GET_PERSON, {
          variables: {
            id: '',
          },
          onCompleted: expect.any(Function),
          skip: true,
        });
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
      it('should update person and navigate back', async () => {
        ActionSheetIOS.showActionSheetWithOptions = jest.fn();

        const { getByTestId, snapshot, store } = renderWithContext(
          <AddContactScreen next={next} />,
          {
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
                stage: {
                  name: 'Forgiven',
                },
              }),
            },
          },
        );
        await flushMicrotasksQueue();

        fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        fireEvent(getByTestId('popupMenuButton'), 'onPress');
        (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][1](
          1,
        );
        fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));

        snapshot();
        expect(useQuery).toHaveBeenCalledWith(GET_PERSON, {
          variables: {
            id: person.id,
          },
          onCompleted: expect.any(Function),
          skip: false,
        });
        expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
          variables: {
            input: {
              firstName: newName,
              lastName: '',
              id: person.id,
              relationshipType: RelationshipTypeEnum.friend,
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

        expect(store.getActions()).toEqual([
          getPersonDetailsResults,
          nextResponse,
        ]);
      });
    });

    describe('with org', () => {
      it('should update person and navigate back', async () => {
        const { getByTestId, snapshot, store } = renderWithContext(
          <AddContactScreen next={next} />,
          {
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
                stage: {
                  name: 'Forgiven',
                },
              }),
            },
          },
        );
        await flushMicrotasksQueue();
        snapshot();
        fireEvent(getByTestId('firstNameInput'), 'onChangeText', newName);
        fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        expect(trackActionWithoutData).not.toHaveBeenCalled();

        expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
          variables: {
            input: {
              firstName: newName,
              lastName: '',
              id: person.id,
              relationshipType: null,
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

        expect(store.getActions()).toEqual([
          getPersonDetailsResults,
          nextResponse,
        ]);
      });
      it('should navigate to select a stage', async () => {
        const handleUpdateData = expect.any(Function);
        const { getByTestId, store } = renderWithContext(
          <AddContactScreen next={next} />,
          {
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
                stage: {
                  name: 'Forgiven',
                },
              }),
            },
          },
        );
        await flushMicrotasksQueue();
        fireEvent.press(getByTestId('stageSelectButton'));

        expect(next).toHaveBeenCalledWith({
          orgId: organization?.id,
          selectStage: true,
          person: {
            firstName: newName,
            __typename: 'Person',
            lastName: '',
            id: person.id,
            relationshipType: null,
            stage: {
              __typename: 'Stage',
              name: 'Forgiven',
            },
          },
          updatePerson: handleUpdateData,
        });
        expect(store.getActions()).toEqual([nextResponse]);
      });
    });

    describe('set last name to null', () => {
      it('should update person and navigate back', async () => {
        const { getByTestId, snapshot, store } = renderWithContext(
          <AddContactScreen next={next} />,
          {
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
                stage: {
                  name: 'Forgiven',
                },
              }),
            },
          },
        );
        await flushMicrotasksQueue();

        fireEvent(getByTestId('lastNameInput'), 'onChangeText', '');
        fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        snapshot();

        expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
          variables: {
            input: {
              firstName: newName,
              lastName: '',
              id: person.id,
              relationshipType: null,
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

        expect(store.getActions()).toEqual([
          getPersonDetailsResults,
          nextResponse,
        ]);
      });
    });
  });
});
