import dynamicLinks from '@react-native-firebase/dynamic-links';
import { AnyAction } from 'redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { startOnboarding } from '../onboarding';
import { setupFirebaseDynamicLinks } from '../deepLink';

jest.mock('../onboarding');

const mockStore = (auth: boolean) =>
  configureStore([thunk])({ auth: { token: !!auth } });

const startOnboardingResponse = { type: 'start onboarding' };

beforeEach(() => {
  (startOnboarding as jest.Mock).mockReturnValue(startOnboardingResponse);
});

const testDeepLink = async ({
  auth = false,
  initialLink = false,
  deepLinkUrl = 'https://missionhub.com/c/1234567890123456',
}: {
  auth?: boolean;
  initialLink?: boolean;
  deepLinkUrl?: string;
}) => {
  ((dynamicLinks as unknown) as jest.Mock).mockReturnValue({
    getInitialLink: initialLink
      ? jest.fn().mockResolvedValue({ url: deepLinkUrl })
      : jest.fn().mockResolvedValue(null),
    onLink: initialLink
      ? jest.fn()
      : jest.fn().mockImplementation(cb => cb({ url: deepLinkUrl })),
  });

  const store = mockStore(auth);

  await store.dispatch((setupFirebaseDynamicLinks() as unknown) as AnyAction);

  return store.getActions();
};

describe('setupFirebaseDynamicLinks', () => {
  describe('unauthenticated', () => {
    it('should handle a link that launched the app ', async () => {
      expect(
        await testDeepLink({
          auth: false,
          initialLink: true,
        }),
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "start onboarding",
          },
          Object {
            "actions": Array [
              Object {
                "routeName": "nav/LANDING",
                "type": "Navigation/NAVIGATE",
              },
              Object {
                "params": Object {
                  "communityUrlCode": "1234567890123456",
                },
                "routeName": "nav/DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW",
                "type": "Navigation/NAVIGATE",
              },
            ],
            "index": 1,
            "key": null,
            "type": "Navigation/RESET",
          },
        ]
      `);
    });
    it('should handle a link that was opened while the app was running ', async () => {
      expect(
        await testDeepLink({
          auth: false,
          initialLink: false,
        }),
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "start onboarding",
          },
          Object {
            "actions": Array [
              Object {
                "routeName": "nav/LANDING",
                "type": "Navigation/NAVIGATE",
              },
              Object {
                "params": Object {
                  "communityUrlCode": "1234567890123456",
                },
                "routeName": "nav/DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW",
                "type": "Navigation/NAVIGATE",
              },
            ],
            "index": 1,
            "key": null,
            "type": "Navigation/RESET",
          },
        ]
      `);
    });
  });
  describe('authenticated', () => {
    it('should handle a link that launched the app ', async () => {
      expect(
        await testDeepLink({
          auth: true,
          initialLink: true,
        }),
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "actions": Array [
              Object {
                "action": Object {
                  "routeName": "CommunitiesTab",
                  "type": "Navigation/NAVIGATE",
                },
                "routeName": "nav/MAIN_TABS",
                "type": "Navigation/NAVIGATE",
              },
              Object {
                "params": Object {
                  "communityUrlCode": "1234567890123456",
                },
                "routeName": "nav/DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW",
                "type": "Navigation/NAVIGATE",
              },
            ],
            "index": 1,
            "key": null,
            "type": "Navigation/RESET",
          },
        ]
      `);
    });
    it('should handle a link that was opened while the app was running', async () => {
      expect(
        await testDeepLink({
          auth: true,
          initialLink: false,
        }),
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "actions": Array [
              Object {
                "action": Object {
                  "routeName": "CommunitiesTab",
                  "type": "Navigation/NAVIGATE",
                },
                "routeName": "nav/MAIN_TABS",
                "type": "Navigation/NAVIGATE",
              },
              Object {
                "params": Object {
                  "communityUrlCode": "1234567890123456",
                },
                "routeName": "nav/DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW",
                "type": "Navigation/NAVIGATE",
              },
            ],
            "index": 1,
            "key": null,
            "type": "Navigation/RESET",
          },
        ]
      `);
    });
  });
  describe('unknown links', () => {
    it('should ignore an empty link', async () => {
      expect(
        await testDeepLink({
          deepLinkUrl: '',
        }),
      ).toEqual([]);
    });
    it('should ignore a link with the wrong domain', async () => {
      expect(
        await testDeepLink({
          deepLinkUrl: 'https://mhub.cc/c/1234567890123456',
        }),
      ).toEqual([]);
      expect(
        await testDeepLink({
          deepLinkUrl: 'https://missionhub.page.link/c/1234567890123456',
        }),
      ).toEqual([]);
    });
    it('should ignore a link with the wrong path', async () => {
      expect(
        await testDeepLink({
          deepLinkUrl: 'https://missionhub.com/s/1234567890123456',
        }),
      ).toEqual([]);
      expect(
        await testDeepLink({
          deepLinkUrl: 'https://missionhub.com/1234567890123456',
        }),
      ).toEqual([]);
    });
    it('should ignore a link using http', async () => {
      expect(
        await testDeepLink({
          deepLinkUrl: 'http://missionhub.com/c/1234567890123456',
        }),
      ).toEqual([]);
    });
    it('should ignore a link with too short of a code', async () => {
      expect(
        await testDeepLink({
          deepLinkUrl: 'https://missionhub.com/c/123456789012345',
        }),
      ).toEqual([]);
    });
  });
});
