import { NativeScrollEvent } from 'react-native';
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { myStepsSelector } from '../../../selectors/steps';
import { PEOPLE_TAB } from '../../../constants';
import { checkForUnreadComments } from '../../../actions/unreadComments';
import { getMySteps, getMyStepsNextPage } from '../../../actions/steps';
import { navToPersonScreen } from '../../../actions/person';
import { openMainMenu } from '../../../utils/common';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../AcceptedStepDetailScreen';
import { Step, StepsState } from '../../../reducers/steps';
import { GROUP_ONBOARDING_TYPES } from '../../Groups/OnboardingCard';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import StepsScreen from '..';

jest.mock('../../../selectors/steps');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/unreadComments');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/person');
jest.mock('../../../utils/common');
jest.mock('../../../components/StepItem', () => 'StepItem');
jest.mock('../../../utils/hooks/useAnalytics');

const steps = ([
  {
    id: 0,
    receiver: { id: '00' },
    organization: { id: '000' },
  },
  {
    id: 1,
    receiver: { id: '11' },
    organization: { id: '111' },
  },
  {
    id: 2,
    receiver: { id: '22' },
    organization: { id: '222' },
  },
  {
    id: 3,
    receiver: { id: '33' },
    organization: { id: '333' },
  },
] as unknown) as Step[];

const initialState = ({
  steps: {
    mine: steps,
    pagination: {
      hasNextPage: true,
      page: 1,
    },
  },
  swipe: {
    groupOnboarding: {
      [GROUP_ONBOARDING_TYPES.steps]: true,
    },
  },
} as unknown) as { steps: StepsState };

const openMainMenuResult = { type: 'open main menu' };
const checkForUnreadCommentsResult = { type: 'check for unread comments' };
const getMyStepsResult = { type: 'get my steps' };
const getMyStepsNextPageResult = { type: 'get my steps next page' };
const navigatePushResult = { type: 'navigate push' };
const navToPersonScreenResult = { type: 'navigate to person screen' };
const navigateToMainTabsResult = { type: 'navigate to main tabs' };

beforeEach(() => {
  ((myStepsSelector as unknown) as jest.Mock).mockReturnValue(steps);
  (openMainMenu as jest.Mock).mockReturnValue(openMainMenuResult);
  (checkForUnreadComments as jest.Mock).mockReturnValue(
    checkForUnreadCommentsResult,
  );
  (getMySteps as jest.Mock).mockReturnValue(getMyStepsResult);
  ((getMyStepsNextPage as unknown) as jest.Mock).mockReturnValue(
    getMyStepsNextPageResult,
  );
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  (navToPersonScreen as jest.Mock).mockReturnValue(navToPersonScreenResult);
  (navigateToMainTabs as jest.Mock).mockReturnValue(navigateToMainTabsResult);
  (useAnalytics as jest.Mock).mockClear();
});

it('renders loading screen correctly', () => {
  ((myStepsSelector as unknown) as jest.Mock).mockReturnValue(null);

  renderWithContext(<StepsScreen />, {
    initialState,
  }).snapshot();
});

it('renders empty screen correctly', () => {
  ((myStepsSelector as unknown) as jest.Mock).mockReturnValue([]);

  renderWithContext(<StepsScreen />, {
    initialState,
  }).snapshot();
});

it('renders screen with steps correctly', () => {
  ((myStepsSelector as unknown) as jest.Mock).mockReturnValue(steps);

  renderWithContext(<StepsScreen />, {
    initialState,
  }).snapshot();
});

it('tracks screen change on mount', () => {
  ((myStepsSelector as unknown) as jest.Mock).mockReturnValue(steps);

  renderWithContext(<StepsScreen />, {
    initialState,
  });

  expect(useAnalytics).toHaveBeenCalledWith('steps', expect.any(Function));
});

describe('handleOpenMainMenu', () => {
  it('should open main menu', () => {
    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState,
    });

    fireEvent.press(getByTestId('menuIcon'));

    expect(openMainMenu).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([openMainMenuResult]);
  });
});

describe('handleRefresh', () => {
  it('refetches steps and checks for unread comments', () => {
    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState,
    });

    fireEvent(getByTestId('stepsList'), 'onRefresh');

    expect(checkForUnreadComments).toHaveBeenCalledWith();
    expect(getMySteps).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([
      checkForUnreadCommentsResult,
      getMyStepsResult,
    ]);
  });
});

describe('handleRowSelect', () => {
  it('should navigate to step detail screen', () => {
    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState,
    });
    const step = steps[0];

    fireEvent(getByTestId('stepItem0'), 'onSelect', step);

    expect(navigatePush).toHaveBeenCalledWith(ACCEPTED_STEP_DETAIL_SCREEN, {
      step,
    });
    expect(store.getActions()).toEqual([navigatePushResult]);
  });
});

describe('handleNavToPerson', () => {
  it('should navigate to person screen', () => {
    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState,
    });
    const step = steps[0];

    fireEvent(getByTestId('stepItem0'), 'onPressName', step);

    expect(navToPersonScreen).toHaveBeenCalledWith(
      step.receiver,
      step.organization,
    );
    expect(store.getActions()).toEqual([navToPersonScreenResult]);
  });
});

describe('handleNavToPeopleTab', () => {
  it('should navigate to person screen', () => {
    ((myStepsSelector as unknown) as jest.Mock).mockReturnValue([]);

    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState,
    });

    fireEvent.press(getByTestId('bottomButton'));

    expect(navigateToMainTabs).toHaveBeenCalledWith(PEOPLE_TAB);
    expect(store.getActions()).toEqual([navigateToMainTabsResult]);
  });
});

describe('handleScroll', () => {
  const nativeEvent = {
    layoutMeasurement: { height: 40, width: 40 },
    contentOffset: { x: 0, y: 21 },
    contentSize: { height: 80, width: 40 },
  } as NativeScrollEvent;

  it('paginates when close to bottom', async () => {
    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState,
    });

    fireEvent(getByTestId('stepsList'), 'onScroll', { nativeEvent });

    await flushMicrotasksQueue();

    expect(getMyStepsNextPage).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([getMyStepsNextPageResult]);
  });

  it('does not paginate if no more steps', async () => {
    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState: {
        ...initialState,
        steps: {
          ...initialState.steps,
          pagination: { hasNextPage: false, page: 1 },
        },
      },
    });

    fireEvent(getByTestId('stepsList'), 'onScroll', { nativeEvent });

    await flushMicrotasksQueue();

    expect(getMyStepsNextPage).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });

  it('does not paginate if not close to bottom', async () => {
    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState,
    });

    fireEvent(getByTestId('stepsList'), 'onScroll', {
      nativeEvent: {
        ...nativeEvent,
        contentOffset: { x: 0, y: 19 },
      },
    });

    await flushMicrotasksQueue();

    expect(getMyStepsNextPage).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
});
