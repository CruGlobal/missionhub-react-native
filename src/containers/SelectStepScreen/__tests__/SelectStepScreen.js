import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SelectStepScreen from '..';

import { renderShallow } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { buildCustomStep } from '../../../utils/steps';
import { CREATE_STEP } from '../../../constants';
import { ADD_STEP_SCREEN } from '../../AddStepScreen';
import { addStep } from '../../../actions/steps';

jest.mock('../../../utils/steps');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/navigation');

const mockStore = configureStore([thunk]);
let store;

const nextResult = { type: 'next' };
const next = jest.fn(() => nextResult);
const organization = { id: '4234234' };
const contactStageId = '3';
const receiverId = '252342354234';
const createStepTracking = { prop: 'hello world' };
const auth = { person: { id: '89123' } };
const contactName = 'roger';
const customStep = { body: 'some custom step' };
const addStepsResult = { type: 'added steps' };

let screen;
let contact;
let enableBackButton;
let enableSkipButton;

navigatePush.mockImplementation((screen, props) => () => {
  store.dispatch(props.next({ text: customStep.body }));
});
buildCustomStep.mockReturnValue(customStep);
addStep.mockReturnValue(addStepsResult);

beforeEach(() => {
  store = mockStore({ auth });

  screen = renderShallow(
    <SelectStepScreen
      contact={contact}
      contactStageId={contactStageId}
      organization={organization}
      receiverId={receiverId}
      enableBackButton={enableBackButton}
      enableSkipButton={enableSkipButton}
      createStepTracking={createStepTracking}
      contactName={contactName}
      next={next}
    />,
    store,
  );
});

describe('without enableBackButton nor enableSkipButton', () => {
  beforeAll(() => {
    enableBackButton = false;
    enableSkipButton = false;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('with enableBackButton', () => {
  beforeAll(() => {
    enableBackButton = true;
    enableSkipButton = false;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('with enableSkipButton', () => {
  beforeAll(() => {
    enableBackButton = false;
    enableSkipButton = true;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('renderForeground', () => {
  it('renders correctly', () => {
    expect(
      screen
        .childAt(0)
        .props()
        .renderForeground(),
    ).toMatchSnapshot();
  });
});

describe('renderStickyHeader', () => {
  it('renders correctly', () => {
    expect(
      screen
        .childAt(0)
        .props()
        .renderStickyHeader(),
    ).toMatchSnapshot();
  });
});

describe('skip button', () => {
  beforeAll(() => {
    enableBackButton = false;
    enableSkipButton = true;
  });

  beforeEach(() => {
    screen
      .childAt(2)
      .props()
      .onSkip();
  });

  it('calls next', () => {
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('dispatches actions to store', () => {
    expect(store.getActions()).toEqual([nextResult]);
  });
});

describe('BottomButton', () => {
  beforeEach(() => {
    screen
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();
  });

  it('navigates to add step screen', () => {
    expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      trackingObj: createStepTracking,
      next: expect.any(Function),
    });
  });

  it('passes callback to create a custom step', () => {
    expect(addStep).toHaveBeenCalledWith(customStep, receiverId, organization);
    expect(buildCustomStep).toHaveBeenCalledWith(
      customStep.body,
      receiverId === auth.person.id,
    );
    expect(next).toHaveBeenCalled();
  });

  it('dispatches actions to store', () => {
    expect(store.getActions()).toEqual([addStepsResult, nextResult]);
  });
});
