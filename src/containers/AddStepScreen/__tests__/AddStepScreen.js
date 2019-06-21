import { Alert } from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import AddStepScreen from '..';

import { renderWithContext } from '../../../../testUtils';
import { CREATE_STEP, STEP_NOTE } from '../../../constants';
import * as common from '../../../utils/common';
import locale from '../../../i18n/locales/en-US';

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

beforeEach(() => {
  next.mockReturnValue(nextResult);
});

const createStepParams = { type: CREATE_STEP };
const journeyParams = { type: 'journey' };
const editJourneyParams = { type: 'editJourney', isEdit: true, text };
const stepNoteParams = { type: STEP_NOTE };
const myStepNoteParams = { type: STEP_NOTE, personId: auth.person.id };
const stepNoteEditParams = { type: STEP_NOTE, isEdit: true, text };
const myStepNoteEditParams = {
  type: STEP_NOTE,
  isEdit: true,
  text,
  personId: auth.person.id,
};
const interactionParams = { type: 'interaction', hideSkip: 'true' };
const interactionWithSkipParams = { type: 'interaction', hideSkip: false };

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

it('renders edit journey correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth },
    navParams: editJourneyParams,
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

  fireEvent.changeText(getByTestId('textInput'), text);

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

  fireEvent.changeText(getByTestId('textInput'), text);

  fireEvent.press(getByTestId('bottomButton'));

  expect(store.getActions()).toEqual([nextResult]);
  expect(next).toHaveBeenCalledWith({
    text,
    stepId: undefined,
    personId: undefined,
    orgId: undefined,
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

  fireEvent.changeText(getByTestId('textInput'), text);

  await fireEvent.press(getByTestId('bottomButton'));

  expect(store.getActions()).toEqual([nextResult]);
  expect(onSetComplete).toHaveBeenCalledWith();
  expect(next).toHaveBeenCalledWith({
    text,
    stepId: undefined,
    personId: undefined,
    orgId: undefined,
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

  fireEvent.changeText(getByTestId('textInput'), text);

  fireEvent.press(getByTestId('skipButton'));

  expect(store.getActions()).toEqual([nextResult]);
  expect(next).toHaveBeenCalledWith({
    text: undefined,
    stepId: undefined,
    personId: undefined,
    orgId: undefined,
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

    fireEvent.changeText(getByTestId('textInput'), twoFiftyFour);

    fireEvent.press(getByTestId('bottomButton'));

    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('displays alert at 255 characters', () => {
    const { getByTestId } = renderWithContext(<AddStepScreen next={next} />, {
      initialState: { auth },
      navParams: createStepParams,
    });

    fireEvent.changeText(getByTestId('textInput'), twoFiftyFive);

    fireEvent.press(getByTestId('bottomButton'));

    expect(Alert.alert).toHaveBeenCalledWith('', makeShorter);
  });
});
