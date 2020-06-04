import { Alert } from 'react-native';
import React from 'react';
import MockDate from 'mockdate';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import {
  EDIT_JOURNEY_STEP,
  EDIT_JOURNEY_ITEM,
  CREATE_STEP,
  STEP_NOTE,
} from '../../../constants';
import locale from '../../../i18n/locales/en-US';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { trackStepAdded } from '../../../actions/analytics';
import * as common from '../../../utils/common';

import AddStepScreen from '..';

//fixed in steps-improvement
const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);

jest.mock('react-native-device-info');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/analytics');
jest.mock('../../../utils/hooks/useAnalytics');

const next = jest.fn();
const nextResult = { type: 'next' };
const trackStepAddedResponse = { type: 'trackStepAdded' };
const auth = { person: { id: '123123' } };
const onboarding = { currentlyOnboarding: false };

const text = 'Comment';
const id = '1112';
const personId = '2221';
const orgId = '333';

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
  next.mockReturnValue(nextResult);
  (trackStepAdded as jest.Mock).mockReturnValue(trackStepAddedResponse);
});

const baseParams = { id, personId, orgId };
const createStepParams = { ...baseParams, type: CREATE_STEP };
const editJourneyStepParams = {
  ...baseParams,
  type: EDIT_JOURNEY_STEP,
  text,
};
const editMyJourneyStepParams = {
  ...baseParams,
  type: EDIT_JOURNEY_STEP,
  text,
  personId: auth.person.id,
};
const editJourneyItemParams = {
  ...baseParams,
  type: EDIT_JOURNEY_ITEM,
  text,
};
const editMyJourneyItemParams = {
  ...baseParams,
  type: EDIT_JOURNEY_ITEM,
  text,
  personId: auth.person.id,
};
const stepNoteParams = { ...baseParams, type: STEP_NOTE };
const myStepNoteParams = {
  ...baseParams,
  type: STEP_NOTE,
  personId: auth.person.id,
};

it('renders create step correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth, onboarding },
    navParams: createStepParams,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['custom step', 'add'], {
    includeSectionType: true,
    includeAssignmentType: true,
  });
});

it('renders create step correctly on android', () => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth, onboarding },
    navParams: createStepParams,
  }).snapshot();
});

it('renders create step in onboarding correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth, onboarding: { currentlyOnboarding: true } },
    navParams: createStepParams,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['custom step', 'add'], {
    includeSectionType: true,
    includeAssignmentType: true,
  });
});

it('renders edit journey step correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth, onboarding },
    navParams: editJourneyStepParams,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['our journey', 'edit'], {
    includeSectionType: true,
    includeAssignmentType: true,
  });
});

it('renders edit journey step for me correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth, onboarding },
    navParams: editMyJourneyStepParams,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['my journey', 'edit'], {
    includeSectionType: true,
    includeAssignmentType: true,
  });
});

it('renders edit journey item correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth, onboarding },
    navParams: editJourneyItemParams,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['our journey', 'edit'], {
    includeSectionType: true,
    includeAssignmentType: true,
  });
});

it('renders edit journey item for me correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth, onboarding },
    navParams: editMyJourneyItemParams,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['my journey', 'edit'], {
    includeSectionType: true,
    includeAssignmentType: true,
  });
});

it('renders step note correctly', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth, onboarding },
    navParams: stepNoteParams,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['step note', 'add'], {
    includeSectionType: true,
    includeAssignmentType: true,
  });
});

it('renders step note correctly for me', () => {
  renderWithContext(<AddStepScreen next={next} />, {
    initialState: { auth, onboarding },
    navParams: myStepNoteParams,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['step note', 'add'], {
    includeSectionType: true,
    includeAssignmentType: true,
  });
});

it('updates text', () => {
  const { recordSnapshot, getByTestId, diffSnapshot } = renderWithContext(
    <AddStepScreen next={next} />,
    {
      initialState: { auth, onboarding },
      navParams: stepNoteParams,
    },
  );
  recordSnapshot();

  fireEvent.changeText(getByTestId('stepInput'), text);

  diffSnapshot();
});

it('saves step', async () => {
  const { getByTestId, store } = renderWithContext(
    <AddStepScreen next={next} />,
    {
      initialState: { auth, onboarding },
      navParams: createStepParams,
    },
  );

  fireEvent.changeText(getByTestId('stepInput'), text);

  fireEvent.press(getByTestId('bottomButton'));
  await flushMicrotasksQueue();

  expect(store.getActions()).toEqual([trackStepAddedResponse, nextResult]);
  expect(next).toHaveBeenCalledWith({
    text,
    id,
    type: CREATE_STEP,
    personId,
    orgId,
  });
  expect(trackStepAdded).toHaveBeenCalledWith({
    __typename: 'Step',
    receiver: {
      __typename: 'Person',
      id: '1',
    },
    stepSuggestion: {
      __typename: 'StepSuggestion',
      id: '2',
      stage: {
        __typename: 'Stage',
        id: '3',
      },
    },
    stepType: 'bond',
  });
});

it('saves step with onSetComplete', async () => {
  const onSetComplete = jest.fn();

  const { getByTestId, store } = renderWithContext(
    <AddStepScreen next={next} />,
    {
      initialState: { auth, onboarding },
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
      initialState: { auth, onboarding },
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
      initialState: { auth, onboarding },
      navParams: createStepParams,
    });

    fireEvent.changeText(getByTestId('stepInput'), twoFiftyFour);

    fireEvent.press(getByTestId('bottomButton'));

    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('displays alert at 255 characters', () => {
    const { getByTestId } = renderWithContext(<AddStepScreen next={next} />, {
      initialState: { auth, onboarding },
      navParams: createStepParams,
    });

    fireEvent.changeText(getByTestId('stepInput'), twoFiftyFive);

    fireEvent.press(getByTestId('bottomButton'));

    expect(Alert.alert).toHaveBeenCalledWith('', makeShorter);
  });
});
