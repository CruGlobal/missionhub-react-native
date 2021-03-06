import { Keyboard } from 'react-native';
import React from 'react';
import {
  fireEvent,
  GetByAPI,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import { useLogoutOnBack } from '../../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';
import { UPDATE_PERSON, CREATE_PERSON } from '../queries';
import SetupScreen from '..';
import { IdentityProvider, AuthError } from '../../../auth/constants';
import { SignInWithAnonymousType } from '../../../auth/providers/useSignInWithAnonymous';
import { useAuth } from '../../../auth/useAuth';
import { getAuthPerson } from '../../../auth/authUtilities';
import { isAuthenticated } from '../../../auth/authStore';

const myId = '123';
const personId = '1';
const mockState = {
  onboarding: { currentlyOnboarding: true },
  people: { people: {} },
};
const nextResult = { type: 'testNext' };
const next = jest.fn().mockReturnValue(nextResult);
const back = jest.fn();

const firstName = 'TestFname';
const lastName = 'TestLname';

jest.mock('../../../actions/api');
jest.mock('../../../actions/onboarding');
jest.mock('../../../actions/person');
jest.mock('../../../auth/useAuth');
jest.mock('../../../utils/hooks/useLogoutOnBack');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../auth/authUtilities');
jest.mock('../../../auth/authStore');
Keyboard.dismiss = jest.fn();

const authenticate = jest.fn();
(useAuth as jest.Mock).mockReturnValue({ authenticate, error: AuthError.None });

beforeEach(() => {
  (useLogoutOnBack as jest.Mock).mockReturnValue(back);
});

it('renders isMe version correctly', async () => {
  const { snapshot } = renderWithContext(
    <SetupScreen next={next} isMe={true} />,
    {
      initialState: mockState,
    },
  );

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['onboarding', 'self name']);
});

it('renders other person version correctly', async () => {
  const { snapshot } = renderWithContext(
    <SetupScreen next={next} isMe={false} />,
    {
      initialState: mockState,
    },
  );

  await flushMicrotasksQueue();

  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['onboarding', 'contact name']);
});

describe('setup screen methods', () => {
  it('should update first name', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <SetupScreen next={next} isMe={false} />,
      {
        initialState: mockState,
      },
    );
    recordSnapshot();
    fireEvent(getByTestId('InputFirstName'), 'onChangeText', firstName);
    diffSnapshot();
  });

  it('should update last name', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <SetupScreen next={next} isMe={false} />,
      {
        initialState: mockState,
      },
    );
    recordSnapshot();
    fireEvent(getByTestId('InputLastName'), 'onChangeText', lastName);
    diffSnapshot();
  });
});

describe('saveAndNavigateNext', () => {
  describe('update person', () => {
    let getByTestId: GetByAPI['getByTestId'];

    beforeEach(async () => {
      getByTestId = renderWithContext(
        <SetupScreen next={next} isMe={false} />,
        {
          initialState: { ...mockState, onboarding: { personId } },
          navParams: {
            relationshipType: RelationshipTypeEnum.family,
          },
        },
      ).getByTestId;
      await fireEvent(getByTestId('InputFirstName'), 'onChangeText', firstName);
      await fireEvent(getByTestId('InputLastName'), 'onChangeText', lastName);
    });

    it('should update person and call next on save btn press', async () => {
      await fireEvent.press(getByTestId('SaveBottomButton'));

      expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
        variables: {
          input: {
            id: personId,
            firstName,
            lastName,
            relationshipType: RelationshipTypeEnum.family,
          },
        },
      });
      expect(next).toHaveBeenCalledWith({ personId });
    });

    it('should update person and call next on last name submit', async () => {
      await fireEvent(getByTestId('InputLastName'), 'onSubmitEditing');

      expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
        variables: {
          input: {
            id: personId,
            firstName,
            lastName,
            relationshipType: RelationshipTypeEnum.family,
          },
        },
      });
      expect(next).toHaveBeenCalledWith({ personId });
    });
  });

  describe('create me', () => {
    it('should create person and call next', async () => {
      (getAuthPerson as jest.Mock).mockReturnValue({ id: myId });
      const { getByTestId } = renderWithContext(
        <SetupScreen next={next} isMe={true} />,
        {
          initialState: mockState,
          navParams: {
            relationshipType: RelationshipTypeEnum.neighbor,
          },
        },
      );

      await flushMicrotasksQueue();

      await fireEvent(getByTestId('InputFirstName'), 'onChangeText', firstName);
      await fireEvent(getByTestId('InputLastName'), 'onChangeText', lastName);

      await fireEvent.press(getByTestId('SaveBottomButton'));

      expect(authenticate).toHaveBeenCalledWith({
        provider: IdentityProvider.Anonymous,
        anonymousOptions: {
          type: SignInWithAnonymousType.Create,
          firstName,
          lastName,
        },
      });
      expect(next).toHaveBeenCalledWith({ personId: myId });
    });
  });

  describe('create other person', () => {
    it('should create person and call next', async () => {
      authenticate.mockReturnValue({ id: myId });
      const { getByTestId } = renderWithContext(
        <SetupScreen next={next} isMe={false} />,
        {
          initialState: mockState,
          navParams: {
            relationshipType: RelationshipTypeEnum.neighbor,
          },
        },
      );
      await fireEvent(getByTestId('InputFirstName'), 'onChangeText', firstName);
      await fireEvent(getByTestId('InputLastName'), 'onChangeText', lastName);

      await fireEvent.press(getByTestId('SaveBottomButton'));

      expect(useMutation).toHaveBeenMutatedWith(CREATE_PERSON, {
        variables: {
          input: {
            firstName,
            lastName,
            relationshipType: RelationshipTypeEnum.neighbor,
            assignToMe: true,
          },
        },
      });
      expect(next).toHaveBeenCalledWith({ personId });
    });
  });

  it('does nothing if first name is not entered', async () => {
    const { getByTestId } = renderWithContext(
      <SetupScreen next={next} isMe={false} />,
      {
        initialState: mockState,
      },
    );
    await fireEvent.press(getByTestId('SaveBottomButton'));

    expect(useMutation).not.toHaveBeenMutatedWith(CREATE_PERSON, {
      variables: {
        input: {
          firstName: '',
          lastName,
          relationshipType: RelationshipTypeEnum.neighbor,
          assignToMe: true,
        },
      },
    });

    expect(useMutation).not.toHaveBeenMutatedWith(UPDATE_PERSON, {
      variables: {
        input: {
          id: personId,
          firstName: '',
          lastName,
          relationshipType: RelationshipTypeEnum.family,
        },
      },
    });
    expect(authenticate).not.toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });
});

it('calls callback from useLogoutOnBack', async () => {
  (isAuthenticated as jest.Mock).mockReturnValue(true);
  const { getByTestId } = renderWithContext(
    <SetupScreen next={next} isMe={true} />,
    {
      initialState: mockState,
    },
  );

  await flushMicrotasksQueue();

  // With the "id" set, press the back button
  fireEvent(getByTestId('DeprecatedBackButton'), 'customNavigate');

  expect(useLogoutOnBack).toHaveBeenCalledWith(true, true);
  expect(back).toHaveBeenCalledWith();
});

describe('calls back without creating a person', () => {
  it('calls callback from useLogoutOnBack', async () => {
    const { getByTestId } = renderWithContext(
      <SetupScreen next={next} isMe={true} />,
      {
        initialState: mockState,
      },
    );

    await flushMicrotasksQueue();

    fireEvent(getByTestId('DeprecatedBackButton'), 'customNavigate');

    expect(useLogoutOnBack).toHaveBeenCalledWith(true, false);
    expect(back).toHaveBeenCalledWith();
  });
});
