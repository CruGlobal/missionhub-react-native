import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { renderWithContext } from '../../../../testUtils';

import SelectStepScreen from '..';

jest.mock('../../StepsList', () => 'StepsList');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/hooks/useAnalytics');

const next = jest.fn(() => () => ({}));
const orgId = '4234234';
const personId = '252342354234';
const me = { id: '89123', first_name: 'roger' };
const state = {
  auth: { person: me },
  people: {
    allByOrg: {
      personal: { id: 'personal', people: { [me.id]: me } },
    },
  },
  steps: { suggestedForOthers: {} },
};

let screen: ReturnType<typeof renderWithContext>;
let enableSkipButton = false;

beforeEach(() => {
  screen = renderWithContext(
    <SelectStepScreen
      orgId={orgId}
      personId={personId}
      enableSkipButton={enableSkipButton}
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

    expect(useAnalytics).toHaveBeenCalledWith('add step');
  });
});

describe('with enableSkipButton', () => {
  beforeAll(() => {
    enableSkipButton = true;
  });

  it('renders correctly', () => {
    screen.snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('add step');
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
