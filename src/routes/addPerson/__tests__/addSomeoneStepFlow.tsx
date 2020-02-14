import React from 'react';

import { CREATE_STEP, ACTIONS } from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import { ADD_SOMEONE_SCREEN } from '../../../containers/AddSomeoneScreen';
import { SETUP_PERSON_SCREEN } from '../../../containers/SetupScreen';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../../containers/PersonSelectStepScreen';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen';
import { AddSomeoneStepFlowScreens } from '../addSomeoneStepFlow';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import {
  skipAddPersonAndCompleteOnboarding,
  resetPersonAndCompleteOnboarding,
  setOnboardingPersonId,
} from '../../../actions/onboarding';
import {
  trackActionWithoutData,
  resetAppContext,
} from '../../../actions/analytics';
import { createCustomStep, getStepSuggestions } from '../../../actions/steps';
import {
  personSelector,
  contactAssignmentSelector,
} from '../../../selectors/people';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/onboarding');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/steps');
jest.mock('../../../selectors/people');
jest.mock('../../../utils/hooks/useLogoutOnBack', () => ({
  useLogoutOnBack: jest.fn(),
}));
jest.mock('../../../utils/hooks/useAnalytics', () => ({
  useAnalytics: jest.fn(),
}));

const mockMath = Object.create(global.Math);
mockMath.random = () => 0;
global.Math = mockMath;

const myId = '123';
const personId = '321';
const personFirstName = 'Someone';
const person = { id: personId, first_name: personFirstName };
const stageId = '3';
const stage = { id: stageId };
const step = { id: '111' };
const text = 'Step Text';
const contactAssignment = { id: '4', pathway_stage_id: stageId };

const initialState = {
  auth: { person: { id: myId, user: { pathway_stage_id: stageId } } },
  onboarding: { personId },
  people: {
    allByOrg: {
      personal: {
        people: { [personId]: person },
      },
    },
  },
  organizations: { all: [] },
  stages: { stages: [] },
  steps: { suggestedForOthers: { stageId: [] } },
};

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(() => Promise.resolve());
  (navigateToMainTabs as jest.Mock).mockReturnValue(() => Promise.resolve());
  (skipAddPersonAndCompleteOnboarding as jest.Mock).mockReturnValue(() =>
    Promise.resolve(),
  );
  (resetPersonAndCompleteOnboarding as jest.Mock).mockReturnValue(() =>
    Promise.resolve(),
  );
  (trackActionWithoutData as jest.Mock).mockReturnValue(() =>
    Promise.resolve(),
  );
  (resetAppContext as jest.Mock).mockReturnValue(() => Promise.resolve());
  (createCustomStep as jest.Mock).mockReturnValue(() => Promise.resolve());
  (getStepSuggestions as jest.Mock).mockReturnValue(() => Promise.resolve());
  (setOnboardingPersonId as jest.Mock).mockReturnValue(() => Promise.resolve());
  ((personSelector as unknown) as jest.Mock).mockReturnValue(person);
  ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
    contactAssignment,
  );
});

type ScreenName =
  | typeof ADD_SOMEONE_SCREEN
  | typeof SETUP_PERSON_SCREEN
  | typeof SELECT_STAGE_SCREEN
  | typeof PERSON_SELECT_STEP_SCREEN
  | typeof SUGGESTED_STEP_DETAIL_SCREEN
  | typeof ADD_STEP_SCREEN
  | typeof CELEBRATION_SCREEN;

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const renderScreen = (screenName: ScreenName, navParams: any = {}) => {
  const Component = AddSomeoneStepFlowScreens[screenName];

  const { store, getByType, snapshot } = renderWithContext(<Component />, {
    initialState,
    navParams,
  });

  const originalComponent = getByType(Component).children[0];

  if (typeof originalComponent === 'string') {
    throw "Can't access component props";
  }

  const next = originalComponent.props.next;

  return { store, next, snapshot };
};

describe('AddSomeoneScreen next', () => {
  it('renders without skip button correctly', () => {
    renderScreen(ADD_SOMEONE_SCREEN).snapshot();
  });

  it('should fire required next actions without skip', () => {
    const { store, next } = renderScreen(ADD_SOMEONE_SCREEN);

    store.dispatch(next({ skip: false }));

    expect(navigatePush).toHaveBeenCalledWith(SETUP_PERSON_SCREEN);
  });

  it('should fire required next actions with skip', () => {
    const { store, next } = renderScreen(ADD_SOMEONE_SCREEN);

    store.dispatch(next({ skip: true }));

    expect(skipAddPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('SetupPersonScreen next', () => {
  it('renders without skip button correctly', () => {
    renderScreen(SETUP_PERSON_SCREEN).snapshot();
  });

  it('should fire required next actions without skip', () => {
    const { store, next } = renderScreen(SETUP_PERSON_SCREEN);

    store.dispatch(next({ skip: false, personId }));

    expect(setOnboardingPersonId).toHaveBeenCalledWith(personId);
    expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'add person',
      personId,
    });
  });

  it('should fire required next actions with skip', () => {
    const { store, next } = renderScreen(SETUP_PERSON_SCREEN);

    store.dispatch(next({ skip: true }));

    expect(setOnboardingPersonId).not.toHaveBeenCalled();
    expect(skipAddPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('SelectStageScreen', () => {
  it('renders correctly', () => {
    renderScreen(SELECT_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'add person',
      personId,
    }).snapshot();
  });

  it('should fire required next actions', () => {
    const { store, next } = renderScreen(SELECT_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'add person',
      personId,
    });

    store.dispatch(next({ isMe: false }));

    expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
      personId,
    });
  });
});

describe('PersonSelectStepScreen next', () => {
  it('renders correctly', () => {
    renderScreen(PERSON_SELECT_STEP_SCREEN, {
      personId,
    }).snapshot();
  });

  it('should fire required next actions for suggested step', () => {
    const { store, next } = renderScreen(PERSON_SELECT_STEP_SCREEN, {
      personId,
    });

    store.dispatch(next({ personId, step }));

    expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      personId,
    });
  });

  it('should fire required next actions for create step', () => {
    const { store, next } = renderScreen(PERSON_SELECT_STEP_SCREEN, {
      personId,
    });

    store.dispatch(next({ personId, step: undefined }));

    expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      personId,
    });
  });
});

describe('SuggestedStepDetailScreen next', () => {
  it('renders correctly', () => {
    renderScreen(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      personId,
    }).snapshot();
  });

  it('should fire required next actions', () => {
    const { store, next } = renderScreen(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      personId,
    });

    store.dispatch(next({ personId }));

    expect(resetPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('AddStepScreen next', () => {
  it('renders correctly', () => {
    renderScreen(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      personId,
    }).snapshot();
  });

  it('should fire required next actions for other person', () => {
    const { store, next } = renderScreen(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      personId,
    });

    store.dispatch(next({ text, personId }));

    expect(createCustomStep).toHaveBeenCalledWith(text, personId);

    expect(resetPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('CelebrationScreen next', () => {
  it('renders correctly', () => {
    renderScreen(CELEBRATION_SCREEN).snapshot();
  });

  it('should fire required next actions', () => {
    const { store, next } = renderScreen(CELEBRATION_SCREEN);

    store.dispatch(next());

    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ONBOARDING_COMPLETE,
    );
    expect(resetAppContext).toHaveBeenCalledWith();
    expect(navigateToMainTabs).toHaveBeenCalledWith();
  });
});
