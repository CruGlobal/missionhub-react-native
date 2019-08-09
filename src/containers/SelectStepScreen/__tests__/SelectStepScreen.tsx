import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import SelectStepScreen from '..';

jest.mock('../../StepsList', () => 'StepsList');
jest.mock('../../../actions/navigation');

const next = jest.fn(() => () => ({}));
const organization = { id: '4234234' };
const contactStageId = '3';
const receiverId = '252342354234';
const contactName = 'roger';
const contact = { id: receiverId };
const state = {
  auth: { person: { id: '89123' } },
  steps: { suggestedForOthers: {} },
};

let screen: ReturnType<typeof renderWithContext>;
let enableBackButton = false;
let enableSkipButton = false;

beforeEach(() => {
  screen = renderWithContext(
    <SelectStepScreen
      contact={contact}
      contactStageId={contactStageId}
      organization={organization}
      receiverId={receiverId}
      enableBackButton={enableBackButton}
      enableSkipButton={enableSkipButton}
      headerText="Header Text"
      contactName={contactName}
      next={next}
    />,
    {
      initialState: state,
    },
  );
});

describe('without enableBackButton nor enableSkipButton', () => {
  beforeAll(() => {
    enableBackButton = false;
    enableSkipButton = false;
  });

  it('renders correctly', () => {
    screen.snapshot();
  });
});

describe('with enableBackButton', () => {
  beforeAll(() => {
    enableBackButton = true;
    enableSkipButton = false;
  });

  it('renders correctly', () => {
    screen.snapshot();
  });
});

describe('with enableSkipButton', () => {
  beforeAll(() => {
    enableBackButton = false;
    enableSkipButton = true;
  });

  it('renders correctly', () => {
    screen.snapshot();
  });
});

describe('skip button', () => {
  beforeAll(() => {
    enableBackButton = false;
    enableSkipButton = true;
  });

  beforeEach(() => {
    fireEvent.press(screen.getByTestId('skipButton'));
  });

  it('calls next', () => {
    expect(next).toHaveBeenCalledWith({
      receiverId,
      step: undefined,
      skip: true,
      orgId: organization.id,
    });
  });
});

describe('BottomButton', () => {
  beforeEach(() => {
    fireEvent.press(screen.getByTestId('bottomButton'));
  });

  it('navigates to add step screen', () => {
    expect(next).toHaveBeenCalledWith({
      receiverId,
      step: undefined,
      skip: false,
      orgId: organization.id,
    });
  });
});
