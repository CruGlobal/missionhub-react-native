import React from 'react';
import { MockStore } from 'redux-mock-store';
import { ReactTestRendererJSON } from 'react-test-renderer';

import { CREATE_STEP } from '../../../constants';
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
import { checkNotifications } from '../../../actions/notifications';
import {
  trackActionWithoutData,
  resetAppContext,
} from '../../../actions/analytics';
import { createCustomStep } from '../../../actions/steps';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/onboarding');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/steps');
jest.mock('../../../utils/hooks/useLogoutOnBack', () => ({
  useLogoutOnBack: jest.fn(),
}));

const myId = '123';
const personId = '321';
const personFirstName = 'Someone';
const stageId = '3';
const stage = { id: stageId };
const step = { id: '111' };
const text = 'Step Text';

const initialState = {
  auth: { person: { id: myId, user: { pathway_stage_id: stageId } } },
  onboarding: { personId },
  people: {
    allByOrg: {
      personal: {
        people: { [personId]: { id: personId, first_name: personFirstName } },
      },
    },
  },
  organizations: { all: [] },
  stages: { stages: [] },
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
  (checkNotifications as jest.Mock).mockReturnValue(() => Promise.resolve());
  (trackActionWithoutData as jest.Mock).mockReturnValue(() =>
    Promise.resolve(),
  );
  (resetAppContext as jest.Mock).mockReturnValue(() => Promise.resolve());
  (createCustomStep as jest.Mock).mockReturnValue(() => Promise.resolve());
  (setOnboardingPersonId as jest.Mock).mockReturnValue(() => Promise.resolve());
});

let mockStore: MockStore;
let next: jest.Mock;
let renderSnapshot: () => ReactTestRendererJSON | null;

describe('AddSomeoneScreen next', () => {
  beforeEach(() => {
    const Component = AddSomeoneStepFlowScreens[ADD_SOMEONE_SCREEN];

    const { store, getByType, snapshot } = renderWithContext(<Component />, {
      initialState,
    });

    mockStore = store;
    // @ts-ignore
    next = getByType(Component).children[0].props.next;
    renderSnapshot = snapshot;
  });

  it('renders without skip button correctly', () => {
    renderSnapshot();
  });

  it('should fire required next actions without skip', async () => {
    await mockStore.dispatch(next({ skip: false }));

    expect(navigatePush).toHaveBeenCalledWith(SETUP_PERSON_SCREEN);
  });

  it('should fire required next actions with skip', async () => {
    await mockStore.dispatch(next({ skip: true }));

    expect(skipAddPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('SetupPersonScreen next', () => {
  beforeEach(() => {
    const Component = AddSomeoneStepFlowScreens[SETUP_PERSON_SCREEN];

    const { store, getByType, snapshot } = renderWithContext(<Component />, {
      initialState,
    });

    mockStore = store;
    // @ts-ignore
    next = getByType(Component).children[0].props.next;
    renderSnapshot = snapshot;
  });

  it('renders without skip button correctly', () => {
    renderSnapshot();
  });

  it('should fire required next actions without skip', async () => {
    await mockStore.dispatch(next({ skip: false, personId }));

    expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'add person',
      personId,
    });
  });

  it('should fire required next actions with skip', async () => {
    await mockStore.dispatch(next({ skip: true }));

    expect(skipAddPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('SelectStageScreen', () => {
  beforeEach(() => {
    const Component = AddSomeoneStepFlowScreens[SELECT_STAGE_SCREEN];

    const { store, getByType, snapshot } = renderWithContext(<Component />, {
      initialState,
      navParams: {
        section: 'onboarding',
        subsection: 'add person',
      },
    });

    mockStore = store;
    // @ts-ignore
    next = getByType(Component).children[0].props.next;
    renderSnapshot = snapshot;
  });

  it('renders correctly', () => {
    renderSnapshot();
  });

  it('should fire required next actions', async () => {
    await mockStore.dispatch(
      next({
        stage: stage,
        personId,
        firstName: personFirstName,
        isMe: false,
      }),
    );

    expect(navigatePush).toHaveBeenCalledWith(PERSON_SELECT_STEP_SCREEN, {
      personId,
    });
  });
});

describe('PersonSelectStepScreen next', () => {
  beforeEach(() => {
    const Component = AddSomeoneStepFlowScreens[PERSON_SELECT_STEP_SCREEN];

    const { store, getByType, snapshot } = renderWithContext(<Component />, {
      initialState,
      navParams: {
        personId,
        orgId: 'personal',
      },
    });

    mockStore = store;
    // @ts-ignore
    next = getByType(Component).children[0].props.next;
    renderSnapshot = snapshot;
  });

  it('renders correctly', () => {
    renderSnapshot();
  });

  it('should fire required next actions for suggested step', async () => {
    await mockStore.dispatch(next({ personId, step }));

    expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      personId,
    });
  });

  it('should fire required next actions for create step', async () => {
    await mockStore.dispatch(next({ personId, step: undefined }));

    expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      personId,
    });
  });
});

describe('SuggestedStepDetailScreen next', () => {
  beforeEach(() => {
    const Component = AddSomeoneStepFlowScreens[SUGGESTED_STEP_DETAIL_SCREEN];

    const { store, getByType, snapshot } = renderWithContext(<Component />, {
      initialState,
      navParams: {
        step,
        personId: myId,
      },
    });

    mockStore = store;
    // @ts-ignore
    next = getByType(Component).children[0].props.next;
    renderSnapshot = snapshot;
  });

  it('renders correctly', () => {
    renderSnapshot();
  });

  it('should fire required next actions for other person', async () => {
    await mockStore.dispatch(next({ contactId: personId }));

    expect(resetPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('AddStepScreen next', () => {
  beforeEach(() => {
    const Component = AddSomeoneStepFlowScreens[ADD_STEP_SCREEN];

    const { store, getByType, snapshot } = renderWithContext(<Component />, {
      initialState,
      navParams: {
        type: CREATE_STEP,
        personId,
      },
    });

    mockStore = store;
    // @ts-ignore
    next = getByType(Component).children[0].props.next;
    renderSnapshot = snapshot;
  });

  it('renders correctly', () => {
    renderSnapshot();
  });

  it('should fire required next actions for other person', async () => {
    await mockStore.dispatch(next({ text, personId }));

    expect(createCustomStep).toHaveBeenCalledWith(text, personId);

    expect(resetPersonAndCompleteOnboarding).toHaveBeenCalledWith();
  });
});

describe('CelebrationScreen next', () => {
  beforeEach(() => {
    const Component = AddSomeoneStepFlowScreens[CELEBRATION_SCREEN];

    const { store, getByType, snapshot } = renderWithContext(<Component />, {
      initialState,
    });

    mockStore = store;
    // @ts-ignore
    next = getByType(Component).children[0].props.next;
    renderSnapshot = snapshot;
  });

  it('renders correctly', () => {
    renderSnapshot();
  });

  it('should fire required next actions', async () => {
    await mockStore.dispatch(next());

    expect(navigateToMainTabs).toHaveBeenCalledWith();
  });
});
