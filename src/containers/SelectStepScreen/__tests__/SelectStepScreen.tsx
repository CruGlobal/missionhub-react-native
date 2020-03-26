import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import {
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_ASSIGNMENT_TYPE,
} from '../../../constants';
import { renderWithContext } from '../../../../testUtils';

import SelectStepScreen from '..';

jest.mock('../../StepsList', () => 'StepsList');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/hooks/useAnalytics');

const next = jest.fn(() => () => ({}));
const orgId = '4234234';
const me = { id: '89123', first_name: 'roger' };
const personId = '252342354234';
const person = {
  id: personId,
  first_name: 'Test',
  reverse_contact_assignments: [
    {
      assigned_to: { id: me.id },
      organization: { id: orgId },
      pathway_stage_id: '3',
    },
  ],
  organizational_permissions: [{ organization_id: orgId }],
};
const state = {
  auth: { person: me },
  people: {
    allByOrg: {
      personal: {
        id: 'personal',
        people: { [me.id]: me },
      },
      [orgId]: {
        id: orgId,
        people: { [person.id]: person },
      },
    },
  },
  steps: { suggestedForOthers: {} },
  onboarding: { currentlyOnboarding: false },
};

let screen: ReturnType<typeof renderWithContext>;
let enableSkipButton = false;

beforeEach(() => {
  screen = renderWithContext(<SelectStepScreen next={next} />, {
    initialState: state,
    navParams: { personId, orgId, enableSkipButton },
  });
});

describe('without enableSkipButton', () => {
  beforeAll(() => {
    enableSkipButton = false;
  });

  it('renders correctly', () => {
    screen.snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('add step', {
      screenContext: {
        [ANALYTICS_SECTION_TYPE]: '',
        [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
      },
    });
  });
});

describe('with enableSkipButton', () => {
  beforeAll(() => {
    enableSkipButton = true;
  });

  it('renders correctly', () => {
    screen.snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('add step', {
      screenContext: {
        [ANALYTICS_SECTION_TYPE]: '',
        [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
      },
    });
  });
});

describe('in onboarding', () => {
  it('renders correctly', () => {
    renderWithContext(<SelectStepScreen next={next} />, {
      initialState: { ...state, onboarding: { currentlyOnboarding: true } },
      navParams: { personId, orgId, enableSkipButton },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('add step', {
      screenContext: {
        [ANALYTICS_SECTION_TYPE]: 'onboarding',
        [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
      },
    });
  });
});

xdescribe('with explainer open', () => {
  // Note there are 2 icon buttons buttons (and 2 headers) because of the parallax view
  beforeAll(() => {
    enableSkipButton = false;
  });
  it('opens explainer modal', () => {
    fireEvent.press(screen.getAllByTestId('SelectStepExplainerIconButton')[0]);
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
