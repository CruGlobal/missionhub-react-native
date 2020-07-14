import { navigateToMainTabs, navigateReset } from '../navigation';
import { resetToInitialRoute } from '../navigationInit';
import { createThunkStore } from '../../../testUtils';
import { startOnboarding } from '../onboarding';
import { checkNotifications } from '../notifications';
import { LANDING_SCREEN } from '../../containers/LandingScreen';
import { GET_STARTED_ONBOARDING_FLOW } from '../../routes/constants';
import { NOTIFICATION_PROMPT_TYPES } from '../../constants';

jest.mock('../notifications');
jest.mock('../navigation');
jest.mock('../onboarding');
jest.mock('../analytics');

const token =
  'sfhaspofuasdnfpwqnfoiqwofiwqioefpqwnofuoweqfniuqweouiowqefonpqnowfpowqfneqowfenopnqwnfeo';
const myId = '1';

const navigateToMainTabsResult = { type: 'navigateToMainTabs' };
const navigateResetResult = { type: 'navigateReset' };
const startOnboardingResult = { type: 'startOnboarding' };
const checkNotificationsResult = { type: 'checkNotifications' };

beforeEach(() => {
  (navigateToMainTabs as jest.Mock).mockReturnValue(navigateToMainTabsResult);
  (navigateReset as jest.Mock).mockReturnValue(navigateResetResult);
  (startOnboarding as jest.Mock).mockReturnValue(startOnboardingResult);
  (checkNotifications as jest.Mock).mockReturnValue(checkNotificationsResult);
});

describe('resetToInitialRoute', () => {
  describe('unauthenticated user', () => {
    it('should navigate to landing screen', () => {
      const mockStore = createThunkStore({
        auth: {
          token: '',
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockStore.dispatch<any>(resetToInitialRoute());
      expect(navigateReset).toHaveBeenCalledWith(LANDING_SCREEN);
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "app/RELOAD_APP",
          },
          Object {
            "type": "navigateReset",
          },
        ]
      `);
    });
  });

  describe('authenticated user without stage', () => {
    it('should navigate to get started screen', () => {
      const mockStore = createThunkStore({
        auth: {
          token,
          person: {
            id: myId,
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockStore.dispatch<any>(resetToInitialRoute());
      expect(startOnboarding).toHaveBeenCalled();
      expect(navigateReset).toHaveBeenCalledWith(GET_STARTED_ONBOARDING_FLOW);
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "app/RELOAD_APP",
          },
          Object {
            "type": "startOnboarding",
          },
          Object {
            "type": "navigateReset",
          },
        ]
      `);
    });
  });

  describe('authenticated user with stage', () => {
    it('should navigate to main tabs', () => {
      const mockStore = createThunkStore({
        auth: {
          token,
          person: {
            id: myId,
            user: { pathway_stage_id: '3' },
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockStore.dispatch<any>(resetToInitialRoute());
      expect(navigateToMainTabs).toHaveBeenCalled();
      expect(checkNotifications).toHaveBeenCalledWith(
        NOTIFICATION_PROMPT_TYPES.LOGIN,
      );
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "app/RELOAD_APP",
          },
          Object {
            "type": "navigateToMainTabs",
          },
          Object {
            "type": "checkNotifications",
          },
        ]
      `);
    });
    it('should not dispatch reload app if preservePreviousScreen is set', () => {
      const mockStore = createThunkStore({
        auth: {
          token,
          person: {
            id: myId,
            user: { pathway_stage_id: '3' },
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockStore.dispatch<any>(resetToInitialRoute(true));
      expect(navigateToMainTabs).toHaveBeenCalled();
      expect(checkNotifications).toHaveBeenCalledWith(
        NOTIFICATION_PROMPT_TYPES.LOGIN,
      );
      expect(mockStore.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "navigateToMainTabs",
          },
          Object {
            "type": "checkNotifications",
          },
        ]
      `);
    });
  });
});
