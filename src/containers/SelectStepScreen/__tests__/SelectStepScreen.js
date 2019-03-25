import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SelectStepScreen from '..';

import { renderShallow } from '../../../../testUtils';
import { buildCustomStep } from '../../../utils/steps';
import { addStep } from '../../../actions/steps';

jest.mock('../../../utils/steps');
jest.mock('../../../actions/steps');

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

buildCustomStep.mockReturnValue(customStep);
addStep.mockReturnValue(addStepsResult);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({ auth });

  screen = renderShallow(
    <SelectStepScreen
      contact={contact}
      contactStageId={contactStageId}
      organization={organization}
      receiverId={receiverId}
      enableBackButton={enableBackButton}
      createStepTracking={createStepTracking}
      contactName={contactName}
      next={next}
    />,
    store,
  );
});

describe('without enableBackButton', () => {
  beforeAll(() => {
    enableBackButton = false;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('with enableBackButton', () => {
  beforeAll(() => {
    enableBackButton = true;
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

describe('BottomButton', () => {
  beforeEach(() => {
    screen
      .childAt(1)
      .props()
      .onPress();
  });

  it('executes next', () => {
    expect(next).toHaveBeenCalledWith({
      isAddingCustomStep: true,
      receiverId,
      orgId: organization.id,
    });
    expect(store.getActions()).toEqual([nextResult]);
  });
});
