import dynamicLinks from '@react-native-firebase/dynamic-links';
import { AnyAction } from 'redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
// eslint-disable-next-line import/named
import { NavigationActions, StackActions } from 'react-navigation';

import { setupFirebaseDynamicLinks } from '../deepLink';
import {
  DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW,
  DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW,
} from '../../routes/constants';

const mockStore = (auth: boolean) =>
  configureStore([thunk])({ auth: { token: !!auth } });

const test = async ({
  auth = false,
  initialLink = false,
  expectedActions,
  deepLinkUrl = 'https://missionhub.com/c/1234567890123456',
}: {
  auth?: boolean;
  initialLink?: boolean;
  expectedActions: object[];
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

  expect(store.getActions()).toEqual(expectedActions);
};

describe('setupFirebaseDynamicLinks', () => {
  describe('unauthenticated', () => {
    it('should handle a link that launched the app ', () =>
      test({
        auth: false,
        initialLink: true,
        expectedActions: [
          StackActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({
                routeName: DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW,
                params: {
                  communityUrlCode: '1234567890123456',
                },
              }),
            ],
          }),
        ],
      }));
    it('should handle a link that was opened while the app was running ', () =>
      test({
        auth: false,
        initialLink: false,
        expectedActions: [
          StackActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({
                routeName: DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW,
                params: {
                  communityUrlCode: '1234567890123456',
                },
              }),
            ],
          }),
        ],
      }));
  });
  describe('authenticated', () => {
    it('should handle a link that launched the app ', () =>
      test({
        auth: true,
        initialLink: true,
        expectedActions: [
          StackActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({
                routeName: DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW,
                params: {
                  communityUrlCode: '1234567890123456',
                },
              }),
            ],
          }),
        ],
      }));
    it('should handle a link that was opened while the app was running', () =>
      test({
        auth: true,
        initialLink: false,
        expectedActions: [
          StackActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({
                routeName: DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW,
                params: {
                  communityUrlCode: '1234567890123456',
                },
              }),
            ],
          }),
        ],
      }));
  });
  describe('unknown links', () => {
    it('should ignore an empty link', () =>
      test({
        deepLinkUrl: '',
        expectedActions: [],
      }));
    it('should ignore a link with the wrong domain', async () => {
      await test({
        deepLinkUrl: 'https://mhub.cc/c/1234567890123456',
        expectedActions: [],
      });
      await test({
        deepLinkUrl: 'https://missionhub.page.link/c/1234567890123456',
        expectedActions: [],
      });
    });
    it('should ignore a link with the wrong path', async () => {
      await test({
        deepLinkUrl: 'https://missionhub.com/s/1234567890123456',
        expectedActions: [],
      });
      await test({
        deepLinkUrl: 'https://missionhub.com/1234567890123456',
        expectedActions: [],
      });
    });
    it('should ignore a link using http', () =>
      test({
        deepLinkUrl: 'http://missionhub.com/c/1234567890123456',
        expectedActions: [],
      }));
    it('should ignore a link with too short of a code', () =>
      test({
        deepLinkUrl: 'https://missionhub.com/c/123456789012345',
        expectedActions: [],
      }));
  });
});
