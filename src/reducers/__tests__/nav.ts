// eslint-disable-next-line import/named
import { NavigationActions } from 'react-navigation';

import nav from '../nav';
import { LANDING_SCREEN } from '../../containers/LandingScreen';
import { PERSON_TABS } from '../../containers/PersonScreen/PersonTabs';

jest.mock('../../utils/hooks/useLogoutOnBack', () => ({
  useLogoutOnBack: jest.fn(),
}));

describe('navReducer', () => {
  it('should get state for nav action', () => {
    const newRoute = {
      routeName: PERSON_TABS,
      params: { person: { id: '123', type: 'person' } },
    };

    const state = nav(undefined, NavigationActions.navigate(newRoute));

    expect(state).toEqual(
      expect.objectContaining({
        isTransitioning: true,
        routes: [
          expect.objectContaining({
            routeName: LANDING_SCREEN,
          }),
          expect.objectContaining(newRoute),
        ],
      }),
    );
  });
});
