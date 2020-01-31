import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { useFocusEffect } from 'react-navigation-hooks';

import { renderWithContext } from '../../../../testUtils';
import { PEOPLE_TAB } from '../../../constants';
import { checkForUnreadComments } from '../../../actions/unreadComments';
import { navToPersonScreen } from '../../../actions/person';
import { openMainMenu } from '../../../utils/common';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../AcceptedStepDetailScreen';
import { GROUP_ONBOARDING_TYPES } from '../../Groups/OnboardingCard';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../../utils/hooks/useAnalytics';

import StepsScreen from '..';

jest.mock('react-navigation-hooks');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/unreadComments');
jest.mock('../../../actions/person');
jest.mock('../../../utils/common');
jest.mock('../../../components/StepItem', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/StepItem'),
  default: 'StepItem',
}));
jest.mock('../../../utils/hooks/useAnalytics');

const initialState = {
  swipe: {
    groupOnboarding: {
      [GROUP_ONBOARDING_TYPES.steps]: true,
    },
  },
};

const openMainMenuResult = { type: 'open main menu' };
const checkForUnreadCommentsResult = { type: 'check for unread comments' };
const navigatePushResult = { type: 'navigate push' };
const navToPersonScreenResult = { type: 'navigate to person screen' };
const navigateToMainTabsResult = { type: 'navigate to main tabs' };

beforeEach(() => {
  (openMainMenu as jest.Mock).mockReturnValue(openMainMenuResult);
  (checkForUnreadComments as jest.Mock).mockReturnValue(
    checkForUnreadCommentsResult,
  );
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  (navToPersonScreen as jest.Mock).mockReturnValue(navToPersonScreenResult);
  (navigateToMainTabs as jest.Mock).mockReturnValue(navigateToMainTabsResult);
});

it('renders loading screen correctly', () => {
  renderWithContext(<StepsScreen />, { initialState }).snapshot();
});

it('renders empty screen correctly', async () => {
  const { snapshot } = renderWithContext(<StepsScreen />, {
    mocks: { Query: () => ({ steps: () => ({ nodes: [] }) }) },
    initialState,
  });

  await flushMicrotasksQueue();

  snapshot();
});

it('renders screen with steps correctly', async () => {
  const { snapshot } = renderWithContext(<StepsScreen />, { initialState });

  await flushMicrotasksQueue();

  snapshot();
});

it('tracks screen change on mount', () => {
  renderWithContext(<StepsScreen />, {
    initialState,
  });

  expect(useAnalytics).toHaveBeenCalledWith(
    'steps',
    ANALYTICS_SCREEN_TYPES.screenWithDrawer,
  );
  expect(useFocusEffect).toHaveBeenLastCalledWith(expect.any(Function));
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
  it('refetches steps and checks for unread comments', async () => {
    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState,
    });

    await flushMicrotasksQueue();

    fireEvent(getByTestId('stepsList'), 'onRefresh');

    expect(checkForUnreadComments).toHaveBeenCalledWith();
    // TODO: no expectations that refetch got called
    expect(store.getActions()).toEqual([checkForUnreadCommentsResult]);
  });
});

describe('handleRowSelect', () => {
  it('should navigate to step detail screen', async () => {
    const { getAllByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState,
    });

    await flushMicrotasksQueue();

    fireEvent(getAllByTestId('stepItem')[0], 'onSelect', { id: '1' });

    expect(navigatePush).toHaveBeenCalledWith(ACCEPTED_STEP_DETAIL_SCREEN, {
      stepId: '1',
    });
    expect(store.getActions()).toEqual([navigatePushResult]);
  });
});

describe('handleNavToPerson', () => {
  it('should navigate to person screen', async () => {
    const { getAllByTestId, store } = renderWithContext(<StepsScreen />, {
      initialState,
    });

    const step = { receiver: { id: '3' }, community: { id: '4' } };

    await flushMicrotasksQueue();

    fireEvent(getAllByTestId('stepItem')[0], 'onPressName', step);

    expect(navToPersonScreen).toHaveBeenCalledWith(
      step.receiver,
      step.community,
    );
    expect(store.getActions()).toEqual([navToPersonScreenResult]);
  });
});

describe('handleNavToPeopleTab', () => {
  it('should navigate to person screen', async () => {
    const { getByTestId, store } = renderWithContext(<StepsScreen />, {
      mocks: { Query: () => ({ steps: () => ({ nodes: [] }) }) },
      initialState,
    });

    await flushMicrotasksQueue();

    fireEvent.press(getByTestId('bottomButton'));

    expect(navigateToMainTabs).toHaveBeenCalledWith(PEOPLE_TAB);
    expect(store.getActions()).toEqual([navigateToMainTabsResult]);
  });
});

describe('stepsList onEndReached', () => {
  it('should paginate when the end of the scroll list is reached', async () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <StepsScreen />,
      {
        mocks: {
          BasePageInfo: () => ({
            endCursor: 'MQ',
            hasNextPage: true,
          }),
        },
        initialState,
      },
    );

    await flushMicrotasksQueue();
    recordSnapshot();

    fireEvent(getByTestId('stepsList'), 'onEndReached');

    await flushMicrotasksQueue();
    diffSnapshot();
  });
});
