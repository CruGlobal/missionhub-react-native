/* eslint-disable max-lines */

import React from 'react';
import { Alert, ActionSheetIOS } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { DrawerActions } from 'react-navigation-drawer';

import { renderWithContext } from '../../../../testUtils';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
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
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { PERSON_FRAGMENT } from '../../../containers/PersonItem/queries';
import { PersonFragment } from '../../../containers/PersonItem/__generated__/PersonFragment';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/person');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('react-navigation-drawer');
jest.mock('../../../components/ImagePicker', () => 'ImagePicker');
jest.mock('../../../auth/authStore', () => ({ isAuthenticated: () => true }));

const me = { id: '99' };
const contactId = '23';
const contactFName = 'Christian';
const organization = { id: '2' };
const person = {
  id: contactId,
  firstName: contactFName,
  organization,
};
const mockImage = 'base64image.jpeg';

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
const closeDrawerResults = { type: 'drawer closed' };
const next = jest.fn();

const mockPerson = mockFragment<PersonFragment>(PERSON_FRAGMENT);

const initialState = {
  drawer: { isOpen: false },
};

beforeEach(() => {
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResponse);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResults);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResults);
  (getPersonDetails as jest.Mock).mockReturnValue(getPersonDetailsResults);
  next.mockReturnValue(nextResponse);
  (DrawerActions.closeDrawer as jest.Mock).mockReturnValue(closeDrawerResults);
  Alert.alert = jest.fn();
});

it('renders correctly | With Person', async () => {
  const { snapshot } = renderWithContext(<AddContactScreen next={next} />, {
    initialState,
    navParams: {
      organization,
      person,
    },
    mocks: {
      Query: () => ({
        person: () => ({
          firstName: person.firstName,
          lastName: '',
          id: person.id,
          relationshipType: null,
          stage: {
            name: 'Forgiven',
          },
        }),
        currentUser: () => ({ person: () => ({ id: me.id }) }),
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

it('renders correctly | No Person', async () => {
  const { snapshot } = renderWithContext(<AddContactScreen next={next} />, {
    initialState,
    navParams: {
      organization,
      person: {},
    },
    mocks: { User: () => ({ person: () => ({ id: me.id }) }) },
  });

  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_PERSON, {
    variables: {
      id: '',
    },
    onCompleted: expect.any(Function),
    skip: true,
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
          User: () => ({ person: () => ({ id: me.id }) }),
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
  it('calls next', async () => {
    const { getByTestId } = renderWithContext(
      <AddContactScreen next={next} />,
      {
        initialState,
        navParams: {
          organization,
          person,
        },
        mocks: { User: () => ({ person: () => ({ id: me.id }) }) },
      },
    );

    await flushMicrotasksQueue();

    fireEvent.press(getByTestId('CloseButton'));
    expect(next).toHaveBeenCalledWith({
      personId: undefined,
      relationshipType: undefined,
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
            User: () => ({ person: () => ({ id: me.id }) }),
          },
        });

        await flushMicrotasksQueue();

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
        expect(DrawerActions.closeDrawer).toHaveBeenLastCalledWith();

        expect(store.getActions()).toEqual([
          loadPersonResults,
          trackActionResponse,
          closeDrawerResults,
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
              User: () => ({ person: () => ({ id: me.id }) }),
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
          didSavePerson: true,
          isMe: false,
        });
        expect(DrawerActions.closeDrawer).toHaveBeenLastCalledWith();

        expect(store.getActions()).toEqual([
          loadPersonResults,
          trackActionResponse,
          closeDrawerResults,
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
              User: () => ({ person: () => ({ id: me.id }) }),
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
        expect(DrawerActions.closeDrawer).toHaveBeenLastCalledWith();

        expect(store.getActions()).toEqual([
          getPersonDetailsResults,
          closeDrawerResults,
          nextResponse,
        ]);
      });

      it('updates users profile picture', async () => {
        const { getByTestId, snapshot, store } = renderWithContext(
          <AddContactScreen next={next} />,
          {
            initialState,
            navParams: {
              organization: undefined,
              person: {
                id: me.id,
              },
            },
            mocks: {
              Person: () => ({
                firstName: newName,
                lastName: '',
                id: me.id,
                relationshipType: null,
                stage: {
                  name: 'Forgiven',
                },
                picture: null,
              }),
              User: () => ({ person: () => ({ id: me.id }) }),
              ID: () => me.id, // Make auth person and person id the same. Only specifying User without this causes useQuery to return undefined for data for some reason
            },
          },
        );

        await flushMicrotasksQueue();

        snapshot();
        await fireEvent(getByTestId('avatarImagePicker'), 'onSelectImage', {
          data: `data:image/jpeg;base64,${mockImage}`,
        });
        fireEvent(getByTestId('contactFields'), 'onUpdateData');
        await fireEvent.press(getByTestId('continueButton'));
        expect(useQuery).toHaveBeenCalledWith(GET_PERSON, {
          variables: {
            id: me.id,
          },
          onCompleted: expect.any(Function),
          skip: false,
        });
        expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
          variables: {
            input: {
              id: me.id,
              firstName: newName,
              lastName: '',
              relationshipType: null,
              picture: `data:image/jpeg;base64,${mockImage}`,
            },
          },
        });
        expect(trackActionWithoutData).not.toHaveBeenCalled();

        expect(next).toHaveBeenCalledWith({
          personId: me.id,
          relationshipType: null,
          orgId: undefined,
          didSavePerson: true,
          isMe: true,
        });
        expect(DrawerActions.closeDrawer).toHaveBeenLastCalledWith();

        expect(store.getActions()).toEqual([
          getPersonDetailsResults,
          closeDrawerResults,
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
              User: () => ({ person: () => ({ id: me.id }) }),
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
          didSavePerson: true,
          isMe: false,
        });
        expect(DrawerActions.closeDrawer).toHaveBeenLastCalledWith();

        expect(store.getActions()).toEqual([
          getPersonDetailsResults,
          closeDrawerResults,
          nextResponse,
        ]);
      });
      it('should navigate to select a stage', async () => {
        const stageId = '1';
        const stageName = 'Forgiven';

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
                  ...mockPerson.stage,
                  id: stageId,
                  name: stageName,
                },
                steps: {
                  ...mockPerson.steps,
                },
                picture: null,
              }),
              User: () => ({ person: () => ({ id: me.id }) }),
            },
          },
        );

        await flushMicrotasksQueue();

        fireEvent.press(getByTestId('stageSelectButton'));

        expect(next).toHaveBeenCalledWith({
          navigateToStageSelection: true,
          person: {
            firstName: newName,
            __typename: 'Person',
            lastName: '',
            fullName: 'esse repellat quisquam',
            id: person.id,
            relationshipType: null,
            stage: {
              ...mockPerson.stage,
              __typename: 'Stage',
              id: stageId,
              name: stageName,
            },
            steps: {
              ...mockPerson.steps,
              __typename: 'StepConnection',
              pageInfo: {
                ...mockPerson.steps.pageInfo,
                __typename: 'BasePageInfo',
              },
            },
            picture: null,
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
              User: () => ({ person: () => ({ id: me.id }) }),
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
        expect(DrawerActions.closeDrawer).toHaveBeenLastCalledWith();

        expect(store.getActions()).toEqual([
          getPersonDetailsResults,
          closeDrawerResults,
          nextResponse,
        ]);
      });
    });
  });
});
