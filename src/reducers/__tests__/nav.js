import { NavigationActions } from 'react-navigation';

import nav from '../nav';
import { UNASSIGNED_PERSON_SCREEN } from '../../containers/Groups/UnassignedPersonScreen';
import { LOGIN_SCREEN } from '../../containers/LoginScreen';

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
            routeName: LOGIN_SCREEN,
          }),
          expect.objectContaining(newRoute),
        ],
      }),
    );
  });
});
