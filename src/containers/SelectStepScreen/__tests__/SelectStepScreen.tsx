import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import SelectStepScreen from '..';

jest.mock('../../StepsList', () => 'StepsList');
jest.mock('../../../actions/navigation');

const next = jest.fn(() => () => ({}));
const orgId = '4234234';
const contactStageId = '3';
const personId = '252342354234';
const contactName = 'roger';
const state = {
  auth: { person: { id: '89123' } },
  steps: { suggestedForOthers: {} },
};

let screen: ReturnType<typeof renderWithContext>;
let enableSkipButton = false;

beforeEach(() => {
  screen = renderWithContext(
    <SelectStepScreen
      contactStageId={contactStageId}
      orgId={orgId}
      personId={personId}
      enableSkipButton={enableSkipButton}
      headerText={['Header Text 1', 'Header Text 2']}
      contactName={contactName}
      next={next}
    />,
    {
      initialState: state,
    },
  );
});

describe('without enableSkipButton', () => {
  beforeAll(() => {
    enableSkipButton = false;
  });

  it('renders correctly', () => {
    screen.snapshot();
  });
});

describe('with enableSkipButton', () => {
  beforeAll(() => {
    enableSkipButton = true;
  });

  it('renders correctly', () => {
    screen.snapshot();
  });
});

xdescribe('skip button', () => {
  // Note there are 2 skip buttons (and 2 headers) because of the parallax view
  beforeAll(() => {
    enableSkipButton = true;
  });

  it('first button should call next', () => {
    fireEvent.press(screen.getAllByTestId('skipButton')[0]);

    expect(next).toHaveBeenCalledWith({
      receiverId: personId,
      step: undefined,
      skip: true,
      orgId,
    });
  });

  it('second button should call next', () => {
    fireEvent.press(screen.getAllByTestId('skipButton')[1]);

    expect(next).toHaveBeenCalledWith({
      receiverId: personId,
      step: undefined,
      skip: true,
      orgId,
    });
  });
});
