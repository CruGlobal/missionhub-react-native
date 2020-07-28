import { Keyboard } from 'react-native';
import React from 'react';
import { fireEvent, GetByAPI } from 'react-native-testing-library';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import { updatePerson } from '../../../actions/person';
import { useLogoutOnBack } from '../../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { createMyPerson, createPerson } from '../../../actions/onboarding';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';
import { UPDATE_PERSON, CREATE_PERSON } from '../queries';
import SetupScreen from '..';

const personId = '1';
const mockState = {
  onboarding: { currentlyOnboarding: true },
  auth: { person: {} },
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
jest.mock('../../../utils/hooks/useLogoutOnBack');
jest.mock('../../../utils/hooks/useAnalytics');
Keyboard.dismiss = jest.fn();

beforeEach(() => {
  (createMyPerson as jest.Mock).mockReturnValue({
    type: 'createMyPerson',
    id: '1',
  });
  (createPerson as jest.Mock).mockReturnValue({
    type: 'createPerson',
    response: { id: '1' },
  });
  (updatePerson as jest.Mock).mockReturnValue({ type: 'updatePerson' });
  (useLogoutOnBack as jest.Mock).mockReturnValue(back);
});

it('renders isMe version correctly', () => {
  renderWithContext(<SetupScreen next={next} isMe={true} />, {
    initialState: mockState,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['onboarding', 'self name'], {
    sectionType: true,
  });
});

it('renders other person version correctly', () => {
  renderWithContext(<SetupScreen next={next} isMe={false} />, {
    initialState: mockState,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['onboarding', 'contact name'], {
    sectionType: true,
  });
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
      const { getByTestId } = renderWithContext(
        <SetupScreen next={next} isMe={true} />,
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

      expect(createMyPerson).toHaveBeenCalledWith(firstName, lastName);
      expect(next).toHaveBeenCalledWith({ personId });
    });
  });

  describe('create other person', () => {
    it('should create person and call next', async () => {
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
    expect(createMyPerson).not.toHaveBeenCalled();

    expect(next).not.toHaveBeenCalled();
  });
});

it('calls callback from useLogoutOnBack', () => {
  const { getByTestId } = renderWithContext(
    <SetupScreen next={next} isMe={true} />,
    {
      initialState: {
        ...mockState,
        auth: { person: { id: personId } },
      },
    },
  );

  // With the "id" set, press the back button
  fireEvent(getByTestId('DeprecatedBackButton'), 'customNavigate');

  expect(useLogoutOnBack).toHaveBeenCalledWith(true, true);
  expect(back).toHaveBeenCalledWith();
});

describe('calls back without creating a person', () => {
  it('calls callback from useLogoutOnBack', () => {
    const { getByTestId } = renderWithContext(
      <SetupScreen next={next} isMe={true} />,
      {
        initialState: mockState,
      },
    );

    fireEvent(getByTestId('DeprecatedBackButton'), 'customNavigate');

    expect(useLogoutOnBack).toHaveBeenCalledWith(true, false);
    expect(back).toHaveBeenCalledWith();
  });
});
