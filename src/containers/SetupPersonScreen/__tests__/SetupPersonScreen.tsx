import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import {
  createPerson,
  updateOnboardingPerson,
  personFirstNameChanged,
  personLastNameChanged,
} from '../../../actions/onboardingProfile';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS } from '../../../constants';

import SetupPersonScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/onboardingProfile');

const myId = '1';
const personId = '2';
const personFirstName = 'John';
const personLastName = 'Smith';

const initialState = {
  personProfile: {
    id: null,
    personFirstName: '',
    personLastName: '',
  },
  auth: {
    person: {
      id: myId,
    },
  },
};

const createPersonResult = {
  type: 'create person',
  response: { id: personId },
};
const updateOnboardingPersonResult = { type: 'update person' };
const trackActionResult = { type: 'tracked action' };
const nextResult = { type: 'next' };
const firstNameChangedResult = { type: 'person first name changed' };
const lastNameChangedResult = { type: 'person last name changed' };

const next = jest.fn();

beforeEach(() => {
  (createPerson as jest.Mock).mockReturnValue(createPersonResult);
  (updateOnboardingPerson as jest.Mock).mockReturnValue(
    updateOnboardingPersonResult,
  );
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
  next.mockReturnValue(nextResult);
  (personFirstNameChanged as jest.Mock).mockReturnValue(firstNameChangedResult);
  (personLastNameChanged as jest.Mock).mockReturnValue(lastNameChangedResult);
});

it('renders correctly', () => {
  renderWithContext(<SetupPersonScreen next={next} />, {
    initialState,
  }).snapshot();
});

it('renders with first and last name', () => {
  renderWithContext(<SetupPersonScreen next={next} />, {
    initialState: {
      ...initialState,
      personProfile: {
        id: personId,
        personFirstName,
        personLastName,
      },
    },
  }).snapshot();
});

describe('setup person screen methods', () => {
  it('saves and creates person, then calls next', async () => {
    const { getByTestId, store } = renderWithContext(
      <SetupPersonScreen next={next} />,
      {
        initialState: {
          ...initialState,
          personProfile: {
            id: null,
            personFirstName,
            personLastName,
          },
        },
      },
    );

    await fireEvent.press(getByTestId('bottomButton'));

    expect(createPerson).toHaveBeenCalledWith(
      personFirstName,
      personLastName,
      myId,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.PERSON_ADDED);
    expect(next).toHaveBeenCalledWith({ skip: false, personId });
    expect(store.getActions()).toEqual([
      createPersonResult,
      trackActionResult,
      nextResult,
    ]);
  });

  it('saves and creates person on submit for last name', async () => {
    const { getByTestId, store } = renderWithContext(
      <SetupPersonScreen next={next} />,
      {
        initialState: {
          ...initialState,
          personProfile: {
            id: null,
            personFirstName,
            personLastName,
          },
        },
      },
    );

    await fireEvent(getByTestId('lastNameInput'), 'onSubmitEditing');

    expect(createPerson).toHaveBeenCalledWith(
      personFirstName,
      personLastName,
      myId,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.PERSON_ADDED);
    expect(next).toHaveBeenCalledWith({ skip: false, personId });
    expect(store.getActions()).toEqual([
      createPersonResult,
      trackActionResult,
      nextResult,
    ]);
  });

  it('saves and updates person, then calls next', async () => {
    const { getByTestId, store } = renderWithContext(
      <SetupPersonScreen next={next} />,
      {
        initialState: {
          ...initialState,
          personProfile: {
            id: personId,
            personFirstName,
            personLastName,
          },
        },
      },
    );

    await fireEvent.press(getByTestId('bottomButton'));

    expect(updateOnboardingPerson).toHaveBeenCalledWith({
      id: personId,
      firstName: personFirstName,
      lastName: personLastName,
    });
    expect(trackActionWithoutData).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith({ skip: false, personId });
    expect(store.getActions()).toEqual([
      updateOnboardingPersonResult,
      nextResult,
    ]);
  });

  it('does not save if no first name', async () => {
    const { getByTestId, store } = renderWithContext(
      <SetupPersonScreen next={next} />,
      {
        initialState: {
          ...initialState,
          personProfile: {
            id: personId,
            personFirstName: '',
            personLastName,
          },
        },
      },
    );

    await fireEvent.press(getByTestId('bottomButton'));

    expect(createPerson).not.toHaveBeenCalled();
    expect(updateOnboardingPerson).not.toHaveBeenCalled();
    expect(trackActionWithoutData).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });

  it('on update person first name', () => {
    const { getByTestId } = renderWithContext(
      <SetupPersonScreen next={next} />,
      {
        initialState,
      },
    );

    fireEvent(getByTestId('firstNameInput'), 'onChangeText', personFirstName);

    expect(personFirstNameChanged).toHaveBeenCalledWith(personFirstName);
  });

  it('on update person last name', () => {
    const { getByTestId } = renderWithContext(
      <SetupPersonScreen next={next} />,
      {
        initialState,
      },
    );

    fireEvent(getByTestId('lastNameInput'), 'onChangeText', personLastName);

    expect(personLastNameChanged).toHaveBeenCalledWith(personLastName);
  });

  it('calls skip', () => {
    const { getByTestId, store } = renderWithContext(
      <SetupPersonScreen next={next} />,
      {
        initialState: {
          ...initialState,
          personProfile: {
            id: personId,
            personFirstName,
            personLastName,
          },
        },
      },
    );

    fireEvent.press(getByTestId('skipButton'));

    expect(next).toHaveBeenCalledWith({ skip: true, personId });
    expect(store.getActions()).toEqual([nextResult]);
  });
});
