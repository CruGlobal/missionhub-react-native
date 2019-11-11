import { NativeScrollEvent } from 'react-native';
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import theme from '../../../theme';
import { PEOPLE_TAB } from '../../../constants';
import { checkForUnreadComments } from '../../../actions/unreadComments';
import { getMySteps, getMyStepsNextPage } from '../../../actions/steps';
import { navToPersonScreen } from '../../../actions/person';
import { openMainMenu } from '../../../utils/common';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../AcceptedStepDetailScreen';
import { myStepsSelector } from '../../../selectors/steps';
import { GROUP_ONBOARDING_TYPES } from '../../Groups/OnboardingCard';

import StepsScreen from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/unreadComments');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/person');
jest.mock('../../../selectors/steps');
jest.mock('../../../utils/common');
jest.mock('../../TrackTabChange', () => () => null);
jest.mock('../../../components/StepItem', () => 'StepItem');

const steps = [
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
];

const initialState = {
  steps: {
    mine: null,
    pagination: {
      hasNextPage: false,
    },
  },
  swipe: {
    groupOnboarding: {
      [GROUP_ONBOARDING_TYPES.steps]: true,
    },
  },
};
const stateWithNoSteps = {
  ...initialState,
  steps: {
    mine: [],
    pagination: {
      hasNextPage: false,
    },
  },
};
const stateWithSteps = {
  ...initialState,
  steps: {
    mine: steps,
    pagination: {
      hasNextPage: true,
    },
  },
};

const openMainMenuResult = { type: 'open main menu' };
const navigatePushResult = { type: 'navigate push' };
const navigateToMainTabsResult = { type: 'navigate to main tabs' };
const navToPersonScreenResult = { type: 'navigate to person screen' };
const checkForUnreadCommentsResult = { type: 'check for unread comments' };
const getMyStepsResult = { type: 'get steps' };
const getMyStepsNextPageResult = { type: 'get steps next page' };

beforeEach(() => {
  ((openMainMenu as unknown) as jest.Mock).mockReturnValue(openMainMenuResult);
  ((navigatePush as unknown) as jest.Mock).mockReturnValue(navigatePushResult);
  ((navigateToMainTabs as unknown) as jest.Mock).mockReturnValue(
    navigateToMainTabsResult,
  );
  ((navToPersonScreen as unknown) as jest.Mock).mockReturnValue(
    navToPersonScreenResult,
  );
  ((checkForUnreadComments as unknown) as jest.Mock).mockReturnValue(
    checkForUnreadCommentsResult,
  );
  ((getMySteps as unknown) as jest.Mock).mockReturnValue(getMyStepsResult);
  ((getMyStepsNextPage as unknown) as jest.Mock).mockReturnValue(
    getMyStepsNextPageResult,
  );
  ((myStepsSelector as unknown) as jest.Mock).mockImplementation(
    state => state.steps.mine,
  );
});

it('render correctly for loading', () => {
  renderWithContext(<StepsScreen />, {
    initialState,
  }).snapshot();
});

it('renders with no steps', () => {
  renderWithContext(<StepsScreen />, {
    initialState: stateWithNoSteps,
  }).snapshot();
});

it('renders with steps', () => {
  renderWithContext(<StepsScreen />, {
    initialState: stateWithSteps,
  }).snapshot();
});

describe('handleOpenMainMenu', () => {
  const { getByTestId, store } = renderWithContext(<StepsScreen />, {
    initialState,
  });

  fireEvent.press(getByTestId('menuButton'));

  expect(openMainMenu).toHaveBeenCalledWith();
  expect(store.getActions()).toEqual([openMainMenuResult]);
});

describe('handleRowSelect', () => {
  const { getByTestId, store } = renderWithContext(<StepsScreen />, {
    initialState: stateWithSteps,
  });

  fireEvent(getByTestId(`stepItem${steps[0].id}`), 'onSelect', steps[0]);

  expect(navigatePush).toHaveBeenCalledWith(ACCEPTED_STEP_DETAIL_SCREEN, {
    step: steps[0],
  });
  expect(store.getActions()).toEqual([navigatePushResult]);
});

describe('navToPeopleTab', () => {
  const { getByTestId, store } = renderWithContext(<StepsScreen />, {
    initialState: stateWithNoSteps,
  });

  fireEvent.press(getByTestId('bottomButton'));

  expect(navigateToMainTabsResult).toHaveBeenCalledWith(PEOPLE_TAB);
  expect(store.getActions()).toEqual([navigateToMainTabsResult]);
});

describe('handleNavToPerson', () => {
  const { getByTestId, store } = renderWithContext(<StepsScreen />, {
    initialState: stateWithSteps,
  });

  fireEvent(getByTestId(`stepItem${steps[0].id}`), 'onPressName', steps[0]);

  expect(navToPersonScreen).toHaveBeenCalledWith(
    steps[0].receiver,
    steps[0].organization,
  );
  expect(store.getActions()).toEqual([navToPersonScreenResult]);
});

describe('handleRefresh', () => {
  const { getByTestId, store } = renderWithContext(<StepsScreen />, {
    initialState: stateWithSteps,
  });

  fireEvent(getByTestId('refreshControl'), 'onRefresh');

  expect(checkForUnreadComments).toHaveBeenCalledWith();
  expect(getMySteps).toHaveBeenCalledWith();
  expect(store.getActions()).toEqual([
    checkForUnreadCommentsResult,
    getMyStepsResult,
  ]);
});

describe('handleScroll', () => {
  const nativeEvent = {
    layoutMeasurement: { height: theme.fullHeight, width: theme.fullWidth },
    contentOffset: { x: 0, y: theme.fullHeight - 19 },
    contentSize: { height: theme.fullHeight * 2, width: theme.fullWidth },
  } as NativeScrollEvent;

  it('paginates when close to bottom', async () => {
    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState: stateWithSteps,
    });

    fireEvent(getByTestId('scrollView'), 'onScroll', { nativeEvent });

    await flushMicrotasksQueue();

    expect(getMyStepsNextPage).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([getMyStepsNextPageResult]);
  });

  it('does not paginate if no more steps', async () => {
    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState: stateWithNoSteps,
    });

    fireEvent(getByTestId('scrollView'), 'onScroll', { nativeEvent });

    await flushMicrotasksQueue();

    expect(getMyStepsNextPage).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
});
