import { NavigationActions } from 'react-navigation';

import nav from '../nav';
import { UNASSIGNED_PERSON_SCREEN } from '../../containers/Groups/UnassignedPersonScreen';
import { LANDING_SCREEN } from '../../containers/LandingScreen';

describe('navReducer', () => {
  it('should get state for nav action', () => {
    const newRoute = {
      routeName: UNASSIGNED_PERSON_SCREEN,
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
