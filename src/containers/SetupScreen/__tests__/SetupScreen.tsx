import { Keyboard } from 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import i18next from 'i18next';

import { renderWithContext } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
import { updatePerson } from '../../../actions/person';
import { logout } from '../../../actions/auth/auth';
import { prompt } from '../../../utils/prompt';
import {
  firstNameChanged,
  lastNameChanged,
  createMyPerson,
} from '../../../actions/onboardingProfile';

import SetupScreen from '..';

const mockState = { profile: {}, auth: { person: {} } };
const nextResult = { type: 'testNext' };
const next = jest.fn().mockReturnValue(nextResult);

const firstName = 'TestFname';
const lastName = 'TestLname';

jest.mock('../../../actions/api');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/auth/auth');
jest.mock('../../../utils/prompt');
jest.mock('../../../actions/onboardingProfile');
jest.mock('../../../actions/person');
Keyboard.dismiss = jest.fn();

beforeEach(() => {
  (prompt as jest.Mock).mockReturnValue(Promise.resolve());
  (navigateBack as jest.Mock).mockReturnValue({ type: 'navigateBack' });
  (logout as jest.Mock).mockReturnValue({ type: 'logout' });
  (firstNameChanged as jest.Mock).mockReturnValue({ type: 'firstNameChanged' });
  (lastNameChanged as jest.Mock).mockReturnValue({ type: 'lastNameChanged' });
  (createMyPerson as jest.Mock).mockReturnValue({
    type: 'createMyPerson',
  });
  (updatePerson as jest.Mock).mockReturnValue({ type: 'updatePerson' });
});

it('renders correctly', () => {
  renderWithContext(<SetupScreen next={next} />, {
    initialState: mockState,
  }).snapshot();
});

describe('setup screen methods', () => {
  const { getByTestId } = renderWithContext(<SetupScreen next={next} />, {
    initialState: mockState,
  });

  it('calls first name changed', () => {
    fireEvent(getByTestId('InputFirstName'), 'onChangeText', firstName);
    expect(firstNameChanged).toHaveBeenCalledWith(firstName);
  });

  it('calls last name changed', () => {
    fireEvent(getByTestId('InputLastName'), 'onChangeText', lastName);
    expect(lastNameChanged).toHaveBeenCalledWith(lastName);
  });
});

describe('saveAndGoToGetStarted', () => {
  const { getByTestId } = renderWithContext(<SetupScreen next={next} />, {
    initialState: { profile: { firstName }, auth: { person: {} } },
  });
  it('creates person and calls next', async () => {
    await fireEvent.press(getByTestId('SaveBottomButton'));

    expect(createMyPerson).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('calls last name submit', async () => {
    await fireEvent(getByTestId('InputLastName'), 'onSubmitEditing');

    expect(createMyPerson).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});

describe('saveAndGoToGetStarted with person id', () => {
  const personId = '1';
  it('updates person and calls next', async () => {
    const { getByTestId } = renderWithContext(<SetupScreen next={next} />, {
      initialState: {
        profile: { firstName },
        auth: { person: { id: personId } },
      },
    });
    await fireEvent.press(getByTestId('SaveBottomButton'));

    expect(updatePerson).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('logs out', async () => {
    (prompt as jest.Mock).mockReturnValue(Promise.resolve(true));
    const { getByTestId } = renderWithContext(<SetupScreen next={next} />, {
      initialState: {
        profile: { firstName },
        auth: { person: { id: personId } },
      },
    });

    // With the "id" set, press the back button
    await fireEvent(getByTestId('BackButton'), 'customNavigate');
    expect(prompt).toHaveBeenCalledWith({
      title: i18next.t('setup:goBackAlert.title'),
      description: i18next.t('setup:goBackAlert.description'),
      actionLabel: i18next.t('setup:goBackAlert.action'),
    });
    expect(logout).toHaveBeenCalled();
  });

  it('cancels logs out', async () => {
    (prompt as jest.Mock).mockReturnValue(Promise.resolve(false));
    const { getByTestId } = renderWithContext(<SetupScreen next={next} />, {
      initialState: {
        profile: { firstName },
        auth: { person: { id: personId } },
      },
    });

    // With the "id" set, press the back button
    await fireEvent(getByTestId('BackButton'), 'customNavigate');
    expect(prompt).toHaveBeenCalledWith({
      title: i18next.t('setup:goBackAlert.title'),
      description: i18next.t('setup:goBackAlert.description'),
      actionLabel: i18next.t('setup:goBackAlert.action'),
    });
    expect(logout).not.toHaveBeenCalled();
  });
});

describe('saveAndGoToGetStarted without first name', () => {
  it('does nothing if first name is not entered', async () => {
    const { getByTestId } = renderWithContext(<SetupScreen next={next} />, {
      initialState: mockState,
    });
    await fireEvent.press(getByTestId('SaveBottomButton'));

    expect(next).not.toHaveBeenCalled();
  });
});

describe('calls back without creating a person', () => {
  it('navigates back', async () => {
    const { getByTestId } = renderWithContext(<SetupScreen next={next} />, {
      initialState: mockState,
    });
    await fireEvent(getByTestId('BackButton'), 'customNavigate');
    expect(navigateBack).toHaveBeenCalled();
  });
});
