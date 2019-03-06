import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SelectStepScreen from '..';

import { renderShallow } from '../../../../testUtils';

jest.mock('../../../utils/steps');

const mockStore = configureStore([thunk]);
let store;

const onComplete = jest.fn();
const organization = { id: '4234234' };
const contactStageId = '3';
const receiverId = '252342354234';
const createStepTracking = { prop: 'hello world' };
const auth = { person: { id: '89123' } };
const contactName = 'roger';

let screen;
let contact;
let enableBackButton;

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({ auth });

  screen = renderShallow(
    <SelectStepScreen
      contact={contact}
      onComplete={onComplete}
      contactStageId={contactStageId}
      organization={organization}
      receiverId={receiverId}
      enableBackButton={enableBackButton}
      createStepTracking={createStepTracking}
      contactName={contactName}
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
