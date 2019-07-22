import { Alert } from 'react-native';
import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import {
  JOURNEY,
  EDIT_JOURNEY_STEP,
  EDIT_JOURNEY_ITEM,
  CREATE_STEP,
  STEP_NOTE,
  INTERACTION,
} from '../../../constants';
import locale from '../../../i18n/locales/en-US';

import AddStepScreen from '..';

//fixed in steps-improvement
const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);

jest.mock('react-native-device-info');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/analytics');

const next = jest.fn();
const nextResult = { type: 'next' };
const auth = { person: { id: '123123' } };

const text = 'Comment';
const id = '1112';
const personId = '2221';
const orgId = '333';

beforeEach(() => {
  next.mockReturnValue(nextResult);
});

const baseParams = { id, personId, orgId };
const createStepParams = { ...baseParams, type: CREATE_STEP };
const journeyParams = { ...baseParams, type: JOURNEY };
const editJourneyStepParams = {
  ...baseParams,
  type: EDIT_JOURNEY_STEP,
  isEdit: true,
  text,
};
const editJourneyItemParams = {
  ...baseParams,
  type: EDIT_JOURNEY_ITEM,
  isEdit: true,
  text,
};
const stepNoteParams = { ...baseParams, type: STEP_NOTE };
const myStepNoteParams = {
  ...baseParams,
  type: STEP_NOTE,
  personId: auth.person.id,
};
const stepNoteEditParams = {
  ...baseParams,
  type: STEP_NOTE,
  isEdit: true,
  text,
};
const myStepNoteEditParams = {
  type: STEP_NOTE,
  isEdit: true,
  text,
  personId: auth.person.id,
};
const interactionParams = { type: INTERACTION, hideSkip: 'true' };
const interactionWithSkipParams = { type: INTERACTION, hideSkip: false };

it('renders create step correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth },
    navParams: createStepParams,
  }).snapshot();
});

it('renders journey correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth },
    navParams: journeyParams,
  }).snapshot();
});

it('renders edit journey step correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth },
    navParams: editJourneyStepParams,
  }).snapshot();
});

it('renders edit journey item correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth },
    navParams: editJourneyItemParams,
  }).snapshot();
});

it('renders step note correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth },
    navParams: stepNoteParams,
  }).snapshot();
});

it('renders step note correctly for me', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth },
    navParams: myStepNoteParams,
  }).snapshot();
});

it('renders step note edit correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth },
    navParams: stepNoteEditParams,
  }).snapshot();
});

it('renders step note edit correctly for me', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth },
    navParams: myStepNoteEditParams,
  }).snapshot();
});

it('renders interaction without skip correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth },
    navParams: interactionParams,
  }).snapshot();
});

it('renders interaction with skip correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth },
    navParams: interactionWithSkipParams,
  }).snapshot();
});

it('updates text', () => {
  const { recordSnapshot, getByTestId, diffSnapshot } = renderWithContext(
    <AddStepScreen next={next} />,
    {
      initialState: { auth },
      navParams: stepNoteParams,
    },
  );
  recordSnapshot();

  fireEvent.changeText(getByTestId('stepInput'), text);

  diffSnapshot();
});

it('saves step', () => {
  const { getByTestId, store } = renderWithContext(
    <AddStepScreen next={next} />,
    {
      initialState: { auth },
      navParams: stepNoteParams,
    },
  );

  fireEvent.changeText(getByTestId('stepInput'), text);

  fireEvent.press(getByTestId('bottomButton'));

  expect(store.getActions()).toEqual([nextResult]);
  expect(next).toHaveBeenCalledWith({
    text,
    id,
    type: STEP_NOTE,
    personId,
    orgId,
  });
});

it('saves step with onSetComplete', async () => {
  const onSetComplete = jest.fn();

  const { getByTestId, store } = renderWithContext(
    <AddStepScreen next={next} />,
    {
      initialState: { auth },
      navParams: { ...stepNoteParams, onSetComplete },
    },
  );

  fireEvent.changeText(getByTestId('stepInput'), text);

  await fireEvent.press(getByTestId('bottomButton'));

  expect(store.getActions()).toEqual([nextResult]);
  expect(onSetComplete).toHaveBeenCalledWith();
  expect(next).toHaveBeenCalledWith({
    text,
    id,
    type: STEP_NOTE,
    personId,
    orgId,
  });
});

it('skips save step', () => {
  const { getByTestId, store } = renderWithContext(
    <AddStepScreen next={next} />,
    {
      initialState: { auth },
      navParams: stepNoteParams,
    },
  );

  fireEvent.changeText(getByTestId('stepInput'), text);

  fireEvent.press(getByTestId('skipButton'));

  expect(store.getActions()).toEqual([nextResult]);
  expect(next).toHaveBeenCalledWith({
    text: undefined,
    id,
    type: STEP_NOTE,
    personId,
    orgId,
  });
});

describe('Caps create step at 255 characters', () => {
  Alert.alert = jest.fn();

  const { makeShorter } = locale.addStep;
  const twoFiftyFour =
    '254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254characters254char';
  const twoFiftyFive = `${twoFiftyFour}a`;

  it('Allows 254 characters', () => {
    const { getByTestId } = renderWithContext(<AddStepScreen next={next} />, {
      initialState: { auth },
      navParams: createStepParams,
    });

    fireEvent.changeText(getByTestId('stepInput'), twoFiftyFour);

    fireEvent.press(getByTestId('bottomButton'));

    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('displays alert at 255 characters', () => {
    const { getByTestId } = renderWithContext(<AddStepScreen next={next} />, {
      initialState: { auth },
      navParams: createStepParams,
    });

    fireEvent.changeText(getByTestId('stepInput'), twoFiftyFive);

    fireEvent.press(getByTestId('bottomButton'));

    expect(Alert.alert).toHaveBeenCalledWith('', makeShorter);
  });
});
