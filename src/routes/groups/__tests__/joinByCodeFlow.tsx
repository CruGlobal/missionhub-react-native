import React from 'react';

import { JOIN_GROUP_SCREEN } from '../../../containers/Groups/JoinGroupScreen';
import { NOTIFICATION_PRIMER_SCREEN } from '../../../containers/NotificationPrimerScreen';
import { NOTIFICATION_OFF_SCREEN } from '../../../containers/NotificationOffScreen';
import { JoinByCodeFlowScreens } from '../joinByCodeFlow';
import { renderWithContext } from '../../../../testUtils';
import { checkNotifications } from '../../../actions/notifications';
import { joinCommunity } from '../../../actions/organizations';
import { setScrollGroups } from '../../../actions/swipe';
import { navigateToMainTabs } from '../../../actions/navigation';
import { NOTIFICATION_PROMPT_TYPES, COMMUNITIES_TAB } from '../../../constants';

jest.mock('../../../actions/api');
jest.mock('../../../actions/notifications');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/swipe');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/hooks/useAnalytics', () => ({
  useAnalytics: jest.fn(),
}));

const initialState = { auth: { person: { id: '1' } } };

const community = { id: '1', community_code: '123456' };

beforeEach(() => {
  (joinCommunity as jest.Mock).mockReturnValue(() => Promise.resolve());
  (checkNotifications as jest.Mock).mockReturnValue(() => Promise.resolve());
  (setScrollGroups as jest.Mock).mockReturnValue(() => Promise.resolve());
  (navigateToMainTabs as jest.Mock).mockReturnValue(() => Promise.resolve());
});

const renderScreen = (
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  Component: (props: any) => JSX.Element,
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  navParams: any = {},
) => {
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

describe('JoinGroupScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = JoinByCodeFlowScreens[JOIN_GROUP_SCREEN].screen;
    const { store, next } = renderScreen(Component);

    await store.dispatch(next({ community }));

    expect(joinCommunity).toHaveBeenCalledWith(
      community.id,
      community.community_code,
    );
    expect(setScrollGroups).toHaveBeenCalledWith(community.id);
    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.JOIN_COMMUNITY,
      expect.any(Function),
    );
  });
});

describe('NotificationPrimerScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = JoinByCodeFlowScreens[NOTIFICATION_PRIMER_SCREEN];
    const { store, next } = renderScreen(Component);

    await store.dispatch(next());

    expect(navigateToMainTabs).toHaveBeenCalledWith(COMMUNITIES_TAB);
  });
});

describe('NotificationOffScreen next', () => {
  it('should fire required next actions', async () => {
    const Component = JoinByCodeFlowScreens[NOTIFICATION_OFF_SCREEN];
    const { store, next } = renderScreen(Component);

    await store.dispatch(next());

    expect(navigateToMainTabs).toHaveBeenCalledWith(COMMUNITIES_TAB);
  });
});
