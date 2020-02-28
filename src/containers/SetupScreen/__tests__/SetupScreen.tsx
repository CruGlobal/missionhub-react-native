import { Keyboard } from 'react-native';
import React from 'react';
import { fireEvent, GetByAPI } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { updatePerson } from '../../../actions/person';
import { useLogoutOnBack } from '../../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { createMyPerson, createPerson } from '../../../actions/onboarding';

import SetupScreen from '..';

const personId = '1';
const mockState = {
  onboarding: {},
  auth: { person: {} },
  people: { allByOrg: {} },
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

  expect(useAnalytics).toHaveBeenCalledWith({
    screenName: ['onboarding', 'self name'],
  });
});

it('renders other person version correctly', () => {
  renderWithContext(<SetupScreen next={next} isMe={false} />, {
    initialState: mockState,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith({
    screenName: ['onboarding', 'contact name'],
  });
});

describe('setup screen methods', () => {
  const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
    <SetupScreen next={next} isMe={false} />,
    {
      initialState: mockState,
    },
  );

  it('should update first name', () => {
    recordSnapshot();
    fireEvent(getByTestId('InputFirstName'), 'onChangeText', firstName);
    diffSnapshot();
  });

  it('should update last name', () => {
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
        },
      ).getByTestId;
      await fireEvent(getByTestId('InputFirstName'), 'onChangeText', firstName);
      await fireEvent(getByTestId('InputLastName'), 'onChangeText', lastName);
    });

    it('should update person and call next on save btn press', async () => {
      await fireEvent.press(getByTestId('SaveBottomButton'));

      expect(updatePerson).toHaveBeenCalledWith({
        id: personId,
        firstName,
        lastName,
      });
      expect(next).toHaveBeenCalledWith({ personId });
    });

    it('should update person and call next on last name submit', async () => {
      await fireEvent(getByTestId('InputLastName'), 'onSubmitEditing');

      expect(updatePerson).toHaveBeenCalledWith({
        id: personId,
        firstName,
        lastName,
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
        },
      );
      await fireEvent(getByTestId('InputFirstName'), 'onChangeText', firstName);
      await fireEvent(getByTestId('InputLastName'), 'onChangeText', lastName);

      await fireEvent.press(getByTestId('SaveBottomButton'));

      expect(createPerson).toHaveBeenCalledWith(firstName, lastName);
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

    expect(updatePerson).not.toHaveBeenCalled();
    expect(createMyPerson).not.toHaveBeenCalled();
    expect(createPerson).not.toHaveBeenCalled();
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
  fireEvent(getByTestId('BackButton'), 'customNavigate');

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

    fireEvent(getByTestId('BackButton'), 'customNavigate');

    expect(useLogoutOnBack).toHaveBeenCalledWith(true, false);
    expect(back).toHaveBeenCalledWith();
  });
});
